# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar dark-themed. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP
- Added security line below CTA buttons
- Full checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **Precio actualizado: MX$749 → MX$699** (compare_at_price: MX$999) ✅

## ✅ BUG RESUELTO: "Comprar Ahora" → checkout vacío

### Root Cause
Race condition en `handleBuyNow`:
1. `addItem()` → dispatch a `useReducer` → actualización de estado asíncrona
2. `checkout()` → lee `cart.items` del estado que AÚN no se actualizó → 0 items → error

### Fix Aplicado

**Archivo 1: `src/hooks/useCheckout.ts`**
- Agregada función `checkoutWithItems(items: CartItem[], options)` que:
  - Acepta items directamente (no lee `cart.items` del estado)
  - Llama `createCheckoutFromCart` con esos items
  - Guarda `saveCheckoutState` en localStorage (orderId + checkoutToken)
  - NO llama `clearCart()` (Buy Now no debe limpiar otros productos del carrito)
  - Exportada en el return del hook

**Archivo 2: `src/components/headless/HeadlessProduct.tsx`**
- Imports agregados: `CartProductItem`, `useCheckout`
- Estado local `isBuyingNow` agregado (para UI loading state)
- `handleBuyNow` reescrito como `async`:
  1. Construye `buyNowItems: CartProductItem[]` desde variables locales (product, variantToAdd, selectedPlan, quantity)
  2. Llama `await checkoutWithItems(buyNowItems, { currencyCode })`
  3. Luego `navigate('/pagar')` — cuando checkout page monta, `useCheckoutState` ya tiene los datos en localStorage
- `isBuyingNow` exportado en el return (disponible para la UI)

### Por qué funciona
- `handleBuyNow` ya NO depende de que React haya procesado el setState de `addItem()`
- Items se construyen desde variables locales que ya existen en el closure
- `saveCheckoutState` escribe directo a `localStorage` — síncrono y disponible inmediatamente cuando `/pagar` carga

## 🔧 BUG PENDIENTE: /gracias muestra "Recoger en Tienda" en vez de la dirección

### Root Cause (2 problemas)

**Problema 1: `updateShippingAddress` no llama `updateOrderCache`**
- En `src/hooks/useCheckout.ts`, la función `updateShippingAddress` llama `updateCheckout()` (API) y recibe la respuesta con el order actualizado.
- PERO nunca llama `updateOrderCache(response.order)` → entonces el localStorage `checkout:{STORE_ID}` nunca se actualiza con la dirección.
- Cuando el pago exitoso ocurre en `StripePayment.tsx`, lee `parsed.order` del localStorage → `shipping_address` es `null` → guarda en `completed_order` sin dirección.
- `ThankYou.tsx` lee `completed_order.shipping_address` → `null` → fallback: "Recoger en Tienda".

**Problema 2: Nombres de campos distintos entre checkout y ThankYou**
- El checkout envía al backend: `country_name`, `state_name`, `postal_code`, `line1`, `line2`
- El backend devuelve el objeto tal como lo recibió
- `ThankYou.tsx` intenta leer: `address1`, `province`, `zip`, `country` (estilo Shopify)
- Aunque se fix el Problema 1, los campos no matchean → dirección no se mostraría bien

### Fix Plan

**Fix 1: `src/hooks/useCheckout.ts` — Llamar `updateOrderCache` en `updateShippingAddress`**

En la función `updateShippingAddress` (línea ~286), después de cada `updateCheckout()` exitoso, agregar:
```ts
if (response?.order) {
  updateOrderCache(response.order)
}
```
Esto aplica tanto en el bloque `immediate` como en el bloque `debounced`.

Importar `updateOrderCache` desde `useCheckoutState()` — ya está disponible en el destructuring de la línea 31:
```ts
const { ..., updateOrderCache, ... } = useCheckoutState()
```
✅ Ya está importado. Solo falta usarlo en `updateShippingAddress`.

**Fix 2: `src/pages/ThankYou.tsx` — Actualizar los nombres de campos**

Cambiar la sección de "Dirección de Envío" para usar los field names que realmente devuelve el backend:

```tsx
// ANTES (Shopify-style, incorrecto):
<p>{order.shipping_address.address1}</p>
<p>{order.shipping_address.city}, {order.shipping_address.province}</p>
<p>{order.shipping_address.zip} {order.shipping_address.country}</p>

// DESPUÉS (nombres reales del backend):
<p>{order.shipping_address.line1}</p>
{order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
<p>{order.shipping_address.city}, {order.shipping_address.state_name || order.shipping_address.province}</p>
<p>{order.shipping_address.postal_code || order.shipping_address.zip}</p>
<p>{order.shipping_address.country_name || order.shipping_address.country}</p>
```

Also make the check for `shipping_address` more robust — check that it has actual content (e.g., `order.shipping_address?.line1 || order.shipping_address?.address1`), not just that the key exists (could be empty object `{}`).

### Files to Modify
- `src/hooks/useCheckout.ts` — Add `updateOrderCache(response.order)` calls in `updateShippingAddress` (both immediate and debounced paths)
- `src/pages/ThankYou.tsx` — Fix field names to match backend response (`line1`, `state_name`, `postal_code`, `country_name`) + more robust null check

## Known Issues
- Other checkout inputs (email, name, address, etc.) may also show autofill in white if Chrome autofills them.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/components/CountryPhoneSelect.tsx` — phone input ✅
- `src/components/CartSidebar.tsx` — cart lateral ✅ dark theme complete
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — checkout logic
- `src/hooks/useCheckout.ts` — ✅ checkoutWithItems agregado | 🔧 updateShippingAddress needs updateOrderCache
- `src/hooks/useCheckoutState.ts` — manages localStorage state
- `src/components/headless/HeadlessProduct.tsx` — ✅ handleBuyNow corregido
- `src/pages/ThankYou.tsx` — 🔧 field names need fix

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content