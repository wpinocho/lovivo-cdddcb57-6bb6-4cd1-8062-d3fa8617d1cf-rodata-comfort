/**
 * Fixture-only tests for the shared pack/BOGO quote. No network, no production
 * rules: the BOGO below is a local copy of the shape of rule 7653e73d (inactive
 * in production). Run: `npx vitest run src/lib/__tests__`
 */
import { describe, it, expect } from 'vitest'
import { calcLinesPricing, calcCartPricing, cartLineDisplay, type PricingLookup } from '@/lib/cart-pricing'
import { resolvePdpPurchase, type ResolvePurchaseInput } from '@/lib/pdp-purchase'

const PRODUCT_ID = 'prod-fixture'
const PRICE = 799 // fixture value, not a production string

const BOGO_FIXTURE: any = {
  id: 'rule-fixture',
  rule_type: 'bogo',
  active: true,
  conditions: { bogo_mode: 'same_products', buy_quantity: 1, get_quantity: 1, max_uses_per_order: 1, get_discount_percentage: 50 },
}
const withBogo: PricingLookup = { getVolumeRules: () => [], getBogoRules: (pid) => (pid === PRODUCT_ID ? [BOGO_FIXTURE] : []) }
// usePriceRules only returns ACTIVE rules → an inactive BOGO means "no rules"
const bogoInactive: PricingLookup = { getVolumeRules: () => [], getBogoRules: () => [] }

const M = { id: 'var-M', price: PRICE, inventory_quantity: 10 }
const L = { id: 'var-L', price: PRICE, inventory_quantity: 10 }

const line = (quantity: number) => ({ productId: PRODUCT_ID, unitPrice: PRICE, quantity })

describe('central quote — max ONE 50% unit per order', () => {
  it.each([[1, 799], [2, 1198.5], [3, 1997.5], [4, 2796.5]])('%i units → %d', (qty, total) => {
    expect(calcLinesPricing([line(qty)], withBogo).total).toBe(total)
  })
  it('M + L (two lines) pools across sizes', () => {
    expect(calcLinesPricing([line(1), line(1)], withBogo).total).toBe(1198.5)
  })
  it('M×2 + L×2 still discounts only one unit', () => {
    const r = calcLinesPricing([line(2), line(2)], withBogo)
    expect(r.bogoDiscount).toBe(399.5)
    expect(r.total).toBe(2796.5)
  })
  it('inactive BOGO → no discount, no label', () => {
    const r = calcLinesPricing([line(2)], bogoInactive)
    expect(r.total).toBe(1598)
    expect(r.bogoDiscount).toBe(0)
    expect(r.bogoLabel).toBeNull()
  })
  it('label derives from the rule', () => {
    expect(calcLinesPricing([line(2)], withBogo).bogoLabel).toBe('Segunda unidad al 50%')
  })
})

describe('cart breakdown sums exactly to the total', () => {
  const item = (variant: any, quantity: number, price = PRICE): any => ({
    key: `${PRODUCT_ID}:${variant.id}`, type: 'product', product: { id: PRODUCT_ID, price }, variant: { ...variant, price }, quantity,
  })
  const check = (items: any[], expectedTotal?: number) => {
    const pricing = calcCartPricing(items, withBogo)
    const lines = items.reduce((s, i) => s + cartLineDisplay(i, withBogo).lineTotal, 0)
    expect(Math.round((lines - pricing.bogoDiscount) * 100)).toBe(Math.round(pricing.total * 100))
    if (expectedTotal !== undefined) expect(pricing.total).toBe(expectedTotal)
    return pricing
  }
  it('M + L: lines at base price + one global promo row', () => {
    const p = check([item(M, 1), item(L, 1)], 1198.5)
    expect(p.subtotal).toBe(1598)
  })
  it('M×2 + L×2', () => { check([item(M, 2), item(L, 2)], 2796.5) })
  it('cents: odd price does not drift', () => { check([item(M, 3, 799.99), item(L, 1, 799.99)]) })
})

const base = (over: Partial<ResolvePurchaseInput>): ResolvePurchaseInput => ({
  productId: PRODUCT_ID,
  productPrice: PRICE,
  hasVariants: true,
  trackInventory: true,
  first: M,
  second: undefined,
  mode: 'quantity',
  quantity: 1,
  unitPriceFor: (v) => v?.price ?? PRICE,
  isAvailable: (v) => (v.inventory_quantity ?? 0) > 0,
  lookup: withBogo,
  ...over,
})

describe('PDP effective selection', () => {
  it('card "1" buys exactly one unit even if quantity state was 3', () => {
    const r = resolvePdpPurchase(base({ mode: 'one', quantity: 3, second: L }))
    expect(r.lines).toEqual([{ variant: M, quantity: 1, unitPrice: PRICE }])
    expect(r.pricing?.total).toBe(799)
  })
  it('control adding 2 manually gets the same commercial quote', () => {
    const r = resolvePdpPurchase(base({ mode: 'quantity', quantity: 2 }))
    expect(r.units).toBe(2)
    expect(r.pricing?.total).toBe(1198.5)
  })
  it('pack M + L → two lines of one unit', () => {
    const r = resolvePdpPurchase(base({ mode: 'pack', second: L }))
    expect(r.lines.map(l => [l.variant?.id, l.quantity])).toEqual([['var-M', 1], ['var-L', 1]])
    expect(r.pricing?.total).toBe(1198.5)
  })
  it('pack M + M → one line of two real units', () => {
    const r = resolvePdpPurchase(base({ mode: 'pack', second: M }))
    expect(r.lines.map(l => [l.variant?.id, l.quantity])).toEqual([['var-M', 2]])
  })
  it('missing second size → error and NO lines', () => {
    const r = resolvePdpPurchase(base({ mode: 'pack' }))
    expect(r.error).toBe('select_second')
    expect(r.lines).toHaveLength(0)
  })
  it('insufficient stock for M + M', () => {
    const r = resolvePdpPurchase(base({ mode: 'pack', first: { ...M, inventory_quantity: 1 }, second: { ...M, inventory_quantity: 1 } }))
    expect(r.error).toBe('out_of_stock')
    expect(r.lines).toHaveLength(0)
  })
  it('previous cart counts toward stock', () => {
    const M2 = { ...M, inventory_quantity: 2 }
    expect(resolvePdpPurchase(base({ mode: 'pack', first: M2, second: M2 })).error).toBeNull()
    expect(resolvePdpPurchase(base({ mode: 'pack', first: M2, second: M2, cartQtyByVariant: { 'var-M': 1 } })).error).toBe('out_of_stock')
  })
  it('2 → 1: the second unit does not travel', () => {
    const r = resolvePdpPurchase(base({ mode: 'one', second: L }))
    expect(r.lines.some(l => l.variant?.id === 'var-L')).toBe(false)
    expect(r.units).toBe(1)
  })
  it('inactive BOGO: pack selection quotes list price (no promise)', () => {
    const r = resolvePdpPurchase(base({ mode: 'pack', second: L, lookup: bogoInactive }))
    expect(r.pricing?.total).toBe(1598)
  })
  it('untracked inventory skips stock checks', () => {
    const r = resolvePdpPurchase(base({ trackInventory: false, mode: 'pack', first: { ...M, inventory_quantity: 0 }, second: { ...M, inventory_quantity: 0 } }))
    expect(r.error).toBeNull()
  })
})