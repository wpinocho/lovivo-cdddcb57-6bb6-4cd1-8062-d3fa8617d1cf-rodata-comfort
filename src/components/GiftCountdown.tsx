import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { giftOfferEndMs } from '@/lib/gift-offer'

/**
 * Countdown to the REAL, fixed end of the gift promo (GIFT_OFFER_ENDS_AT).
 * Same deadline for every visitor — never resets per visitor.
 */
export function useGiftCountdown() {
  const end = giftOfferEndMs()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (end === null) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [end])

  if (end === null) return null
  const diff = Math.max(0, end - now)
  return {
    expired: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** inline: "9d 14h 32m 05s" · boxes: 4 tiles (días / hrs / min / seg) */
export const GiftCountdown = ({ variant = 'inline', className }: { variant?: 'inline' | 'boxes'; className?: string }) => {
  const t = useGiftCountdown()
  if (!t || t.expired) return null

  if (variant === 'inline') {
    return (
      <span className={cn('font-sora font-bold tabular-nums', className)}>
        {t.days > 0 && `${t.days}d `}{pad(t.hours)}h {pad(t.minutes)}m {pad(t.seconds)}s
      </span>
    )
  }

  const units = [
    { v: t.days, l: 'días' },
    { v: t.hours, l: 'hrs' },
    { v: t.minutes, l: 'min' },
    { v: t.seconds, l: 'seg' },
  ]
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)} role="timer" aria-label="Tiempo restante del regalo">
      {units.map(u => (
        <div key={u.l} className="rounded-lg bg-brand-carbon border border-brand-amber/30 py-2 text-center">
          <p className="font-sora font-bold text-brand-offwhite text-xl leading-none tabular-nums">{pad(u.v)}</p>
          <p className="text-brand-steel text-[10px] font-inter uppercase tracking-wider mt-1">{u.l}</p>
        </div>
      ))}
    </div>
  )
}