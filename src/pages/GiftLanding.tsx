import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { HeadlessProduct, useProductLogic } from "@/components/headless/HeadlessProduct"
import { GiftPDPUI } from "@/pages/ui/GiftPDPUI"
import { useGiftProduct } from "@/hooks/useGiftProduct"
import { useCheckout } from "@/hooks/useCheckout"
import { useSettings } from "@/contexts/SettingsContext"
import { trackAddToCart, tracking } from "@/lib/tracking-utils"
import { SITE_URL } from "@/lib/brand"
import { GIFT_MAIN_PRODUCT_SLUG, buildGiftCartItem, isGiftOfferActive, markGiftClaimed } from "@/lib/gift-offer"

/**
 * ROUTE — /productos/soporte-lumbar-rodata-one-regalo
 * Rodata One + par de Muñequeras de regalo ($0 line in cart/checkout).
 * Does NOT touch the original PDP. noindex + canonical to the main PDP.
 */
const GiftPDPWithGift = ({ logic }: { logic: ReturnType<typeof useProductLogic> }) => {
  const gift = useGiftProduct(true)
  const { checkoutWithItems } = useCheckout()
  const { currencyCode } = useSettings()
  const navigate = useNavigate()
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    document.title = 'Rodata One + Soporte de muñeca de regalo | RODATA'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, follow'
    document.head.appendChild(robots)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const prevHref = canonical?.href
    if (canonical) canonical.href = `${SITE_URL}/productos/${GIFT_MAIN_PRODUCT_SLUG}`
    return () => {
      robots.remove()
      if (canonical && prevHref) canonical.href = prevHref
    }
  }, [])

  const giftItem = gift ? buildGiftCartItem(gift) : null
  const purchaseItems = giftItem && logic.selectedPurchaseItems.length > 0
    ? [...logic.selectedPurchaseItems, giftItem]
    : logic.selectedPurchaseItems

  /** Buy now: same validation as the original, gift line appended. */
  const handleBuyNow = async () => {
    if (!giftItem) return logic.handleBuyNow()
    if (buying || !logic.ensurePurchaseValid() || !logic.product) return
    setBuying(true)
    logic.setPurchaseLocked(true)
    markGiftClaimed()
    trackAddToCart({
      products: [tracking.createTrackingProduct({
        id: logic.product.id,
        title: logic.product.title,
        price: logic.currentPrice,
        category: 'product',
        variant: logic.selectedPurchaseItems[0]?.variant,
      })],
      value: logic.purchaseQuote,
      currency: tracking.getCurrencyFromSettings(currencyCode),
      num_items: logic.purchaseUnits,
    })
    try {
      await checkoutWithItems(purchaseItems, { currencyCode })
      navigate('/pagar')
    } catch (error) {
      console.error('Gift buy now error:', error)
    } finally {
      setBuying(false)
      logic.setPurchaseLocked(false)
    }
  }

  return (
    <GiftPDPUI
      gift={gift}
      logic={{
        ...logic,
        handleBuyNow,
        isBuyingNow: logic.isBuyingNow || buying,
        selectedPurchaseItems: purchaseItems,
      }}
    />
  )
}

/** After the real end date the promo URL sends visitors (and ads) to the normal PDP. */
const GiftLanding = () => {
  if (!isGiftOfferActive()) return <Navigate to={`/productos/${GIFT_MAIN_PRODUCT_SLUG}`} replace />
  return (
    <HeadlessProduct slug={GIFT_MAIN_PRODUCT_SLUG}>
      {(logic) => <GiftPDPWithGift logic={logic} />}
    </HeadlessProduct>
  )
}

export default GiftLanding