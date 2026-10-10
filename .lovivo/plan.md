# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). **compare_at $1,339 (40% OFF) CONFIRMADO intencional por cliente 2026-10-10.**
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Tallas más vendidas: L y XL** (cliente 2026-10-10) → PDP preselecciona L.
- **Reseñas: cliente confirma 167 reseñas reales** (vienen de WhatsApp). 4.9 y "+800 riders" aún sin confirmar.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: "Regalo: Soporte de muñeca RODATA (par)" id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  price 0, compare_at 449. Tags `regalo,no-listar`. SIN cost cargado.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico**: 94% mobile, ~80% Meta Ads. Tráfico PDP cayó fuerte: 2,481 únicos/sem (3-ago) → 644 (28-sep) → 287 (5–10 oct). CVR NO cayó.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · devolución normal = cliente paga regreso · defectuoso = RODATA cubre ·
  1er cambio de talla SIN COSTO · reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"** (ya no es lanzamiento).
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07).
- Reseñas: NO inventar texto de reseñas; fotos reales sí se pueden usar sin texto ("Fotos reales de clientes").

## Active Plan

### 📱 Mejora PDP móvil `/productos/soporte-lumbar-rodata-one` — POR PASOS (cliente quiere ir revisando)
Archivo: `src/pages/ui/ProductPageUI.tsx` (NO tocar GiftPDPUI/DeliveryPDPUI salvo que el cliente lo pida). Baseline en `.lovivo/cro-log.md`.

**✅ Paso 1 (2026-10-10) HECHO**: sticky bar tras 250px scroll (oculta si CTA inline visible) · talla L preseleccionada (useEffect en ProductPageUI, una vez, solo si auto-select dejó la 1ª talla) ·
línea "Mide tu cintura... 1er cambio gratis" bajo tallas · badge → "Envío gratis a todo México" · eyebrow oculto en móvil · descripción + bullets movidos DEBAJO del CTA ·
`UGC_CASCO` como 2ª imagen de galería + dots móvil · tira "Fotos reales de clientes" (rally, review-1, unboxing, review-4) bajo CTA · `REVIEW_COUNT = 167` · claim médico fuera · "30 días de prueba" → "30 días para devolver" en todos lados.

**Paso 2 (siguiente)**: reseñas con foto reales
- Pedir al cliente: texto real de 3–6 reseñas (screenshots WhatsApp) + nombre/inicial + ciudad + mes. Con eso: reemplazar REVIEWS (fechas 2025 inconsistentes), subir 2–3 al bloque bajo CTA en carrusel.
- Confirmar "4.9" y "+800 riders" (stats bar + social proof block). Avatares `avatar-*-v3` probable IA → reemplazar por fotos reales o iniciales.
**Paso 3**: imágenes galería — catálogo 2048px (LCP), foto "cómo medir cintura", más fotos en moto. Ocultar "Cantidad" en móvil?
**Paso 4**: Encuesta PostHog "¿Qué te frenó para comprar hoy?" (PDP móvil, 40 s sin ATC). Opciones: Precio · No sé qué talla · No sé si me va a servir · Desconfianza · Tiempo de entrega · Solo estaba viendo · Otro.
**Paso 5**: /pagar — 1 de cada 6 regresa a PDP (59 en 30d). Relacionado con formulario dirección MX.
**Medir**: 24-oct comparar 14 días vs baseline (CVR móvil 2.2%, ATC 9.3%).

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07 (gana control)
- Selector quitado de `ProductPageUI.tsx` y `GiftPDPUI.tsx`. `PackOfferSelector.tsx` sin imports. **Regla BOGO `7653e73d` SIGUE ACTIVA**.

### 🎁 B) Test "PDP normal vs PDP regalo" — EN PAUSA
- Recomendación: A/B en Meta Ads (`utm_content=control|regalo`). Break-even margen/pedido ≈ $423. `GIFT_OFFER_ENDS_AT = '2026-10-31T23:59:59-06:00'`.
- PostHog muestra ~1 visitante/semana en la URL regalo.

### 🎁 Elegibilidad regalo (FIX 2026-10-07)
- Regalo solo si hay Rodata One en carrito mientras `pathname === GIFT_PDP_PATH` → claim `rodata-gift-claimed` (TTL 7d).

### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK)
- `src/components/MxAddressForm.tsx`: Nombre(s)|Apellidos · Calle y núm ext · Núm int · Colonia · CP | Ciudad · Estado · Teléfono. Rollback `USE_CUSTOM_ADDRESS_FORM`. Fix `clients-upsert 400`.

### PDP Muñequeras — pendiente validación cliente. Merchant Center — pendiente cliente.

## Recent Changes
- **📱 PDP móvil Paso 1: sticky, talla L, fotos reales, sin "Lanzamiento", copy devoluciones (2026-10-10)**.
- **🔍 Auditoría CRO PDP móvil (2026-10-10)** — plan guardado.
- **🐛 Fix: regalo se agregaba desde la PDP normal (2026-10-07)**.
- **✅ Exp pack 2ª unidad 50% cerrado + regalo extendido al 31 oct (2026-10-07)**.
- **📋 Plan cerrar exp pack + test regalo vía Meta A/B (2026-10-07)**.
- **📋 Plan formulario de dirección estilo México + Colonia (2026-09-29)**.
- **🎁 PDP Regalo v2 construida (2026-09-29)**.
- **📋 Plan PDP Regalo v2 (2026-09-29)**.
- **🎁 PDP Rodata One + Muñequeras de regalo (2026-09-28)**.
- **🧤 PDP Muñequeras RODATA (2026-09-28)**.
- **🛡️ Merchant Center trust fix (2026-09-28)**.
- **🎯 Fix event_id Meta Pixel + CAPI (2026-09-26)**.
- **🎨 Fix contraste `CartAppliedRules.tsx` (2026-09-22)**.
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22)**.
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES (2026-10-10)** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` (hombre de espaldas con faja puesta + casco, 1200×1600 — 2ª en galería),
  `u068d1b4pr.webp` (rider selfie Rally ADV Jalisco 2026 sosteniendo faja, 1600×1200 — tira UGC, objectPosition 25%),
  `c3mx3z3w5kt.webp` (faja en empaque, baja res 544×~750 — tira UGC).
- Catálogo lumbar (object/public/product-images/products/, 2048px): `nae4riov9h.webp` (hero), `j8kw94s83hn`, `pjleekrch4l` (callouts), `b5mg4lv2qbf`, `0evbcgfgplnh`. Todas render/IA.
- Reseñas: `SB_PROD/review-1.webp` (REAL: hombre con faja junto a Honda roja), `review-4.webp` (real), review-2/3/5 sin revisar.
- Avatares `SB_PROD/avatar-{carlos,jorge,andres}-v3.webp` (probable IA).
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd`, `q4h7kvtg3nn`, `0yjgi3apchym`, `nwhrcsc3un`, `2wwj6uvz7a5`
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Reseñas PDP con fechas 2025** (tienda creada abr-2026) — pendiente texto real del cliente (2026-10-10).
- "4.9" y "+800 riders" sin confirmar (2026-10-10).
- Talla S sigue siendo default en GiftPDPUI/DeliveryPDPUI/muñequeras (HeadlessProduct auto-select); solo ProductPageUI fuerza L.
- **Regalo vence 2026-10-31 23:59 CDMX**. **Regla BOGO 2ª unidad 50% sigue activa** sin selector.
- Producto regalo sin `cost`. Regalo sin QA de compra real.
- **Checkout (2026-09-29)**: etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto.
- PostHog `addtocart`/`purchase` sin propiedades de variante (no se puede ver talla por evento).

## Pending / Future Sessions
- **[ALTA]** PDP Paso 2: reseñas reales con foto (esperando textos del cliente). Medir Paso 1 el 24-oct.
- **[ALTA]** Lanzar encuesta PostHog PDP móvil (Paso 4).
- **[ALTA]** QA del fix regalo. **[ALTA]** Decidir regla BOGO `7653e73d` (solo con OK).
- **[ALTA]** Formulario dirección MX + QA compra real. **[ALTA]** Muñequeras precio final.
- **[MEDIA]** Test regalo en Meta Ads. **[MEDIA]** Investigar caída de tráfico (Dashboard / Meta Ads).
- **[BAJA]** Borrar `PackOfferSelector.tsx`. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.