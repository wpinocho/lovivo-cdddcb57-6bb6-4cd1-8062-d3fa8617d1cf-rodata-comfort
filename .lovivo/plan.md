# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). **compare_at $1,339 (40% OFF) CONFIRMADO intencional por cliente 2026-10-10.**
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **DUPLICADO $899 (solo URL regalo, 2026-10-26)**: id `00155506-c9ce-4e2c-b299-296b948f3254`, slug `soporte-lumbar-rodata-one-899`, tags `lumbar,rodata,no-listar,precio-899`.
  Variantes $899: S `6f13316a-…`, M `d77728ed-…`, L `28b1a940-…`, XL `57276496-…`. **Faltan en Dashboard**: compare_at $1,339, cost $209, paquete/ubicación.
- **Tallas más vendidas: L y XL** → PDP preselecciona L. **Reseñas publicadas: 168** (reales). Rating ≈ **4.6**.
- **Pedidos: "más de 1,000"** (dato del dueño 2026-11-11, usado en advertorial).
- **Muñequeras RODATA (par)** slug `munequeras-rodata`, precio PROVISIONAL $449 / compare $599. NO en home ni menú.
- **Producto REGALO**: id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`, price 0, compare_at 449. Tags `regalo,no-listar`.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP · **Avatar 2**: repartidor → `/repartidores`. Tráfico 94% mobile, ~80% Meta Ads.
- **Política oficial (2026-09-28)**: 30 días · devolución normal = cliente paga regreso · defectuoso = RODATA cubre · 1er cambio de talla SIN COSTO ·
  reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**
- **Cliente (2026-11-11)**: nombres de países lejanos (Katmandú, Nigeria…) se sienten ajenos a su público → hablar de QUIÉN se estudió (repartidores, mototaxistas, estudiantes), no de DÓNDE.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`.
- **PDP regalo = MISMA `ProductPageUI` con prop `giftOffer`**. Bloques en `src/components/gift/GiftPDPBlocks.tsx`. NO volver a forkear.
- **Advertorial** `/lectura/espalda-baja-moto`: página standalone SIN EcommerceTemplate, columna 680px, texto 18px, noindex.
  Contenido/variantes/fuentes/FAQ/microcopy en `src/data/advertorialEspalda.ts`; medición en `src/hooks/useAdvertorialTracking.ts`; SVG en `src/components/advertorial/`.
  `?v=a1|a2|a3` cambia titular + imagen. SIN precio (vive en PDP). CTAs → PDP conservando UTMs + `utm_term=adv_<v>_<cta>`.
  **Reglas advertorial**: CERO links salientes en el cuerpo (fuentes solo al pie, plegadas, nofollow). Reseñas sin palabras de salud ("alivio", "dolor se quitó"). Sin etiqueta "Contenido de Rodata" (logo + firma ya transparentan). Rating/conteo desde `REVIEW_STATS`.
- **Pixel**: `facebook-pixel.ts` manda eventos NO estándar con `trackCustom` automáticamente (2026-11-11).
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- **Precio distinto por URL = PRODUCTO DUPLICADO en la BD**. Duplicados llevan tag `no-listar` + redirect de su slug.
- `isListableProduct()` en `src/lib/gift-offer.ts` filtra `no-listar`. `HeadlessIndex` es FORBIDDEN.
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"**.
- **Urgencia: SOLO real**. **Vibración**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Reseñas: fuente única `src/data/rodataReviews.ts`**. Rating/conteo NUNCA hardcodeados (`REVIEW_STATS`). Advertorial toma reseñas por nombre.
- **Galería PDP: SOLO fotos de catálogo**. **CHECKOUT**: con pedido, totales = valores del pedido (`src/lib/order-totals.ts`).

## Active Plan

### 📰 Advertorial v2 (CONSTRUIDO 2026-11-11)
- Hecho: estudios sin países (4–6 de cada 10 + estudio de estudiantes de 22 años promedio, 53%, asociado a tiempo diario en moto — verificado JDUHS) · Bangladesh y claim "20–30 años" quitados · pie con aviso de 1 línea + `<details>` "Ver estudios citados (4)" · etiqueta del header quitada · reseñas Ricardo L./Roberto G./Fernando L. + línea ★ rating · tira "Fotos reales de clientes" (PHOTO_REVIEWS) · FAQ 4 preguntas (`advertorial_faq_open`) · cierre "Kilómetro 150… que sea por gasolina" · CTAs "Ver Rodata One y elegir mi talla" / "Elegir mi talla" + microcopy · sticky con ★ · H2 "Rodata One: el respaldo que la moto no trae" · "faja de farmacia o de gimnasio" · ilustración más grande + pie de figura legible · Pixel trackCustom.
- **Pendiente cliente**: (1) ¿la imagen subida `.../message-images/.../1793048789975-rz7gqvm3qi.webp` es el anuncio de la gasolinera? → si sí, `heroImage` de `a1`. (2) Imagen del anuncio 5 (silueta) → `ADV_MECHANISM_IMAGE`. (3) ¿Historia real del fundador?
- **Medición**: leer ~2026-11-25 (ver cro-log).
- **NO hacer**: autor/médico inventado, logos de medios, "como se vio en", fecha falsa, contador de urgencia, precio en la página, reseñas editadas.

