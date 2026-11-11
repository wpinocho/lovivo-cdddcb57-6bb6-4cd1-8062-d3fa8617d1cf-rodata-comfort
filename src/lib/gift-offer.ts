import type { Product } from '@/lib/supabase'
import type { CartProductItem } from '@/contexts/CartContext'

/**
 * GIFT OFFER — "Rodata One + Muñequeras de regalo" (2026-09-28)
 *
 * The gift is a SEPARATE DB product priced $0 (compare_at = value shown as
 * crossed-out). The backend recomputes prices from the DB, so the charge is
 * really $0 — no client-side price trust involved.
 *
 * Eligibility (fixed 2026-10-07): the gift is ONLY added when the Rodata One is
 * in the cart WHILE the visitor is on the gift PDP. That "claims" the gift for
 * this cart. Gift lines without a claim (e.g. added from the normal PDP) are
 * removed by <GiftCartSync/>. The claim is cleared when the Rodata One leaves
 * the cart (incl. after purchase).
 */
/**
 * PRICE PER URL: the gift PDP sells a DUPLICATE Rodata One (tags `no-listar,buen-fin`).
 * Buen Fin 2026 (2026-11-11): duplicate set to $799 = same as the main PDP; the crossed-out
 * price comes from the original product's compare_at (see GiftLanding). The backend
 * recomputes prices from the DB. The gift is ONLY attached to the duplicate.
 */
export const GIFT_MAIN_PRODUCT_ID = '00155506-c9ce-4e2c-b299-296b948f3254'
export const GIFT_MAIN_PRODUCT_SLUG = 'soporte-lumbar-rodata-one-899'
/** Original $799 PDP — used for canonical + post-promo redirect only. */
export const ORIGINAL_PRODUCT_SLUG = 'soporte-lumbar-rodata-one'

/** Products tagged `no-listar` never appear in home/listings/search. */
export const isListableProduct = (p: object) => {
  const tags = (p as { tags?: unknown }).tags
  return !(Array.isArray(tags) && tags.includes('no-listar'))
}
export const GIFT_PRODUCT_ID = 'f29e9557-14ac-4101-8c97-7c7b427c5e70'
export const GIFT_PRODUCT_SLUG = 'regalo-munequeras-rodata'
export const GIFT_PDP_PATH = '/productos/soporte-lumbar-rodata-one-regalo'

/** Visible name of the gift (value-oriented, not "muñequeras"). */
export const GIFT_NAME = 'Soporte de muñeca para moto'
export const GIFT_NAME_SHORT = 'soporte de muñeca'

/**
 * REAL, FIXED end of the gift promo — same moment for every visitor
 * (never a per-visitor resetting timer). BUEN FIN 2026 (13–17 nov): end of day
 * Tue 17 Nov 2026, CDMX (UTC-6). Previous run (launch gift) ended 31 Oct.
 * Set to null for "no end date" (then copy falls back to "while stock lasts").
 */
export const GIFT_OFFER_ENDS_AT: string | null = '2026-11-17T23:59:59-06:00'

/** Current reason for the gift (copy). Buen Fin 2026 — official logo + QR (participation requirement). */
export const GIFT_PROMO_NAME = 'Buen Fin'
const SB_MSG_RENDER = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'
/** Official Buen Fin 2026 calendar logo, background removed (transparent, 400×373). */
export const BUEN_FIN_LOGO = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/object/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf/buen-fin-2026-logo.webp'
export const BUEN_FIN_QR = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/object/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1/1794427528866-38mnaj0p5ig.webp'

export const giftOfferEndMs = () => (GIFT_OFFER_ENDS_AT ? new Date(GIFT_OFFER_ENDS_AT).getTime() : null)

export function isGiftOfferActive(now = Date.now()): boolean {
  const end = giftOfferEndMs()
  return end === null || now <= end
}

/** "9 de oct" (short) / "9 de octubre" (long), in CDMX time. */
export function formatGiftEndDate(long = false): string | null {
  if (!GIFT_OFFER_ENDS_AT) return null
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    timeZone: 'America/Mexico_City',
  }).format(new Date(GIFT_OFFER_ENDS_AT)).replace('.', '')
}

const CLAIM_KEY = 'rodata-gift-claimed'
const LEGACY_FLAG_KEY = 'rodata-gift-eligible'
const CLAIM_TTL_MS = 7 * 24 * 60 * 60 * 1000

export const isGiftProductId = (id?: string | null) => !!id && id === GIFT_PRODUCT_ID

export const isGiftPdpPath = (pathname: string) => pathname.replace(/\/+$/, '') === GIFT_PDP_PATH

/** Called only from the gift PDP when the gift goes into the cart/checkout. */
export function markGiftClaimed() {
  try {
    localStorage.setItem(CLAIM_KEY, String(Date.now()))
    localStorage.removeItem(LEGACY_FLAG_KEY)
  } catch {}
}

export function clearGiftClaim() {
  try {
    localStorage.removeItem(CLAIM_KEY)
    localStorage.removeItem(LEGACY_FLAG_KEY)
  } catch {}
}

export function isGiftClaimed(): boolean {
  try {
    if (!isGiftOfferActive()) return false
    const ts = Number(localStorage.getItem(CLAIM_KEY))
    return !!ts && Date.now() - ts < CLAIM_TTL_MS
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