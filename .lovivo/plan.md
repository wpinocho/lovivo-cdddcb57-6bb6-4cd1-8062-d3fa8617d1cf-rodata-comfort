# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO (2026-09-28)**: "Regalo: Muñequeras RODATA (par)" id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  **price 0**, compare_at 449 (valor mostrado tachado). Tags `regalo,no-listar`. Su URL redirige a la PDP regalo (nunca se vende solo).
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads. ~130 ventas/30d, CVR PDP ≈ 2.2%.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · devolución normal = cliente paga regreso · defectuoso = RODATA cubre ·
  1er cambio de talla SIN COSTO · reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear (lov-copy) `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`. NO tocar PDP original.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- Copy devolución: "30 días para devolver", NO "garantía". Sin claims médicos. Un solo ancla de precio.
- **Urgencia: SOLO real** (fecha fija de fin + inventario). Nada de contadores que se reinician por visitante.
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.

## Active Plan
### 🎁 PDP Regalo v2 — nombre con valor + tarjeta con urgencia + modal + vibración (planeado 2026-09-29, pendiente Craft)
URL: `/productos/soporte-lumbar-rodata-one-regalo`. Archivo principal: `src/pages/ui/GiftPDPUI.tsx` (fork, NO tocar ProductPageUI ni WristWrapPDPUI).

**⚠️ Confirmar con cliente ANTES de construir:** fecha real de fin del regalo (propuesta: **jueves 9 de octubre 2026** = 10 días desde 2026-09-29). Si no la da, usar solo "hasta agotar el inventario de lanzamiento" (sin fecha).

#### Investigación de vibración (2026-09-29) — base del copy
- El motor y el camino transmiten vibración por el manubrio a manos/muñecas → fatiga, menos fuerza de agarre, hormigueo/"manos dormidas" (lenguaje de rider). Motores mono/bicilíndricos vibran más. Estudios de "hand-arm vibration" en motociclistas (policías motorizados, motocross) lo documentan.
- Lo que realmente REDUCE vibración son puños/contrapesos. Una muñequera de compresión **NO elimina la vibración**: sostiene la muñeca firme en posición natural → la vibración **cansa menos**. Claim honesto = "para que la vibración del manubrio te canse menos". PROHIBIDO: "elimina la vibración", "quita el hormigueo", "cura/previene túnel carpiano".
- Ángulo unificador del kit: **"La moto vibra todo el camino y pega en dos lugares: espalda baja y muñecas. Este kit cubre los dos."** (el home ya dice "La postura, la vibración y los trayectos largos terminan cargando la zona lumbar").

#### Cambios (todos en GiftPDPUI.tsx salvo que se indique)
1. **Nuevo nombre visible del regalo**: "Soporte de muñeca para moto (par)" (en vez de "Par de Muñequeras RODATA"). Crear constantes `GIFT_NAME = 'Soporte de muñeca para moto'`, `GIFT_NAME_SHORT = 'soporte de muñeca'`.
   - Badge bajo precio (línea ~394): `+ REGALO: soporte de muñeca para moto (valor $449)` (valor desde `giftValue`, nunca hardcodeado).
   - Craft `update-product` del producto regalo `f29e9557-...`: título → **"Regalo: Soporte de muñeca RODATA (par)"** (aparece en carrito, checkout, pedido y email). NO tocar el producto muñequeras normal.
2. **Tarjeta de regalo (líneas ~507-521) → botón tocable**:
   - `<button type="button">` completo, abre el modal. Añadir affordance visible "Ver qué incluye ›" (texto amber 11px) + chevron.
   - Línea 1 eyebrow: "🎁 TU REGALO · NUEVO EN RODATA"
   - Título: "Soporte de muñeca para moto" + subtítulo pequeño "Incluye 2 · contra la fatiga por vibración"
   - QUITAR "Se agrega automáticamente a tu pedido" de la tarjeta (se mueve al modal y FAQ).
   - Línea de urgencia (amber-light, 11px, con punto pulsante): **"Gratis solo hasta el 9 de oct o agotar existencias"** (fecha desde constante; si no hay fecha: "Gratis mientras dure el inventario de lanzamiento").
   - Derecha: $449 tachado + GRATIS (igual).
