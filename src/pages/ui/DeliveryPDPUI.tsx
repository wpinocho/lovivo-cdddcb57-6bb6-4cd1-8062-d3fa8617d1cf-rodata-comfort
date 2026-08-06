// DeliveryPDPUI — fork literal de ProductPageUI v4.7 para el avatar "repartidor de plataformas".
// MISMA arquitectura (galería, sticky bar, express checkout, carrito, guía de tallas).
// Solo cambian: copy, imágenes, reseñas, FAQ + una banda nueva de ángulo económico.
import React, { useEffect, useRef, useState } from "react"
import ProductExpressCheckout from "@/components/ProductExpressCheckout"
import { Skeleton } from "@/components/ui/skeleton"
import { EcommerceTemplate } from "@/templates/EcommerceTemplate"
import {
  Star, Check, Ruler, Truck, RotateCcw, MessageSquare,
  ChevronRight, ArrowLeft, ShoppingCart, Plus, Minus,
  ChevronDown, ChevronUp, SlidersHorizontal, Wind, Layers, Package,
  Clock, Wallet
} from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// ── Image constants (Supabase image transform) ──
const SUPABASE_PROD = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf'

const AVATAR_CARLOS = `${SUPABASE_PROD}/avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_JORGE  = `${SUPABASE_PROD}/avatar-jorge-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_ANDRES = `${SUPABASE_PROD}/avatar-andres-v3.webp?width=72&height=72&resize=cover&quality=80`

// Avatar repartidor
const DLV_HERO_WIDE = `${SUPABASE_PROD}/dlv-hero.webp?width=1400&quality=75`
const DLV_HERO_SQ   = `${SUPABASE_PROD}/dlv-hero.webp?width=1200&height=1200&resize=cover&quality=75`
const DLV_FEAT_1 = `${SUPABASE_PROD}/dlv-feat-1.webp?width=800&quality=75`
const DLV_FEAT_2 = `${SUPABASE_PROD}/dlv-feat-2.webp?width=800&quality=75`
const DLV_FEAT_3 = `${SUPABASE_PROD}/dlv-feat-3.webp?width=800&quality=75`

const REVIEW_IMG_1 = `${SUPABASE_PROD}/review-1.webp?width=600&quality=75`
const REVIEW_IMG_2 = `${SUPABASE_PROD}/review-2.webp?width=600&quality=75`
const REVIEW_IMG_3 = `${SUPABASE_PROD}/review-3.webp?width=600&quality=75`
const REVIEW_IMG_4 = `${SUPABASE_PROD}/review-4.webp?width=600&quality=75`
const REVIEW_IMG_5 = `${SUPABASE_PROD}/review-5.webp?width=600&quality=75`

// ── Helpers ──
const getSizeKey = (value: string) =>
  value.includes('(') ? value.split('(')[0].trim() : value

const getDeliveryDate = () => {
  const d = new Date()
  let added = 0
  while (added < 4) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) added++
  }
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── Data ──
const SIZE_GUIDE = [
  { size: 'S',  waist: '60–75 cm',   recom: 'Cintura delgada' },
  { size: 'M',  waist: '75–90 cm',   recom: 'Talla promedio'  },
  { size: 'L',  waist: '90–100 cm',  recom: 'Talla grande'    },
  { size: 'XL', waist: '100–115 cm', recom: 'Extra grande'    },
]

