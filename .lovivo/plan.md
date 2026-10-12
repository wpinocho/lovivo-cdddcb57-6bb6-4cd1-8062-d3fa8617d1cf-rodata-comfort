# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). **compare_at $1,339 (40% OFF) CONFIRMADO intencional por cliente 2026-10-10.**
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Tallas más vendidas: L y XL** (cliente 2026-10-10) → PDP preselecciona L.
- **Reseñas publicadas: 168** (cliente CONFIRMÓ reales, validadas por WhatsApp con consentimiento). Rating calculado ≈ **4.6**.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`, price 0, compare_at 449. Tags `regalo,no-listar`.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico**: 94% mobile, ~80% Meta Ads. Tráfico PDP cayó fuerte (2,481 únicos/sem ago → 287 oct). CVR NO cayó.
- **La tienda vende también por links de pago personalizados** `/pagar?token=…` (pedido armado por la tienda, a veces con descuento manual).
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
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"**.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07).
- **Reseñas: fuente única `src/data/rodataReviews.ts`** + componente `src/components/RodataReviews.tsx`. Rating/conteo NUNCA hardcodeados. NO inventar reseñas.
- **Galería PDP: SOLO fotos de catálogo**. Info panel PDP usa `flex flex-col gap-5` (NO `space-y-*`). H1 PDP `text-2xl sm:text-3xl md:text-4xl`.
- **CHECKOUT — totales (regla 2026-10-12)**: cuando existe pedido (`checkoutState.order`), Subtotal/Descuento/Envío/Total = valores del pedido
  (`order.subtotal`, `order.discount_amount`, `order.shipping_amount`, `order.total_amount`). Cada respuesta de checkout-update los reemplaza.
  NUNCA recalcular ni borrar el descuento manual. Cálculo en navegador SOLO si aún no hay pedido. Helper: `src/lib/order-totals.ts`
  (`pickOrderTotals`, `patchCachedOrderTotals`, `parseOrderShippingAddress`). Lógica en `CheckoutAdapter` (`serverTotals`, `usesOrderTotals`).
- **Links de pago**: `useTokenCheckout` guarda `source: 'payment_link'` en el checkoutState → `isPaymentLinkOrder`. Si además
  `discount_amount > 0` → `quantityLocked` (botones +/− deshabilitados). Formulario se prellena con `order.shipping_address`
  (state del adapter + `defaultAddress` del AddressElement de Stripe con `onReady → getValue()`).
- Cobro: Stripe/OXXO/SPEI/PayPal mandan `order_id` + `checkout_token` existentes; el monto que viaja es `order.total_amount` (no se crea pedido nuevo).

## Active Plan

### 💳 Fix links de pago `/pagar?token=` (HECHO 2026-10-12 — falta QA real)
- Totales del pedido en resumen (desktop + mobile) y botón "Completar compra"; descuento manual como línea "Descuento" aunque no haya código.
- Prellenado de nombre/apellido/dirección/colonia/ciudad/estado/CP/teléfono/correo.
- Cantidad bloqueada si link de pago con descuento manual.
- **QA pendiente**: abrir un link real con descuento manual y verificar que Subtotal − Descuento + Envío = Total; que Stripe muestre la
  dirección prellenada (estado MX puede venir como nombre completo vs código Stripe); que el cobro sea por el total del pedido.

### 📱 Mejora PDP móvil `/productos/soporte-lumbar-rodata-one` — POR PASOS
Archivo: `src/pages/ui/ProductPageUI.tsx`. Baseline en `.lovivo/cro-log.md`.
**✅ Pasos 1, 2, 2c–2f (2026-10-10)**.
**Paso 2b (pendiente)**: `RodataReviews`/`REVIEW_STATS` en GiftPDPUI y DeliveryPDPUI — pedir OK.
**Paso 3**: imágenes galería. **Paso 4**: Encuesta PostHog. **Paso 5**: /pagar regreso a PDP.
**Medir**: 24-oct comparar 14 días vs baseline (CVR móvil 2.2%, ATC 9.3%).

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07 (gana control). **Regla BOGO `7653e73d` SIGUE ACTIVA**.
### 🎁 B) Test "PDP normal vs PDP regalo" — EN PAUSA. `GIFT_OFFER_ENDS_AT = '2026-10-31T23:59:59-06:00'`.
### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK)
### PDP Muñequeras — pendiente validación cliente. Merchant Center — pendiente cliente.

## Recent Changes
- **💳 Checkout: totales desde el pedido + descuento manual + prellenado + bloqueo de cantidad en links de pago (2026-10-12)**.
- **📐 Fix h1 2 líneas + hueco blanco arriba de título + nueva foto real sección "Rueda horas..." (2026-10-10)**.
- **⭐ +2 reseñas con foto (Leonel B., Emilio Z.), sin subtítulo, modal filtro por estrellas (2026-10-10)**.
- **⭐ +150 reseñas con fecha cargadas, total 166 (2026-10-10)**.
- **⭐ Reseñas v3: resumen con barras, cargar más 10 en 10 (2026-10-10)**.
- **⭐ PDP Paso 2: reseñas reales con foto + texto (2026-10-10)**.
- **📱 PDP móvil Paso 1 (2026-10-10)**.
- **🔍 Auditoría CRO PDP móvil (2026-10-10)**.
- **🐛 Fix: regalo se agregaba desde la PDP normal (2026-10-07)**.
- **✅ Exp pack 2ª unidad 50% cerrado + regalo extendido al 31 oct (2026-10-07)**.
- **📋 Plan cerrar exp pack + test regalo vía Meta A/B (2026-10-07)**.
- **📋 Plan formulario de dirección estilo México + Colonia (2026-09-29)**.
- **🎁 PDP Regalo v2 construida (2026-09-29)**.
- **🎁 PDP Rodata One + Muñequeras de regalo (2026-09-28)**.
- **🧤 PDP Muñequeras RODATA (2026-09-28)**.

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` = Alan M. (SOLO reseñas), `u068d1b4pr.webp` = Pablo B., `c3mx3z3w5kt.webp` = Esteban V.
- **UGC REALES** `SB_MSG/1791663680441-`: `cr0tattp1ss.webp` = Leonel B., `8818z991fgk.webp` = Emilio Z.
- **UGC REAL (feature 02)** `SB_MSG/1791664562254-pgzyfsa1vdo.webp` = desierto → `FEAT_IMG_2`.
- Catálogo lumbar (2048px): `nae4riov9h.webp` (hero), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`. Render/IA.
- Reseñas viejas: `SB_PROD/review-1.webp` (REAL = Leonel B.), `review-4.webp` (real). Avatares `SB_PROD/avatar-*-v3.webp` (probable IA, en GiftPDPUI).
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`. Muñequeras (reales) `SB_MSG/1790638502334-*`.
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp`. Home HERO `SB_MSG/1775772513540-16g7elmcuii.webp`.
- Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Checkout links de pago (2026-10-12)**: sin QA con link real. No se sabe si `order.discount_amount` del servidor incluye los `applied_rules`
  (BOGO); con pedido se muestra UNA línea "Descuento" con los títulos de reglas, sin CartAppliedRules. Si no cuadra Subtotal−Desc+Envío=Total, revisar backend.
- Checkout con pedido ahora usa `order.shipping_amount` (ya no suma localmente el precio del método de entrega elegido).
- Estado MX prellenado puede no matchear el código que espera el AddressElement de Stripe (2026-10-12).
- Social proof "4.9 · +800 riders" hardcodeado en `StripePayment.tsx` (2026-10-12).
- GiftPDPUI/DeliveryPDPUI aún con reseñas inventadas + "4.9 ★" hardcodeado (2026-10-10).
- "+800 riders" sin confirmar en varios archivos (2026-10-10).
- Quejas recurrentes en reseñas: entrega tardía, calor, cuesta encontrar el ajuste (2026-10-10).
- **Regalo vence 2026-10-31 23:59 CDMX**. **Regla BOGO 2ª unidad 50% sigue activa** sin selector.
- Checkout (2026-09-29): etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Código `DEDE` 98% activo. `useURLCartLoader` roto.

## Pending / Future Sessions
- **[ALTA]** QA links de pago con descuento manual (totales, prellenado, cobro por order.total_amount).
- **[ALTA]** Medir Pasos 1+2 el 24-oct. **[ALTA]** Encuesta PostHog PDP móvil.
- **[ALTA]** `RodataReviews` en GiftPDPUI/DeliveryPDPUI/home (pedir OK). **[MEDIA]** Guía visual "cómo ajustarla".
- **[ALTA]** QA del fix regalo. **[ALTA]** Decidir regla BOGO `7653e73d` (solo con OK).
- **[ALTA]** Formulario dirección MX + QA compra real. **[ALTA]** Muñequeras precio final.
- **[MEDIA]** Test regalo en Meta Ads. **[MEDIA]** Investigar caída de tráfico.
- **[BAJA]** Borrar `PackOfferSelector.tsx`. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.