### 💰 URL regalo a $899 (CONSTRUIDO 2026-10-26 — falta Dashboard + QA)
- Fecha fin regalo: 2026-10-31 23:59 CDMX → redirige a PDP $799. **Pendiente**: compare_at/cost en Dashboard, compra de prueba.

### 📱 Mejora PDP móvil — POR PASOS. **Paso 3** galería. **Paso 4** encuesta. **Paso 5** /pagar regreso.
### 🏠 Formulario dirección MX (PLANEADO — esperando OK). PDP Muñequeras / Merchant Center — pendiente cliente.

## Recent Changes
- **📰 Advertorial v2: sin países, fuentes plegadas, reseñas + rating + fotos UGC, FAQ, cierre Km 150, CTAs con microcopy, Pixel trackCustom (2026-11-11)**.
- **📋 Plan Advertorial v2 (2026-11-11)**.
- **📰 Advertorial `/lectura/espalda-baja-moto` con variantes ?v=, 3 CTAs + barra fija, scroll/CTA tracking (2026-11-11)**.
- **🔁 URL regalo unificada: usa la PDP normal + bloques de regalo; GiftPDPUI borrado (2026-10-26)**.
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

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` = Alan M. (SOLO reseñas/tira UGC), `u068d1b4pr.webp` = Pablo B., `c3mx3z3w5kt.webp` = Esteban V.
- **UGC REALES** `SB_MSG/1791663680441-`: `cr0tattp1ss.webp` = Leonel B. (advertorial bloque 7), `8818z991fgk.webp` = Emilio Z.
- **UGC REAL (feature 02)** `SB_MSG/1791664562254-pgzyfsa1vdo.webp` = desierto → `FEAT_IMG_2`.
- `FEAT_IMG_1` `SB_MSG/1775777133671-80hvv9dmxa.webp` = estudio, espalda con faja (no es UGC).
- Catálogo lumbar: `product-images/products/` `zcop2dp0bh` (hero), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`.
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`. Muñequeras (reales) `SB_MSG/1790638502334-*`.
- PDP carretera: `/pdp-lifestyle-1.jpg` · `SB_MSG/1775768374485-uca4dkx21g.webp` (hero por defecto del advertorial). Home HERO `SB_MSG/1775772513540-16g7elmcuii.webp`.
- Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.
- **Por confirmar con cliente**: `SB_MSG/1793048789975-rz7gqvm3qi.webp` (¿anuncio gasolinera? → hero `a1`).

## Known Issues
- **imagegen sin créditos (2026-11-11)**: Gemini 402 RESOURCE_EXHAUSTED — se usó SVG en advertorial.
- **`GiftPDPUI.tsx` aparece aún en el repo (2026-11-11)** aunque el plan dice borrado — revisar y borrar si no se usa.
- **Duplicado $899 sin compare_at/cost/paquete** (2026-10-26). Cliente debe ponerlos en Dashboard.
- Checkout links de pago (2026-10-12): sin QA con link real.
- "4.9 · +800 riders" hardcodeado en `StripePayment.tsx`. Ahora dueño dice +1,000 pedidos → alinear con `REVIEW_STATS`.
- Quejas en reseñas: entrega tardía, calor, ajuste (2026-10-10) — cubiertas en FAQ del advertorial.
- Checkout: etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400. "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Código `DEDE` 98%. `useURLCartLoader` roto.

## Pending / Future Sessions
- **[ALTA]** Advertorial: imágenes de anuncios por variante (hero a1, silueta) + QA móvil + embudo PostHog ~2026-11-25.
- **[MEDIA]** Advertorial: variante repartidores (`?v=r1`, titular turno 8 h, hero foto real repartidor). ¿Historia real del fundador? (preguntar; NO inventar).
- **[ALTA]** QA compra de prueba URL $899 + compare_at en Dashboard.
- **[ALTA]** QA links de pago con descuento manual. **[ALTA]** Medir PDP móvil + encuesta PostHog.
- **[ALTA]** Formulario dirección MX. **[ALTA]** Muñequeras precio final. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.
- **[MEDIA]** Guía visual "cómo ajustarla". **[BAJA]** Borrar `PackOfferSelector.tsx` y `GiftPDPUI.tsx` si sin uso.