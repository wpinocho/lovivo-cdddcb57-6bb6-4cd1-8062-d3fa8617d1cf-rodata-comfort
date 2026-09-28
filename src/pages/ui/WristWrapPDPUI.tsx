// WristWrapPDPUI — PDP de "Muñequeras RODATA (par)".
// Mismo sistema visual y arquitectura que DeliveryPDPUI/ProductPageUI (galería, sticky bar,
// express checkout, acordeones). Sin experimentos ni BOGO: la promo del lumbar NO aplica aquí.
// Precio SIEMPRE desde BD (logic.currentPrice) — nunca hardcodeado.
import React, { useEffect, useRef, useState } from "react"
import ProductExpressCheckout from "@/components/ProductExpressCheckout"
import { Skeleton } from "@/components/ui/skeleton"
import { EcommerceTemplate } from "@/templates/EcommerceTemplate"
import {
  Star, Check, Truck, RotateCcw, MessageSquare, ChevronRight, ArrowLeft,
  ShoppingCart, Plus, Minus, Package, Activity, Hand, Timer, Shirt, Layers, ShieldCheck
} from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getDeliveryRangeLong, DELIVERY_RANGE_LABEL } from "@/lib/delivery-estimate"
import { whatsappUrl, SITE_URL, BRAND_NAME } from "@/lib/brand"

export const WRIST_WRAP_SLUG = "munequeras-rodata"
const PAGE_URL = `${SITE_URL}/productos/${WRIST_WRAP_SLUG}`

// ── Imágenes reales del cliente (Supabase image transform) ──
const SB = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'
const sq = (file: string, w = 1200) => `${SB}/${file}?width=${w}&height=${w}&resize=cover&quality=75`

const IMG_STUDIO  = '1790638502334-pkwpdneq4dd.webp'  // puesta, fondo blanco
const IMG_RIDE    = '1790638502334-q4h7kvtg3nn.webp'  // en el manubrio, carretera
const IMG_DETAILS = '1790638502334-0yjgi3apchym.webp' // callouts: pulgar / compresión / envolvente
const IMG_PAIR    = '1790638502334-nwhrcsc3un.webp'   // "Esto recibes: 2 muñequeras"
const REVIEW_PHOTO = `${SB}/1790638502334-2wwj6uvz7a5.webp?width=800&quality=75` // reseña real

const GALLERY = [IMG_STUDIO, IMG_RIDE, IMG_DETAILS, IMG_PAIR].map(f => sq(f))

// ── Data ──
const BULLETS = [
  { strong: 'Menos fatiga en la muñeca', rest: ' en rodadas largas y tráfico' },
  { strong: 'Debajo del guante', rest: ': no estorba el acelerador ni el clutch' },
  { strong: 'Incluye 2', rest: ' — izquierda y derecha, talla única ajustable' },
]

const PAIN_POINTS = [
  { icon: Activity, title: 'Vibración constante', desc: 'El manubrio transmite vibración a tus muñecas todo el camino. A la hora ya se siente.' },
  { icon: Hand, title: 'Peso sobre las manos', desc: 'Frenadas, baches y postura inclinada cargan la muñeca más de lo que crees.' },
  { icon: Timer, title: 'Acelerador y clutch', desc: 'Cientos de movimientos por rodada. En tráfico de ciudad, miles.' },
]

