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

## Recent Changes (Session 16) — IMPLEMENTED ✅

### EcommerceTemplate.tsx — navLinks prop fixed:
- Extracted `DEFAULT_NAV_LINKS` as a module-level constant (homepage links)
- Removed the hardcoded `navLinks` const inside the component (was overriding the prop)
- Added `NavLink` interface and `navLinks?: NavLink[]` prop to `EcommerceTemplateProps`
- Component now uses `resolvedNavLinks = navLinks ?? DEFAULT_NAV_LINKS` for both desktop and mobile nav
- Both desktop nav and mobile dropdown use `resolvedNavLinks`

### WhatsApp number updated:
- All instances now use `525531215386`

### ProductPageUI.tsx — passes PDP-specific navLinks:
- `Por qué funciona → #por-que-funciona`
- `Opiniones → #opiniones`
- `FAQ → #faq`
- These are hash-only anchors so they scroll within the PDP without redirecting to homepage

## Previous Changes (Session 14-15) — IMPLEMENTED ✅

### Section order in ProductPageUI.tsx:
1. Main Product
2. Stats Bar
3. Lifestyle Break
4. Features (id="por-que-funciona")
5. City Lifestyle Quote
6. Reviews (id="opiniones")
7. Combined: Steps + Trust
8. FAQ (id="faq")
9. Final CTA
10. Sticky Bar

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

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one
- Price: MX$749 / Compare at: MX$999
- Variants: S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Next Steps / Known Issues
- Connect Stripe payment gateway (Dashboard)
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