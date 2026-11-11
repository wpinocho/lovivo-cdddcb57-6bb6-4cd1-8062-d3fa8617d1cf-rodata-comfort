// Advertorial "Espalda baja" para Meta Ads — contenido editable en un solo lugar.
// Reglas: sin precio (vive solo en la PDP), sin autores/médicos inventados,
// reseñas SOLO reales (se toman de src/data/rodataReviews.ts por nombre).

export const ADV_PATH = '/lectura/espalda-baja-moto'
export const ADV_SLUG = 'espalda-baja-moto'
export const ADV_PDP_PATH = '/productos/soporte-lumbar-rodata-one'
export const ADV_PRODUCT_ID = '400026a2-c277-407c-abbb-d1683f415120'

const SB_MSG = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'

/** Imágenes de los anuncios CR-MX-125 … 134 (1:1, subidas por el cliente 2026-11-11) */
const AD_IMG = {
  125: `${SB_MSG}/1794420461297-6t16v1adhd6.webp`,
  126: `${SB_MSG}/1794420461298-pa4gy6tk98.webp`,
  127: `${SB_MSG}/1794420461298-gozxkcg96dj.webp`,
  128: `${SB_MSG}/1794420461298-qk0u2y7eswn.webp`,
  129: `${SB_MSG}/1794420461298-45v9h42v3jd.webp`,
  130: `${SB_MSG}/1794420461298-b5u75g7jkme.webp`,
  131: `${SB_MSG}/1794420461298-9xzxueaao8t.webp`,
  132: `${SB_MSG}/1794420461298-lwezis2obqk.webp`,
  133: `${SB_MSG}/1794420461298-21cj3hu2vgf.webp`,
  134: `${SB_MSG}/1794420461298-q3xeo7zz6t.webp`,
} as const

const ALT = {
  125: 'Motociclista acostado en el piso junto a su moto después de la rodada',
  126: 'Motociclista acostado a un lado de la carretera junto a su moto',
  127: 'Asiento de coche con respaldo comparado con asiento de moto sin respaldo',
  128: 'Motociclista con las manos en la cintura junto a su moto en la gasolinera',
  129: 'Nota de rodada: 2 paradas por gasolina, 4 por la espalda',
  130: 'Lista de equipo para la rodada con la espalda baja sin palomear',
  131: 'Moto con flechas: asiento, parabrisas y suspensión, y nada para la espalda',
  132: 'Rayos X de un motociclista con la zona lumbar marcada',
  133: 'Moto estacionada en carretera al atardecer',
  134: 'Tablero de moto marcando 150 km con medio tanque frente a una gasolinera',
} as const

export interface AdvVariant {
  headline: string
  /** Bajada; si falta se usa ADV_DEFAULT_DEK */
  dek?: string
  heroImage: string
  heroAlt: string
  /** Proporción visible de la imagen (CSS aspect-ratio). Por defecto 1 / 1 */
  heroAspect?: string
}

export const ADV_DEFAULT_DEK =
  'La moto trae suspensión, asiento y parabrisas. Lo único que no trae es algo que sostenga al piloto durante horas.'

const H_4DE10 = 'Por qué a 4 de cada 10 motociclistas les duele la espalda baja (y no es cosa de la edad)'

const hero = (n: keyof typeof AD_IMG) => ({ heroImage: AD_IMG[n], heroAlt: ALT[n] })

/**
 * Titular + bajada + imagen por anuncio → `?v=<número de anuncio>`.
 * Sin parámetro o con uno desconocido → `default`.
 */