const FEATURES: { number: string; icon: React.ElementType; title: string; image: string; desc: React.ReactNode }[] = [
  { number: '01', icon: ShieldCheck, image: sq(IMG_RIDE, 900),
    title: 'Soporte firme sin perder control',
    desc: (
      <>
        La banda envolvente <strong className="text-brand-smoke">sujeta la muñeca en su posición natural</strong> mientras
        sigues girando el puño con normalidad. Aprietas lo que tú quieras:{' '}
        <strong className="text-brand-smoke">más firme para carretera, más suelto para ciudad</strong>.
      </>
    ) },
  { number: '02', icon: Layers, image: sq(IMG_DETAILS, 900),
    title: 'Compresión donde se cansa la muñeca',
    desc: (
      <>
        Tejido elástico que <strong className="text-brand-smoke">abraza la articulación sin cortar la circulación</strong>.
        La abertura para el pulgar la mantiene{' '}
        <strong className="text-brand-smoke">en su lugar todo el recorrido</strong>, sin que se suba ni se enrolle.
      </>
    ) },
  { number: '03', icon: Shirt, image: sq(IMG_PAIR, 900),
    title: 'Delgada. Va debajo del guante',
    desc: (
      <>
        Perfil bajo para que <strong className="text-brand-smoke">el guante cierre igual que siempre</strong>.
        Vienen <strong className="text-brand-smoke">2 muñequeras</strong> — una para cada mano — porque las dos trabajan en la moto.
      </>
    ) },
]

// Reseña real (foto del cliente). Texto redactado por RODATA — PENDIENTE de validación del cliente.
const REVIEW = {
  name: 'Ricardo G.', city: 'Guadalajara', date: 'Sep 2026', stars: 5, initial: 'R',
  text: 'Ruedo unos 150 km cada fin de semana y ya al regreso traía la muñeca derecha cansada de tanto acelerador. Me las pongo debajo del guante y ni se notan. Aprietan bien sin cortar la circulación y el pulgar no se mueve. Ya no llego con la muñeca adolorida.',
}

const FAQS = [
  { q: '¿Qué talla pido?', a: 'Es talla única ajustable. La banda envolvente se ajusta a tu muñeca, delgada o gruesa, con la presión que tú quieras.' },
  { q: '¿Se usan debajo del guante?', a: 'Sí, están pensadas para eso. Son delgadas y el guante cierra normal por encima.' },
  { q: '¿Me quitan movilidad para acelerar o usar el clutch?', a: 'No. Sujetan la muñeca pero dejan libres los dedos y el pulgar. Tú decides qué tan firme las aprietas.' },
  { q: '¿Cuántas vienen?', a: 'Vienen 2 muñequeras, una para cada mano.' },
  { q: '¿Dan calor?', a: 'Son de tejido elástico delgado. En rodadas de calor puedes aflojarlas un poco en las paradas.' },
  { q: '¿Sirven si ya tengo una lesión?', a: 'Son un accesorio de soporte y comodidad, no un producto médico. Si tienes una lesión, consulta primero a tu médico.' },
  { q: '¿Cuánto tarda en llegar y cuánto cuesta el envío?', a: `Envío estándar gratis en México donde haya cobertura. Normalmente llega en ${DELIVERY_RANGE_LABEL} con número de rastreo.` },
  { q: '¿Y si no me convencen?', a: 'Tienes 30 días desde que las recibes para devolverlas. Escríbenos por WhatsApp y te ayudamos.' },
]

const Stars = ({ count, size = 14 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size} fill={s <= count ? '#C98B2E' : 'transparent'} className={s <= count ? 'text-brand-amber' : 'text-brand-steel/30'} />
    ))}
  </div>
)

interface WristWrapPDPUIProps {
  logic: {
    product: any; loading: boolean; notFound: boolean
    quantity: number; matchingVariant: any
    currentPrice: number; currentCompareAt: number | null
    inStock: boolean; isPriceResolving?: boolean
    priceExperiment?: { id?: string; key: string; variant: 'control' | 'test'; displayedPrice: number } | null
    handleQuantityChange: (q: number) => void
    handleAddToCart: () => void; handleBuyNow: () => void
    formatMoney: (a: number) => string
    [key: string]: any
  }
}

