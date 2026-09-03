/**
 * Mapa de errores de pago → copy accionable en español.
 *
 * REGLA: nunca mostramos el string crudo de Stripe/PayPal al cliente.
 * El mensaje técnico solo viaja a PostHog / console.
 */

export type PaymentFailureKind =
  | 'declined'
  | 'funds'
  | 'card_data'
  | 'auth'
  | 'network'
  | 'cancelled'
  | 'unavailable'
  | 'unknown'

export interface FriendlyPaymentError {
  kind: PaymentFailureKind
  title: string
  body: string
  /** Si conviene empujar métodos alternativos (PayPal / OXXO / SPEI). */
  suggestAlternatives: boolean
  /** 'error' = rojo. 'neutral' = ámbar (no es culpa de nadie, p.ej. cancelación). */
  tone: 'error' | 'neutral'
  code?: string
  declineCode?: string
}

export interface PaymentErrorInput {
  code?: string | null
  declineCode?: string | null
  type?: string | null
  /** Mensaje crudo — solo se usa para heurística, NUNCA se muestra. */
  message?: string | null
}

const FALLBACK: Omit<FriendlyPaymentError, 'code' | 'declineCode'> = {
  kind: 'unknown',
  title: 'No pudimos completar tu pago',
  body: 'No se te cobró nada. Tus datos y tu carrito siguen guardados. Prueba con otra tarjeta o con otro método de pago.',
  suggestAlternatives: true,
  tone: 'error',
}

type Recipe = Omit<FriendlyPaymentError, 'code' | 'declineCode'>

