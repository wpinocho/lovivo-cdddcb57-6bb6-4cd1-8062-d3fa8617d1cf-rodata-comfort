import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useGiftProduct } from '@/hooks/useGiftProduct'
import {
  GIFT_MAIN_PRODUCT_ID,
  clearGiftClaim,
  isGiftClaimed,
  isGiftOfferActive,
  isGiftPdpPath,
  isGiftProductId,
  markGiftClaimed,
} from '@/lib/gift-offer'

/**
 * Keeps the gift line consistent in the cart (mounted once in App):
 * - gift is ONLY added while the visitor is on the gift PDP with a Rodata One in cart
 * - gift line without a claim (e.g. from the normal PDP) → removed
 * - no Rodata One in cart → gift removed + claim cleared
 * - gift quantity always 1 (one gift per order)
 */
export const GiftCartSync = () => {
  const { state, addItem, removeItem, updateQuantity } = useCart()
  const { pathname } = useLocation()
  const onGiftPage = isGiftPdpPath(pathname) && isGiftOfferActive()
  const giftLine = state.items.find(i => i.type === 'product' && isGiftProductId(i.product?.id))
  const gift = useGiftProduct(onGiftPage || !!giftLine)

  useEffect(() => {
    const hasMain = state.items.some(i => i.type === 'product' && i.product?.id === GIFT_MAIN_PRODUCT_ID)

    if (!hasMain) {
      if (giftLine) removeItem(giftLine.key)
      if (isGiftClaimed()) clearGiftClaim()
      return
    }

    if (giftLine) {
      if (onGiftPage && !isGiftClaimed()) { markGiftClaimed(); return }
      if (!isGiftClaimed()) { removeItem(giftLine.key); return }
      if (giftLine.quantity !== 1) updateQuantity(giftLine.key, 1)
      return
    }

    if (onGiftPage && gift) {
      markGiftClaimed()
      addItem(gift)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items, gift, onGiftPage])

  return null
}