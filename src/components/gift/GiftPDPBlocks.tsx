// Gift-offer blocks for the Rodata One PDP (only rendered on the gift URL via ProductPageUI `giftOffer`).
import { Check, ChevronRight, Gift } from "lucide-react"
import { GIFT_NAME, GIFT_NAME_SHORT, formatGiftEndDate } from "@/lib/gift-offer"
import { GiftCountdown } from "@/components/GiftCountdown"

const SUPABASE_MSG = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'
const SUPABASE_PROD = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf'

export const GIFT_KIT_IMG = `${SUPABASE_PROD}/kit-rodata-one-munequeras.webp?width=1000&quality=75`
const WRIST_IMG = `${SUPABASE_MSG}/1790638502334-pkwpdneq4dd.webp?width=800&quality=75`
const WRIST_THUMB = `${SUPABASE_MSG}/1790638502334-pkwpdneq4dd.webp?width=160&height=160&resize=cover&quality=75`

export const GIFT_END_SHORT = formatGiftEndDate()

const GIFT_LINES = [
  { title: 'Menos fatiga por vibración', desc: 'Compresión firme que sostiene la muñeca en su posición natural, para que el zumbido del manubrio te canse menos en carretera y tráfico.' },
  { title: 'Debajo del guante, sin estorbar', desc: 'Perfil delgado con abertura para el pulgar. No estorba el acelerador ni el clutch.' },
  { title: 'Incluye 2, talla única', desc: 'Izquierda y derecha. Se ajustan en segundos y te olvidas de ellas.' },
]

export const GIFT_FAQS = [
  { q: '¿El regalo tiene costo?', a: 'No. El soporte de muñeca (par) va incluido en tu pedido y se agrega solo; no tienes que hacer nada.' },
  { q: '¿Hasta cuándo?', a: GIFT_END_SHORT ? `Hasta el ${formatGiftEndDate(true)}.` : 'Por tiempo limitado.' },
  { q: '¿El soporte de muñeca sirve para la vibración?', a: 'Ayuda a que la vibración del manubrio te canse menos: la compresión mantiene la muñeca firme en su posición natural. Si la molestia o el hormigueo siguen después de bajarte, conviene consultarlo con un médico.' },
]

type Money = (a: number) => string

/** Overlay on the kit image (gallery). */
export const GiftKitBadge = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="absolute bottom-3 left-3 z-10 text-left bg-brand-amber text-brand-carbon px-3 py-1.5 rounded-lg shadow-lg">
    <span className="flex items-center gap-1.5 text-xs font-sora font-bold"><Gift size={13}/>INCLUIDO GRATIS</span>
    <span className="block text-[11px] font-inter font-medium">{GIFT_NAME} (par) ›</span>
  </button>
)

/** Banner right under the price. */
export const GiftPriceBadge = ({ giftValue, formatMoney }: { giftValue: number | null; formatMoney: Money }) => (
  <div className="flex">
    <div className="inline-flex items-center gap-2 bg-brand-amber text-brand-carbon rounded-lg px-3.5 py-2 shadow-[0_0_16px_rgba(201,139,46,0.3)]">
      <Gift size={15} className="flex-shrink-0" />
      <span className="text-xs sm:text-sm font-sora font-bold">+ REGALO: {GIFT_NAME_SHORT} para moto{giftValue ? ` (valor ${formatMoney(giftValue)})` : ''}</span>
    </div>
  </div>
)

/** "Tu regalo · Nuevo en RODATA" card above the CTAs. */
export const GiftOfferCard = ({ giftValue, formatMoney, onClick }: { giftValue: number | null; formatMoney: Money; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Ver detalles del regalo: ${GIFT_NAME}`}
    className="w-full text-left rounded-xl border border-brand-amber/40 bg-brand-amber/10 p-3 hover:border-brand-amber/70 active:scale-[0.99] transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="h-16 w-16 rounded-lg overflow-hidden bg-brand-graphite flex-shrink-0">
        <img src={WRIST_THUMB} alt={`${GIFT_NAME} de regalo`} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-brand-amber text-[10px] font-sora font-bold uppercase tracking-[0.12em] flex items-center gap-1"><Gift size={11}/>Tu regalo · Nuevo en RODATA</p>
        <p className="text-brand-offwhite text-sm font-sora font-semibold leading-tight mt-0.5">{GIFT_NAME}</p>
        <p className="text-brand-steel text-[11px] font-inter mt-0.5">Incluye 2 · contra la fatiga por vibración</p>
      </div>
      <div className="text-right flex-shrink-0">
        {giftValue && <p className="text-brand-steel text-xs line-through font-inter">{formatMoney(giftValue)}</p>}
        <p className="text-brand-amber font-sora font-bold text-base">GRATIS</p>
      </div>
    </div>
    <div className="flex items-center justify-between gap-2 border-t border-brand-amber/20 mt-3 pt-2.5">
      <p className="flex items-center gap-1.5 text-brand-amber-light text-[11px] font-inter min-w-0">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-amber-light animate-pulse flex-shrink-0" />
        {GIFT_END_SHORT
          ? <span>Gratis solo por <GiftCountdown /></span>
          : <span>Gratis por tiempo limitado</span>}
      </p>
      <span className="flex items-center text-brand-amber text-[11px] font-sora font-semibold flex-shrink-0">Ver qué incluye<ChevronRight size={13}/></span>
    </div>
  </button>
)

/** Full-width gift section (after "Por qué funciona"). */
export const GiftSection = ({ onOpen }: { onOpen: () => void }) => (
  <section style={{backgroundColor:'#1D2125'}} className="border-y border-white/[0.06] py-16 lg:py-20">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={WRIST_IMG} alt={`${GIFT_NAME} incluido de regalo`} className="w-full aspect-square object-cover" loading="lazy"/>
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-brand-amber text-brand-carbon text-xs font-sora font-bold px-3 py-1.5 rounded-lg shadow-lg"><Gift size={13}/>Incluido gratis</div>
      </div>
      <div>
        <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-3 block">Tu regalo · Nuevo en RODATA</span>
        <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl leading-tight mb-4">Porque la espalda no es lo único que se cansa</h2>
        <p className="text-brand-smoke text-sm font-inter leading-relaxed mb-6">
          La moto vibra todo el camino y esa vibración pega en dos lugares: tu espalda baja y tus muñecas. El Rodata One cuida la primera. Este {GIFT_NAME_SHORT}, la segunda.
        </p>
        <div className="space-y-4">
          {GIFT_LINES.map(({title, desc}) => (
            <div key={title} className="flex items-start gap-3">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0"><Check size={11} className="text-brand-amber" /></div>
              <p className="text-brand-smoke text-sm font-inter leading-relaxed"><strong className="text-brand-offwhite font-sora">{title}.</strong> {desc}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={onOpen} className="inline-flex items-center gap-1 text-brand-amber text-sm font-sora font-semibold mt-6 hover:text-brand-amber-light transition-colors">
          Ver detalles del regalo<ChevronRight size={15}/>
        </button>
      </div>
    </div>
  </section>
)

/** Small line under the final-CTA price. */
export const GiftFinalCtaLine = () => (
  <p className="text-brand-amber-light text-sm font-sora font-semibold -mt-4 mb-7 flex items-center justify-center gap-1.5">
    <Gift size={14}/>+ {GIFT_NAME_SHORT} de regalo{GIFT_END_SHORT ? ` · hasta el ${GIFT_END_SHORT}` : ''}
  </p>
)

export { GIFT_NAME_SHORT }