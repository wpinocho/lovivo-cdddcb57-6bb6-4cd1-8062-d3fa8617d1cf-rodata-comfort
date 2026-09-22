import { calcLinesPricing, type LinesPricingResult, type PricingLookup } from '@/lib/cart-pricing'

/** Why the current PDP selection can't be bought yet. */
export type PurchaseError = 'select_first' | 'select_second' | 'out_of_stock' | null

export interface PurchaseVariant {
  id: string
  price: number
  inventory_quantity?: number | null
  [key: string]: any
}

export interface ResolvePurchaseInput {
  productId: string
  productPrice: number
  hasVariants: boolean
  trackInventory: boolean
  /** Product-level stock when there are no variants */
  productInventory?: number | null
  first?: PurchaseVariant
  second?: PurchaseVariant
  /**
   * 'quantity' → `quantity` units of the first variant (normal selector)
   * 'one'      → exactly ONE unit (pack UI visible, card "1" selected)
   * 'pack'     → first + second (M+L → two lines, M+M → one line ×2)
   */
  mode: 'quantity' | 'one' | 'pack'
  quantity: number
  /** Unit price actually charged for a variant (price experiment aware) */
  unitPriceFor: (variant?: PurchaseVariant) => number
  isAvailable: (variant: PurchaseVariant) => boolean
  /** Units of each variant already in the cart (add-to-cart stock check) */
  cartQtyByVariant?: Record<string, number>
  lookup: PricingLookup
}

export interface PurchaseLine {
  variant?: PurchaseVariant
  quantity: number
  unitPrice: number
}

export interface ResolvedPurchase {
  lines: PurchaseLine[]
  error: PurchaseError
  units: number
  /** Central quote (automatic rules included). Null when the selection is invalid. */
  pricing: LinesPricingResult | null
}

const NO_VARIANT = '__product__'

/**
 * SINGLE source of truth for what a PDP buys. Pure: no React, no cart writes.
 * Every path (add to cart, buy now, sticky, bottom CTA, wallet) consumes it.
 * An invalid selection returns NO lines — never half a pack.
 */
export function resolvePdpPurchase(input: ResolvePurchaseInput): ResolvedPurchase {
  const fail = (error: PurchaseError): ResolvedPurchase => ({ lines: [], error, units: 0, pricing: null })
  const { hasVariants, first, second, mode } = input

  if (hasVariants && !first) return fail('select_first')

  const wanted: { variant?: PurchaseVariant; quantity: number }[] = []
  if (mode === 'pack') {
    if (hasVariants && !second) return fail('select_second')
    if (!hasVariants || first!.id === second!.id) wanted.push({ variant: first, quantity: 2 })
    else wanted.push({ variant: first, quantity: 1 }, { variant: second, quantity: 1 })
  } else {
    const qty = mode === 'one' ? 1 : Math.max(1, Math.floor(input.quantity) || 1)
    wanted.push({ variant: first, quantity: qty })
  }

  // Stock: aggregate per variant + what's already in the cart
  if (input.trackInventory) {
    const need = new Map<string, number>()
    for (const w of wanted) {
      const id = w.variant?.id ?? NO_VARIANT
      need.set(id, (need.get(id) ?? 0) + w.quantity)
    }
    for (const [id, qty] of need) {
      const total = qty + (input.cartQtyByVariant?.[id] ?? 0)
      if (id === NO_VARIANT) {
        const inv = input.productInventory
        if (typeof inv === 'number' && inv < total) return fail('out_of_stock')
        continue
      }
      const v = wanted.find(w => w.variant?.id === id)!.variant!
      if (!input.isAvailable(v)) return fail('out_of_stock')
      if (typeof v.inventory_quantity === 'number' && v.inventory_quantity < total) return fail('out_of_stock')
    }
  }

  const lines: PurchaseLine[] = wanted.map(w => ({ ...w, unitPrice: input.unitPriceFor(w.variant) }))
  const pricing = calcLinesPricing(
    lines.map(l => ({ productId: input.productId, unitPrice: l.unitPrice, quantity: l.quantity })),
    input.lookup,
  )
  return { lines, error: null, units: lines.reduce((s, l) => s + l.quantity, 0), pricing }
}

export { NO_VARIANT as PURCHASE_NO_VARIANT_KEY }