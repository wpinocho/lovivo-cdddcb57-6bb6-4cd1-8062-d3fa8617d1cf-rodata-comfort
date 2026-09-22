# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`: `S (60-75 cm)`, `M (75-90 cm)`, `L (90-100 cm)`, `XL (100-115 cm)`), **todas a $799**
  con `compare_at_price` 999. `track_inventory: false`. Sin planes de suscripción.
- Costo unitario en catálogo: `cost: 209` → margen bruto ≈ $590 a $799.
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, medido 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads.
- **Ventas (30d)**: ~130 purchases ≈ 30/semana. CVR PDP ≈ 2.2%.
- **Política de devoluciones real (2026-09-22)**: 30 días naturales desde entrega, devoluciones y cambios de talla
  si el producto no está dañado. Cliente genera la guía y envía al almacén; cuando va en camino, Rodata envía la
  nueva talla. Contacto por WhatsApp +52 55 3121 5386.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca string crudo de Stripe/PayPal.
- **ETA de entrega (2026-09-03)**: días naturales 4 a 7. Fuente única: `src/lib/delivery-estimate.ts`.
- **Precios en UI (2026-09-04)**: NUNCA hardcodear precios ni % en JSX/meta. Siempre desde el producto /
  `logic.currentPrice` / `logic.packOffer` / `logic.purchaseQuote`. Grep de `799|MX\$` → cero.
- **Pricing de reglas (2026-09-22)**: fuente única `src/lib/cart-pricing.ts` (`calcLinesPricing`,
  `calcCartPricing`). PDP y carrito la usan. BOGO `same_products` = pool por producto entre tallas.
- **Link de política de devoluciones (2026-09-22)**: SOLO en el footer, columna "Navegación". Pedido explícito
  del cliente: no ponerlo en PDP, checkout ni otro lugar.

---

## Active Plan — ⏸️ Experimento de oferta PREPARADO, PAUSADO

### `exp-cdddcb57-pdp-second-belt-offer` (2026-09-22)
- Manifiesto `src/experiments/rodata-one-pack-presentation.json` — `type: ui`, `status: paused`,
  `purpose: offer_presentation`, métrica `margin_per_exposed_visitor`. Validador: OK.
- Regla BOGO compartida `7653e73d-ce1b-446f-a37d-3eb5cffb9602` — **`active: false`**.
- Arquitectura:
  - `useExperiment` en `ProductPageUI` nivel superior (ambas variantes). `showPack = variant==='test' && packOffer`.
  - `HeadlessProduct`: `packQuantity`, `secondSelected` (arranca vacío), `buildPurchase()` = fuente única
    de items (1×M → [M×1]; M+L → [M×1, L×1]; M+M → [M×2]); errores `select_first/select_second/out_of_stock`;
    `packOffer` null si no hay BOGO activa, reglas cargando, selling plan, price experiment o volume+bogo.
  - `ProductExpressCheckout`: props opcionales `purchaseItems`, `quotedSubtotal`, `onProcessingChange`;
    aborta sin crear PaymentIntent si total backend ≠ total mostrado; guard de doble disparo.
  - `PackOfferSelector.tsx`: UI del test (radios, badge % derivado, talla de 2.ª faja).
- **Gates antes de activar (en orden)**:
  1. `experiment-results` debe responder (falló Unauthorized el 2026-09-22).
  2. Activar BOGO → crear checkout sin pagar con M+L, M+M, 3 y 4 unidades; total de `/pagar` = PDP = carrito.
     Confirma que el backend agrupa `same_products` entre variantes (asumido, no verificado).
  3. Revisar stacking con códigos: `VUELVE10` (10%) y **`DEDE` 98% ACTIVO** (¿código de prueba? desactivar).
  4. Recién ahí `status: "active"` en el manifiesto.

### Price test $799 vs $849 — ya CERRADO (2026-09-22, sesión anterior)
`completed`, inconcluso / direccional a favor del control. Ver cro-log.

---

## Recent Changes
- **✅ Página `/politica-de-devoluciones` creada** (2026-09-22) — `src/pages/ReturnPolicy.tsx`, ruta en `App.tsx`,
  link solo en footer "Navegación" (`EcommerceTemplate.tsx`). Para Merchant Center. Incluye best practices añadidas:
  reembolso al mismo método en hasta 10 días hábiles, envío de la nueva talla sin costo, defectuoso/equivocado = Rodata
  cubre envíos. Indexable (Google debe rastrearla).
- **✅ Meta `google-site-verification` añadida en `index.html`** (2026-09-22) — para Google Merchant Center.
  Token `_RBrWri4uvRAMj82sXqIHvhn8WmbjBN7S8KgDy4-20w`. NO QUITAR.
- **⏸️ Experimento UI "2.ª unidad al 50%" PREPARADO pausado + BOGO inactiva** (2026-09-22) — nuevos:
  `src/lib/cart-pricing.ts`, `src/components/PackOfferSelector.tsx`, manifiesto. Modificados:
  `HeadlessProduct.tsx`, `ProductPageUI.tsx`, `ProductExpressCheckout.tsx`, `CartAdapter.tsx`,
  `CartSidebar.tsx`, `price-rule-utils.ts`, `supabase.ts` (tipo `same_products`).
