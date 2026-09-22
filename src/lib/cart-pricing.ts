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
  /** Human label for the global promo row (derived from the rule, never hardcoded) */
  bogoLabel: string | null
  total: number
  /** a product has volume AND bogo rules → stacking not verified */
  hasStackingConflict: boolean
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

/** Label for the single global promo row, e.g. "Segunda unidad al 50%". */
export function bogoRuleLabel(cond: BogoConditions): string {
  const buy = Number(cond.buy_quantity) || 1
  const get = Number(cond.get_quantity) || 1
  const pct = Number(cond.get_discount_percentage) || 0
  if (buy === 1 && get === 1) return pct >= 100 ? 'Segunda unidad gratis' : `Segunda unidad al ${pct}%`
  return pct >= 100 ? `Promoción ${buy}+${get} gratis` : `Promoción ${buy}+${get} al ${pct}%`
}

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
    // Round PER LINE (cents) so the cart breakdown sums exactly to the total
    listSubtotal += round2(line.unitPrice * line.quantity)
    const volume = calcVolumeDiscount(line.unitPrice, line.quantity, lookup.getVolumeRules(line.productId))
    const unit = volume ? volume.discountedPrice : line.unitPrice
    subtotal += round2(unit * line.quantity)
    const pool = pools.get(line.productId) ?? []
    for (let i = 0; i < line.quantity; i++) pool.push(unit)
    pools.set(line.productId, pool)
  }

  let bogoDiscount = 0
  let bogoRuleId: string | null = null
  let bogoLabel: string | null = null
  for (const [productId, pool] of pools) {
    const rules = lookup.getBogoRules(productId).filter(r => isSameProductBogo(r.conditions as BogoConditions))
    if (!rules.length) continue
    if (lookup.getVolumeRules(productId).length > 0) hasStackingConflict = true
    // Same-type rules don't stack: best one wins
    let best = 0
    let bestRule: PriceRule | null = null
    for (const rule of rules) {
      const d = calcSameProductBogoDiscount(pool, rule.conditions as BogoConditions)
      if (d > best) { best = d; bestRule = rule }
    }
    if (best > 0 && bestRule) {
      bogoDiscount += best
      bogoRuleId = bogoRuleId ?? bestRule.id
      bogoLabel = bogoLabel ?? bogoRuleLabel(bestRule.conditions as BogoConditions)
    }
  }

  return {
    listSubtotal: round2(listSubtotal),
    subtotal: round2(subtotal),
    bogoDiscount: round2(bogoDiscount),
    bogoRuleId,
    bogoLabel,
    total: round2(round2(subtotal) - round2(bogoDiscount)),
    hasStackingConflict,
  }
}

/** Base unit price of a cart product line, exactly as the cart shows it. */
export const cartLineUnitPrice = (item: CartProductItem): number => {
  const base = (item.resolvedUnitPrice ?? item.variant?.price ?? item.product.price) || 0
  return item.sellingPlan ? calcSubscriptionPrice(base, item.sellingPlan) : base
}

export interface CartLineDisplay {
  /** What the line row shows: base (+ subscription, + per-line volume). NEVER BOGO. */
  lineTotal: number
  /** Struck-through amount when a per-line volume discount applies */
  originalLineTotal: number | null
  savingsLabel: string | null
}

/**
 * Line row for the cart. BOGO is intentionally NOT distributed per line: it is
 * shown once as a global row (`bogoLabel` / `bogoDiscount`). Sum of lineTotal
 * over product lines === calcCartPricing().subtotal (same per-line rounding).
 */
export function cartLineDisplay(item: CartProductItem, lookup: PricingLookup): CartLineDisplay {
  const unit = cartLineUnitPrice(item)
  const volume = calcVolumeDiscount(unit, item.quantity, lookup.getVolumeRules(item.product.id))
  if (!volume) return { lineTotal: round2(unit * item.quantity), originalLineTotal: null, savingsLabel: null }
  return {
    lineTotal: round2(volume.discountedPrice * item.quantity),
    originalLineTotal: round2(unit * item.quantity),
    savingsLabel: volume.savingsLabel,
  }
}

/** Cart total with bundles + product lines + automatic rules. */
export function calcCartPricing(items: CartItem[], lookup: PricingLookup): LinesPricingResult {
  let bundlesTotal = 0
  const lines: PricingLine[] = []
  for (const item of items) {
    if (item.type === 'bundle') {
      bundlesTotal += round2(item.bundle.bundle_price * item.quantity)
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