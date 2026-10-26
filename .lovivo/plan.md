# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). **compare_at $1,339 (40% OFF) CONFIRMADO intencional por cliente 2026-10-10.**
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **DUPLICADO $899 (solo URL regalo, 2026-10-26)**: id `00155506-c9ce-4e2c-b299-296b948f3254`, slug `soporte-lumbar-rodata-one-899`, título igual
  "Soporte Lumbar Rodata One", tags `lumbar,rodata,no-listar,precio-899`. Variantes $899: S `6f13316a-d51c-4e40-9246-9ac92be61b53`,
  M `d77728ed-ef3e-4c4b-9412-e0435f22f800`, L `28b1a940-1e59-456c-a2fd-1a0b728e7baf`, XL `57276496-3d9f-43d1-9f0c-a7d78c130230`.
  **Faltan en Dashboard**: compare_at $1,339, cost $209, paquete "Bolsa de prod" + ubicación (la tool no los guarda).
- **Tallas más vendidas: L y XL** (cliente 2026-10-10) → PDP preselecciona L.
- **Reseñas publicadas: 168** (reales, validadas por WhatsApp). Rating ≈ **4.6**.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-…`, slug `munequeras-rodata`, precio PROVISIONAL $449 / compare $599. NO en home ni menú.
- **Producto REGALO**: id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`, price 0, compare_at 449. Tags `regalo,no-listar`.
- **Objetivo cliente 2026-10-26: subir AOV**. URL regalo a **$899 + regalo**, resto a $799. SIN experimento. Adset nuevo Meta.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX. Tráfico 94% mobile, ~80% Meta Ads. Vende también por `/pagar?token=…`.
- **Política oficial (2026-09-28)**: 30 días · devolución normal = cliente paga regreso · defectuoso = RODATA cubre · 1er cambio de talla SIN COSTO ·
  reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- **Precio distinto por URL = PRODUCTO DUPLICADO en la BD** (backend recalcula precios). Duplicados llevan tag `no-listar` + redirect de su slug.
- `isListableProduct()` en `src/lib/gift-offer.ts` filtra `no-listar` (usado en `IndexUI` fallback). `HeadlessIndex` es FORBIDDEN — no tocar.
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"**.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo y SOLO con el producto $899** (`GIFT_MAIN_PRODUCT_ID` = duplicado).
- **Reseñas: fuente única `src/data/rodataReviews.ts`** + `RodataReviews.tsx`. Rating/conteo NUNCA hardcodeados.
- **Galería PDP: SOLO fotos de catálogo**. Info panel PDP `flex flex-col gap-5`. H1 PDP `text-2xl sm:text-3xl md:text-4xl`.
- **CHECKOUT — totales**: con pedido, totales = valores del pedido (`src/lib/order-totals.ts`).
- **Links de pago**: `source: 'payment_link'` → `isPaymentLinkOrder`; con `discount_amount > 0` → `quantityLocked`.

## Active Plan

### 💰 URL regalo a $899 (CONSTRUIDO 2026-10-26 — falta Dashboard + QA)
- `gift-offer.ts`: `GIFT_MAIN_PRODUCT_ID/SLUG` → duplicado $899; `ORIGINAL_PRODUCT_SLUG` para canonical + redirect post-promo.
- `GiftLanding.tsx` carga el duplicado; `GiftCartSync` engancha regalo solo al duplicado (sin cambios de código, usa la constante).
- `App.tsx`: `/productos/soporte-lumbar-rodata-one-899` → redirect a la URL regalo.
- Fecha fin regalo SIN CAMBIO: 2026-10-31 23:59 CDMX (cliente OK). Después redirige a PDP $799.
- **Pendiente cliente**: en Dashboard poner compare_at $1,339 al duplicado (sin eso no sale tachado ni % OFF), cost $209, paquete/ubicación.
- **QA**: compra de prueba → $899 + regalo $0 = $899; PDP normal $799; Pixel content_id = id duplicado (avisar si usa catálogo Meta).
- **Medir**: AOV/CVR adset $899 vs $799. Margen $590 → $690 (+17%) → compensa si CVR cae < ~14.5%.

### 💳 Fix links de pago `/pagar?token=` (HECHO 2026-10-12 — falta QA real)

### 📱 Mejora PDP móvil — POR PASOS
**Paso 2b (pendiente, ahora prioritario)**: `RodataReviews` en GiftPDPUI (aún reseñas inventadas + "4.9") — pedir OK. **Paso 3** galería. **Paso 4** encuesta. **Paso 5** /pagar regreso.

