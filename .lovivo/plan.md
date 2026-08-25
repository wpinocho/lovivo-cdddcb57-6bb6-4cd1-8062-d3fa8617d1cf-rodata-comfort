# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`
- **Cards de reseña con foto**: `aspect-square`. Fuente a `width=700`.
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`. Cambiar solo copy,
  imágenes, reviews y FAQ. Nunca reinventar el esqueleto.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.

---

## Active Plan — 📋 Instrumentación completa del funnel de checkout en PostHog (2026-08-25)

### Contexto / por qué
`posthog.init` tiene `autocapture: false` y Stripe corre dentro de un iframe → PostHog
literalmente no ve NINGÚN clic dentro del formulario de pago. Hoy, si alguien llega al
checkout y no compra, no hay forma de saber en qué paso murió ni si fue un rechazo de tarjeta.
Todo lo que no se instrumente explícitamente es invisible.

### AUDITORÍA — estado actual (verificado en código 2026-08-25)

Todos los eventos de negocio salen de `src/lib/tracking-utils.ts` → `trackHybrid()`, que dispara
en paralelo: Meta Pixel (browser) + Meta CAPI (edge `meta-capi`) + `posthog.capture(nombre.toLowerCase())`.

**✅ SÍ se envían hoy a PostHog:**
| Evento PostHog | Dónde se dispara |
|---|---|
| `$pageview` | `PostHogContext` loaded + `trackPageView()` |
| `viewcontent` | `HeadlessProduct.tsx:76` |
| `addtocart` | `HeadlessProduct.tsx:266` (ATC) y `:298` (Buy Now), `ProductAdapter:113`, `HeadlessProductCard:129` |
| `initiatecheckout` | `CheckoutAdapter.tsx:169` — guard `hasTrackedCheckout` ref, requiere `orderItems.length>0 && orderTotal>0` |
| `purchase` | `StripePayment:371` (tarjeta/Link), `StripePayment:600` (express wallet), `PaypalExpressButton:129`. Guard `sessionStorage['purchase_tracked_<orderId>']`. Lleva `custom_parameters.payment_method` = `stripe` / `express_checkout` / `paypal` |
| `search_performed` | `tracking-utils:339` |
| eventos de experimentos | `src/lib/experiments.ts:17` |
| `$exception` | `enable_exception_autocapture: true` |

**❌ FALTAN (todos los que pidió el cliente + los críticos que detecté):**
1. `checkout_contact_completed` — email válido capturado
2. `checkout_address_completed` — dirección completa
3. `checkout_shipping_method_selected` — método de envío elegido
4. `checkout_pay_clicked` — clic en pagar, **con método**
5. `checkout_validation_failed` — clic en pagar bloqueado por campos faltantes (¡diagnóstico oro!)
6. `checkout_payment_failed` — **con código y mensaje**. Hoy los fallos solo hacen `toast()` y `return`
7. `checkout_payment_succeeded` — separado de `purchase`
8. `checkout_payment_pending` — OXXO / SPEI. Hoy un voucher OXXO es indistinguible de un abandono
9. `checkout_items_unavailable` — producto agotado al momento de pagar (`handleUnavailableItems`)
10. `checkout_shipping_unavailable` — banner `shippingError`, zona no cubierta
11. `checkout_paypal_cancelled` — `onCancel` de PayPal está vacío (línea 167)
12. `identify` por email — `person_profiles: 'identified_only'` → hoy NO hay perfiles de persona

### DECISIÓN TÉCNICA CLAVE
NO usar `trackCustomEvent()` para estos: ese helper también manda a Meta Pixel y CAPI, lo que
metería basura (`checkout_payment_failed`) al pixel y podría empeorar el problema conocido de
duplicados. **Crear un helper PostHog-only.**

### Implementación

#### Paso 1 — `src/lib/tracking-utils.ts`: helper PostHog-only
Exportar fuera de la clase (o como método público que NO llame a `trackHybrid`):
```ts
export function trackPH(event: string, props: Record<string, any> = {}) {
  try {
    if (typeof window === 'undefined' || !posthog.__loaded) return;
    posthog.capture(event, props);
  } catch (e) { console.error('PH error', event, e); }
}
export function identifyCustomer(email: string, extra: Record<string, any> = {}) {
  try {
    if (!posthog.__loaded || !email) return;
    posthog.identify(email.toLowerCase().trim(), { email: email.toLowerCase().trim(), ...extra });
  } catch {}
}
```
Convención de propiedades comunes en TODOS los eventos de checkout:
`{ order_id, checkout_token, value, currency, num_items, payment_method }`.

#### Paso 2 — `src/pages/ui/CheckoutUI.tsx` (pasos del formulario)
- `onEmailChange` (L375): si el email pasa el regex y **cambió respecto al último trackeado**
  (usar un `useRef` para no disparar en cada tecla) → `trackPH('checkout_contact_completed', { has_email: true, order_id, checkout_token })`
  + `identifyCustomer(email, { store: 'rodata-mx' })`.
- `onAddressChange` (L340): cuando `complete === true` y no se había trackeado (ref guard) →
  `trackPH('checkout_address_completed', { country: address.country, state, postal_code, has_phone: !!phone, order_id })`.
  Si el usuario cambia de país después, permitir re-disparo solo si cambia el país.
- Radio de método de envío (`deliveryMethodSlot`, onChange L114) →
  `trackPH('checkout_shipping_method_selected', { method_type: method.type, shipping_cost, order_id })`.
- Dentro de `onValidationRequired` (L287): cuando `missing.length > 0` (justo antes del toast) →
  `trackPH('checkout_validation_failed', { missing_fields: missing, order_id })`.
  Esto responde directamente "¿por qué no avanzan?".
- `useEffect` sobre `logic.shippingError`: cuando pase de null a un valor →
  `trackPH('checkout_shipping_unavailable', { message: logic.shippingError, postal_code, country, order_id })`.

#### Paso 3 — `src/components/StripePayment.tsx` (pago con tarjeta / OXXO / SPEI)
En `handlePayment` (L267):
- Al entrar, **después** de pasar `onValidationRequired` y antes de `elements.submit()`:
  `trackPH('checkout_pay_clicked', { payment_method: 'stripe_element', amount: amountCents/100, currency, num_items: paymentItems.length, order_id, checkout_token })`.
  Nota: Stripe no expone qué tab del PaymentElement eligió el usuario antes de confirmar; usar
  `pi.payment_method_types` / `pi.payment_method` de la respuesta para enriquecer los eventos
  posteriores con el método real (`card`, `oxxo`, `customer_balance`, `link`).
- `submitError` (L285) → `trackPH('checkout_payment_failed', { stage: 'elements_submit', error_code: submitError.code, error_type: submitError.type, error_message: submitError.message, order_id })`.
- `handleUnavailableItems` (L251) → dentro del `if`, `trackPH('checkout_items_unavailable', { items: data.unavailable_items.map(i => i.product_name), order_id })`.
- `result.error` de `confirmPayment` (L357) → `trackPH('checkout_payment_failed', { stage: 'confirm_payment', error_code: result.error.code, decline_code: (result.error as any).decline_code, error_type: result.error.type, error_message: result.error.message, payment_method: 'stripe', order_id })`.
  **Este es el evento más importante de todos** — separa "no quiso comprar" de "el banco le rechazó la tarjeta".
- `pi.status === 'succeeded'` (L365) → antes de `trackPurchase`, `trackPH('checkout_payment_succeeded', { payment_method: 'stripe', pi_status: pi.status, value: totalCents/100, currency, order_id, checkout_token })`.
- OXXO (L405) → `trackPH('checkout_payment_pending', { payment_method: 'oxxo', value, currency, order_id })`.
- SPEI (L420) → `trackPH('checkout_payment_pending', { payment_method: 'spei', ... })`.
- `requires_action` genérico (L436) → `trackPH('checkout_payment_action_required', { order_id })` (probable 3DS).
- `pi.status === 'processing'` (L439) → `checkout_payment_pending` con `payment_method: 'processing'`.
- Rama `else` desconocida (L443) → `trackPH('checkout_payment_unknown_status', { status: pi?.status, order_id })`.
- `catch (err)` / `handlePaymentError` (L454) → `trackPH('checkout_payment_failed', { stage: 'exception', error_message: err?.message?.slice(0,300), is_stripe_not_connected: lowered.includes('stripe_not_connected'), order_id })`.

En `handleExpressCheckoutConfirm` (L475) — Apple Pay / Google Pay:
- Al entrar: `trackPH('checkout_pay_clicked', { payment_method: 'express_checkout', wallet: ev?.expressPaymentType ?? 'unknown', ... })`.
- Falta de dirección (L515) → `trackPH('checkout_validation_failed', { missing_fields: ['shipping_address'], payment_method: 'express_checkout' })`.
- `submitError` / `result.error` → mismos `checkout_payment_failed` con `payment_method: 'express_checkout'`.
- `succeeded` (L595) → `checkout_payment_succeeded` con `payment_method: 'express_checkout'`.

#### Paso 4 — `src/components/PaypalExpressButton.tsx`
- `createOrder` (L62), al entrar → `trackPH('checkout_pay_clicked', { payment_method: 'paypal', amount, currency, order_id: orderId, checkout_token })`.
- Envolver la llamada a `paypal-create-order` en try/catch → en el catch,
  `trackPH('checkout_payment_failed', { stage: 'paypal_create_order', error_message, payment_method: 'paypal' })` y re-lanzar.
- `onApprove`: si `!res?.ok || res.status !== 'COMPLETED'` (L87) →
  `trackPH('checkout_payment_failed', { stage: 'paypal_capture', paypal_status: res?.status, error_message: res?.error, payment_method: 'paypal' })`.
- Éxito (antes de `trackPurchase`, L129) → `trackPH('checkout_payment_succeeded', { payment_method: 'paypal', value: amount, currency, order_id: ordId, has_server_order: !!res.order, has_shipping_address: !!res.order?.shipping_address })`.
  El flag `has_shipping_address` sirve para monitorear el Known Issue de la dirección de PayPal.
- `catch` de `onApprove` (L152) → `checkout_payment_failed` con `stage: 'paypal_approve_exception'`.
- `onError` (L160) → `trackPH('checkout_payment_failed', { stage: 'paypal_sdk', error_message, payment_method: 'paypal' })`.
- `onCancel` (L167) — hoy vacío → `trackPH('checkout_paypal_cancelled', { order_id: orderId, amount })`.

#### Paso 5 — `src/pages/PendingPayment.tsx` (opcional pero recomendado)
Al montar, leer `sessionStorage.pending_payment` y disparar
`trackPH('pending_payment_viewed', { payment_method: method, order_id })`.
Permite medir la tasa real de conversión de OXXO (cuántos vouchers se generan vs. se pagan).

### Cómo validar después de construir
1. Abrir el checkout en preview → consola con `debug: true` en dev muestra cada `posthog.capture`.
2. PostHog → Activity (live events) filtrando por `checkout_`.
3. Armar un funnel en PostHog: `initiatecheckout` → `checkout_contact_completed` →
   `checkout_address_completed` → `checkout_pay_clicked` → `checkout_payment_succeeded` → `purchase`.
4. Insight de barras: `checkout_payment_failed` desglosado por `error_code` y `decline_code`.

---

## Recent Changes
- **📋 Plan: instrumentación de eventos de checkout en PostHog** (2026-08-25) — auditoría completa;
  hoy solo hay viewcontent/addtocart/initiatecheckout/purchase. Faltan 12 eventos (pay_clicked,
  payment_failed con código, payment_succeeded, pending OXXO/SPEI, validation_failed, identify).
- **✅ Ajustes finos `/repartidores`** (2026-08-20, tanda 3) — swap Beneficio 01↔03, reseñas a
  `aspect-square` (+`width=700`), copy de "Se paga solo" a horizonte semanal.
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2) — lifestyle, 3 beneficios,
  quote break y 5 reseñas remapeados; se agregó reseña "Marco V." (Querétaro) para llegar a 6.
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1) — galería del producto (5 fotos).
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — `src/pages/ui/DeliveryPDPUI.tsx`.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`

### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `SB_MSG/1775768374485-uca4dkx21g.webp`
- PRODUCT_FLAT: `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5: `SB_PROD/review-1..5.webp`
- AVATAR_CARLOS/JORGE/ANDRES: `SB_PROD/avatar-carlos-v3.webp`, `avatar-jorge-v3.webp`, `avatar-andres-v3.webp`

### Avatar repartidor — fotografía REAL vigente
Bucket `SB_MSG`. Galería producto (prefijo `1787249204164-`): `ifubpmh955s`, `h4pa1xnbjw`,
`5rlwxy193t3`, `r9dtbwqmwaa`, `7ws595nt61i`.
Resto (prefijo `1787251752010-`): lifestyle `uvy9yh7965f`; Beneficio 01 `mf34bj94nqm`,
02 `h6de90gdd6`, 03 `dxk60x3zg28`; quote `2b6138nc4z9`; reseñas `jotniqhksrb`, `13eliul1j8io`,
`jos9p0cz468`, `wdpx2luqeyp`, `muvx1aec14`, + `SB_PROD/review-5.webp`.
- **DEPRECADAS (IA, rechazadas)**: `SB_PROD/dlv-hero.webp`, `dlv-feat-1/2/3.webp`
- **SIN USO (tanda 1)**: `SB_MSG/1787249204164-0fhnu1sec2e`, `-v5k7gqoh4rq`, `-w8rmrhw4b6k`, `-sobj1wnq3sg`

### Creativos de ads validados
- `SB_MSG/1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `SB_MSG/1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `SB_MSG/1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **Checkout ciego en PostHog (2026-08-25)**: `autocapture: false` + Stripe en iframe → cero
  visibilidad de clics dentro del formulario de pago. Solución = plan activo de instrumentación.