const FEATURES: { number: string; icon: React.ElementType; title: string; desc: React.ReactNode; image: string }[] = [
  { number: '01', icon: Layers, image: DLV_FEAT_1,
    title: 'Aguanta el turno completo sin que la espalda te pare',
    desc: (
      <>
        Manejas inclinado hacia adelante, con peso a la espalda, hora tras hora.{' '}
        <strong className="text-brand-smoke">Esa postura carga tu zona lumbar y no lo sientes hasta que ya duele</strong> —
        normalmente a media jornada, justo cuando mejor pagan los pedidos. El Rodata One trabaja exactamente ahí:{' '}
        <strong className="text-brand-smoke">soporte firme que reparte esa tensión</strong> para que llegues completo al final del turno.
      </>
    ) },
  { number: '02', icon: SlidersHorizontal, image: DLV_FEAT_2,
    title: 'Te subes y bajas 40 veces al día. No se mueve',
    desc: (
      <>
        No es una faja rígida de gimnasio que te estorba al bajarte de la moto.{' '}
        <strong className="text-brand-smoke">Es flexible y se mueve contigo</strong>: caminas, subes escaleras, tocas timbres, vuelves a arrancar.
        El sistema de doble correa lo mantiene{' '}
        <strong className="text-brand-smoke">en el mismo lugar desde el primer pedido hasta el último</strong>, y se ajusta en segundos sin bajarte.
      </>
    ) },
  { number: '03', icon: Wind, image: DLV_FEAT_3,
    title: 'No estorba con la mochila ni da calor',
    desc: (
      <>
        Va abajo de la mochila térmica, sobre la cintura —{' '}
        <strong className="text-brand-smoke">sin encimarse con los tirantes ni con el cinturón</strong>.
        Textil negro mate con{' '}
        <strong className="text-brand-smoke">malla perforada transpirable</strong> para jornadas largas de ciudad,
        y perfil bajo para que no se note bajo la sudadera o la chamarra.
      </>
    ) },
]

const REVIEWS = [
  { name: 'Luis M.',    city: 'CDMX',        stars: 5, initial: 'L', date: 'Mar 2025', photo: REVIEW_IMG_1, text: 'Llevo 2 años repartiendo. Antes a las 6 horas ya andaba parando cada rato por la espalda baja. Ahora cierro las 10 y llego a mi casa sin arrastrarme.' },
  { name: 'Ernesto R.', city: 'Ecatepec',    stars: 5, initial: 'E', date: 'Feb 2025', photo: REVIEW_IMG_2, text: 'Las fajas normales se me corrían al bajarme de la moto. Esta no. Me la ajusto en la mañana y ni la vuelvo a tocar. Abajo de la sudadera ni se ve.' },
  { name: 'Diego A.',   city: 'Guadalajara', stars: 5, initial: 'D', date: 'Mar 2025', photo: REVIEW_IMG_3, text: 'Pensé que me iba a estorbar con la caja térmica y para nada, queda abajo. Con el calor de aquí sí se siente fresca, tiene malla.' },
  { name: 'Iván T.',    city: 'Monterrey',   stars: 4, initial: 'I', date: 'Ene 2025', photo: REVIEW_IMG_4, text: 'Pedí la L con la guía y quedó exacta. En turnos dobles se nota la diferencia: ya no termino con esa punzada de siempre.' },
  { name: 'Saúl H.',    city: 'Puebla',      stars: 5, initial: 'S', date: 'Feb 2025', photo: REVIEW_IMG_5, text: 'Hago como 30 entregas diarias en scooter. Con esto dejé de cortar el turno temprano. En una semana ya se había pagado solo.' },
]

const FAQS = [
  { q: '¿Aguanta subir y bajar de la moto todo el día?', a: 'Sí, está pensado justo para eso. No es una faja rígida: el panel lumbar da soporte pero el textil es flexible, así que puedes bajarte, caminar, subir escaleras y volver a arrancar sin quitártelo ni reajustarlo.' },
  { q: '¿Estorba con la mochila térmica?', a: 'No. Va sobre la cintura, por debajo de la mochila y de los tirantes. Es de perfil bajo, así que no se encima con la caja ni con el cinturón.' },
  { q: '¿Da calor en jornadas largas?', a: 'Tiene malla perforada transpirable en los laterales, que es la zona donde más se acumula el calor. En clima de ciudad mexicana funciona bien incluso en turnos de 10 a 12 horas.' },
  { q: '¿Sirve igual en scooter que en moto de trabajo?', a: 'Sí. Lo que importa no es la moto, es la postura inclinada y las horas encima. Funciona en scooter, motoneta y motos de trabajo por igual.' },
  { q: '¿Qué talla pido?', a: 'Mide tu cintura por encima del pantalón, a la altura del ombligo. S: 60–75 cm · M: 75–90 cm · L: 90–100 cm · XL: 100–115 cm. Si quedas justo entre dos, pide la mayor.' },
  { q: '¿Cuánto tarda en llegar y cuánto cuesta el envío?', a: 'Envío gratis a todo México. Normalmente llega en 3 a 5 días hábiles con número de rastreo.' },
  { q: '¿Y si no me funciona?', a: 'Tienes 30 días para probarlo trabajando. Si no te sirve, escríbenos por WhatsApp y te ayudamos con el cambio o la devolución.' },
]

