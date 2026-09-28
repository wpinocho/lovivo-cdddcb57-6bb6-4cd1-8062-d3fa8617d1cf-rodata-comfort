# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones.
- Costo unitario en catálogo: `cost: 209` → margen bruto ≈ $590 a $799.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, medido 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads.
- **Ventas (30d)**: ~130 purchases ≈ 30/semana. CVR PDP ≈ 2.2%.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · se puede probar normalmente · no se acepta roto/alterado/muy manchado/mal uso ·
  devolución normal = cliente paga regreso · defectuoso/equivocado = RODATA cubre · 1er cambio de talla en 30 días SIN COSTO ·
  reembolso al método original, máx 10 días hábiles tras recibir/revisar · envío estándar gratis en MX donde haya cobertura · preparación 24–48 h hábiles.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- **Wordmark (2026-09-28)**: `BrandLogoLeft` = "RODA" offwhite + "TA" amber, Sora extrabold uppercase.
- **Identidad pública — fuente única `src/lib/brand.ts`** (BRAND_NAME, SITE_URL, WHATSAPP_*, whatsappUrl, POLICY_LINKS).
  NO usar `storeName` de settings en textos legales/públicos.
- Páginas legales/informativas: `src/components/PolicyLayout.tsx` (`PolicyLayout`, `PolicySection`, `PolicyLink`, `usePolicyPageMeta` → title + canonical rodata.store).
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca string crudo de Stripe/PayPal.
- **ETA de entrega (2026-09-03)**: días naturales 4 a 7. Fuente única: `src/lib/delivery-estimate.ts`.
- **Precios en UI (2026-09-04)**: NUNCA hardcodear precios ni % en JSX/meta.
- **Pricing de reglas (2026-09-22)**: fuente única `src/lib/cart-pricing.ts`. Redondeo POR LÍNEA a centavos.
- **Selección PDP (2026-09-22)**: fuente única `src/lib/pdp-purchase.ts`.
- **Links de políticas**: footer columna "Navegación" (vía POLICY_LINKS) + pie de checkout (`CheckoutPolicyLinks`).
- **CUIDADO con `text-foreground`/`text-muted-foreground`**: en cart/checkout usar SIEMPRE tokens `brand-*`.
- **Tracking event_id (2026-09-26)**: event_id ÚNICO POR OCURRENCIA en `trackHybrid`/`trackSearch`; stableId SOLO con order_id.

---

## Active Plan — Fix "Información engañosa" Google Merchant Center (2026-09-28)
- Hecho en código: identidad RODATA, metadata rodata.store, footer de confianza, políticas consistentes, `/sobre-rodata`, `/politica-de-envios`, links en checkout.
- Siguiente (cliente): cambiar nombre de tienda en Dashboard a "RODATA" si aún dice rodata.mx; en Merchant Center dominio = rodata.store,
  políticas de devolución (30 días, link `/politica-de-devoluciones`) y envío (gratis) iguales a la web; solicitar revisión.

### Experimento `exp-cdddcb57-pdp-second-belt-offer` (sigue activo)
- Manifiesto `active`, BOGO `7653e73d-...` activa. Falta QA de 3 unidades.

---

## Recent Changes
- **🛡️ Merchant Center trust fix (2026-09-28)** — `index.html` (title/author/canonical/OG/Twitter → RODATA + rodata.store; quitado lovable),
  `BrandLogoLeft` wordmark, `EcommerceTemplate` footer (tagline, WhatsApp visible, POLICY_LINKS, © año RODATA), `ReturnPolicy` reescrita,
  `TermsAndConditions` (quitado "sin usar y con empaque completo"), `PrivacyPolicy` (contacto WhatsApp), nuevas `AboutRodata`/`ShippingPolicy` + rutas,
  `CheckoutPolicyLinks` en `CheckoutUI` (solo presentación), badge "rodata.mx"→"RODATA" en ProductPageUI/DeliveryPDPUI, título OrderTrack.
