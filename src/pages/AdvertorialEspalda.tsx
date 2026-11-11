import { useEffect, useMemo, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, ChevronRight } from 'lucide-react'
import { ALL_REVIEWS } from '@/data/rodataReviews'
import {
  ADV_DEFAULT_VARIANT,
  ADV_MECHANISM_IMAGE,
  ADV_ORDERS_CLAIM,
  ADV_PRODUCT_PHOTO,
  ADV_REVIEW_NAMES,
  ADV_SOURCES,
  ADV_VARIANTS,
  advSource,
} from '@/data/advertorialEspalda'
import { useAdvertorialTracking, type AdvCta } from '@/hooks/useAdvertorialTracking'
import { LumbarMechanismIllustration } from '@/components/advertorial/LumbarMechanismIllustration'

const img = (url: string, width: number) => `${url}?width=${width}&quality=75`

const P = ({ children }: { children: ReactNode }) => <p className="mb-5">{children}</p>
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-sora text-2xl sm:text-[1.7rem] font-bold leading-tight text-brand-offwhite mt-12 mb-5">{children}</h2>
)
const Cite = ({ id, children }: { id: string; children: ReactNode }) => (
  <a href={advSource(id)} target="_blank" rel="noopener noreferrer" className="text-brand-offwhite font-semibold underline decoration-brand-amber/60 underline-offset-4 hover:decoration-brand-amber">
    {children}
  </a>
)

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
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-5 py-3">
          <span className="font-sora font-extrabold text-lg tracking-[0.08em] uppercase select-none">
            <span className="text-brand-offwhite">RODA</span><span className="text-brand-amber">TA</span>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-steel">Contenido de Rodata</span>
        </div>
      </header>

      <main className="mx-auto max-w-[680px] px-5 pb-32 pt-8 text-[18px] leading-[1.7]">
        <article>
          {/* Bloque 1 */}
          <h1 className="font-sora text-[1.85rem] sm:text-4xl font-extrabold leading-[1.15] text-brand-offwhite">{variant.headline}</h1>
          <p className="mt-4 text-[1.1rem] leading-relaxed text-brand-smoke">
            La moto trae suspensión, asiento y parabrisas. Lo único que no trae es algo que sostenga al piloto durante horas.
          </p>
          <p className="mt-4 text-sm text-brand-steel">Por el equipo de Rodata · Lectura de 3 minutos</p>

          {/* Bloque 2 */}
          <img
            src={img(variant.heroImage, 1100)}
            srcSet={`${img(variant.heroImage, 700)} 700w, ${img(variant.heroImage, 1100)} 1100w`}
            sizes="(max-width: 680px) 100vw, 680px"
            alt={variant.heroAlt}
            width={1100}
            height={733}
            fetchPriority="high"
            className="mt-6 -mx-5 w-[calc(100%+2.5rem)] max-w-none aspect-[3/2] object-cover sm:mx-0 sm:w-full sm:rounded-xl"
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
            Varios estudios han medido el dolor lumbar en personas que manejan moto todos los días. En Katmandú,{' '}
            <Cite id="katmandu">43.8%</Cite> lo reportó en el último año. En Nigeria, <Cite id="nigeria">40.9%</Cite>. En{' '}
            <Cite id="bangladesh">Bangladesh</Cite> y <Cite id="tailandia">Tailandia</Cite>, casi 6 de cada 10.
          </P>
          <P>
            Lo interesante es quiénes eran. En el estudio de Katmandú, más de la mitad de los participantes tenía entre 20 y 30 años. Y lo que se asoció con el dolor fueron las horas diarias arriba de la moto y los kilómetros recorridos.
          </P>
          <P>La edad puede sumar. Pero no explica por qué le pasa a alguien de veinticinco.</P>

          {/* Bloque 5 */}
          <H2>Lo que la moto sí trae, y lo que no</H2>
          <P>Una moto de carretera está llena de ingeniería: suspensión para el pavimento, asiento para el peso, parabrisas para el viento.</P>
          <P><strong className="text-brand-offwhite">Para la espalda baja no trae nada.</strong></P>
          <P>En un coche, el respaldo carga el peso del torso. En la moto, ese trabajo lo hacen los músculos de la zona lumbar: sostienen el cuerpo inclinado hacia adelante, sin apoyo, durante todo el trayecto.</P>
          <P>No es un esfuerzo fuerte. Es un esfuerzo que no descansa.</P>
          <P>Por eso la molestia no aparece en el kilómetro 10 sino en el 150. No es falta de aguante ni de condición. Es un músculo haciendo el trabajo de un respaldo que no existe.</P>
          <figure className="my-8 overflow-hidden rounded-xl border border-brand-graphite bg-brand-graphite/40 p-4">
            {ADV_MECHANISM_IMAGE ? (
              <img src={img(ADV_MECHANISM_IMAGE, 900)} alt="Ilustración de la zona lumbar del piloto" loading="lazy" decoding="async" className="w-full rounded-lg" />
            ) : (
              <LumbarMechanismIllustration />
            )}
          </figure>
          <Link {...ctaProps('cta1_mecanismo')} className="group inline-flex items-center gap-1 font-semibold text-brand-amber-light underline decoration-brand-amber/50 underline-offset-4">
            Ver el soporte lumbar hecho para manejar moto
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Bloque 6 */}
          <H2>Tres arreglos comunes, y por qué se quedan cortos</H2>
          <P><strong className="text-brand-offwhite">La faja de gimnasio.</strong> Está hecha para cargar peso de pie durante unos segundos. Sentado e inclinado estorba, se sube y se afloja antes de la primera hora.</P>
          <P><strong className="text-brand-offwhite">Parar a estirar.</strong> Ayuda, pero es un descanso, no un soporte. De vuelta en la moto, el músculo vuelve a trabajar solo.</P>
          <P><strong className="text-brand-offwhite">Cambiar el asiento.</strong> Mejora dónde va sentado el piloto, no qué lo sostiene. Y cuesta varias veces más.</P>

          {/* Bloque 7 */}
          <H2>Un soporte hecho para la postura de manejo</H2>
          <P>Eso es <strong className="text-brand-offwhite">Rodata One</strong>: un soporte lumbar diseñado para ir sentado e inclinado arriba de una moto, no adaptado de otro uso.</P>
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
          <Link {...ctaProps('cta2_producto')} className={buttonCls}>Conoce Rodata One</Link>

          {/* Bloque 8 */}
          <H2>Más de 1,000 pedidos después</H2>
          <P>Rodata se hizo para resolver una sola cosa: ese hueco en el equipo del motociclista. Hoy suma {ADV_ORDERS_CLAIM} entre riders de carretera, repartidores y gente que va diario al trabajo en moto.</P>
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

          {/* Bloque 9 */}
          <H2>Úsala en tu siguiente rodada</H2>
          <P>Tienes 30 días para devolverla si no te convence, y te reembolsamos tu dinero. Envío gratis a todo México, tallas de la S a la XL, y el primer cambio de talla no tiene costo.</P>
          <Link {...ctaProps('cta3_cierre')} className={buttonCls}>Ver tallas y disponibilidad</Link>
        </article>

        {/* Pie */}
        <footer id="fuentes" className="mt-16 border-t border-brand-graphite pt-6 text-xs leading-relaxed text-brand-steel">
          <p className="mb-4">Contenido elaborado por Rodata. Es informativo y no sustituye la valoración de un profesional de la salud.</p>
          <p className="mb-2 font-semibold text-brand-smoke">Fuentes</p>
          <ol className="list-decimal space-y-2 pl-4">
            {ADV_SOURCES.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-brand-smoke">{s.label}</a>
              </li>
            ))}
          </ol>
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
            <p className="truncate text-xs text-brand-steel">Soporte lumbar para moto · Tallas S a XL</p>
          </div>
          <Link {...ctaProps('sticky')} tabIndex={showSticky ? 0 : -1} className="shrink-0 rounded-lg bg-brand-amber px-5 py-3 font-sora text-sm font-bold text-brand-carbon hover:bg-brand-amber-light">
            Ver tallas
          </Link>
        </div>
      </div>
    </div>
  )
}