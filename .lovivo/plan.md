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

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx` (arquitectura
  validada). Cambiar solo copy, imágenes, reviews y FAQ. Nunca reinventar el esqueleto.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO se usan las fotos reales que él
  sube. Prohibido mezclar las imágenes del producto de la BD ni generar con IA para esa landing.

---

## Active Plan — ✅ Reasignación de fotos reales en `/repartidores` (2026-08-20, tanda 2). Falta QA visual.

### Mapeo DEFINITIVO de slots en `src/pages/ui/DeliveryPDPUI.tsx`
Bucket: `message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1` (constante `SB_UPLOAD`)

**Tanda 1 (prefijo `1787249204164-`) — solo galería del producto:**
| Slot | Archivo |
|---|---|
| Galería 1 (estudio 3/4) | `ifubpmh955s.webp` |
| Galería 2 (mochila térmica) | `h4pa1xnbjw.webp` |
| Galería 3 (asiento + casco) | `5rlwxy193t3.webp` |
| Galería 4 (ajuste puesto) | `r9dtbwqmwaa.webp` |
| Galería 5 (interior) | `7ws595nt61i.webp` |

**Tanda 2 (prefijo `1787251752010-`) — resto de la página:**
| # | Slot | Archivo |
|---|---|---|
| 1 | Lifestyle "Para quien vive arriba de la moto" | `uvy9yh7965f.webp` |
| 2 | Beneficio 01 | `dxk60x3zg28.webp` |
| 3 | Beneficio 02 | `h6de90gdd6.webp` |
| 4 | Beneficio 03 | `mf34bj94nqm.webp` |
| 5 | Quote "Ya cierro las 10 horas…" | `2b6138nc4z9.webp` |
| 6 | Reseña 1 — Luis M. | `jotniqhksrb.webp` |
| 7 | Reseña 2 — Ernesto R. | `13eliul1j8io.webp` |
| 8 | Reseña 3 — Diego A. | `jos9p0cz468.webp` |
| 9 | Reseña 4 — Iván T. | `wdpx2luqeyp.webp` |
| 10 | Reseña 5 — Marco V. (nueva) | `muvx1aec14.webp` |
| — | Reseña 6 — Saúl H. | `SB_PROD/review-5.webp` (original, sin cambio) |

- Reseñas ahora son **6** (grid de 3 col → 2 filas exactas).
- Constantes eliminadas: `REVIEW_IMG_1..4` y las 4 imágenes de tanda 1 usadas antes en
  lifestyle/beneficios (`0fhnu1sec2e`, `v5k7gqoh4rq`, `w8rmrhw4b6k`, `sobj1wnq3sg`) — ya sin uso.

### QA pendiente
1. Screenshot mobile + desktop de `/repartidores`.
2. Beneficio 01 usa la imagen con texto quemado "No estorba con la mochila ni da calor",
   que es el titular del Beneficio 03 → posible incongruencia visual. Confirmar con el cliente.
3. Beneficio 03 es un macro de estudio sobre fondo oscuro (no lifestyle) — validar que no rompa
   el ritmo de la sección.

---

## Recent Changes
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2) — lifestyle, 3 beneficios,
  quote break y 5 reseñas remapeados a las 10 nuevas fotos del cliente. Se agregó reseña
  "Marco V." (Querétaro) para llegar a 6; Saúl H. conserva foto y texto al final.
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1) — galería del producto (5 fotos),
  desligada de la BD.
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18) — ruta corregida, `checkout_token`,
  mapeo de items al shape real, `delivery_method`, `clearCart`, toast, tracking corregido.
  `ThankYou` ya no asume pickup y sobrevive un refresh (TTL 2h). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — creado
  `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7).
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`

### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `SB_MSG/1775768374485-uca4dkx21g.webp`
- PRODUCT_FLAT: `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5: `SB_PROD/review-1..5.webp`
- AVATAR_CARLOS/JORGE/ANDRES: `SB_PROD/avatar-carlos-v3.webp`, `avatar-jorge-v3.webp`, `avatar-andres-v3.webp`

### Avatar repartidor — fotografía REAL vigente
Ver tabla de mapeo en "Active Plan".
- **DEPRECADAS (IA, rechazadas)**: `SB_PROD/dlv-hero.webp`, `dlv-feat-1/2/3.webp`
- **SIN USO (tanda 1, sustituidas)**: `SB_MSG/1787249204164-0fhnu1sec2e`, `-v5k7gqoh4rq`,
  `-w8rmrhw4b6k`, `-sobj1wnq3sg`
- Avatares (iniciales/foto de perfil) de `/repartidores`: siguen siendo los de carretera.

### Creativos de ads validados
- `SB_MSG/1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `SB_MSG/1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `SB_MSG/1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **Beneficio 01 con texto quemado (2026-08-20)**: la imagen asignada trae overlay
  "No estorba con la mochila ni da calor", que es el titular del Beneficio 03.
- **PayPal MX — falta prueba real (2026-08-18)**: el fix del 404 y del resumen está
  implementado pero NUNCA se ha completado una compra real por PayPal de punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve
  `res.order.shipping_address`. Si no, `/gracias` muestra "Envío a domicilio + detalles por correo".
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- **`lov-search-files` devuelve resultados vacíos / índice desactualizado (2026-08-18, confirmado
  2026-08-20)** — usar `lov-view` directo. Reportado.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/gracias`, `/gracias/:orderId`, `/repartidores`)
- `src/components/PaypalExpressButton.tsx` — PayPal Express (✅ arreglado 2026-08-18)
- `src/components/StripePayment.tsx` — pago con tarjeta/OXXO (referencia de flujo correcto)
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/ui/CheckoutUI.tsx` — checkout; PayPal en L263, Stripe en L273
- `src/adapters/CheckoutAdapter.tsx` — `orderItems` (product_title, price en pesos)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **control del test**
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y validar recortes.
- **[ALTA]** Confirmar con el cliente el texto quemado en la imagen del Beneficio 01.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token` (como `OrderTrack`).
- **[MEDIA]** Avatares propios de repartidores para las reseñas.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.