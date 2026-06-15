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
- Imágenes Supabase: usar `render/image/public` path + `?width=xxx&quality=75`
- **Avatar rule**: Para círculos de 36px (w-9 h-9), usar Supabase `?width=72&height=72&resize=cover&quality=80` → la imagen llega ya cuadrada y centrada al browser → `object-cover` funciona perfecto sin zoom.

## Active Plan
**PENDIENTE 🔧 — Avatar fix + Trust bar 2 mensajes**

### Cambio 1: Avatares reales en social proof pill
**Archivo:** `src/pages/ui/ProductPageUI.tsx`

**El problema:** Las imágenes de avatar en Supabase son rectangulares. Al meterlas en un círculo con `object-cover`, el browser hace zoom para llenar el círculo y la cara queda mal cortada. La solución es usar el transform de Supabase: `?width=72&height=72&resize=cover` que hace el crop server-side a un cuadrado perfecto antes de que llegue al browser.

**Implementación:**
1. Agregar constantes de avatar al top del archivo (después de SUPABASE_PROD):
```ts
const SUPABASE_PROD = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf'

const AVATAR_CARLOS = `${SUPABASE_PROD}/avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_JORGE  = `${SUPABASE_PROD}/avatar-jorge-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_ANDRES = `${SUPABASE_PROD}/avatar-andres-v3.webp?width=72&height=72&resize=cover&quality=80`
```

2. En la sección "Social proof block" (~línea 422), reemplazar los círculos de iniciales CSS por `<img>` tags:
```tsx
{/* Social proof block */}
<div className="flex items-center gap-3 bg-brand-graphite border border-white/[0.08] rounded-xl px-4 py-3">
  <div className="flex -space-x-2 flex-shrink-0">
    {[AVATAR_CARLOS, AVATAR_JORGE, AVATAR_ANDRES].map((src, i) => (
      <div key={i} className="h-9 w-9 rounded-full overflow-hidden border-2 border-brand-graphite flex-shrink-0" style={{ zIndex: 3 - i }}>
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
  <p className="text-brand-smoke text-xs font-inter">
    <span className="text-brand-offwhite font-semibold">Carlos M. ✓</span>{' '}
    y{' '}
    <span className="text-brand-offwhite font-semibold">+800 riders</span> ya lo usan a diario
  </p>
</div>
```

**Nota crítica:** Si los avatares v3 no están en product-images (puede ser que estén en message-images), buscar en el bucket de Supabase. Si no existen, regenerar 3 headshots en Craft Mode usando imagegen con:
- Instrucción: hombre mexicano motociclista, headshot centrado, cara ocupa 70% del frame, fondo neutro oscuro, estilo foto real —SIN texto, SIN logo
- Guardar como: avatar-carlos-v3.webp, avatar-jorge-v3.webp, avatar-andres-v3.webp

### Cambio 2: Trust bar con DOS mensajes visibles (incluso en móvil)
**Archivo:** `src/templates/EcommerceTemplate.tsx`

**El problema actual:** Solo se muestra un mensaje en móvil ("+800 riders ya lo usan a diario"). El usuario quiere 2 mensajes como el repo US: "Free US Shipping | +1,000 Happy Riders".

**Mensajes MX:**
- Izquierda: 🚚 Envío gratis a México
- Separador: |
- Derecha: ♥ +800 riders felices

**Implementación** — Reemplazar el trust bar completo (~líneas 62-77):
```tsx
{/* Trust Bar */}
<div className="bg-brand-graphite border-b border-white/[0.06] py-2 px-4">
  <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-8">
    <div className="flex items-center gap-1.5 text-brand-smoke text-xs font-medium">
      <Truck size={11} className="text-brand-amber shrink-0" />
      <span>Envío gratis a México</span>
    </div>
    <div className="w-px h-3 bg-white/20 flex-shrink-0" />
    <div className="flex items-center gap-1.5 text-brand-smoke text-xs font-medium">
      <span className="text-brand-amber text-[11px]">♥</span>
      <span><span className="text-brand-offwhite font-semibold">+800 riders</span> felices</span>
    </div>
  </div>
</div>
```

Eliminar el tercero "30 días de prueba" del trust bar (está dentro del accordion de Envío y Devoluciones en el PDP).

## Recent Changes
- **Trust bar: 2 mensajes en móvil** — "Envío gratis a México" | "+800 riders felices" (pendiente Craft Mode) (2026-06-15)
- **Avatar fix: resize=cover server-side** — usar `?width=72&height=72&resize=cover` en Supabase para crop cuadrado antes de llegar al browser (pendiente Craft Mode) (2026-06-15)
- **Trust bar: "+800 riders ya lo usan a diario"** — ahora visible en móvil (reemplazó "30 días de prueba" visible; "30 días" movido a desktop-only slot) (2026-06-15) ✅
- **Social proof pill: avatares → círculos de iniciales** — C (amber), J (blue), A (green). Elimina el problema de imágenes mal cortadas a 36px (2026-06-15) ✅
- **Social proof pill: "+1,000" → "+800 riders"** — número consistente con nuestro stat real (2026-06-15) ✅
- **Avatares v3: regenerados con cara centrada al 55% del frame** — avatar-carlos-v3.webp, avatar-jorge-v3.webp, avatar-andres-v3.webp (2026-06-15) ✅ (DEPRECATED - pendiente reversión con fix resize=cover)
- **Copy fix: "aman" → "ya lo usan a diario"** — más natural en MX (2026-06-15) ✅
- **Fecha entrega: 3 → 4 días hábiles** + texto ahora dice "En 4 días hábiles · llega el {fecha}" (2026-06-15) ✅
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** (2026-06-15) ✅ COMPLETADO
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) — DB + IndexUI.tsx ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: `product-images/.../avatar-carlos-v3.webp` + `?width=72&height=72&resize=cover&quality=80` (pendiente verificar que existen en Supabase)

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)
- Discount badge en producto: ya está en código MX (top-4 left-4 inside image), verificar que compare_at esté seteado en DB para que aparezca
- Avatares: si `avatar-carlos-v3.webp` no existe en `product-images` bucket, buscar en `message-images` o regenerar con imagegen en Craft Mode

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.4 (pendiente avatar fix)
- `src/templates/EcommerceTemplate.tsx` — pendiente trust bar 2 mensajes
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅
- `src/components/StripePayment.tsx` — payment form ✅
- `src/lib/stripe-appearance.ts` — ✅
- `src/components/ProductExpressCheckout.tsx` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- Verificar que compare_at price esté en DB para que el badge "-20%" aparezca en producto
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after PDP v4 deploy