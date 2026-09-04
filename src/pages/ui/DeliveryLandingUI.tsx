// DeliveryLandingUI — rodata.mx · landing dedicada al avatar "repartidor de plataformas"
// Tráfico pagado (Meta) → mobile-first, nav reducida, un solo CTA.
import React, { useEffect, useRef, useState } from "react"
import ProductExpressCheckout from "@/components/ProductExpressCheckout"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star, Check, Ruler, Truck, ShieldCheck, ChevronDown, ChevronUp,
  Clock, Wallet, Wind, SlidersHorizontal, Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { useProductLogic } from "@/components/headless/HeadlessProduct"
import { getDeliveryRangeLong } from "@/lib/delivery-estimate"

// ── Imágenes (Supabase image transform para performance) ──
const SB_PROD = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf'

const DLV_HERO   = `${SB_PROD}/dlv-hero.webp?width=1400&quality=75`
const DLV_FEAT_1 = `${SB_PROD}/dlv-feat-1.webp?width=800&quality=75`
const DLV_FEAT_2 = `${SB_PROD}/dlv-feat-2.webp?width=800&quality=75`
const DLV_FEAT_3 = `${SB_PROD}/dlv-feat-3.webp?width=800&quality=75`

const REVIEW_IMG_1 = `${SB_PROD}/review-1.webp?width=600&quality=75`
const REVIEW_IMG_2 = `${SB_PROD}/review-2.webp?width=600&quality=75`
const REVIEW_IMG_3 = `${SB_PROD}/review-3.webp?width=600&quality=75`