// ── Sub-components ──
const Stars = ({ count, size = 14 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size} fill={s <= count ? '#C98B2E' : 'transparent'} className={s <= count ? 'text-brand-amber' : 'text-brand-steel/30'} />
    ))}
  </div>
)

// ── Types ──
interface DeliveryPDPUIProps {
  logic: {
    product: any; loading: boolean; notFound: boolean
    selected: Record<string, string>; quantity: number; matchingVariant: any
    currentPrice: number; currentCompareAt: number | null; currentImage: string | null
    displayImages?: string[]; inStock: boolean
    handleOptionSelect: (n: string, v: string) => void
    handleQuantityChange: (q: number) => void
    handleAddToCart: () => void; handleBuyNow: () => void
    handleNavigateBack: () => void
    isOptionValueAvailable: (n: string, v: string) => boolean
    formatMoney: (a: number) => string
    [key: string]: any
  }
}

export const DeliveryPDPUI = ({ logic }: DeliveryPDPUIProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [expressAvailable, setExpressAvailable] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const ctaRef = useRef<HTMLDivElement>(null)
  const hasCTABeenVisible = useRef(false)

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hasCTABeenVisible.current = true
        if (hasCTABeenVisible.current) setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [logic.product])

  // ── SEO: noindex + canonical a la PDP principal (esta es una landing de paid traffic) ──
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, follow'
    document.head.appendChild(meta)

    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = 'https://rodata.store/productos/soporte-lumbar-rodata-one'
    document.head.appendChild(canonical)

    return () => {
      document.head.removeChild(meta)
      document.head.removeChild(canonical)
    }
  }, [])

  // Galería: primero las imágenes del avatar repartidor, luego las del producto
  const DLV_GALLERY = [DLV_HERO_SQ, DLV_FEAT_3, DLV_FEAT_2]
  const productImages: string[] = [...DLV_GALLERY, ...(logic.displayImages ?? [])]
  const displayImage = selectedImage ?? productImages[0]
  const discountPct = logic.currentCompareAt && logic.currentCompareAt > logic.currentPrice
    ? Math.round((1 - logic.currentPrice / logic.currentCompareAt) * 100) : null
  const deliveryDate = getDeliveryDate()

  useEffect(() => { setSelectedImage(null) }, [logic.matchingVariant])
  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (logic.loading) return (
    <EcommerceTemplate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-20 w-full" /><Skeleton className="h-12 w-full" /></div>
      </div>
    </EcommerceTemplate>
  )

  if (logic.notFound) return (
    <EcommerceTemplate>
      <div className="text-center py-20">
        <h1 className="font-sora font-bold text-brand-carbon text-4xl mb-4">Producto no encontrado</h1>
        <p className="text-brand-steel mb-8 font-inter">El producto no existe o fue eliminado.</p>
        <Link to="/"><button className="btn-amber font-sora"><ArrowLeft size={16} />Volver</button></Link>
      </div>
    </EcommerceTemplate>
  )

  if (!logic.product) return null
  const handlePrimary = logic.handleBuyNow ?? logic.handleAddToCart

  return (
    <EcommerceTemplate
      layout="full-width"
      noPadding
      hideFloatingCartOnMobile
      navLinks={[
        { label: 'Por qué funciona', href: '#por-que-funciona' },
        { label: 'Opiniones', href: '#opiniones' },
        { label: 'FAQ', href: '#faq' },
      ]}
    >

      {/* ── 1. MAIN PRODUCT ── */}
      <section style={{ backgroundColor: '#111315' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Gallery */}
            <div className="space-y-3 lg:sticky lg:top-[80px]">
              {/* Desktop main image */}
              <div className="hidden md:block relative">
                <div className="rounded-2xl overflow-hidden bg-brand-graphite aspect-square relative">
                  <img src={displayImage} alt={logic.product.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                  <div className="absolute bottom-3 right-3 bg-brand-carbon/80 backdrop-blur-sm text-brand-smoke text-[10px] font-inter px-2 py-1 rounded border border-white/[0.08]">rodata.mx</div>
                </div>
                {discountPct && (
                  <div className="absolute top-0 left-5 -translate-y-1/2 z-10 bg-brand-amber text-brand-carbon text-sm font-bold px-3.5 py-1.5 rounded-lg font-sora shadow-lg">
                    -{discountPct}%
                  </div>
                )}
              </div>

              {/* Mobile gallery — scroll-snap nativo */}
              <div className="md:hidden relative">
                <div
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-4 px-4 pb-1"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {productImages.map((img, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-brand-graphite">
                        <img
                          src={img}
                          alt={`${logic.product.title} ${i + 1}`}
                          className="w-full h-full object-cover"
                          fetchPriority={i === 0 ? 'high' : 'auto'}
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {discountPct && (
                  <div className="absolute top-0 left-5 -translate-y-1/2 z-10 bg-brand-amber text-brand-carbon text-sm font-bold px-3.5 py-1.5 rounded-lg font-sora shadow-lg pointer-events-none">
                    -{discountPct}%
                  </div>
                )}
              </div>

              {/* Desktop thumbnails */}
              {productImages.length > 1 && (
                <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
                  {productImages.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(img)} className={cn("flex-shrink-0 w-[70px] h-[70px] rounded-xl overflow-hidden border-2 transition-all", (selectedImage === img || (!selectedImage && i === 0)) ? "border-brand-amber" : "border-white/10 hover:border-white/30")}>
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-brand-amber block" />
                <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em]">Diseñado para jornadas de 8 a 12 horas sobre la moto</span>
              </div>
              <h1 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight">{logic.product.title}</h1>
              <p className="text-brand-smoke text-base font-inter leading-relaxed -mt-1">
                Acortar tu turno te cuesta entregas. Este soporte está hecho para que la espalda no sea la que decide a qué hora te desconectas.
              </p>
              <div className="flex items-center gap-3">
                <Stars count={5} size={15} />
                <span className="text-brand-smoke text-sm font-inter">4.9 <span className="text-brand-steel">· 127 reseñas verificadas</span></span>
              </div>

              {/* Price + badge */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-sora font-bold text-brand-offwhite text-4xl">{logic.formatMoney(logic.currentPrice)}</span>
                  {logic.currentCompareAt && logic.currentCompareAt > logic.currentPrice && (
                    <>
                      <span className="text-brand-steel/70 text-2xl line-through font-inter font-normal">{logic.formatMoney(logic.currentCompareAt)}</span>
                      <span className="bg-brand-amber text-brand-carbon text-xs font-bold px-2.5 py-1.5 rounded-md font-sora tracking-wide">{discountPct}% OFF</span>
                    </>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-3.5 py-1.5">
                  <span className="text-brand-amber text-xs font-sora font-semibold">🏷 Oferta de Lanzamiento · Envío gratis incluido</span>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-5 space-y-3">
                <p className="text-brand-smoke text-sm leading-relaxed font-inter">
                  El soporte lumbar que usan los repartidores que trabajan turnos largos sobre la moto.
                </p>
                <div className="space-y-2">
                  {['Cierra el turno completo sin parar cada rato por la espalda', 'Te subes y bajas 40 veces al día y no se corre de lugar', 'Va debajo de la mochila térmica: no estorba ni se nota'].map(item => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0"><Check size={9} className="text-brand-amber" /></div>
                      <span className="text-brand-smoke text-xs font-inter">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              {logic.product.options?.length > 0 && (
                <div className="border-t border-white/[0.08] pt-5 space-y-3">
                  {logic.product.options.map((option: any) => (
                    <div key={option.name}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-brand-smoke text-sm font-sora font-semibold">
                          {option.name}
                          {logic.selected[option.name] && (
                            <span className="text-brand-steel font-inter font-normal ml-2">
                              · {SIZE_GUIDE.find(s => s.size === getSizeKey(logic.selected[option.name]))?.waist ?? logic.selected[option.name]}
                            </span>
                          )}
                        </p>
                        <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="flex items-center gap-1 text-brand-amber text-xs font-inter underline underline-offset-2">
                          Guía de tallas {showSizeGuide ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                        </button>
                      </div>
                      {showSizeGuide && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/[0.08]">
                          <div className="grid grid-cols-3 bg-brand-graphite px-4 py-2 text-[10px] font-sora text-brand-steel uppercase tracking-wider"><span>Talla</span><span>Cintura</span><span>Tipo</span></div>
                          {SIZE_GUIDE.map(sg => (
                            <div key={sg.size} className={cn("grid grid-cols-3 px-4 py-2.5 text-xs font-inter border-t border-white/[0.06]", getSizeKey(logic.selected[option.name]) === sg.size ? "bg-brand-amber/10 text-brand-offwhite" : "text-brand-steel")}>
                              <span className="font-sora font-semibold text-brand-smoke">{sg.size}</span><span>{sg.waist}</span><span>{sg.recom}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value: string) => {
                          const sizeKey = getSizeKey(value)
                          const isSelected = logic.selected[option.name] === value
                          const isAvailable = logic.isOptionValueAvailable(option.name, value)
                          const sg = SIZE_GUIDE.find(s => s.size === sizeKey)
                          return (
                            <button key={value} disabled={!isAvailable} onClick={() => logic.handleOptionSelect(option.name, value)}
                              className={cn("flex flex-col items-center min-w-[68px] px-3 py-2.5 rounded-xl border text-sm transition-all font-sora",
                                isSelected ? "bg-brand-amber text-brand-carbon border-brand-amber font-bold shadow-[0_0_16px_rgba(201,139,46,0.3)]"
                                : isAvailable ? "bg-brand-graphite border-white/[0.12] text-brand-smoke hover:border-brand-amber/50"
                                : "opacity-40 cursor-not-allowed bg-brand-graphite border-white/[0.08] text-brand-steel")}>
                              <span className="font-bold">{sizeKey}</span>
                              {sg && <span className={cn("text-[10px] font-inter mt-0.5", isSelected ? "text-brand-carbon/70" : "text-brand-steel")}>{sg.waist}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-brand-smoke text-sm font-inter">Cantidad:</span>
                <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.12]">
                  <button onClick={() => logic.handleQuantityChange(Math.max(1, logic.quantity - 1))} disabled={logic.quantity <= 1} className="px-3.5 py-2.5 text-brand-smoke hover:text-brand-offwhite hover:bg-brand-graphite transition-colors disabled:opacity-40"><Minus size={14}/></button>
                  <span className="px-4 py-2.5 text-brand-offwhite font-sora font-bold text-sm border-x border-white/[0.12] min-w-[44px] text-center">{logic.quantity}</span>
                  <button onClick={() => logic.handleQuantityChange(logic.quantity + 1)} className="px-3.5 py-2.5 text-brand-smoke hover:text-brand-offwhite hover:bg-brand-graphite transition-colors"><Plus size={14}/></button>
                </div>
              </div>

              {/* Urgency / Stock signal */}
              {logic.inStock && (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <span className="text-brand-smoke text-xs font-inter">En stock · Envío en 24–48 hrs</span>
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
                      onAvailabilityChange={setExpressAvailable}
                    />
                    {expressAvailable && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/[0.1]" />
                        <span className="text-brand-steel text-[10px] font-inter uppercase tracking-wider">o</span>
                        <div className="flex-1 h-px bg-white/[0.1]" />
                      </div>
                    )}
                    <button onClick={handlePrimary} className="btn-amber-lg amber-glow font-sora w-full text-base">
                      <ShoppingCart size={18}/>Comprar ahora · {logic.formatMoney(logic.currentPrice)}
                    </button>
                    <button onClick={logic.handleAddToCart} className="btn-outline-light font-sora w-full">Agregar al carrito</button>
                    <p className="text-brand-steel text-[11px] font-inter text-center">
                      🔒 Pago seguro · Envío gratis · 30 días de prueba
                    </p>
                  </>
                ) : (
                  <button disabled className="btn-amber-lg font-sora w-full opacity-50 cursor-not-allowed">Agotado temporalmente</button>
                )}
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08]">
                {[{icon: Truck, label: 'Envío gratis', sub: 'A todo México'}, {icon: RotateCcw, label: '30 días', sub: 'De prueba'}, {icon: Ruler, label: 'Cambio talla', sub: 'Sin costo'}].map(({icon: Icon, label, sub}) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center"><Icon size={13} className="text-brand-amber"/></div>
                    <p className="text-brand-smoke text-[11px] font-sora font-semibold leading-tight">{label}</p>
                    <p className="text-brand-steel text-[10px] font-inter">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Shipping & Returns accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="shipping" className="border border-white/[0.08] rounded-xl bg-brand-graphite px-4 data-[state=open]:border-brand-amber/20 transition-colors">
                  <AccordionTrigger className="font-sora font-semibold text-brand-smoke text-xs py-3.5 hover:no-underline hover:text-brand-offwhite [&>svg]:text-brand-amber">
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-brand-amber flex-shrink-0" />
                      Envío y Devoluciones
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-brand-steel text-xs font-inter leading-relaxed pb-4 space-y-2">
                    <p><span className="text-brand-smoke font-semibold">🚚 Envío gratis</span> a todo México. Sin costo mínimo de compra.</p>
                    <p><span className="text-brand-smoke font-semibold">📅 Fecha estimada de entrega:</span> En 4 días hábiles · llega el {deliveryDate}.</p>
                    <p><span className="text-brand-smoke font-semibold">🔄 Cambio de talla:</span> Si no es la talla correcta, contáctanos por WhatsApp y te ayudamos con el cambio sin costo.</p>
                    <p><span className="text-brand-smoke font-semibold">✅ 30 días de prueba:</span> Pruébalo trabajando. Si no te sirve, lo resolvemos.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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
                  <span className="text-brand-offwhite font-semibold">Luis M. ✓</span> y{' '}
                  <span className="text-brand-offwhite font-semibold">+800 personas</span> lo usan a diario sobre la moto
                </p>
              </div>

              {/* WhatsApp link */}
              <a href="https://wa.me/525531215386?text=Hola,%20soy%20repartidor%20y%20tengo%20una%20pregunta%20sobre%20el%20Rodata%20One" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] text-xs font-inter hover:underline">
                <MessageSquare size={13}/>¿Tienes dudas? Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ── */}
      <section style={{ backgroundColor: '#1D2125' }} className="border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/[0.06]">
            {[{value:'+800', label:'Clientes satisfechos'},{value:'4.9 ★', label:'Calificación promedio'},{value:'100%', label:'Envíos en México'}].map(({value, label}) => (
              <div key={label} className="py-1">
                <p className="font-sora font-bold text-brand-amber text-xl sm:text-2xl">{value}</p>
                <p className="text-brand-steel text-xs font-inter mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2b. ÁNGULO ECONÓMICO (exclusivo de esta página) ── */}
      <section style={{ backgroundColor: '#111315' }} className="border-b border-white/[0.06] py-14 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Lo que realmente te cuesta</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight">El dolor no solo molesta. Te cuesta dinero.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: 'Paras antes', desc: 'Cuando la espalda truena a las 6 horas, cortas el turno justo en la hora pico de pedidos.' },
              { icon: Wallet, title: 'Entregas menos', desc: 'Cada hora que no conectas son pedidos que se lleva otro repartidor. Se nota al cierre de semana.' },
              { icon: Check, title: 'Se paga solo', desc: 'Si te devuelve aunque sea medio turno a la semana, el Rodata One ya se pagó el primer mes.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-brand-graphite border border-white/[0.07] rounded-2xl p-5 hover:border-brand-amber/20 transition-colors">
                <div className="h-10 w-10 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mb-3"><Icon size={17} className="text-brand-amber"/></div>
                <h3 className="font-sora font-bold text-brand-offwhite text-base mb-1.5">{title}</h3>
                <p className="text-brand-steel text-sm font-inter leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. LIFESTYLE BREAK ── */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={DLV_HERO_WIDE} alt="Repartidor en moto de noche con el Soporte Lumbar Rodata One" className="w-full h-full object-cover" loading="lazy"/>
          <div className="absolute inset-0" style={{background:'linear-gradient(to right, rgba(17,19,21,0.92) 0%, rgba(17,19,21,0.55) 55%, rgba(17,19,21,0.2) 100%)'}}/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-4 block">Para quien vive arriba de la moto</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-4xl sm:text-5xl leading-[1.05] mb-5">Que el turno lo decidas tú, no tu espalda.</h2>
            <p className="text-brand-smoke text-lg font-inter leading-relaxed">El dolor no avisa: llega a media jornada, cuando mejor están pagando los pedidos. El Rodata One empuja ese momento mucho más lejos de lo que estás acostumbrado.</p>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES ── */}
      <section id="por-que-funciona" style={{backgroundColor:'#111315'}} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Por qué funciona</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl lg:text-5xl">Diseñado para jornadas largas, no para el gimnasio</h2>
          </div>
          <div className="space-y-24">
            {FEATURES.map(({number, icon: Icon, title, desc, image}, idx) => (
              <div key={number} className={cn("grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center", idx % 2 !== 0 && "lg:grid-flow-dense")}>
                <div className={cn("relative rounded-2xl overflow-hidden", idx % 2 !== 0 && "lg:col-start-2")}>
                  <img src={image} alt={title} className="w-full aspect-square object-cover" loading="lazy"/>
                  <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(to bottom, transparent 55%, rgba(17,19,21,0.6) 100%)'}}/>
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

      {/* ── 5. QUOTE BREAK ── */}
      <section className="relative overflow-hidden" style={{minHeight:'40vh'}}>
        <img src={DLV_FEAT_1} alt="Repartidor estirando la espalda al final del turno" className="w-full h-full object-cover absolute inset-0" loading="lazy"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, rgba(17,19,21,0.3) 0%, rgba(17,19,21,0.75) 100%)'}}/>
        <div className="relative z-10 flex items-end min-h-[40vh] pb-10">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <blockquote>
              <p className="font-sora font-semibold text-brand-offwhite text-xl sm:text-2xl mb-2">"Ya cierro las 10 horas y llego a mi casa sin arrastrarme."</p>
              <cite className="text-brand-smoke text-sm font-inter not-italic">Luis M., repartidor en CDMX</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── 6. REVIEWS ── */}
      <section id="opiniones" style={{backgroundColor:'#111315'}} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-2 block">Reseñas verificadas</span>
              <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Lo que dicen los que reparten</h2>
            </div>
            <div className="flex items-center gap-4 bg-brand-graphite border border-white/[0.08] rounded-2xl px-6 py-4 flex-shrink-0">
              <div><p className="font-sora font-bold text-brand-amber text-3xl leading-none">4.9</p><div className="mt-1.5"><Stars count={5} size={11}/></div></div>
              <div className="h-12 w-px bg-white/[0.08]"/>
              <div><p className="text-brand-offwhite font-sora font-bold text-lg leading-none">127</p><p className="text-brand-steel text-xs font-inter mt-1">reseñas</p></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map(({name, city, stars, date, initial, text, photo}) => (
              <div key={name} className="bg-brand-graphite border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col hover:border-brand-amber/20 transition-colors duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={photo} alt={`Foto de ${name} usando el Rodata One`} className="w-full h-full object-cover" loading="lazy"/>
                  <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, transparent 50%, rgba(17,19,21,0.7) 100%)'}}/>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <Check size={10} className="text-brand-amber"/><span className="text-brand-amber text-[10px] font-inter font-medium">Compra verificada</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0"><span className="font-sora font-bold text-brand-amber text-sm">{initial}</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sora font-semibold text-brand-offwhite text-sm">{name}</p>
                      <p className="text-brand-steel text-xs font-inter">{city} · {date}</p>
                    </div>
                  </div>
                  <Stars count={stars} size={12}/>
                  <blockquote className="text-brand-smoke text-sm font-inter leading-relaxed mt-3 flex-1">"{text}"</blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. COMBINED: STEPS + TRUST ── */}
      <section style={{backgroundColor:'#1D2125'}} className="border-y border-white/[0.06] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Simple de usar · Compra sin riesgo</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Listo en segundos. Sin riesgo.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              {step:'1', title:'Ajústalo antes de conectarte', desc:'A la altura lumbar, firme. Toma menos de un minuto.'},
              {step:'2', title:'Ponte la mochila encima', desc:'Va por debajo de los tirantes. No se encima ni estorba.'},
              {step:'3', title:'Sal a repartir', desc:'La diferencia la notas al cerrar el turno.'},
            ].map(({step, title, desc}) => (
              <div key={step} className="flex flex-col items-center text-center group">
                <div className="h-10 w-10 rounded-full bg-brand-amber text-brand-carbon font-sora font-bold text-base flex items-center justify-center mb-4 amber-glow group-hover:scale-105 transition-transform">{step}</div>
                <h3 className="font-sora font-bold text-brand-offwhite text-base mb-1.5">{title}</h3>
                <p className="text-brand-steel text-sm font-inter leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] my-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {icon:RotateCcw, title:'30 días de prueba', desc:'Pruébalo trabajando. Si no, lo resolvemos.'},
              {icon:Ruler, title:'Cambio de talla fácil', desc:'Para que el ajuste sea el correcto.'},
              {icon:Truck, title:'Envío gratis', desc:'Sin costo a todo México.'},
              {icon:MessageSquare, title:'Soporte WhatsApp', desc:'Personas reales que responden.'},
            ].map(({icon: Icon, title, desc}) => (
              <div key={title} className="bg-brand-carbon border border-white/[0.07] rounded-xl p-5 flex items-center gap-4 hover:border-brand-amber/20 transition-colors">
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

      {/* ── 8. FAQ ── */}
      <section id="faq" style={{backgroundColor:'#1D2125'}} className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Resolvemos tus dudas</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl">Preguntas frecuentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map(({q, a}, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-brand-carbon border border-white/[0.07] rounded-xl px-6 data-[state=open]:border-brand-amber/20 transition-colors duration-200">
                <AccordionTrigger className="font-sora font-semibold text-brand-offwhite text-sm py-5 hover:no-underline hover:text-brand-amber [&>svg]:text-brand-amber">{q}</AccordionTrigger>
                <AccordionContent className="text-brand-smoke text-sm font-inter leading-relaxed pb-5">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 9. FINAL CTA ── */}
      <section style={{backgroundColor:'#111315'}} className="border-t border-white/[0.08] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-4 block">Rodata One</span>
          <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight mb-4">¿Cuántos turnos más vas a cortar por la espalda?</h2>
          <p className="text-brand-smoke font-inter text-sm mb-8">Envío gratis en México · 30 días de prueba · Cambio de talla fácil</p>
          <div className="flex items-baseline justify-center gap-3 mb-7">
            <span className="font-sora font-bold text-brand-offwhite text-4xl">{logic.formatMoney(logic.currentPrice)}</span>
            {logic.currentCompareAt && logic.currentCompareAt > logic.currentPrice && <span className="text-brand-steel text-xl line-through font-inter">{logic.formatMoney(logic.currentCompareAt)}</span>}
          </div>
          <button onClick={handlePrimary} className="btn-amber-lg amber-glow font-sora text-base px-12">Comprar ahora<ChevronRight size={18}/></button>
        </div>
      </section>

      {/* ── STICKY BAR ── */}
      {logic.inStock && showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t border-white/[0.1] transition-transform duration-300 ease-out pb-[env(safe-area-inset-bottom)]" style={{backgroundColor:'rgba(17,19,21,0.96)'}}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="hidden md:flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <h3 className="font-sora font-semibold text-brand-offwhite text-sm truncate">{logic.product.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-sora font-bold text-brand-offwhite">{logic.formatMoney(logic.currentPrice)}</span>
                  {logic.currentCompareAt && logic.currentCompareAt > logic.currentPrice && <span className="text-brand-steel text-sm line-through font-inter">{logic.formatMoney(logic.currentCompareAt)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={handlePrimary} className="btn-amber amber-glow font-sora px-8"><ShoppingCart size={14}/>Comprar ahora</button>
                <button onClick={logic.handleAddToCart} className="btn-outline-light font-sora">Agregar al carrito</button>
              </div>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-sora font-bold text-brand-offwhite text-sm">{logic.formatMoney(logic.currentPrice)}</p>
                <p className="text-brand-steel text-xs font-inter truncate">{logic.product.title}</p>
              </div>
              <button onClick={handlePrimary} className="btn-amber amber-glow font-sora flex-shrink-0"><ShoppingCart size={14}/>Comprar ahora</button>
            </div>
          </div>
        </div>
      )}

    </EcommerceTemplate>
  )
}