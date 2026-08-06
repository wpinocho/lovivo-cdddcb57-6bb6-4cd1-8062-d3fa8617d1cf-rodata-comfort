# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1 (actual, toda la PDP)**: rider de carretera/fin de semana. Dolor = incomodidad, disfrute del viaje.
- **Avatar 2 (NUEVO, validado en ads 2026-08-06)**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats). Está convirtiendo MUY bien en Meta aun mandándolo a la PDP de carretera. Dolor = económico + laboral (8–12 hrs sobre la moto, dolor que le corta la jornada = menos entregas = menos dinero).
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`

---

## Active Plan — LANDING DEDICADA PARA AVATAR "REPARTIDOR" 🚧 (2026-08-06)

### Decisión estratégica (razonada, no ejecutar A/B clásico)
**SÍ construir una segunda landing.** Razones:
1. **Message-match gap enorme.** El ad promete "para repartidores"; la landing dice carretera, "rodada", "bajo tu chamarra de moto", reviews de trayectos CDMX–Querétaro. Un repartidor no tiene chamarra de piel ni hace carretera. Si YA convierte con ese gap, cerrarlo es el upside más barato disponible.
2. **Ángulo económico > ángulo comodidad.** Para el repartidor el dolor no es incomodidad: es que le corta la jornada → menos entregas → menos dinero. Ese pitch es de ROI, y es MUCHO más fuerte. La PDP actual no lo dice en ningún lado.
3. **Riesgo cero.** La PDP actual NO se toca. Solo el ad set del avatar repartidor apunta a la URL nueva.
4. **Desbloquea escala.** Mercado de repartidores en MX es enorme y permite escalar creativos de ese ángulo con landing propia.
5. **Costo bajo**: ~80% reutilizable de la PDP existente.

### Sobre A/B testing — NO hacer split 50/50
El usuario tiene razón: no hay volumen. En vez de eso: **"campaign-level swap con benchmark antes/después"**.
- Antes de lanzar: anotar CR actual del ad set repartidor sobre la PDP vieja (últimos 14–21 días, desde Meta Ads Manager).
- Lanzar: apuntar SOLO ese ad set a la URL nueva. Mismo creativo, mismo presupuesto, misma oferta.
- Ventana de lectura: ~2–3 semanas o ~300–400 clics / ~20–25 compras.
- **Regla de decisión**: si el CR NO cae de forma clara (>20–25% relativo), **quedarse con la landing nueva** aunque el lift no sea estadísticamente probado. La asimetría favorece construirla (upside grande, downside reversible en 1 min cambiando la URL del ad).
- Etiquetar tráfico: UTM `?utm_source=meta&utm_campaign=repartidores` + property PostHog `landing_variant: 'repartidores'`.

### Decisión técnica — NO duplicar el producto en el Dashboard
**Descartado**: crear un producto clon solo para tener otras imágenes. Motivos: parte el inventario en dos stocks (riesgo de sobreventa), parte órdenes/analytics/reviews, dos precios que mantener sincronizados, contenido duplicado en SEO, confusión en catálogo de Meta.

**Elegido**: **mismo producto, nueva URL, imágenes y copy a nivel de página.**
Hallazgo clave del código: `ProductPageUI.tsx` ya tiene TODA la imagería lifestyle/features/reviews hardcodeada como constantes al inicio del archivo (`LIFESTYLE_*`, `FEAT_IMG_1-3`, `REVIEW_IMG_1-5`, `AVATAR_*`). Solo la galería principal viene de `logic.displayImages` (producto del Dashboard) — y esa se puede **sobreescribir a nivel de página** pasando un array propio.

### Arquitectura a implementar

**1. Hacer el slug inyectable (cambio mínimo, retrocompatible)**
- `src/components/headless/HeadlessProduct.tsx`:
  - `useProductLogic(slugOverride?: string)` → `const { slug: paramSlug } = useParams(); const slug = slugOverride ?? paramSlug`
  - `HeadlessProduct` acepta prop opcional `slug?: string` y la pasa a `useProductLogic`.
  - NO cambiar nada más — `/productos/:slug` sigue funcionando idéntico.

**2. Nueva ruta**
- `src/App.tsx`: `<Route path="/repartidores" element={<DeliveryLanding />} />` (lazy import).
- URL final: `rodata.store/repartidores`

**3. Nueva página**
- `src/pages/DeliveryLanding.tsx`:
  ```
  <HeadlessProduct slug="soporte-lumbar-rodata-one">
    {(logic) => <DeliveryLandingUI logic={logic} />}
  </HeadlessProduct>
  ```
  (confirmar el slug exacto del producto con `ecommerce--list-data` antes de escribirlo)

**4. Nueva UI — `src/pages/ui/DeliveryLandingUI.tsx`**
Fork de `ProductPageUI.tsx` (v4.7) conservando estructura, layout, sticky bar, size guide, express checkout, tracking. Cambia SOLO contenido:
- **Constantes de imagen nuevas** al inicio (`DLV_HERO`, `DLV_FEAT_1-3`, `DLV_REVIEW_1-5`, `DLV_AVATAR_1-3`).
- **Galería**: usar array propio `DELIVERY_GALLERY` en vez de `logic.displayImages`. Precio, variantes, stock y carrito siguen viniendo de `logic` (mismo producto).
- **Nav reducido** (buena práctica para tráfico pagado): header con logo + CTA únicamente, sin links "Por qué funciona / Opiniones / FAQ" que sacan al usuario del flujo. Evaluar variante de `EcommerceTemplate` con prop `minimal`.
- Mantener: guía de tallas, envío gratis, garantía, sticky bar, FAQ (con FAQs nuevas).

**5. SEO — evitar contenido duplicado**
- `<meta name="robots" content="noindex, follow">` en `/repartidores` (es landing de ads, no de orgánico).
- `<link rel="canonical">` → PDP principal.
- Cargar skill `workflow.seo` antes de tocar head.

**6. Imágenes a generar (Craft Mode, `imagegen--generate_image` con `reference_images` del producto real)**
Necesarias, estilo consistente con la marca (dark, urbano, sin logos de plataformas reales por temas de marca):
- HERO: repartidor en moto/scooter en tráfico de ciudad, con mochila térmica genérica, se le ve el soporte bajo la sudadera.
- FEAT 1: espalda del repartidor bajando de la moto, gesto de alivio / jornada larga.
- FEAT 2: detalle del ajuste rápido de correas (contexto: entre entregas, sin perder tiempo).
- FEAT 3: soporte bajo sudadera/chaleco de repartidor, perfil bajo, transpirable (calor de ciudad).
- 3–5 REVIEW photos + 3 AVATARS de repartidores mexicanos reales-looking.
- Cargar skill `media.product-imagery` antes de generar.

**7. Copy — ejes del ángulo repartidor** (cargar skill `craft.copywriting` antes)
- Headline candidato: *"Termina tu turno sin que la espalda te tumbe el día siguiente."*
- Eyebrow: "DISEÑADO PARA JORNADAS DE 8 A 12 HORAS SOBRE LA MOTO"
- Ángulo económico explícito: el dolor te hace parar, parar = menos entregas = menos dinero. El soporte se paga solo en X entregas.
- Diferenciación clave (ya en la estrategia de la marca): postura de manejo ≠ faja de oficina/gym. Aquí sumar: ≠ faja rígida que no te deja subir/bajar de la moto 60 veces al día.
- Reviews reescritas: repartidores por ciudad (CDMX, Edomex, GDL, MTY), lenguaje de plataforma ("turnos", "pedidos", "horas conectado").
- FAQs extra: ¿aguanta subir y bajar todo el día?, ¿da calor en jornada larga?, ¿estorba con la mochila térmica?, ¿sirve en scooter y en moto?
- **CTA**: mismo precio y oferta ($799, envío gratis). No crear oferta distinta — complicaría el análisis.

### BLOQUEADOR ACTUAL
⚠️ Falta que el usuario **suba los creativos de los anuncios que están funcionando** para extraer los pain points exactos y el lenguaje que ya está validado. El copy final de la landing debe espejar esos anuncios (message match literal: mismo headline/promesa que ve en el ad). NO escribir el copy final antes de verlos.

### Orden de ejecución sugerido (Craft Mode)
1. Confirmar slug real del producto (`ecommerce--list-data`).
2. Analizar creativos de ads subidos por el usuario → extraer 3 pain points + promesa principal.
3. Cargar skills: `pages.pdp`, `craft.copywriting`, `media.product-imagery`.
4. Slug inyectable en `HeadlessProduct` + ruta + página contenedora.
5. Generar imágenes.
6. Escribir `DeliveryLandingUI.tsx` con copy nuevo.
7. SEO noindex + canonical.
8. Screenshot-preview de `/repartidores` en mobile y desktop (el tráfico de repartidores es ~95% mobile → **diseñar mobile-first**).

---

## Recent Changes
- **Decisión: landing dedicada `/repartidores` para avatar repartidor de plataformas** 📋 (2026-08-06) — plan definido; NO duplicar producto en Dashboard; mismo producto + URL nueva + imágenes/copy a nivel de página; sin A/B split (swap por campaña con benchmark antes/después). Pendiente: creativos de ads del usuario.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — confirmado que el storefront NO manda nada directo a graph.facebook.com; solo pixel browser + edge function `meta-capi` con `event_id = purchase_<order_id>` + guard `purchase_tracked_<order_id>` en sessionStorage. La duplicación (75 enviados vs 141 recibidos) ocurre fuera de este repo.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23) — falta prueba real de checkout.
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅

## Image Inventory
### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- PRODUCT_FLAT: `message-images/.../1775767354281-gqxi2j4hklp.webp?width=800&quality=75` ✅
- FEAT_IMG_1-3: `message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_CARLOS/JORGE/ANDRES: `product-images/.../avatar-*-v3.webp?width=72&height=72&resize=cover&quality=80` ✅
### Landing repartidores (avatar 2) — POR GENERAR
- DLV_HERO, DLV_FEAT_1-3, DLV_REVIEW_1-5, DLV_AVATAR_1-3 → pendientes (ver Active Plan §6)

