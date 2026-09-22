import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, type Product as ProductType, type SellingPlan } from '@/lib/supabase'
import { STORE_ID } from '@/lib/config'
import { useCart } from '@/contexts/CartContext'
import type { CartProductItem } from '@/contexts/CartContext'
import { useCartUI } from '@/components/CartProvider'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/contexts/SettingsContext'
import { trackViewContent, trackAddToCart, tracking } from '@/lib/tracking-utils'
import { isVariantAvailable } from '@/lib/utils'
import { useSellingPlans } from '@/hooks/useSellingPlans'
import { calcSubscriptionPrice } from '@/lib/subscription-utils'
import { useCheckout } from '@/hooks/useCheckout'
import { usePriceExperiment } from '@/hooks/usePriceExperiment'
import { usePriceRules } from '@/hooks/usePriceRules'
import { calcLinesPricing, isSameProductBogo } from '@/lib/cart-pricing'
import { resolvePdpPurchase, PURCHASE_NO_VARIANT_KEY, type PurchaseError } from '@/lib/pdp-purchase'
import { useRef } from 'react'

export type { PurchaseError } from '@/lib/pdp-purchase'

/**
 * FORBIDDEN HEADLESS COMPONENT - HeadlessProduct
 * 
 * Este componente contiene toda la lógica de negocio de la página de producto:
 * - Fetching de producto desde Supabase
 * - Manejo de variantes y opciones
 * - Cálculos de precios e inventario
 * - Lógica de imágenes y thumbnails
 * - Funciones de agregar al carrito con tracking
 * - Estados de carga y navegación
 */

