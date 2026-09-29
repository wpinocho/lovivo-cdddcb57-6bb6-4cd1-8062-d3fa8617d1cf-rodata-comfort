import type { Product } from '@/lib/supabase'
import type { CartProductItem } from '@/contexts/CartContext'

/**
 * GIFT OFFER — "Rodata One + Muñequeras de regalo" (2026-09-28)
 *
 * The gift is a SEPARATE DB product priced $0 (compare_at = value shown as
 * crossed-out). The backend recomputes prices from the DB, so the charge is
 * really $0 — no client-side price trust involved.
 *
 * Eligibility: visiting the gift PDP sets a 7-day flag. While the flag is on,
 * <GiftCartSync/> keeps exactly ONE gift line whenever a Rodata One is in the
 * cart, and removes it when the Rodata One leaves.
 */
export const GIFT_MAIN_PRODUCT_ID = '400026a2-c277-407c-abbb-d1683f415120'
export const GIFT_MAIN_PRODUCT_SLUG = 'soporte-lumbar-rodata-one'
export const GIFT_PRODUCT_ID = 'f29e9557-14ac-4101-8c97-7c7b427c5e70'
export const GIFT_PRODUCT_SLUG = 'regalo-munequeras-rodata'
export const GIFT_PDP_PATH = '/productos/soporte-lumbar-rodata-one-regalo'

const FLAG_KEY = 'rodata-gift-eligible'
const FLAG_TTL_MS = 7 * 24 * 60 * 60 * 1000

export const isGiftProductId = (id?: string | null) => !!id && id === GIFT_PRODUCT_ID

export function markGiftEligible() {
  try { localStorage.setItem(FLAG_KEY, String(Date.now())) } catch {}
}

export function isGiftEligible(): boolean {
  try {
    const ts = Number(localStorage.getItem(FLAG_KEY))
    return !!ts && Date.now() - ts < FLAG_TTL_MS
  } catch {
    return false
  }
}

/** Same key the cart reducer uses for a no-variant product line. */
export const buildGiftCartItem = (product: Product): CartProductItem => ({
  type: 'product',
  key: product.id,
  product,
  quantity: 1,
})