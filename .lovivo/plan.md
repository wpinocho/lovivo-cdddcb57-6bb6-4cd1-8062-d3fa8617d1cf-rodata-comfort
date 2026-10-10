# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). **compare_at $1,339 (40% OFF) CONFIRMADO intencional por cliente 2026-10-10.**
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Tallas más vendidas: L y XL** (cliente 2026-10-10) → PDP preselecciona L.
- **Reseñas publicadas: 168** (16 originales + 150 con fecha + 2 con foto Emilio Z./Leonel B. 2026-10-10). Cliente CONFIRMÓ por escrito que son reales,
  validadas por WhatsApp y con consentimiento. Rating calculado ≈ **4.6**. Recomendado al cliente guardar capturas (PROFECO).
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
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio. **NO "Oferta de Lanzamiento"**.
  (Citas textuales de clientes se dejan tal cual, aunque digan "garantía".)
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07).
- **Reseñas: fuente única `src/data/rodataReviews.ts`**: PHOTO_REVIEWS (5: Pablo B., Esteban V., Alan M., Leonel B., Emilio Z.) + ORIGINAL_TEXT_REVIEWS
  + `DATED` (tuplas `[nombre, 'YYYY-MM-DD', estrellas, texto]`, orden fecha desc) + ORIGINAL_LOGISTICS_COMPLAINTS (al final). `REVIEW_STATS`/`ALL_REVIEWS` derivados.
  Componente `src/components/RodataReviews.tsx`: resumen + barras **clicables → modal con solo reseñas de N estrellas** (`StarFilterModal`, filtra ALL_REVIEWS,
  fila con 0 deshabilitada), carrusel de fotos horizontal en todos los tamaños, 5 texto + "Cargar N más" de 10 en 10, `ReviewCard` reutilizable.
  **SIN subtítulo** bajo "Lo que dicen los riders" (cliente lo pidió quitar 2026-10-10). **Rating/conteo NUNCA hardcodeados**. NO inventar reseñas.
- **Galería PDP: SOLO fotos de catálogo** — cliente NO quiere fotos de reseña en la galería (2026-10-10).
- **Info panel PDP (título/precio) usa `flex flex-col gap-5`, NO `space-y-*`** — con `space-y` el div "eyebrow" `hidden md:flex` sigue
  contando para el margen del h1 en mobile (space-y no respeta la clase `hidden`, solo el atributo HTML `hidden`), causaba hueco en blanco
  arriba del título (fix 2026-10-10).
- **H1 título PDP**: `text-2xl sm:text-3xl md:text-4xl` (antes `text-3xl sm:text-4xl` se iba a 2 líneas en mobile con "Soporte Lumbar Rodata One").

## Active Plan

### 📱 Mejora PDP móvil `/productos/soporte-lumbar-rodata-one` — POR PASOS (cliente revisa cada uno)
Archivo: `src/pages/ui/ProductPageUI.tsx` (NO tocar GiftPDPUI/DeliveryPDPUI salvo que el cliente lo pida). Baseline en `.lovivo/cro-log.md`.

**✅ Paso 1 (2026-10-10)**: sticky bar · talla L · medir cintura · envío gratis · fotos reales · copy devoluciones.
**✅ Paso 2 / 2c / 2d / 2e (2026-10-10)**: reseñas reales con foto + texto, resumen con barras, +150 con fecha, modal filtro estrellas.
**✅ Paso 2f (2026-10-10)**: fix h1 2 líneas + hueco en blanco arriba del título (flex gap-5 en vez de space-y-5) + nueva foto real en
  sección "Rueda horas sin detenerte a ajustar nada" (desierto, reemplaza foto genérica) en `FEAT_IMG_2`.
**Paso 2b (pendiente)**: aplicar `RodataReviews`/`REVIEW_STATS` en GiftPDPUI y DeliveryPDPUI (aún "4.9 ★" hardcodeado + reseñas inventadas) — pedir OK.
**Paso 3**: imágenes galería — catálogo 2048px (LCP), foto "cómo medir cintura", más fotos en moto.
**Paso 4**: Encuesta PostHog "¿Qué te frenó para comprar hoy?" (PDP móvil, 40 s sin ATC).
**Paso 5**: /pagar — 1 de cada 6 regresa a PDP. Relacionado con formulario dirección MX.
**Medir**: 24-oct comparar 14 días vs baseline (CVR móvil 2.2%, ATC 9.3%).

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07 (gana control)
- Selector quitado. `PackOfferSelector.tsx` sin imports. **Regla BOGO `7653e73d` SIGUE ACTIVA**.

### 🎁 B) Test "PDP normal vs PDP regalo" — EN PAUSA
- Recomendación: A/B en Meta Ads (`utm_content=control|regalo`). Break-even margen/pedido ≈ $423. `GIFT_OFFER_ENDS_AT = '2026-10-31T23:59:59-06:00'`.

