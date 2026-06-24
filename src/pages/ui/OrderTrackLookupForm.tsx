/**
 * EDITABLE UI COMPONENT - OrderTrackLookupForm
 * TIPO B - El agente de IA puede editar libremente este componente
 *
 * Formulario para buscar un pedido sin link directo (número de pedido + email).
 */

import { useState, FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface OrderTrackLookupFormProps {
  onSubmit: (orderNumber: string, email: string) => void
  loading?: boolean
}

export default function OrderTrackLookupForm({ onSubmit, loading }: OrderTrackLookupFormProps) {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return
    onSubmit(orderNumber.trim(), email.trim())
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-amber/10 mb-4">
          <Search className="h-6 w-6 text-brand-amber" />
        </div>
        <h1 className="text-2xl font-bold text-brand-offwhite font-sora">Rastrea tu pedido</h1>
        <p className="text-sm text-brand-steel mt-2 font-inter">
          Ingresa tu número de pedido y el correo con el que compraste.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="order-number" className="block text-sm font-medium text-brand-smoke mb-1.5 font-inter">
            Número de pedido
          </label>
          <input
            id="order-number"
            type="text"
            inputMode="numeric"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Ej. 1042"
            className="w-full rounded-lg bg-brand-graphite border border-white/[0.08] px-4 py-3 text-brand-offwhite placeholder:text-brand-steel/60 focus:outline-none focus:border-brand-amber/60 transition-colors font-inter"
          />
        </div>

        <div>
          <label htmlFor="order-email" className="block text-sm font-medium text-brand-smoke mb-1.5 font-inter">
            Correo electrónico
          </label>
          <input
            id="order-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@email.com"
            className="w-full rounded-lg bg-brand-graphite border border-white/[0.08] px-4 py-3 text-brand-offwhite placeholder:text-brand-steel/60 focus:outline-none focus:border-brand-amber/60 transition-colors font-inter"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !orderNumber.trim() || !email.trim()}
          className="btn-amber w-full py-3 amber-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Rastrear pedido
            </>
          )}
        </button>
      </form>
    </div>
  )
}