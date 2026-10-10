// Reseñas REALES de clientes RODATA (recibidas por WhatsApp, aprobadas por cada cliente).
// Todas son de los últimos 2 meses (sin fecha exacta → no mostrar fecha por reseña).
// Regla: NO inventar reseñas. Solo correcciones de ortografía o ediciones aprobadas.

const SB_MSG = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'

export interface RodataReview {
  name: string
  stars: number
  text: string
  tag?: string
  photo?: string
  photoPos?: string
}

export const PHOTO_REVIEWS: RodataReview[] = [
  {
    name: 'Pablo B.',
    stars: 5,
    tag: 'Rally ADV Jalisco 2026 · 4º lugar',
    photo: `${SB_MSG}/1791657732114-u068d1b4pr.webp?width=700&quality=75`,
    photoPos: '40% 50%',
    text: 'La usé en el Rally ADV Jalisco 2026 y quedé en 4º lugar. Varios compañeros del rally me preguntaron por ella y ya quieren comprar la suya.',
  },
  {
    name: 'Esteban V.',
    stars: 5,
    tag: '64 años · regresó a la moto',
    photo: `${SB_MSG}/1791657732114-c3mx3z3w5kt.webp?width=600&quality=75`,
    text: 'Tengo 64 años y fui coach de tenis en el tour WTA y ATP. Tengo problemas de espalda desde hace 20 años e incluso dejé la moto 10 años. Regresé hace 2 y usé mis fajas de siempre (buenas, recomendadas por fisios del tour), pero para la moto la RODATA ha sido muy superior: en comodidad, en soporte justo donde lo necesito y para rodar. Dos compas que salen conmigo ya compraron la suya por mi consejo y están encantados. Vale mucho la pena.',
  },
  {
    name: 'Alan M.',
    stars: 5,
    tag: 'Uso diario en ciudad',
    photo: `${SB_MSG}/1791657732114-ghaahb3lsec.webp?width=700&quality=75`,
    photoPos: '50% 70%',
    text: 'Muy contento con mi RODATA. Ando en la ciudad con mi moto todos los días y la traigo puesta siempre.',
  },
]

export const TEXT_REVIEWS: RodataReview[] = [
  { name: 'Ricardo L.', stars: 5, tag: 'BMW GS · rutas de 300–400 km', text: 'Tengo una BMW GS y normalmente hacemos rutas de 300 a 400 km. La diferencia la noté cuando paramos a desayunar después de un buen rato manejando. Me bajé de la moto sin esa sensación de traer toda la cintura tiesa. La verdad me sorprendió.' },
  { name: 'Fernando L.', stars: 5, tag: 'Repartidor · 7–8 h en moto', text: 'Soy repartidor y paso fácil 7 u 8 horas arriba de la moto. Al principio me la apretaba demasiado y me incomodaba, pero ya le agarré la medida. Lo que más noto es que al terminar el turno siento menos cargada la cintura. Para los que vivimos en la moto sí la recomiendo.' },
  { name: 'Roberto G.', stars: 5, tag: '54 años · rueda los domingos', text: 'Tengo 54 años y salgo a rodar casi todos los domingos. Antes, después de unas 2 horas ya empezaba con la molestia en la espalda baja. La estrené en una salida a Valle de Bravo y llegué mucho menos cansado de esa zona. No hace milagros, pero sí me ayudó bastante.' },
  { name: 'Jorge R.', stars: 5, text: 'Ya había probado una faja de las que venden en farmacia y la verdad no me gustó nada. Esta es diferente, se siente más firme y no se me anda moviendo cada vez que me bajo de la moto. Ya llevo como tres semanas usándola y hasta ahorita muy bien.' },
  { name: 'Humberto J.', stars: 5, tag: 'Ecatepec → CDMX diario', text: 'Voy diario de Ecatepec a la ciudad por trabajo. Entre los baches, topes y tráfico terminaba con la espalda cansadísima. Llevo dos semanas con la Rodata y he sentido bastante alivio. Además no se nota casi nada debajo de la chamarra.' },
  { name: 'Javier T.', stars: 5, text: 'La compré con algo de desconfianza por ser anuncio de Facebook. Pero llegó bien, está bien hecha y después de usarla en dos rodadas puedo decir que sí me ha servido. Buena compra.' },
  { name: 'Ricardo S.', stars: 5, text: 'Pensé que iba a ser estorbosa debajo de la chamarra, pero para nada. Me la puse desde las 7 de la mañana y después de un rato ni me acordaba que la traía. Buen producto.' },
  { name: 'Alejandro P.', stars: 5, text: 'Cada que regresaba de rodar llegaba quejándome de la espalda y mi esposa me decía que ya dejara la moto jajaja. Vio el anuncio y me dijo que la probara. Ya llevo cuatro salidas con ella y sí noto que termino mejor. Por ahora la voy a seguir usando.' },
  { name: 'Javier P.', stars: 5, text: 'La primera vez no estaba muy convencido, pero me fui acostumbrando. Ahora cuando voy a salir a carretera es de las primeras cosas que preparo junto con el casco y los guantes. Muy cómoda y me da ese soporte extra que andaba buscando.' },
  { name: 'Arturo V.', stars: 4, tag: 'Carretera', text: 'La probé en carretera y sí sentí buen soporte, especialmente cuando llevaba ya varias horas manejando. Lo único es que con el calor de mediodía sí se siente otra capa de ropa. Fuera de eso me gustó mucho, es ligera y se ajusta bien.' },
  { name: 'Raúl O.', stars: 3, text: 'Sí recomendaría el producto, aunque me parece que tienen algunos problemas en su logística.' },
  { name: 'Santiago J.', stars: 1, text: 'La verdad el producto sí está muy bueno, pero les pedí que llegara a tiempo porque tenía un viaje y llegó a los 8 días.' },
  { name: 'Ricardo C.', stars: 1, text: 'Ojalá hubiera llegado a tiempo... el producto está bien.' },
]

// ── Estadísticas derivadas (NUNCA hardcodear rating/conteo: se calculan de las reseñas publicadas) ──
export const ALL_REVIEWS: RodataReview[] = [...PHOTO_REVIEWS, ...TEXT_REVIEWS]

const total = ALL_REVIEWS.length
const sum = ALL_REVIEWS.reduce((acc, r) => acc + r.stars, 0)

export const REVIEW_STATS = {
  total,
  average: total ? Math.round((sum / total) * 10) / 10 : 0,
  /** Conteo por estrellas, de 5 a 1 */
  distribution: [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: ALL_REVIEWS.filter(r => r.stars === stars).length,
  })),
}