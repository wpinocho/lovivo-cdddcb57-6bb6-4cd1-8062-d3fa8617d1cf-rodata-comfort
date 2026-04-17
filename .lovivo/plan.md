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
- **Migración Express Checkout — Pasos 1-5 COMPLETADOS ✅**
- **Stripe Elements dark theme — RESUELTO ✅** (`src/lib/stripe-appearance.ts` + `StripePayment.tsx`)
- **BUG FIX: PDP Express Checkout botón desaparecía ✅** — Root cause: `stripePromise` se recreaba cuando settings cargaban (chargeType/stripeAccountId undefined → real value), remontando `<Elements>` y re-corriendo `canMakePayment()` con nueva instancia Stripe Connect. Fix: esperar `!settingsLoading` antes de montar `<Elements>`, eliminado `IntersectionObserver` innecesario.

## ✅ COMPLETADO: Stripe Elements Dark Theme

### Root Cause
`getComputedStyle(document.documentElement)` leía variables de `:root` (tema claro → `--background: 200 18% 97%` ≈ blanco), porque la página de checkout usa fondos oscuros hardcodeados (`bg-[#111315]`) sin agregar `.dark` al `<html>`.

### Solución
- Creado `src/lib/stripe-appearance.ts` con `getStripeAppearance('dark' | 'light')`
- Modo `'dark'`: usa `theme: 'night'` + tokens dark de rodata.mx hardcodeados
- Modo `'light'`: lee CSS vars de `:root` en runtime (para stores futuras en modo claro)
- `StripePayment.tsx`: reemplazado bloque de appearance inline por `getStripeAppearance('dark')`

### Tokens dark mapeados
| Stripe variable | Valor |
|---|---|
| colorBackground | hsl(214 10% 13%) — graphite |
| colorText | hsl(200 18% 97%) — offwhite |
| colorPrimary | hsl(34 62% 48%) — amber |
| colorTextSecondary | hsl(210 13% 60%) |
| colorDanger | hsl(0 72% 50%) |
| borderRadius | 0.375rem |
| fontFamily | Inter |

---

## ✅ COMPLETADO: Migración Express Checkout (Stripe PaymentElement + Apple Pay / Google Pay)

### Pasos completados
1. ✅ `src/lib/country-codes.ts` — mapeo bidireccional ISO ↔ nombre en español
2. ✅ `src/components/ProductExpressCheckout.tsx` — PaymentRequestButton en PDP; settings-gated mount (no IntersectionObserver)
3. ✅ `src/components/StripePayment.tsx` — PaymentElement + LinkAuthenticationElement + AddressElement + ExpressCheckoutElement; fix de `intentOrder` preservado; dark appearance via `getStripeAppearance('dark')`
4. ✅ `src/pages/ui/CheckoutUI.tsx` — integrado: `allowedCountries`, `deliveryMethodSlot`, `onAddressChange`, `onEmailChange`, `onLinkAuthChange`, `showAddressElement`, `addressElementComplete`, `stripeKey` estable, `isStripeReady` guard; dark theme 100% preservado
5. ✅ `src/pages/ui/ProductPageUI.tsx` — Express Checkout insertado encima de los CTAs

### CTA Order (PDP)
1. `<ProductExpressCheckout>` — aparece solo si Apple Pay / Google Pay disponibles
2. Divider "— o —" — solo si `expressAvailable === true`
3. **Comprar ahora** (btn-amber-lg, primario)
4. **Agregar al carrito** (btn-outline-light, secundario)

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

## ✅ BUG RESUELTO: /gracias → dirección incorrecta

### Root Cause
- `StripePayment.tsx` ignoraba `data.order` del edge `payments-create-intent`
- `ThankYou.tsx` usaba nombres de campo estilo Shopify en lugar de los del backend

### Fix Applied
- `StripePayment.tsx`: captura `intentOrder = data?.order` y lo guarda en localStorage
- `ThankYou.tsx`: lectura de campos con fallback dual: `line1 || address1`, `state || province`, etc.

---

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ (Express Checkout + CTAs ordenados)
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅ (dark brand rebrand done + Express Checkout integrado)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅ (intentOrder fix + PaymentElement + AddressElement + dark appearance)
- `src/lib/stripe-appearance.ts` — ✅ helper getStripeAppearance('dark'|'light')
- `src/components/ProductExpressCheckout.tsx` — PaymentRequestButton en PDP ✅ (settings-gated, no lazy observer)
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