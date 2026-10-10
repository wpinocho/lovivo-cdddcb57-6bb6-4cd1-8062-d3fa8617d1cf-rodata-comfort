// Reseñas REALES de clientes RODATA (recibidas por WhatsApp, validadas y publicadas con consentimiento de cada cliente).
// Lote original (16) sin fecha exacta. Lote 2026-10-10 (150) con fecha — confirmado real por el cliente.
// Regla: NO inventar reseñas. Solo correcciones de ortografía o ediciones aprobadas.

const SB_MSG = 'https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1'

export interface RodataReview {
  name: string
  stars: number
  text: string
  tag?: string
  photo?: string
  photoPos?: string
  /** ISO YYYY-MM-DD — solo si la fecha es real */
  date?: string
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** '2026-10-09' → '9 oct 2026' */
export const formatReviewDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
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

// Lote original: positivas primero; las 3 quejas de logística van al final de TEXT_REVIEWS.
const ORIGINAL_TEXT_REVIEWS: RodataReview[] = [
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
]

const ORIGINAL_LOGISTICS_COMPLAINTS: RodataReview[] = [
  { name: 'Raúl O.', stars: 3, text: 'Sí recomendaría el producto, aunque me parece que tienen algunos problemas en su logística.' },
  { name: 'Santiago J.', stars: 1, text: 'La verdad el producto sí está muy bueno, pero les pedí que llegara a tiempo porque tenía un viaje y llegó a los 8 días.' },
  { name: 'Ricardo C.', stars: 1, text: 'Ojalá hubiera llegado a tiempo... el producto está bien.' },
]

// Lote 2026-10-10 — [nombre, fecha, estrellas, texto]. Se muestran de la más reciente a la más antigua.
const DATED: [string, string, number, string][] = [
  ['Rubén M.', '2026-10-09', 5, 'Tengo 52 años y salgo a rodar casi todos los domingos. La semana pasada hicimos como 280 km y la verdad sí sentí diferencia. Antes llegaba con la cintura toda tiesa. Muy buena compra.'],
  ['Arturo V.', '2026-10-07', 5, 'La compré porque varios compañeros del grupo ya usan soporte lumbar. La estrené de camino a Cuernavaca y me gustó bastante. Se siente firme pero no te limita para manejar.'],
  ['Héctor G.', '2026-10-05', 4, 'Buen producto. Tengo una V-Strom 650 y después de unas tres horas de carretera normalmente ya ando buscando dónde parar. Con la faja terminé más cómodo. Le doy 4 porque cuesta un poquito agarrarle el ajuste correcto.'],
  ['Gabriel S.', '2026-10-02', 5, 'Ya llevo tres rodadas con ella. Lo que más me gusta es que no se enrolla cuando te inclinas hacia adelante. Eso era lo que me pasaba con otra que tenía.'],
  ['Eduardo L.', '2026-09-30', 5, 'La primera hora no noté gran cosa, pero al final de la ruta sí. Me bajé de la moto menos cansado de la parte baja de la espalda. Para mí valió la pena.'],
  ['René C.', '2026-09-28', 4, 'Tengo 61 años y sigo saliendo a carretera con mis amigos. Me ha servido bien, aunque en los días de mucho calor sí se siente que traes algo extra debajo de la chamarra. Fuera de eso muy recomendable.'],
  ['Jorge D.', '2026-09-25', 5, 'Lo mejor es que no tengo que andar acomodándola en cada parada. La ajusto antes de salir y listo. Llevo un mes usándola.'],
  ['Óscar B.', '2026-09-21', 5, 'Fuimos de Puebla a Oaxaca en moto y decidí llevarla para probarla. Sí me ayudó bastante, sobre todo de regreso que ya traía varias horas encima. No esperaba mucho y me sorprendió.'],
  ['Martín P.', '2026-09-18', 4, 'Buena calidad, los velcros agarran bien y se ve resistente. La he usado unas cinco veces. Todavía estoy viendo cómo me acomoda mejor debajo de la chamarra, pero en general estoy contento.'],
  ['Ernesto A.', '2026-09-15', 5, 'A mis 57 ya no aguanto las rodadas como antes jajaja. La compré más que nada para tener soporte extra y sí se agradece. La recomiendo para los que hacemos carretera.'],
  ['Víctor H.', '2026-09-12', 5, 'Uso una BMW 1250 GS y me quedé con muy buena impresión. No es estorbosa, no se mueve y al bajarte de la moto después de varias horas se agradece haberla traído.'],
  ['Luis F.', '2026-09-10', 3, 'Está bien hecha y sí da soporte, pero esperaba que fuera un poco más fresca. En carretera a buena temperatura la uso sin problema, en ciudad con calor prefiero quitármela.'],
  ['Ramiro T.', '2026-09-08', 5, 'La verdad la compré porque ya estaba harto de terminar las rodadas sobándome la cintura. Llevo cuatro salidas y hasta ahora me ha funcionado muy bien.'],
  ['Gerardo N.', '2026-09-04', 5, 'Muy cómoda. Hicimos una ruta a Tequisquiapan y ni me acordé que la traía puesta. Eso para mí es lo importante.'],
  ['Felipe R.', '2026-09-01', 4, 'Me gustó la faja, se siente de buena calidad. Al principio la traía demasiado apretada y me molestaba sentado. Ya que la aflojé tantito cambió muchísimo.'],
  ['Tomás E.', '2026-08-29', 5, 'Yo tengo una Harley y hago viajes largos con mi esposa. La probé por curiosidad y me gustó. Me siento mejor apoyado de la espalda cuando llevamos un buen rato rodando.'],
  ['Gustavo M.', '2026-08-25', 5, 'Me convenció que tuviera los 30 días para probarla. Ya llevo dos semanas y no pienso regresarla. Cómoda y práctica.'],
  ['Sergio J.', '2026-08-23', 5, 'Tengo una Versys y acostumbro salir temprano los sábados. Antes después del desayuno ya empezaba a sentir la espalda cargada. Ahora termino la ruta mucho mejor. Muy contento con mi compra.'],
  ['Israel Q.', '2026-08-20', 4, 'La probé en una rodada de casi 400 kilómetros. Cumplió bien, aunque sí hay que acomodarla antes de ponerse toda la ropa de moto. Ya puesta no da problemas.'],
  ['Manuel Z.', '2026-08-18', 5, 'La compré pensando que sería como cualquier faja y no. Es mucho más ligera de lo que imaginaba y se siente bien el soporte. Buena opción.'],
  ['Jaime O.', '2026-08-14', 5, 'Salgo con un grupo de veteranos cada quince días. Ya se la recomendé a dos compañeros. A mí me ha servido bastante y por eso la recomiendo.'],
  ['Mario U.', '2026-08-10', 5, 'Me gustó más de lo que esperaba. La he usado en carretera y en terracería ligera, y en ambas me he sentido cómodo.'],
  ['Raúl K.', '2026-08-06', 4, 'Se siente firme y no se baja. Le quitaría una estrella porque me costó encontrar la posición que más me acomoda. Ya después de eso excelente.'],
  ['César B.', '2026-08-01', 5, 'Tengo años manejando moto y es la primera vez que uso algo así. La verdad sí me gustó. Al bajarme después de una rodada larga noto menos tensión en la cintura.'],
  ['Ricardo Y.', '2026-07-29', 5, 'La usé de CDMX a San Miguel de Allende. Llegué bastante bien y eso que normalmente me canso de la espalda. Ahora la llevo siempre que salgo lejos.'],
  ['Brandon M.', '2026-10-08', 5, 'Trabajo en entregas y hay días que paso 9 horas en la moto. La compré porque terminaba con la espalda bien cansada. Llevo 15 días usándola y sí siento que me ayuda. Hasta ahorita todo bien.'],
  ['Kevin L.', '2026-10-06', 4, 'Muy buena para trabajar. Lo único es que cuando hace mucho calor sí sudo un poco más de la cintura, pero prefiero traerla porque siento buen apoyo.'],
  ['Josué R.', '2026-10-03', 5, 'Llevo una semana con ella. Trabajo todo el día arriba de mi moto y ya desde el segundo día empecé a sentirme más cómodo. Ojalá dure porque sí me gustó.'],
  ['Alan P.', '2026-09-29', 5, 'La compré por el descuento. No estaba muy seguro pero la neta sí está buena, aprieta bien sin molestar y no se va subiendo como otras.'],
  ['Edwin T.', '2026-09-26', 3, 'Sí da soporte pero tampoco es que te quite todo el cansancio. Para turnos largos está bien, aunque pensé que sería más delgada. La voy a seguir probando.'],
  ['Ángel F.', '2026-09-23', 5, 'Me la pongo a las 8 que empiezo a repartir y casi no me la quito. Lo bueno es que aunque me esté subiendo y bajando de la moto no se afloja.'],
  ['Omar V.', '2026-09-19', 4, 'Está buena. Después de cinco horas manejando ya se siente la diferencia. Solo estaría mejor si fuera un poquito más fresca para los que andamos repartiendo en el sol.'],
  ['Cristian D.', '2026-09-16', 5, 'La uso todos los días para trabajar. Ya tengo casi un mes y sigue ajustando igual de bien que cuando llegó.'],
  ['Erick N.', '2026-09-11', 5, 'Tengo 43 años y llevo muchos años trabajando en moto. Ya había comprado otras fajas y ninguna me había convencido. Esta es de las más cómodas que he usado.'],
  ['Francisco J.', '2026-09-09', 4, 'El envío se tardó un poquito más de lo que esperaba pero llegó todo bien. La faja se siente resistente y cumple lo que buscaba.'],
  ['Marco C.', '2026-09-05', 5, 'En mi trabajo hago muchas entregas y antes me quitaba la faja porque me estorbaba. Esta no, una vez que la ajustas casi no la sientes.'],
  ['Diego A.', '2026-09-02', 5, 'La verdad está chida. Manejo una Italika para trabajar y me ha ayudado bastante con la postura. El material se ve bueno.'],
  ['José G.', '2026-08-30', 3, 'No está mal, sí sostiene bien la espalda. Solo que a mí me incomoda un poco cuando estoy sentado mucho tiempo sin moverme. Igual la sigo usando en los turnos cortos.'],
  ['Alexis H.', '2026-08-27', 5, 'Un compa del trabajo me dijo que probara una de estas. Tenía mis dudas pero después de dos semanas ya siento que fue buena inversión.'],
  ['Bryan S.', '2026-08-24', 5, 'Me quedó bien y se siente cómoda para manejar. Todo correcto con el pedido.'],
  ['Efraín L.', '2026-08-19', 4, 'Me sirve bastante en el trabajo. Nada más que el velcro a veces agarra pelusita de la ropa, hay que mantenerlo limpio. Por lo demás muy bien.'],
  ['David M.', '2026-08-13', 5, 'Antes acababa el turno y lo primero que hacía era acostarme un rato por la espalda. Con esta me he sentido menos molido. Sí la volvería a comprar.'],
  ['Antonio B.', '2026-08-07', 5, 'Tengo un negocio y hago mis propias entregas. La uso cuando sé que voy a manejar varias horas seguidas. Muy buena.'],
  ['Samuel P.', '2026-07-30', 4, 'La faja está bien y no es pesada. En mi caso funciona mejor si la dejo un poco floja porque estoy subiendo y bajando mucho de la moto.'],
  ['Iván R.', '2026-07-15', 5, 'Excelente, la recomiendo para los que vivimos prácticamente arriba de la moto. Tengo ya varias semanas con ella y todo bien.'],
  ['Roberto M.', '2026-10-09', 5, 'Todos los días hago Naucalpan a Polanco y entre tráfico y topes acababa con la espalda cansada. La llevo usando dos semanas y me ha gustado bastante.'],
  ['Daniela V.', '2026-10-07', 4, 'La uso para ir a la oficina. Me gusta que no se nota debajo de la chamarra y puedo traerla puesta durante el trayecto. Al principio me costó acostumbrarme pero ya bien.'],
  ['Carlos N.', '2026-10-04', 5, 'Excelente compra. La moto es mi transporte de diario y con tanto tráfico sí terminaba adolorido. Por ahora me ha funcionado muy bien.'],
  ['Irene L.', '2026-10-01', 5, 'No pensé que fuera a gustarme tanto. Es fácil de poner, no pesa y se siente el apoyo en la espalda baja. Estoy satisfecha.'],
  ['Miguel A.', '2026-09-28', 3, 'La faja está buena pero mi chamarra me queda algo justa y con la faja puesta ya siento todo apretado. Tendré que usar otra chamarra o traerla por fuera. El producto como tal sí me gustó.'],
  ['Karla J.', '2026-09-24', 5, 'La compré para mi esposo que se mueve diario en moto. Ya me dijo varias veces que le ha servido mucho. Fue buen regalo.'],
  ['Alberto S.', '2026-09-20', 5, 'Aproximadamente hago 70 km diarios entre ida y vuelta del trabajo. Llevo un mes con la Rodata y sí he notado que termino el día más cómodo.'],
  ['Fabián C.', '2026-09-17', 4, 'Cómoda para la moto y para caminar un rato. En la oficina sí me la quito porque prefiero estar sin nada puesto. Para el trayecto cumple perfecto.'],
  ['Mariana R.', '2026-09-13', 5, 'Mi papá tiene 58 años y usa su moto casi todos los días. Se la regalé de cumpleaños y le gustó mucho. Dice que ya hasta se siente raro cuando sale sin ella.'],
  ['Pablo G.', '2026-09-09', 5, 'Me preocupaba que se viera muy aparatosa debajo de la ropa. Pero no, con una sudadera o chamarra normal ni se nota.'],
  ['Rodrigo F.', '2026-09-06', 5, 'Muy recomendable. Dos compañeros del trabajo me preguntaron dónde la conseguí porque siempre me la pongo antes de salir. Buena calidad.'],
  ['Adrián V.', '2026-09-03', 4, 'Los primeros dos días me molestaba porque me la ponía demasiado abajo. Vi cómo ajustarla y ya no he tenido problema. Me ha ayudado en los trayectos largos.'],
  ['Alejandra T.', '2026-08-31', 5, 'Uso moto para todo, supermercado, trabajo, ir a ver a mis papás. Me gusta mucho porque es ligera y la puedo guardar en la mochila cuando no la necesito.'],
  ['Saúl M.', '2026-08-26', 5, 'Tengo más de un mes usándola casi diario. Los materiales siguen bien, no se ha despegado nada y el ajuste se mantiene.'],
  ['Esteban P.', '2026-08-22', 3, 'Me gustó el producto pero creo que podrían explicar mejor cómo colocarlo. Me tomó varias pruebas encontrar una posición cómoda. Ya ajustado sí funciona bien para mí.'],
  ['Laura C.', '2026-08-17', 5, 'Se la regalé a mi novio porque siempre se quejaba de la espalda después del trabajo. Ya tiene varias semanas usándola y dice que se siente mucho más cómodo.'],
  ['Nicolás Q.', '2026-08-12', 5, 'Se siente mejor que la faja deportiva que tenía. Especialmente cuando me inclino hacia el manubrio. Me gustó mucho.'],
  ['Berenice D.', '2026-08-05', 4, 'La compré para manejar mi moto de lunes a viernes. Se ajusta bien, solo me gustaría que fuera un poquito menos alta. Por lo demás cumple.'],
  ['Mauricio H.', '2026-07-26', 5, 'No es una compra que tuviera planeada, me salió el anuncio y me llamó la atención. La pedí para probar y terminé usándola diario.'],
  ['Noé R.', '2026-07-12', 5, 'La verdad sí se siente más cómoda la espalda en el tráfico. Sobre todo en esos días que te avientas más de una hora parado y avanzando a vuelta de rueda.'],
  ['Patricia M.', '2026-10-09', 5, 'Llegó bien empacada y se ve de buena calidad. La compré para un viaje que tenemos próximamente y ya la probé en trayectos cortos. Hasta ahora me ha gustado.'],
  ['Edgar L.', '2026-10-06', 4, 'Está bastante bien. Pensé que sería más rígida por las fotos pero es flexible y permite moverte. Me habría gustado que viniera con una guía más completa para ajustarla.'],
  ['Enrique S.', '2026-10-03', 5, 'Las bandas de ajuste agarran muy bien. He comprado otras que después de una hora ya se aflojaron. Con esta no me ha pasado.'],
  ['Fernando P.', '2026-09-30', 5, 'Se me hacía algo cara para ser una faja, pero una vez que la recibí entendí mejor el producto. No se siente como las fajas económicas que venden en cualquier tienda.'],
  ['Andrés J.', '2026-09-27', 5, 'Nunca había usado soporte lumbar y pensé que me iba a estorbar para manejar. Nada que ver. Se siente bastante natural una vez que te acostumbras.'],
  ['Juan C.', '2026-09-24', 4, 'La caja llegó algo golpeada pero la faja venía perfecta. Ya la probé dos días y me pareció muy cómoda.'],
  ['Ignacio A.', '2026-09-20', 5, 'Muy buen soporte en la parte baja de la espalda. Soy de complexión grande y tenía dudas con el ajuste, pero me quedó bien. Buena compra.'],
  ['Alicia G.', '2026-09-17', 5, 'Mi papá no compra casi nada por internet y menos cosas que salen anunciadas en Facebook. Se la pedí yo y ahora está feliz con su faja. Dice que es muy cómoda.'],
  ['Benjamín T.', '2026-09-14', 3, 'El soporte es bueno pero una orilla me roza un poco cuando uso cierta playera. Con ropa más gruesa no tengo problema. Creo que depende mucho de cómo te la pongas.'],
  ['Ricardo F.', '2026-09-11', 5, 'Tenía desconfianza de pedir en una página que no conocía. Me llegó mi confirmación, pude seguir el paquete y recibí exactamente lo que pedí. Ya la usé y muy bien.'],
  ['Álvaro H.', '2026-09-07', 4, 'Me gustó la calidad. El velcro hace bastante ruido cuando te la quitas jajaja, pero agarra muy bien. Se ve que va a durar.'],
  ['Salvador M.', '2026-09-04', 5, 'Pensé que sería más pesada. Está muy ligera y la puedo guardar fácilmente en la maleta de la moto.'],
  ['Itzel B.', '2026-09-01', 5, 'Tuve dudas antes de pedirla y me ayudaron a resolverlas. La faja llegó bien y se ve exactamente como en las imágenes. Gracias.'],
  ['Daniel P.', '2026-08-28', 4, 'La uso encima de una playera delgada y debajo de la chamarra. Así me resulta mucho más cómoda que directamente sobre la piel. Buen soporte.'],
  ['Rubí L.', '2026-08-23', 5, 'Se la regalé a mi esposo por su cumpleaños. Le gustó tanto que al día siguiente salió a rodar con ella para probarla. Muy contento con su regalo.'],
  ['Héctor C.', '2026-08-18', 5, 'Muy buen producto. Me preocupaba que fuera demasiado gruesa para mi chamarra de moto pero me quedó bien. No siento que me quite movilidad.'],
  ['Óscar E.', '2026-08-13', 5, 'Llegó todo completo. Me gustó la presentación y sobre todo que la faja no se ve corriente. Los materiales se sienten buenos.'],
  ['Matías M.', '2026-08-09', 4, 'El primer día me la puse mal y no entendía por qué me incomodaba. Después la ajusté mejor y ya llevo una semana usándola sin problema.'],
  ['Ana V.', '2026-08-04', 5, 'La uso varias veces por semana y ya la he lavado. Se ha mantenido bien y no perdió su forma. Contentísima.'],
  ['Tadeo R.', '2026-07-17', 3, 'Pensé que sería un poco más suave. Sí se siente el soporte pero tengo que acostumbrarme a la firmeza. La calidad está bien.'],
  ['Juan Manuel P.', '2026-10-09', 3, 'La pedí después de ver varios anuncios. Sí ayuda un poco con el cansancio pero esperaba una diferencia más grande. No me arrepiento de comprarla, aunque tampoco diría que es indispensable.'],
  ['Pedro N.', '2026-10-06', 5, 'Tengo una Himalayan y hago bastante carretera. La llevo usando como un mes y me ha resultado excelente. No se mueve ni molesta al manejar parado un rato.'],
  ['Gloria R.', '2026-10-02', 4, 'Se la compré a mi hermano y dice que le gustó. Lo único es que al principio no sabía cómo apretarla bien. Ya después me dijo que muy cómoda.'],
  ['Abel S.', '2026-09-27', 3, 'A mí no me terminó de acomodar. Siento el soporte pero al sentarme en mi moto me presiona en una parte que no me gusta. La calidad no está mal, simplemente creo que no es para mí.'],
  ['Ramón D.', '2026-09-22', 3, 'Está bien, cumple con dar soporte. Lo que no me convence es usar otra capa de ropa cuando hace calor. Para salidas temprano sí me funciona.'],
  ['Cecilia G.', '2026-09-17', 5, 'Muy contenta con la compra. Me gusta que puedo ajustar la presión dependiendo de qué tan cómoda me quiera sentir. La uso especialmente cuando voy a salir lejos.'],
  ['Axel T.', '2026-09-12', 4, 'Se ve buena y está cómoda. La he usado para ir a trabajar y para salir el fin. No le pongo 5 porque apenas llevo unos días, quiero ver cómo aguanta con el tiempo.'],
  ['Guillermo C.', '2026-09-08', 3, 'Me costó trabajo encontrarle el modo. Si la aprieto mucho se vuelve incómoda, si la dejo floja casi no siento el soporte. Ya encontré un punto medio y va mejor.'],
  ['Olga F.', '2026-09-03', 5, 'Mi esposo la usa desde que llegó. Pensé que la iba a dejar guardada como otras cosas que compra para su moto, pero no, se la pone cada vez que sale.'],
  ['Octavio M.', '2026-08-29', 3, 'Tengo una deportiva y la posición es bastante inclinada. En mi caso me da buen apoyo pero a veces siento presión en el abdomen. Quizás en motos más rectas sea más cómoda.'],
  ['Lucía P.', '2026-08-20', 4, 'Me gusta la faja y sí la uso, pero me gustaría que se pudiera ajustar un poco más a la forma de mi cintura. El material está excelente.'],
  ['Beto H.', '2026-08-13', 5, 'La llevé a una rodada de más de 5 horas y terminé bastante mejor de lo que esperaba. Ya se volvió parte de mi equipo. Gracias Rodata.'],
  ['Rubén C.', '2026-08-05', 4, 'La he usado varias veces y en general funciona bien. A veces tengo que reajustarla después de parar a comer, pero no es gran problema.'],
  ['Joel L.', '2026-07-23', 3, 'El material se siente de buena calidad. En comodidad le doy un 7 de 10. Me ayuda cuando manejo pero para caminar mucho rato prefiero quitármela.'],
  ['Nancy V.', '2026-07-11', 5, 'Tengo 49 años y sigo usando mi moto para moverme a todos lados. Compré la Rodata con pocas expectativas pero me gustó. Se siente bien puesta y ya se la recomendé a una amiga que también anda en moto.'],
  ['Rafael E.', '2026-10-10', 5, 'Tengo una Honda Africa Twin y acostumbro salir los fines de semana. Ya van tres rodadas que hago con la faja y definitivamente me siento más cómodo. La verdad pensé que iba a estorbarme pero para nada.'],
  ['Alejandro V.', '2026-10-09', 5, 'Muy buen producto. Se ajusta bien y no se anda moviendo. La uso cada que salgo a carretera.'],
  ['Horacio M.', '2026-10-08', 5, 'Tengo 56 años y después de muchos años en moto ya empezaba a sentir bastante la espalda. Un amigo me recomendó probar un soporte lumbar y encontré este. Llevo casi un mes y me ha caído de maravilla. Saludos desde Guadalajara.'],
  ['Esteban C.', '2026-10-07', 5, 'La compré para un viaje a Querétaro y terminó siendo una excelente compra. Se siente el apoyo sin estar demasiado rígida. Me gustó mucho.'],
  ['Germán P.', '2026-10-05', 5, 'Excelente faja, muy cómoda y de buen material. Llegó sin problemas.'],
  ['Raúl A.', '2026-10-04', 5, 'Soy de Monterrey y acá rodamos bastante los domingos. La primera vez me la puse muy apretada y no me gustó, pero ya que le encontré el ajuste es otra cosa. Ayer hicimos poco más de 200 km y terminé bastante bien.'],
  ['Fernando R.', '2026-10-03', 5, 'No suelo dejar reseñas pero esta sí se la ganó. La llevo usando diario para ir al trabajo y de verdad se agradece el soporte después de tanto tráfico.'],
  ['Alberto D.', '2026-10-01', 5, 'Me la regaló mi hija porque siempre regresaba de las rodadas quejándome de la cintura jajaja. Ya van varias salidas y sí noto la diferencia. Buen regalo.'],
  ['Mauricio F.', '2026-09-30', 5, 'Me gustó que no es tan aparatosa como parece en las fotos. La llevo debajo de mi chamarra y no tengo problema para moverme. Muy recomendable.'],
  ['Carlos H.', '2026-09-28', 5, 'Cumple lo que promete. Buen ajuste, buen soporte y materiales de calidad. La recomendaría sin problema.'],
  ['Joaquín S.', '2026-09-26', 5, 'Tengo una Royal Enfield Interceptor y después de una hora o dos manejando ya me empezaba a cansar la espalda. Con la Rodata me siento más apoyado, sobre todo en los trayectos largos. Me sorprendió para bien.'],
  ['Eduardo B.', '2026-09-24', 5, 'Llegó el paquete ayer y hoy salí a dar una vuelta de aproximadamente 80 km. Primera impresión muy buena. Cómoda y fácil de poner.'],
  ['Luis Enrique T.', '2026-09-22', 5, 'La verdad tenía mis dudas porque ya había comprado otras fajas y terminaban guardadas. Esta se siente distinta, más pensada para estar sentado en la moto. Llevo dos semanas poniéndomela sin falta.'],
  ['Ricardo J.', '2026-09-20', 5, 'Muy buena calidad. Me gustó mucho que las bandas no se aflojan mientras manejas.'],
  ['Armando L.', '2026-09-18', 5, 'Acabamos de hacer una rodada por Mil Cumbres y fue la primera vez que la usé tantas horas. Lo que más noté fue al bajarme de la moto, normalmente termino bastante tieso y esta vez no tanto. La recomiendo.'],
  ['Enrique M.', '2026-09-16', 5, 'Tengo 48 años, llevo más de 20 andando en moto y nunca había utilizado una faja. Me animé por la garantía de prueba y la verdad estoy contento. Es cómoda y siento que me ayuda con la postura.'],
  ['Sergio A.', '2026-09-14', 5, 'Muy práctica, la doblo y la guardo en la maleta de mi moto. La uso principalmente para viajes de más de dos horas.'],
  ['Víctor Manuel G.', '2026-09-12', 5, 'Tengo una Dominar 400 y la ocupo prácticamente todos los días. Ya llevaba tiempo buscando algo para apoyar la espalda y hasta ahora esta me ha funcionado muy bien. Se siente firme pero no incómoda.'],
  ['Daniel O.', '2026-09-10', 5, 'Muy satisfecho. Pensaba que iba a sudar muchísimo con ella, pero la malla me ha resultado bastante cómoda. Obviamente se siente otra capa pero nada grave.'],
  ['Jaime R.', '2026-09-08', 5, 'Excelente compra. La probé en una salida a Valle de Bravo y me gustó tanto que ya se la recomendé a mis compañeros del grupo.'],
  ['Ernesto V.', '2026-09-06', 5, 'Tengo 63 años y todavía me gusta hacer mis viajes en moto. Esta faja me ayuda a sentir la espalda más firme cuando llevo mucho tiempo sentado. Muy agradecido por el producto.'],
  ['Javier N.', '2026-09-04', 5, 'Al principio no sabía si pedirla porque nunca había escuchado de la marca. Me llegó todo bien y el producto está mejor de lo que esperaba. Ya la he usado cuatro veces.'],
  ['Francisco E.', '2026-09-02', 5, 'La uso en una Yamaha MT-07. Por la posición en la que manejo pensé que me iba a estorbar, pero se adapta bien. Me gustó.'],
  ['Rodrigo C.', '2026-08-31', 5, 'Está excelente. Mi trayecto al trabajo es de casi una hora de ida y otra de regreso. Antes llegaba con la cintura muy cansada y ahora termino más cómodo. Buena inversión.'],
  ['Tomás L.', '2026-08-29', 5, 'La calidad me sorprendió, especialmente el ajuste. No se ve ni se siente como una faja barata.'],
  ['Felipe G.', '2026-08-27', 5, 'Soy de los que se detienen cada rato en las rodadas porque se me empieza a cargar la espalda. La llevé a Zacatlán y me sentí bastante mejor durante el trayecto. Muy contento hasta ahorita.'],
  ['Óscar Manuel P.', '2026-08-25', 5, 'La compre para mi papá que tiene 59 años y sale mucho en carretera. Ya la estrenó y me dice que le quedó perfecta, gracias!!'],
  ['Benjamín C.', '2026-08-23', 5, 'La verdad está muy buena. No me gusta usar cosas que me limiten para moverme y esta no lo hace. Ya se volvió parte de mi equipo cuando salgo en la moto.'],
  ['Marco Antonio D.', '2026-08-21', 5, 'Salimos de León rumbo a Guanajuato y después seguimos hasta Dolores Hidalgo. Fue mi primera rodada con la faja y me resultó muy cómoda. Tengo 51 años y cada vez valoro más estas cosas.'],
  ['Jesús A.', '2026-08-19', 5, 'Todo bien con mi pedido. La faja cumple y no se me ha movido mientras manejo. Saludos.'],
  ['Rubén S.', '2026-08-17', 5, 'Yo manejo una moto de trabajo y aparte tengo otra para salir los domingos. La uso en las dos. La diferencia más grande la noto cuando paso varias horas manejando sin descanso.'],
  ['Ricardo Alberto M.', '2026-08-15', 5, 'Me llegó hace unas tres semanas. Al principio pensaba usarla solo para carretera pero terminé poniéndomela también para la ciudad. Es bastante cómoda.'],
  ['Hugo R.', '2026-08-13', 5, 'Muy recomendable, tengo 47 años y una V-Strom. La compré porque quería algo más cómodo que mi faja de gimnasio. Me gustó sobre todo que no tengo que estar acomodándola.'],
  ['Roberto A.', '2026-08-11', 5, 'Se nota que está pensada para motociclistas. No es demasiado pesada y la parte de atrás da buen soporte.'],
  ['Iván E.', '2026-08-09', 5, 'La compré con bastante escepticismo, más que nada por probar. Después de una rodada de 250 km terminé convencido. No es que no te canses, pero sí he sentido menos molestias al regresar.'],
  ['Martín J.', '2026-08-07', 5, 'Excelente atención y excelente producto. Me quedó bien desde el primer día. Volvería a comprar.'],
  ['Adolfo T.', '2026-08-05', 5, 'Tengo una BMW F 750 GS y me gusta mucho viajar con mi esposa. La Rodata me ha servido especialmente en los trayectos de varias horas. Es discreta y no estorba con la chamarra.'],
  ['Samuel G.', '2026-08-03', 5, 'Lo que más me gustó fue la firmeza. He usado otras que parecen una liga alrededor de la cintura. Esta sí se siente que sostiene.'],
  ['Guillermo R.', '2026-08-01', 5, 'Me la recomendaron y no me arrepiento. Tengo poco más de un mes usándola y sigue como nueva. Muy buen producto.'],
  ['Miguel Ángel V.', '2026-07-30', 5, 'La compré porque hago ruta de Toluca a CDMX varias veces a la semana. Entre el frío, las horas de manejo y el tráfico acababa todo entumido. Con la faja siento la espalda más apoyada. Bastante bien.'],
  ['Salvador H.', '2026-07-28', 5, 'Muy buena compra. Tengo 55 años y me encanta salir a rodar. Ya casi no salgo sin ponérmela.'],
  ['Diego F.', '2026-07-26', 5, 'Me gustó bastante. Es sencilla de usar y se siente cómoda incluso cuando vas inclinado en la moto. La recomiendo.'],
  ['Pedro Luis N.', '2026-07-24', 5, 'Soy repartidor desde hace 6 años y ya había probado varias fajas. Esta se ajusta mucho mejor que la última que tenía. Después de todo el turno sigo sintiendo el soporte.'],
  ['Manuel A.', '2026-07-22', 5, 'La estrené este fin de semana y me fue muy bien. Fuimos hasta Taxco y regresamos el mismo día. Terminé cansado como siempre por la manejada, pero con la espalda bastante más cómoda.'],
  ['Héctor Manuel L.', '2026-07-20', 5, 'De las mejores cosas que le he comprado a mi equipo de moto últimamente. Por lo que cuesta vale mucho la pena.'],
  ['Sebastián P.', '2026-07-18', 5, 'Muy cómoda, buen ajuste y buena calidad. No tengo queja alguna.'],
  ['Eduardo C.', '2026-07-16', 5, 'Mi hermano y yo salimos juntos a carretera y él fue quien me habló de esta faja. Ya la probé en dos viajes y me ha gustado mucho. Especialmente porque no me limita cuando tomo curvas.'],
  ['Abelardo M.', '2026-07-14', 5, 'Me sorprendió que fuera tan ligera. Pensaba que por ser un soporte lumbar iba a ser una cosa rígida e incómoda. Nada que ver, la uso sin problema debajo de mi equipo.'],
  ['Juan Carlos F.', '2026-07-12', 5, 'Tengo 60 años y manejo desde joven. Ya no hago viajes tan largos como antes, pero todavía disfruto muchísimo salir los domingos. La faja me ha ayudado a seguir haciendo mis recorridos con más comodidad.'],
  ['Arturo G.', '2026-07-11', 5, 'La verdad quedé bastante contento con Rodata. La compré porque vi un anuncio y pensé que podría servirme para mis viajes. Después de varias salidas ya puedo decir que fue una buena decisión. Cómoda, ligera y con buen soporte. La recomiendo.'],
]

const DATED_REVIEWS: RodataReview[] = DATED
  .map(([name, date, stars, text]) => ({ name, date, stars, text }))
  .sort((a, b) => b.date.localeCompare(a.date))

// Orden: lote original positivo → lote con fecha (más reciente primero) → quejas de logística del lote original.
export const TEXT_REVIEWS: RodataReview[] = [
  ...ORIGINAL_TEXT_REVIEWS,
  ...DATED_REVIEWS,
  ...ORIGINAL_LOGISTICS_COMPLAINTS,
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