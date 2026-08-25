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

## Active Plan — ✅ Instrumentación de checkout en PostHog IMPLEMENTADA (2026-08-25)

### Qué se construyó
Helper **PostHog-only** en `src/lib/tracking-utils.ts` (exports fuera de la clase):
- `trackPH(event, props)` — `posthog.capture` directo, guard `__loaded`, limpia undefined/null/'',
  log en dev. **NO pasa por `trackHybrid`** → nunca toca Meta Pixel/CAPI (evita ensuciar el pixel
  y agravar el issue de duplicados).
- `identifyCustomer(email, extra)` — `posthog.identify(email)` para crear person profiles
  (el proyecto corre con `person_profiles: 'identified_only'`).

Propiedades comunes en todos los eventos: `order_id`, `checkout_token`, `value`, `currency`
(en Stripe vía helper local `phBase()`; en PayPal vía `phBase()` propio).

### Eventos ahora emitidos (además de los que ya había)

| Evento | Archivo | Detalle |
|---|---|---|
| `checkout_contact_completed` | CheckoutUI `onEmailChange` | ref-guard `trackedEmailRef`, solo email válido y nuevo. Dispara también `identifyCustomer(email, {store:'rodata-mx'})` |
| `checkout_address_completed` | CheckoutUI `onAddressChange` | ref-guard por `country|postal_code`. Props: country, state, city, postal_code, has_phone |
| `checkout_shipping_method_selected` | CheckoutUI radio envío | method_type, shipping_cost |
| `checkout_validation_failed` | CheckoutUI `onValidationRequired` + Stripe (pickup) + express (sin dirección) | `missing_fields[]` |
| `checkout_shipping_unavailable` | CheckoutUI `<ShippingErrorTracker>` (componente null nuevo) | escucha `logic.shippingError` |
| `checkout_pay_clicked` | StripePayment `handlePayment` / `handleExpressCheckoutConfirm` / PayPal `createOrder` | `payment_method` = `stripe_element` / `express_checkout` (+`wallet`) / `paypal`, `num_items` |
| `checkout_payment_failed` | Stripe (elements_submit, confirm_payment, exception) · PayPal (create_order, capture, approve_exception, sdk) | `stage`, `error_code`, `decline_code`, `error_type`, `error_message`, `is_stripe_not_connected` |
| `checkout_payment_succeeded` | Stripe card, express y PayPal | separado de `purchase`; PayPal lleva `has_shipping_address` y `has_server_order` |
| `checkout_payment_pending` | OXXO, SPEI, `processing` (card y express) | `payment_method`: oxxo / spei / processing / express_checkout |
| `checkout_payment_action_required` | requires_action genérico (3DS) | |
| `checkout_payment_unknown_status` | rama else de `pi.status` | |
| `checkout_items_unavailable` | `handleUnavailableItems` | lista de `product_name` |
| `checkout_paypal_cancelled` | `onCancel` de PayPal (antes vacío) | |
| `pending_payment_viewed` | `PendingPayment.tsx` al montar | mide conversión real de OXXO |

### Validación pendiente (hacer en PostHog)
1. Preview del checkout → consola muestra `📊 PostHog: <evento>` en dev.
2. PostHog → Activity, filtrar por `checkout_`.
3. Funnel de 6 pasos: `initiatecheckout` → `checkout_contact_completed` →
   `checkout_address_completed` → `checkout_pay_clicked` → `checkout_payment_succeeded` → `purchase`.
4. Insight de barras: `checkout_payment_failed` desglosado por `error_code` y `decline_code`.
5. Insight: `checkout_validation_failed` desglosado por `missing_fields`.

---

## Recent Changes
- **✅ Instrumentación completa de checkout en PostHog** (2026-08-25) — 14 eventos nuevos +
  `trackPH`/`identifyCustomer` en `tracking-utils.ts`. Tocados: CheckoutUI, StripePayment,
  PaypalExpressButton, PendingPayment. Falta armar los insights en PostHog.
- **📋 Plan: instrumentación de eventos de checkout en PostHog** (2026-08-25) — auditoría previa.
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
- **Insights de PostHog sin armar (2026-08-25)**: los eventos ya se emiten pero el funnel de
  6 pasos y el desglose de `error_code` aún no existen en el dashboard.
- **PayPal MX — falta prueba real (2026-08-18)**: fix implementado pero nunca probado punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve `res.order.shipping_address`.
  Ahora monitoreable con `checkout_payment_succeeded.has_shipping_address`.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)
- **Nota**: Stripe no expone qué tab del PaymentElement eligió el usuario antes de confirmar.
  El método real se infiere de `pi.payment_method_types[0]` → prop `stripe_method`.

## Key Files
- `src/contexts/PostHogContext.tsx` — init PostHog (autocapture off, identified_only)
- `src/lib/tracking-utils.ts` — `trackHybrid` (Pixel + CAPI + PostHog), `getAttributionPayload`,
  **`trackPH` y `identifyCustomer` (PostHog-only, al final del archivo)**
- `src/adapters/CheckoutAdapter.tsx` — `initiatecheckout`
- `src/pages/ui/CheckoutUI.tsx` — checkout + `ShippingErrorTracker` + refs de guard PostHog
- `src/components/StripePayment.tsx` — `phBase()`, `handlePayment`, `handleExpressCheckoutConfirm`,
  `handlePaymentError(err, method)`
- `src/components/PaypalExpressButton.tsx` — `phBase()`, createOrder/onApprove/onError/onCancel
- `src/components/headless/HeadlessProduct.tsx` — viewcontent, addtocart
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/PendingPayment.tsx` — OXXO / SPEI + `pending_payment_viewed`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos nuevos lleguen (compra de prueba).
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code` / `decline_code`.
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y validar recortes.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token` (como `OrderTrack`).
- **[MEDIA]** Avatares propios de repartidores para las reseñas.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.