import { HeadlessProduct } from "@/components/headless/HeadlessProduct"
import { WristWrapPDPUI, WRIST_WRAP_SLUG } from "@/pages/ui/WristWrapPDPUI"

/**
 * ROUTE COMPONENT — /productos/munequeras-rodata
 *
 * PDP dedicada a "Muñequeras RODATA (par)". Ruta estática: tiene prioridad sobre
 * /productos/:slug, así este producto NO usa la PDP del Rodata One.
 * No enlazada desde home ni menú (producto en prueba).
 */
const WristWrapLanding = () => (
  <HeadlessProduct slug={WRIST_WRAP_SLUG}>
    {(logic) => <WristWrapPDPUI logic={logic} />}
  </HeadlessProduct>
)

export default WristWrapLanding