/**
 * Store ligero (sin dependencias) para el estado de recuperación de pagos.
 *
 * Vive fuera de React para que StripePayment (dentro de <Elements>) y
 * PaypalExpressButton (fuera) compartan el mismo estado sin tener que
 * reestructurar el árbol del checkout.
 */
import { useSyncExternalStore } from 'react'
import type { FriendlyPaymentError } from './payment-errors'

export interface PaymentAlternatives {
  paypal: boolean
  oxxo: boolean
  spei: boolean
}

export interface PaymentRecoveryState {
  failure: FriendlyPaymentError | null
  /** Intentos fallidos en esta sesión de checkout. ≥2 → forzamos alternativas. */
  attempts: number
  /** Se incrementa cuando alguien pide scroll al bloque de pago. */
  focusToken: number
  alternatives: PaymentAlternatives
}

const INITIAL: PaymentRecoveryState = {
  failure: null,
  attempts: 0,
  focusToken: 0,
  alternatives: { paypal: false, oxxo: false, spei: false },
}

let state: PaymentRecoveryState = INITIAL
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): PaymentRecoveryState {
  return state
}

export function reportPaymentFailure(
  failure: FriendlyPaymentError,
  opts?: { focus?: boolean }
) {
  state = {
    ...state,
    failure,
    attempts: state.attempts + 1,
    focusToken: state.focusToken + (opts?.focus ? 1 : 0),
  }
  emit()
}

export function clearPaymentFailure() {
  if (!state.failure) return
  state = { ...state, failure: null }
  emit()
}

export function requestPaymentFocus() {
  state = { ...state, focusToken: state.focusToken + 1 }
  emit()
}

/** Registra qué métodos alternativos existen realmente en esta tienda. */
export function setPaymentAlternatives(patch: Partial<PaymentAlternatives>) {
  const next = { ...state.alternatives, ...patch }
  const changed = (Object.keys(next) as (keyof PaymentAlternatives)[]).some(
    (k) => next[k] !== state.alternatives[k]
  )
  if (!changed) return
  state = { ...state, alternatives: next }
  emit()
}

/** Reinicia todo (útil al montar un checkout nuevo). */
export function resetPaymentRecovery() {
  state = { ...INITIAL, alternatives: state.alternatives }
  emit()
}

export function usePaymentRecovery() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** Ancla a la que hacemos scroll cuando hay que volver al bloque de pago. */
export const PAYMENT_SECTION_ANCHOR_ID = 'payment-recovery-anchor'
export const PAYPAL_ANCHOR_ID = 'paypal-express-anchor'