const AVATAR_1 = `${SB_PROD}/avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_2 = `${SB_PROD}/avatar-jorge-v3.webp?width=72&height=72&resize=cover&quality=80`
const AVATAR_3 = `${SB_PROD}/avatar-andres-v3.webp?width=72&height=72&resize=cover&quality=80`

// ── Helpers ──
const getSizeKey = (value: string) => (value.includes('(') ? value.split('(')[0].trim() : value)

/** Fecha estimada de entrega — lógica compartida con el checkout */
const getDeliveryDate = () => getDeliveryRangeLong()

// ── Data ──
const SIZE_GUIDE = [
  { size: 'S',  waist: '60–75 cm',   recom: 'Cintura delgada' },
  { size: 'M',  waist: '75–90 cm',   recom: 'Talla promedio'  },
  { size: 'L',  waist: '90–100 cm',  recom: 'Talla grande'    },
  { size: 'XL', waist: '100–115 cm', recom: 'Extra grande'    },
]

const FEATURES: { number: string; icon: React.ElementType; title: string; desc: React.ReactNode; image: string }[] = [
  {
    number: '01', icon: Layers, image: DLV_FEAT_1,
    title: 'Aguanta el turno completo sin que la espalda te pare',
    desc: (
      <>
        Manejas inclinado hacia adelante, con peso a la espalda, hora tras hora.{' '}
        <strong className="text-brand-smoke">Esa postura carga tu zona lumbar y no lo sientes hasta que ya duele</strong> —
        normalmente a media jornada, justo cuando mejor pagan los pedidos. El Rodata One trabaja exactamente ahí:{' '}
        <strong className="text-brand-smoke">soporte firme que reparte esa tensión</strong> para que llegues completo al final del turno.
      </>
    ),
  },
  {
    number: '02', icon: SlidersHorizontal, image: DLV_FEAT_2,
    title: 'Te subes y bajas 40 veces al día. No se mueve',
    desc: (
      <>
        No es una faja rígida de gimnasio que te estorba al bajarte de la moto.{' '}
        <strong className="text-brand-smoke">Es flexible y se mueve contigo</strong>: caminas, subes escaleras, tocas timbres, vuelves a arrancar.
        El sistema de doble correa lo mantiene{' '}
        <strong className="text-brand-smoke">en el mismo lugar desde el primer pedido hasta el último</strong>, y se ajusta en segundos sin bajarte.
      </>
    ),
  },
  {
    number: '03', icon: Wind, image: DLV_FEAT_3,
    title: 'No estorba con la mochila ni da calor',
    desc: (
      <>
        Va abajo de la mochila térmica, sobre la cintura —{' '}
        <strong className="text-brand-smoke">sin encimarse con los tirantes ni con el cinturón</strong>.
        Textil negro mate con{' '}
        <strong className="text-brand-smoke">malla perforada transpirable</strong> para jornadas largas de ciudad,
        y perfil bajo para que no se note bajo la sudadera o la chamarra.
      </>
    ),
  },
]

const REVIEWS = [
  {
    name: 'Luis M.', city: 'CDMX · 10 hrs conectado', avatar: AVATAR_1, image: REVIEW_IMG_1,
    title: 'Ya termino el turno completo',
    text: 'Llevo 2 años repartiendo. Antes como a las 6 horas ya andaba parando cada rato por la espalda baja. Con esto ya cierro las 10 horas y llego a mi casa sin arrastrarme. Se paga solo en como 3 días de trabajo.',
  },
  {
    name: 'Ernesto R.', city: 'Ecatepec · turnos dobles', avatar: AVATAR_2, image: REVIEW_IMG_2,
    title: 'No se mueve aunque me baje mil veces',
    text: 'Lo que más me sacaba de onda era que las fajas normales se me corrían al bajarme de la moto. Esta no. Me la ajusto en la mañana y ni la vuelvo a tocar. Abajo de la sudadera ni se ve.',
  },
  {
    name: 'Diego A.', city: 'Guadalajara · scooter', avatar: AVATAR_3, image: REVIEW_IMG_3,
    title: 'Con la mochila puesta no estorba',
    text: 'Pensé que me iba a estorbar con la caja térmica y para nada, queda abajo. Con el calor de aquí sí se siente fresca, tiene malla. Me llegó en 3 días a Guadalajara.',
  },
]

const FAQS = [
  {
    q: '¿Aguanta subir y bajar de la moto todo el día?',
    a: 'Sí, está pensado justo para eso. No es una faja rígida: el panel lumbar da soporte pero el textil es flexible, así que puedes bajarte, caminar, subir escaleras y volver a arrancar sin quitártelo ni reajustarlo.',
  },
  {
    q: '¿Da calor en jornadas largas?',
    a: 'Tiene malla perforada transpirable en los laterales, que es la zona donde más se acumula el calor. En clima de ciudad mexicana funciona bien incluso en turnos de 10 a 12 horas.',
  },
  {
    q: '¿Estorba con la mochila térmica?',
    a: 'No. Va sobre la cintura, por debajo de la mochila y de los tirantes. Es de perfil bajo, así que no se encima con la caja ni con el cinturón.',
  },
  {
    q: '¿Sirve igual en scooter que en moto de trabajo?',
    a: 'Sí. Lo que importa no es la moto, es la postura inclinada y las horas encima. Funciona en scooter, motoneta y motos de trabajo por igual.',
  },
  {
    q: '¿Qué talla pido?',
    a: 'Mide tu cintura por encima del pantalón, a la altura del ombligo. S: 60–75 cm · M: 75–90 cm · L: 90–100 cm · XL: 100–115 cm. Si quedas justo entre dos, pide la mayor.',
  },
  {
    q: '¿Cuánto tarda en llegar y cuánto cuesta el envío?',
    a: 'Envío gratis a todo México. Normalmente llega en 4 a 7 días con número de rastreo.',
  },
  {
    q: '¿Y si no me funciona?',
    a: 'Tienes 30 días para probarlo trabajando. Si no te sirve, escríbenos por WhatsApp y te ayudamos con el cambio o la devolución.',
  },
]

interface DeliveryLandingUIProps {
  logic: ReturnType<typeof useProductLogic>
}

export const DeliveryLandingUI = ({ logic }: DeliveryLandingUIProps) => {
  const {
    product, loading, notFound, options, hasVariants, selected,
    currentPrice, currentCompareAt, inStock, matchingVariant, discountPercentage,
    quantity, isBuyingNow, handleBuyNow, handleOptionSelect, isOptionValueAvailable,
    formatMoney, canAddToCart,
  } = logic

  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const [walletAvailable, setWalletAvailable] = useState(false)
  const buyBlockRef = useRef<HTMLDivElement>(null)

  // ── SEO: landing de ads → noindex + canonical a la PDP principal ──
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Soporte lumbar para repartidores | Rodata One'

    const setMeta = (attr: 'name' | 'rel', key: string, value: string, tag: 'meta' | 'link' = 'meta') => {
      let el = document.querySelector(`${tag}[${attr}="${key}"]`) as HTMLMetaElement | HTMLLinkElement | null
      let created = false
      if (!el) {
        el = document.createElement(tag) as HTMLMetaElement | HTMLLinkElement
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        created = true
      }
      if (tag === 'meta') (el as HTMLMetaElement).content = value
      else (el as HTMLLinkElement).href = value
      return { el, created }
    }

    const desc = setMeta('name', 'description', 'Soporte lumbar diseñado para la postura inclinada al manejar. Aguanta turnos de 8 a 12 horas sobre la moto sin que la espalda te obligue a parar. Envío gratis en México.')
    const robots = setMeta('name', 'robots', 'noindex, follow')
    const canonical = setMeta('rel', 'canonical', `${window.location.origin}/productos/soporte-lumbar-rodata-one`, 'link')

    return () => {
      document.title = prevTitle
      if (robots.created) robots.el.remove()
      if (desc.created) desc.el.remove()
      if (canonical.created) canonical.el.remove()
    }
  }, [])

  // ── Sticky bar: aparece cuando el bloque de compra sale de pantalla ──
  useEffect(() => {
    const node = buyBlockRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [product])

  const scrollToBuy = () => buyBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-carbon px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl bg-brand-graphite" />
          <Skeleton className="h-10 w-3/4 bg-brand-graphite" />
          <Skeleton className="h-24 w-full bg-brand-graphite" />
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-carbon px-6 text-center">
        <div>
          <h1 className="font-sora text-2xl font-bold text-brand-offwhite">Producto no disponible</h1>
          <a href="/" className="mt-4 inline-block text-brand-amber underline">Volver al inicio</a>
        </div>
      </div>
    )
  }

  const sizeOption = options?.find((o: any) => o.name.toLowerCase() === 'talla') ?? options?.[0]
  const sizeOptionName: string = sizeOption?.name ?? ''
  const selectedSize: string | undefined = selected[sizeOptionName]

  const BuyButton = ({ full = true }: { full?: boolean }) => (
    <button
      onClick={handleBuyNow}
      disabled={!canAddToCart || isBuyingNow}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 py-4 font-sora text-base font-bold text-brand-carbon transition-all",
        "hover:bg-brand-amber-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        full && "w-full"
      )}
    >
      {isBuyingNow ? 'Procesando…' : inStock ? 'Pedir el mío ahora' : 'Agotado'}
    </button>
  )

  return (
    <div className="min-h-screen bg-brand-carbon font-inter text-brand-smoke">
      {/* ── Header minimal (sin links de salida) ── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-brand-carbon/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-sora text-lg font-extrabold tracking-tight text-brand-offwhite">RODATA</span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-brand-amber sm:text-xs">
            <Truck className="h-3.5 w-3.5" /> Envío gratis en México
          </span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative">
        <img
          src={DLV_HERO}
          alt="Repartidor en moto en la ciudad usando el soporte lumbar Rodata One"
          className="h-[58vw] max-h-[440px] w-full object-cover object-center sm:h-[380px]"
          loading="eager"
          width={1400}
          height={1050}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/50 to-transparent" />
      </section>

      <section className="relative -mt-20 px-4 pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-amber">
            Diseñado para jornadas de 8 a 12 horas sobre la moto
          </p>
          <h1 className="mt-3 font-sora text-3xl font-extrabold leading-[1.1] text-brand-offwhite sm:text-5xl">
            Acortar tu turno<br className="sm:hidden" /> te cuesta entregas.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-brand-smoke sm:text-lg">
            Soporte lumbar diseñado para la <strong className="text-brand-offwhite">postura inclinada al manejar</strong>.
            Para que la espalda no sea la que decida a qué hora te desconectas.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <BuyButton full={false} />
            <p className="text-xs text-brand-steel">
              {formatMoney(currentPrice)} · Envío gratis · 30 días de garantía
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-white/5 bg-brand-graphite">
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/5">
          {[
            { icon: Truck, label: 'Envío gratis', sub: 'Todo México' },
            { icon: ShieldCheck, label: '30 días', sub: 'De garantía' },
            { icon: Clock, label: '3–5 días', sub: 'Con rastreo' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-2 py-4 text-center">
              <Icon className="h-4 w-4 text-brand-amber" />
              <span className="font-sora text-xs font-bold text-brand-offwhite sm:text-sm">{label}</span>
              <span className="text-[10px] text-brand-steel sm:text-xs">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ángulo económico ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-sora text-2xl font-extrabold leading-tight text-brand-offwhite sm:text-3xl">
            El dolor no solo molesta. Te cuesta dinero.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed sm:text-base">
            Cuando la espalda te obliga a parar, no paras "un ratito". Cortas el turno en la hora pico,
            que es justo cuando mejor pagan los pedidos. Y al día siguiente arrancas peor.
          </p>
          <div className="mt-6 space-y-3">
            {[
              'Parar 2 horas antes = pedidos que se van a otro repartidor.',
              'Un día de descanso forzado = un día sin ingreso.',
              'La postura no cambia: mientras trabajes en moto, la carga lumbar sigue ahí.',
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 rounded-xl border border-white/5 bg-brand-graphite px-4 py-3">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" />
                <span className="text-sm leading-relaxed">{line}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-brand-offwhite sm:text-base">
            El Rodata One cuesta <strong className="text-brand-amber">{formatMoney(currentPrice)}</strong> una sola vez.
            Si te ahorra un solo turno cortado, ya se pagó.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-brand-graphite px-4 py-14">
        <div className="mx-auto max-w-4xl space-y-14">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.number}
                className={cn(
                  "flex flex-col gap-6 md:flex-row md:items-center md:gap-10",
                  i % 2 === 1 && "md:flex-row-reverse"
                )}
              >
                <div className="md:w-1/2">
                  <img
                    src={f.image}
                    alt={f.title}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-brand-amber" />
                    <span className="font-sora text-xs font-bold tracking-widest text-brand-steel">{f.number}</span>
                  </div>
                  <h3 className="mt-2 font-sora text-xl font-extrabold leading-tight text-brand-offwhite sm:text-2xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed sm:text-[15px]">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Bloque de compra ── */}
      <section ref={buyBlockRef} className="scroll-mt-24 px-4 py-14">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/8 bg-brand-graphite p-5 sm:p-7">
          <h2 className="font-sora text-xl font-extrabold text-brand-offwhite sm:text-2xl">
            Elige tu talla y pídelo hoy
          </h2>

          {/* Precio */}
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-sora text-3xl font-extrabold text-brand-offwhite">{formatMoney(currentPrice)}</span>
            {currentCompareAt && currentCompareAt > currentPrice && (
              <>
                <span className="text-base text-brand-steel line-through">{formatMoney(currentCompareAt)}</span>
                {discountPercentage && (
                  <span className="rounded-md bg-brand-amber px-2 py-0.5 font-sora text-xs font-bold text-brand-carbon">
                    -{discountPercentage}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Tallas */}
          {hasVariants && sizeOption && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="font-sora text-sm font-bold text-brand-offwhite">Talla</span>
                <button
                  onClick={() => setShowSizeGuide((v) => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-brand-amber"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Guía de tallas
                  {showSizeGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {sizeOption.values.map((value: string) => {
                  const available = isOptionValueAvailable(sizeOption.name, value)
                  const active = selected[sizeOption.name] === value
                  return (
                    <button
                      key={value}
                      disabled={!available}
                      onClick={() => handleOptionSelect(sizeOption.name, value)}
                      className={cn(
                        "rounded-xl border py-3 font-sora text-sm font-bold transition-all",
                        active
                          ? "border-brand-amber bg-brand-amber text-brand-carbon"
                          : "border-white/10 bg-brand-carbon text-brand-smoke hover:border-white/25",
                        !available && "cursor-not-allowed opacity-35 line-through"
                      )}
                    >
                      {getSizeKey(value)}
                    </button>
                  )
                })}
              </div>

              {showSizeGuide && (
                <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-carbon text-brand-steel">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Talla</th>
                        <th className="px-3 py-2 font-semibold">Cintura</th>
                        <th className="px-3 py-2 font-semibold">Recomendada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {SIZE_GUIDE.map((r) => (
                        <tr key={r.size}>
                          <td className="px-3 py-2 font-sora font-bold text-brand-offwhite">{r.size}</td>
                          <td className="px-3 py-2">{r.waist}</td>
                          <td className="px-3 py-2 text-brand-steel">{r.recom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="bg-brand-carbon px-3 py-2 text-[11px] text-brand-steel">
                    Mide sobre el pantalón, a la altura del ombligo. Si quedas entre dos tallas, pide la mayor.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <BuyButton />

            {product && (
              <>
                {walletAvailable && (
                  <div className="flex items-center gap-3 py-1">
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="text-[11px] uppercase tracking-wider text-brand-steel">o paga rápido con</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                )}
                <ProductExpressCheckout
                  product={product}
                  variant={matchingVariant}
                  quantity={quantity}
                  unitPrice={currentPrice}
                  disabled={!canAddToCart}
                  onAvailabilityChange={setWalletAvailable}
                />
              </>
            )}
          </div>

          <ul className="mt-5 space-y-2 text-xs text-brand-smoke">
            {[
              `Llega aprox. entre el ${getDeliveryDate()}`,
              'Envío gratis a todo México con número de rastreo',
              '30 días para probarlo trabajando',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-amber" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-brand-graphite px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-amber text-brand-amber" />
              ))}
            </div>
            <h2 className="mt-3 font-sora text-2xl font-extrabold text-brand-offwhite sm:text-3xl">
              Repartidores que ya cerraron el turno completo
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <article key={r.name} className="overflow-hidden rounded-2xl border border-white/8 bg-brand-carbon">
                <img src={r.image} alt={`Reseña de ${r.name}`} loading="lazy" width={600} height={600}
                     className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-brand-amber text-brand-amber" />
                    ))}
                  </div>
                  <h3 className="mt-2 font-sora text-sm font-bold text-brand-offwhite">{r.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed">{r.text}</p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-white/5 pt-3">
                    <img src={r.avatar} alt={r.name} loading="lazy" width={36} height={36}
                         className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="font-sora text-xs font-bold text-brand-offwhite">{r.name}</p>
                      <p className="text-[11px] text-brand-steel">{r.city}</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-brand-amber">
                      <Check className="h-3 w-3" /> Verificada
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-sora text-2xl font-extrabold text-brand-offwhite sm:text-3xl">
            Lo que preguntan los repartidores
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-white/8">
                <AccordionTrigger className="text-left font-sora text-sm font-bold text-brand-offwhite hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-brand-smoke">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="border-t border-white/5 bg-brand-graphite px-4 py-14 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-sora text-2xl font-extrabold leading-tight text-brand-offwhite sm:text-3xl">
            Mañana vas a volver a subirte a la moto.<br />La pregunta es cómo vas a bajarte.
          </h2>
          <p className="mt-4 text-[15px]">
            {formatMoney(currentPrice)} una sola vez · Envío gratis · 30 días para probarlo trabajando.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={scrollToBuy}
              className="rounded-xl bg-brand-amber px-8 py-4 font-sora text-base font-bold text-brand-carbon transition-all hover:bg-brand-amber-light active:scale-[0.98]"
            >
              Pedir el mío ahora
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-8 text-center">
        <p className="font-sora text-sm font-extrabold tracking-tight text-brand-offwhite">RODATA</p>
        <p className="mt-2 text-[11px] text-brand-steel">
          Rodata no sustituye atención médica. Si tienes una lesión, consulta a un profesional.
        </p>
        <div className="mt-3 flex justify-center gap-4 text-[11px] text-brand-steel">
          <a href="/terminos-y-condiciones" className="hover:text-brand-smoke">Términos</a>
          <a href="/aviso-de-privacidad" className="hover:text-brand-smoke">Privacidad</a>
        </div>
      </footer>

      {/* ── Sticky bar mobile-first ── */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-carbon/97 backdrop-blur transition-transform duration-300",
          showSticky ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-sora text-sm font-bold text-brand-offwhite">Rodata One</p>
            <p className="text-xs text-brand-steel">
              {formatMoney(currentPrice)}
              {selectedSize ? ` · ${getSizeKey(selectedSize)}` : ' · Elige talla'}
            </p>
          </div>
          <button
            onClick={selectedSize ? handleBuyNow : scrollToBuy}
            disabled={isBuyingNow}
            className="shrink-0 rounded-xl bg-brand-amber px-5 py-3 font-sora text-sm font-bold text-brand-carbon transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isBuyingNow ? 'Procesando…' : selectedSize ? 'Pedirlo' : 'Elegir talla'}
          </button>
        </div>
      </div>
      <div className="h-20" />
    </div>
  )
}