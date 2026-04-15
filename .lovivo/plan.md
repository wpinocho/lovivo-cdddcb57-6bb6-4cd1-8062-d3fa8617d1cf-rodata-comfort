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
- `src/hooks/useCheckout.ts` — ✅ checkoutWithItems agregado
- `src/hooks/useCheckoutState.ts` — manages localStorage state
- `src/components/headless/HeadlessProduct.tsx` — ✅ handleBuyNow corregido

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content