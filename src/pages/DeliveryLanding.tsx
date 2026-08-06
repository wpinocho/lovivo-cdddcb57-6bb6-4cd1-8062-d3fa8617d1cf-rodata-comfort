import { HeadlessProduct } from "@/components/headless/HeadlessProduct"
import { DeliveryPDPUI } from "@/pages/ui/DeliveryPDPUI"

/**
 * ROUTE COMPONENT — /repartidores
 *
 * PDP dedicada al avatar "repartidor de plataformas".
 * Misma arquitectura que la PDP principal (galería, sticky bar, carrito,
 * express checkout) y el mismo producto — solo cambian copy e imágenes.
 */
const DeliveryLanding = () => {
  return (
    <HeadlessProduct slug="soporte-lumbar-rodata-one">
      {(logic) => <DeliveryPDPUI logic={logic} />}
    </HeadlessProduct>
  )
}

export default DeliveryLanding