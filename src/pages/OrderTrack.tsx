import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import OrderTrackUI from '@/pages/ui/OrderTrackUI'

/**
 * ROUTE COMPONENT - OrderTrack
 * TIPO A - Página pública de rastreo de pedidos.
 * Rutas: /orders/track (lookup) y /orders/track/:token (link directo del email).
 * SEO: noindex (página privada de cada cliente, no debe indexarse).
 */

const OrderTrack = () => {
  const { token } = useParams()

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Rastreo de pedido | rodata.mx'

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    return () => {
      document.title = prevTitle
      document.head.removeChild(meta)
    }
  }, [])

  return <OrderTrackUI token={token} />
}

export default OrderTrack