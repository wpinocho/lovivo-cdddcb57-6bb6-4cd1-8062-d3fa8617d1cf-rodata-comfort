# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, medido 2026-09-04)**: 6,362 visitantes únicos / 9,915 pageviews.
  PDP concentra **5,793 únicos (91%)**. Home solo 344, `/repartidores` 395, `/pagar` 336.
  **94% mobile.** Fuente dominante: Facebook + Instagram (~8,200 visitas) = tráfico pagado.
- **Ventas (30d)**: ~130 purchases ≈ 4.3/día ≈ 30/semana. CVR PDP ≈ 2.2%.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`
- **Cards de reseña con foto**: `aspect-square`. Fuente a `width=700`.
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`. Cambiar solo copy,
  imágenes, reviews y FAQ. Nunca reinventar el esqueleto.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca mostrar el string crudo de
  Stripe/PayPal. Banner persistente (no toast) + siguiente paso concreto + alternativa de pago.
- **ETA de entrega (2026-09-03)**: días **NATURALES**, 4 a 7. Fuente única de verdad:
  `src/lib/delivery-estimate.ts`. NUNCA duplicar la lógica de fecha en un componente.
- **Precios en UI (2026-09-04)**: NUNCA hardcodear el precio en JSX. Siempre desde el producto vía
  `logic.currentPrice` / `usePriceExperiment`. Un precio hardcodeado rompe los tests de precio.

---

## Active Plan — 📋 A/B test de precio: MX$799 (control) vs MX$899 (test)

### Qué quiere el usuario
Probar si subir el Rodata One de MX$799 a MX$899 gana o pierde dinero. No sabe cómo hacerlo
ni si va a funcionar. Quiere un test, no un cambio a ciegas.

### Viabilidad — VERIFICADO ✅ (2026-09-04)
- **Runtime de experimentos instalado**: `src/experiments/index.ts` exporta
  `EXPERIMENT_RUNTIME_VERSION = 1` y `src/hooks/usePriceExperiment.ts` existe y está completo.
  → El manifiesto de tipo `product_price` NO será rechazado por `store_not_experiment_ready`.
- **Experimentos existentes**: `experiment-list` devuelve VACÍO. Cero conflictos, cero
  contaminación. Este sería el primer experimento de la tienda.
- **Tráfico PDP**: 5,793 únicos / 30d ≈ **1,350/semana**. Por encima del umbral de 1,000/semana
  de la skill. ✅
- **Volumen de conversión**: ~30 órdenes/semana → **~15 por variante/semana**. En 4 semanas:
  ~60 órdenes por variante. Suficiente para detectar una diferencia GRANDE, insuficiente para
  detectar una diferencia sutil (<10%). Comunicar esto al usuario sin adornos.
- **Precio de catálogo consistente**: producto y las 4 variantes (S/M/L/XL) están TODAS en 799.
  → Se puede hacer test a nivel producto (`variant_id: null`) sin rechazo por precios dispares. ✅
- **Sin selling plans / suscripciones** en este producto. ✅

### Matemática del punto de equilibrio (usar en el reporte al usuario)
- Hoy: CVR ≈ 2.2% × $799 = **RPV ≈ $17.6** por visitante de PDP.
- A $899, el break-even es CVR = 17.6 / 899 = **1.96%**.
- Traducción: la conversión puede caer hasta **~11%** y aún así se gana lo mismo.
  Si cae menos de 11% → **más utilidad** (y además $100 extra de margen por unidad).
  Si cae más de 11% → se revierte.
- Este es el número que decide el test. No mirar CVR sola: mirar **revenue per exposed visitor**.

### Decisiones tomadas
1. **Test a nivel PRODUCTO** (`variant_id: null`), no por talla. Las 4 tallas cuestan lo mismo y
   partir por talla mataría el volumen.
2. **`compare_at_price` se queda en 999 para ambas variantes.** No se toca. Consecuencia natural:
   el grupo test verá "10% OFF" en vez de "20% OFF" — el badge es dinámico (`discountPct`
   calculado en `ProductPageUI.tsx` L283 y `DeliveryPDPUI.tsx` L325). Esto es un confound conocido
   y ACEPTADO: se está probando "la oferta a $899", no el precio en abstracto. Documentarlo.
