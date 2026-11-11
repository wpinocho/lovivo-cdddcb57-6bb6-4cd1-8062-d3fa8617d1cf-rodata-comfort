import { useEffect, useMemo, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, ChevronRight, ChevronDown } from 'lucide-react'
import { ALL_REVIEWS, PHOTO_REVIEWS, REVIEW_STATS } from '@/data/rodataReviews'
import {
  ADV_DEFAULT_DEK,
  ADV_DEFAULT_VARIANT,
  ADV_FAQ,
  ADV_MECHANISM_ALT,
  ADV_MECHANISM_IMAGE,
  ADV_ORDERS_CLAIM,
  ADV_PRODUCT_PHOTO,
  ADV_REVIEW_NAMES,
  ADV_SLUG,
  ADV_SOURCES,
  ADV_TRUST_LINE,
  ADV_VARIANTS,
} from '@/data/advertorialEspalda'
import { useAdvertorialTracking, type AdvCta } from '@/hooks/useAdvertorialTracking'
import { trackPH } from '@/lib/tracking-utils'
import { LumbarMechanismIllustration } from '@/components/advertorial/LumbarMechanismIllustration'

const img = (url: string, width: number) => `${url}?width=${width}&quality=75`

const P = ({ children }: { children: ReactNode }) => <p className="mb-5">{children}</p>
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-sora text-2xl sm:text-[1.7rem] font-bold leading-tight text-brand-offwhite mt-12 mb-5">{children}</h2>
)
const B = ({ children }: { children: ReactNode }) => <strong className="text-brand-offwhite">{children}</strong>
const TrustLine = () => <p className="mt-3 text-center text-[13px] leading-snug text-brand-steel">{ADV_TRUST_LINE}</p>
const ratingLabel = `${REVIEW_STATS.average.toFixed(1)} de 5 · ${REVIEW_STATS.total} reseñas reales`