3. **Modal del regalo (nuevo)** — usar `Drawer` (vaul, `src/components/ui/drawer.tsx`) = bottom sheet nativo en móvil (94% tráfico). Máx ~85vh, scroll interno. Contenido:
   - Foto: `SB_MSG/1790638502334-nwhrcsc3un.webp` ("Esto recibes", par) o estudio `pkwpdneq4dd`; aspect 4/3, badge "Incluido gratis".
   - Eyebrow "NUEVO EN RODATA" · Título "Soporte de muñeca para moto (par)" · $449 tachado → **GRATIS con tu Rodata One**.
   - Reason-why (1-2 líneas): "Es lo más nuevo de RODATA. Queremos que más riders lo prueben, así que durante el lanzamiento va gratis con cada Rodata One."
   - Problema (1 línea): "El manubrio te pasa vibración todo el camino. A la hora la muñeca ya se siente cansada — a veces hasta dormida."
   - 3 beneficios (check amber), reciclados de WristWrapPDPUI + vibración:
     - **Menos fatiga por vibración** — la compresión mantiene firme la muñeca para que el zumbido del manubrio te canse menos en carretera y tráfico.
     - **Debajo del guante** — no estorba el acelerador ni el clutch.
     - **Incluye 2** — izquierda y derecha, talla única ajustable.
   - Caja de urgencia (borde amber): "⏳ Gratis hasta el [fecha] o hasta agotar el inventario de lanzamiento, lo que pase primero."
   - Línea tranquilizadora: "Se agrega solo a tu pedido. No tienes que hacer nada."
   - CTA primario `handlePrimary`: "Comprar ahora · $799 + regalo" (precio desde `logic.formatMoney(ctaPrice)`), deshabilitado con `ctaDisabled`; secundario texto "Seguir viendo" (cierra).
   - `DrawerTitle`/`DrawerDescription` presentes (evita warning aria).
4. **Galería imagen 2 (kit)**: etiqueta en 2 líneas (móvil y desktop): "🎁 INCLUIDO GRATIS" / "Soporte de muñeca para moto (par)". Hacer la imagen/etiqueta tocable para abrir el mismo modal (opcional, bajo costo).
5. **Quitar ruido de badges bajo el precio**: eliminar la pill "🏷 Oferta de Lanzamiento · Envío gratis incluido" SOLO en GiftPDPUI (envío gratis ya está en trust row y bajo el CTA). Hoy hay 4 elementos amber compitiendo (-20%, 20% OFF, badge regalo, pill) → que el regalo sea el protagonista.
6. **Sección regalo (4b, líneas ~672-692)**:
   - Eyebrow "TU REGALO · NUEVO EN RODATA"; H2 igual: "Porque la espalda no es lo único que se cansa".
   - Nuevo párrafo intro (vibración, ángulo kit): "La moto vibra todo el camino y esa vibración pega en dos lugares: tu espalda baja y tus muñecas. El Rodata One cuida la primera. Este soporte, la segunda."
   - `GIFT_LINES` nuevas:
     - "Menos fatiga por vibración" — "Compresión firme que sostiene la muñeca en su posición natural, para que el zumbido del manubrio te canse menos en carretera y tráfico."
     - "Debajo del guante, sin estorbar" — "Perfil delgado con abertura para el pulgar. No estorba el acelerador ni el clutch."
     - "Incluye 2, talla única" — "Izquierda y derecha. Se ajustan en segundos y te olvidas de ellas."
   - Botón texto "Ver detalles del regalo ›" que abre el modal.
7. **Sticky bar móvil (línea ~853)**: "Incluye soporte de muñeca gratis". Desktop igual con nuevo nombre.
8. **CTA final (sección 9)**: bajo el precio, línea amber "+ Soporte de muñeca de regalo · hasta el [fecha]". Botón igual.
9. **FAQs**:
   - "¿El regalo tiene costo?" → "No. El soporte de muñeca (par) va incluido en tu pedido y se agrega solo; no tienes que hacer nada."
   - "¿Hasta cuándo?" → "Hasta el [fecha] o hasta agotar el inventario de lanzamiento, lo que pase primero." (sin fecha: "Mientras dure el inventario de lanzamiento.")
   - NUEVA "¿El soporte de muñeca sirve para la vibración?" → "Ayuda a que la vibración del manubrio te canse menos: la compresión mantiene la muñeca firme en su posición natural. Si la molestia o el hormigueo siguen después de bajarte, conviene consultarlo con un médico."
