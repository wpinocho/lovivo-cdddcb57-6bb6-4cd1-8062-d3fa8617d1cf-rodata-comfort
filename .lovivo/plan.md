# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: título **"Regalo: Soporte de muñeca RODATA (par)"** id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  **price 0**, compare_at 449. Tags `regalo,no-listar`. **SIN cost cargado** (necesario para medir margen real). Nombre visible: "Soporte de muñeca para moto".
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads. ~130 ventas/30d, CVR PDP ≈ 2.2–2.7%.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · devolución normal = cliente paga regreso · defectuoso = RODATA cubre ·
  1er cambio de talla SIN COSTO · reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`. NO tocar PDP original.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- Copy devolución: "30 días para devolver", NO "garantía". Sin claims médicos. Un solo ancla de precio.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos (nunca por visitante).
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina la vibración / quita hormigueo / túnel carpiano".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.
- **Regalo SOLO desde la URL regalo** (regla cliente 2026-10-07): ninguna otra página debe agregar el regalo.

## Active Plan

### ✅ A) Experimento pack 2ª unidad 50% — CERRADO 2026-10-07 (gana control)
- Manifiesto `rodata-one-pack-presentation.json` → `completed`. Selector/gate quitado de `ProductPageUI.tsx` y `GiftPDPUI.tsx` (`ctaPrice = logic.currentPrice`).
- `HeadlessProduct` conserva lógica `packOffer` inerte. `PackOfferSelector.tsx` sin imports (se puede borrar).
- **Regla BOGO `7653e73d` SIGUE ACTIVA** — el cliente pidió no tocar nada más.

### 🎁 B) Test "PDP normal vs PDP regalo" — EN PAUSA (cliente: "por ahora nada más")
- Recomendación: A/B en Meta Ads (ad set duplicado, solo cambia URL con `utm_content=control|regalo`), NO redirect en tienda.
- Break-even: margen/pedido control ≈ $423. Regalo costo X → necesita +X/(423−X) conversión. Pedir costo real del par.
- `GIFT_OFFER_ENDS_AT = '2026-10-31T23:59:59-06:00'`.

### 🎁 Lógica de elegibilidad del regalo (FIX 2026-10-07)
- ANTES: visitar la URL regalo ponía flag 7 días (`rodata-gift-eligible`) → el regalo se agregaba desde CUALQUIER PDP (bug reportado).
- AHORA (`gift-offer.ts` + `GiftCartSync.tsx`): el regalo se agrega SOLO si hay Rodata One en carrito mientras `pathname === GIFT_PDP_PATH`.
  Eso marca `rodata-gift-claimed` (TTL 7d). Línea regalo sin claim → se quita. Sin Rodata One → se quita y se borra el claim.
  "Comprar ahora" en PDP regalo llama `markGiftClaimed()` antes de `checkoutWithItems`. Flag legacy se borra.
- Nota: si alguien tiene Rodata One en carrito y entra a la URL regalo, el regalo se agrega al entrar (intencional).

### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK del cliente)
- Reemplazar Stripe AddressElement (solo envío) por `src/components/MxAddressForm.tsx`: Nombre(s)|Apellidos · Calle y número exterior (`line1`) · Núm. interior (opc) · Colonia (req) · CP | Ciudad · Estado (select 32) · Teléfono (`CountryPhoneSelect`).
- `line2` = `[Int. X, ]Col. Y`. País fijo MX. Mantener contrato `onAddressChange(addressValue, complete)` en CheckoutUI.tsx. Revisar `StripePayment.tsx`.
- Rollback `USE_CUSTOM_ADDRESS_FORM`. Fix `clients-upsert 400 "email requerido"`.

### 🎁 PDP Regalo v2 — CONSTRUIDA 2026-09-29 (QA real pendiente)
URL `/productos/soporte-lumbar-rodata-one-regalo`. Archivos: `src/lib/gift-offer.ts`, `GiftCountdown.tsx`, `GiftDetailsDrawer.tsx`, `GiftLanding.tsx` (al vencer → Navigate a PDP normal), `GiftPDPUI.tsx`, `GiftCartSync.tsx` (montado en App dentro de BrowserRouter).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.

## Recent Changes
- **🐛 Fix: regalo se agregaba desde la PDP normal (2026-10-07)** — ahora solo desde la URL regalo.
- **✅ Exp pack 2ª unidad 50% cerrado + regalo extendido al 31 oct (2026-10-07)**.
- **📋 Plan cerrar exp pack + test regalo vía Meta A/B (2026-10-07)**.
- **📋 Plan formulario de dirección estilo México + Colonia (2026-09-29)** — pendiente.
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
- **⚪ Test de precio $799 vs $849 CERRADO inconcluso** (2026-09-22).

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (IA 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio, thumb tarjeta), `q4h7kvtg3nn` (manubrio), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes" — drawer), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Regalo vence 2026-10-31 23:59 CDMX** (2026-10-07): después la URL regalo redirige a PDP normal.
- **Regla BOGO 2ª unidad 50% sigue activa** (2026-10-07) sin selector visible; se acumula con el regalo si alguien compra 2.
- **Producto regalo sin `cost`** (2026-10-07): margen sobrestimado hasta cargarlo.
- **Fix regalo 2026-10-07**: carritos viejos con regalo agregado antes del fix (desde la URL regalo) pierden el regalo si salen de esa página antes de pagar (no hay forma de distinguirlos del bug). Ventana pequeña.
- **Checkout (2026-09-29)**: etiquetas de Stripe confusas + sin campo Colonia. `clients-upsert` 400 "email requerido".
- **Regalo (2026-09-29)**: sin QA de compra real con línea $0.
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[ALTA]** QA del fix regalo: PDP normal → agregar → sin regalo; URL regalo → agregar → con regalo → ir a /pagar → regalo sigue.
- **[ALTA]** Decidir regla BOGO `7653e73d` (¿desactivar?) — solo con OK explícito.
- **[MEDIA]** Test regalo en Meta Ads (plan B) cuando el cliente lo retome.
- **[BAJA]** Borrar `PackOfferSelector.tsx` y lógica pack inerte en `HeadlessProduct`.
- **[ALTA]** Construir formulario de dirección MX + QA de compra real.
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo.
- **[MEDIA]** Medir clics en tarjeta/drawer del regalo (evento PostHog).
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.