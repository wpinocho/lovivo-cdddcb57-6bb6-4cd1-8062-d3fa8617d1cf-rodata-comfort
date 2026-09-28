# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba (2026-09-28): Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599** (inventado por el agente, falta confirmar con cliente), talla única, sin variantes, sin cost cargado,
  tags `muñequeras,test`. Referencia de producto: motocush.com/products/motowrap. NO está en home ni menú (URL suelta).
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads. **Ventas**: ~130/30d, CVR PDP ≈ 2.2%.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · se puede probar · no roto/alterado/muy manchado/mal uso ·
  devolución normal = cliente paga regreso · defectuoso/equivocado = RODATA cubre · 1er cambio de talla SIN COSTO ·
  reembolso máx 10 días hábiles · envío estándar gratis en MX donde haya cobertura · preparación 24–48 h hábiles.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Wordmark: `BrandLogoLeft` = "RODA" offwhite + "TA" amber.
- **Identidad pública — fuente única `src/lib/brand.ts`** (BRAND_NAME, SITE_URL, WHATSAPP_*, whatsappUrl, POLICY_LINKS).
- Páginas legales: `src/components/PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Convención de landings/PDP dedicadas**: forkear estructura de `DeliveryPDPUI`/`ProductPageUI` (misma galería, sticky bar con IntersectionObserver, express checkout, acordeones) + ruta estática antes de `/productos/:slug`.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago**: nunca culpar al cliente. **ETA**: `src/lib/delivery-estimate.ts`. **Precios**: NUNCA hardcodear en JSX/meta.
- Pricing de reglas: `src/lib/cart-pricing.ts`. Selección PDP: `src/lib/pdp-purchase.ts`.
- **Copy de devolución**: decir "30 días para devolver", NO "garantía" (Merchant Center). Sin claims médicos.
- En cart/checkout usar SIEMPRE tokens `brand-*`.
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.

---

## Active Plan
### PDP Muñequeras (2026-09-28) — creada, pendiente validación cliente
- Archivos: `src/pages/ui/WristWrapPDPUI.tsx`, `src/pages/WristWrapLanding.tsx`, ruta `/productos/munequeras-rodata` en `App.tsx`.
- Secciones: galería 4 fotos · buy box (talla única + cantidad + express + CTA) · banda "qué incluye" · problema (3 cards) · 3 features con fotos ·
  opinión real (foto cliente, texto redactado por agente → **cliente debe validar**, nombre "Ricardo G., Guadalajara" provisional) · pasos + sin riesgo · FAQ · CTA final · sticky bar.
- SEO: title, meta description, canonical propio, Product JSON-LD con precio de BD.
- Falta del cliente: precio final, confirmar cierre (velcro?) y material, validar texto/nombre de reseña, más reseñas/fotos reales, foto lifestyle sin texto quemado.

### Merchant Center (2026-09-28)
- Cliente: Dashboard nombre "RODATA"; Merchant Center dominio rodata.store + políticas iguales + pedir revisión.

### Experimento `exp-cdddcb57-pdp-second-belt-offer` (activo) — BOGO `7653e73d` limitada a Rodata One (no afecta muñequeras). Falta QA 3 unidades.

---

## Recent Changes
- **🧤 PDP Muñequeras RODATA (2026-09-28)** — producto creado en BD + `WristWrapPDPUI` + `WristWrapLanding` + ruta estática.
- **🛡️ Merchant Center trust fix (2026-09-28)** — index.html, BrandLogoLeft, footer, políticas, `/sobre-rodata`, `/politica-de-envios`, CheckoutPolicyLinks.
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
- **`/repartidores` refactorizada a PDP clonada** (2026-08-06).

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
### Catálogo lumbar: `nae4riov9h.webp`, `j8kw94s83hn.webp`, `pjleekrch4l.webp`, `b5mg4lv2qbf.webp`, `0evbcgfgplnh.webp`
### Muñequeras (reales, 2026-09-28) — `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio), `q4h7kvtg3nn` (manubrio, texto quemado),
  `0yjgi3apchym` (callouts, texto quemado), `nwhrcsc3un` ("Esto recibes: 2"), `2wwj6uvz7a5` (foto de reseña, vertical 3:4)
### PDP carretera
- LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · PRODUCT_FLAT `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp` · avatares `SB_PROD/avatar-{carlos,jorge,andres}-v3.webp`
### Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`; LIFESTYLE `SB_MSG/1775771349198-{676o65sijn4,tl8qt6nmo8,z730si7cdto}.webp`; PROBLEMA `SB_MSG/1775770729257-1nufsuab1jt.webp`
### Repartidor (real): galería `SB_MSG/1787249204164-{ifubpmh955s,h4pa1xnbjw,5rlwxy193t3,r9dtbwqmwaa,7ws595nt61i}`; resto prefijo `1787251752010-`. DEPRECADAS: `SB_PROD/dlv-*.webp`.
### Creativos ads: `SB_MSG/1786041572607-{zlqbmm6nxp,2687rjqwf6x,iufym7bnuz9}.webp`

## Known Issues
- **Muñequeras (2026-09-28)**: precio provisional; reseña redactada sin validar; producto `active` → podría aparecer en listados globales si existieran (home no lista productos).
- **Copy "garantía 30 días"**: `StripePayment.tsx` y `DeliveryLandingUI.tsx` — recomendado "30 días para devolver". Requiere permiso.
- **Comentarios de código con "rodata.mx"** (no públicos).
- **Canonical estático** en `index.html` para rutas sin canonical propio (PDP carretera).
- **Tests vitest nunca ejecutados**. **Código `DEDE`** 98% activo. **`useURLCartLoader`** roto (PGRST200).
- Wallet: cupón en cotización / re-cotización crea orden pendiente extra. Stacking volume+bogo. Google Ads/PayPal MX sin validar.

## Key Files
- `src/lib/brand.ts`, `src/components/PolicyLayout.tsx`, `src/components/CheckoutPolicyLinks.tsx`
- `src/pages/ui/WristWrapPDPUI.tsx`, `src/pages/WristWrapLanding.tsx`
- `src/lib/pdp-purchase.ts`, `src/lib/cart-pricing.ts`, `src/components/PackOfferSelector.tsx`
- `src/experiments/rodata-one-pack-presentation.json` — **active**

## PENDING / Future Sessions
- **[ALTA]** Muñequeras: precio final del cliente → `ecommerce--update-product`; validar reseña; cargar `cost`; QA compra real en celular.
- **[ALTA]** Cliente: Merchant Center dominio rodata.store + políticas + revisión.
- **[MEDIA]** Muñequeras: más reseñas reales, foto lifestyle limpia (sin texto) para break visual; considerar oferta 2 pares.
- **[MEDIA]** "Garantía 30 Días" → lenguaje de devolución (permiso). Canonical PDP carretera.
- **[ALTA]** Correr vitest + build. Validar dedupe Meta. **[CRÍTICA]** decisión `DEDE`.