10. **Fin real de la promo** (`src/lib/gift-offer.ts`): `GIFT_OFFER_ENDS_AT` (ISO, fin del día CDMX) + helper `isGiftOfferActive()` + `formatGiftEndDate()` ("9 de oct"). Si terminó: `GiftLanding` redirige (replace) a `/productos/soporte-lumbar-rodata-one`; `GiftCartSync` deja de AGREGAR regalos (no quitar los ya en carrito dentro de checkout en curso); `isGiftEligible()` también exige promo activa. Si no hay fecha → constante `null` = sin vencimiento.

#### NO cambiar
- Un solo ancla de precio ($999 → $799). Sin "valor total $1,448".
- Bullets lumbar del buy box, reseñas (son del lumbar; no inventar reseñas del regalo), tracking/Pixel/PostHog, precios, experimento de pack.

#### QA
- Móvil 390px: badge bajo precio en 1 línea o wrap limpio; tarjeta sin cortes; drawer abre/cierra, CTA del drawer lleva a checkout con regalo $0.
- Checar carrito/checkout muestran el nuevo título del regalo.

### PDP Regalo (2026-09-28) — QA real pendiente
- Archivos: `src/lib/gift-offer.ts`, `src/hooks/useGiftProduct.ts`, `src/components/GiftCartSync.tsx`, `src/pages/GiftLanding.tsx`, `src/pages/ui/GiftPDPUI.tsx`. Carrito/checkout muestran "Regalo · GRATIS".
- **QA pendiente**: compra real (Stripe, PayPal, Apple/Google Pay) confirmando línea $0. (Consola 2026-09-29 muestra checkout-create OK pero sin verificar línea regalo.)
- Riesgo: flag elegibilidad 7 días (se acotará con fecha fin en v2). Si quitan el lumbar dentro de /pagar el regalo queda solo ($0).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.
### Experimento `exp-cdddcb57-pdp-second-belt-offer` (activo) — BOGO `7653e73d` limitada a Rodata One.

## Recent Changes
- **📋 Plan PDP Regalo v2 (2026-09-29)** — nombre "Soporte de muñeca para moto", tarjeta con urgencia real, drawer de detalles, vibración, fecha fin. Pendiente Craft.
- **🎁 PDP Rodata One + Muñequeras de regalo (2026-09-28)** — producto regalo $0 + GiftCartSync + GiftLanding + GiftPDPUI + cart/checkout "GRATIS".
- **🧤 PDP Muñequeras RODATA (2026-09-28)**.
- **🛡️ Merchant Center trust fix (2026-09-28)**.
- **🎯 Fix event_id Meta Pixel + CAPI (2026-09-26)**.
- **🎨 Fix contraste `CartAppliedRules.tsx` (2026-09-22)**.
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22)**.
- **✅ `/politica-de-devoluciones` creada** (2026-09-22).
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.
- **⚪ Test de precio $799 vs $849 CERRADO inconcluso** (2026-09-22).
- **✅ ETA centralizado** (2026-09-03).
- **✅ Recuperación de pagos rechazados** (2026-09-03).
- **✅ Google Ads (gtag.js)** (2026-09-01).
- **✅ Instrumentación checkout PostHog** (2026-08-25).
- **✅ Fotografía real en `/repartidores`** (2026-08-20).

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (generado IA 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp` (faja + par de muñequeras, fondo oscuro)
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio), `q4h7kvtg3nn` (en manubrio, texto quemado), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes" — usar en drawer), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Regalo (2026-09-28)**: sin QA de compra real; no verificado que checkout-create acepte línea price 0 (si falla, alternativa: precio simbólico o regla de descuento).
- **Regalo — urgencia**: fecha de fin aún no confirmada por cliente (2026-09-29). No publicar fecha que no se vaya a cumplir.
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[ALTA]** Construir PDP Regalo v2 (ver Active Plan) tras confirmar fecha fin.
- **[ALTA]** QA compra real en celular en PDP regalo (comprar ahora, carrito, Apple/Google Pay, PayPal) → confirmar regalo $0 en pedido.
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo (valor mostrado).
- **[MEDIA]** Medir clics en tarjeta/drawer del regalo (evento PostHog) — solo si no toca contextos de tracking.
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.