export const useProductLogic = (slugOverride?: string) => {
  const { slug: paramSlug } = useParams<{ slug: string }>()
  const slug = slugOverride ?? paramSlug
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<SellingPlan | null>(null)
  
  const { addItem, getTotalItems, state: cartState } = useCart()
  const { openCart } = useCartUI()
  const { toast } = useToast()
  const { formatMoney, currencyCode } = useSettings()
  const { plans: sellingPlans } = useSellingPlans(product?.id)
  const { checkoutWithItems } = useCheckout()
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  // ── Pack offer state (UI experiment exp-cdddcb57-pdp-second-belt-offer) ──
  // packQuantity only becomes 2 when the test UI renders the selector AND a
  // real shared BOGO rule quotes a discount. Control never touches it.
  const [packQuantity, setPackQuantityState] = useState<1 | 2>(1)
  // True while the PDP renders the pack selector (test variant). Then the
  // normal quantity selector is hidden and card "1" means EXACTLY one unit.
  const [packUiActive, setPackUiActive] = useState(false)
  // Second size starts EMPTY on purpose — never copied from the first one.
  const [secondSelected, setSecondSelected] = useState<Record<string, string>>({})
  const [purchaseError, setPurchaseError] = useState<PurchaseError>(null)
  // Locked while a wallet sheet is processing: amounts must not change mid-auth
  const [purchaseLocked, setPurchaseLocked] = useState(false)
  const actionLockRef = useRef(false)
  const { getVolumeRulesForProduct, getBogoRulesForProduct, loading: priceRulesLoading } = usePriceRules()
  const pricingLookup = {
    getVolumeRules: (pid: string) => getVolumeRulesForProduct(pid),
    getBogoRules: (pid: string) => getBogoRulesForProduct(pid),
  }

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .eq('store_id', STORE_ID)
        .single()

      if (error || !data) {
        setNotFound(true)
        return
      }

      setProduct(data)
      // Set first image as selected
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0])
      }
      
      // Track ViewContent event with proper formatting
      trackViewContent({
        products: [tracking.createTrackingProduct({
          id: data.id,
          title: data.title,
          price: data.price,
          category: 'product'
        })],
        value: data.price,
        currency: tracking.getCurrencyFromSettings(currencyCode)
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  // Auto-select first available value for each option
  useEffect(() => {
    if (!product) return
    
    const options = (product as any).options
    const variants = (product as any).variants
    const hasVariants = Array.isArray(variants) && variants.length > 0
    
    if (!hasVariants || !options?.length) return
    
    const newSelected = { ...selected }
    let hasChanges = false
    
    for (const opt of options) {
      if (!selected[opt.name]) {
        const availableValues = opt.values.filter((val: string) => isOptionValueAvailable(opt.name, val))
        
        if (availableValues.length > 0) {
          newSelected[opt.name] = availableValues[0]
          hasChanges = true
        }
      }
    }
    
    if (hasChanges) {
      setSelected(newSelected)
    }
  }, [product, selected])

  const isOptionValueAvailable = (optName: string, value: string) => {
    if (!product) return false
    
    const variants = (product as any).variants
    if (!Array.isArray(variants)) return true
    
    const anyProduct = product as any
    if (anyProduct.track_inventory === false) return true
    
    return variants.some((v: any) => {
      const ov = v.options || {}
      
      if (ov[optName] !== value) return false
      
      for (const [selectedOptName, selectedValue] of Object.entries(selected)) {
        if (selectedOptName !== optName && ov[selectedOptName] !== selectedValue) {
          return false
        }
      }
      
      return isVariantAvailable(v)
    })
  }

  const findVariantFor = (sel: Record<string, string>) => {
    if (!product) return undefined
    
    const options = (product as any).options
    const variants = (product as any).variants
    const hasVariants = Array.isArray(variants) && variants.length > 0
    
    if (!hasVariants || !options?.length) return undefined
    
    for (const opt of options) {
      if (!sel[opt.name]) return undefined
    }
    
    return variants?.find((v: any) => {
      const ov = v.options || {}
      return options.every((opt: any) => ov[opt.name] === sel[opt.name])
    })
  }

  const getMatchingVariant = () => findVariantFor(selected)

  /** Stock check for N units of one variant (M + M needs 2 of M). */
  const hasStockFor = (v: any, qty: number) => {
    if (!product || !v) return false
    if ((product as any).track_inventory === false) return true
    if (!isVariantAvailable(v)) return false
    return qty <= 1 || typeof v.inventory_quantity !== 'number' || v.inventory_quantity >= qty
  }

  const getCurrentPrice = () => {
    const matchingVariant = getMatchingVariant()
    if (matchingVariant) return matchingVariant.price
    
    const variants = (product as any)?.variants
    if (Array.isArray(variants) && variants.length > 0) {
      return Math.min(...variants.map((v: any) => v.price))
    }
    
    return product?.price || 0
  }

  const getCurrentCompareAt = () => {
    const matchingVariant = getMatchingVariant()
    return matchingVariant?.compare_at_price ?? product?.compare_at_price
  }

  const getCurrentImage = () => {
    const matchingVariant = getMatchingVariant()
    return matchingVariant?.image || selectedImage || product?.images?.[0] || ''
  }

  // Helper para obtener imágenes a mostrar según variante seleccionada
  const getDisplayImages = (): string[] => {
    if (!product) return []
    
    const productImages = product.images || []
    const variants = (product as any).variants as any[] | undefined
    const matchingVariant = getMatchingVariant()
    
    // Recolectar TODAS las image_urls de TODAS las variantes
    const allVariantImageUrls = new Set<string>()
    if (Array.isArray(variants)) {
      variants.forEach((v: any) => {
        if (v.image_urls && Array.isArray(v.image_urls)) {
          v.image_urls.forEach((url: string) => allVariantImageUrls.add(url))
        }
      })
    }
    
    // Encontrar imágenes generales (las que NO están en ninguna variante)
    const generalImages = productImages.filter((img: string) => !allVariantImageUrls.has(img))
    
    // Si hay variante seleccionada con image_urls
    if (matchingVariant?.image_urls && matchingVariant.image_urls.length > 0) {
      // Combinar: imágenes de variante + imágenes generales
      return [...matchingVariant.image_urls, ...generalImages]
    }
    
    // Sin variante seleccionada o variante sin image_urls: mostrar todas las del producto
    return productImages
  }

  const isInStock = () => {
    if (!product) return false
    
    const anyProduct = product as any
    if (anyProduct.track_inventory === false) return true
    
    const variants = anyProduct.variants
    if (Array.isArray(variants) && variants.length > 0) {
      const matchingVariant = getMatchingVariant()
      if (matchingVariant) {
        return isVariantAvailable(matchingVariant)
      }
      return variants.some((v: any) => isVariantAvailable(v))
    }
    
    return (anyProduct.inventory_quantity ?? 0) > 0
  }

  // ── Price experiment (A/B) ──
  // Selling plans opt out entirely. With no active manifest for this product
  // this returns the catalog price synchronously and issues zero requests.
  const catalogPrice = getCurrentPrice()
  const {
    resolvedPrice,
    isReady: isPriceReady,
    experiment: priceExperiment,
  } = usePriceExperiment({
    productId: product?.id,
    variantId: getMatchingVariant()?.id,
    catalogPrice,
    disabled: !!selectedPlan,
  })
  const currentPrice = resolvedPrice
  const isPriceResolving = !isPriceReady

  /** Cart options that keep the displayed price and its experiment together. */
  const experimentCartOptions = priceExperiment
    ? {
        resolvedUnitPrice: currentPrice,
        experiment: {
          id: priceExperiment.id,
          key: priceExperiment.key,
          variant: priceExperiment.variant,
        },
      }
    : {}

  // ── Pack quote: derived from the REAL shared BOGO rule via central pricing ──
  // Null (→ no pack UI, no promise) when: no active same_products BOGO for this
  // product, rules still loading, a selling plan or price experiment is in play,
  // or volume+bogo would stack (unverified combination).
  const secondVariant = findVariantFor(secondSelected)
  const packOffer = (() => {
    if (!product || selectedPlan || priceExperiment || isPriceResolving || priceRulesLoading) return null
    const hasBogo = getBogoRulesForProduct(product.id).some(r => isSameProductBogo(r.conditions as any))
    if (!hasBogo) return null
    const secondUnit = (secondVariant ?? getMatchingVariant())?.price ?? currentPrice
    const q = calcLinesPricing([
      { productId: product.id, unitPrice: currentPrice, quantity: 1 },
      { productId: product.id, unitPrice: secondUnit, quantity: 1 },
    ], pricingLookup)
    if (q.hasStackingConflict) {
      console.warn('[pack-offer] volume + bogo rules overlap on this product — pack hidden')
      return null
    }
    if (q.bogoDiscount <= 0) return null
    return {
      ruleId: q.bogoRuleId,
      singlePrice: currentPrice,
      firstPrice: currentPrice,
      secondPrice: Math.round((secondUnit - q.bogoDiscount) * 100) / 100,
      listTotal: q.listSubtotal,
      total: q.total,
    }
  })()
  const isPack = packUiActive && packQuantity === 2 && !!packOffer

  /**
   * SINGLE source of truth for what gets bought (see `resolvePdpPurchase`).
   * Every path (add to cart, buy now, sticky, bottom CTA, wallet) consumes it.
   *   control / fail-safe  → [M ×quantity]
   *   pack UI, card "1"    → [M ×1]   (ignores the hidden quantity state)
   *   pack UI, M + L       → [M ×1, L ×1]
   *   pack UI, M + M       → [M ×2]
   * The quote uses the SAME central pricing for control and test.
   */
  const experimentMeta = selectedPlan ? null : priceExperiment
  const resolveSelection = (cartQtyByVariant?: Record<string, number>) => {
    if (!product) return { items: [] as CartProductItem[], error: 'select_first' as PurchaseError, quotedTotal: 0, units: 0, pricing: null }
    const vars = (product as any).variants
    const hasVars = Array.isArray(vars) && vars.length > 0
    const makeItem = (variant: any, qty: number): CartProductItem => ({
      // El sufijo del experimento evita fusionar assignments distintos
      key: `${product.id}${variant ? `:${variant.id}` : ''}${selectedPlan ? `:${selectedPlan.id}` : ''}${experimentMeta ? `:exp-${experimentMeta.key}-${experimentMeta.variant}` : ''}`,
      type: 'product' as const,
      product,
      variant,
      sellingPlan: selectedPlan || undefined,
      quantity: qty,
      ...(experimentMeta ? {
        resolvedUnitPrice: currentPrice,
        experiment: { id: experimentMeta.id, key: experimentMeta.key, variant: experimentMeta.variant },
      } : {}),
    })

    const r = resolvePdpPurchase({
      productId: product.id,
      productPrice: product.price,
      hasVariants: hasVars,
      trackInventory: (product as any).track_inventory !== false,
      productInventory: (product as any).inventory_quantity,
      first: hasVars ? getMatchingVariant() : undefined,
      second: hasVars ? secondVariant : undefined,
      mode: isPack ? 'pack' : packUiActive ? 'one' : 'quantity',
      quantity,
      // Same unit price the cart will use (price experiment / subscription aware)
      unitPriceFor: (v) => {
        const base = experimentMeta ? currentPrice : ((v?.price ?? product.price) || 0)
        return selectedPlan ? calcSubscriptionPrice(base, selectedPlan) : base
      },
      isAvailable: (v) => isVariantAvailable(v),
      cartQtyByVariant,
      lookup: pricingLookup,
    })
    return {
      items: r.lines.map(l => makeItem(l.variant, l.quantity)),
      error: r.error,
      quotedTotal: r.pricing?.total ?? 0,
      units: r.units,
      pricing: r.pricing,
    }
  }
  const purchase = resolveSelection()

  /** Units of this product already in the cart, per variant. */
  const getCartQtyByVariant = () => {
    const m: Record<string, number> = {}
    for (const it of cartState.items) {
      if (it.type !== 'product') continue
      const p = it as CartProductItem
      if (p.isBogoGift || p.product?.id !== product?.id) continue
      const k = p.variant?.id ?? PURCHASE_NO_VARIANT_KEY
      m[k] = (m[k] ?? 0) + p.quantity
    }
    return m
  }

  const reportPurchaseError = (error: PurchaseError) => {
    setPurchaseError(error)
    const copy: Record<string, { title: string; description: string }> = {
      // Same copy as the pre-experiment PDP (control must not change)
      select_first: { title: 'Selecciona opciones', description: 'Elige una variante disponible.' },
      select_second: { title: 'Falta la talla de la segunda faja', description: 'Elige la talla de la segunda faja para continuar.' },
      out_of_stock: { title: 'Sin stock suficiente', description: 'No hay unidades suficientes de esa talla. Prueba con otra.' },
    }
    if (error) toast(copy[error])
  }

  const handleAddToCart = () => {
    if (!product) return
    if (isPriceResolving || purchaseLocked || isBuyingNow) return
    if (actionLockRef.current) return
    
    // Stock check includes units already in the cart
    const sel = resolveSelection(getCartQtyByVariant())
    if (sel.error) {
      reportPurchaseError(sel.error)
      return
    }
    // addItem's only failure mode is a selling-plan conflict: check it BEFORE
    // writing anything, so a pack is never added by halves.
    const planConflict = !!selectedPlan && cartState.items.some(i =>
      i.type === 'product' && !!(i as CartProductItem).sellingPlan?.id && (i as CartProductItem).sellingPlan!.id !== selectedPlan.id)
    if (planConflict) {
      toast({
        title: "Solo un plan de suscripción por carrito",
        description: "Elimina la suscripción actual para agregar una diferente.",
        variant: "destructive"
      })
      return
    }
    setPurchaseError(null)
    actionLockRef.current = true
    setTimeout(() => { actionLockRef.current = false }, 800)
    const variantToAdd = sel.items[0]?.variant
    
    for (const item of sel.items) {
      for (let i = 0; i < item.quantity; i++) {
        addItem(product, item.variant, selectedPlan || undefined, undefined, experimentCartOptions)
      }
    }
    
    // Track AddToCart event with proper formatting
    trackAddToCart({
      products: [tracking.createTrackingProduct({
        id: product.id,
        title: product.title,
        price: currentPrice,
        category: 'product',
        variant: variantToAdd
      })],
      value: sel.quotedTotal,
      currency: tracking.getCurrencyFromSettings(currencyCode),
      num_items: sel.units
    })
    
    setTimeout(() => openCart(), 300)
  }

  const handleBuyNow = async () => {
    if (!product) return
    if (isPriceResolving || purchaseLocked || isBuyingNow) return
    // Double-click guard: state updates are async, the ref is not
    if (actionLockRef.current) return
    
    if (purchase.error) {
      reportPurchaseError(purchase.error)
      return
    }
    setPurchaseError(null)
    actionLockRef.current = true
    const variantToAdd = purchase.items[0]?.variant
    
    const currentP = currentPrice
    trackAddToCart({
      products: [tracking.createTrackingProduct({
        id: product.id,
        title: product.title,
        price: currentP,
        category: 'product',
        variant: variantToAdd
      })],
      value: purchase.quotedTotal,
      currency: tracking.getCurrencyFromSettings(currencyCode),
      num_items: purchase.units
    })

    setIsBuyingNow(true)
    try {
      // Items construidos explícitamente por buildPurchase() — SIN leer el
      // carrito de React (evita la race condition de setState)
      const buyNowItems: CartProductItem[] = purchase.items

      // Crear la orden directamente y guardar en localStorage
      // Cuando /pagar carga, useCheckoutState ya tiene orderId + checkoutToken
      await checkoutWithItems(buyNowItems, { currencyCode })
      navigate('/pagar')
    } catch (error) {
      // El error ya fue mostrado con toast dentro de checkoutWithItems
      console.error('Buy Now error:', error)
    } finally {
      setIsBuyingNow(false)
      actionLockRef.current = false
    }
  }

  /** Wallet pre-check: same validation as the CTAs, without side effects on success. */
  const ensurePurchaseValid = (): boolean => {
    if (!product || isPriceResolving || purchaseLocked || isBuyingNow || actionLockRef.current) return false
    if (purchase.error) {
      reportPurchaseError(purchase.error)
      return false
    }
    setPurchaseError(null)
    return true
  }

  const setPackQuantity = (q: 1 | 2) => {
    if (purchaseLocked) return
    setPackQuantityState(q)
    setPurchaseError(null)
  }

  const handleSecondOptionSelect = (optName: string, value: string) => {
    if (purchaseLocked) return
    setSecondSelected(prev => ({ ...prev, [optName]: value }))
    setPurchaseError(null)
  }

  /** Second-size availability; same size as the first needs 2 units in stock. */
  const isSecondOptionValueAvailable = (optName: string, value: string) => {
    const v = findVariantFor({ ...secondSelected, [optName]: value })
    if (!v) return isOptionValueAvailable(optName, value)
    const first = getMatchingVariant()
    return hasStockFor(v, first && first.id === v.id ? 2 : 1)
  }

  const handleNavigateBack = () => navigate(-1)
  const handleNavigateToCart = () => navigate('/carrito')

  const handleOptionSelect = (optName: string, value: string) => {
    if (purchaseLocked) return
    setSelected(prev => ({ ...prev, [optName]: value }))
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (purchaseLocked) return
    setQuantity(Math.max(1, newQuantity))
  }

  // Calculated values
  const options = product ? (product as any).options : undefined
  const variants = product ? (product as any).variants : undefined
  const hasVariants = Array.isArray(variants) && variants.length > 0
  const currentCompareAt = getCurrentCompareAt()
  const currentImage = getCurrentImage()
  const inStock = isInStock()
  const matchingVariant = getMatchingVariant()
  const displayImages = getDisplayImages()
  
  const discountPercentage = currentCompareAt && currentPrice && currentCompareAt > currentPrice 
    ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
    : undefined

  const subscriptionPrice = selectedPlan ? calcSubscriptionPrice(currentPrice, selectedPlan) : null

  return {
    // State
    product,
    loading,
    notFound,
    selectedImage,
    selected,
    quantity,
    
    // Calculated values
    options,
    variants,
    hasVariants,
    currentPrice,
    currentCompareAt,
    currentImage,
    inStock,
    matchingVariant,
    discountPercentage,
    displayImages,

    // Price experiment (A/B)
    isPriceResolving,
    priceExperiment,
    experimentCartOptions,
    
    // Selling plans (subscriptions)
    sellingPlans,
    selectedPlan,
    setSelectedPlan,
    subscriptionPrice,
    
    // Cart info
    totalItems: getTotalItems(),
    
    // Buy Now state
    isBuyingNow,

    // Pack offer (UI experiment) — single purchase source of truth
    packOffer,
    packQuantity,
    setPackQuantity,
    secondSelected,
    secondVariant,
    handleSecondOptionSelect,
    isSecondOptionValueAvailable,
    selectedPurchaseItems: purchase.items,
    purchaseQuote: purchase.quotedTotal,
    purchasePricing: purchase.pricing,
    purchaseUnits: purchase.units,
    purchaseError,
    purchaseLocked,
    setPurchaseLocked,
    ensurePurchaseValid,
    packUiActive,
    setPackUiActive,

    // Actions
    handleAddToCart,
    handleBuyNow,
    handleNavigateBack,
    handleNavigateToCart,
    handleOptionSelect,
    handleQuantityChange,
    setSelectedImage,
    isOptionValueAvailable,
    
    // Utilities
    formatMoney,
    
    // States for UI
    canAddToCart: inStock && (!hasVariants || !!matchingVariant) && !isPriceResolving,
    
    // Events for additional features
    onAddToCartSuccess: () => {
      console.log('Product added to cart from product page - ready for additional features')
    }
  }
}

interface HeadlessProductProps {
  children: (logic: ReturnType<typeof useProductLogic>) => React.ReactNode
  /** Fuerza un slug concreto (landings dedicadas). Si se omite, usa el param de la URL. */
  slug?: string
}

export const HeadlessProduct = ({ children, slug }: HeadlessProductProps) => {
  const productLogic = useProductLogic(slug)
  
  return <>{children(productLogic)}</>
}