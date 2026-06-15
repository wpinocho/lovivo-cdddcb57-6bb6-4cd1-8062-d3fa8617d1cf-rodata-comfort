# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar dark-themed. Store is ready for paid traffic.

## Recent Changes
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) — DB + IndexUI.tsx (4 ocurrencias) ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **BUG FIX: /gracias mostraba "Recoger en Tienda" — RESUELTO ✅**
- **Migración Express Checkout — Pasos 1-5 COMPLETADOS ✅**
- **Stripe Elements dark theme — RESUELTO ✅** (`src/lib/stripe-appearance.ts` + `StripePayment.tsx`)
- **ExpressCheckoutElement: paymentMethodOrder + maxRows + buttonHeight ✅**
- **BUG FIX: validateCheckoutFields bloqueaba pago con AddressElement — RESUELTO ✅**
- **trackPurchase en Express Checkout handler — RESUELTO ✅**
- **BUG FIX: isValidPhone rechazaba E.164 sin espacio (+525531245632) — RESUELTO ✅**

---

## ✅ RESUELTO: Phone no llegaba a clients-upsert

### Root Cause
`isValidPhone` usaba `/^\+\d+\s?/` (greedy) para quitar el prefijo de `+525531245632`.
El `\d+` consumía TODOS los dígitos → `phoneWithoutPrefix = ''` → `digitsOnly.length = 0` → retornaba `false`.
`normalizePhoneNumber` llama primero a `isValidPhone` → retornaba `null` → teléfono excluido del payload.

### Fix aplicado en `src/adapters/CheckoutAdapter.tsx`
Reemplazada `isValidPhone` para contar el total de dígitos (incluye código de país):
```js
const isValidPhone = (phoneValue: string) => {
  if (!phoneValue.trim()) return false;
  const digitsOnly = phoneValue.replace(/[^\d]/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};
```
MX: +52 (2) + 10 local = 12 dígitos → pasa. Mínimo 7 excluye números claramente inválidos.

---

## ✅ COMPLETADO: trackPurchase en Express Checkout

### Cambio aplicado en `StripePayment.tsx`
Dentro del handler `onConfirm` del `ExpressCheckoutElement`, inmediatamente después de `if (pi?.status === 'succeeded') {`:
```ts
trackPurchase({
  products: paymentItems.map((item: any) => tracking.createTrackingProduct({
    id: item.product_id, title: item.product_name || item.title,
    price: item.price / 100, category: 'product',
    variant: item.variant_id ? { id: item.variant_id } : undefined
  })),
  value: totalCents / 100, currency: tracking.getCurrencyFromSettings(currency),
  order_id: orderId,
  custom_parameters: { payment_method: 'express_checkout', checkout_token: checkoutToken }
})
```

---

## ✅ COMPLETADO: Fix validación checkout con Stripe AddressElement

### Fix aplicado en `CheckoutUI.tsx`
- Reemplazado `onValidationRequired={logic.validateCheckoutFields}` por función custom inline
- Si `!logic.usePickup`: valida solo `email` + `addressElementComplete` + método de envío
- Si `logic.usePickup`: sigue usando `logic.validateCheckoutFields()` completo

---

## ✅ COMPLETADO: Express Checkout — Orden de botones y altura

### Fix aplicado en `StripePayment.tsx`
```
layout: { overflow: 'auto', maxColumns: 2, maxRows: 1 },
buttonHeight: 44,
paymentMethodOrder: ['applePay', 'googlePay', 'link'],
```

---

## ✅ COMPLETADO: Stripe Elements Dark Theme

- Creado `src/lib/stripe-appearance.ts` con `getStripeAppearance('dark' | 'light')`
- Modo `'dark'`: usa `theme: 'night'` + tokens dark de rodata.mx hardcodeados
- `StripePayment.tsx`: reemplazado bloque de appearance inline por `getStripeAppearance('dark')`

---

## ✅ COMPLETADO: Migración Express Checkout

### CTA Order (PDP)
1. `<ProductExpressCheckout>` — aparece solo si Apple Pay / Google Pay disponibles
2. Divider "— o —" — solo si `expressAvailable === true`
3. **Comprar ahora** (btn-amber-lg, primario)
4. **Agregar al carrito** (btn-outline-light, secundario)

---

## ✅ BUG RESUELTO: /gracias → dirección incorrecta

- `StripePayment.tsx`: captura `intentOrder = data?.order` y lo guarda en localStorage
- `ThankYou.tsx`: lectura de campos con fallback dual

---

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/lib/stripe-appearance.ts` — ✅
- `src/components/ProductExpressCheckout.tsx` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content