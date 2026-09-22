import type { PriceRule, BogoConditions } from '@/lib/supabase'
import type { CartItem, CartProductItem } from '@/contexts/CartContext'
import { calcVolumeDiscount } from '@/lib/price-rule-utils'
import { calcSubscriptionPrice } from '@/lib/subscription-utils'

/**
 * Central storefront pricing for product lines + automatic price rules.
 *
 * Single source of truth used by the PDP pack quote AND the cart totals, so the
 * number a visitor sees before buying is computed exactly like the cart.
 * The backend (`checkout-create`) remains the authority for the charge; this
 * mirrors its documented semantics:
 *  - volume: per line (existing storefront behaviour)
 *  - bogo same_products: ONE pool per product across ALL its variants
 *    (M + L qualifies like M + M), cheapest units discounted,
 *    capped by `max_uses_per_order`
 *  - different rule types stack (volume + bogo) → flagged as a conflict so the
 *    PDP never advertises a combo it hasn't verified
 */

/** Backend writes `same_products`; older storefront types used `same_product`. */
export const isSameProductBogo = (c?: Partial<BogoConditions> | null): boolean => {
  const mode = (c as any)?.bogo_mode
  return mode === 'same_products' || mode === 'same_product'
}

export interface PricingLine {
  productId: string
  unitPrice: number
  quantity: number
}

export interface PricingLookup {
  getVolumeRules: (productId: string) => PriceRule[]
  getBogoRules: (productId: string) => PriceRule[]
}

export interface LinesPricingResult {
  /** unitPrice × qty, no automatic rules */
  listSubtotal: number
  /** after per-line volume discounts, before BOGO */
  subtotal: number
  bogoDiscount: number
  bogoRuleId: string | null
  total: number
  /** a product has volume AND bogo rules → stacking not verified */
  hasStackingConflict: boolean
}

const round2 = (n: number) => Math.round(n * 100) / 100

/** Discount granted by one same_products BOGO rule over a pool of unit prices. */
export function calcSameProductBogoDiscount(unitPrices: number[], cond: BogoConditions): number {
  const buy = Math.max(1, Math.floor(Number(cond.buy_quantity) || 0))
  const get = Math.max(1, Math.floor(Number(cond.get_quantity) || 0))
  const pct = Math.min(100, Math.max(0, Number(cond.get_discount_percentage) || 0))
  if (!pct || unitPrices.length < buy + get) return 0

  let uses = Math.floor(unitPrices.length / (buy + get))
  const maxUses = Number(cond.max_uses_per_order)
  if (maxUses > 0) uses = Math.min(uses, maxUses)
  if (uses <= 0) return 0

  const cheapestFirst = [...unitPrices].sort((a, b) => a - b)
  const discounted = cheapestFirst.slice(0, uses * get)
  return round2(discounted.reduce((s, p) => s + p * (pct / 100), 0))
}

export function calcLinesPricing(lines: PricingLine[], lookup: PricingLookup): LinesPricingResult {
  let listSubtotal = 0
  let subtotal = 0
  let hasStackingConflict = false
  const pools = new Map<string, number[]>()

  for (const line of lines) {
    if (!line || line.quantity <= 0) continue
    listSubtotal += line.unitPrice * line.quantity
    const volume = calcVolumeDiscount(line.unitPrice, line.quantity, lookup.getVolumeRules(line.productId))
    const unit = volume ? volume.discountedPrice : line.unitPrice
    subtotal += unit * line.quantity
    const pool = pools.get(line.productId) ?? []
    for (let i = 0; i < line.quantity; i++) pool.push(unit)
    pools.set(line.productId, pool)
  }

  let bogoDiscount = 0
  let bogoRuleId: string | null = null
  for (const [productId, pool] of pools) {
    const rules = lookup.getBogoRules(productId).filter(r => isSameProductBogo(r.conditions as BogoConditions))
    if (!rules.length) continue
    if (lookup.getVolumeRules(productId).length > 0) hasStackingConflict = true
    // Same-type rules don't stack: best one wins
    let best = 0
    let bestId: string | null = null
    for (const rule of rules) {
      const d = calcSameProductBogoDiscount(pool, rule.conditions as BogoConditions)
      if (d > best) { best = d; bestId = rule.id }
    }
    if (best > 0) {
      bogoDiscount += best
      bogoRuleId = bogoRuleId ?? bestId
    }
  }

  return {
    listSubtotal: round2(listSubtotal),
    subtotal: round2(subtotal),
    bogoDiscount: round2(bogoDiscount),
    bogoRuleId,
    total: round2(subtotal - bogoDiscount),
    hasStackingConflict,
  }
}

/** Base unit price of a cart product line, exactly as the cart shows it. */
export const cartLineUnitPrice = (item: CartProductItem): number => {
  const base = (item.resolvedUnitPrice ?? item.variant?.price ?? item.product.price) || 0
  return item.sellingPlan ? calcSubscriptionPrice(base, item.sellingPlan) : base
}

/** Cart total with bundles + product lines + automatic rules. */
export function calcCartPricing(items: CartItem[], lookup: PricingLookup): LinesPricingResult {
  let bundlesTotal = 0
  const lines: PricingLine[] = []
  for (const item of items) {
    if (item.type === 'bundle') {
      bundlesTotal += item.bundle.bundle_price * item.quantity
      continue
    }
    const p = item as CartProductItem
    if (p.isBogoGift) continue
    lines.push({ productId: p.product.id, unitPrice: cartLineUnitPrice(p), quantity: p.quantity })
  }
  const r = calcLinesPricing(lines, lookup)
  return {
    ...r,
    listSubtotal: round2(r.listSubtotal + bundlesTotal),
    subtotal: round2(r.subtotal + bundlesTotal),
    total: round2(r.total + bundlesTotal),
  }
}