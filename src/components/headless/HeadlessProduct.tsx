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
import { useRef } from 'react'

/** Why the current PDP selection can't be bought yet. */
export type PurchaseError = 'select_first' | 'select_second' | 'out_of_stock' | null

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
  
  const { addItem, getTotalItems } = useCart()
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
  const isPack = packQuantity === 2 && !!packOffer

  /**
   * SINGLE source of truth for what gets bought. Every path (add to cart, buy
   * now, sticky, bottom CTA, express checkout) consumes this.
   *   1 × M       → [M ×1]
   *   2 × M + L   → [M ×1, L ×1]
   *   2 × M + M   → [M ×2]
   * Incomplete selection → no items (never half a pack).
   */
  const buildPurchase = (): { items: CartProductItem[]; error: PurchaseError; quotedTotal: number; units: number } => {
    const empty = (error: PurchaseError) => ({ items: [], error, quotedTotal: 0, units: 0 })
    if (!product) return empty('select_first')
    const vars = (product as any).variants
    const hasVars = Array.isArray(vars) && vars.length > 0
    const first = hasVars ? getMatchingVariant() : undefined
    if (hasVars && !first) return empty('select_first')

    const experimentMeta = selectedPlan ? null : priceExperiment
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

    let items: CartProductItem[]
    if (!isPack) {
      items = [makeItem(first, quantity)]
    } else {
      const second = hasVars ? secondVariant : undefined
      if (hasVars && !second) return empty('select_second')
      if (!hasVars || first!.id === second!.id) {
        if (hasVars && !hasStockFor(first, 2)) return empty('out_of_stock')
        items = [makeItem(first, 2)]
      } else {
        if (!hasStockFor(first, 1) || !hasStockFor(second, 1)) return empty('out_of_stock')
        items = [makeItem(first, 1), makeItem(second, 1)]
      }
    }

    const quote = calcLinesPricing(items.map(i => ({
      productId: product.id,
      unitPrice: i.resolvedUnitPrice ?? i.variant?.price ?? product.price,
      quantity: i.quantity,
    })), pricingLookup)
    return { items, error: null, quotedTotal: quote.total, units: items.reduce((s, i) => s + i.quantity, 0) }
  }
  const purchase = buildPurchase()

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
    
    if (purchase.error) {
      reportPurchaseError(purchase.error)
      return
    }
    setPurchaseError(null)
    actionLockRef.current = true
    setTimeout(() => { actionLockRef.current = false }, 800)
    const variantToAdd = purchase.items[0]?.variant
    
    for (const item of purchase.items) {
      for (let i = 0; i < item.quantity; i++) {
        const added = addItem(product, item.variant, selectedPlan || undefined, undefined, experimentCartOptions)
        if (!added) {
          toast({
            title: "Solo un plan de suscripción por carrito",
            description: "Elimina la suscripción actual para agregar una diferente.",
            variant: "destructive"
          })
          return
        }
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
      value: isPack ? purchase.quotedTotal : currentPrice * quantity,
      currency: tracking.getCurrencyFromSettings(currencyCode),
      num_items: isPack ? purchase.units : quantity
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
      value: isPack ? purchase.quotedTotal : currentP * quantity,
      currency: tracking.getCurrencyFromSettings(currencyCode),
      num_items: isPack ? purchase.units : quantity
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
    purchaseError,
    purchaseLocked,
    setPurchaseLocked,

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