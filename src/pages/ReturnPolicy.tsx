import { PolicyLayout, PolicySection, PolicyLink } from '@/components/PolicyLayout'
import { BRAND_NAME, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/brand'

const WHATSAPP_URL = whatsappUrl('Hola, quiero hacer un cambio o devolución')

const ReturnPolicy = () => (
  <PolicyLayout
    title="Política de Devoluciones y Cambios"
    metaTitle="Política de devoluciones y cambios"
    description={`Tienes 30 días desde que recibes tu pedido para devolverlo o cambiar de talla. Primer cambio de talla sin costo. Reembolso al método de pago original.`}
    updated="Última actualización: septiembre 2026 · Aplica para pedidos en México"
  >
    <PolicySection title="1. Plazo">
      <p>
        Tienes <strong>30 días naturales a partir de la fecha en que recibes tu pedido</strong> para solicitar una devolución o un cambio de talla.
      </p>
    </PolicySection>

    <PolicySection title="2. Condiciones">
      <ul className="list-disc pl-6 space-y-2">
        <li>Puedes probar el producto normalmente: ponértelo, ajustarlo y rodar con él para saber si te queda.</li>
        <li>No aceptamos devoluciones ni cambios si el producto está roto, alterado, muy manchado o dañado por mal uso.</li>
        <li>Se aceptan devoluciones por cualquier motivo dentro del plazo, aunque el producto no tenga defecto.</li>
      </ul>
    </PolicySection>

    <PolicySection title="3. Cómo solicitarlo">
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          Escríbenos por <PolicyLink href={WHATSAPP_URL}>WhatsApp</PolicyLink> con tu número de pedido y dinos si quieres cambio de talla o devolución.
        </li>
        <li>Te compartimos la dirección de nuestro almacén y te indicamos cómo enviar el producto.</li>
        <li>Nos compartes el número de guía para darle seguimiento.</li>
      </ol>
    </PolicySection>

    <PolicySection title="4. Cambios de talla">
      <p>
        <strong>Tu primer cambio de talla dentro de los 30 días es sin costo para ti.</strong> {BRAND_NAME} cubre el envío de regreso del producto y el envío de la nueva talla.
      </p>
      <p>
        En cuanto tu paquete viene en camino a nuestro almacén, te enviamos la nueva talla. No tienes que esperar a que llegue el producto original.
      </p>
    </PolicySection>

    <PolicySection title="5. Reembolsos">
      <p>
        El reembolso se hace al <strong>mismo método de pago que usaste</strong>, después de recibir y revisar el producto. Lo procesamos en un máximo de <strong>10 días hábiles</strong>. El tiempo en que se ve reflejado en tu cuenta depende de tu banco.
      </p>
    </PolicySection>

    <PolicySection title="6. Costos de envío">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Devolución normal:</strong> el envío de regreso a nuestro almacén corre por tu cuenta.</li>
        <li><strong>Producto defectuoso o equivocado:</strong> {BRAND_NAME} cubre todos los costos de envío.</li>
        <li><strong>Primer cambio de talla dentro de 30 días:</strong> sin costo para ti.</li>
      </ul>
    </PolicySection>

    <PolicySection title="7. Contacto">
      <p>
        ¿Dudas? Escríbenos por <PolicyLink href={WHATSAPP_URL}>WhatsApp al {WHATSAPP_DISPLAY}</PolicyLink>. Te respondemos lo antes posible.
      </p>
    </PolicySection>
  </PolicyLayout>
)

export default ReturnPolicy