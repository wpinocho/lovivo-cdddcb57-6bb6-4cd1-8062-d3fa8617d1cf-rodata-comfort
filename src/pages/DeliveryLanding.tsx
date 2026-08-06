import { HeadlessProduct } from "@/components/headless/HeadlessProduct"
import { DeliveryLandingUI } from "@/pages/ui/DeliveryLandingUI"

/**
 * ROUTE COMPONENT — /repartidores
 *
 * Landing dedicada al avatar "repartidor de plataformas".
 * Usa EXACTAMENTE el mismo producto que la PDP principal (mismo inventario,
 * mismo precio, mismas variantes) — solo cambia la presentación y el copy.
 */
const DeliveryLanding = () => {
  return (
    <HeadlessProduct slug="soporte-lumbar-rodata-one">
      {(logic) => <DeliveryLandingUI logic={logic} />}
    </HeadlessProduct>
  )
}

export default DeliveryLanding