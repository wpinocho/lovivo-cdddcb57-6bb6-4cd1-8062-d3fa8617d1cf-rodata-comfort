import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { usePolicyPageMeta } from '@/components/PolicyLayout'
import { BRAND_NAME, SITE_URL, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/brand'

const storeName = BRAND_NAME

const TermsAndConditions = () => {
  usePolicyPageMeta('Términos y condiciones')

  return (
    <EcommerceTemplate>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Términos y Condiciones</h1>
        <p className="text-muted-foreground text-sm">Última actualización: septiembre 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Aceptación de los Términos</h2>
          <p className="text-foreground/80 leading-relaxed">
            Al acceder y utilizar el sitio web de {storeName} ({SITE_URL.replace('https://', '')}), aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestro sitio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Uso del Sitio</h2>
          <p className="text-foreground/80 leading-relaxed">
            Te comprometes a utilizar el sitio únicamente con fines legales y de manera que no infrinja los derechos de terceros ni restrinja el uso del sitio por parte de otros usuarios. Queda prohibido el uso del sitio para actividades fraudulentas o ilegales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Productos y Precios</h2>
          <p className="text-foreground/80 leading-relaxed">
            {storeName} se esfuerza por mostrar información precisa sobre los productos, incluyendo descripciones, imágenes y precios. Sin embargo, no garantizamos que toda la información sea completamente exacta. Los precios pueden cambiar sin previo aviso. Nos reservamos el derecho de corregir errores en precios o descripciones y de cancelar pedidos afectados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Proceso de Compra</h2>
          <p className="text-foreground/80 leading-relaxed">
            Al realizar un pedido, estás haciendo una oferta de compra. Nos reservamos el derecho de aceptar o rechazar cualquier pedido. Una vez confirmado el pedido, recibirás una confirmación por correo electrónico. El contrato de compraventa se perfecciona en el momento en que procesamos tu pago.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Métodos de Pago</h2>
          <p className="text-foreground/80 leading-relaxed">
            Aceptamos los métodos de pago indicados en nuestro sitio. Toda la información de pago se procesa de forma segura a través de proveedores de pago certificados. {storeName} no almacena datos de tarjetas de crédito o débito.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Envíos y Entregas</h2>
          <p className="text-foreground/80 leading-relaxed">
            El envío estándar es gratis en México donde exista cobertura de paquetería. El tiempo de entrega depende del destino y de la paquetería; los plazos mostrados son estimados. Pueden existir retrasos por causas externas a {storeName}, como clima, alta demanda o incidencias de la paquetería. Consulta los detalles en nuestra{' '}
            <a href="/politica-de-envios" className="text-primary underline underline-offset-2">política de envíos</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Devoluciones y Reembolsos</h2>
          <p className="text-foreground/80 leading-relaxed">
            Tienes 30 días desde que recibes tu pedido para solicitar una devolución o un cambio de talla. Puedes probar el producto normalmente; no se aceptan productos rotos, alterados, muy manchados o dañados por mal uso. En una devolución normal, el envío de regreso corre por tu cuenta; si el producto llegó defectuoso o equivocado, {storeName} cubre los costos. Tu primer cambio de talla dentro de los 30 días es sin costo para ti. El reembolso se hace al mismo método de pago original después de recibir y revisar el producto, con un procesamiento máximo de 10 días hábiles. Consulta todos los detalles en nuestra{' '}
            <a href="/politica-de-devoluciones" className="text-primary underline underline-offset-2">política de devoluciones</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">8. Propiedad Intelectual</h2>
          <p className="text-foreground/80 leading-relaxed">
            Todo el contenido del sitio, incluyendo textos, imágenes, logotipos, gráficos y software, es propiedad de {storeName} o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">9. Limitación de Responsabilidad</h2>
          <p className="text-foreground/80 leading-relaxed">
            {storeName} no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso de nuestro sitio o productos. Nuestra responsabilidad máxima se limita al monto pagado por el producto en cuestión.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">10. Modificaciones</h2>
          <p className="text-foreground/80 leading-relaxed">
            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en el sitio. El uso continuado del sitio después de cualquier modificación constituye la aceptación de los nuevos términos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">11. Contacto</h2>
          <p className="text-foreground/80 leading-relaxed">
            Si tienes preguntas sobre estos Términos y Condiciones, escríbenos por{' '}
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">WhatsApp al {WHATSAPP_DISPLAY}</a>.
          </p>
        </section>
      </div>
    </EcommerceTemplate>
  )
}

export default TermsAndConditions