### 🎁 Elegibilidad regalo (FIX 2026-10-07)
- Regalo solo si hay Rodata One en carrito mientras `pathname === GIFT_PDP_PATH` → claim `rodata-gift-claimed` (TTL 7d).

### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK)
- `src/components/MxAddressForm.tsx`: Nombre(s)|Apellidos · Calle y núm ext · Núm int · Colonia · CP | Ciudad · Estado · Teléfono. Rollback `USE_CUSTOM_ADDRESS_FORM`. Fix `clients-upsert 400`.

### PDP Muñequeras — pendiente validación cliente. Merchant Center — pendiente cliente.

## Recent Changes
- **📐 Fix h1 2 líneas + hueco blanco arriba de título + nueva foto real sección "Rueda horas..." (2026-10-10)**.
- **⭐ +2 reseñas con foto (Leonel B., Emilio Z.) en carrusel, sin subtítulo, modal filtro por estrellas (2026-10-10)**.
- **⭐ +150 reseñas con fecha cargadas (cliente confirmó reales), total 166, fecha visible por reseña (2026-10-10)**.
- **⭐ Reseñas v3: resumen con barras, cargar más 10 en 10, rating derivado en toda la PDP (2026-10-10)**.
- **⭐ PDP Paso 2: reseñas reales con foto + texto, "ver más", galería sin foto de reseña (2026-10-10)**.
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

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- **UGC REALES** `SB_MSG/1791657732114-`: `ghaahb3lsec.webp` = **Alan M.** (SOLO reseñas, NO galería), `u068d1b4pr.webp` = **Pablo B.** (Rally ADV Jalisco),
  `c3mx3z3w5kt.webp` = **Esteban V.** (empaque).
- **UGC REALES** `SB_MSG/1791663680441-`: `cr0tattp1ss.webp` = **Leonel B.** (Honda roja, = review-1), `8818z991fgk.webp` = **Emilio Z.** (selfie espejo).
- **UGC REAL (feature 02)** `SB_MSG/1791664562254-pgzyfsa1vdo.webp` = foto real desierto (rider con lumbar puesto) → ahora `FEAT_IMG_2` en sección
  "Rueda horas sin detenerte a ajustar nada" (reemplazó foto genérica `1775777133672-xhxki05535d`, 2026-10-10).
- Catálogo lumbar (object/public/product-images/products/, 2048px): `nae4riov9h.webp` (hero), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`. Render/IA.
- Reseñas viejas: `SB_PROD/review-1.webp` (REAL, Honda roja = Leonel B.), `review-4.webp` (real). review-2/3/5 ya no se usan en ProductPageUI.
- Avatares `SB_PROD/avatar-*-v3.webp` (probable IA) — ya no en ProductPageUI; siguen en GiftPDPUI.
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd`, `q4h7kvtg3nn`, `0yjgi3apchym`, `nwhrcsc3un`, `2wwj6uvz7a5`
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1,3 `SB_MSG/177577713367x-*`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- GiftPDPUI/DeliveryPDPUI aún con reseñas inventadas (Carlos M., fechas 2025) + avatares IA + "4.9 ★" hardcodeado (2026-10-10).
- "+800 riders" sin confirmar: ProductPageUI stats bar, GiftPDPUI, DeliveryPDPUI, StripePayment, EcommerceTemplate (2026-10-10).
- **Quejas recurrentes en reseñas**: entrega tardía (3), calor/capa extra (~8), cuesta encontrar el ajuste (~10) → oportunidad: guía de ajuste en PDP (2026-10-10).
- Talla S sigue siendo default en GiftPDPUI/DeliveryPDPUI/muñequeras; solo ProductPageUI fuerza L.
- **Regalo vence 2026-10-31 23:59 CDMX**. **Regla BOGO 2ª unidad 50% sigue activa** sin selector.
- Producto regalo sin `cost`. Regalo sin QA de compra real.
- **Checkout (2026-09-29)**: etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto.
- PostHog `addtocart`/`purchase` sin propiedades de variante.
- Revisar en celular real que el h1 ya no se vaya a 2 líneas y que no quede hueco arriba (fix aplicado 2026-10-10, sin QA visual post-deploy).

## Pending / Future Sessions
- **[ALTA]** Medir Pasos 1+2 el 24-oct. **[ALTA]** Lanzar encuesta PostHog PDP móvil (Paso 4).
- **[ALTA]** Llevar `RodataReviews` a GiftPDPUI/DeliveryPDPUI/home (pedir OK). **[MEDIA]** Guía visual "cómo ajustarla" (queja #1 en reseñas).
- **[ALTA]** QA del fix regalo. **[ALTA]** Decidir regla BOGO `7653e73d` (solo con OK).
- **[ALTA]** Formulario dirección MX + QA compra real. **[ALTA]** Muñequeras precio final.
- **[MEDIA]** Test regalo en Meta Ads. **[MEDIA]** Investigar caída de tráfico (Dashboard / Meta Ads).
- **[BAJA]** Borrar `PackOfferSelector.tsx`. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.