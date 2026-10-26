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
- **Objetivo cliente 2026-10-26: subir AOV** (hoy ≈ $799). Quiere la URL regalo a **$899 + regalo**, resto de la tienda sigue a $799. SIN experimento.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico**: 94% mobile, ~80% Meta Ads. **La tienda vende también por links de pago** `/pagar?token=…`.
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
- **Precio distinto por URL = PRODUCTO DUPLICADO en la BD** (el backend recalcula precios desde la BD; nunca cambiar precio en el navegador).
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"**.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07).
- **Reseñas: fuente única `src/data/rodataReviews.ts`** + `src/components/RodataReviews.tsx`. Rating/conteo NUNCA hardcodeados. NO inventar reseñas.
- **Galería PDP: SOLO fotos de catálogo**. Info panel PDP usa `flex flex-col gap-5`. H1 PDP `text-2xl sm:text-3xl md:text-4xl`.
- **CHECKOUT — totales (regla 2026-10-12)**: con pedido (`checkoutState.order`) Subtotal/Descuento/Envío/Total = valores del pedido. Helper `src/lib/order-totals.ts`.
- **Links de pago**: `source: 'payment_link'` → `isPaymentLinkOrder`; con `discount_amount > 0` → `quantityLocked`.
- Cobro: Stripe/OXXO/SPEI/PayPal mandan `order_id` + `checkout_token` existentes; monto = `order.total_amount`.

## Active Plan

### 💰 URL regalo a $899 con producto duplicado (PLANEADO 2026-10-26 — esperando 3 respuestas del cliente)
**Qué quiere**: `/productos/soporte-lumbar-rodata-one-regalo` vende Rodata One a **$899 + muñequeras de regalo**. Todas las demás URLs siguen a $799.
Sin experimento. Para un adset nuevo de Meta.

**Por qué producto duplicado (decisión)**: checkout-create/backend recalcula precios desde la BD por product/variant id → no se puede
poner $899 solo en el navegador (se cobraría $799 o fallaría). Un producto propio a $899 = precio real en backend, reportes separados
(se ve cuánto vende la URL $899 vs $799), cero riesgo para la PDP normal.

**Respuestas pendientes del cliente (pedir antes de construir):**
1. **Fecha fin regalo**: `GIFT_OFFER_ENDS_AT = 2026-10-31T23:59:59-06:00` → vence en 5 días; después la URL redirige a la PDP $799.
   Para el adset nuevo hay que poner una NUEVA fecha fija real (o `null` = "hasta agotar existencias").
2. **Precio tachado** del duplicado: mantener $1,339 (→ 33% OFF) u otro. Un solo ancla.
3. **Nombre en checkout/pedido** del duplicado (lo ve la clienta en carrito/correo). Sugerido: "Rodata One" (igual) o "Rodata One + Regalo".

**Pasos (Craft Mode):**
1. `create-product` duplicado del Rodata One:
   - título (según respuesta 3), descripción + imágenes idénticas al original (copiar de `ecommerce--list-data` products id `400026a2…`).
   - slug `soporte-lumbar-rodata-one-899` (interno), status active, tags `no-listar,precio-899`.
   - opción `Talla` S/M/L/XL, **todas price 899**, compare_at según respuesta 2, `cost 209`, `track_inventory false`.
   - Anotar nuevos ids (producto + 4 variantes) en Brand & Context.
2. `src/lib/gift-offer.ts`:
   - Nuevas constantes `GIFT_PDP_PRODUCT_ID` / `GIFT_PDP_PRODUCT_SLUG` = duplicado $899.
   - `GIFT_MAIN_PRODUCT_ID` → id del duplicado (así el regalo SOLO se engancha al producto $899; un Rodata One $799 en carrito ya NO
     dispara el regalo — más limpio que hoy). Mantener `GIFT_MAIN_PRODUCT_SLUG` (original) SOLO para canonical y redirect post-promo;
     renombrar a `ORIGINAL_PRODUCT_SLUG` si queda más claro.
   - `GIFT_OFFER_ENDS_AT` según respuesta 1.
3. `src/pages/GiftLanding.tsx`: `<HeadlessProduct slug={GIFT_PDP_PRODUCT_SLUG}>`. Canonical sigue apuntando a la PDP original, noindex se mantiene.
   Redirect post-promo sigue a la PDP original ($799).
4. `src/components/GiftCartSync.tsx`: `hasMain` usa el id del duplicado (vía `GIFT_MAIN_PRODUCT_ID`). Verificar que si el carrito tiene
   los DOS productos (799 y 899) el regalo se queda solo 1.
5. `src/App.tsx`: redirect `/productos/soporte-lumbar-rodata-one-899` → `GIFT_PDP_PATH` (igual que el de `regalo-munequeras-rodata`), para que
   el duplicado no tenga una PDP genérica indexable.
6. Verificar que el duplicado NO aparece en home/listados/búsqueda (`HeadlessIndex` trae TODOS los activos — revisar `IndexUI` y filtrar
   tag `no-listar` si hay grid), ni en sitemap/merchant feed si existe.
