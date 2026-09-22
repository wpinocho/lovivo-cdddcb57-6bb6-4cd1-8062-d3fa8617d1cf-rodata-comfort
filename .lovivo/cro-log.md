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
Ninguno activo.

## Ruled Out
<!-- Changes that were tried and didn't work, or hypotheses that were disproven.
     This prevents repeating failed approaches. -->

### 2026-09-22 — Rodata One $849 NO adoptado · resultado INCONCLUSO (direccional a favor del control)
- **flag_key**: `exp-cdddcb57-rodata-one-price-849` · manifiesto `src/experiments/rodata-one-price-849.json`
  (conservado como historia, `status: "completed"`)
- **PostHog**: Feature Flag 866817 · Experiment 461160
- **Corrió**: 2026-09-04 → 2026-09-22 (~18 días). `product_price` a nivel producto, 50/50,
  control $799 · test $849. `sync_status: synced` durante toda su vida.
- **Hipótesis**: subir a $849 aumenta el ingreso por visitante porque la caída de conversión
  sería menor al 5.9% necesario para compensar los $50 extra de margen.
- **Veredicto**: ➡️ **INCONCLUSO / direccional a favor del control.** Se mantiene $799.
  **$799 NO está probado estadísticamente como ganador.** El test no demostró que $849 fuera peor;
  simplemente no produjo evidencia suficiente para justificar mover el precio.
- **⚠️ NO HAY CIFRAS FINALES. Esto es lo más importante de esta entrada.**
  Al cerrar, `experiment-results` devolvió **`Unauthorized`** — el cálculo central de Lovivo no
  respondió. **No se leyó ni una sola métrica**: ni exposiciones por variante, ni revenue por
  visitante, ni `decision`, ni `data_quality`. El cierre fue una **decisión de negocio tomada a
  ciegas**, no una lectura de datos. Reportado al equipo de Lovivo (feedback
  `68861868-3d39-49cb-a020-125fe9dd73db`).
  **Si alguien en el futuro cita este test como "prueba de que $799 convierte mejor", está
  inventando. No existe tal dato.**
- **Por qué era esperable un inconcluso de todos modos**: el colchón de 5.9% estaba por debajo
  del umbral detectable con este volumen (~15 órdenes/variante/semana). Incluso con la
  herramienta funcionando, lo más probable era no distinguir las variantes.
- **Confound conocido y aceptado**: `compare_at_price` se quedó en $999 en ambas variantes, así
  que el grupo test vio "15% OFF" en vez de "20% OFF". Se probó "la oferta a $849", no el precio
  en abstracto. Un test futuro debería alinear el ancla.
- **Estado del catálogo al cerrar**: verificado con `ecommerce--list-data` — producto y las 4
  tallas en $799 / compare_at $999. **No se tocó ningún precio.** Al pasar a `completed` el
  runtime deja de resolver variantes y todos pagan el precio de catálogo, que ya era el control.
- **Historial**: una primera versión a $899 (2026-09-04) nunca sincronizó y su manifiesto se
  eliminó. El 2026-09-04 se hizo un re-sync de formato neutro para migrar el targeting de la
  flag de `group.store_id` a `person.store_id`.
- **Aprendizajes para el próximo price test**:
  1. Confirmar que `experiment-results` responde **antes** de dejar correr semanas de tráfico
     pagado. Hacer una lectura de control en la primera semana.
  2. Con ~30 órdenes/semana totales, un delta de precio de $50 (6%) es indetectable. Si se
     vuelve a probar precio, usar un salto más grande ($899-$949, colchón >11%) o aceptar de
     entrada que la decisión será comercial.
  3. Mover `compare_at_price` junto con el precio de test para no mezclar precio y % de descuento.

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