- **🎯 Fix event_id Meta Pixel + CAPI (2026-09-26)** — sin ejecutar tests.
- **🎨 Fix contraste `CartAppliedRules.tsx` (2026-09-22)**.
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22)**.
- **✅ Página `/politica-de-devoluciones` creada** (2026-09-22).
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.
- **⚪ Test de precio $799 vs $849 CERRADO como inconcluso** (2026-09-22).
- **✅ ETA centralizado** (2026-09-03).
- **✅ Recuperación de pagos rechazados** (2026-09-03).
- **✅ Google Ads (gtag.js)** (2026-09-01).
- **✅ Instrumentación de checkout en PostHog** (2026-08-25).
- **✅ Fotografía real en `/repartidores`** (2026-08-20).
- **✅ Fix PayPal → `/gracias`** (2026-08-18).
- **`/repartidores` refactorizada a PDP clonada** (2026-08-06).

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
### Catálogo: `nae4riov9h.webp`, `j8kw94s83hn.webp`, `pjleekrch4l.webp`, `b5mg4lv2qbf.webp`, `0evbcgfgplnh.webp`
### PDP carretera
- LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · PRODUCT_FLAT `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp` · avatares `SB_PROD/avatar-{carlos,jorge,andres}-v3.webp`
### Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp` (también og:image/twitter:image); LIFESTYLE `SB_MSG/1775771349198-{676o65sijn4,tl8qt6nmo8,z730si7cdto}.webp`; PROBLEMA `SB_MSG/1775770729257-1nufsuab1jt.webp`
### Repartidor (real): galería `SB_MSG/1787249204164-{ifubpmh955s,h4pa1xnbjw,5rlwxy193t3,r9dtbwqmwaa,7ws595nt61i}`; resto prefijo `1787251752010-`. DEPRECADAS: `SB_PROD/dlv-*.webp`.
### Creativos ads: `SB_MSG/1786041572607-{zlqbmm6nxp,2687rjqwf6x,iufym7bnuz9}.webp`

## Known Issues
- **Copy "garantía 30 días" (2026-09-28)**: `StripePayment.tsx` ("Garantía 30 Días") y `DeliveryLandingUI.tsx` ("30 días de garantía") — puede
  leerse distinto a la política (es devolución, no garantía). NO se tocó (Stripe prohibido). Recomendado cambiar a "30 días para devolver".
- **Comentarios de código con "rodata.mx"** (no públicos): index.css, tailwind.config.ts, stripe-appearance.ts, ProductPageUI/DeliveryLandingUI línea 1.
- **Canonical estático** en `index.html` = home para rutas que no lo sobrescriben (PDP carretera no setea canonical propio).
- **Tests vitest nunca ejecutados**: `vitest` no está en devDependencies.
- **Código `DEDE`**: 98%, `active: true`, sin mínimo. NO modificado (requiere autorización).
- **Loader de carrito por URL roto**: `useURLCartLoader.ts` join PGRST200.
- **Wallet: cupón en cotización** depende de `verify-discount` · **re-cotización crea orden pendiente extra**.
- **Stacking volume+bogo**: si se crea volume rule, el pack se oculta (fail-safe).
- **Google Ads sin validar** · **PayPal MX sin prueba real** · **Meta Purchase duplicados (2026-08-06)**.

## Key Files
- `src/lib/brand.ts`, `src/components/PolicyLayout.tsx`, `src/components/CheckoutPolicyLinks.tsx`
- `src/pages/{ReturnPolicy,ShippingPolicy,AboutRodata,TermsAndConditions,PrivacyPolicy}.tsx`
- `src/lib/tracking-utils.ts`, `src/lib/facebook-pixel.ts`, `src/lib/__tests__/*`
- `src/lib/pdp-purchase.ts`, `src/lib/cart-pricing.ts`, `src/components/PackOfferSelector.tsx`
- `src/experiments/rodata-one-pack-presentation.json` — **active**

## PENDING / Future Sessions
- **[ALTA]** Cliente: Dashboard → nombre de tienda "RODATA"; Merchant Center → dominio rodata.store + políticas iguales + pedir revisión.
- **[MEDIA]** Cambiar "Garantía 30 Días" (StripePayment) y "30 días de garantía" (DeliveryLandingUI) a lenguaje de devolución — requiere permiso.
- **[MEDIA]** Canonical propio en PDP carretera (`https://rodata.store/productos/soporte-lumbar-rodata-one`).
- **[ALTA]** Correr `npx vitest run src/lib/__tests__` + `npm run build`.
- **[ALTA]** Validar dedupe VC/ATC en Meta Events Manager.
- **[MEDIA]** QA 3 unidades · **[CRÍTICA]** decisión `DEDE` · **[ALTA]** `useURLCartLoader`.