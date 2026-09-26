/**
 * event_id lifecycle for Meta Pixel + CAPI deduplication.
 * All side-effect modules are mocked: no network, no real pixel, no PostHog.
 * Run: `npx vitest run src/lib/__tests__/tracking-event-id.test.ts`
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const m = vi.hoisted(() => ({
  pixelTrack: vi.fn(),
  pixelSearch: vi.fn(),
  callEdge: vi.fn(() => Promise.resolve({})),
  phCapture: vi.fn(),
  gaEvent: vi.fn(),
  gaPurchase: vi.fn(),
}))

vi.mock('@/lib/facebook-pixel', () => ({
  facebookPixel: { track: m.pixelTrack, search: m.pixelSearch, pageView: vi.fn() },
}))
vi.mock('@/lib/edge', () => ({ callEdge: m.callEdge }))
vi.mock('@/lib/config', () => ({ STORE_ID: 'store-fixture' }))
vi.mock('posthog-js', () => ({ default: { __loaded: true, capture: m.phCapture } }))
vi.mock('@/lib/google-ads', () => ({ googleAds: { event: m.gaEvent, purchase: m.gaPurchase } }))

import { tracking } from '@/lib/tracking-utils'

const product = { id: 'prod-fixture', name: 'Fixture', price: 799 }
const base = { products: [product], value: 799, currency: 'mxn' }

// Event ids seen by each channel for the N-th hybrid call
const pixelId = (i: number) => m.pixelTrack.mock.calls[i][2] as string
const capiId = (i: number) => (m.callEdge.mock.calls[i] as any[])[1].event_id as string
const phId = (i: number) => m.phCapture.mock.calls[i][1].event_id as string

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('window', { location: { href: 'https://test.local/' } })
  tracking.setPixelData('pixel-fixture', 'fbp-fixture', 'fbc-fixture')
})

describe('event_id — unique per real occurrence', () => {
  it('A) two ViewContent of the SAME product → different event_id', () => {
    tracking.trackViewContent(base)
    tracking.trackViewContent(base)
    expect(pixelId(0)).not.toBe(pixelId(1))
    expect(capiId(0)).not.toBe(capiId(1))
    expect(pixelId(0)).not.toContain(product.id)
  })

  it('B) inside ONE ViewContent, Pixel, CAPI and PostHog share the exact same event_id', () => {
    tracking.trackViewContent(base)
    expect(m.pixelTrack).toHaveBeenCalledTimes(1)
    expect(m.callEdge).toHaveBeenCalledTimes(1)
    expect(m.pixelTrack.mock.calls[0][0]).toBe('ViewContent')
    expect((m.callEdge.mock.calls[0] as any[])[1].event_name).toBe('ViewContent')
    expect(capiId(0)).toBe(pixelId(0))
    expect(phId(0)).toBe(pixelId(0))
  })

  it('C) two AddToCart of the same product → different event_id (Pixel = CAPI in each)', () => {
    tracking.trackAddToCart(base)
    tracking.trackAddToCart(base)
    expect(pixelId(0)).not.toBe(pixelId(1))
    expect(capiId(0)).toBe(pixelId(0))
    expect(capiId(1)).toBe(pixelId(1))
  })

  it('D) two InitiateCheckout WITHOUT order_id → different event_id', () => {
    tracking.trackInitiateCheckout(base)
    tracking.trackInitiateCheckout(base)
    expect(pixelId(0)).not.toBe(pixelId(1))
    expect(pixelId(0)).not.toContain(product.id)
    expect(capiId(0)).toBe(pixelId(0))
  })

  it('E) two InitiateCheckout with the SAME order_id → same event_id', () => {
    tracking.trackInitiateCheckout({ ...base, order_id: 'order-123' })
    tracking.trackInitiateCheckout({ ...base, order_id: 'order-123' })
    expect(pixelId(0)).toBe(pixelId(1))
    expect(capiId(0)).toBe(capiId(1))
    expect(capiId(0)).toBe(pixelId(0))
  })

  it('F) two Purchase with the SAME order_id → same event_id (unchanged behaviour)', () => {
    tracking.trackPurchase({ ...base, order_id: 'order-456' })
    tracking.trackPurchase({ ...base, order_id: 'order-456' })
    expect(pixelId(0)).toBe('purchase_order-456')
    expect(pixelId(1)).toBe('purchase_order-456')
    expect(capiId(0)).toBe(pixelId(0))
    expect(capiId(1)).toBe(pixelId(1))
  })

  it('G) two Search with the SAME search_string → different event_id (Pixel = CAPI in each)', () => {
    tracking.trackSearch({ search_string: 'faja moto' })
    tracking.trackSearch({ search_string: 'faja moto' })
    const px0 = m.pixelSearch.mock.calls[0][1]
    const px1 = m.pixelSearch.mock.calls[1][1]
    expect(px0).not.toBe(px1)
    expect(px0).not.toContain('faja')
    expect(capiId(0)).toBe(px0)
    expect(capiId(1)).toBe(px1)
    expect(m.phCapture.mock.calls[0][1].event_id).toBe(px0)
  })
})

describe('H) PostHog and Google Ads keep firing', () => {
  it('ViewContent → posthog "viewcontent" + gtag view_item', () => {
    tracking.trackViewContent(base)
    expect(m.phCapture).toHaveBeenCalledWith('viewcontent', expect.objectContaining({ event_id: pixelId(0), value: 799 }))
    expect(m.gaEvent).toHaveBeenCalledWith('view_item', expect.objectContaining({ value: 799, currency: 'MXN' }))
  })

  it('AddToCart / InitiateCheckout → gtag add_to_cart / begin_checkout', () => {
    tracking.trackAddToCart(base)
    tracking.trackInitiateCheckout(base)
    expect(m.gaEvent).toHaveBeenCalledWith('add_to_cart', expect.any(Object))
    expect(m.gaEvent).toHaveBeenCalledWith('begin_checkout', expect.any(Object))
    expect(m.phCapture).toHaveBeenCalledWith('addtocart', expect.any(Object))
    expect(m.phCapture).toHaveBeenCalledWith('initiatecheckout', expect.any(Object))
  })

  it('Purchase → gtag purchase with transactionId = order_id', () => {
    tracking.trackPurchase({ ...base, order_id: 'order-789' })
    expect(m.gaPurchase).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'order-789', value: 799 }))
    expect(m.phCapture).toHaveBeenCalledWith('purchase', expect.objectContaining({ event_id: 'purchase_order-789' }))
  })

  it('Search → gtag search + posthog search_performed', () => {
    tracking.trackSearch({ search_string: 'faja moto' })
    expect(m.gaEvent).toHaveBeenCalledWith('search', { search_term: 'faja moto' })
    expect(m.phCapture).toHaveBeenCalledWith('search_performed', expect.objectContaining({ search_query: 'faja moto' }))
  })

  it('CAPI user_data (fbp/fbc) is untouched', () => {
    tracking.trackViewContent(base)
    const payload = (m.callEdge.mock.calls[0] as any[])[1]
    expect(payload.user_data).toEqual(expect.objectContaining({ fbp: 'fbp-fixture', fbc: 'fbc-fixture' }))
  })
})