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
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca mostrar el string crudo de
  Stripe/PayPal. Banner persistente (no toast) + siguiente paso concreto + alternativa de pago.
  Nunca exponer texto interno de plataforma ("dashboard de Lovivo") al cliente final.

---

## Active Plan — ✅ Recuperación de pagos rechazados IMPLEMENTADA (2026-09-03)

### Qué se construyó
Arquitectura elegida: **store externo con `useSyncExternalStore`** en lugar de un React Context.
Razón: `StripePayment` vive dentro de `<Elements>` y `PaypalExpressButton` es hermano fuera de él;
un store a nivel de módulo comparte estado sin reestructurar `CheckoutUI` (0 cambios ahí).

**Archivos nuevos (3)**
1. `src/lib/payment-errors.ts` — `mapPaymentError()` + `FriendlyPaymentError`.
   ~30 códigos mapeados (decline_code primero, luego error_code, luego `type`, luego heurística
   sobre el mensaje crudo, luego fallback). Kinds: `declined | funds | card_data | auth | network |
   cancelled | unavailable | unknown`. Cada receta trae `tone` ('error' rojo / 'neutral' ámbar) y
   `suggestAlternatives`.
2. `src/lib/payment-recovery.ts` — store + `usePaymentRecovery()`.
   Estado: `failure`, `attempts`, `focusToken`, `alternatives {paypal, oxxo, spei}`.
   API: `reportPaymentFailure(err, {focus})`, `clearPaymentFailure()`, `requestPaymentFocus()`,
   `setPaymentAlternatives()`, `resetPaymentRecovery()`.
   Constantes de ancla: `PAYMENT_SECTION_ANCHOR_ID`, `PAYPAL_ANCHOR_ID`.
3. `src/components/PaymentRecoveryBanner.tsx` — banner persistente, dismissible, `role="alert"`.
   Scroll automático (`scrollIntoView`, respeta `prefers-reduced-motion`) al aparecer o cuando
   sube `focusToken`. Chips de alternativas solo si `suggestAlternatives || attempts >= 2`,
   filtradas por los métodos REALMENTE activos.

**Archivos modificados (3)**
- `StripePayment.tsx`: 4 puntos de fallo migrados de toast → `reportPaymentFailure`
  (elements.submit, confirmPayment, express submit, express confirm) + `handlePaymentError`.
  `clearPaymentFailure()` al inicio de `handlePayment` y `handleExpressCheckoutConfirm`.
  Banner renderizado arriba del `<PaymentElement>` en `<div id={ANCHOR} class="empty:hidden">`.
  `locale: 'es-419'` añadido a `elementsOptions`. Mensaje "dashboard de Lovivo" eliminado →
  ahora `card_payments_unavailable` + `console.error` con el detalle técnico.
  `useEffect` registra oxxo/spei desde `props.paymentMethods`.
- `PaypalExpressButton.tsx`: `onCancel` ahora dispara banner neutro + scroll (además del
  `trackPH('checkout_paypal_cancelled')` intacto). `onError` y el catch de `onApprove` usan
  `mapPaymentError` en vez de `err.message` crudo. `useEffect` registra `paypal: true`.
  Ancla `#paypal-express-anchor` añadida.
- `ProductExpressCheckout.tsx`: mismo mensaje interno "dashboard de Lovivo" eliminado (L443).

**Eventos nuevos de PostHog (aditivos, no se tocó ninguno existente)**
- `payment_recovery_shown` — `{ kind, error_code, decline_code, attempts, alternatives_shown }`
- `payment_recovery_alternative_clicked` — `{ from_kind, alternative }`

### Pendiente de validar en vivo
1. Tarjeta `4000000000000002` (declined) → banner rojo persistente, sin toast, carrito intacto.
2. Tarjeta `4000000000009995` → copy específico de fondos insuficientes.
3. Abrir PayPal y cerrar el popup → banner ámbar + scroll al bloque de pago.
4. Segundo fallo consecutivo → chips visibles aunque el código no las pida.
5. Confirmar que los 14 eventos de checkout previos siguen disparándose idénticos.

### Fuera de alcance (Dashboard)
- Email de checkout abandonado / pago fallido → automatización del Dashboard.
- Insight PostHog: `checkout_payment_failed` → `checkout_payment_succeeded` en la misma sesión
  = tasa de recuperación. Es la métrica que valida todo este trabajo.

---

## Recent Changes
- **✅ Recuperación de pagos rechazados IMPLEMENTADA** (2026-09-03) — 3 archivos nuevos
  (`payment-errors.ts`, `payment-recovery.ts`, `PaymentRecoveryBanner.tsx`) + 3 modificados.
  Store externo en vez de Context → `CheckoutUI.tsx` no se tocó. Falta validación en vivo.
