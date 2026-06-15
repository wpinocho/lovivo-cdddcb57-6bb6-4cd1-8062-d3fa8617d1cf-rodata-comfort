# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar para motociclistas
- Precio: MX$799 (compare_at: MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- Audiencia: motociclistas MX que hacen trayectos medios/largos y sufren dolor lumbar
- Store en producción: rodata.store

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes con Supabase transform: `?width=800&quality=75`

## Active Plan
**OBJETIVO: Sincronizar mejoras del repo US → repo MX (ProductPageUI.tsx)**

### Diferencias identificadas (US optimizado vs MX actual):

#### 🔴 BUGS / UX CRÍTICOS
1. **Sticky bar aparece en page load (BUG)**
   - MX usa `react-intersection-observer` `useInView` → el sticky bar se muestra apenas carga la página porque `ctaInView=false` inicialmente
   - US usa `useRef` + `IntersectionObserver` nativo con flag `hasCTABeenVisible` → solo muestra el sticky DESPUÉS de que el CTA fue visible al menos una vez
   - Fix: reemplazar `useInView` por el patrón del repo US con `hasCTABeenVisible = useRef(false)` + `useEffect` con observer manual

2. **`getSizeKey` faltante (BUG potencial)**
   - MX usa `value` directo para buscar en SIZE_GUIDE → si el variant value tiene formato "S (60-75 cm)" en vez de "S", la guía no matchea
   - US tiene `getSizeKey` que extrae solo la letra: `value.includes('(') ? value.split('(')[0].trim() : value`
   - Fix: agregar `getSizeKey` y aplicarla en los 3 lugares donde se usa (display en botón, waist en botón, lookup de SIZE_GUIDE)

#### 🟡 MEJORAS DE CONVERSIÓN (nuevas secciones/elementos)
3. **Badge "Oferta de Lanzamiento"** — falta en MX
   - En US: inline-flex badge ámbar debajo del precio con "🏷 Oferta de Lanzamiento · Envío gratis incluido"
   - MX: no tiene este badge → agregar traducido

4. **Bloque de prueba social "riders verificados"** — falta en MX
   - En US: bloque graphite con 3 avatares superpuestos + "Jason R. ✓ y +1,000 riders aman el Rodata One"
   - MX: no tiene este bloque → agregar con nombres mexicanos (Carlos M., Jorge R., Andrés V.) y texto en español

5. **Acordeón "Envío y Devoluciones"** — falta en MX
   - En US: acordeón expandible debajo del trust row con detalles de envío, fecha estimada dinámica, política de cambio
   - MX: solo tiene link de WhatsApp → agregar acordeón (mantener también el WhatsApp link)

#### 🟢 MEJORAS DE PERFORMANCE
6. **Image optimization params en URLs remotas**
   - MX usa URLs crudas sin params: `supabase.co/.../image.webp`
   - US usa: `supabase.co/.../image.webp?width=1200&quality=75` (hero), `?width=800&quality=75` (features), `?width=600&quality=75` (reviews)
   - Fix: agregar params a LIFESTYLE_HIGHWAY, FEATURES_ES, PRODUCT_FLAT, FEAT_IMG_1-3, REVIEW_IMG_1-5
   - NOTA: usar `render/image` en vez de `object/public` en el path para que funcionen los transforms

7. **`fetchPriority` en imágenes móvil**
   - MX: gallery móvil usa `<Carousel>` (embla) — sin `fetchPriority`
   - US: usa scroll horizontal nativo con `fetchPriority="high"` en primera imagen, `"auto"` en el resto
   - Fix: cambiar gallery móvil de `<Carousel>` a scroll-snap nativo + agregar fetchPriority/loading attrs correctos

8. **Quitar `react-intersection-observer`**
   - MX: importa `useInView` de `react-intersection-observer`
   - US: usa solo IntersectionObserver nativo (ya disponible en todos los browsers)
   - Fix: remover import y usar el patrón con useRef del repo US (ya cubierto en punto 1)

#### ⚪ PEQUEÑOS AJUSTES DE COPY/UX
9. **Quitar el botón "Volver"**
   - MX: tiene `<button onClick={logic.handleNavigateBack}>← Volver</button>` y `pt-6`
   - US: no tiene botón de volver, usa `pt-3` más ajustado
   - Fix: remover el botón Volver (la nav del header ya sirve para eso) y ajustar padding a pt-3

10. **FAQ respuesta de cambio de talla → mencionar WhatsApp**
    - MX: ya lo menciona ✅ (mantener)

### Orden de implementación recomendado:
1. Fix sticky bar (bug crítico — punto 1)
2. getSizeKey (bug potencial — punto 2)
3. Image optimization URLs (punto 6)
4. Mobile gallery → scroll nativo (punto 7, junto al punto 1 por el import de useInView)
5. Badge oferta de lanzamiento (punto 3)
6. Bloque social proof riders (punto 4)
7. Acordeón envío/devoluciones (punto 5)
8. Quitar botón Volver (punto 9)

### Archivos a modificar:
- `src/pages/ui/ProductPageUI.tsx` — todos los cambios arriba

## Recent Changes
- **PDP MX vs US diff analizado** — 8 mejoras identificadas (2 bugs, 3 conversión, 3 performance) (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) — DB + IndexUI.tsx (4 ocurrencias) ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **BUG FIX: /gracias mostraba "Recoger en Tienda" — RESUELTO ✅**
- **Migración Express Checkout — Pasos 1-5 COMPLETADOS ✅**
- **Stripe Elements dark theme — RESUELTO ✅** (`src/lib/stripe-appearance.ts` + `StripePayment.tsx`)
- **ExpressCheckoutElement: paymentMethodOrder + maxRows + buttonHeight ✅**
- **BUG FIX: validateCheckoutFields bloqueaba pago con AddressElement — RESUELTO ✅**
- **trackPurchase en Express Checkout handler — RESUELTO ✅**
- **BUG FIX: isValidPhone rechazaba E.164 sin espacio (+525531245632) — RESUELTO ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `supabase.co/.../1775768374485-uca4dkx21g.webp` (agregar ?width=1200&quality=75)
- FEAT_IMG_1-3: `supabase.co/.../1775777133671/72-*.webp` (agregar ?width=800&quality=75)
- REVIEW_IMG_1-5: `supabase.co/product-images/.../review-1-5.webp` (agregar ?width=600&quality=75)
- Avatares para social proof block: `/avatar-j.webp`, `/avatar-m.webp`, `/avatar-r.webp` (mismas que US)

## Known Issues
- Sticky bar MX aparece en page load (BUG — fix en el plan activo)
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ (pendiente sync con US)
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/lib/stripe-appearance.ts` — ✅
- `src/components/ProductExpressCheckout.tsx` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- **ALTA PRIORIDAD: Sync PDP MX con mejoras del repo US** — ver Active Plan arriba
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content