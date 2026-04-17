# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar dark-themed. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **Precio actualizado: MX$749 → MX$699** (compare_at_price: MX$999) ✅

## ✅ BUG RESUELTO: "Comprar Ahora" → checkout vacío
(same as before — kept for reference)

---

## 🔧 BUG FIX: /gracias muestra "Recoger en Tienda" en vez de la dirección

### Root Cause (confirmed)
The edge function `payments-create-intent` NOW returns `order.shipping_address` in its response (fix applied server-side by user). But `StripePayment.tsx` ignores `data.order` completely — it only reads `data.client_secret`. 

When payment succeeds (confirmCard), it reads `localStorage.getItem('checkout:{STORE_ID}')` → `parsed.order` → saves to `completed_order`. But that cached order never had `shipping_address` because `updateShippingAddress` never called `updateOrderCache`. So `completed_order.shipping_address` is null → ThankYou shows "Recoger en Tienda".

Additionally, ThankYou.tsx uses Shopify-style field names (`address1`, `province`, `zip`, `first_name`, `last_name`) but the backend returns `line1`, `state`, `postal_code`, `name`.

### Fix Plan

#### File 1: `src/components/StripePayment.tsx`

In `handlePayment()`, capture `data.order` from the `payments-create-intent` response and pass it to `confirmCard`:

```ts
// In handlePayment, non-subscription path:
const data = await callEdge("payments-create-intent", payload)
if (handleUnavailableItems(data)) return
client_secret = data?.client_secret
// Pass the order from the response to confirmCard
const intentOrder = data?.order ?? null
// ...
await confirmCard(client_secret, paymentItems, totalCents, intentOrder)
```

In `confirmCard`, add `intentOrder: any` as 4th parameter. When payment succeeds, use `intentOrder` (from create-intent response which now has `shipping_address`) instead of reading stale localStorage:

```ts
const confirmCard = async (clientSecret: string, paymentItems: any[], totalCents: number, intentOrder?: any) => {
  // ... existing stripe confirm logic ...
  
  if (result.paymentIntent?.status === "succeeded") {
    // ... trackPurchase ...
    
    // Save order for ThankYou page — prefer intentOrder (has shipping_address)
    try {
      if (intentOrder) {
        localStorage.setItem('completed_order', JSON.stringify(intentOrder))
      } else {
        // Fallback: old behavior reading from checkout cache
        const checkoutData = localStorage.getItem(`checkout:${STORE_ID}`)
        if (checkoutData) {
          const parsed = JSON.parse(checkoutData)
          if (parsed.order) {
            localStorage.setItem('completed_order', JSON.stringify(parsed.order))
          }
        }
      }
    } catch {}
    
    clearCart()
    navigate(`/gracias/${orderId}`)
    toast({ title: "¡Pago exitoso!", description: "Tu compra ha sido procesada exitosamente." })
  }
}
```

#### File 2: `src/pages/ThankYou.tsx`

Fix field names in the shipping address display section (lines ~188-205). The backend returns: `name`, `line1`, `line2`, `city`, `state`, `postal_code`, `country`, `phone`.

Replace:
```tsx
<p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
<p>{order.shipping_address.address1}</p>
{order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
<p>{order.shipping_address.city}, {order.shipping_address.province}</p>
<p>{order.shipping_address.zip} {order.shipping_address.country}</p>
{order.shipping_address.phone && <p>Teléfono: {order.shipping_address.phone}</p>}
```

With:
```tsx
<p>{order.shipping_address.name || `${order.shipping_address.first_name || ''} ${order.shipping_address.last_name || ''}`.trim()}</p>
<p>{order.shipping_address.line1 || order.shipping_address.address1}</p>
{(order.shipping_address.line2 || order.shipping_address.address2) && 
  <p>{order.shipping_address.line2 || order.shipping_address.address2}</p>}
<p>{order.shipping_address.city}, {order.shipping_address.state || order.shipping_address.province}</p>
<p>{order.shipping_address.postal_code || order.shipping_address.zip} {order.shipping_address.country}</p>
{order.shipping_address.phone && <p>Tel: {order.shipping_address.phone}</p>}
```

Also make the `shipping_address` check more robust — check it has actual content (not empty object):
```tsx
{order.shipping_address && (order.shipping_address.line1 || order.shipping_address.address1) ? (
  // show address
) : (
  // show "Recoger en Tienda"
)}
```

### Files to Modify
- `src/components/StripePayment.tsx` — capture `data.order` from create-intent, pass to confirmCard, use it in success handler
- `src/pages/ThankYou.tsx` — fix field names + robust null check

### Notes
- No need to add `order-get` edge call from frontend (adds complexity, not needed for this fix)
- The `data.order` from `payments-create-intent` is the freshest source of truth since the edge re-reads from DB after writing `shipping_address`
- Both fixes are independent: ThankYou field names fix is a standalone improvement regardless

---

## Known Issues
- Other checkout inputs (email, name, address, etc.) may show autofill in white if Chrome autofills them.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/components/CountryPhoneSelect.tsx` — phone input ✅
- `src/components/CartSidebar.tsx` — cart lateral ✅ dark theme complete
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — checkout logic
- `src/hooks/useCheckout.ts` — checkoutWithItems agregado
- `src/hooks/useCheckoutState.ts` — manages localStorage state
- `src/components/headless/HeadlessProduct.tsx` — handleBuyNow corregido ✅
- `src/pages/ThankYou.tsx` — 🔧 field names need fix

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content