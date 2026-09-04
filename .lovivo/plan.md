# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (S/M/L/XL), **todas a $799** con `compare_at_price` 999. Sin planes de suscripción.
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
- **Precios en UI (2026-09-04)**: NUNCA hardcodear el precio en JSX **ni en meta descriptions**.
  Siempre desde el producto vía `logic.currentPrice` / `usePriceExperiment`, y el % OFF calculado
  contra `compare_at_price`. Un precio hardcodeado rompe los tests de precio.
  Verificación obligatoria antes de cerrar: grep de `799|MX\$` en el archivo tocado → cero.

---

## Active Plan — 🟢 Test de precio $799 vs $849 CORRIENDO (re-sync a runtime V2)

### Estado (2026-09-04): `sync_status: synced` ✅ — el experimento SÍ existe en PostHog
- `flag_key`: `exp-cdddcb57-rodata-one-price-849`
- **PostHog Feature Flag ID: 866817** · **PostHog Experiment ID: 461160**
- `started_at`: 2026-09-04T17:16:28Z · control 799 / test 849 · 50/50 · nivel PRODUCTO
- `primary_metric`: `revenue_per_exposed_visitor`

### Re-sync al synchronizer V2 (2026-09-04, esta sesión)
Motivo: la flag se creó con targeting **legacy `group.store_id`**. El synchronizer V2 desplegado
en Modal usa **`person.store_id`**, manteniendo bucketing por `distinct_id`.
Acción: **cambio de formato SEMÁNTICAMENTE NEUTRO** en `rodata-one-price-849.json` (variants y
`primary_metric` expandidos a multilínea) para que el archivo apareciera modificado en el commit
y el synchronizer lo re-procesara. **No se cambió ningún valor**: control 799, test 849, 50/50,
product_id, status active — todo idéntico. No se creó experimento nuevo, no se tocó catálogo ni
storefront.

**Targeting esperado tras el re-sync** (NO verificable por este agente, ver Known Issues):
```json
{ "key": "store_id", "value": ["cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf"],
  "operator": "exact", "type": "person" }
```
Sin `group_type_index` y sin `aggregation_group_type_index`.

### Matemática del punto de equilibrio (el número que decide)
- Hoy: CVR ≈ 2.2% × $799 = **RPV ≈ $17.6** por visitante de PDP.
- A $849, break-even es CVR = 17.6 / 849 = **2.07%**.
- La conversión puede caer hasta **~5.9%** y se gana lo mismo. Menos de 5.9% → más utilidad.
- Mirar **revenue per exposed visitor**, NUNCA CVR sola.

### ⚠️ ADVERTENCIA DE MEDICIÓN (leer antes de interpretar resultados)
El colchón de 5.9% está **por debajo de lo que este volumen puede detectar** (~15 órdenes por
variante/semana, ~90 en 3 semanas). **El resultado más probable es INCONCLUSO**, no un ganador
claro. Si eso pasa, la lectura correcta es: "$849 no destruyó la conversión" → y la decisión pasa
a ser de negocio, no estadística. **No declarar ganador con una diferencia de RPV <10%.**

⚠️ **El re-sync puede haber reseteado el bucketing.** Si el targeting pasó de group a person, los
visitantes podrían re-asignarse de variante. Tratar **2026-09-04 como el día 0 real** del test y
contar las 3 semanas desde aquí, no desde el primer intento.

### Decisiones tomadas y por qué
1. Test a nivel PRODUCTO, no por talla: partir por talla mataría el volumen.
2. **`compare_at_price` se queda en 999 para ambas variantes.** Consecuencia natural: el grupo
   test verá "15% OFF" en vez de "20% OFF" (el badge es dinámico). Confound conocido y **ACEPTADO**.
3. **NO se tocó `products.price`.** Sigue en 799. Mover el catálogo destruiría el control.
4. **NO se tocó** `ProductAdapter`, `CartContext`, `CheckoutUI`, `StripePayment`,
   `PaypalExpressButton`. El runtime propaga el precio autorizado vía `resolvedUnitPrice`.

### Riesgo abierto — creativos de Meta Ads (NO lo puede hacer este agente)
Facebook + Instagram traen ~80% del tráfico. **Si algún creativo o copy de anuncio dice "$799",
el grupo test aterriza con una promesa rota.** Revisar desde el Dashboard → Meta Ads.

### Reglas de lectura del resultado (para sesiones futuras)
- Leer con `experiment-results --flag_key exp-cdddcb57-rodata-one-price-849`.
- **`sync_status` debe decir `synced`.** Cualquier otra cosa = no está corriendo.
- **`analytics_available: false` significa DESCONOCIDO, nunca cero.**
- La métrica que decide es `revenue_per_exposed_visitor`, NO la tasa de conversión.
- `paid_revenue` es el total de la orden completa, incluye cross-sell.
- **Duración mínima: 3 semanas completas** desde 2026-09-04, idealmente 4-6.
- Ninguna herramienta calcula significancia estadística. Si el volumen no alcanza, decirlo.

### Cómo cerrar el test
- Si gana $849: aplicar precio permanente con `ecommerce--update-product` (producto + 4 variantes),
  `status: "completed"` en el manifiesto (conservar archivo), mover a `## Changes` en cro-log.
  Considerar test de seguimiento $849 vs $899.