/** SEO: title, description, canonical y Product JSON-LD (precio desde BD) */
const useWristWrapMeta = (price: number | null, inStock: boolean) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `Muñequeras para moto (par) | ${BRAND_NAME}`
    const nodes: HTMLElement[] = []
    const add = (el: HTMLElement) => { document.head.appendChild(el); nodes.push(el) }

    const desc = document.createElement('meta')
    desc.name = 'description'
    desc.content = 'Par de muñequeras de compresión para motociclistas. Soporte firme debajo del guante, talla única ajustable. Envío gratis en México.'
    add(desc)
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = PAGE_URL
    add(canonical)
    if (price) {
      const ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.text = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product',
        name: 'Muñequeras RODATA (par)', brand: { '@type': 'Brand', name: BRAND_NAME },
        image: GALLERY, url: PAGE_URL,
        offers: { '@type': 'Offer', priceCurrency: 'MXN', price, url: PAGE_URL,
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
      })
      add(ld)
    }
    return () => { document.title = prevTitle; nodes.forEach(n => n.remove()) }
  }, [price, inStock])
}

export const WristWrapPDPUI = ({ logic }: WristWrapPDPUIProps) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [expressAvailable, setExpressAvailable] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const hasCTABeenVisible = useRef(false)

  // Sticky bar: aparece solo después de haber visto el buy box y pasarlo
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) hasCTABeenVisible.current = true
      if (hasCTABeenVisible.current) setShowStickyBar(!entry.isIntersecting)
    }, { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [logic.product])

  useWristWrapMeta(logic.isPriceResolving ? null : logic.currentPrice || null, logic.inStock)

  if (logic.loading) return (
    <EcommerceTemplate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-20 w-full" /><Skeleton className="h-12 w-full" /></div>
      </div>
    </EcommerceTemplate>
  )

  if (logic.notFound || !logic.product) return (
    <EcommerceTemplate>
      <div className="text-center py-20">
        <h1 className="font-sora font-bold text-brand-offwhite text-4xl mb-4">Producto no encontrado</h1>
        <p className="text-brand-steel mb-8 font-inter">El producto no existe o fue eliminado.</p>
        <Link to="/"><button className="btn-amber font-sora"><ArrowLeft size={16} />Volver</button></Link>
      </div>
    </EcommerceTemplate>
  )

  const handlePrimary = logic.handleBuyNow ?? logic.handleAddToCart
  const hasDiscount = !!logic.currentCompareAt && logic.currentCompareAt > logic.currentPrice
  const discountPct = hasDiscount ? Math.round((1 - logic.currentPrice / (logic.currentCompareAt as number)) * 100) : null
  const deliveryDate = getDeliveryRangeLong()
  const waLink = whatsappUrl('Hola, tengo una pregunta sobre las Muñequeras RODATA')
  const priceNode = (cls: string, skel: string) => logic.isPriceResolving
    ? <Skeleton className={skel} />
    : <span className={cls}>{logic.formatMoney(logic.currentPrice)}</span>

  return (
    <EcommerceTemplate
      layout="full-width"
      noPadding
      hideFloatingCartOnMobile
      navLinks={[
        { label: 'Por qué funciona', href: '#por-que-funciona' },
        { label: 'Opinión', href: '#opinion' },
        { label: 'FAQ', href: '#faq' },
      ]}
    >
      {/* ── 1. MAIN PRODUCT ── */}
      <section style={{ backgroundColor: '#111315' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Gallery */}
            <div className="space-y-3 lg:sticky lg:top-[80px]">
              <div className="hidden md:block relative">
                <div className="rounded-2xl overflow-hidden bg-brand-graphite aspect-square relative">
                  <img src={GALLERY[selectedIdx]} alt={logic.product.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                  <div className="absolute bottom-3 right-3 bg-brand-carbon/80 backdrop-blur-sm text-brand-smoke text-[10px] font-inter px-2 py-1 rounded border border-white/[0.08]">RODATA</div>
                </div>
                {discountPct && (
                  <div className="absolute top-0 left-5 -translate-y-1/2 z-10 bg-brand-amber text-brand-carbon text-sm font-bold px-3.5 py-1.5 rounded-lg font-sora shadow-lg">-{discountPct}%</div>
                )}
              </div>

              <div className="md:hidden relative">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-4 px-4 pb-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                  {GALLERY.map((img, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-brand-graphite">
                        <img src={img} alt={`${logic.product.title} ${i + 1}`} className="w-full h-full object-cover" fetchPriority={i === 0 ? 'high' : 'auto'} loading={i === 0 ? 'eager' : 'lazy'} />
                      </div>
                    </div>
                  ))}
                </div>
                {discountPct && (
                  <div className="absolute top-0 left-5 -translate-y-1/2 z-10 bg-brand-amber text-brand-carbon text-sm font-bold px-3.5 py-1.5 rounded-lg font-sora shadow-lg pointer-events-none">-{discountPct}%</div>
                )}
              </div>

              <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
                {GALLERY.map((img, i) => (
                  <button key={i} onClick={() => setSelectedIdx(i)} aria-label={`Ver imagen ${i + 1}`} className={cn("flex-shrink-0 w-[70px] h-[70px] rounded-xl overflow-hidden border-2 transition-all", selectedIdx === i ? "border-brand-amber" : "border-white/10 hover:border-white/30")}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-brand-amber block" />
                <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em]">Para rodadas largas y tráfico diario</span>
              </div>
              <h1 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight">{logic.product.title}</h1>
              <p className="text-brand-smoke text-base font-inter leading-relaxed -mt-1">
                Si al bajarte de la moto sientes las muñecas cargadas, esto es para ti. Soporte firme debajo del guante, sin perder control del puño.
              </p>
              <a href="#opinion" className="flex items-center gap-3 w-fit">
                <Stars count={5} size={15} />
                <span className="text-brand-smoke text-sm font-inter">5.0 <span className="text-brand-steel underline underline-offset-2">· Lee la opinión de un rider</span></span>
              </a>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {priceNode('font-sora font-bold text-brand-offwhite text-4xl', 'h-10 w-40')}
                  {!logic.isPriceResolving && hasDiscount && (
                    <>
                      <span className="text-brand-steel/70 text-2xl line-through font-inter font-normal">{logic.formatMoney(logic.currentCompareAt as number)}</span>
                      <span className="bg-brand-amber text-brand-carbon text-xs font-bold px-2.5 py-1.5 rounded-md font-sora tracking-wide">{discountPct}% OFF</span>
                    </>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-3.5 py-1.5">
                  <span className="text-brand-amber text-xs font-sora font-semibold">🏷 Precio de lanzamiento · Incluye 2 muñequeras</span>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-5 space-y-2">
                {BULLETS.map(({ strong, rest }) => (
                  <div key={strong} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0"><Check size={9} className="text-brand-amber" /></div>
                    <span className="text-brand-smoke text-sm font-inter"><strong className="text-brand-offwhite font-semibold">{strong}</strong>{rest}</span>
                  </div>
                ))}
              </div>

              {/* Talla única + cantidad */}
              <div className="border-t border-white/[0.08] pt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-brand-smoke text-sm font-sora font-semibold">Talla</p>
                  <span className="inline-flex mt-2 px-3 py-2 rounded-xl border bg-brand-amber text-brand-carbon border-brand-amber font-sora font-bold text-sm">Única ajustable</span>
                </div>
                <div>
                  <p className="text-brand-smoke text-sm font-sora font-semibold mb-2">Cantidad</p>
                  <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.12]">
                    <button onClick={() => logic.handleQuantityChange(Math.max(1, logic.quantity - 1))} disabled={logic.quantity <= 1} aria-label="Menos" className="px-3.5 py-2.5 text-brand-smoke hover:text-brand-offwhite hover:bg-brand-graphite transition-colors disabled:opacity-40"><Minus size={14}/></button>
                    <span className="px-4 py-2.5 text-brand-offwhite font-sora font-bold text-sm border-x border-white/[0.12] min-w-[44px] text-center">{logic.quantity}</span>
                    <button onClick={() => logic.handleQuantityChange(logic.quantity + 1)} aria-label="Más" className="px-3.5 py-2.5 text-brand-smoke hover:text-brand-offwhite hover:bg-brand-graphite transition-colors"><Plus size={14}/></button>
                  </div>
                </div>
              </div>

              {logic.inStock && (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <span className="text-brand-smoke text-xs font-inter">En stock · Sale en 24–48 hrs hábiles</span>
                </div>
              )}

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-col gap-3">
                {logic.inStock ? (
                  <>
                    <ProductExpressCheckout
                      product={logic.product}
                      variant={logic.matchingVariant}
                      sellingPlan={logic.selectedPlan ?? null}
                      quantity={logic.quantity}
                      unitPrice={logic.currentPrice}
                      resolvedUnitPrice={logic.currentPrice}
                      priceExperiment={logic.priceExperiment}
                      disabled={logic.isPriceResolving}
                      onAvailabilityChange={setExpressAvailable}
                    />
                    {expressAvailable && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/[0.1]" />
                        <span className="text-brand-steel text-[10px] font-inter uppercase tracking-wider">o</span>
                        <div className="flex-1 h-px bg-white/[0.1]" />
                      </div>
                    )}
                    <button onClick={handlePrimary} disabled={logic.isPriceResolving} className="btn-amber-lg amber-glow font-sora w-full text-base disabled:opacity-60 disabled:cursor-not-allowed">
                      <ShoppingCart size={18}/>Comprar ahora{logic.isPriceResolving ? '' : ` · ${logic.formatMoney(logic.currentPrice)}`}
                    </button>
                    <button onClick={logic.handleAddToCart} disabled={logic.isPriceResolving} className="btn-outline-light font-sora w-full disabled:opacity-60 disabled:cursor-not-allowed">Agregar al carrito</button>
                    <p className="text-brand-steel text-[11px] font-inter text-center">🔒 Pago seguro · Envío gratis · 30 días para devolver</p>
                  </>
                ) : (
                  <button disabled className="btn-amber-lg font-sora w-full opacity-50 cursor-not-allowed">Agotado temporalmente</button>
                )}
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08]">
                {[{icon: Truck, label: 'Envío gratis', sub: 'En México'}, {icon: RotateCcw, label: '30 días', sub: 'Para devolver'}, {icon: MessageSquare, label: 'WhatsApp', sub: 'Personas reales'}].map(({icon: Icon, label, sub}) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center"><Icon size={13} className="text-brand-amber"/></div>
                    <p className="text-brand-smoke text-[11px] font-sora font-semibold leading-tight">{label}</p>
                    <p className="text-brand-steel text-[10px] font-inter">{sub}</p>
                  </div>
                ))}
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="shipping" className="border border-white/[0.08] rounded-xl bg-brand-graphite px-4 data-[state=open]:border-brand-amber/20 transition-colors">
                  <AccordionTrigger className="font-sora font-semibold text-brand-smoke text-xs py-3.5 hover:no-underline hover:text-brand-offwhite [&>svg]:text-brand-amber">
                    <div className="flex items-center gap-2"><Package size={13} className="text-brand-amber flex-shrink-0" />Envío y Devoluciones</div>
                  </AccordionTrigger>
                  <AccordionContent className="text-brand-steel text-xs font-inter leading-relaxed pb-4 space-y-2">
                    <p><span className="text-brand-smoke font-semibold">🚚 Envío estándar gratis</span> en México donde haya cobertura.</p>
                    <p><span className="text-brand-smoke font-semibold">📅 Entrega estimada:</span> En {DELIVERY_RANGE_LABEL} · llega entre el {deliveryDate}.</p>
                    <p><span className="text-brand-smoke font-semibold">🔄 30 días para devolver</span> desde que las recibes. Pruébalas normalmente. <Link to="/politica-de-devoluciones" className="text-brand-amber underline underline-offset-2">Ver política</Link></p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] text-xs font-inter hover:underline">
                <MessageSquare size={13}/>¿Tienes dudas? Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUÉ INCLUYE ── */}
      <section style={{ backgroundColor: '#1D2125' }} className="border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/[0.06]">
            {[{value:'2', label:'Muñequeras incluidas'},{value:'Única', label:'Talla ajustable'},{value:'Gratis', label:'Envío en México'}].map(({value, label}) => (
              <div key={label} className="py-1">
                <p className="font-sora font-bold text-brand-amber text-xl sm:text-2xl">{value}</p>
                <p className="text-brand-steel text-xs font-inter mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. EL PROBLEMA ── */}
      <section style={{ backgroundColor: '#111315' }} className="border-b border-white/[0.06] py-14 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Por qué se cansan</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight">Tus muñecas trabajan todo el camino</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PAIN_POINTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-brand-graphite border border-white/[0.07] rounded-2xl p-5 hover:border-brand-amber/20 transition-colors">
                <div className="h-10 w-10 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mb-3"><Icon size={17} className="text-brand-amber"/></div>
                <h3 className="font-sora font-bold text-brand-offwhite text-base mb-1.5">{title}</h3>
                <p className="text-brand-steel text-sm font-inter leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES ── */}
      <section id="por-que-funciona" style={{backgroundColor:'#111315'}} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Por qué funciona</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl lg:text-5xl">Hechas para la moto, no para el gimnasio</h2>
          </div>
          <div className="space-y-24">
            {FEATURES.map(({number, icon: Icon, title, desc, image}, idx) => (
              <div key={number} className={cn("grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center", idx % 2 !== 0 && "lg:grid-flow-dense")}>
                <div className={cn("relative rounded-2xl overflow-hidden", idx % 2 !== 0 && "lg:col-start-2")}>
                  <img src={image} alt={title} className="w-full aspect-square object-cover" loading="lazy"/>
                </div>
                <div className={cn(idx % 2 !== 0 && "lg:col-start-1 lg:row-start-1")}>
                  <span className="font-sora font-bold text-brand-amber/15 text-8xl block leading-none mb-2 select-none">{number}</span>
                  <div className="h-10 w-10 rounded-xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mb-4"><Icon size={18} className="text-brand-amber"/></div>
                  <h3 className="font-sora font-bold text-brand-offwhite text-2xl sm:text-3xl mb-4">{title}</h3>
                  <p className="text-brand-smoke text-base leading-relaxed font-inter mb-6">{desc}</p>
                  <div className="h-px w-12 bg-brand-amber/40"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OPINIÓN REAL ── */}
      <section id="opinion" style={{backgroundColor:'#1D2125'}} className="border-y border-white/[0.06] py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">De rider a rider</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Lo que nos dijo un cliente</h2>
          </div>
          <div className="grid md:grid-cols-2 bg-brand-carbon border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="relative aspect-[3/4] md:aspect-auto">
              <img src={REVIEW_PHOTO} alt={`Foto de ${REVIEW.name} con sus Muñequeras RODATA`} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-brand-carbon/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Check size={10} className="text-brand-amber"/><span className="text-brand-amber text-[10px] font-inter font-medium">Foto del cliente</span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <Stars count={REVIEW.stars} size={16}/>
              <blockquote className="text-brand-offwhite text-lg font-inter leading-relaxed mt-4">"{REVIEW.text}"</blockquote>
              <div className="flex items-center gap-3 mt-6">
                <div className="h-10 w-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0"><span className="font-sora font-bold text-brand-amber text-sm">{REVIEW.initial}</span></div>
                <div>
                  <p className="font-sora font-semibold text-brand-offwhite text-sm">{REVIEW.name}</p>
                  <p className="text-brand-steel text-xs font-inter">{REVIEW.city} · {REVIEW.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CÓMO SE USA + SIN RIESGO ── */}
      <section style={{backgroundColor:'#111315'}} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Simple de usar · Compra sin riesgo</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Listas en 30 segundos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              {step:'1', title:'Mete el pulgar', desc:'La abertura la deja en su lugar desde el inicio.'},
              {step:'2', title:'Envuelve y ajusta', desc:'Tan firme como tú quieras, sin cortar la circulación.'},
              {step:'3', title:'Ponte el guante y sal', desc:'La diferencia la notas al bajarte de la moto.'},
            ].map(({step, title, desc}) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-amber text-brand-carbon font-sora font-bold text-base flex items-center justify-center mb-4 amber-glow">{step}</div>
                <h3 className="font-sora font-bold text-brand-offwhite text-base mb-1.5">{title}</h3>
                <p className="text-brand-steel text-sm font-inter leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] my-10" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {icon:RotateCcw, title:'30 días para devolver', desc:'Desde que las recibes. Pruébalas normalmente.'},
              {icon:Truck, title:'Envío gratis', desc:'Envío estándar en México con rastreo.'},
              {icon:MessageSquare, title:'Soporte WhatsApp', desc:'Personas reales que responden.'},
            ].map(({icon: Icon, title, desc}) => (
              <div key={title} className="bg-brand-graphite border border-white/[0.07] rounded-xl p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center flex-shrink-0"><Icon size={17} className="text-brand-amber"/></div>
                <div>
                  <h3 className="font-sora font-semibold text-brand-offwhite text-sm">{title}</h3>
                  <p className="text-brand-steel text-xs font-inter mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section id="faq" style={{backgroundColor:'#1D2125'}} className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Resolvemos tus dudas</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl">Preguntas frecuentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map(({q, a}, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-brand-carbon border border-white/[0.07] rounded-xl px-6 data-[state=open]:border-brand-amber/20 transition-colors duration-200">
                <AccordionTrigger className="font-sora font-semibold text-brand-offwhite text-sm py-5 hover:no-underline hover:text-brand-amber [&>svg]:text-brand-amber text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-brand-smoke text-sm font-inter leading-relaxed pb-5">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section style={{backgroundColor:'#111315'}} className="border-t border-white/[0.08] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-4 block">Muñequeras RODATA</span>
          <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight mb-4">Que lo único cansado al llegar sea la moto.</h2>
          <p className="text-brand-smoke font-inter text-sm mb-8">Incluye 2 · Envío gratis en México · 30 días para devolver</p>
          <div className="flex items-baseline justify-center gap-3 mb-7">
            {priceNode('font-sora font-bold text-brand-offwhite text-4xl', 'h-10 w-40')}
            {!logic.isPriceResolving && hasDiscount && <span className="text-brand-steel text-xl line-through font-inter">{logic.formatMoney(logic.currentCompareAt as number)}</span>}
          </div>
          <button onClick={handlePrimary} disabled={logic.isPriceResolving} className="btn-amber-lg amber-glow font-sora text-base px-12 disabled:opacity-60 disabled:cursor-not-allowed">Comprar ahora<ChevronRight size={18}/></button>
        </div>
      </section>

      {/* ── STICKY BAR ── */}
      {logic.inStock && showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t border-white/[0.1] pb-[env(safe-area-inset-bottom)]" style={{backgroundColor:'rgba(17,19,21,0.96)'}}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="hidden md:flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <h3 className="font-sora font-semibold text-brand-offwhite text-sm truncate">{logic.product.title}</h3>
                <div className="flex items-baseline gap-2">
                  {priceNode('font-sora font-bold text-brand-offwhite', 'h-5 w-20')}
                  {!logic.isPriceResolving && hasDiscount && <span className="text-brand-steel text-sm line-through font-inter">{logic.formatMoney(logic.currentCompareAt as number)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={handlePrimary} disabled={logic.isPriceResolving} className="btn-amber amber-glow font-sora px-8 disabled:opacity-60 disabled:cursor-not-allowed"><ShoppingCart size={14}/>Comprar ahora</button>
                <button onClick={logic.handleAddToCart} disabled={logic.isPriceResolving} className="btn-outline-light font-sora disabled:opacity-60 disabled:cursor-not-allowed">Agregar al carrito</button>
              </div>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <div className="flex-1 min-w-0">
                {priceNode('font-sora font-bold text-brand-offwhite text-sm block', 'h-4 w-20')}
                <p className="text-brand-steel text-xs font-inter truncate">{logic.product.title}</p>
              </div>
              <button onClick={handlePrimary} disabled={logic.isPriceResolving} className="btn-amber amber-glow font-sora flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"><ShoppingCart size={14}/>Comprar ahora</button>
            </div>
          </div>
        </div>
      )}
    </EcommerceTemplate>
  )
}