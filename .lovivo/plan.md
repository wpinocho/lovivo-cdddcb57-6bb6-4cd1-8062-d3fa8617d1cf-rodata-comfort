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

## Active Plan — ✅ Google Ads (gtag.js) IMPLEMENTADO en storefront (2026-09-01)

### Estado previo
Auditoría: **no existía NADA** de Google Ads en el repo MX (0 matches de `gtag|googleAds`).
La carpeta `docs/google-ads-storefront/` referida por el user vive en el repo template, no aquí,
así que los dos archivos nuevos se escribieron a mano siguiendo la spec.

### Qué se construyó (5 cambios)
1. **`src/lib/google-ads.ts`** (nuevo) — clase `GoogleAdsTracker`, singleton `googleAds`.
   - `init(conversionId, purchaseLabel, labels)`: no inyecta NADA si no hay `conversionId`.
     Inyecta `googletagmanager.com/gtag/js?id=AW-...` (script id `google-ads-gtag`, una sola vez),
     `gtag('config', id, { allow_enhanced_conversions: true, send_page_view: false })`.
     Idempotente: relanzarlo con el mismo ID solo refresca labels.
   - `pageView(path)` — page_view manual para SPA.
   - `event(name, params)` — si existe label en `google_ads_labels[name]` manda
     `send_to: AW-XXX/label`; si no, manda el evento plano a la cuenta.
   - `setUserData({email, phone, address...})` — enhanced conversions (gtag hashea client-side).
   - `purchase({value, currency, transactionId, items})` — usa `google_ads_purchase_label`;
     si no hay label, hace no-op con log.
2. **`src/contexts/GoogleAdsContext.tsx`** (nuevo) — `GoogleAdsProvider` + `useGoogleAds()`.
   Un solo `useEffect` (init + page_view) con `lastPathRef` para evitar el doble page_view
   cuando los settings resuelven después del mount. Requiere estar DENTRO de `<BrowserRouter>`.
3. **`src/contexts/SettingsContext.tsx`** — al select se agregaron `google_ads_conversion_id`,
   `google_ads_purchase_label`, `google_ads_labels`; expuestos como `googleAdsId`,
   `googleAdsPurchaseLabel`, `googleAdsLabels` (casts `as any` porque el tipo `StoreSettings`
   de `@/lib/supabase` es archivo core y aún no incluye las columnas).
4. **`src/App.tsx`** — `<GoogleAdsProvider>` envuelve a `<CartUIProvider>` dentro de
   `<BrowserRouter>`, con `SettingsProvider` y `PixelProvider` por encima.
5. **`src/lib/tracking-utils.ts`** — helper privado `gaItems(products)` →
   `{item_id,item_name,price,quantity}`. Sin tocar Meta ni PostHog se agregaron:
   `view_item`, `add_to_cart`, `begin_checkout`, `search` y `googleAds.purchase(...)`
   con `transaction_id = order_id`.
   Extra: `googleAds.setUserData({email})` en `CheckoutUI` junto a `identifyCustomer`.

### Validación pendiente
1. Confirmar en el Dashboard que `google_ads_conversion_id` (AW-…) esté guardado para Rodata MX.
2. Con Google Tag Assistant: verificar carga de gtag y que `page_view` NO se dispare dos veces.
3. Compra de prueba → conversión `purchase` con `transaction_id` en Google Ads (24-48h).
4. Verificar que `google_ads_labels` tenga las claves exactas `view_item`, `add_to_cart`,
   `begin_checkout`, `search` (si no, se mandan como eventos planos, no como conversiones).

---

## Recent Changes
- **✅ Google Ads (gtag.js) implementado** (2026-09-01) — 2 archivos nuevos + 4 modificados.
  Multitenant, no inyecta nada sin conversion ID. Falta validar con Tag Assistant.
- **✅ Instrumentación completa de checkout en PostHog** (2026-08-25) — 14 eventos nuevos +
  `trackPH`/`identifyCustomer` en `tracking-utils.ts`. Falta armar los insights en PostHog.
- **📋 Plan: instrumentación de eventos de checkout en PostHog** (2026-08-25) — auditoría previa.
- **✅ Ajustes finos `/repartidores`** (2026-08-20, tanda 3) — swap Beneficio 01↔03, reseñas a
  `aspect-square` (+`width=700`), copy de "Se paga solo" a horizonte semanal.
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2) — lifestyle, 3 beneficios,
  quote break y 5 reseñas remapeados; se agregó reseña "Marco V." (Querétaro).
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1) — galería del producto (5 fotos).
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — `src/pages/ui/DeliveryPDPUI.tsx`.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
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
- `src/lib/google-ads.ts` — **loader gtag.js multitenant + purchase/event/setUserData**
- `src/contexts/GoogleAdsContext.tsx` — **init + page_view por ruta (dentro de BrowserRouter)**
- `src/contexts/PostHogContext.tsx` — init PostHog (autocapture off, identified_only)
- `src/lib/tracking-utils.ts` — `trackHybrid` (Pixel + CAPI + PostHog), `gaItems`, `getAttributionPayload`,
  `trackPH` y `identifyCustomer` (PostHog-only, al final del archivo)
- `src/adapters/CheckoutAdapter.tsx` — `initiatecheckout`
- `src/pages/ui/CheckoutUI.tsx` — checkout + `ShippingErrorTracker` + `googleAds.setUserData`
- `src/components/StripePayment.tsx` — `phBase()`, `handlePayment`, `handleExpressCheckoutConfirm`
- `src/components/PaypalExpressButton.tsx` — `phBase()`, createOrder/onApprove/onError/onCancel
- `src/components/headless/HeadlessProduct.tsx` — viewcontent, addtocart
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/PendingPayment.tsx` — OXXO / SPEI + `pending_payment_viewed`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Validar Google Ads con Tag Assistant + compra de prueba (transaction_id).
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos de checkout lleguen.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Confirmar claves de `google_ads_labels` (view_item, add_to_cart, begin_checkout, search).
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code` / `decline_code`.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Enhanced conversions con teléfono/dirección además del email.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token`.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.