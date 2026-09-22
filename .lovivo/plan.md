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

---

## Active Plan — 🚀 Experimento de oferta ACTIVADO (2026-09-22)

### `exp-cdddcb57-pdp-second-belt-offer`
- Manifiesto `src/experiments/rodata-one-pack-presentation.json` → `status: "active"` (commit 2026-09-22).
  Sync post-commit: **confirmar con experiment-list que `started_at` ≠ null y `sync_status: synced`.**
- BOGO `7653e73d-...` **`active: true`** desde 2026-09-22 20:23 UTC (autorizado por el cliente). Condiciones sin cambios.
- `experiment-results` ✅ responde (analysis_version 2, margin_per_visitor). Decisión: min 14 días, 30 compradores/variante, 95%.
- Verificado por el agente: PDP carga sin errores de consola con BOGO activa.
- **NO verificado por el agente**: totales multi-unidad en carrito y `/pagar` (M+L, M+M, 3, 4). Motivo: loader de carrito
  por URL roto + browser-test solo da 1 clic. QA manual pedido al cliente. Si /pagar ≠ PDP/carrito → pausar
  (manifiesto `paused` + BOGO `active: false`).
- vitest `src/lib/__tests__/pack-pricing.test.ts` sigue SIN ejecutar.
- No editar la BOGO mientras corre el test.

---

## Recent Changes
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22, sesión 3)** — manifiesto `active`, BOGO `active: true`,
  entrada en cro-log. Catálogo y experimento de precio intactos. DEDE sin tocar.
- **🔧 Experimento de pack corregido (2026-09-22, sesión 2)** — `pdp-purchase.ts`, tests vitest, `cart-pricing.ts`,
  `HeadlessProduct.tsx`, `ProductExpressCheckout.tsx`, `ProductPageUI.tsx`, carrito.
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
- **Código `DEDE` (verificado 2026-09-22 sesión 3)**: id `8520904d-...`, percentage 98%, `active: true`, sin mínimo.
  NO modificado (requiere autorización). Riesgo real: cualquiera con el código paga 2%.
- **Loader de carrito por URL roto (2026-09-22)**: `useURLCartLoader.ts` usa join `products`↔`product_variants`
  que PostgREST no reconoce (PGRST200) → `?items=` y `?variant=` NO cargan carrito. Preexistente. Afecta links
  de email/ads que usen esos params y bloquea QA automatizado.
- **Semántica backend BOGO entre variantes (M+L) sin verificar** — pendiente de QA manual en `/pagar`.
- **Wallet: cupón en cotización** depende de `verify-discount`; si difiere, entra la re-confirmación.
- **Wallet: re-cotización crea una orden pendiente extra** por intento fallido (sin cobro).
- **Fallback `order.total_amount`** en express sigue siendo `unit×qty` si el backend no lo devuelve (preexistente).
- **Canonical en `index.html` apunta a `https://rodata.mx`** pero producción es `rodata.store` (2026-09-22).
- **Stacking volume+bogo**: si se crea volume rule para Rodata One, el pack se oculta (fail-safe).
- **CTA de control muestra precio unitario** aunque cantidad > 1.
- **`?exp=` preview del runtime**: no usar en links compartidos ni anuncios.
- **Caché de navegador post-deploy**: pedir hard refresh antes de re-editar.
- **Google Ads sin validar (2026-09-01)** · **PayPal MX sin prueba real (2026-08-18)** · **Meta Purchase duplicados (2026-08-06)**.
- PayPal express no está en la PDP carretera; si se añade, debe consumir `selectedPurchaseItems` + `validateSelection`.

## Key Files
- `src/lib/pdp-purchase.ts`, `src/lib/cart-pricing.ts`, `src/lib/__tests__/pack-pricing.test.ts`
- `src/components/PackOfferSelector.tsx` — UI del test
- `src/experiments/rodata-one-pack-presentation.json` — **active**
- Runtime protegido: `src/experiments/index.ts`, `src/hooks/useExperiment.ts`, `src/hooks/usePriceExperiment.ts`, `src/lib/experiments.ts`
- `src/components/headless/HeadlessProduct.tsx`, `src/components/ProductExpressCheckout.tsx`
- `src/adapters/CartAdapter.tsx`, `src/pages/ui/CartUI.tsx`, `src/components/CartSidebar.tsx`
- `src/pages/ui/ProductPageUI.tsx` (gate `OfferExperimentGate`), `src/hooks/useURLCartLoader.ts` (roto)

## PENDING / Future Sessions
- **[CRÍTICA]** Próxima sesión: `experiment-list` → confirmar `started_at` + `synced`.
- **[CRÍTICA]** Resultado del QA manual del cliente en `/pagar` (2 iguales, 2 tallas distintas, 3 unidades). Si no cuadra → pausar.
- **[CRÍTICA]** Decisión del cliente sobre `DEDE`.
- **[ALTA]** Arreglar `useURLCartLoader` (join de variantes) — con permiso del cliente; habilita QA automatizado.
- **[ALTA]** Ejecutar `npx vitest run src/lib/__tests__`.
- **[ALTA]** Merchant Center devoluciones + verificación del sitio · decidir canonical.
- **[ALTA]** Insight de recuperación de pagos · email checkout abandonado · ad set repartidores con UTMs.
- **[MEDIA]** `estimated_delivery_at` · enhanced conversions · hidratar `/gracias/:id`.