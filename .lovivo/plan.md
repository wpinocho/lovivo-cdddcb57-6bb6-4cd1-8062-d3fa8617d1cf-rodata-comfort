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

## Active Plan

### 🧪 A) Cerrar experimento pack 2ª unidad 50% (PLANEADO 2026-10-07 — listo para Craft)
**Resultados (as_of 2026-10-07, 14.8 días, `experiment-results`)**:
- Control: 826 visitantes · 22 compras · CVR 2.66% · AOV $799 · margen/visitante $11.27
- Test (selector pack): 791 · 17 compras · CVR 2.15% · AOV $869.5 · margen/visitante $9.76 (**−13.4%**)
- Prob. control mejor 67% (no concluyente estadísticamente, decisión backend "keep_collecting", <30 compradores/variante). Solo ~3 de 17 compradores test llevaron 2 unidades.
- **Decisión del cliente: terminarlo. Gana control (PDP actual sin selector).**

**Pasos Craft**:
1. `src/experiments/rodata-one-pack-presentation.json` → `"status": "completed"` (NO borrar el archivo).
2. `src/pages/ui/ProductPageUI.tsx`: quitar `OFFER_EXP_KEY`, `OFFER_PRODUCT_ID`, `OfferExpState`, `OFFER_EXP_IDLE`, `OfferExperimentGate`, el state `offerExp` (~L199-L277) y el render de `<PackOfferSelector>` (~L438-440) + import de `useExperiment`/`PackOfferSelector`. Dejar exactamente lo que veía `control`.
3. `src/pages/ui/GiftPDPUI.tsx`: **mismo cleanup** (L5-L30, ~L227-L305, ~L481-483). OJO: hoy la PDP regalo TAMBIÉN asigna/expone el flag del pack → contaminaba el experimento. Quitar.
4. `HeadlessProduct.tsx` (L55, ~L307-330, L610): la lógica `packOffer`/`packUiActive` puede quedarse inerte si nadie activa `packUiActive`; si es simple, eliminarla. No romper `selectedPurchaseItems`/`purchaseQuote`.
5. `PackOfferSelector.tsx`: puede quedarse sin uso (o borrarse si no hay más imports).
6. **Regla BOGO `7653e73d-ce1b-446f-a37d-3eb5cffb9602`** (2ª unidad 50%, compartida): PREGUNTAR al cliente antes de tocarla. Si queda activa, quien meta 2 unidades sigue recibiendo el 50% (y en la PDP regalo se acumularía con el regalo). Recomendación: desactivarla durante el test del regalo para medir limpio. Es cambio comercial global → solo con OK explícito.
7. `.lovivo/cro-log.md`: mover a `## Ruled Out` con los números de arriba.

### 🎁 B) Test "PDP normal vs PDP regalo" (PLANEADO 2026-10-07 — esperando respuestas del cliente)
**Lo que quiere el cliente**: 50% del tráfico de anuncios a `/productos/soporte-lumbar-rodata-one` y 50% a `/productos/soporte-lumbar-rodata-one-regalo`.

**Por qué NO como experimento Lovivo (redirect dentro de la tienda)**:
- El sistema A/B de Lovivo V1 solo soporta presentación de una oferta COMPARTIDA o precio. Aquí el grupo test recibe un producto extra ($0) que el control no recibe = condición exclusiva por grupo → **no soportado** por la skill `workflow.ab-experiments` (no crear manifest para esto).
- Además, un redirect por flag espera a PostHog (hasta 3 s de timeout) → en 94% mobile + Meta Ads, castigaría la variante regalo con pantalla en blanco / doble carga y ensucia la atribución del pixel.

**Método recomendado: A/B test en Meta Ads (Dashboard AI)**:
- Duplicar el ad set ganador → mismo creativo, presupuesto, audiencia; solo cambia la URL destino. Ideal usar "Prueba A/B" nativa de Meta para que no se solapen audiencias.
- URLs con UTM:
  - Control: `https://rodata.store/productos/soporte-lumbar-rodata-one?utm_source=meta&utm_campaign=test-regalo&utm_content=control`
  - Regalo: `https://rodata.store/productos/soporte-lumbar-rodata-one-regalo?utm_source=meta&utm_campaign=test-regalo&utm_content=regalo`
- Métrica de decisión: **margen por visita / costo por compra**, no solo CVR. Comparar en Dashboard (pedidos con línea regalo = variante regalo) + Meta (CPA).
- Duración sugerida: 2–3 semanas o ~30+ compras por lado. Con ~130 ventas/mes total, decir claro que el resultado puede quedar ruidoso.

**Break-even (decirlo al cliente)**: margen por pedido control ≈ $423 (backend: costo 209 + envío 135 + fees). Si el regalo cuesta X, la PDP regalo necesita subir la conversión ≥ X / (423 − X). Ej: X=$60 → +17%; X=$100 → +31%; X=$150 → +55%. **Pedir costo unitario real del par de muñequeras** (+ si sube costo de envío por peso).

