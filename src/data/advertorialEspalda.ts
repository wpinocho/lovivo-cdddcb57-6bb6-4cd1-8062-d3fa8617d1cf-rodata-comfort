// Advertorial "Espalda baja" para Meta Ads — contenido editable en un solo lugar.
// Reglas: sin precio (vive solo en la PDP), sin autores/médicos inventados,
// reseñas SOLO reales (se toman de src/data/rodataReviews.ts por nombre).

export const ADV_PATH = '/lectura/espalda-baja-moto'
export const ADV_SLUG = 'espalda-baja-moto'
export const ADV_PDP_PATH = '/productos/soporte-lumbar-rodata-one'
export const ADV_PRODUCT_ID = '400026a2-c277-407c-abbb-d1683f415120'

const SB_MSG = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'

/** Foto de carretera real usada por defecto hasta tener las imágenes de cada anuncio */
const HIGHWAY_IMG = `${SB_MSG}/1775768374485-uca4dkx21g.webp`

export interface AdvVariant {
  headline: string
  heroImage: string
  heroAlt: string
}

/**
 * Titular + imagen por anuncio → `?v=<clave>`.
 * Para conectar un anuncio nuevo: agrega una clave y su imagen (WebP).
 */
export const ADV_VARIANTS: Record<string, AdvVariant> = {
  a1: {
    headline: 'Por qué a 4 de cada 10 motociclistas les duele la espalda baja (y no es cosa de la edad)',
    heroImage: HIGHWAY_IMG,
    heroAlt: 'Motociclista en carretera',
  },
  a2: {
    headline: 'La moto aguanta 500 km. La espalda del piloto, 150. La razón no es la edad.',
    heroImage: HIGHWAY_IMG,
    heroAlt: 'Motociclista en carretera',
  },
  a3: {
    headline: 'Lo que la moto no trae: por qué la espalda pide parada antes que el tanque',
    heroImage: HIGHWAY_IMG,
    heroAlt: 'Motociclista en carretera',
  },
}
export const ADV_DEFAULT_VARIANT = 'a1'

/** Imagen del anuncio 5 (silueta). Si queda vacía se usa la ilustración vectorial. */
export const ADV_MECHANISM_IMAGE = ''

/** Foto REAL del producto puesto (Leonel B., cliente) */
export const ADV_PRODUCT_PHOTO = `${SB_MSG}/1791663680441-cr0tattp1ss.webp`

/** Reseñas reales a mostrar (nombre exacto en rodataReviews.ts) */
export const ADV_REVIEW_NAMES = ['Esteban V.', 'Ricardo L.', 'Humberto J.']

/** Cifra de pedidos — dato del dueño (2026-11-11) */
export const ADV_ORDERS_CLAIM = 'más de 1,000 pedidos'

export interface AdvSource {
  id: string
  label: string
  url: string
}

export const ADV_SOURCES: AdvSource[] = [
  {
    id: 'katmandu',
    label: 'Gautam et al. (2023). Prevalence and risk factors of low back pain among commercial motorbike riders in Kathmandu Valley. Nepal Medical College Journal.',
    url: 'https://www.researchgate.net/publication/372189581_Prevalence_and_risk_factors_of_low_back_pain_among_commercial_motorbike_riders_in_Kathmandu_Valley',
  },
  {
    id: 'nigeria',
    label: 'Prevalence and management practices of low back pain among commercial motorcyclists in Ilesha, southwest Nigeria. Science Journal of Public Health (2017).',
    url: 'https://www.sciencepublishinggroup.com/article/10.11648/j.sjph.20170503.15',
  },
  {
    id: 'bangladesh',
    label: 'Ali et al. (2024). Exploring the impact of occupational factors on low back pain among ride-sharing motorbike drivers in Bangladesh. Preventive Medicine Reports.',
    url: 'https://www.sciencedirect.com/science/article/pii/S2211335524002031',
  },
  {
    id: 'tailandia',
    label: 'Jongprasitkul et al. (2016). Prevalence and associated factors of low back pain among motorcycle taxi drivers in Sriracha. Chulalongkorn Medical Journal.',
    url: 'https://digital.car.chula.ac.th/clmjournal/vol60/iss1/3',
  },
]

export const advSource = (id: string) => ADV_SOURCES.find((s) => s.id === id)?.url ?? '#fuentes'