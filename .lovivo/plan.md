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
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.

## Active Plan
### PDP Regalo (2026-09-28) — creada, falta QA real
- URL: **`/productos/soporte-lumbar-rodata-one-regalo`** (noindex, canonical → PDP lumbar). Sin experimento de pack (isOfferTarget=false).
- Archivos: `src/lib/gift-offer.ts` (IDs, flag elegibilidad 7 días, buildGiftCartItem), `src/hooks/useGiftProduct.ts`,
  `src/components/GiftCartSync.tsx` (montado en App: agrega 1 regalo si hay Rodata One + visitante elegible; lo quita si no hay Rodata One; qty fija 1),
  `src/pages/GiftLanding.tsx` (buy now con regalo, express checkout con regalo en purchaseItems), `src/pages/ui/GiftPDPUI.tsx` (fork).
- Carrito/checkout: `CartSidebar`, `CartUI`, `CheckoutUI` muestran regalo como "Regalo · GRATIS" (sin qty ni borrar).
- Galería: img1 ganadora + img2 kit (`SB_PROD/kit-rodata-one-munequeras.webp`) con etiqueta "Incluido gratis".
- **QA pendiente**: compra real (Stripe, PayPal, Apple/Google Pay) confirmando línea $0 en backend y en pedido; checar que backend acepte item price 0.
- Riesgo conocido: flag de elegibilidad dura 7 días → si compra después desde PDP normal, también recibe regalo. Checkout: si quitan el lumbar dentro de /pagar el regalo queda solo ($0).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.
### Experimento `exp-cdddcb57-pdp-second-belt-offer` (activo) — BOGO `7653e73d` limitada a Rodata One.

## Recent Changes
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
- **✅ Fix PayPal → `/gracias`** (2026-08-18).

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (generado 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp` (faja + par de muñequeras, fondo oscuro)
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio), `q4h7kvtg3nn` (texto quemado), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes"), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Regalo (2026-09-28)**: sin QA de compra real; no verificado que checkout-create acepte línea price 0 (si falla, alternativa: precio simbólico o regla de descuento).
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[ALTA]** QA compra real en celular en PDP regalo (comprar ahora, carrito, Apple/Google Pay, PayPal) → confirmar regalo $0 en pedido.
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo (valor mostrado).
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.