**Pasos Craft (preparación en tienda)**:
1. **Fecha del regalo**: `GIFT_OFFER_ENDS_AT` en `src/lib/gift-offer.ts` vence **2026-10-09 23:59 CDMX** (en 2 días) → después la URL regalo redirige a la PDP normal y el test se rompe. Cambiar a la nueva fecha REAL que elija el cliente (sugerido: fin del test, p.ej. `2026-10-31T23:59:59-06:00`). Debe ser fecha fija igual para todos.
2. Cargar `cost` del producto regalo `f29e9557-...` (update-product) con el costo real que dé el cliente → el margen en Dashboard/Lovivo sale correcto.
3. Verificar que la PDP regalo dispara `viewcontent`/`addtocart`/`initiatecheckout`/`purchase` igual que la normal (Pixel + CAPI con event_id único) para que Meta optimice/compare bien.
4. Verificar UTM se conserva hasta el pedido (si el pedido guarda utm/landing). Si no, la línea regalo en el pedido sirve como identificador de variante.
5. Ya está `noindex` + canonical a PDP principal (no tocar).
6. QA compra real en celular desde la URL regalo (pendiente desde 2026-09-29) ANTES de mandar tráfico.
7. `cro-log.md`: registrar hipótesis bajo `## Active Experiments` como "test en Meta Ads (fuera de Lovivo A/B)".

**Preguntas abiertas al cliente (2026-10-07)**: (1) costo unitario del par de muñequeras regalo; (2) nueva fecha fin real de la promo; (3) ¿desactivar regla BOGO 2ª unidad 50%?

### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK del cliente para Craft)
**Problema**: etiquetas Stripe AddressElement confusas ("Nombre de pila", "Primera/Segunda línea de la dirección"); Stripe NO permite cambiar labels. **No existe campo Colonia**.
**Solución**: reemplazar AddressElement (solo modo envío) por `src/components/MxAddressForm.tsx`:
1. Nombre(s) | Apellidos · 2. Calle y número exterior (req, `line1`) · 3. Número interior / depto (opcional) · 4. Colonia (req)
5. Código postal (5 dígitos) | Ciudad o alcaldía · 6. Estado (select 32, mismo formato que hoy recibe `logic.address.state`) · 7. Teléfono (WhatsApp) con `CountryPhoneSelect.tsx`
- `line2` = `[Int. X, ]Col. Y`. País fijo MX. `autoComplete` attrs. Mantener contrato `onAddressChange(addressValue, complete)` en CheckoutUI.tsx (L385-434).
- Revisar en `StripePayment.tsx` todo lo que dependa del AddressElement (getValue, shipping en confirmPayment / payments-create-intent).
- Rollback: constante `USE_CUSTOM_ADDRESS_FORM = true`. Inputs ≥48px, font ≥16px.
- **Fix**: `clients-upsert 400 "email requerido"` → solo llamar `saveClientData(true)` con email válido.
- **QA**: tarjeta con Int. vacío/lleno; colonia en line2 en pedido y Stripe; validación CP; Apple/Google Pay; PDP regalo; pickup.

### 🎁 PDP Regalo v2 — CONSTRUIDA 2026-09-29 (QA real pendiente)
URL `/productos/soporte-lumbar-rodata-one-regalo`. Archivos: `src/lib/gift-offer.ts` (`GIFT_OFFER_ENDS_AT`, `isGiftOfferActive()`, `isGiftEligible()` flag localStorage 7 días), `GiftCountdown.tsx`, `GiftDetailsDrawer.tsx`, `GiftLanding.tsx` (al vencer → Navigate a PDP normal), `GiftPDPUI.tsx`, `GiftCartSync.tsx` (montado en App).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.

## Recent Changes
- **📋 Plan cerrar exp pack + test regalo vía Meta A/B (2026-10-07)** — pendiente respuestas + Craft.
- **📋 Plan formulario de dirección estilo México + Colonia (2026-09-29)** — pendiente Craft.
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
- **✅ ETA centralizado** (2026-09-03).
- **✅ Recuperación de pagos rechazados** (2026-09-03).

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (IA 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio, thumb tarjeta), `q4h7kvtg3nn` (manubrio), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes" — drawer), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **🚨 Regalo vence 2026-10-09 23:59 CDMX** (2026-10-07): si no se cambia la fecha, la URL regalo redirige a PDP normal y cualquier test/anuncio a esa URL se rompe.
- **PDP regalo asigna el flag del exp pack** (2026-10-07): contaminación; se limpia al cerrar el exp.
- **Producto regalo sin `cost`** (2026-10-07): margen sobrestimado hasta cargarlo.
- **Checkout (2026-09-29)**: etiquetas de Stripe confusas + sin campo Colonia. `clients-upsert` 400 "email requerido".
- **Regalo (2026-09-29)**: sin QA de compra real con línea $0.
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[CRÍTICA]** Antes del 9 oct: nueva fecha real del regalo (`GIFT_OFFER_ENDS_AT`).
- **[ALTA]** Cerrar exp pack (plan A) + decisión regla BOGO.
- **[ALTA]** Test regalo en Meta Ads (plan B): costo muñequeras → cargar cost; QA compra real; luego Dashboard AI arma A/B de Meta.
- **[ALTA]** Construir formulario de dirección MX + QA de compra real.
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo.
- **[MEDIA]** Medir clics en tarjeta/drawer del regalo (evento PostHog).
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.