3. **NO tocar `products.price`.** Sigue en 799. Mover el catálogo destruiría el control.
4. **NO tocar** `ProductAdapter`, `CartContext`, `CheckoutUI`, `StripePayment`, `PaypalExpressButton`.
   El runtime ya propaga el precio autorizado punta a punta vía `resolvedUnitPrice`
   (verificado: `CartContext` L60/L92/L117, `CartSidebar` L110/L270, `CartAdapter` L29,
   `ProductExpressCheckout` L108/L252, `cart-utils.ts` no lo envía a propósito).

### Bloqueador a resolver ANTES de lanzar: precio hardcodeado en la home
`src/pages/ui/IndexUI.tsx` tiene **MX$799 escrito a mano en 4 lugares** + un "20% OFF" fijo:
- L118 — bloque de precio del hero
- L121 — badge `20% OFF`
- L361 — botón "Comprar ahora — MX$799"
- L482 — botón "Comprar Rodata One — MX$799"
- L713 — bloque de precio del CTA final

Si el test corre tal cual, un visitante del grupo test ve $799 en la home y $899 en la PDP.
Es incoherente y erosiona confianza. Riesgo real pero acotado: la home solo tuvo **344 únicos
en 30 días (5% del tráfico)** porque los ads van directo a la PDP.

**Fix requerido (Craft Mode), en el MISMO commit que el manifiesto:**
- Conectar `IndexUI.tsx` al precio real del producto. Usar el mismo camino que
  `HeadlessProductCard.tsx` (L121-136): `usePriceExperiment({ productId, catalogPrice })`
  y renderizar `resolvedPrice` con `formatMoney`.
- Calcular el % OFF dinámicamente contra `compare_at_price` (999), igual que hace
  `ProductPageUI.tsx` con `discountPct`. Nada de "20%" literal.
- Los dos botones deben mostrar el precio resuelto, no una cadena fija.
- Verificar con grep que quedan **cero** ocurrencias de `799` en `src/pages/ui/IndexUI.tsx`.

Alternativa más barata si el usuario tiene prisa: quitar el precio de la home y dejarlo solo en
la PDP. Menos trabajo pero pierde fuerza el hero. Preferir el fix dinámico.

### Chequeo externo — creativos de Meta Ads
Los ads de Facebook/Instagram traen el 80% del tráfico. **Si algún creativo o copy de anuncio
dice "$799", el grupo test aterriza con una promesa rota.** Hay que revisarlo desde el Dashboard
(Meta Ads) antes de lanzar. Si los ads mencionan precio, quitarlo del copy del anuncio durante
el test. Esto NO lo puede hacer el agente del Visual Editor — es tarea del Dashboard.

### Implementation steps (Craft Mode)
1. Crear `src/experiments/rodata-one-price-899.json`:
```json
{
  "schema_version": 1,
  "name": "Rodata One — $799 vs $899",
  "flag_key": "exp-cdddcb57-rodata-one-price-899",
  "type": "product_price",
  "status": "active",
  "hypothesis": "Subir el Rodata One a $899 aumenta el ingreso por visitante porque la caída de conversión será menor al 11% que se necesita para compensar los $100 extra de margen.",
  "target": { "product_id": "400026a2-c277-407c-abbb-d1683f415120", "variant_id": null },
  "variants": [
    { "key": "control", "name": "$799 (actual)", "weight": 50 },
    { "key": "test", "name": "$899", "weight": 50 }
  ],
  "primary_metric": { "kind": "revenue_per_exposed_visitor" }
}
```
   - `control.price` DEBE ser 799 y `test.price` 899 en el archivo final (los campos `price` van
     dentro de cada variante). Verificar contra el catálogo antes de escribir: hoy es 799.
   - `flag_key` DEBE empezar con `exp-cdddcb57-`.
2. Arreglar `src/pages/ui/IndexUI.tsx` (ver bloqueador arriba). Grep final: cero `799`.
3. Registrar la hipótesis en `.lovivo/cro-log.md` bajo `## Active Experiments` con fecha,
   break-even de 1.96% CVR y la duración mínima acordada.
4. **NO** decirle al usuario que el experimento ya está corriendo. La sincronización con PostHog
   ocurre después del mensaje. Se activa al publicar.

