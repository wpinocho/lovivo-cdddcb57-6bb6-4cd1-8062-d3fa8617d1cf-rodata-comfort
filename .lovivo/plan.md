# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: título **"Regalo: Soporte de muñeca RODATA (par)"** (renombrado 2026-09-29) id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  **price 0**, compare_at 449. Tags `regalo,no-listar`. Nombre visible en PDP: "Soporte de muñeca para moto" (constante `GIFT_NAME`).
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
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`. NO tocar PDP original.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- Copy devolución: "30 días para devolver", NO "garantía". Sin claims médicos. Un solo ancla de precio.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos (nunca por visitante).
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina la vibración / quita hormigueo / túnel carpiano".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.

## Active Plan
### 🎁 PDP Regalo v2 — CONSTRUIDA 2026-09-29 (QA real pendiente)
URL `/productos/soporte-lumbar-rodata-one-regalo`. Archivos:
- `src/lib/gift-offer.ts`: `GIFT_NAME`, `GIFT_NAME_SHORT`, **`GIFT_OFFER_ENDS_AT = '2026-10-09T23:59:59-06:00'`** (cliente pidió contador de 10 días; luego lo cambiará), `isGiftOfferActive()`, `formatGiftEndDate()`. `isGiftEligible()` exige promo activa → GiftCartSync deja de agregar regalo al vencer.
- `src/components/GiftCountdown.tsx` (hook + inline/boxes), `src/components/GiftDetailsDrawer.tsx` (bottom sheet vaul).
- `GiftLanding.tsx`: al vencer → `<Navigate replace>` a PDP normal.
- `GiftPDPUI.tsx`: tarjeta regalo = botón con contador + "Ver qué incluye ›"; badge "+ REGALO: soporte de muñeca para moto (valor $449)"; pill "Oferta de Lanzamiento" eliminada; etiqueta kit en galería tocable; sección regalo con intro vibración + botón detalles; FAQ nueva vibración; CTA final con línea regalo + fecha; sticky móvil.
- **Para extender/cambiar la fecha**: editar solo `GIFT_OFFER_ENDS_AT` (o `null` = sin fecha, copy cae a "mientras dure el inventario").

### PDP Regalo — QA real pendiente
- Compra real (Stripe, PayPal, Apple/Google Pay) confirmando línea $0 con nuevo título.
- Si quitan el lumbar dentro de /pagar el regalo queda solo ($0).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.
### Experimento `exp-cdddcb57-pdp-second-belt-offer` (activo) — BOGO `7653e73d` limitada a Rodata One.

## Recent Changes
- **🎁 PDP Regalo v2 construida (2026-09-29)** — nombre "Soporte de muñeca para moto", contador a fecha fija 9 oct, drawer detalles, vibración, auto-apagado, producto regalo renombrado.
- **📋 Plan PDP Regalo v2 (2026-09-29)**.
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

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (IA 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio, thumb tarjeta), `q4h7kvtg3nn` (manubrio), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes" — usada en drawer), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Regalo (2026-09-29)**: sin QA de compra real con línea $0.
- **Regalo vence 2026-10-09 23:59 CDMX**: después la URL redirige a PDP normal. Si los anuncios siguen apuntando ahí, verán la PDP normal (sin regalo). Avisar al cliente antes.
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[ALTA]** QA compra real en celular en PDP regalo → confirmar "Regalo: Soporte de muñeca RODATA (par)" $0 en pedido.
- **[ALTA]** ~2026-10-07: preguntar al cliente si extiende/cambia la fecha del regalo (`GIFT_OFFER_ENDS_AT`).
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo.
- **[MEDIA]** Medir clics en tarjeta/drawer del regalo (evento PostHog).
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.