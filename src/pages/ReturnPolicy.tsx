import { useEffect } from 'react'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { useSettings } from '@/contexts/SettingsContext'

const WHATSAPP_URL =
  'https://wa.me/5215531215386?text=Hola,%20quiero%20hacer%20un%20cambio%20o%20devoluci%C3%B3n'

const ReturnPolicy = () => {
  const { storeName } = useSettings()

  useEffect(() => {
    document.title = `Política de devoluciones y cambios | ${storeName || 'Rodata'}`
  }, [storeName])

  return (
    <EcommerceTemplate>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Política de Devoluciones y Cambios</h1>
        <p className="text-muted-foreground text-sm">Última actualización: septiembre 2026 · Aplica para pedidos en México</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Plazo</h2>
          <p className="text-foreground/80 leading-relaxed">
            Tienes <strong>30 días naturales</strong> a partir de la fecha en que recibes tu pedido para solicitar una devolución o un cambio de talla.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Condiciones</h2>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>El producto no debe estar dañado, roto ni alterado.</li>
            <li>Debe incluir sus accesorios y, de preferencia, su empaque original.</li>
            <li>Se aceptan devoluciones por cualquier motivo, aunque el producto no tenga defecto.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Cómo solicitarlo</h2>
          <ol className="list-decimal pl-6 space-y-2 text-foreground/80">
            <li>
              Escríbenos por{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                WhatsApp
              </a>{' '}
              con tu número de pedido y dinos si quieres cambio de talla o devolución.
            </li>
            <li>Te compartimos la dirección de nuestro almacén.</li>
            <li>Tú generas la guía de envío y nos mandas el producto.</li>
            <li>Nos compartes el número de guía para darle seguimiento.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Cambios de talla</h2>
          <p className="text-foreground/80 leading-relaxed">
            En cuanto tu paquete ya viene en camino a nuestro almacén, te enviamos la nueva talla sin costo adicional. No tienes que esperar a que llegue el producto original.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Reembolsos</h2>
          <p className="text-foreground/80 leading-relaxed">
            Cuando recibimos y revisamos el producto, hacemos el reembolso al mismo método de pago que usaste en un plazo de hasta 10 días hábiles. El tiempo en que se ve reflejado depende de tu banco.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Costos de envío</h2>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>El envío de regreso a nuestro almacén corre por tu cuenta, ya que tú generas la guía.</li>
            <li>El envío de la nueva talla en un cambio corre por nuestra cuenta.</li>
            <li>Si el producto llegó defectuoso o te enviamos algo equivocado, nosotros cubrimos todos los costos de envío.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Contacto</h2>
          <p className="text-foreground/80 leading-relaxed">
            ¿Dudas? Escríbenos por{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
              WhatsApp al +52 55 3121 5386
            </a>
            . Te respondemos lo antes posible.
          </p>
        </section>
      </div>
    </EcommerceTemplate>
  )
}

export default ReturnPolicy