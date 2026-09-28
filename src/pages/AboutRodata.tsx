import { PolicyLayout, PolicySection, PolicyLink } from '@/components/PolicyLayout'
import { BRAND_NAME, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/brand'

const AboutRodata = () => (
  <PolicyLayout
    title={`Sobre ${BRAND_NAME}`}
    description={`${BRAND_NAME} es una marca mexicana de comodidad y equipo para motociclistas. Contacto por WhatsApp ${WHATSAPP_DISPLAY}.`}
  >
    <PolicySection title="Quiénes somos">
      <p>
        {BRAND_NAME} es una marca mexicana enfocada en la comodidad y el equipo para motociclistas. Vendemos en línea a todo México.
      </p>
      <p>
        Nuestro primer producto es el Rodata One, un soporte lumbar pensado para riders de carretera, de ciudad y para quienes trabajan sobre la moto todos los días.
      </p>
    </PolicySection>

    <PolicySection title="Cómo compramos contigo">
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Envío estándar gratis en México donde exista cobertura. Detalles en nuestra <PolicyLink href="/politica-de-envios">política de envíos</PolicyLink>.
        </li>
        <li>
          30 días desde que recibes tu pedido para devolverlo o cambiar de talla. Detalles en nuestra <PolicyLink href="/politica-de-devoluciones">política de devoluciones</PolicyLink>.
        </li>
      </ul>
    </PolicySection>

    <PolicySection title="Contacto">
      <p>
        Escríbenos por <PolicyLink href={whatsappUrl('Hola, tengo una pregunta sobre RODATA')}>WhatsApp al {WHATSAPP_DISPLAY}</PolicyLink>. Te respondemos lo antes posible.
      </p>
    </PolicySection>
  </PolicyLayout>
)

export default AboutRodata