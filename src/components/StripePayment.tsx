import React, { useMemo, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { callEdge } from "@/lib/edge"
import { STORE_ID, STRIPE_PUBLISHABLE_KEY } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/contexts/CartContext"
import { useCheckoutState } from "@/hooks/useCheckoutState"
import { useSettings } from "@/contexts/SettingsContext"
import { trackPurchase, tracking } from "@/lib/tracking-utils"
import type { PaymentMethods } from "@/lib/supabase"
import { CreditCard, Store, Building2 } from "lucide-react"

type PaymentMethodType = 'card' | 'oxxo' | 'spei'

interface StripePaymentProps {
  amountCents: number
  currency?: string
  description?: string
  metadata?: Record<string, string>
  email?: string
  name?: string
  phone?: string
  orderId?: string
  checkoutToken?: string
  onValidationRequired?: () => boolean
  expectedTotal?: number
  deliveryFee?: number
  shippingAddress?: any
  billingAddress?: any
  items?: any[]
  deliveryExpectations?: any[]
  pickupLocations?: any[]
  billingSlot?: React.ReactNode
  paymentMethods?: PaymentMethods
  stripeAccountId?: string | null
  chargeType?: string | null
}

// Stripe is now initialized dynamically in the wrapper component

const METHOD_CONFIG: Record<PaymentMethodType, { icon: React.ReactNode; label: string; description: string }> = {
  card: { icon: <CreditCard className="h-5 w-5" />, label: 'Tarjeta de crédito/débito', description: 'Visa, Mastercard, AMEX' },
  oxxo: { icon: <Store className="h-5 w-5" />, label: 'Pago en OXXO', description: 'Paga en efectivo en cualquier OXXO' },
  spei: { icon: <Building2 className="h-5 w-5" />, label: 'Transferencia SPEI', description: 'Transferencia bancaria inmediata' },
}

function PaymentMethodSelector({
  available,
  selected,
  onSelect,
}: {
  available: PaymentMethodType[]
  selected: PaymentMethodType
  onSelect: (m: PaymentMethodType) => void
}) {
  if (available.length <= 1) return null

  return (
    <div className="space-y-2">
      {available.map((method) => {
        const config = METHOD_CONFIG[method]
        const isSelected = selected === method
        return (
          <label
            key={method}
            className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
              isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method}
              checked={isSelected}
              onChange={() => onSelect(method)}
              className="w-4 h-4 accent-primary"
            />
            <div className="flex items-center gap-2 flex-1">
              {config.icon}
              <div>
                <div className="font-medium text-sm">{config.label}</div>
                <div className="text-xs text-muted-foreground">{config.description}</div>
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}

function PaymentForm({
  amountCents,
  currency = "usd",
  description,
  metadata,
  email,
  name,
  phone,
  orderId,
  checkoutToken,
  onValidationRequired,
  expectedTotal,
  deliveryFee = 0,
  shippingAddress,
  billingAddress,
  items = [],
  deliveryExpectations = [],
  pickupLocations = [],
  billingSlot,
  paymentMethods,
}: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cardholderName, setCardholderName] = useState(name || "")
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { updateOrderCache, getFreshOrder, getOrderSnapshot } = useCheckoutState()
  const { currencyCode } = useSettings()

  // Determine available methods
  const availableMethods = useMemo<PaymentMethodType[]>(() => {
    const methods: PaymentMethodType[] = []
    if (!paymentMethods || paymentMethods.card !== false) methods.push('card')
    if (paymentMethods?.oxxo) methods.push('oxxo')
    if (paymentMethods?.spei) methods.push('spei')
    return methods.length > 0 ? methods : ['card']
  }, [paymentMethods])

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(availableMethods[0])

  const amountLabel = useMemo(() => {
    const amt = (amountCents || 0) / 100
    const cur = (currency || "usd").toUpperCase()
    return `${cur} $${amt.toFixed(2)}`
  }, [amountCents, currency])

  const normalizeOrderFromResponse = (resp: any) => {
    if (resp?.order) return resp.order
    return {
      id: resp?.order_id ?? orderId,
      store_id: STORE_ID,
      checkout_token: resp?.checkout_token ?? checkoutToken,
      currency_code: resp?.currency_code,
      subtotal: resp?.subtotal,
      discount_amount: resp?.discount_amount,
      total_amount: resp?.total_amount,
      order_items: Array.isArray(resp?.order_items) ? resp.order_items : []
    }
  }

  const buildPaymentItems = () => {
    const sourceOrder = (typeof getFreshOrder === 'function' ? getFreshOrder() : null) || (typeof getOrderSnapshot === 'function' ? getOrderSnapshot() : null)
    const rawItems: any[] = (Array.isArray(items) && items.length > 0)
      ? items
      : (sourceOrder && Array.isArray(sourceOrder.order_items) ? sourceOrder.order_items : [])

    const normalizedItems = rawItems.map((it: any) => ({
      product_id: it.product_id || it.product?.id || '',
      variant_id: it.variant_id || it.variant?.id,
      quantity: Number(it.quantity ?? 0),
      price: Number(it.variant_price ?? it.variant?.price ?? it.price ?? it.unit_price ?? 0),
      selling_plan_id: it.selling_plan_id || undefined,
      product_name: it.product_name || it.product?.name || '',
    }))

    const seen = new Set<string>()
    return normalizedItems.filter((it: any) => it.product_id && it.quantity > 0).filter((it: any) => {
      const key = `${it.product_id}:${it.variant_id ?? ''}:${it.selling_plan_id ?? ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const buildPayload = (paymentItems: any[], totalCents: number) => ({
    payment_method: selectedMethod,
    store_id: STORE_ID,
    order_id: orderId,
    checkout_token: checkoutToken,
    amount: totalCents,
    currency: currency || "mxn",
    expected_total: expectedTotal || totalCents,
    delivery_fee: deliveryFee,
    description: description || `Pedido #${orderId ?? "s/n"}`,
    metadata: { order_id: orderId ?? "", ...(metadata || {}) },
    receipt_email: email,
    customer: { email, name, phone },
    capture_method: "automatic",
    use_stripe_connect: true,
    validation_data: {
      shipping_address: shippingAddress ? {
        line1: shippingAddress.line1 || "",
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        postal_code: shippingAddress.postal_code || "",
        country: shippingAddress.country || "",
        name: `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim()
      } : null,
      billing_address: billingAddress ? {
        line1: billingAddress.line1 || "",
        line2: billingAddress.line2 || "",
        city: billingAddress.city || "",
        state: billingAddress.state || "",
        postal_code: billingAddress.postal_code || "",
        country: billingAddress.country || "",
        name: `${billingAddress.first_name || ""} ${billingAddress.last_name || ""}`.trim()
      } : null,
      items: paymentItems.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        ...(item.variant_id ? { variant_id: item.variant_id } : {}),
        price: Math.max(0, Math.round(Number(item.price) * 100))
      })),
      ...(metadata?.discount_code ? { discount_code: metadata.discount_code } : {})
    },
    ...(pickupLocations && pickupLocations.length === 1 ? {
      delivery_method: "pickup",
      pickup_locations: pickupLocations.map(loc => ({
        id: loc.id || loc.name,
        name: loc.name || "",
        address: `${loc.line1 || ""}, ${loc.city || ""}, ${loc.state || ""}, ${loc.country || ""}`,
        hours: loc.schedule || ""
      }))
    } : deliveryExpectations && deliveryExpectations.length > 0 && deliveryExpectations[0]?.type !== "pickup" ? {
      delivery_expectations: deliveryExpectations.map((exp: any) => ({
        type: exp.type || "standard_delivery",
        description: exp.description || "",
        ...(exp.price !== undefined ? { estimated_days: "3-5" } : {})
      }))
    } : {})
  })

  const handleUnavailableItems = (data: any) => {
    if (data?.unavailable_items && data.unavailable_items.length > 0) {
      const unavailableNames = data.unavailable_items.map((item: any) =>
        item.variant_name ? `${item.product_name} (${item.variant_name})` : item.product_name
      ).join(', ')
      toast({
        title: "Items Out of Stock",
        description: `The following items are out of stock: ${unavailableNames}. Please remove them from your cart to complete your order.`,
        variant: "destructive"
      })
      updateOrderCache(normalizeOrderFromResponse(data))
      return true
    }
    return false
  }

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast({ title: "Error", description: "Stripe is not ready", variant: "destructive" })
      return
    }

    if (onValidationRequired && !onValidationRequired()) return

    // For card, ensure card element is present
    if (selectedMethod === 'card') {
      const card = elements.getElement(CardElement)
      if (!card) {
        toast({ title: "Error", description: "Ingresa los datos de tu tarjeta", variant: "destructive" })
        return
      }
    }

    // For OXXO and SPEI, name and email are required
    if ((selectedMethod === 'oxxo' || selectedMethod === 'spei') && (!name || !email)) {
      toast({ title: "Datos requeridos", description: "Nombre y correo son necesarios para este método de pago.", variant: "destructive" })
      return
    }

    if (deliveryExpectations?.[0]?.type === "pickup" && (!pickupLocations || pickupLocations.length === 0)) {
      toast({ title: "Punto de recogida requerido", description: "Por favor selecciona un punto de recogida antes de continuar.", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      const paymentItems = buildPaymentItems()
      const totalCents = Math.max(0, Math.floor(amountCents || 0))
      const hasSubscription = paymentItems.some((it: any) => it.selling_plan_id)

      let client_secret: string | undefined

      if (hasSubscription) {
        const subscriptionItems = paymentItems.filter((it: any) => it.selling_plan_id)
        const oneTimeItems = paymentItems.filter((it: any) => !it.selling_plan_id)
        const mainItem = subscriptionItems[0]
        const subPayload = {
          store_id: STORE_ID,
          selling_plan_id: mainItem.selling_plan_id,
          recurring_items: subscriptionItems.map((i: any) => ({
            product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity,
          })),
          order_id: orderId,
          customer: { email, name },
          one_time_items: oneTimeItems.length > 0 ? oneTimeItems.map((i: any) => ({
            product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity, price: i.price, title: i.product_name || '',
          })) : undefined,
        }
        const data = await callEdge('subscription-create', subPayload)
        if (handleUnavailableItems(data)) return
        client_secret = data?.client_secret
      } else {
        const payload = buildPayload(paymentItems, totalCents)
        console.log('🔍 StripePayment payload:', JSON.stringify(payload, null, 2))
        const data = await callEdge("payments-create-intent", payload)
        if (handleUnavailableItems(data)) return
        client_secret = data?.client_secret
      }

      if (!client_secret) {
        throw new Error("No se recibió client_secret del servidor")
      }

      // --- Confirm based on selected method ---
      if (selectedMethod === 'card') {
        await confirmCard(client_secret, paymentItems, totalCents)
      } else if (selectedMethod === 'oxxo') {
        await confirmOxxo(client_secret)
      } else if (selectedMethod === 'spei') {
        await confirmSpei(client_secret)
      }
    } catch (err: any) {
      console.error("Error en el proceso de pago:", err)
      handlePaymentError(err)
    } finally {
      setLoading(false)
    }
  }

  const confirmCard = async (clientSecret: string, paymentItems: any[], totalCents: number) => {
    const card = elements!.getElement(CardElement)!
    const result = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: email || undefined,
          name: name || undefined,
          phone: phone || undefined,
        },
      },
    })

    if (result.error) {
      toast({ title: "Payment failed", description: result.error.message || "Error processing payment", variant: "destructive" })
      return
    }

    if (result.paymentIntent?.status === "succeeded") {
      trackPurchase({
        products: paymentItems.map((item: any) => tracking.createTrackingProduct({
          id: item.product_id, title: item.product_name || item.title,
          price: item.price / 100, category: 'product',
          variant: item.variant_id ? { id: item.variant_id } : undefined
        })),
        value: totalCents / 100, currency: tracking.getCurrencyFromSettings(currency),
        order_id: orderId,
        custom_parameters: { payment_method: 'stripe', checkout_token: checkoutToken }
      })
      // Save order data for ThankYou page before clearing
      try {
        const checkoutData = localStorage.getItem(`checkout:${STORE_ID}`)
        if (checkoutData) {
          const parsed = JSON.parse(checkoutData)
          if (parsed.order) {
            localStorage.setItem('completed_order', JSON.stringify(parsed.order))
          }
        }
      } catch {}
      clearCart()
      navigate(`/gracias/${orderId}`)
      toast({ title: "Payment successful!", description: "Your purchase has been processed successfully." })
    } else {
      toast({ title: "Payment status", description: `Status: ${result.paymentIntent?.status ?? "unknown"}` })
    }
  }

  const confirmOxxo = async (clientSecret: string) => {
    const result = await (stripe as any).confirmOxxoPayment(clientSecret, {
      payment_method: {
        billing_details: {
          name: name || '',
          email: email || '',
        },
      },
    })

    if (result.error) {
      toast({ title: "Error con OXXO", description: result.error.message || "No se pudo generar el voucher", variant: "destructive" })
      return
    }

    const pi = result.paymentIntent
    if (pi?.status === 'requires_action' && pi.next_action?.oxxo_display_details) {
      const details = pi.next_action.oxxo_display_details
      sessionStorage.setItem('pending_payment', JSON.stringify({
        method: 'oxxo',
        orderId,
        voucherUrl: details.hosted_voucher_url,
        number: details.number,
        expiresAfter: details.expires_after,
        amount: (amountCents || 0) / 100,
        currency: (currency || 'mxn').toUpperCase(),
      }))
      clearCart()
      navigate(`/pago-pendiente/${orderId}`)
    } else {
      toast({ title: "Estado del pago", description: `Status: ${pi?.status ?? "unknown"}` })
    }
  }

  const confirmSpei = async (clientSecret: string) => {
    const result = await (stripe as any).confirmCustomerBalancePayment(clientSecret, {
      payment_method: { type: 'customer_balance' },
      payment_method_options: {
        customer_balance: {
          funding_type: 'bank_transfer',
          bank_transfer: { type: 'mx_bank_transfer' },
        },
      },
    })

    if (result.error) {
      toast({ title: "Error con SPEI", description: result.error.message || "No se pudo generar la transferencia", variant: "destructive" })
      return
    }

    const pi = result.paymentIntent
    if (pi?.next_action?.display_bank_transfer_instructions) {
      const instructions = pi.next_action.display_bank_transfer_instructions
      const speiAddr = instructions.financial_addresses?.find((a: any) => a.type === 'spei')?.spei
      sessionStorage.setItem('pending_payment', JSON.stringify({
        method: 'spei',
        orderId,
        hostedUrl: instructions.hosted_instructions_url,
        clabe: speiAddr?.clabe || '',
        bankName: speiAddr?.bank_name || '',
        amount: (instructions.amount_remaining || amountCents || 0) / 100,
        currency: (currency || 'mxn').toUpperCase(),
      }))
      clearCart()
      navigate(`/pago-pendiente/${orderId}`)
    } else {
      toast({ title: "Estado del pago", description: `Status: ${pi?.status ?? "unknown"}` })
    }
  }

  const handlePaymentError = (err: any) => {
    const message = err?.message || ""
    const jsonStart = message.indexOf("{")
    const jsonEnd = message.lastIndexOf("}")
    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        const parsed = JSON.parse(message.slice(jsonStart, jsonEnd + 1))
        if (handleUnavailableItems(parsed)) return
      } catch {}
    }
    let errorMessage = "No se pudo procesar el pago"
    if (err?.message) errorMessage = err.message
    else if (typeof err === 'string') errorMessage = err
    else if (err?.error) errorMessage = err.error
    toast({ title: "Error de pago", description: errorMessage, variant: "destructive" })
  }

  const buttonText = useMemo(() => {
    if (loading) return null
    switch (selectedMethod) {
      case 'oxxo': return `Generar Voucher OXXO - ${amountLabel}`
      case 'spei': return `Ver datos de transferencia - ${amountLabel}`
      default: return `Completar Compra - ${amountLabel}`
    }
  }, [selectedMethod, amountLabel, loading])

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground text-center">
        🔒 Todas las transacciones son seguras y encriptadas.
      </div>

      {/* Payment method selector */}
      <PaymentMethodSelector
        available={availableMethods}
        selected={selectedMethod}
        onSelect={setSelectedMethod}
      />

      {/* Card payment form */}
      {selectedMethod === 'card' && (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
          <CardContent className="p-0 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary"></div>
                <span className="font-medium">Tarjeta de crédito</span>
              </div>
              <img src="/lovable-uploads/43c70209-0949-4d87-9c23-50bea4ff2d48.png" alt="Tarjetas aceptadas" className="h-6" />
            </div>

            <div className="mb-3">
              <label htmlFor="cardholder-name" className="block text-sm text-muted-foreground mb-1">
                Nombre del titular de la tarjeta
              </label>
              <input
                id="cardholder-name"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Nombre como aparece en la tarjeta"
                className="w-full border rounded-lg px-3 py-2.5 text-base bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="border rounded-lg px-2 py-3 sm:p-4 bg-background">
              <CardElement
                options={{
                  style: {
                    base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                    invalid: { color: '#9e2146' },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* OXXO info */}
      {selectedMethod === 'oxxo' && (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Store className="h-8 w-8 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium">Pago en efectivo en OXXO</p>
                <p className="text-sm text-muted-foreground">
                  Se generará un voucher con un código de barras que podrás presentar en cualquier tienda OXXO para completar tu pago.
                </p>
                <p className="text-sm text-muted-foreground">
                  ⏱ Tienes <strong>3 días</strong> para realizar el pago antes de que expire.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SPEI info */}
      {selectedMethod === 'spei' && (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-8 w-8 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium">Transferencia bancaria SPEI</p>
                <p className="text-sm text-muted-foreground">
                  Se generarán los datos de la cuenta (CLABE) para que realices la transferencia desde tu banca en línea o app bancaria.
                </p>
                <p className="text-sm text-muted-foreground">
                  ⚡ La confirmación del pago es generalmente instantánea.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing address slot (only for card) */}
      {selectedMethod === 'card' && billingSlot}

      {/* Submit button */}
      <Button
        onClick={handlePayment}
        disabled={!stripe || loading || !amountCents}
        className="w-full h-12 text-lg font-semibold"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </div>
        ) : buttonText}
      </Button>

      <div className="text-xs text-muted-foreground text-center">
        Al hacer clic en "{selectedMethod === 'oxxo' ? 'Generar Voucher OXXO' : selectedMethod === 'spei' ? 'Ver datos de transferencia' : 'Completar Compra'}", aceptas nuestros{" "}
        <a href="/terminos-y-condiciones" target="_blank" className="underline hover:text-foreground">términos y condiciones</a>
        {" "}y{" "}
        <a href="/aviso-de-privacidad" target="_blank" className="underline hover:text-foreground">aviso de privacidad</a>.
      </div>
    </div>
  )
}

export default function StripePayment(props: StripePaymentProps) {
  const stripePromise = useMemo(() => {
    const opts = props.chargeType === 'direct' && props.stripeAccountId
      ? { stripeAccount: props.stripeAccountId }
      : {};
    return loadStripe(STRIPE_PUBLISHABLE_KEY, opts);
  }, [props.stripeAccountId, props.chargeType]);

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
