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
- **BUG FIX: /gracias mostraba "Recoger en Tienda" — RESUELTO ✅**
- **Migración Express Checkout — Pasos 1-4 COMPLETADOS ✅**

## ✅ BUG RESUELTO: /gracias → dirección incorrecta

### Root Cause
- `StripePayment.tsx` ignoraba `data.order` del edge `payments-create-intent` (que sí incluye `shipping_address` desde el fix del backend)
- `ThankYou.tsx` usaba nombres de campo estilo Shopify (`address1`, `province`, `zip`, `first_name`) en lugar de los del backend (`line1`, `state`, `postal_code`, `name`)

### Fix Applied
**StripePayment.tsx:**
- Captura `intentOrder = data?.order` tras llamar `payments-create-intent`
- Lo pasa a `confirmCard(clientSecret, paymentItems, totalCents, intentOrder)`
- En `confirmCard`: si `intentOrder` existe, lo guarda directo en `localStorage.completed_order`; si no, usa el fallback del caché de checkout

**ThankYou.tsx:**
- El check de `shipping_address` ahora verifica que tenga `line1` o `address1` (no solo que exista el objeto)
- Lectura de campos con fallback dual: `line1 || address1`, `state || province`, `postal_code || zip`, `name || first_name + last_name`

---

## ✅ COMPLETADO: Migración Express Checkout (Stripe PaymentElement + Apple Pay / Google Pay)

### Pasos completados
1. ✅ `src/lib/country-codes.ts` — mapeo bidireccional ISO ↔ nombre en español
2. ✅ `src/components/ProductExpressCheckout.tsx` — PaymentRequestButton en PDP (lazy-load vía IntersectionObserver)
3. ✅ `src/components/StripePayment.tsx` — PaymentElement + LinkAuthenticationElement + AddressElement + ExpressCheckoutElement; fix de `intentOrder` preservado
4. ✅ `src/pages/ui/CheckoutUI.tsx` — integrado: `allowedCountries`, `deliveryMethodSlot`, `onAddressChange`, `onEmailChange`, `onLinkAuthChange`, `showAddressElement`, `addressElementComplete`, `stripeKey` estable, `isStripeReady` guard; dark theme 100% preservado

### ⏳ PENDIENTE: Paso 5
- `src/pages/ui/ProductPageUI.tsx` → insertar solo el bloque de Express Checkout (NO reemplazar el archivo completo):
  - Import: `import ProductExpressCheckout from "@/components/ProductExpressCheckout"`
  - State: `const [expressAvailable, setExpressAvailable] = useState(false)`
  - Justo antes del botón CTA "Agregar al carrito": `<ProductExpressCheckout ... onAvailabilityChange={setExpressAvailable} />` + divider condicional

### CRITICAL: intentOrder fix preservado en StripePayment.tsx
```
// After successful payment:
if (intentOrder) {
  localStorage.setItem('completed_order', JSON.stringify(intentOrder))
} else {
  const checkoutData = localStorage.getItem(`checkout:${STORE_ID}`)
  if (checkoutData) {
    const parsed = JSON.parse(checkoutData)
    if (parsed.order) localStorage.setItem('completed_order', JSON.stringify(parsed.order))
  }
}
```

---

## Known Issues
- Other checkout inputs (email, name, address, etc.) may show autofill in white if Chrome autofills them.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅ (dark brand rebrand done + Express Checkout integrado)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅ (intentOrder fix + PaymentElement + AddressElement)
- `src/components/ProductExpressCheckout.tsx` — PaymentRequestButton en PDP ✅
- `src/lib/country-codes.ts` — mapeo ISO ↔ español ✅
- `src/components/CartSidebar.tsx` — cart lateral ✅ dark theme complete
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — checkout logic
- `src/hooks/useCheckout.ts` — checkoutWithItems agregado
- `src/hooks/useCheckoutState.ts` — manages localStorage state
- `src/components/headless/HeadlessProduct.tsx` — handleBuyNow corregido ✅
- `src/pages/ThankYou.tsx` — ✅ field names fixed (line1/state/postal_code/name)

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content