- **📋 Plan: recuperación de pagos rechazados y cancelación de PayPal** (2026-09-03) — auditoría.
- **✅ Google Ads (gtag.js) implementado** (2026-09-01) — 2 archivos nuevos + 4 modificados.
  Multitenant, no inyecta nada sin conversion ID. Falta validar con Tag Assistant.
- **✅ Instrumentación completa de checkout en PostHog** (2026-08-25) — 14 eventos nuevos +
  `trackPH`/`identifyCustomer` en `tracking-utils.ts`. Falta armar los insights en PostHog.
- **✅ Ajustes finos `/repartidores`** (2026-08-20, tanda 3) — swap Beneficio 01↔03, reseñas a
  `aspect-square` (+`width=700`), copy de "Se paga solo" a horizonte semanal.
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2).
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1) — galería del producto (5 fotos).
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18). **Falta prueba real.**
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — `src/pages/ui/DeliveryPDPUI.tsx`.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)

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
- **Banner de recuperación sin probar en vivo (2026-09-03)**: código completo, faltan las 5
  pruebas de aceptación con tarjetas de test de Stripe.
- **Banner acoplado a StripePayment (2026-09-03)**: si algún día se apaga el pago con tarjeta,
  el banner no se renderiza (la cancelación de PayPal quedaría sin feedback visual). Hoy no
  aplica porque `CheckoutUI` siempre monta `StripePayment`.
- **Google Ads sin validar (2026-09-01)**: código listo, falta confirmar que el conversion ID
  esté guardado en `store_settings` y ver el tag en vivo con Tag Assistant.
- **Tipo `StoreSettings` (2026-09-01)**: no incluye las columnas de Google Ads; se leen con
  `as any` en `SettingsContext`. Si algún día se puede editar `src/lib/supabase.ts`, tiparlas.
- **Insights de PostHog sin armar (2026-08-25)**: los eventos ya se emiten pero el funnel de
  6 pasos y el desglose de `error_code` aún no existen en el dashboard.
- **PayPal MX — falta prueba real (2026-08-18)**: fix implementado pero nunca probado punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve `res.order.shipping_address`.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/lib/payment-errors.ts` — mapa decline_code/error_code → copy accionable en español
- `src/lib/payment-recovery.ts` — store externo (useSyncExternalStore) + anclas de scroll
- `src/components/PaymentRecoveryBanner.tsx` — banner persistente + chips de alternativas
- `src/lib/google-ads.ts` — loader gtag.js multitenant + purchase/event/setUserData
- `src/contexts/GoogleAdsContext.tsx` — init + page_view por ruta (dentro de BrowserRouter)
- `src/contexts/PostHogContext.tsx` — init PostHog (autocapture off, identified_only)
- `src/lib/tracking-utils.ts` — `trackHybrid` (Pixel + CAPI + PostHog), `gaItems`, `getAttributionPayload`,
  `trackPH` y `identifyCustomer` (PostHog-only, al final del archivo)
- `src/adapters/CheckoutAdapter.tsx` — `initiatecheckout` + autosave de cliente (`clients-upsert`)
- `src/pages/ui/CheckoutUI.tsx` — checkout de una sola página (NO se tocó en 2026-09-03)
- `src/components/StripePayment.tsx` — `phBase()`, `handlePayment`, `handlePaymentError`,
  `handleExpressCheckoutConfirm`, banner arriba del `<PaymentElement>`
- `src/components/PaypalExpressButton.tsx` — createOrder/onApprove/onError/onCancel + ancla PayPal
- `src/components/ProductExpressCheckout.tsx` — express checkout de la PDP
- `src/hooks/useCheckoutState.ts` — orden en localStorage, TTL 7 días
- `src/pages/ThankYou.tsx` / `src/pages/PendingPayment.tsx`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Probar el banner con tarjetas de test de Stripe (declined + insufficient_funds)
  y con cancelación real de PayPal.
- **[CRÍTICA]** Validar Google Ads con Tag Assistant + compra de prueba (transaction_id).
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos de checkout lleguen.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Insight PostHog: tasa de recuperación (failed → succeeded en la misma sesión).
- **[ALTA]** Automatización de email de checkout abandonado / pago fallido (Dashboard).
- **[ALTA]** Confirmar claves de `google_ads_labels` (view_item, add_to_cart, begin_checkout, search).
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code` / `decline_code`.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Enhanced conversions con teléfono/dirección además del email.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token`.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.