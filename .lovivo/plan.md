# Store Plan — rodata.mx
(Auto-updated by Lovivo AI)

## Current State
rodata.mx is a DTC store selling a single product: **Soporte Lumbar Rodata One** (MX$749, compare at MX$999).
Full premium landing page + premium product detail page are built. The store targets male motorcyclists 25-45 in Mexico. Ready to launch Meta Ads campaigns.

## Brand Identity
- **Name:** rodata.mx
- **Tagline:** Rueda más. Llega mejor.
- **Colors:** Carbon #111315, Graphite #1D2125, Steel #5E6670, Smoke #C7CDD3, Offwhite #F5F7F8, Amber #C98B2E
- **Fonts:** Sora (headings) + Inter (body)
- **Tone:** Premium, technical, masculine, motorcycle lifestyle — NOT medical/orthopedic. Benefit-first, not material/spec-first.

## Recent Changes (Session 14) — IMPLEMENTED ✅

### ProductPageUI.tsx — All changes applied:

1. **Short description:** "El soporte confiado por los motociclistas mexicanos diseñado para eliminar el dolor de espalda."
2. **Removed ALL em dashes "—"** across the entire file:
   - Feature 01: `durante horas —` → `durante horas,`
   - Feature 02: `faja de gimnasio —` → `faja de gimnasio,`
   - Feature 03: `transpirable — construcción` → `transpirable: construcción`
   - Bullets: `Flexible — se mueve` → `Flexible: se mueve`, `Ajuste en segundos — y` → `Ajuste en segundos y`
   - Lifestyle Break: `no avisa — simplemente` → `no avisa. Simplemente`
   - City quote: `— Carlos M., CDMX` → `Carlos M., CDMX`
   - Size selector: `— {waist}` → `· {waist}`
   - CTA button: `Comprar ahora — precio` → `Comprar ahora · precio`
3. **Removed "En tres pasos" section** (was section 6, before City Lifestyle)
4. **Removed standalone Guarantee section** (was section 9, after Reviews)
5. **Added combined "Steps + Trust" section** after Reviews (before FAQ):
   - Background: `#1D2125`
   - Eyebrow: "Simple de usar · Compra sin riesgo"
   - H2: "Listo en segundos. Sin riesgo."
   - 3 compact steps (smaller h-10 w-10 amber circles, centered)
   - Divider
   - 4 dark trust badge cards (horizontal layout, icon left + text right)

### New section order in ProductPageUI.tsx:
1. Main Product
2. Stats Bar
3. Lifestyle Break
4. Features
5. City Lifestyle Quote
6. Reviews
7. **Combined: Steps + Trust** ← NEW
8. FAQ
9. Final CTA
10. Sticky Bar

## Previous Changes (Session 13) — IMPLEMENTED ✅
- Eyebrow: "Diseñado para la postura de manejo"
- Features: bold keywords with `<strong>` nodes across all 3 features
- Specs section: DELETED

## Previous Changes (Session 12) — IMPLEMENTED ✅
- Features copy: benefit-focused (pain relief, ride longer, comfort)
- Feature images: real user product photos
- Product panel: pain-problem focused copy
- Lifestyle Break: "Deja de bajar a estirar. Empieza a llegar mejor."
- Final CTA: "¿Cuántas rodadas más vas a terminar con dolor de espalda?"

## Image Assets (Current)
| File | Usage | Notes |
|------|-------|-------|
| `supabase/...16g7elmcuii.webp` | IndexUI hero background | rider de espaldas + moto + carretera dorada, RODATA visible |
| `/product-worn.jpg` | PDP gallery, features | Generated - rider on CDMX cobblestone, RODATA visible |
| `supabase/...gqxi2j4hklp.webp` | PRODUCT_FLAT in IndexUI + PDP gallery (FEATURES_ES) | User-uploaded — clean studio shot, RODATA label |
| `supabase/...uca4dkx21g.webp` | PDP "Lifestyle Break" (LIFESTYLE_HIGHWAY) | USER REAL PHOTO — rider de espaldas, carretera serpenteante |
| `supabase/...1nufsuab1jt.webp` | IndexUI "El problema real" | USER UPLOAD — rider en moto con glow lumbar ámbar |
| `supabase/...676o65sijn4.webp` | IndexUI "Parte del equipo" — col-span-2 top | rider usando RODATA de espaldas |
| `supabase/...tl8qt6nmo8.webp` | IndexUI "Parte del equipo" — bottom left | cinturón RODATA solo, fondo oscuro premium |
| `supabase/...z730si7cdto.webp` | IndexUI "Parte del equipo" — bottom right | macro detalle correas y malla |
| `/lifestyle-3.jpg` | IndexUI final CTA background | Mexican mountain road, sunset |
| `/pdp-lifestyle-1.jpg` | PDP "Ahora el Rodata One sale conmigo..." quote section | REGENERATED — rider en CDMX |
| `supabase/...80hvv9dmxa.webp` | PDP Feature 01 (FEAT_IMG_1) | Studio shot — back view man wearing RODATA support, grey bg |
| `supabase/...xhxki05535d.webp` | PDP Feature 02 (FEAT_IMG_2) | Rider on motorcycle at sunset, RODATA visible |
| `supabase/...dzkdrl1lt2.webp` | PDP Feature 03 (FEAT_IMG_3) | Macro close-up correas y malla panel RODATA |
| `product-images/.../review-1.webp` through `review-5.webp` | Review cards in both pages | Product-images bucket (public access) |

## Product Detail Page (ProductPageUI.tsx) — Final Section Order
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel
2. **Stats Bar** — +800 riders, 4.9★, 100% México
3. **Lifestyle Break** — Full-bleed highway image
4. **Feature Breakdown** — 3 alternating full-width sections
5. **City Lifestyle Quote** — Full-bleed CDMX image + rider blockquote
6. **Reviews** — 5 cards with real customer photos
7. **Combined: Steps + Trust** — Compact 3 steps + 4 guarantee cards, dark bg
8. **FAQ** — 6 accordion items
9. **Final CTA**
10. **Sticky Bottom Bar**

## Landing Page (IndexUI.tsx) — 11 Sections
1. Hero (user photo + light overlay), 2. Benefits Bar, 3. Problem Section, 4. How It Works,
5. Lifestyle Grid ("Parte del equipo"), 6. For Whom, 7. Comparison Table,
8. **Testimonials** — 3 cards with real customer photos (aspect 4/3) + verified badge,
9. Guarantee, 10. FAQ, 11. Final CTA

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one
- Price: MX$749 / Compare at: MX$999
- Variants: S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Next Steps / Known Issues
- Connect Stripe payment gateway (Dashboard)
- Update WhatsApp number from 5215500000000 to real number (EcommerceTemplate.tsx + ProductPageUI.tsx)
- Replace placeholder testimonials text with real rider reviews post-launch
- `/lifestyle-3.jpg` — verify if it has wrong branding
- **IMPORTANT:** Always save user images to `product-images` bucket (via image--optimize), NOT `message-images`. The `message-images` bucket has access restrictions.

## User Preferences
- Language: Spanish (Mexico)
- Tone: Premium, technical, no medical claims. BENEFIT-FIRST not material/spec-first.
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color
- Campaign-ready for Meta Ads — PDP is the landing page