- **⚪ Test de precio $799 vs $849 CERRADO como inconcluso** (2026-09-22).
- **🔄 Re-sync del test de precio al runtime V2** (2026-09-04).
- **🚀 Test de precio $799 vs $849 lanzado** (2026-09-04).
- **✅ ETA centralizado en `src/lib/delivery-estimate.ts`** (2026-09-03).
- **✅ Recuperación de pagos rechazados** (2026-09-03).
- **✅ Google Ads (gtag.js)** (2026-09-01).
- **✅ Instrumentación de checkout en PostHog** (2026-08-25) — 14 eventos.
- **✅ Fotografía real en `/repartidores`** (2026-08-20, 3 tandas).
- **✅ Fix PayPal → `/gracias`** (2026-08-18). Falta prueba real.
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
- **Canonical en `index.html` apunta a `https://rodata.mx`** pero producción es `rodata.store` (2026-09-22).
  Posible conflicto para Search Console / Merchant Center. Pendiente confirmar con el cliente antes de cambiar.
- **Términos y condiciones §7 (2026-09-22)** menciona "plazo establecido en nuestra política de devoluciones" sin link;
  se dejó así por pedido del cliente (link solo en footer).
- **Cart line display con BOGO (2026-09-22)**: el TOTAL del carrito ya usa pricing central, pero el precio
  por línea (`calcItemUnitPrice`) es por línea. Antes de activar: añadir renglón "Promoción 2.ª al 50% −$X".
- **Semántica backend BOGO sin verificar (2026-09-22)**.
- **Stacking volume+bogo**: si se crea una volume rule para Rodata One, el pack se oculta (fail-safe).
- **`?exp=` preview del runtime**: no usar en links compartidos ni anuncios.
- **Código `DEDE` 98% activo (2026-09-22)**: riesgo comercial real hoy.
- **`experiment-results` devuelve `Unauthorized` (2026-09-22)**. Reportado (`68861868-...`).
- **Targeting de flags no legible por el agente (2026-09-04)**.
- **Caché de navegador post-deploy**: verificar con grep y pedir hard refresh antes de re-editar.
- **Banner de recuperación sin probar en vivo (2026-09-03)** · acoplado a StripePayment.
- **Google Ads sin validar (2026-09-01)** · `StoreSettings` sin columnas de Google Ads (`as any`).
- **PayPal MX — falta prueba real (2026-08-18)**.
- **Meta Purchase server duplicados (2026-08-06)**.
- PayPal express no está en la PDP carretera (solo Stripe PRB); si se añade, debe consumir `selectedPurchaseItems`.

## Key Files
- `index.html` — meta `google-site-verification` (Merchant Center), canonical, OG
- `src/pages/ReturnPolicy.tsx` — `/politica-de-devoluciones` (Merchant Center)
- `src/lib/cart-pricing.ts` — **pricing central de reglas** (PDP + carrito)
- `src/components/PackOfferSelector.tsx` — UI del test de oferta
- `src/experiments/rodata-one-pack-presentation.json` — **paused**
- `src/experiments/rodata-one-price-849.json` — completed (histórico)
- Runtime protegido: `src/experiments/index.ts`, `src/hooks/useExperiment.ts`, `src/hooks/usePriceExperiment.ts`, `src/lib/experiments.ts`
- `src/components/headless/HeadlessProduct.tsx` — `buildPurchase()`, `packOffer`, price experiment
- `src/components/ProductExpressCheckout.tsx` — wallet PDP (acepta `purchaseItems`)
- `src/adapters/CartAdapter.tsx` / `src/components/CartSidebar.tsx` — `adjustedTotal` vía `calcCartPricing`
- `src/lib/cart-utils.ts` — `cartToApiItems`
- `src/lib/checkout.ts` — envía `analytics_distinct_id`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera
- `src/templates/EcommerceTemplate.tsx` — footer (columna Navegación)
- `src/pages/ui/DeliveryPDPUI.tsx`, `DeliveryLandingUI.tsx`, `IndexUI.tsx`, `CheckoutUI.tsx`
- `src/lib/delivery-estimate.ts`, `payment-errors.ts`, `payment-recovery.ts`, `google-ads.ts`

## PENDING / Future Sessions
- **[ALTA]** Merchant Center: URL de devoluciones = `https://rodata.store/politica-de-devoluciones`; plazo 30 días;
  costo de devolución = lo paga el cliente; acepta defectuosos y no defectuosos + cambios.
- **[ALTA]** Tras deploy: usuario pulsa "Verificar" en Merchant Center; si falla, revisar que rodata.store sirva el index.html nuevo.
- **[ALTA]** Decidir canonical `rodata.mx` vs `rodata.store`.
- **[CRÍTICA]** Revisar/desactivar el código `DEDE` (98% activo).
- **[CRÍTICA — antes de activar oferta]** Gates 1–4 del Active Plan + renglón de promoción en el carrito.
- **[CRÍTICA]** Tras deploy: `experiment-list` debe mostrar el nuevo experimento `paused` + `synced`.
- **[CRÍTICA]** Probar banner de recuperación, Google Ads, eventos PostHog, PayPal real.
- **[ALTA]** Insight de recuperación de pagos · email de checkout abandonado · funnel 6 pasos.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs.
- **[MEDIA]** `estimated_delivery_at` en la orden · enhanced conversions · hidratar `/gracias/:id`.
- **[BAJA]** Test sin nav vs con nav en `/repartidores`.