export const ADV_VARIANTS: Record<string, AdvVariant> = {
  default: { headline: H_4DE10, ...hero(128) },
  '125': {
    headline: 'Por qué la espalda baja lo resiente después de la rodada del fin (y no es la edad)',
    dek: 'La rodada estuvo increíble. Lo que la espalda opina distinto tiene que ver con algo que la moto no trae.',
    ...hero(125),
  },
  '126': { headline: 'Lo que no te cuentan de los viajes en moto: la espalda pide parada antes que el tanque', ...hero(126) },
  '127': { headline: 'En el coche hay respaldo. En la moto, nada. Por eso la espalda pide parada antes que el tanque', ...hero(127) },
  '128': { headline: H_4DE10, ...hero(128) },
  '129': { headline: '2 paradas por gasolina, 4 por la espalda: por qué pasa (y no es la edad)', ...hero(129) },
  '130': { headline: 'Casco, chamarra, guantes, botas… ¿y la espalda baja? Lo que le falta al equipo del motociclista', ...hero(130) },
  '131': { headline: 'Lo que la moto no trae: por qué la espalda pide parada antes que el tanque', ...hero(131) },
  '132': { headline: 'No es la edad. Es algo que la moto no trae.', ...hero(132) },
  // 133: solo la foto de arriba, sin la franja de texto del anuncio (la foto ocupa ~58% superior)
  '133': {
    headline: 'Por qué la espalda baja se resiente después de una rodada (y no siempre es por la edad)',
    ...hero(133),
    heroAspect: '1254 / 728',
  },
  '134': { headline: 'La moto aguanta 500 km. La espalda del piloto, 150. La razón no es la edad.', ...hero(134) },
  // Tarjetas negras: su imagen es la foto que les hace eco
  '135': {
    headline: 'Por qué tantos motociclistas se bajan de la moto con las manos en la cintura (y no es la edad)',
    dek: 'Bajarse de la moto con las manos en la cintura no es por la edad. Es que la moto no trae respaldo.',
    ...hero(128),
  },
  '136': {
    headline: 'La faja de gimnasio no está hecha para la moto. Esto es lo que sí le falta a la espalda',
    dek: 'La faja de gimnasio está hecha para cargar peso de pie, unos segundos. No para horas sentado en la moto.',
    ...hero(127),
  },
  '137': {
    headline: 'Cuenta las paradas: cuando la espalda pide parada antes que el tanque',
    dek: 'Si son más que las que pidió el tanque, no es la moto: es la espalda.',
    ...hero(129),
  },
  '138': {
    headline: H_4DE10,
    // Dato verificado (JDUHS): edad promedio 21.9 años, asociado al tiempo diario en moto.
    // NO usar "la mayoría tenía entre 20 y 30 años" — no está verificado.
    dek: 'En el estudio, la edad promedio era de 22 años. Lo que pesó fueron las horas arriba de la moto.',
    ...hero(132),
  },
}
// Claves antiguas (por si algún anuncio ya salió con ellas)
ADV_VARIANTS.a1 = ADV_VARIANTS['128']
ADV_VARIANTS.a2 = ADV_VARIANTS['134']
ADV_VARIANTS.a3 = ADV_VARIANTS['131']

export const ADV_DEFAULT_VARIANT = 'default'

/** Imagen del bloque 5 "lo que la moto no trae" (coche con respaldo vs moto sin respaldo = misma foto del anuncio 127).
 *  Si la variante ya la usa como imagen principal, la página muestra la ilustración vectorial para no repetirla. */
export const ADV_MECHANISM_IMAGE = AD_IMG[127]
export const ADV_MECHANISM_ALT = 'Asiento de coche con respaldo que sostiene la espalda, comparado con asiento de moto sin ningún apoyo'

/** Foto REAL del producto puesto (Leonel B., cliente) */
export const ADV_PRODUCT_PHOTO = `${SB_MSG}/1791663680441-cr0tattp1ss.webp`

/** Reseñas reales a mostrar (nombre exacto en rodataReviews.ts) */
// Ricardo L. = eco de la escena de la parada · Roberto G. = honesto ("no hace milagros") · Fernando L. = repartidor.
// Evitar reseñas con palabras de salud ("alivio", "dolor") por políticas de Meta.
export const ADV_REVIEW_NAMES = ['Ricardo L.', 'Roberto G.', 'Fernando L.']

/** Preguntas frecuentes del advertorial (tono rider, honesto — basadas en dudas/quejas reales de reseñas) */
export const ADV_FAQ: { q: string; a: string }[] = [
  {
    q: '¿Da calor?',
    a: 'Es de malla transpirable. En carretera casi no se siente; a mediodía en ciudad sí se nota como una capa más. Así lo dicen algunos clientes.',
  },
  {
    q: '¿Qué talla pido?',
    a: 'Se elige por la medida de tu cintura; la guía está en la página del producto. Si no te queda, el primer cambio de talla es gratis.',
  },
  {
    q: '¿Se nota debajo de la chamarra?',
    a: 'Es delgada y va pegada al cuerpo. La mayoría dice que a los pocos minutos ni se acuerda de que la trae.',
  },
  {
    q: '¿Cuánto tarda en llegar?',
    a: 'Preparamos tu pedido en 24 a 48 horas y el envío es gratis a todo México.',
  },
]

/** Microcopy de confianza debajo de los botones */
export const ADV_TRUST_LINE = 'Envío gratis · 30 días para devolver · 1er cambio de talla gratis'

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
    id: 'tailandia',
    label: 'Jongprasitkul et al. (2016). Prevalence and associated factors of low back pain among motorcycle taxi drivers in Sriracha. Chulalongkorn Medical Journal.',
    url: 'https://digital.car.chula.ac.th/clmjournal/vol60/iss1/3',
  },
  {
    id: 'estudiantes',
    label: 'Low back pain among student motorcyclists: a cross-sectional study. Journal of the Dow University of Health Sciences. (180 participantes, edad promedio 21.9 años, 53% con dolor lumbar; asociado al tiempo diario en moto.)',
    url: 'https://www.jduhs.com/index.php/jduhs/article/view/786',
  },
]