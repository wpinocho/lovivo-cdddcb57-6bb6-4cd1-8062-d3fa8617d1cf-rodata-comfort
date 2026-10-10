# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799). ⚠️ **compare_at cambió a $1,339 el 2026-10-10 18:02 UTC** (antes 999 → ahora muestra "40% OFF"). Confirmar con cliente si fue intencional.
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-13ef-4283-9bd7-cf38017edb31`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-5297-4197-810c-3841f28da54e` — **todas a $799**. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: "Regalo: Soporte de muñeca RODATA (par)" id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  price 0, compare_at 449. Tags `regalo,no-listar`. SIN cost cargado.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico**: 94% mobile, ~80% Meta Ads. Tráfico PDP cayó fuerte: 2,481 únicos/sem (3-ago) → 644 (28-sep) → 287 (5–10 oct).
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
- Copy devolución: "30 días para devolver", NO "garantía"/"prueba". Sin claims médicos. Un solo ancla de precio.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos.
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina...".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07).

## Active Plan

### 🔍 Auditoría CRO PDP móvil `/productos/soporte-lumbar-rodata-one` (2026-10-10) — PROPUESTA, esperando OK
Archivo principal: `src/pages/ui/ProductPageUI.tsx` (NO tocar GiftPDPUI/DeliveryPDPUI salvo que el cliente lo pida).

**Datos (PostHog, únicos por persona):**
- CVR PDP→compra semanal: 3-ago 1.4% · 10-ago 1.8% · 17-ago 2.0% · 24-ago 2.4% · 31-ago 1.8% · 7-sep 2.7% · 14-sep 2.7% ·
  21-sep 1.6% (arranca exp pack) · 28-sep 3.7% · 5–10 oct 2.8%. → **La tasa NO cayó; lo que cayó es el TRÁFICO** (−75% vs agosto). Decirle al cliente.
- 30d por dispositivo: Mobile 3,187 PDP → 229 ATC → 71 compras (**2.2%**) · Desktop 176 → 15 (**8.5%**).
- Funnel 28-sep: PDP 644 → ATC 60 (9.3%) → checkout 57 → contacto 34 → dirección 23 → compra 24. Checkout→compra ≈ 42%.
- **59 vueltas /pagar → PDP en 30d** (~1 de cada 6 checkouts), normalmente 10–15 s después de entrar a /pagar con "Comprar ahora".
- Scroll en salida: 46% se va con <10% de scroll; 37% llega a 75%+. La mayoría pasa 30–120 s (interés, no rebote ciego).
- LCP móvil p50 2.1 s / p75 2.9 s (límite). CLS/INP OK.
- 0 encuestas PostHog creadas.

**Hallazgos + cambios propuestos (orden de prioridad):**
1. **Botón de compra fuera de la primera pantalla.** En 390×844 el CTA queda ~1.3 pantallas abajo (header + foto cuadrada + eyebrow + título + precio + badge + descripción + 3 bullets + talla + cantidad).
   La sticky bar solo aparece DESPUÉS de haber visto el CTA (`hasCTABeenVisible`) → quien no baja nunca ve botón.
   → Sticky bar móvil visible tras ~300px de scroll (o siempre) aunque no haya visto el CTA; ocultarla solo mientras el CTA inline está en pantalla.
   → Compactar arriba: quitar eyebrow "Diseñado para la postura de manejo" en móvil, quitar badge "Oferta de Lanzamiento", mover talla justo debajo del precio, bullets debajo del CTA, ocultar "Cantidad" en móvil (o mover abajo).
2. **Talla S preseleccionada por default** (`HeadlessProduct.tsx` ~L133 selecciona el primer valor disponible = S, la más chica). Riesgo de pedido con talla incorrecta / cambios / duda.
   → Agregar prop opcional `defaultOptionValues` a `HeadlessProduct` (solo usada por `Product.tsx`) para preseleccionar **M (75–90 cm)**; mostrar debajo de las tallas línea fija "Mide tu cintura a la altura del ombligo · Entre dos tallas, elige la mayor · 1er cambio de talla gratis". No romper otros consumidores de HeadlessProduct.
   → Pedir al cliente (Dashboard) distribución real de tallas vendidas para confirmar M.
