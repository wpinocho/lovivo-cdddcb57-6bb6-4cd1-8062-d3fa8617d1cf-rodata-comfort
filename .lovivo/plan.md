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

## 🔄 IN PROGRESS: Migración Express Checkout (Stripe PaymentElement + Apple Pay / Google Pay)

### Objetivo
Agregar PaymentElement (reemplaza CardElement), ExpressCheckoutElement (Apple Pay / Google Pay / Link) en /pagar,
y PaymentRequestButton en la PDP para compras de un clic desde wallets.

### Pre-flight check completado
- ✅ `SettingsContext.tsx`: ya expone `stripeAccountId` y `chargeType` — NO tocar
- ✅ `react-intersection-observer`: ya instalado
- ❌ `src/lib/country-codes.ts`: NO existe — crear nuevo (copiar del template)
- 🔄 `src/components/StripePayment.tsx`: usar CardElement → migrar a PaymentElement + ExpressCheckoutElement. IMPORTANTE: el fix de `intentOrder` (captura de `data?.order` y guarda en `localStorage.completed_order`) debe preservarse en el nuevo archivo
- 🔄 `src/pages/ui/CheckoutUI.tsx`: integrar AddressElement, deliveryMethodSlot, mapeo country ISO ↔ nombre. Preservar dark theme de rodata.mx
- 🔄 `src/pages/ui/ProductPageUI.tsx`: insertar `<ProductExpressCheckout>` arriba del botón CTA. TODO el contenido de rodata.mx se preserva
- ❌ `src/components/ProductExpressCheckout.tsx`: NO existe — crear nuevo (copiar del template)

### Orden de implementación (user pega template code → AI aplica)
1. `src/lib/country-codes.ts` → copiar 1:1 del template (archivo nuevo, sin conflictos)
2. `src/components/ProductExpressCheckout.tsx` → copiar 1:1 del template (archivo nuevo)
3. `src/components/StripePayment.tsx` → reemplazar con versión del template, portando el fix de `intentOrder`:
   - En `confirmCard()` / `confirmPayment()`: si `intentOrder` existe → `localStorage.setItem('completed_order', JSON.stringify(intentOrder))`; si no, fallback al caché de checkout
   - Si la nueva versión usa `confirmPayment` unificado en lugar de `confirmCardPayment`, el fix va ahí
4. `src/pages/ui/CheckoutUI.tsx` → reemplazar con versión del template, preservando dark theme tokens:
   - `bg-[#111315]`, `bg-[#1D2125]`, `border-white/[0.08]`, `text-brand-offwhite`, `text-brand-smoke`, `text-brand-steel`, `brand-amber`
   - Los colores de SelectItem, Input, Checkbox, botones se mantienen igual
5. `src/pages/ui/ProductPageUI.tsx` → insertar solo el bloque de Express Checkout (NO reemplazar el archivo completo):
   - Import: `import ProductExpressCheckout from "@/components/ProductExpressCheckout"`
   - State: `const [expressAvailable, setExpressAvailable] = useState(false)`
   - Justo antes del botón CTA "Agregar al carrito": `<ProductExpressCheckout ... onAvailabilityChange={setExpressAvailable} />` + divider condicional

### CRITICAL: intentOrder fix to preserve in new StripePayment.tsx
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
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅ (intentOrder fix applied)
- `src/components/CountryPhoneSelect.tsx` — phone input ✅
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