### ✅ Exp pack 2ª unidad — CERRADO 2026-10-07 (BOGO `7653e73d` inactiva). ✅ Exp $799 vs $849 — CERRADO 2026-09-22.
### 🏠 Formulario dirección MX (PLANEADO 2026-09-29 — esperando OK). PDP Muñequeras / Merchant Center — pendiente cliente.

## Recent Changes
- **💰 URL regalo vende duplicado Rodata One $899 + regalo; resto $799 (2026-10-26)**.
- **📋 Plan URL regalo a $899 con producto duplicado (2026-10-26)**.
- **💳 Checkout: totales desde el pedido + descuento manual + prellenado + bloqueo cantidad links de pago (2026-10-12)**.
- **📐 Fix h1 2 líneas + hueco arriba de título + foto real "Rueda horas..." (2026-10-10)**.
- **⭐ +2 reseñas con foto, modal filtro por estrellas (2026-10-10)**.
- **⭐ +150 reseñas con fecha, total 166 (2026-10-10)**.
- **⭐ Reseñas v3: resumen con barras, cargar más (2026-10-10)**.
- **⭐ PDP Paso 2: reseñas reales con foto (2026-10-10)**.
- **📱 PDP móvil Paso 1 (2026-10-10)**.
- **🔍 Auditoría CRO PDP móvil (2026-10-10)**.
- **🐛 Fix: regalo se agregaba desde la PDP normal (2026-10-07)**.
- **✅ Exp pack cerrado + regalo extendido al 31 oct (2026-10-07)**.
- **📋 Plan cerrar exp pack + test regalo (2026-10-07)**.
- **📋 Plan formulario de dirección MX (2026-09-29)**.
- **🎁 PDP Regalo v2 construida (2026-09-29)**.

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` = Alan M. (SOLO reseñas), `u068d1b4pr.webp` = Pablo B., `c3mx3z3w5kt.webp` = Esteban V.
- **UGC REALES** `SB_MSG/1791663680441-`: `cr0tattp1ss.webp` = Leonel B., `8818z991fgk.webp` = Emilio Z.
- **UGC REAL (feature 02)** `SB_MSG/1791664562254-pgzyfsa1vdo.webp` = desierto → `FEAT_IMG_2`.
- Catálogo lumbar: `product-images/products/` `zcop2dp0bh` (hero), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`. Duplicado $899 usa las MISMAS.
- Reseñas viejas: `SB_PROD/review-1.webp` (Leonel B.), `review-4.webp`. Avatares `SB_PROD/avatar-*-v3.webp` (probable IA, en GiftPDPUI).
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`. Muñequeras (reales) `SB_MSG/1790638502334-*`.
- PDP carretera: `/pdp-lifestyle-1.jpg` · `SB_MSG/1775768374485-uca4dkx21g.webp`. Home HERO `SB_MSG/1775772513540-16g7elmcuii.webp`.
- Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Duplicado $899 sin compare_at/cost/paquete** (2026-10-26): bug de tool reportado (feedback `d7dbaa25`). Cliente debe ponerlos en Dashboard.
- **Regalo vence 2026-10-31 23:59 CDMX** → URL regalo redirige a PDP $799; el adset nuevo debe pausarse o extender fecha antes.
- **GiftPDPUI aún con reseñas inventadas + "4.9 ★" hardcodeado** (2026-10-10) — recibe tráfico pagado nuevo.
- Checkout links de pago (2026-10-12): sin QA con link real.
- "4.9 · +800 riders" hardcodeado en `StripePayment.tsx`. "+800 riders" sin confirmar.
- Quejas en reseñas: entrega tardía, calor, ajuste (2026-10-10).
- Checkout: etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400. "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Código `DEDE` 98%. `useURLCartLoader` roto.

## Pending / Future Sessions
- **[ALTA]** QA compra de prueba URL $899 + confirmar compare_at en Dashboard. **[ALTA]** RodataReviews reales en GiftPDPUI (pedir OK).
- **[ALTA]** Decidir qué pasa con el adset $899 tras el 31 oct (nueva fecha o pausar).
- **[ALTA]** QA links de pago con descuento manual. **[ALTA]** Medir PDP móvil + encuesta PostHog.
- **[ALTA]** Formulario dirección MX. **[ALTA]** Muñequeras precio final. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.
- **[MEDIA]** Guía visual "cómo ajustarla". **[MEDIA]** Investigar caída de tráfico. **[BAJA]** Borrar `PackOfferSelector.tsx`.