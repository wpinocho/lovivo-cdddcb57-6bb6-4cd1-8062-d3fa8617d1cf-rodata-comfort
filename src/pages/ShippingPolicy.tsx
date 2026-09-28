import { PolicyLayout, PolicySection, PolicyLink } from '@/components/PolicyLayout'
import { BRAND_NAME, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/brand'

const WHATSAPP_URL = whatsappUrl('Hola, tengo una duda sobre el envío de mi pedido')

const ShippingPolicy = () => (
  <PolicyLayout
    title="Política de Envíos"
    metaTitle="Política de envíos"
    description="Envío estándar gratis en México donde exista cobertura. Preparación en 24–48 h hábiles y número de seguimiento para tu pedido."
    updated="Última actualización: septiembre 2026 · Aplica para pedidos en México"
  >
    <PolicySection title="1. Costo de envío">
      <p>
        El <strong>envío estándar es gratis</strong> en México, en todos los destinos donde exista cobertura de paquetería.
      </p>
    </PolicySection>

    <PolicySection title="2. Preparación del pedido">
      <p>
        Preparamos tu pedido normalmente en <strong>24 a 48 horas hábiles</strong> después de confirmar tu pago.
      </p>
    </PolicySection>

    <PolicySection title="3. Tiempo de entrega">
      <p>
        El tiempo de entrega depende de tu destino y de la paquetería. La fecha estimada se muestra en la página del producto y al pagar.
      </p>
    </PolicySection>

    <PolicySection title="4. Seguimiento">
      <p>
        Cuando tu pedido sale, recibes un número de seguimiento. También puedes consultarlo en{' '}
        <PolicyLink href="/orders/track">Rastrear pedido</PolicyLink>.
      </p>
    </PolicySection>

    <PolicySection title="5. Posibles retrasos">
      <p>
        Pueden existir retrasos por causas externas a {BRAND_NAME}, como clima, alta demanda, días festivos o incidencias de la paquetería. Si tu pedido se retrasa, escríbenos y le damos seguimiento.
      </p>
    </PolicySection>

    <PolicySection title="6. Contacto">
      <p>
        ¿Dudas sobre tu envío? Escríbenos por <PolicyLink href={WHATSAPP_URL}>WhatsApp al {WHATSAPP_DISPLAY}</PolicyLink>.
      </p>
    </PolicySection>
  </PolicyLayout>
)

export default ShippingPolicy