import { Check, Gift, ShoppingCart, Clock } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer'
import { GiftCountdown } from '@/components/GiftCountdown'
import { GIFT_NAME, formatGiftEndDate } from '@/lib/gift-offer'

const GIFT_PHOTO = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1/1790638502334-nwhrcsc3un.webp?width=800&quality=75'

const BENEFITS = [
  { title: 'Menos fatiga por vibración', desc: 'La compresión mantiene firme la muñeca para que el zumbido del manubrio te canse menos en carretera y tráfico.' },
  { title: 'Debajo del guante', desc: 'No estorba el acelerador ni el clutch.' },
  { title: 'Incluye 2', desc: 'Izquierda y derecha, talla única ajustable.' },
]

interface GiftDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  giftValue: number | null
  formatMoney: (a: number) => string
  onBuy: () => void
  ctaLabel: string
  ctaDisabled?: boolean
}

/** Bottom sheet with the gift details (94% of traffic is mobile). */
export const GiftDetailsDrawer = ({ open, onOpenChange, giftValue, formatMoney, onBuy, ctaLabel, ctaDisabled }: GiftDetailsDrawerProps) => {
  const endDate = formatGiftEndDate(true)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[88vh] bg-brand-carbon border-white/[0.1] md:max-w-lg md:mx-auto">
        <div className="overflow-y-auto px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="relative rounded-xl overflow-hidden bg-brand-graphite aspect-[4/3]">
            <img src={GIFT_PHOTO} alt={`${GIFT_NAME} (par) incluido de regalo`} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-brand-amber text-brand-carbon text-xs font-sora font-bold px-3 py-1.5 rounded-lg shadow-lg">
              <Gift size={13} />Incluido gratis
            </div>
          </div>

          <p className="text-brand-amber text-[10px] font-sora font-bold uppercase tracking-[0.16em] mt-5">Nuevo en RODATA</p>
          <DrawerTitle className="font-sora font-bold text-brand-offwhite text-xl leading-tight mt-1">
            {GIFT_NAME} (par)
          </DrawerTitle>
          <div className="flex items-baseline gap-2 mt-2">
            {giftValue && <span className="text-brand-steel text-base line-through font-inter">{formatMoney(giftValue)}</span>}
            <span className="text-brand-amber font-sora font-bold text-lg">GRATIS</span>
            <span className="text-brand-smoke text-sm font-inter">con tu Rodata One</span>
          </div>

          <DrawerDescription className="text-brand-smoke text-sm font-inter leading-relaxed mt-4">
            Es lo más nuevo de RODATA. Queremos que más riders lo prueben, así que durante el lanzamiento va gratis con cada Rodata One.
          </DrawerDescription>
          <p className="text-brand-steel text-sm font-inter leading-relaxed mt-2">
            El manubrio te pasa vibración todo el camino. A la hora, la muñeca ya se siente cansada — a veces hasta dormida.
          </p>

          <div className="space-y-3 mt-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="h-5 w-5 mt-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-brand-amber" />
                </div>
                <p className="text-brand-smoke text-sm font-inter leading-relaxed">
                  <strong className="text-brand-offwhite font-sora">{b.title}:</strong> {b.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-brand-amber/40 bg-brand-amber/10 p-4 mt-5 space-y-3">
            <p className="flex items-start gap-2 text-brand-offwhite text-sm font-inter leading-snug">
              <Clock size={15} className="text-brand-amber mt-0.5 flex-shrink-0" />
              {endDate
                ? <span>Gratis hasta el <strong className="font-sora">{endDate}</strong> o hasta agotar el inventario de lanzamiento, lo que pase primero.</span>
                : <span>Gratis mientras dure el inventario de lanzamiento.</span>}
            </p>
            <GiftCountdown variant="boxes" />
          </div>

          <p className="text-brand-steel text-xs font-inter text-center mt-4">Se agrega solo a tu pedido. No tienes que hacer nada.</p>

          <button
            onClick={() => { onOpenChange(false); onBuy() }}
            disabled={ctaDisabled}
            className="btn-amber-lg amber-glow font-sora w-full text-base mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />{ctaLabel}
          </button>
          <DrawerClose className="w-full text-brand-steel hover:text-brand-smoke text-sm font-inter py-3 mt-1">
            Seguir viendo
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}