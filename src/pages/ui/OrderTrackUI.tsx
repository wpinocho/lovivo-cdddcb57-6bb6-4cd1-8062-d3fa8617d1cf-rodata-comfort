/**
 * EDITABLE UI COMPONENT - OrderTrackUI
 * TIPO B - El agente de IA puede editar libremente este componente
 *
 * Página pública de rastreo de pedidos. Dos modos:
 *  - Modo token: /orders/track/:token  → callEdge('order-track', { token })
 *  - Modo lookup: /orders/track        → formulario order_number + email
 */

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Package, Truck, CheckCircle2, Clock, MapPin, Copy, Check, ExternalLink,
  AlertCircle, ChevronDown, PackageX, RefreshCw, CalendarClock,
} from 'lucide-react'
import { callEdge } from '@/lib/edge'
import { STORE_ID } from '@/lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import OrderTrackLookupForm from './OrderTrackLookupForm'

interface TrackStep {
  key?: string
  label?: string
  completed?: boolean
  current?: boolean
  date?: string
  at?: string
}

interface TrackEvent {
  occurred_at?: string
  status_detail?: string
  description?: string
  location?: string
}

interface TrackResponse {
  ok?: boolean
  order_number?: string | number
  status?: string
  cancelled?: boolean
  display_mode?: 'detailed' | 'masked'
  current_step?: number
  steps?: TrackStep[]
  carrier?: string
  shipping_carrier?: string
  tracking_number?: string
  tracking_url?: string
  estimated_delivery_at?: string
  events?: TrackEvent[]
}

const STEP_ICONS = [CheckCircle2, Package, Truck, MapPin]

function formatDate(value?: string, withTime = false) {
  if (!value) return null
  try {
    return format(new Date(value), withTime ? "d MMM yyyy, HH:mm" : 'd MMM yyyy', { locale: es })
  } catch {
    return null
  }
}

function isStepCompleted(step: TrackStep, index: number, currentStep?: number) {
  if (typeof step.completed === 'boolean') return step.completed
  if (typeof currentStep === 'number') return index < currentStep
  return false
}

function isStepCurrent(step: TrackStep, index: number, currentStep?: number) {
  if (typeof step.current === 'boolean') return step.current
  if (typeof currentStep === 'number') return index === currentStep
  return false
}

interface OrderTrackUIProps {
  token?: string
}