### Reglas de lectura del resultado (para sesiones futuras)
- Leer con `experiment-results --flag_key exp-cdddcb57-rodata-one-price-899`.
- **`sync_status` debe decir `synced`.** Cualquier otra cosa = no está corriendo, no hay datos.
- **`analytics_available: false` significa DESCONOCIDO, nunca cero.**
- La métrica que decide es `revenue_per_exposed_visitor`, NO la tasa de conversión.
- `paid_revenue` es el total de la orden completa, incluye cross-sell. No describirlo como
  ingreso del producto probado.
- **Duración mínima: 3 semanas completas** (~90 órdenes por variante). Idealmente 4.
  No declarar ganador antes, ni con una racha de 10 órdenes.
- Ninguna de las dos herramientas calcula significancia estadística. Si el volumen no alcanza,
  decirlo tal cual.

### Cómo cerrar el test
- Si gana $899: aplicar el precio permanente con `ecommerce--update-product` (producto + las 4
  variantes), poner `status: "completed"` en el manifiesto (conservar el archivo), mover la
  entrada a `## Changes` en el cro-log. Revisar si conviene subir `compare_at_price` de 999.
- Si gana $799: `status: "completed"`, mover a `## Ruled Out`, no tocar el catálogo.

---

## Recent Changes
- **📋 Plan: A/B test de precio $799 vs $899** (2026-09-04) — viabilidad verificada (runtime OK,
  cero experimentos previos, 1,350 únicos/sem en PDP, las 4 variantes a 799). Bloqueador
  detectado: 4 precios hardcodeados en `IndexUI.tsx`.
- **✅ ETA centralizado en `src/lib/delivery-estimate.ts`** (2026-09-03) — 1 archivo nuevo +
  4 modificados (Checkout, ProductPage, DeliveryPDP, DeliveryLanding).
- **✅ ETA del checkout a días naturales 4–7** (2026-09-03) — `CheckoutUI.tsx`.
- **✅ Recuperación de pagos rechazados IMPLEMENTADA** (2026-09-03) — 3 archivos nuevos
  (`payment-errors.ts`, `payment-recovery.ts`, `PaymentRecoveryBanner.tsx`) + 3 modificados.
- **✅ Google Ads (gtag.js) implementado** (2026-09-01) — 2 archivos nuevos + 4 modificados.
- **✅ Instrumentación completa de checkout en PostHog** (2026-08-25) — 14 eventos nuevos.
- **✅ Ajustes finos `/repartidores`** (2026-08-20, tanda 3).
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2).
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1).
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18). **Falta prueba real.**
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06).
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`

### Imágenes del producto en catálogo (5, bucket `product-images/products/`)
`nae4riov9h.webp`, `j8kw94s83hn.webp`, `pjleekrch4l.webp`, `b5mg4lv2qbf.webp`, `0evbcgfgplnh.webp`

### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `SB_MSG/1775768374485-uca4dkx21g.webp`
- PRODUCT_FLAT: `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5: `SB_PROD/review-1..5.webp`
- AVATAR_CARLOS/JORGE/ANDRES: `SB_PROD/avatar-carlos-v3.webp`, `avatar-jorge-v3.webp`, `avatar-andres-v3.webp`

### Avatar repartidor — fotografía REAL vigente
Bucket `SB_MSG`. Galería producto (prefijo `1787249204164-`): `ifubpmh955s`, `h4pa1xnbjw`,
`5rlwxy193t3`, `r9dtbwqmwaa`, `7ws595nt61i`.
Resto (prefijo `1787251752010-`): lifestyle `uvy9yh7965f`; Beneficio 01 `mf34bj94nqm`,
02 `h6de90gdd6`, 03 `dxk60x3zg28`; quote `2b6138nc4z9`; reseñas `jotniqhksrb`, `13eliul1j8io`,
`jos9p0cz468`, `wdpx2luqeyp`, `muvx1aec14`, + `SB_PROD/review-5.webp`.
- **DEPRECADAS (IA, rechazadas)**: `SB_PROD/dlv-hero.webp`, `dlv-feat-1/2/3.webp`
- **SIN USO (tanda 1)**: `SB_MSG/1787249204164-0fhnu1sec2e`, `-v5k7gqoh4rq`, `-w8rmrhw4b6k`, `-sobj1wnq3sg`

