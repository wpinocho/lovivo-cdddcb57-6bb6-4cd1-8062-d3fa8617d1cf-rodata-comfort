# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones.
- Costo unitario en catálogo: `cost: 209` → margen bruto ≈ $590 a $799.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, medido 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads.
- **Ventas (30d)**: ~130 purchases ≈ 30/semana. CVR PDP ≈ 2.2%.
- **Política de devoluciones (2026-09-22)**: 30 días naturales, cambios de talla, cliente genera guía. WhatsApp +52 55 3121 5386.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca string crudo de Stripe/PayPal.
- **ETA de entrega (2026-09-03)**: días naturales 4 a 7. Fuente única: `src/lib/delivery-estimate.ts`.
- **Precios en UI (2026-09-04)**: NUNCA hardcodear precios ni % en JSX/meta.
- **Pricing de reglas (2026-09-22)**: fuente única `src/lib/cart-pricing.ts`. Redondeo POR LÍNEA a centavos.
  Carrito = líneas a precio base (+volumen por línea) + UN renglón global BOGO (`bogoLabel`) = total.
- **Selección PDP (2026-09-22)**: fuente única `src/lib/pdp-purchase.ts` (`resolvePdpPurchase`, pura).
- **Link de política de devoluciones**: SOLO en el footer, columna "Navegación".
- **CUIDADO con `text-foreground`/`text-muted-foreground` (2026-09-22)**: en cart/checkout usar SIEMPRE tokens `brand-*`.
- **Tracking event_id (2026-09-26)** — regla: event_id ÚNICO POR OCURRENCIA, generado UNA vez en `trackHybrid`
  (o en `trackSearch`) y compartido por Pixel + CAPI + PostHog. `stableId` SOLO con clave idempotente real
  (`order_id` en Purchase / InitiateCheckout). NUNCA product_id ni search query. NO filtrar eventos Meta por fuente de tráfico.

---

## Active Plan — Fix de dedupe Meta Pixel + CAPI (2026-09-26)
- Hecho: ViewContent/AddToCart → UUID por llamada; InitiateCheckout → `order_id` o UUID (sin fallback a product id);
  Search → UUID por llamada; Purchase y CustomEvent sin cambios.
- Test nuevo `src/lib/__tests__/tracking-event-id.test.ts` (casos A–H). **NO ejecutado** (el agente no tiene terminal;
  `vitest` además NO está en devDependencies). Cliente debe correr `npx vitest run src/lib/__tests__` y `npx tsc --noEmit`/`npm run build`.
- Observación: `CheckoutAdapter` llama `trackInitiateCheckout` SIN `order_id` (guardado por `hasTrackedCheckout` ref)
  → cada montaje de `/pagar` = nuevo IC con UUID. Correcto para dedupe; no se cambió.

### Experimento `exp-cdddcb57-pdp-second-belt-offer` (sigue activo)
- Manifiesto `active`, BOGO `7653e73d-...` activa. Cliente validó 2 unidades (S+L = $1,199). Falta caso 3 unidades.

---

## Recent Changes
- **🎯 Fix event_id Meta Pixel + CAPI (2026-09-26)** — `tracking-utils.ts`: quitados stableIds falsos (product_id en
  VC/ATC/IC-fallback, search_string en Search). Nuevo test `tracking-event-id.test.ts`. Sin ejecutar.
- **🎨 Fix contraste `CartAppliedRules.tsx` (2026-09-22, sesión 4)** — tokens `brand-*` en línea de descuento.
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22, sesión 3)**.
- **🔧 Experimento de pack corregido (2026-09-22, sesión 2)**.
- **✅ Página `/politica-de-devoluciones` creada** (2026-09-22).
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.
- **⚪ Test de precio $799 vs $849 CERRADO como inconcluso** (2026-09-22).
- **🚀 Test de precio $799 vs $849 lanzado** (2026-09-04).
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
### Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`; LIFESTYLE `SB_MSG/1775771349198-{676o65sijn4,tl8qt6nmo8,z730si7cdto}.webp`; PROBLEMA `SB_MSG/1775770729257-1nufsuab1jt.webp`
### Repartidor (real): galería `SB_MSG/1787249204164-{ifubpmh955s,h4pa1xnbjw,5rlwxy193t3,r9dtbwqmwaa,7ws595nt61i}`; resto prefijo `1787251752010-`. DEPRECADAS: `SB_PROD/dlv-*.webp`.
### Creativos ads: `SB_MSG/1786041572607-{zlqbmm6nxp,2687rjqwf6x,iufym7bnuz9}.webp`

## Known Issues
- **Tests vitest nunca ejecutados (2026-09-26)**: `vitest` no está en devDependencies; `pack-pricing.test.ts` y
  `tracking-event-id.test.ts` requieren `npm i -D vitest` + `npx vitest run src/lib/__tests__`. El agente no tiene terminal.
- **Código `DEDE` (verificado 2026-09-22)**: 98%, `active: true`, sin mínimo. NO modificado (requiere autorización).
- **Loader de carrito por URL roto (2026-09-22)**: `useURLCartLoader.ts` join PGRST200 → `?items=`/`?variant=` no cargan.
- **QA de 3 unidades sin confirmar**.
- **Wallet: cupón en cotización** depende de `verify-discount` · **re-cotización crea orden pendiente extra**.
- **Fallback `order.total_amount`** en express = `unit×qty` si backend no lo devuelve.
- **Canonical en `index.html` apunta a `https://rodata.mx`** pero producción es `rodata.store`.
- **Stacking volume+bogo**: si se crea volume rule, el pack se oculta (fail-safe).
- **CTA de control muestra precio unitario** aunque cantidad > 1.
- **`?exp=` preview del runtime**: no usar en links compartidos.
- **Google Ads sin validar (2026-09-01)** · **PayPal MX sin prueba real (2026-08-18)** · **Meta Purchase duplicados (2026-08-06)**
  (Purchase no se tocó en el fix de 2026-09-26; sigue usando `purchase_<order_id>`).

## Key Files
- `src/lib/tracking-utils.ts` (event_id lifecycle), `src/lib/facebook-pixel.ts`, `src/lib/__tests__/tracking-event-id.test.ts`
- `src/lib/pdp-purchase.ts`, `src/lib/cart-pricing.ts`, `src/lib/__tests__/pack-pricing.test.ts`
- `src/components/PackOfferSelector.tsx`, `src/components/ui/CartAppliedRules.tsx`
- `src/experiments/rodata-one-pack-presentation.json` — **active**
- Runtime protegido: `src/experiments/index.ts`, `src/hooks/useExperiment.ts`, `src/hooks/usePriceExperiment.ts`, `src/lib/experiments.ts`
- `src/components/headless/HeadlessProduct.tsx`, `src/components/ProductExpressCheckout.tsx`, `src/adapters/CheckoutAdapter.tsx`

## PENDING / Future Sessions
- **[ALTA]** Cliente: correr `npx vitest run src/lib/__tests__` + `npm run build` y confirmar verde.
- **[ALTA]** Validar en Meta Events Manager (Test Events) que VC/ATC llegan con "Deduplicado" Browser+Server.
- **[CRÍTICA]** `experiment-list` → confirmar `started_at` + `synced` del experimento de pack.
- **[MEDIA]** Confirmar caso de 3 unidades ($1,997.50).
- **[CRÍTICA]** Decisión del cliente sobre `DEDE`.
- **[ALTA]** Arreglar `useURLCartLoader` (con permiso).
- **[ALTA]** Merchant Center devoluciones + decidir canonical.
- **[MEDIA]** `estimated_delivery_at` · enhanced conversions · hidratar `/gracias/:id`.