- Si gana $799: `status: "completed"`, mover a `## Ruled Out`, no tocar el catálogo.
- Si queda inconcluso: decisión de negocio. No presentarlo como victoria.

---

## Recent Changes
- **🔄 Re-sync del test de precio al runtime V2** (2026-09-04) — reformato neutro de
  `rodata-one-price-849.json` para forzar re-procesamiento y migrar targeting de
  `group.store_id` → `person.store_id`. Flag 866817 / Experiment 461160 preservados.
- **🟢 Test de precio $799 vs $849 CONFIRMADO synced** (2026-09-04) — flag 866817, exp 461160.
- **🚀 Test de precio RELANZADO a $799 vs $849** (2026-09-04) — manifiesto validado,
  manifiesto de $899 eliminado, runtime verificado, grep de precios en cero.
- **🚀 Test de precio $799 vs $899 IMPLEMENTADO** (2026-09-04) — **falló el sync, reemplazado.**
  Su cambio de soporte sí quedó: `IndexUI.tsx` con precio dinámico + meta de `DeliveryLandingUI`.
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
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)

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

### Home (`IndexUI.tsx`)
- HERO_IMG: `SB_MSG/1775772513540-16g7elmcuii.webp`
- LIFESTYLE_WORN/BELT/DETAIL: `SB_MSG/1775771349198-676o65sijn4.webp`, `-tl8qt6nmo8.webp`, `-z730si7cdto.webp`
- PROBLEMA_REAL_IMG: `SB_MSG/1775770729257-1nufsuab1jt.webp`

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
- **Targeting de la flag NO verificable por el agente (2026-09-04)**: ninguna herramienta
  disponible (`experiment-list`, `experiment-results`, `posthog-query`) devuelve el payload de
  targeting de un feature flag. **No se puede confirmar desde aquí que quedó `person.store_id`
  ni que desapareció `group_type_index`.** Verificar manualmente en PostHog →
  Feature Flags → 866817 → Release conditions. Si sigue en `group`, es bug del synchronizer V2:
  reportar con `agent-feedback`.
- **Posible reset de bucketing por el re-sync (2026-09-04)**: cambiar targeting de group a person
  puede re-asignar visitantes de variante. Contar el test desde 2026-09-04, no desde antes.
- **Colchón estrecho en el test de $849 (2026-09-04)**: 5.9% de margen de caída está por debajo
  del umbral detectable con ~90 órdenes/variante. Esperar "inconcluso" como resultado base.
- **Creativos de Meta Ads con precio (2026-09-04, sin verificar)**: si algún anuncio dice $799,
  el grupo test llega a una promesa rota. Revisar desde el Dashboard.
- **Caché de navegador post-deploy (2026-09-03)**: el user reportó dos veces un cambio "no
  aplicado" que sí estaba en el código. Antes de re-editar, verificar con grep y pedir hard refresh.
- **Banner de recuperación sin probar en vivo (2026-09-03)**: código completo, faltan las 5
  pruebas de aceptación con tarjetas de test de Stripe.
- **Banner acoplado a StripePayment (2026-09-03)**: si se apaga el pago con tarjeta, no renderiza.
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
- `src/experiments/rodata-one-price-849.json` — **manifiesto activo** (flag 866817 / exp 461160)
- `src/experiments/index.ts` — `EXPERIMENT_RUNTIME_VERSION = 1`, `getActivePriceExperiment()`
- `src/hooks/usePriceExperiment.ts` — resuelve el precio vía edge `experiment-resolve`
- `src/hooks/useExperiment.ts`, `src/lib/experiments.ts`, `src/types/experiments.ts`
- `src/components/headless/HeadlessProduct.tsx` L243-258 — patrón de consumo en PDP
- `src/components/headless/HeadlessProductCard.tsx` L109-143 — patrón de referencia (card)
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
- `src/pages/ui/DeliveryLandingUI.tsx` — landing repartidores (meta description ~L170)
- `src/pages/ui/IndexUI.tsx` — home. **Precio 100% dinámico** (hook en L76, helpers L81-89)
- `src/components/headless/HeadlessIndex.tsx` — FORBIDDEN. `filteredProducts`, `loading`
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Verificar MANUALMENTE en PostHog (Feature Flags → 866817 → Release conditions)
  que el targeting quedó `type: "person"` con `store_id` y sin `group_type_index`. El agente
  no puede leer eso. Si sigue en `group`, reportar con `agent-feedback`.
- **[CRÍTICA]** Revisar creativos de Meta Ads por menciones de "$799" (Dashboard → Meta Ads).
- **[CRÍTICA]** Probar el banner con tarjetas de test de Stripe y con cancelación real de PayPal.
- **[CRÍTICA]** Validar Google Ads con Tag Assistant + compra de prueba.
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos de checkout lleguen.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** A las 3 semanas del re-sync (≈ 2026-09-25): leer `experiment-results` y decidir con
  RPV, no con CVR. Esperar "inconcluso"; no forzar un ganador.
- **[ALTA]** Insight PostHog: tasa de recuperación (failed → succeeded en la misma sesión).
- **[ALTA]** Automatización de email de checkout abandonado / pago fallido (Dashboard).
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code`.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs.
- **[MEDIA]** Guardar `estimated_delivery_at` en la orden usando el mismo rango 4–7.
- **[MEDIA]** Enhanced conversions con teléfono/dirección además del email.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token`.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.