## Known Issues
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada en checkout real. Verificar: botón aparece encima de Stripe; pago redirige a `/gracias/{id}`; Purchase no se duplica; edge functions `paypal-create-order`/`paypal-capture-order` desplegadas para el store MX.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados por Lovivo vs 141 que Meta reporta recibidos. NO viene del storefront. Revisar CAPI Gateway / integraciones offline en Business Manager + reportar a equipo Lovivo.
- **Order Tracking — view orders_customer**: CTA "Rastrear pedido" + entrega estimada dependen de que la VIEW `orders_customer` exponga checkout_token/tracking_number/tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (agregar `/repartidores`)
- `src/components/headless/HeadlessProduct.tsx` — lógica producto; hacer `slug` inyectable
- `src/pages/Product.tsx` — conecta Headless + UI (patrón a copiar)
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 (base del fork) — NO TOCAR
- `src/pages/ui/DeliveryLandingUI.tsx` — POR CREAR (landing repartidores)
- `src/templates/EcommerceTemplate.tsx` — nav/trust bar/WhatsApp; evaluar prop `minimal`
- `src/contexts/SettingsContext.tsx` — settings + RPC paypal
- `src/pages/ui/CheckoutUI.tsx` — checkout con PaypalExpressButton
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` — design system

## PENDING / Future Sessions
- **[ALTA] Landing `/repartidores`** — bloqueada esperando creativos de ads del usuario.
- **[ALTA] PayPal**: probar checkout real en producción.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[MEDIA]** Verificar response real de order-track con token de producción.
- **[BAJA]** "También les encantó" upsell en cart/checkout.
- **[BAJA]** Post-purchase email sequence (Dashboard).