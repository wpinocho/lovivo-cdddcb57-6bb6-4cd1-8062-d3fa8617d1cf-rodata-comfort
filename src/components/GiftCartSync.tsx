import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useGiftProduct } from '@/hooks/useGiftProduct'
import { GIFT_MAIN_PRODUCT_ID, isGiftEligible, isGiftProductId } from '@/lib/gift-offer'

/**
 * Keeps the gift line consistent in the cart (mounted once in App):
 * - no Rodata One in cart → gift removed
 * - gift quantity always 1 (one gift per order)
 * - eligible visitor + Rodata One in cart + no gift → gift added
 */
export const GiftCartSync = () => {
  const { state, addItem, removeItem, updateQuantity } = useCart()
  const eligible = isGiftEligible()
  const giftLine = state.items.find(i => i.type === 'product' && isGiftProductId(i.product?.id))
  const gift = useGiftProduct(eligible || !!giftLine)

  useEffect(() => {
    const hasMain = state.items.some(i => i.type === 'product' && i.product?.id === GIFT_MAIN_PRODUCT_ID)
    if (giftLine && !hasMain) { removeItem(giftLine.key); return }
    if (giftLine && giftLine.quantity !== 1) { updateQuantity(giftLine.key, 1); return }
    if (!giftLine && hasMain && gift && eligible) addItem(gift)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items, gift, eligible])

  return null
}