export default function AdvertorialEspalda() {
  const [searchParams] = useSearchParams()
  const vParam = searchParams.get('v') ?? ''
  const variantKey = ADV_VARIANTS[vParam] ? vParam : ADV_DEFAULT_VARIANT
  const variant = ADV_VARIANTS[variantKey]
  const { showSticky, ctaHref, onCtaClick } = useAdvertorialTracking(variantKey)

  const reviews = useMemo(
    () => ADV_REVIEW_NAMES.map((n) => ALL_REVIEWS.find((r) => r.name === n)).filter(Boolean) as typeof ALL_REVIEWS,
    []
  )

  useEffect(() => {
    document.title = 'Por qué duele la espalda baja al andar en moto | RODATA'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, follow'
    document.head.appendChild(robots)
    return () => { document.head.removeChild(robots) }
  }, [])

  const ctaProps = (cta: AdvCta) => ({ to: ctaHref(cta), onClick: () => onCtaClick(cta) })
  const buttonCls = 'flex w-full items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 py-4 font-sora text-base font-bold text-brand-carbon transition-colors hover:bg-brand-amber-light active:scale-[0.99]'

  return (
    <div className="min-h-screen bg-brand-carbon text-brand-smoke font-inter">
      {/* Bloque 0 */}
      <header className="border-b border-brand-graphite">
        <div className="mx-auto flex max-w-[680px] items-center px-5 py-3">
          <span className="font-sora font-extrabold text-lg tracking-[0.08em] uppercase select-none">
            <span className="text-brand-offwhite">RODA</span><span className="text-brand-amber">TA</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[680px] px-5 pb-32 pt-8 text-[18px] leading-[1.7]">
        <article>
          {/* Bloque 1 */}
          <h1 className="font-sora text-[1.85rem] sm:text-4xl font-extrabold leading-[1.15] text-brand-offwhite">{variant.headline}</h1>
          <p className="mt-4 text-[1.1rem] leading-relaxed text-brand-smoke">{variant.dek ?? ADV_DEFAULT_DEK}</p>
          <p className="mt-4 text-sm text-brand-steel">Por el equipo de Rodata · Lectura de 3 minutos</p>

          {/* Bloque 2 */}
          <img
            src={img(variant.heroImage, 1100)}
            srcSet={`${img(variant.heroImage, 700)} 700w, ${img(variant.heroImage, 1100)} 1100w`}
            sizes="(max-width: 680px) 100vw, 680px"
            alt={variant.heroAlt}
            width={1100}
            height={1100}
            fetchPriority="high"
            style={{ aspectRatio: variant.heroAspect ?? '1 / 1' }}
            className="mt-6 -mx-5 w-[calc(100%+2.5rem)] max-w-none bg-brand-graphite object-cover object-top sm:mx-0 sm:w-full sm:rounded-xl"
          />

          {/* Bloque 3 */}
          <div className="mt-8">
            <P><strong className="text-brand-offwhite">Kilómetro 150.</strong> La moto va perfecta: medio tanque, motor fresco, carretera libre.</P>
            <P>Y aun así, alguien del grupo levanta la mano y pide parada en la siguiente gasolinera.</P>
            <P><strong className="text-brand-offwhite">No es por gasolina. Es por la espalda.</strong></P>
            <P>Cualquiera que ruede en carretera conoce la escena: bajarse despacio, llevarse las manos a la cintura, estirarse junto a la bomba. Y casi siempre la misma explicación: "es que ya no tengo veinte años".</P>
            <P>Suena lógico. Pero no es lo que muestran los datos.</P>
          </div>

          {/* Bloque 4 */}
          <H2>Les pasa a 4 de cada 10. También a los de veintitantos.</H2>
          <P>
            Investigadores en varios países han estudiado a gente que pasa horas diarias arriba de la moto: repartidores, mototaxistas, gente que va y viene del trabajo. En tres estudios distintos, <B>entre 4 y 6 de cada 10</B> tenían dolor de espalda baja.
          </P>
          <P>
            Y no eran solo señores de cincuenta. En otro estudio con estudiantes universitarios que van en moto, con <B>22 años de edad promedio</B>, más de la mitad lo tenía. Lo que más se relacionó con el dolor fue <B>el tiempo diario arriba de la moto</B>.
          </P>
          <P>La edad puede sumar. Pero no explica por qué le pasa a alguien de veintidós.</P>

          {/* Bloque 5 */}
          <H2>Lo que la moto sí trae, y lo que no</H2>
          <P>Una moto de carretera está llena de ingeniería: suspensión para el pavimento, asiento para el peso, parabrisas para el viento.</P>
          <P><strong className="text-brand-offwhite">Para la espalda baja no trae nada.</strong></P>
          <P>En un coche, el respaldo carga el peso del torso. En la moto, ese trabajo lo hacen los músculos de la zona lumbar: sostienen el cuerpo inclinado hacia adelante, sin apoyo, durante todo el trayecto.</P>
          <P>No es un esfuerzo fuerte. Es un esfuerzo que no descansa.</P>
          <P>Por eso la molestia no aparece en el kilómetro 10 sino en el 150. No es falta de aguante ni de condición. Es un músculo haciendo el trabajo de un respaldo que no existe.</P>
          {ADV_MECHANISM_IMAGE && ADV_MECHANISM_IMAGE !== variant.heroImage ? (
            <figure className="my-8">
              <img
                src={img(ADV_MECHANISM_IMAGE, 1100)}
                srcSet={`${img(ADV_MECHANISM_IMAGE, 700)} 700w, ${img(ADV_MECHANISM_IMAGE, 1100)} 1100w`}
                sizes="(max-width: 680px) 100vw, 680px"
                alt={ADV_MECHANISM_ALT}
                width={1254}
                height={1254}
                loading="lazy"
                decoding="async"
                className="-mx-5 block aspect-square w-[calc(100%+2.5rem)] max-w-none object-cover sm:mx-0 sm:w-full sm:rounded-xl"
              />
              <figcaption className="mt-3 text-base leading-snug text-brand-smoke">
                <B>En el coche, el respaldo carga el torso.</B> En la moto, ese trabajo lo hace la espalda baja, sola, todo el trayecto.
              </figcaption>
            </figure>
          ) : (
            <figure className="my-8">
              <div className="-mx-5 overflow-hidden border-y border-brand-graphite bg-brand-graphite/40 px-2 py-3 sm:mx-0 sm:rounded-xl sm:border sm:p-4">
                <LumbarMechanismIllustration />
              </div>
              <figcaption className="mt-3 text-base leading-snug text-brand-smoke">
                <B>Aquí trabaja el músculo, sin ningún apoyo.</B> Sostiene el torso inclinado durante todo el trayecto.
              </figcaption>
            </figure>
          )}
          <Link {...ctaProps('cta1_mecanismo')} className="group inline-flex items-center gap-1 font-semibold text-brand-amber-light underline decoration-brand-amber/50 underline-offset-4">
            Ver el soporte lumbar hecho para manejar moto
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Bloque 6 */}
          <H2>Tres arreglos comunes, y por qué se quedan cortos</H2>
          <P><strong className="text-brand-offwhite">La faja de farmacia o de gimnasio.</strong> Está hecha para estar de pie o para cargar peso unos segundos. Sentado e inclinado estorba, se sube y se afloja antes de la primera hora.</P>
          <P><strong className="text-brand-offwhite">Parar a estirar.</strong> Ayuda, pero es un descanso, no un soporte. De vuelta en la moto, el músculo vuelve a trabajar solo.</P>
          <P><strong className="text-brand-offwhite">Cambiar el asiento.</strong> Mejora dónde va sentado el piloto, no qué lo sostiene. Y cuesta varias veces más.</P>

          {/* Bloque 7 */}
          <H2>Rodata One: el respaldo que la moto no trae</H2>
          <P>Si el problema es que la moto no trae respaldo para la espalda baja, la solución es llevarlo puesto. Eso es <B>Rodata One</B>: un soporte lumbar diseñado para ir sentado e inclinado arriba de una moto, no adaptado de otro uso.</P>
          <ul className="mb-6 space-y-3">
            {[
              ['Placa al centro.', 'Da apoyo justo en la zona lumbar, donde la moto no pone nada.'],
              ['Correas cruzadas.', 'El ajuste se queda firme toda la ruta, sin subirse ni aflojarse.'],
              ['Malla transpirable.', 'Pensada para el calor de carretera.'],
              ['Ligera y delgada.', 'Va debajo de la chamarra y no estorba al manejar.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full bg-brand-amber" />
                <span><strong className="text-brand-offwhite">{t}</strong> {d}</span>
              </li>
            ))}
          </ul>
          <figure className="my-8">
            <img
              src={img(ADV_PRODUCT_PHOTO, 900)}
              alt="Cliente de RODATA con el soporte lumbar Rodata One puesto, de espaldas junto a su moto"
              loading="lazy"
              decoding="async"
              width={900}
              height={1244}
              className="w-full rounded-xl aspect-[4/5] object-cover"
            />
            <figcaption className="mt-2 text-sm text-brand-steel">Leonel B., cliente de RODATA, con su Rodata One.</figcaption>
          </figure>
          <Link {...ctaProps('cta2_producto')} className={buttonCls}>Ver Rodata One y elegir mi talla</Link>
          <TrustLine />

          {/* Bloque 8 */}
          <H2>Lo que dicen quienes ya la usan</H2>
          <P>Rodata se hizo para resolver una sola cosa: ese hueco en el equipo del motociclista. Hoy suma {ADV_ORDERS_CLAIM} entre riders de carretera, repartidores y gente que va diario al trabajo en moto.</P>
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-brand-amber text-brand-amber" />
            <span className="font-semibold text-brand-offwhite">{ratingLabel}</span>
          </div>
          <div className="space-y-4">
            {reviews.map((r) => (
              <blockquote key={r.name} className="rounded-xl border border-brand-graphite bg-brand-graphite/50 p-5">
                <div className="mb-2 flex gap-0.5" aria-label={`${r.stars} de 5 estrellas`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.stars ? 'fill-brand-amber text-brand-amber' : 'text-brand-steel'}`} />
                  ))}
                </div>
                <p className="text-[17px] leading-relaxed text-brand-smoke">"{r.text}"</p>
                <footer className="mt-3 flex items-center gap-3">
                  {r.photo && (
                    <img src={r.photo.replace(/\?.*$/, '?width=80&height=80&resize=cover&quality=75')} alt={r.name} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <span className="text-sm">
                    <span className="font-semibold text-brand-offwhite">{r.name}</span>
                    {r.tag && <span className="text-brand-steel"> · {r.tag}</span>}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-8 mb-3 text-sm font-semibold text-brand-offwhite">Fotos reales de clientes</p>
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
            {PHOTO_REVIEWS.filter((r) => r.photo).map((r) => (
              <figure key={r.name} className="w-[42%] shrink-0 snap-start sm:w-[30%]">
                <img
                  src={r.photo!.replace(/\?.*$/, '?width=360&quality=70')}
                  alt={`${r.name}, cliente de RODATA, con su Rodata One`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: r.photoPos ?? '50% 50%' }}
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
                <figcaption className="mt-1.5 text-xs text-brand-steel">{r.name}</figcaption>
              </figure>
            ))}
          </div>

          {/* Bloque 8b — Preguntas */}
          <H2>Lo que más preguntan</H2>
          <div className="divide-y divide-brand-graphite border-y border-brand-graphite">
            {ADV_FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group py-1"
                onToggle={(e) => {
                  if ((e.currentTarget as HTMLDetailsElement).open) trackPH('advertorial_faq_open', { advertorial: ADV_SLUG, variant: variantKey, q })
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-sora text-[17px] font-semibold text-brand-offwhite [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-amber transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-[17px] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          {/* Bloque 9 */}
          <H2>Úsala en tu siguiente rodada</H2>
          <P><B>Kilómetro 150.</B> Medio tanque, carretera libre. Esta vez, si el grupo para en la gasolinera, que sea por gasolina.</P>
          <P>Tienes 30 días para devolverla si no te convence, y te reembolsamos tu dinero. Envío gratis a todo México, tallas de la S a la XL, y el primer cambio de talla no tiene costo.</P>
          <Link {...ctaProps('cta3_cierre')} className={buttonCls}>Elegir mi talla</Link>
          <TrustLine />
        </article>

        {/* Pie */}
        <footer id="fuentes" className="mt-16 border-t border-brand-graphite pt-6 text-xs leading-relaxed text-brand-steel">
          <p className="mb-4">Información general; no sustituye la valoración de un profesional de la salud.</p>
          <details>
            <summary className="cursor-pointer select-none text-brand-smoke">Ver estudios citados ({ADV_SOURCES.length})</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-4">
              {ADV_SOURCES.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="nofollow noopener noreferrer" className="underline underline-offset-2 hover:text-brand-smoke">{s.label}</a>
                </li>
              ))}
            </ol>
          </details>
          <p className="mt-6">
            <Link to="/politica-de-devoluciones" className="underline underline-offset-2">Política de devoluciones</Link>
            {' · '}
            <Link to="/aviso-de-privacidad" className="underline underline-offset-2">Aviso de privacidad</Link>
          </p>
        </footer>
      </main>

      {/* Barra fija (aparece al 40 % de scroll) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-graphite bg-brand-carbon/95 backdrop-blur transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-hidden={!showSticky}
      >
        <div className="mx-auto flex max-w-[680px] items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-sora text-sm font-bold text-brand-offwhite">Rodata One</p>
            <p className="flex items-center gap-1 truncate text-xs text-brand-steel">
              <Star className="h-3 w-3 shrink-0 fill-brand-amber text-brand-amber" />
              {REVIEW_STATS.average.toFixed(1)} · {REVIEW_STATS.total} reseñas
            </p>
          </div>
          <Link {...ctaProps('sticky')} tabIndex={showSticky ? 0 : -1} className="shrink-0 rounded-lg bg-brand-amber px-5 py-3 font-sora text-sm font-bold text-brand-carbon hover:bg-brand-amber-light">
            Ver tallas
          </Link>
        </div>
      </div>
    </div>
  )
}