### Creativos de ads validados
- `SB_MSG/1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `SB_MSG/1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `SB_MSG/1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **Precio hardcodeado en `IndexUI.tsx` (2026-09-04)**: 4 ocurrencias de `MX$799` + un `20% OFF`
  literal. BLOQUEA el test de precio. Ver Active Plan.
- **Creativos de Meta Ads con precio (2026-09-04, sin verificar)**: si algún anuncio dice $799,
  el grupo test llega a una promesa rota. Revisar desde el Dashboard antes de lanzar.
- **Caché de navegador post-deploy (2026-09-03)**: el user reportó dos veces un cambio "no
  aplicado" que sí estaba en el código. Antes de re-editar, verificar con grep y pedirle
  hard refresh.
- **Banner de recuperación sin probar en vivo (2026-09-03)**: código completo, faltan las 5
  pruebas de aceptación con tarjetas de test de Stripe.
- **Banner acoplado a StripePayment (2026-09-03)**: si se apaga el pago con tarjeta, el banner
  no se renderiza.
- **Google Ads sin validar (2026-09-01)**: falta confirmar el conversion ID y ver el tag en vivo.
- **Tipo `StoreSettings` (2026-09-01)**: no incluye las columnas de Google Ads (`as any`).
- **Insights de PostHog sin armar (2026-08-25)**: el funnel de 6 pasos aún no existe.
- **PayPal MX — falta prueba real (2026-08-18)**.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve `shipping_address`.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
### Experimentos (runtime write-protected — CONSUMIR, nunca reescribir)
- `src/experiments/index.ts` — `EXPERIMENT_RUNTIME_VERSION = 1`, `getActivePriceExperiment()`
- `src/hooks/usePriceExperiment.ts` — resuelve el precio vía edge `experiment-resolve`
- `src/hooks/useExperiment.ts`, `src/lib/experiments.ts`, `src/types/experiments.ts`
- `src/components/headless/HeadlessProduct.tsx` L243-258 — patrón de consumo en PDP
- `src/components/headless/HeadlessProductCard.tsx` L121-136 — patrón para la home
- `src/contexts/CartContext.tsx` L60/L92/L117 — propagación de `resolvedUnitPrice`

### Resto
- `src/lib/delivery-estimate.ts` — **fuente única del ETA**. 4–7 días naturales.
- `src/pages/ui/CheckoutUI.tsx` — checkout de una sola página. ETA en ~L664 y ~L751
- `src/lib/payment-errors.ts` / `src/lib/payment-recovery.ts`
- `src/components/PaymentRecoveryBanner.tsx`
- `src/lib/google-ads.ts` / `src/contexts/GoogleAdsContext.tsx`
- `src/contexts/PostHogContext.tsx` / `src/lib/tracking-utils.ts`
- `src/adapters/CheckoutAdapter.tsx` / `src/components/StripePayment.tsx`
- `src/components/PaypalExpressButton.tsx` / `src/components/ProductExpressCheckout.tsx`
- `src/hooks/useCheckoutState.ts` / `src/pages/ThankYou.tsx` / `src/pages/PendingPayment.tsx`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 (precio L278, badge L283)
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (precio L320, badge L325)
- `src/pages/ui/DeliveryLandingUI.tsx` — landing repartidores
- `src/pages/ui/IndexUI.tsx` — home (⚠️ precios hardcodeados L118/121/361/482/713)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Lanzar el test de precio: manifiesto + fix de `IndexUI.tsx` en el mismo commit.
- **[CRÍTICA]** Revisar creativos de Meta Ads por menciones de "$799" antes de lanzar el test.
- **[CRÍTICA]** Probar el banner con tarjetas de test de Stripe y con cancelación real de PayPal.
- **[CRÍTICA]** Validar Google Ads con Tag Assistant + compra de prueba.
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos de checkout lleguen.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** A las 3 semanas del test: leer `experiment-results` y decidir con RPV, no con CVR.
- **[ALTA]** Insight PostHog: tasa de recuperación (failed → succeeded en la misma sesión).
- **[ALTA]** Automatización de email de checkout abandonado / pago fallido (Dashboard).
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code`.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs.
- **[MEDIA]** Guardar `estimated_delivery_at` en la orden usando el mismo rango 4–7.
- **[MEDIA]** Enhanced conversions con teléfono/dirección además del email.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token`.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.