3. **Credibilidad de reseñas.** Fechas "Ene–Mar 2025" pero la tienda se creó abr-2026 → inconsistencia visible. "127 reseñas verificadas", "4.9", "+800 riders" deben ser números reales. Avatares `avatar-*-v3` parecen IA.
   → Pedir al cliente: nº real de reseñas/clientes, reseñas reales (texto + ciudad + mes), fotos/screenshots de WhatsApp de clientes. Cambiar fechas a reales (2026). NO inventar. Si no hay datos, quitar números exactos y usar formulaciones verificables.
   → Subir las reseñas: insertar 2–3 reseñas en carrusel horizontal justo debajo del bloque de compra (antes de stats/lifestyle). Hoy están ~60% abajo y solo 37% llega ahí.
4. **Galería**: 5 imágenes, todas render/estudio (3 con texto encima). Falta: rider en la moto con postura de manejo, foto REAL de cliente, imagen de guía de tallas/cómo medir, "qué incluye". Sin indicador de que hay más fotos.
   → Añadir dots/contador "1/5" en galería móvil. Agregar `review-1.webp` (real, Honda roja) como 2ª imagen. Pedir al cliente fotos reales en moto; si no hay, generar imagen "cómo medir tu cintura" (Craft, `media.product-imagery`).
   → Imágenes de galería: verificar que `displayImages` use `render/image/public ... ?width=800&quality=75` (catálogo trae 2048px 300–480 KB → LCP).
5. **Claim médico** en descripción del hero: "diseñado para eliminar el dolor de espalda" → viola regla propia y política Meta. Cambiar a "para que termines cada rodada con menos fatiga en la espalda baja".
6. **Ancla de precio**: compare_at nuevo $1,339 (40% OFF) + badge "Oferta de Lanzamiento" a 6 meses del lanzamiento → riesgo de "descuento falso" (PROFECO). Confirmar intención; quitar "Lanzamiento". Un solo ancla.
7. **Copy "30 días de prueba"** (trust line, trust row, accordion, sección 7, CTA final) → cambiar a "30 días para devolver" + "1er cambio de talla gratis" (política oficial).
8. **"Comprar ahora" → /pagar directo y 1 de cada 6 regresa a la PDP.** No cambiar flujo aún; revisar en /pagar que el resumen (producto, talla, $799, envío gratis, fecha de entrega) sea lo primero visible en móvil. Relacionado con plan "Formulario dirección MX".
9. **Encuesta PostHog** (Craft/tool `posthog-survey`): PDP móvil, tras 40 s sin ATC: "¿Qué te frenó para comprar hoy?" opciones: Precio · No sé qué talla · No sé si me va a servir · Desconfianza en la tienda · Tiempo de entrega · Solo estaba viendo · Otro. Leer en 7–10 días.

**Medición**: tráfico actual ~650 PDP/sem → A/B no concluyente en tiempos razonables. Aplicar 1–7 como arreglos de claridad/confianza (no experimento), registrar baseline en `.lovivo/cro-log.md` (CVR móvil 2.2% 30d, ATC 9.3%, 59 regresos /pagar→PDP), comparar 14 días antes/después con cautela (la mezcla de anuncios cambia).

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07 (gana control)
- Selector quitado de `ProductPageUI.tsx` y `GiftPDPUI.tsx`. `PackOfferSelector.tsx` sin imports. **Regla BOGO `7653e73d` SIGUE ACTIVA**.

