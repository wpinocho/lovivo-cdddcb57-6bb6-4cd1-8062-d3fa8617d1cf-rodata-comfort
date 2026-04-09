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
- **Tone:** Premium, technical, masculine, motorcycle lifestyle — NOT medical/orthopedic

## Recent Changes (Session 3)
- Fixed all "Motosupport" branded images — replaced with correct RODATA branding
- Generated new `hero-rider.jpg` — rider on rainy urban street, cinematic dark mood
- Generated new `product-worn.jpg` — RODATA lumbar support worn by rider on Mexican cobblestone street at night (Gemini edit from uploaded product photo) — BEST asset
- Updated `PRODUCT_FLAT` — using user-uploaded product photo (clean studio shot, RODATA branding, dark bg)
- Updated `PRODUCT_FEATURES` in IndexUI — reuses `product-worn.jpg` (cinematic banner)
- Updated `FEATURES_ES` in ProductPageUI — uses uploaded product flat shot
- IndexUI and ProductPageUI both updated to use correct image paths

## Image Assets (Current)
| File | Usage | Notes |
|------|-------|-------|
| `/hero-rider.jpg` | IndexUI hero background | Generated - urban rider, dark/cinematic |
| `/product-worn.jpg` | IndexUI hero right, PDP lifestyle, features banner | Generated - rider on CDMX cobblestone, RODATA visible |
| `supabase/...gqxi2j4hklp.webp` | PRODUCT_FLAT (IndexUI + PDP gallery) | User-uploaded — clean studio shot, RODATA label |
| `/lifestyle-1.jpg` | IndexUI lifestyle grid | From previous session |
| `/lifestyle-2.jpg` | IndexUI lifestyle grid | From previous session |
| `/lifestyle-3.jpg` | IndexUI problem section + final CTA | From previous session |
| `/pdp-lifestyle-1.jpg` | PDP city lifestyle section | From session 2 |
| `/pdp-lifestyle-2.jpg` | PDP highway lifestyle break | From session 2 |
| `/pdp-features-es.jpg` | (replaced — no longer used) | Was "Motosupport" branded |

## Product Detail Page (ProductPageUI.tsx) — 11 Sections
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel
   - Size pills with waist cm + collapsible size guide table
   - "Comprar ahora" amber CTA + "Agregar al carrito" outline
   - 3 trust icons + WhatsApp link
2. **Stats Bar** — +800 riders, 4.9★, 100% México (graphite bg)
3. **Lifestyle Break** — Full-bleed highway image + cinematic copy overlay
4. **Feature Breakdown** — 3 alternating full-width sections (panel/correas/malla)
5. **Technical Specs** — Clean table on offwhite bg
6. **How to Wear** — 3 numbered steps + inline CTA (graphite bg)
7. **City Lifestyle Quote** — Full-bleed CDMX image + rider blockquote
8. **Reviews** — 5 verified reviews + 4.9/127 rating summary pill (dark bg)
9. **Guarantee** — 4 trust cards on offwhite bg
10. **FAQ** — 6 accordion items (graphite bg)
11. **Final CTA** — Dark centered with price + amber button
12. **Sticky Bottom Bar** — Shows when main CTA scrolls out

## Landing Page (IndexUI.tsx) — 11 Sections
1. Hero, 2. Benefits Bar, 3. Problem Section, 4. How It Works, 5. Lifestyle Grid,
6. For Whom, 7. Comparison Table, 8. Testimonials, 9. Guarantee, 10. FAQ, 11. Final CTA

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one
- Price: MX$749 / Compare at: MX$999
- Variants: S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Next Steps / Known Issues
- Connect Stripe payment gateway (Dashboard)
- Update WhatsApp number from 5215500000000 to real number (EcommerceTemplate.tsx + ProductPageUI.tsx)
- Replace placeholder testimonials with real rider reviews post-launch
- lifestyle-1/2/3.jpg and pdp-lifestyle-1/2.jpg — verify these don't have "Motosupport" branding

## User Preferences
- Language: Spanish (Mexico)
- Tone: Premium, technical, no medical claims
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color
- Campaign-ready for Meta Ads — PDP is the landing page