- **Sin perfiles de persona (2026-08-25)**: `person_profiles: 'identified_only'` y nunca se llama
  `posthog.identify()` → no se puede cruzar sesión con cliente/email.
- **Fallos de pago silenciosos (2026-08-25)**: todos los errores de Stripe y PayPal solo muestran
  un `toast()`; nada se registra en ningún lado.
- **PayPal MX — falta prueba real (2026-08-18)**: fix implementado pero nunca probado punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve `res.order.shipping_address`.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/contexts/PostHogContext.tsx` — init PostHog (autocapture off, identified_only)
- `src/lib/tracking-utils.ts` — `trackHybrid` (Pixel + CAPI + PostHog) + `getAttributionPayload`
- `src/adapters/CheckoutAdapter.tsx` — `initiatecheckout` en L169; `orderItems`
- `src/pages/ui/CheckoutUI.tsx` — checkout; PayPal L263, Stripe L273, validación L287, address L340
- `src/components/StripePayment.tsx` — `handlePayment` L267, express L475, errores L357/L454
- `src/components/PaypalExpressButton.tsx` — createOrder L62, onApprove L78, onError L160, onCancel L167
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP
- `src/components/headless/HeadlessProduct.tsx` — viewcontent L76, addtocart L266/L298
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/PendingPayment.tsx` — OXXO / SPEI
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — control del test
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Construir la instrumentación de checkout en PostHog (plan activo arriba).
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code` una vez instrumentado.
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y validar recortes.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token` (como `OrderTrack`).
- **[MEDIA]** Avatares propios de repartidores para las reseñas.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.