const BY_CODE: Record<string, Recipe> = {
  // --- Fondos ---
  insufficient_funds: {
    kind: 'funds',
    title: 'Tu tarjeta no tenía fondos suficientes',
    body: 'Prueba con otra tarjeta, o paga en efectivo en OXXO o por transferencia SPEI.',
    suggestAlternatives: true,
    tone: 'error',
  },
  card_velocity_exceeded: {
    kind: 'funds',
    title: 'Tu tarjeta llegó a su límite',
    body: 'Tu banco bloqueó el cargo por límite de compras. Prueba con otra tarjeta o con otro método de pago.',
    suggestAlternatives: true,
    tone: 'error',
  },
  withdrawal_count_limit_exceeded: {
    kind: 'funds',
    title: 'Tu tarjeta llegó a su límite',
    body: 'Tu banco bloqueó el cargo por límite de compras. Prueba con otra tarjeta o con otro método de pago.',
    suggestAlternatives: true,
    tone: 'error',
  },

  // --- Rechazo del banco ---
  card_declined: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'No es un error tuyo: pasa seguido con compras en línea. Prueba otra tarjeta o paga con PayPal, tarda lo mismo.',
    suggestAlternatives: true,
    tone: 'error',
  },
  generic_decline: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'No es un error tuyo: pasa seguido con compras en línea. Prueba otra tarjeta o paga con PayPal, tarda lo mismo.',
    suggestAlternatives: true,
    tone: 'error',
  },
  do_not_honor: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'No es un error tuyo: pasa seguido con compras en línea. Prueba otra tarjeta o paga con PayPal, tarda lo mismo.',
    suggestAlternatives: true,
    tone: 'error',
  },
  transaction_not_allowed: {
    kind: 'declined',
    title: 'Tu tarjeta no permite este tipo de compra',
    body: 'Algunas tarjetas bloquean compras en línea. Prueba con otra tarjeta o paga con PayPal.',
    suggestAlternatives: true,
    tone: 'error',
  },
  lost_card: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'Esa tarjeta está bloqueada. Usa otra tarjeta o paga con otro método.',
    suggestAlternatives: true,
    tone: 'error',
  },
  stolen_card: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'Esa tarjeta está bloqueada. Usa otra tarjeta o paga con otro método.',
    suggestAlternatives: true,
    tone: 'error',
  },
  fraudulent: {
    kind: 'declined',
    title: 'Tu banco rechazó el cargo',
    body: 'Tu banco marcó el intento como sospechoso. Confírmalo con tu banco o paga con otro método.',
    suggestAlternatives: true,
    tone: 'error',
  },

  // --- Datos de la tarjeta ---
  incorrect_cvc: {
    kind: 'card_data',
    title: 'Revisa el código de 3 dígitos',
    body: 'Está al reverso de tu tarjeta, junto a la firma. Corrígelo y vuelve a intentar.',
    suggestAlternatives: false,
    tone: 'error',
  },
  invalid_cvc: {
    kind: 'card_data',
    title: 'Revisa el código de 3 dígitos',
    body: 'Está al reverso de tu tarjeta, junto a la firma. Corrígelo y vuelve a intentar.',
    suggestAlternatives: false,
    tone: 'error',
  },
  expired_card: {
    kind: 'card_data',
    title: 'Esa tarjeta ya venció',
    body: 'Revisa la fecha de vencimiento. Si ya pasó, usa otra tarjeta o paga con otro método.',
    suggestAlternatives: true,
    tone: 'error',
  },
  invalid_expiry_month: {
    kind: 'card_data',
    title: 'La fecha de vencimiento no cuadra',
    body: 'Revisa el mes y el año que vienen impresos en tu tarjeta.',
    suggestAlternatives: false,
    tone: 'error',
  },
  invalid_expiry_year: {
    kind: 'card_data',
    title: 'La fecha de vencimiento no cuadra',
    body: 'Revisa el mes y el año que vienen impresos en tu tarjeta.',
    suggestAlternatives: false,
    tone: 'error',
  },
  incorrect_number: {
    kind: 'card_data',
    title: 'El número de tarjeta no cuadra',
    body: 'Revísalo dígito por dígito y vuelve a intentar.',
    suggestAlternatives: false,
    tone: 'error',
  },
  invalid_number: {
    kind: 'card_data',
    title: 'El número de tarjeta no cuadra',
    body: 'Revísalo dígito por dígito y vuelve a intentar.',
    suggestAlternatives: false,
    tone: 'error',
  },
  incorrect_zip: {
    kind: 'card_data',
    title: 'El código postal no coincide',
    body: 'Usa el código postal donde recibes el estado de cuenta de esa tarjeta.',
    suggestAlternatives: false,
    tone: 'error',
  },
  incomplete_number: {
    kind: 'card_data',
    title: 'Faltan datos de tu tarjeta',
    body: 'Revisa que el número, la fecha y el código estén completos.',
    suggestAlternatives: false,
    tone: 'error',
  },
  incomplete_cvc: {
    kind: 'card_data',
    title: 'Faltan datos de tu tarjeta',
    body: 'Revisa que el número, la fecha y el código estén completos.',
    suggestAlternatives: false,
    tone: 'error',
  },
  incomplete_expiry: {
    kind: 'card_data',
    title: 'Faltan datos de tu tarjeta',
    body: 'Revisa que el número, la fecha y el código estén completos.',
    suggestAlternatives: false,
    tone: 'error',
  },

  // --- Autenticación ---
  authentication_required: {
    kind: 'auth',
    title: 'Tu banco pidió confirmar la compra',
    body: 'Completa la verificación que te mandó tu banco y vuelve a darle a pagar.',
    suggestAlternatives: false,
    tone: 'error',
  },
  payment_intent_authentication_failure: {
    kind: 'auth',
    title: 'No se completó la verificación con tu banco',
    body: 'Vuelve a intentar y termina la confirmación que te aparece de tu banco.',
    suggestAlternatives: true,
    tone: 'error',
  },

  // --- Red / procesamiento ---
  processing_error: {
    kind: 'network',
    title: 'Se cayó la conexión con el banco',
    body: 'No se te cobró nada. Vuelve a intentar en unos segundos.',
    suggestAlternatives: false,
    tone: 'error',
  },
  api_connection_error: {
    kind: 'network',
    title: 'Se cayó la conexión con el banco',
    body: 'No se te cobró nada. Vuelve a intentar en unos segundos.',
    suggestAlternatives: false,
    tone: 'error',
  },
  rate_limit: {
    kind: 'network',
    title: 'Demasiados intentos seguidos',
    body: 'Espera unos segundos y vuelve a darle a pagar.',
    suggestAlternatives: false,
    tone: 'error',
  },

  // --- Cancelaciones (no son errores) ---
  paypal_cancelled: {
    kind: 'cancelled',
    title: 'Cancelaste el pago con PayPal',
    body: 'Tu carrito y tus datos siguen aquí. Puedes pagar con tarjeta o volver a intentar con PayPal.',
    suggestAlternatives: false,
    tone: 'neutral',
  },
  wallet_cancelled: {
    kind: 'cancelled',
    title: 'Cerraste la ventana de pago',
    body: 'Tu carrito y tus datos siguen aquí. Puedes terminar tu compra con tarjeta cuando quieras.',
    suggestAlternatives: false,
    tone: 'neutral',
  },

  // --- Servicio no disponible ---
  card_payments_unavailable: {
    kind: 'unavailable',
    title: 'Los pagos con tarjeta están temporalmente fuera de servicio',
    body: 'Puedes terminar tu compra con otro método de pago o intentar de nuevo más tarde.',
    suggestAlternatives: true,
    tone: 'error',
  },
}

/** Heurística de último recurso sobre el mensaje crudo (nunca se muestra tal cual). */
function guessFromMessage(raw: string): Recipe | null {
  const m = raw.toLowerCase()
  if (m.includes('insufficient')) return BY_CODE.insufficient_funds
  if (m.includes('expired')) return BY_CODE.expired_card
  if (m.includes('cvc') || m.includes('security code')) return BY_CODE.incorrect_cvc
  if (m.includes('declin') || m.includes('rechaz')) return BY_CODE.card_declined
  if (m.includes('authentication') || m.includes('3d secure')) return BY_CODE.authentication_required
  if (m.includes('network') || m.includes('failed to fetch') || m.includes('timeout') || m.includes('conexión')) {
    return BY_CODE.api_connection_error
  }
  if (m.includes('stripe_not_connected') || m.includes('stripe not connected')) {
    return BY_CODE.card_payments_unavailable
  }
  return null
}

export function mapPaymentError(input: PaymentErrorInput): FriendlyPaymentError {
  const declineCode = input.declineCode || undefined
  const code = input.code || undefined

  const recipe =
    (declineCode && BY_CODE[declineCode]) ||
    (code && BY_CODE[code]) ||
    (input.type === 'validation_error' ? BY_CODE.incomplete_number : null) ||
    (input.message ? guessFromMessage(input.message) : null) ||
    FALLBACK

  return { ...recipe, code, declineCode }
}