export default function OrderTrackUI({ token }: OrderTrackUIProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [data, setData] = useState<TrackResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<'notfound' | 'generic' | null>(null)
  const [copied, setCopied] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)

  const fetchTracking = useCallback(async (body: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const res: TrackResponse = await callEdge('order-track', body)
      if (!res || res.ok === false || (!res.steps && !res.status && !res.order_number)) {
        setError('notfound')
        setData(null)
        return
      }
      setData(res)
    } catch (e) {
      console.error('order-track error:', e)
      setError('generic')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) fetchTracking({ token })
  }, [token, fetchTracking])

  const handleLookup = (orderNumber: string, email: string) => {
    fetchTracking({ store_id: STORE_ID, order_number: orderNumber, email })
  }

  const handleCopy = (value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      toast({ title: 'Número copiado', description: 'El número de guía se copió al portapapeles.' })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ---- Lookup mode (no token, no data yet) ----
  if (!token && !data && !loading) {
    return (
      <EcommerceTemplate layout="centered">
        <div className="py-12">
          <OrderTrackLookupForm onSubmit={handleLookup} loading={loading} />
          {error && (
            <p className="text-center text-sm text-red-400 mt-4 font-inter">
              {error === 'notfound'
                ? 'No encontramos un pedido con esos datos. Revisa tu número y correo.'
                : 'Algo salió mal. Intenta de nuevo en un momento.'}
            </p>
          )}
        </div>
      </EcommerceTemplate>
    )
  }

  // ---- Loading ----
  if (loading) {
    return (
      <EcommerceTemplate layout="centered">
        <div className="py-12 space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </EcommerceTemplate>
    )
  }

  // ---- Error states ----
  if (error || !data) {
    return (
      <EcommerceTemplate layout="centered">
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-graphite mb-5">
            <AlertCircle className="h-8 w-8 text-brand-steel" />
          </div>
          <h1 className="text-xl font-bold text-brand-offwhite font-sora">
            {error === 'notfound' ? 'No encontramos tu pedido' : 'Algo salió mal'}
          </h1>
          <p className="text-sm text-brand-steel mt-2 font-inter">
            {error === 'notfound'
              ? 'Revisa que el enlace o los datos sean correctos.'
              : 'No pudimos cargar el rastreo. Intenta de nuevo en un momento.'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            {token && (
              <button onClick={() => fetchTracking({ token })} className="btn-outline-light px-5 py-2.5 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
            )}
            <button onClick={() => navigate('/')} className="btn-amber px-5 py-2.5">
              Ir a la tienda
            </button>
          </div>
        </div>
      </EcommerceTemplate>
    )
  }

  // ---- Data loaded ----
  const detailed = data.display_mode !== 'masked'
  const carrier = data.carrier || data.shipping_carrier
  const steps = data.steps && data.steps.length > 0 ? data.steps : []
  const estimated = formatDate(data.estimated_delivery_at)
  const events = data.events || []

  return (
    <EcommerceTemplate layout="centered">
      <div className="py-10 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-brand-offwhite font-sora">Rastreo de pedido</h1>
          {data.order_number != null && (
            <p className="text-sm text-brand-steel mt-1 font-inter">Pedido #{data.order_number}</p>
          )}
        </div>

        {/* Cancelled banner */}
        {data.cancelled && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <PackageX className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-300 font-sora">Pedido cancelado</p>
              <p className="text-xs text-red-400/80 font-inter">Este pedido fue cancelado. Si tienes dudas, contáctanos.</p>
            </div>
          </div>
        )}

        {/* Estimated delivery */}
        {!data.cancelled && estimated && (
          <div className="rounded-xl border border-brand-amber/30 bg-brand-amber/[0.07] px-5 py-4 flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-amber/15 shrink-0">
              <CalendarClock className="h-5 w-5 text-brand-amber" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-steel font-inter">Entrega estimada</p>
              <p className="text-lg font-bold text-brand-offwhite font-sora">{estimated}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!data.cancelled && steps.length > 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-brand-graphite px-5 py-6">
            <div className="flex items-start justify-between gap-1">
              {steps.map((step, i) => {
                const completed = isStepCompleted(step, i, data.current_step)
                const current = isStepCurrent(step, i, data.current_step)
                const Icon = STEP_ICONS[i] || Clock
                const stepDate = formatDate(step.date || step.at)
                const isLast = i === steps.length - 1
                const nextCompleted = !isLast && isStepCompleted(steps[i + 1], i + 1, data.current_step)
                return (
                  <div key={step.key || i} className="flex-1 flex flex-col items-center relative">
                    {/* Connector line */}
                    {!isLast && (
                      <div className="absolute top-4 left-1/2 w-full h-0.5 -z-0">
                        <div className={cn('h-full w-full', (completed && (nextCompleted || isStepCurrent(steps[i + 1], i + 1, data.current_step))) ? 'bg-brand-amber' : 'bg-white/10')} />
                      </div>
                    )}
                    {/* Node */}
                    <div
                      className={cn(
                        'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                        completed && 'bg-brand-amber border-brand-amber',
                        current && !completed && 'bg-brand-amber/20 border-brand-amber animate-pulse',
                        !completed && !current && 'bg-brand-carbon border-white/15'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', completed ? 'text-brand-carbon' : current ? 'text-brand-amber' : 'text-brand-steel')} />
                    </div>
                    {/* Label */}
                    <p className={cn('text-[11px] sm:text-xs font-medium mt-2 text-center leading-tight font-inter', (completed || current) ? 'text-brand-offwhite' : 'text-brand-steel')}>
                      {step.label || step.key}
                    </p>
                    {stepDate ? (
                      <p className="text-[10px] text-brand-steel mt-0.5 font-inter">{stepDate}</p>
                    ) : current ? (
                      <p className="text-[10px] text-brand-amber mt-0.5 font-inter">en curso</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Carrier + tracking (detailed only) */}
        {detailed && (carrier || data.tracking_number) && (
          <div className="rounded-xl border border-white/[0.08] bg-brand-graphite px-5 py-4 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-amber" />
              <p className="text-sm font-semibold text-brand-offwhite font-sora">Información de envío</p>
            </div>
            {carrier && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-steel font-inter">Paquetería</span>
                <span className="text-brand-offwhite font-medium font-inter">{carrier}</span>
              </div>
            )}
            {data.tracking_number && (
              <div className="flex justify-between items-center text-sm gap-2">
                <span className="text-brand-steel font-inter">Número de guía</span>
                <button
                  onClick={() => handleCopy(data.tracking_number!)}
                  className="flex items-center gap-1.5 text-brand-offwhite font-medium font-inter hover:text-brand-amber transition-colors"
                >
                  {data.tracking_number}
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-amber" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
            {data.tracking_url && (
              <a
                href={data.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-light w-full py-2.5 flex items-center justify-center gap-2 mt-1"
              >
                Rastrear con la paquetería
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {/* Events list (detailed only) */}
        {detailed && events.length > 0 && (
          <Collapsible open={eventsOpen} onOpenChange={setEventsOpen}>
            <div className="rounded-xl border border-white/[0.08] bg-brand-graphite overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between px-5 py-4 focus:outline-none">
                  <span className="text-sm font-semibold text-brand-offwhite font-sora">Historial de seguimiento</span>
                  <ChevronDown className={cn('h-4 w-4 text-brand-steel transition-transform', eventsOpen && 'rotate-180')} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 pt-1 space-y-4">
                  {events.map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn('w-2.5 h-2.5 rounded-full mt-1', i === 0 ? 'bg-brand-amber' : 'bg-white/20')} />
                        {i < events.length - 1 && <div className="w-px flex-1 bg-white/10 my-1" />}
                      </div>
                      <div className="pb-1">
                        <p className="text-sm text-brand-offwhite font-inter">{ev.status_detail || ev.description || 'Actualización'}</p>
                        <p className="text-xs text-brand-steel mt-0.5 font-inter">
                          {[formatDate(ev.occurred_at, true), ev.location].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Masked notice */}
        {!detailed && !data.cancelled && (
          <p className="text-center text-xs text-brand-steel font-inter">
            Te avisaremos por correo cuando tu pedido cambie de estado.
          </p>
        )}
      </div>
    </EcommerceTemplate>
  )
}