import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { HeadlessProduct, useProductLogic } from "@/components/headless/HeadlessProduct"
import { GiftPDPUI } from "@/pages/ui/GiftPDPUI"
import { useGiftProduct } from "@/hooks/useGiftProduct"
import { useCheckout } from "@/hooks/useCheckout"
import { useSettings } from "@/contexts/SettingsContext"
import { trackAddToCart, tracking } from "@/lib/tracking-utils"
import { SITE_URL } from "@/lib/brand"
import { GIFT_MAIN_PRODUCT_SLUG, buildGiftCartItem, markGiftEligible } from "@/lib/gift-offer"

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

  // Visiting this page = eligible for the gift (GiftCartSync adds it to the cart)
  useEffect(() => { markGiftEligible() }, [])

  useEffect(() => {
    document.title = 'Rodata One + Muñequeras de regalo | RODATA'
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

const GiftLanding = () => (
  <HeadlessProduct slug={GIFT_MAIN_PRODUCT_SLUG}>
    {(logic) => <GiftPDPWithGift logic={logic} />}
  </HeadlessProduct>
)

export default GiftLanding