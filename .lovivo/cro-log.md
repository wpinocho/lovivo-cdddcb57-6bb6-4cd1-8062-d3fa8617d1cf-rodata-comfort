# CRO Log
<!-- This file is maintained by Lovivo AI to track conversion optimization work.
     READ this file before starting any CRO analysis to avoid repeating past work.
     UPDATE this file after every change with hypothesis, implementation, and results. -->

## Baseline
<!-- Record your funnel metrics here BEFORE making changes. Update with new baselines after significant changes. -->
<!-- Example:
- **Date**: 2026-03-25
- **Period**: 7 days
- **Funnel**: pageview(225) → viewcontent(203, 90%) → photo_uploaded(8, 3.9%) → addtocart(1) → purchase(0)
- **Bottleneck**: viewcontent → photo_uploaded (96% drop-off)
- **Device split**: Mobile 67%, Desktop 33%
- **Top sources**: direct 45%, meta ads 30%, organic 25%
-->

### 2026-09-04 — Baseline previo al test de precio
- **Periodo**: 30 días
- **Tráfico**: 6,362 visitantes únicos / 9,915 pageviews. **94% mobile.**
- **PDP `/productos/soporte-lumbar-rodata-one`**: 5,793 únicos (91% del tráfico) ≈ 1,350/semana
- Otras páginas: home 344 · `/repartidores` 395 · `/pagar` 336
- **Ventas**: ~130 purchases ≈ 4.3/día ≈ 30/semana
- **CVR PDP ≈ 2.2%** → **RPV ≈ $17.6** por visitante de PDP a $799
- **Fuente dominante**: Facebook + Instagram (~8,200 visitas) = tráfico pagado

## Changes
<!-- Log every CRO change. Format:
### YYYY-MM-DD — Short description
- **Hypothesis**: What you think is wrong and why this change should fix it
- **Change**: What was actually modified
- **Files**: Which files were edited
- **Metric to watch**: Which conversion step should improve
- **Result**: (fill in after 5-7 days) before% → after%, verdict: ✅ kept / ❌ reverted / ➡️ inconclusive
-->

## Active Experiments
<!-- A/B tests currently running. Include flag_key, start date, variants, and target metric. -->

### Rodata One — $799 vs $849
- **flag_key**: `exp-cdddcb57-rodata-one-price-849`
- **Manifiesto**: `src/experiments/rodata-one-price-849.json`
- **Tipo**: `product_price` a nivel PRODUCTO (`variant_id: null`) — las 4 tallas cuestan lo mismo
- **Creado**: 2026-09-04 (relanzado). Se activa al publicar (sync a PostHog post-commit).
- **Variantes**: `control` $799 (50%) · `test` $849 (50%)
- **Hipótesis**: subir a $849 aumenta el ingreso por visitante porque la caída de conversión
  será menor al 5.9% necesario para compensar los $50 extra de margen.
- **Métrica que decide**: `revenue_per_exposed_visitor`. **NO** mirar CVR sola.
- **Break-even**: CVR de 2.07% a $849 iguala el RPV actual ($17.6). Traducción: la conversión
  puede caer hasta ~5.9% y se gana lo mismo.
- **⚠️ ADVERTENCIA DE MEDICIÓN (lo más importante de esta entrada)**: el colchón de 5.9% está
  **por debajo del umbral que este volumen puede detectar** (~15 órdenes/variante/semana, ~90 en
  3 semanas). El resultado más probable es **INCONCLUSO**, no un ganador claro. Interpretación
  correcta si eso pasa: "$849 no destruyó la conversión" → decisión de negocio, no estadística.
  Un salto a $899 era más medible (colchón 11%) aunque más riesgoso comercialmente.
  **NO declarar ganador con una diferencia de RPV menor al 10%.**
- **Duración mínima acordada**: **3 semanas completas**, idealmente 4-6 dado el colchón estrecho.
- **Confound conocido y ACEPTADO**: `compare_at_price` se queda en $999 para ambas variantes,
  así que el grupo test ve "15% OFF" en vez de "20% OFF". Se prueba "la oferta a $849",
  no el precio en abstracto.
- **Historial**: la primera versión de este test ($899) se escribió el 2026-09-04 pero **nunca
  sincronizó** — `experiment-list` confirmó cero experimentos en la tienda. El manifiesto de $899
  se eliminó al relanzar para no dejar dos price tests sobre el mismo producto (se rechazan).
- **Cambio de soporte (commit anterior, ya en repo)**: `src/pages/ui/IndexUI.tsx` leía $799
  hardcodeado en 4 lugares + "20% OFF" literal. Ahora usa `usePriceExperiment` y calcula el % OFF
  contra `compare_at_price`. También se quitó "$799 MXN" del meta description de
  `DeliveryLandingUI.tsx`. **Verificado con grep el 2026-09-04: cero precios hardcodeados en src/**
  (el único match restante es un comentario en `PaypalExpressButton.tsx`, inofensivo).
- **Riesgo abierto**: creativos de Meta Ads (80% del tráfico). Si algún anuncio dice "$799",
  el grupo test aterriza con una promesa rota. Revisar desde el Dashboard → Meta Ads.
- **Cómo leerlo**: `experiment-results --flag_key exp-cdddcb57-rodata-one-price-849`.
  `sync_status` debe decir `synced`. `analytics_available: false` = DESCONOCIDO, nunca cero.
  `paid_revenue` es el total de la orden (incluye cross-sell), no del producto probado.

## Ruled Out
<!-- Changes that were tried and didn't work, or hypotheses that were disproven.
     This prevents repeating failed approaches. -->
None

## Micro-Events Status
<!-- Track which micro-events have been instrumented for the main drop-off step.
     Check items as they're added to the codebase. -->
<!-- Example:
- [ ] element_visible (tracks if the key UI element enters viewport)
- [ ] cta_clicked
- [ ] action_started
- [ ] action_completed
- [ ] action_failed (with error_type property)
-->