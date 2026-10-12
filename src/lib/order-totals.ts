import { STORE_ID } from './config'
import { countryCodeToName, countryNameToCode } from './country-codes'

/**
 * Totales autoritativos del pedido (los calcula el servidor).
 * Cuando existe un pedido, el checkout los muestra tal cual — nunca los recalcula.
 */
export interface OrderTotals {
  subtotal: number
  discount_amount: number
  shipping_amount: number
  total_amount: number
}

const TOTAL_KEYS: (keyof OrderTotals)[] = ['subtotal', 'discount_amount', 'shipping_amount', 'total_amount']

const toNumber = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === '') return undefined
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Extrae los totales de una respuesta de checkout-update / order-get o de un objeto order.
 * Prefiere los campos planos de la respuesta y cae a `resp.order.*`.
 */
export const pickOrderTotals = (resp: any): Partial<OrderTotals> => {
  const out: Partial<OrderTotals> = {}
  if (!resp || typeof resp !== 'object') return out
  for (const k of TOTAL_KEYS) {
    const n = toNumber(resp[k]) ?? toNumber(resp.order?.[k])
    if (n !== undefined) out[k] = n
  }
  return out
}

/** Escribe los totales del servidor en el pedido cacheado (localStorage) sin disparar eventos. */
export const patchCachedOrderTotals = (patch: Partial<OrderTotals>) => {
  if (Object.keys(patch).length === 0) return
  try {
    const key = `checkout:${STORE_ID}`
    const raw = localStorage.getItem(key)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed?.order) return
    parsed.order = { ...parsed.order, ...patch }
    localStorage.setItem(key, JSON.stringify(parsed))
  } catch {
    // Cache best-effort: nunca debe romper el checkout
  }
}

export interface OrderPrefill {
  first_name: string
  last_name: string
  line1: string
  line2: string
  city: string
  state: string
  postal_code: string
  phone: string
  email: string
  countryCode: string
  countryName: string
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '')

/** Normaliza order.shipping_address (objeto o JSON string) a los campos del formulario. */
export const parseOrderShippingAddress = (raw: unknown, fallbackEmail?: string): OrderPrefill | null => {
  let sa: any = raw
  if (typeof sa === 'string') {
    try { sa = JSON.parse(sa) } catch { return null }
  }
  if (!sa || typeof sa !== 'object') return null

  const countryRaw = str(sa.country_code) || str(sa.country) || str(sa.country_name)
  const countryCode = countryRaw.length === 2 ? countryRaw.toUpperCase() : (countryRaw ? countryNameToCode(countryRaw) : 'MX') || 'MX'
  const countryName = countryRaw.length === 2 || !countryRaw ? countryCodeToName(countryCode) : countryRaw

  const prefill: OrderPrefill = {
    first_name: str(sa.first_name),
    last_name: str(sa.last_name),
    line1: str(sa.line1),
    line2: str(sa.line2),
    city: str(sa.city),
    state: str(sa.state) || str(sa.state_name),
    postal_code: str(sa.postal_code),
    phone: str(sa.phone),
    email: str(sa.email) || str(fallbackEmail),
    countryCode,
    countryName,
  }

  const hasData = prefill.first_name || prefill.line1 || prefill.postal_code || prefill.phone || prefill.email
  return hasData ? prefill : null
}