### 🎁 B) Test "PDP normal vs PDP regalo" — EN PAUSA
- Recomendación: A/B en Meta Ads (`utm_content=control|regalo`). Break-even margen/pedido ≈ $423. `GIFT_OFFER_ENDS_AT = '2026-10-31T23:59:59-06:00'`.
- Nota: PostHog muestra ~1 visitante/semana en la URL regalo (casi sin tráfico).

### 🎁 Elegibilidad regalo (FIX 2026-10-07)
- Regalo solo si hay Rodata One en carrito mientras `pathname === GIFT_PDP_PATH` → claim `rodata-gift-claimed` (TTL 7d).

### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK)
- `src/components/MxAddressForm.tsx`: Nombre(s)|Apellidos · Calle y núm ext · Núm int · Colonia · CP | Ciudad · Estado · Teléfono. Rollback `USE_CUSTOM_ADDRESS_FORM`. Fix `clients-upsert 400`.

### PDP Muñequeras — pendiente validación cliente. Merchant Center — pendiente cliente.

## Recent Changes
- **🔍 Auditoría CRO PDP móvil (2026-10-10)** — plan guardado, sin cambios de código.
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
- **✅ `/politica-de-devoluciones` creada** (2026-09-22).
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/, 2048px): `nae4riov9h.webp` (hero: rider de espaldas con chamarra, texto "Se siente parte de tu equipo"), `j8kw94s83hn` (producto en carretera atardecer, texto), `pjleekrch4l` (callouts: correas/panel/malla), `b5mg4lv2qbf` (estudio frente), `0evbcgfgplnh` (estudio interior, 1254px). Todas render/IA — **ninguna en moto ni real**.
- Reseñas: `SB_PROD/review-1.webp` (REAL: hombre con faja junto a Honda roja — candidata a galería), `review-4.webp` (real: faja en piso de madera), review-2/3/5 sin revisar.
- Avatares `SB_PROD/avatar-{carlos,jorge,andres}-v3.webp` (probable IA).
- **Kit regalo**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd`, `q4h7kvtg3nn`, `0yjgi3apchym`, `nwhrcsc3un`, `2wwj6uvz7a5`
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **compare_at Rodata One cambió 999 → 1,339 (2026-10-10)** — sin confirmar si fue intencional; PDP ahora dice 40% OFF.
- **Reseñas PDP con fechas 2025** (tienda creada abr-2026) + cifras 127/4.9/+800 sin verificar (2026-10-10).
- **Talla S preseleccionada por default** en todas las PDP que usan HeadlessProduct (2026-10-10).
- **Claim "eliminar el dolor de espalda"** en hero PDP (2026-10-10).
- **Regalo vence 2026-10-31 23:59 CDMX**. **Regla BOGO 2ª unidad 50% sigue activa** sin selector.
- Producto regalo sin `cost`. Regalo sin QA de compra real.
- **Checkout (2026-09-29)**: etiquetas Stripe confusas + sin Colonia. `clients-upsert` 400.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx`. Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto.
- PostHog `addtocart`/`purchase` sin propiedades de variante (no se puede ver talla por evento).

## Pending / Future Sessions
- **[ALTA]** Ejecutar auditoría PDP móvil (puntos 1–7) tras OK del cliente + registrar baseline en cro-log.
- **[ALTA]** Lanzar encuesta PostHog PDP móvil (punto 9).
- **[ALTA]** Preguntar: ¿compare_at $1,339 intencional? · nº real de reseñas/clientes · fotos reales en moto · distribución de tallas vendidas.
- **[ALTA]** QA del fix regalo. **[ALTA]** Decidir regla BOGO `7653e73d` (solo con OK).
- **[ALTA]** Formulario dirección MX + QA compra real. **[ALTA]** Muñequeras precio final.
- **[MEDIA]** Test regalo en Meta Ads. **[MEDIA]** Investigar caída de tráfico (Dashboard / Meta Ads).
- **[BAJA]** Borrar `PackOfferSelector.tsx`. **[ALTA]** Merchant Center. **[CRÍTICA]** decisión `DEDE`.