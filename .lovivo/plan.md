# Store Plan — rodata.mx
(Auto-updated by Lovivo AI)

## Current State
rodata.mx is a DTC store selling a single product: **Soporte Lumbar Rodata One** (MX$749, compare at MX$999).
A full premium landing page has been built. The store targets male motorcyclists 25-45 in Mexico.

## Brand Identity
- **Name:** rodata.mx
- **Tagline:** Rueda más. Llega mejor.
- **Colors:** Carbon #111315, Graphite #1D2125, Steel #5E6670, Smoke #C7CDD3, Offwhite #F5F7F8, Amber #C98B2E
- **Fonts:** Sora (headings) + Inter (body)
- **Tone:** Premium, technical, masculine, motorcycle lifestyle — NOT medical/orthopedic

## Recent Changes (Session 1)
- Updated design system: `src/index.css` — full rodata.mx brand tokens (HSL + CSS utilities)
- Updated `tailwind.config.ts` — brand-* color namespace, Sora font
- Updated `index.html` — Sora font loaded, rodata.mx SEO meta tags
- Rebuilt `src/components/BrandLogoLeft.tsx` — text logo "rodata.mx" with amber .mx
- Updated `src/templates/PageTemplate.tsx` — added noPadding prop
- Rebuilt `src/templates/EcommerceTemplate.tsx` — dark premium header (trust bar + nav), rodata.mx footer
- Rebuilt `src/pages/ui/IndexUI.tsx` — full 11-section landing page (hero, benefits, problem, how it works, lifestyle, for whom, comparison table, testimonials, guarantee, FAQ, final CTA)
- Created product: **Soporte Lumbar Rodata One** with S/M/L/XL variants at MX$749
- Generated images: /hero-rider.jpg, /lifestyle-1.jpg, /lifestyle-2.jpg, /lifestyle-3.jpg
- User product images stored at Supabase URLs

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one (hardcoded fallback in BUY_URL)
- Price: MX$749 / Compare at: MX$999
- Variants: Talla S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Landing Page Sections
1. Hero — full viewport, dark bg + rider image, headline "Rueda más. Llega mejor."
2. Benefits Bar — 4 icons on dark graphite strip
3. Problem Section — emotional copy + stat callout + highway lifestyle image
4. How It Works — 3 technical cards + product feature image
5. Lifestyle / In Use — 4 image grid + feature checklist
6. For Whom — 4 rider persona cards
7. Comparison Table — Rodata One vs Genéricos (7 rows)
8. Testimonials — 3 testimonials (placeholder, ready to replace)
9. Guarantee — 4 trust cards (30 days, size exchange, free shipping, WhatsApp)
10. FAQ — 7 questions with Accordion
11. Final CTA — dark cinematic section with price + buy button

## Active Plan: Future Sessions
### Pages to build next
- Product detail page (ProductPageUI.tsx) — already exists, may need rodata.mx branding update
- Cart / Checkout pages — already exist but may need minor theming tweaks

### Features to implement
- Connect store to Stripe payment gateway (dashboard)
- Connect WhatsApp business number in footer (currently placeholder: 5215500000000)
- Replace placeholder testimonials with real ones
- Add real product photos (user can upload to Dashboard)
- Potentially add a blog post about moto ergonomics

### Known issues / notes
- Testimonials are placeholder — need real rider reviews
- WhatsApp number in footer needs to be updated to real business number
- Lifestyle images (/lifestyle-1.jpg, /lifestyle-2.jpg, /lifestyle-3.jpg) are AI-generated — can be replaced with real photos
- Hero image (/hero-rider.jpg) is AI-generated — premium look, but can replace with brand shoot

## User Preferences
- Language: Spanish (Mexico)
- Tone: Premium, technical, no medical claims
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color