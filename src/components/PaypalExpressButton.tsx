import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useSettings } from '@/contexts/SettingsContext'
import { callEdge } from '@/lib/edge'
import { STORE_ID } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { getAttributionPayload, trackPurchase, tracking, trackPH } from '@/lib/tracking-utils'
import { useCart } from '@/contexts/CartContext'

interface PaypalExpressButtonProps {
  orderId: string
  checkoutToken: string
  amount: number        // finalTotal en pesos (ej. 799.00)
  currency: string      // minúsculas (ej. 'mxn')
  items: any[]
  shippingCost: number
  className?: string    // className del wrapper externo
  showDivider?: boolean // muestra "o paga con" arriba (default true)
}

export function PaypalExpressButton({
  orderId,
  checkoutToken,
  amount,
  currency,
  items,
  shippingCost,
  className,
  showDivider = true,
}: PaypalExpressButtonProps) {
  const { paypalEnabled, paypalClientId, paypalEnvironment } = useSettings()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  if (!paypalEnabled || !paypalClientId || !checkoutToken) return null

  const currencyUpper = currency.toUpperCase()

  const phBase = () => ({
    order_id: orderId,
    checkout_token: checkoutToken,
    value: amount,
    currency: currencyUpper,
    payment_method: 'paypal',
  })

  return (
    <div className={className}>
      {showDivider && (
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs text-brand-steel">o paga con</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>
      )}

      <PayPalScriptProvider
        key={`${paypalClientId}-${currencyUpper}`}
        options={{
          clientId: paypalClientId,
          currency: currencyUpper,
          intent: 'capture',
        }}
      >
        <PayPalButtons
          style={{ layout: 'horizontal', height: 45, tagline: false, color: 'gold' }}
          fundingSource="paypal"
          createOrder={async () => {
            // PayPal Express: no requiere validar el formulario — PayPal recolecta
            // la dirección de envío del comprador dentro del popup de PayPal.
            const attribution = getAttributionPayload();
            trackPH('checkout_pay_clicked', {
              ...phBase(),
              num_items: items.reduce((s: number, i: any) => s + (i.quantity || 0), 0),
            })
            try {
              const result = await callEdge('paypal-create-order', {
                store_id: STORE_ID,
                checkout_token: checkoutToken,
                amount,
                currency: currencyUpper,
                items,
                shipping: shippingCost,
                attribution,
              })
              if (!result?.id) throw new Error('Falta el ID de la orden de PayPal')
              return result.id
            } catch (err: unknown) {
              trackPH('checkout_payment_failed', {
                ...phBase(),
                stage: 'paypal_create_order',
                error_message: err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300),
              })
              throw err
            }
          }}
          onApprove={async (data) => {
            try {
              const attribution = getAttributionPayload();
              const res = await callEdge('paypal-capture-order', {
                store_id: STORE_ID,
                paypal_order_id: data.orderID,
                checkout_token: checkoutToken,
                attribution,
              })
              if (!res?.ok || res?.status !== 'COMPLETED') {
                trackPH('checkout_payment_failed', {
                  ...phBase(),
                  stage: 'paypal_capture',
                  paypal_status: res?.status ?? 'unknown',
                  error_message: res?.error || 'El pago no se completó',
                })
                throw new Error(res?.error || 'El pago no se completó')
              }

              // Construye una orden de respaldo desde los props locales por si res.order es null
              const internalOrderId = res.order?.id || res.order_id
              const fallbackOrder = {
                id: internalOrderId || data.orderID,
                order_number: res.order?.order_number || (internalOrderId || data.orderID).slice(0, 8).toUpperCase(),
                total_amount: amount,
                currency_code: currency.toUpperCase(),
                status: 'paid',
                // En PayPal Express la dirección la recolecta el popup de PayPal, así que
                // solo el servidor la conoce. Marcamos delivery_method para que la página
                // de gracias no asuma "Recoger en Tienda" cuando falta la dirección.
                shipping_address: res.order?.shipping_address ?? null,
                delivery_method: 'shipping',
                order_items: items.map((it: any) => ({
                  product_name: it.product_title || it.product?.title || it.title || it.product_name || 'Producto',
                  quantity: it.quantity,
                  // price ya viene en pesos (no centavos) desde useOrderItems
                  price: it.price ?? it.unit_price ?? 0,
                  product_images: it.product?.images || it.images || it.product_images || [],
                  variant_name: it.variant_title || it.variant?.name || it.variant_name || null,
                })),
                created_at: new Date().toISOString(),
              }

              // Siempre escribe en localStorage — usa la orden del servidor si existe, o el respaldo.
              // checkout_token se agrega siempre para habilitar el botón "Rastrear mi pedido".
              localStorage.setItem(
                'completed_order',
                JSON.stringify({ checkout_token: checkoutToken, ...(res.order ?? fallbackOrder) })
              )
              const ordId = internalOrderId || data.orderID

              // Dispara Purchase (Pixel + CAPI + PostHog) con un guard unificado en
              // sessionStorage para que ThankYou no lo vuelva a disparar para esta orden.
              trackPH('checkout_payment_succeeded', {
                ...phBase(),
                order_id: ordId,
                paypal_status: res.status,
                has_server_order: !!res.order,
                has_shipping_address: !!res.order?.shipping_address,
                num_items: items.reduce((s: number, i: any) => s + (i.quantity || 0), 0),
              })

              const ptKey = `purchase_tracked_${ordId}`
              const alreadyTracked = (() => { try { return sessionStorage.getItem(ptKey) === '1' } catch { return false } })()
              if (!alreadyTracked) {
                try { sessionStorage.setItem(ptKey, '1') } catch {}
                trackPurchase({
                  products: items
                    .filter((it: any) => (it.quantity ?? 0) > 0)
                    .map((it: any) => tracking.createTrackingProduct({
                      id: it.product_id || it.id,
                      title: it.product_title || it.product?.title || it.title || it.product_name,
                      price: it.price ?? it.unit_price ?? 0,
                      category: 'product',
                      variant: it.variant_id ? { id: it.variant_id } : undefined,
                    })),
                  value: amount,
                  currency,
                  order_id: ordId,
                  custom_parameters: { payment_method: 'paypal', checkout_token: checkoutToken },
                })
              }

              clearCart()
              toast({
                title: '¡Pago exitoso!',
                description: 'Tu compra ha sido procesada correctamente.',
              })
              navigate(`/gracias/${ordId}`)
            } catch (err: unknown) {
              trackPH('checkout_payment_failed', {
                ...phBase(),
                stage: 'paypal_approve_exception',
                error_message: err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300),
              })
              toast({
                title: 'Error de PayPal',
                description: err instanceof Error ? err.message : 'Algo salió mal. Intenta de nuevo.',
                variant: 'destructive',
              })
            }
          }}
          onError={(err: unknown) => {
            trackPH('checkout_payment_failed', {
              ...phBase(),
              stage: 'paypal_sdk',
              error_message: err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300),
            })
            toast({
              title: 'Error de PayPal',
              description: err instanceof Error ? err.message : 'Algo salió mal. Intenta de nuevo.',
              variant: 'destructive',
            })
          }}
          onCancel={() => {
            // El usuario cerró el popup de PayPal sin completar el pago.
            trackPH('checkout_paypal_cancelled', phBase())
          }}
        />
      </PayPalScriptProvider>
    </div>
  )
}