7. `GiftPDPUI.tsx`: precios ya son dinámicos (`logic.currentPrice/currentCompareAt`) → no hardcodear 899. Revisar copy que diga "$799"
   o "mismo precio" (grep 799/1339 dio 0 hardcodeados en precio, revisar textos tipo "pagas lo mismo"). Copy sugerido de valor:
   "Llévate el Rodata One + soporte de muñeca (valor $449) de regalo".
8. Tracking: Pixel/CAPI mandarán el id del duplicado como content_id. Si el cliente usa catálogo de Meta, avisar. Value = 899 (correcto, viene del precio).
9. QA: compra de prueba en preview → checkout muestra Rodata One $899 + regalo $0, total $899; PDP normal sigue $799; carrito mixto OK;
   links de pago no afectados.

**Medir**: AOV y CVR del adset nuevo vs adsets a $799 (Dashboard/Meta). Referencia: CVR móvil PDP 2.2%. A $899 con $209 de costo,
el margen por unidad sube de $590 a $690 (+17%) → compensa si la CVR cae menos de ~14.5%.

### 💳 Fix links de pago `/pagar?token=` (HECHO 2026-10-12 — falta QA real)
- Totales del pedido, descuento manual como línea, prellenado, cantidad bloqueada.
- **QA pendiente**: link real con descuento manual (Subtotal − Desc + Envío = Total; estado en Stripe; cobro por total del pedido).

### 📱 Mejora PDP móvil `/productos/soporte-lumbar-rodata-one` — POR PASOS
Archivo: `src/pages/ui/ProductPageUI.tsx`. Baseline en `.lovivo/cro-log.md`. ✅ Pasos 1, 2, 2c–2f (2026-10-10).
**Paso 2b (pendiente)**: `RodataReviews` en GiftPDPUI y DeliveryPDPUI — pedir OK (ahora más relevante: la URL regalo recibirá tráfico del adset nuevo).
**Paso 3**: imágenes galería. **Paso 4**: Encuesta PostHog. **Paso 5**: /pagar regreso a PDP.

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07. Regla BOGO `7653e73d` está **INACTIVA** (verificado 2026-10-26, `active: false`).
### ✅ Exp precio $799 vs $849 — CERRADO 2026-09-22 (resultado no registrado en plan).
### 🎁 B) Test "PDP normal vs PDP regalo" — reemplazado por adset dedicado a $899 (2026-10-26).
### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK)
### PDP Muñequeras — pendiente validación cliente. Merchant Center — pendiente cliente.

## Recent Changes
- **📋 Plan URL regalo a $899 con producto duplicado (2026-10-26)** — esperando fecha fin, precio tachado y nombre.
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

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` = Alan M. (SOLO reseñas), `u068d1b4pr.webp` = Pablo B., `c3mx3z3w5kt.webp` = Esteban V.
- **UGC REALES** `SB_MSG/1791663680441-`: `cr0tattp1ss.webp` = Leonel B., `8818z991fgk.webp` = Emilio Z.
- **UGC REAL (feature 02)** `SB_MSG/1791664562254-pgzyfsa1vdo.webp` = desierto → `FEAT_IMG_2`.
- Catálogo lumbar (2048px): `nae4riov9h.webp` (hero), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`. Render/IA. (El duplicado $899 usa las MISMAS.)
- Reseñas viejas: `SB_PROD/review-1.webp` (REAL = Leonel B.), `review-4.webp` (real). Avatares `SB_PROD/avatar-*-v3.webp` (probable IA, en GiftPDPUI).
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`. Muñequeras (reales) `SB_MSG/1790638502334-*`.
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp`. Home HERO `SB_MSG/1775772513540-16g7elmcuii.webp`.
- Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Regalo vence 2026-10-31 23:59 CDMX** → después `/productos/soporte-lumbar-rodata-one-regalo` redirige a la PDP $799. Bloquea el adset nuevo si no se cambia (2026-10-26).
- **GiftPDPUI aún con reseñas inventadas + "4.9 ★" hardcodeado** (2026-10-10) — la URL regalo va a recibir tráfico pagado nuevo; arreglar junto con el $899.
- Checkout links de pago (2026-10-12): sin QA con link real. Estado MX en Stripe puede no matchear.
- Social proof "4.9 · +800 riders" hardcodeado en `StripePayment.tsx` (2026-10-12). "+800 riders" sin confirmar en varios archivos.
- Quejas recurrentes en reseñas: entrega tardía, calor, cuesta encontrar el ajuste (2026-10-10).
- Checkout (2026-09-29): etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Código `DEDE` 98% activo. `useURLCartLoader` roto.

## Pending / Future Sessions
- **[ALTA]** Construir URL regalo a $899 (tras respuestas del cliente). Incluir RodataReviews reales en GiftPDPUI (pedir OK).
- **[ALTA]** QA links de pago con descuento manual.
- **[ALTA]** Medir Pasos 1+2 PDP móvil. **[ALTA]** Encuesta PostHog PDP móvil.
- **[ALTA]** Formulario dirección MX + QA compra real. **[ALTA]** Muñequeras precio final.
- **[MEDIA]** Guía visual "cómo ajustarla". **[MEDIA]** Investigar caída de tráfico.
- **[BAJA]** Borrar `PackOfferSelector.tsx`. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.