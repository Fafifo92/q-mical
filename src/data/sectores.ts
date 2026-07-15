/**
 * 📝 COPY DE LAS LANDINGS DE SEGMENTOS DE MERCADO (/sectores/<slug>)
 * ------------------------------------------------------------------
 * Un objeto por sector. Para editar el texto de una landing, edita aquí.
 * Los slugs deben existir en SECTORES (taxonomy.ts); las especialidadesClave
 * deben ser slugs de ESPECIALIDADES con productos en ese sector.
 *
 * Regla de la casa: nada de claims médicos, garantías de desempeño ni
 * trámites regulatorios prometidos ("te orientamos" — el trámite es del cliente).
 */

export interface SectorCopy {
  slug: string;
  titulo: string;
  intro: string[];
  retos: { titulo: string; texto: string }[];
  especialidadesClave: string[];
  regulatorio: string | null;
  mensajeWhatsApp: string;
}

export const SECTORES_COPY: SectorCopy[] = [
  {
    "slug": "cosmetica-personal",
    "titulo": "Formular bien empieza por comprar bien",
    "intro": [
      "Formular cuidado personal en Colombia significa responder a un consumidor que lee la etiqueta INCI, pide origen natural y compara contra marcas globales — muchas veces con volúmenes que a los grandes importadores no les interesan. A eso se suman los dolores del oficio: referencias que desaparecen sin aviso, lotes que llegan distintos al anterior y tiempos de importación que no conversan con el calendario de lanzamientos. El ingrediente correcto, con datos confiables, es la mitad de la fórmula.",
      "Para eso construimos un portafolio de 120 materias primas de cuidado personal: extractos botánicos, emolientes, humectantes, activos, tensoactivos suaves y los espesantes que sostienen la textura. Cada despacho sale con ficha técnica, FDS y certificado de análisis del lote, y antes de comprar puedes evaluar muestras en tu propia fórmula. Si dudas entre dos emolientes o necesitas sustituir una referencia, escríbenos por WhatsApp: te responde un asesor que entiende de fórmulas, no un guion de ventas."
    ],
    "retos": [
      {
        "titulo": "Estabilidad que sobreviva al estante",
        "texto": "La emulsión perfecta en laboratorio puede fallar a los tres meses en clima cálido. Te ayudamos a elegir emulsificantes, espesantes y antioxidantes compatibles con tu sistema, y compartimos la ficha técnica del lote real desde la cotización para que valides antes de escalar."
      },
      {
        "titulo": "Lo natural, sin sorpresas en fórmula",
        "texto": "El consumidor pide origen natural, pero un extracto mal elegido cambia color, olor y conservación. Con 20 extractos botánicos y 9 aceites vegetales en catálogo, te orientamos sobre compatibilidad y niveles de uso, con la documentación del fabricante como única fuente de verdad."
      },
      {
        "titulo": "Cuando el importador descontinúa tu emoliente",
        "texto": "Pocas cosas frenan tanto una producción como un ingrediente que ya nadie trae. Buscamos equivalentes funcionales entre nuestros fabricantes, te enviamos muestra con su documentación y comparas contra tu estándar antes de comprometer una compra."
      }
    ],
    "especialidadesClave": [
      "extractos-botanicos",
      "emolientes",
      "espesantes-reologia",
      "humectantes",
      "activos",
      "tensoactivos"
    ],
    "regulatorio": "Todo cosmético que se comercializa en Colombia necesita Notificación Sanitaria Obligatoria ante el INVIMA, bajo las Decisiones 516 y 833 de la CAN. No gestionamos el trámite por ti, pero te entregamos los soportes de cada materia prima — composición, documentación del fabricante, restricciones de uso — para que armes tu expediente con criterio.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Estoy formulando en cosmética y cuidado personal y quiero cotizar materias primas. Mi empresa es:"
  },
  {
    "slug": "maquillaje-color",
    "titulo": "El color exacto no se improvisa",
    "intro": [
      "El maquillaje es la categoría menos indulgente de la cosmética: el cliente nota un tono que cambió entre compras, una sombra que no fija o un labial que migra. Reproducir color exige pigmentos bien caracterizados, dispersiones cuidadas y una reología que se mantenga del piloto a la línea — algo difícil cuando cada lote de pigmento puede variar y las marcas independientes de la región compiten contra multinacionales con laboratorios propios.",
      "Nuestro catálogo de maquillaje reúne 35 referencias: pigmentos y colorantes, nacarantes y efectos, alternativas a siliconas, emolientes y ceras que aportan cuerpo y deslizamiento. Cada lote viaja con su certificado de análisis, para que tu control de calidad libere el color contra datos y no contra memoria. Pide muestras para ajustar el tono en tu propia base, y usa el WhatsApp para lo que el catálogo no responde: compatibilidades, rangos de dosificación o esa referencia difícil que llevas semanas buscando."
    ],
    "retos": [
      {
        "titulo": "Reproducir el tono, lote tras lote",
        "texto": "Los pigmentos varían entre lotes y esa variación se ve en el producto terminado. Entregamos certificado de análisis de cada lote despachado y te recomendamos evaluar una muestra contra tu patrón de color antes de cada compra grande."
      },
      {
        "titulo": "Sensorialidad sin depender de siliconas",
        "texto": "El mercado pide fórmulas con menos siliconas, pero el consumidor no perdona perder el deslizamiento. Tenemos 6 alternativas a siliconas y 9 emolientes para reconstruir esa sensación, con muestras y documentación para que compares contra tu fórmula actual."
      },
      {
        "titulo": "El colorante correcto para cada zona",
        "texto": "No todo colorante sirve para labios o para el área de los ojos: la normativa andina restringe su uso por zona de aplicación. Te compartimos la documentación del fabricante de cada pigmento para que verifiques su estatus regulatorio antes de formular, no después."
      }
    ],
    "especialidadesClave": [
      "pigmentos-colorantes",
      "nacarantes-efectos",
      "siliconas-alternativas",
      "emolientes",
      "espesantes-reologia",
      "mantecas-ceras"
    ],
    "regulatorio": "El maquillaje es cosmético ante el INVIMA y requiere Notificación Sanitaria Obligatoria; además, sus colorantes deben ajustarse a los listados permitidos de la normativa andina (Decisión 833). Te orientamos con la documentación de cada pigmento para verificar su estatus, aunque el trámite siga siendo responsabilidad de tu empresa.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar pigmentos y materias primas para maquillaje. Mi empresa es:"
  },
  {
    "slug": "aseo-hogar",
    "titulo": "El costo por litro se decide en la fórmula",
    "intro": [
      "En aseo del hogar la batalla se libra en centavos: categorías de alta rotación, consumidores que comparan precio por litro y cadenas que exigen márgenes. El formulador vive optimizando materia activa sin perder desempeño percibido — la espuma, el aroma, el brillo que el usuario asocia con limpieza — mientras los precios de los tensoactivos suben y bajan con el mercado internacional y el agua dura de muchas regiones del país complica cualquier fórmula.",
      "Nuestro portafolio de 53 materias primas para aseo cubre la fórmula completa: tensoactivos, desengrasantes, biocidas y desinfectantes, acidulantes, quelantes para el agua dura y espesantes que ajustan la viscosidad del producto final. Cotizamos rápido por WhatsApp — una línea de envasado detenida no espera — y cada entrega llega con la documentación completa del lote: ficha técnica, FDS y certificado de análisis. Si estás reformulando para bajar costo, pide muestras de las alternativas, consulta a tu asesor y decide con datos de tu propio laboratorio."
    ],
    "retos": [
      {
        "titulo": "Bajar costo sin perder desempeño",
        "texto": "Reformular para reducir el costo por litro es el pan de cada día de la categoría. Con 15 tensoactivos y 11 desengrasantes en catálogo, te presentamos alternativas con su ficha técnica y muestras, para que el recorte se valide en laboratorio y no en los reclamos."
      },
      {
        "titulo": "Agua dura, fórmula estable",
        "texto": "El agua de muchas plantas y hogares colombianos carga calcio y magnesio que desactivan tensoactivos y opacan el resultado. Nuestros quelantes y acidulantes ayudan a proteger la fórmula, y la dosis de trabajo se confirma siempre contra la ficha técnica de cada fabricante."
      },
      {
        "titulo": "Desinfección que se pueda sustentar",
        "texto": "Decir \"desinfecta\" o \"elimina el 99,9 %\" exige soportes que empiezan en la materia prima. Nuestros 8 biocidas y desinfectantes llegan con la documentación del fabricante — concentraciones de uso, espectro declarado — para que tu equipo construya el sustento de sus propios claims."
      }
    ],
    "especialidadesClave": [
      "tensoactivos",
      "desengrasantes",
      "biocidas-desinfectantes",
      "quelantes",
      "acidulantes-ph",
      "espesantes-reologia"
    ],
    "regulatorio": "Los productos de higiene doméstica se notifican ante el INVIMA bajo la Decisión 706 de la CAN, y los desinfectantes con acción biocida tienen exigencias adicionales. Nuestro papel es orientarte y entregarte los soportes documentales de cada insumo — no tramitamos registros ni prometemos aprobaciones.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para productos de aseo del hogar. Mi empresa es:"
  },
  {
    "slug": "institucional-industrial",
    "titulo": "La limpieza profesional se formula, no se improvisa",
    "intro": [
      "Quien formula aseo profesional en Colombia pelea a diario la misma batalla: el costo por litro diluido contra lo que el cliente percibe al limpiar. A eso se suman aguas duras que castigan la fórmula, materias primas que cambian de disponibilidad de un trimestre a otro y compradores institucionales — hospitales, plantas de alimentos, operadores de aseo — que exigen soporte documental de cada insumo. En este negocio el margen se defiende en la fórmula, no en la lista de precios.",
      "Para ese oficio armamos un portafolio de 70 materias primas: tensoactivos, desengrasantes, biocidas, quelantes, espesantes y reguladores de pH, del multiusos económico a la línea de grado institucional. Cada despacho sale con la ficha técnica, la FDS y el certificado de análisis del lote, y antes de comprometer una compra puedes evaluar muestras en tu propio laboratorio. Al otro lado del WhatsApp responde un asesor que entiende de química de limpieza — no un call center."
    ],
    "retos": [
      {
        "titulo": "Costo en uso bajo control",
        "texto": "El aseo institucional se compra por costo en uso, no por precio de lista. Nuestros tensoactivos y espesantes te dan opciones para concentrar fórmula, y las muestras permiten validar cada ajuste antes de escalarlo a producción."
      },
      {
        "titulo": "Referencias que salen del mercado",
        "texto": "Un tensoactivo descontinuado puede frenar una línea entera. Te ayudamos a evaluar sustitutos con criterio: ficha del fabricante, muestra para tu laboratorio y comparación honesta de especificaciones, sin prometer equivalencias que el lote no respalde."
      },
      {
        "titulo": "Auditorías que piden papeles",
        "texto": "Tus clientes institucionales auditan lo que compras. Cada lote despachado viaja con su FDS bajo el SGA, en español, y su certificado de análisis, para que la trazabilidad resista la visita del auditor sin correos de última hora."
      }
    ],
    "especialidadesClave": [
      "tensoactivos",
      "desengrasantes",
      "biocidas-desinfectantes",
      "espesantes-reologia",
      "quelantes",
      "acidulantes-ph"
    ],
    "regulatorio": "Los productos de aseo e higiene de uso doméstico y los desinfectantes requieren notificación o registro sanitario ante el INVIMA, y sus insumos deben manejarse con FDS bajo el SGA (Decreto 1496 de 2018). Te entregamos los soportes de cada materia prima y te orientamos para armar el expediente — el trámite es tuyo, pero no lo enfrentas a ciegas.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para aseo institucional e industrial: cuéntenme disponibilidad y documentación."
  },
  {
    "slug": "alimentos",
    "titulo": "Del laboratorio a la góndola, ingredientes con trazabilidad",
    "intro": [
      "Formular alimentos en Colombia se volvió un ejercicio de equilibrio: los sellos frontales empujan a reducir azúcar y sodio, el consumidor pide etiquetas más limpias y el costo de los hidrocoloides importados no da tregua. Cada reformulación pone en juego textura, vida útil y proceso, y todo debe sostenerse ante el INVIMA con la documentación del ingrediente. El reto ya no es conseguir aditivos: es dar con el que funciona en tu matriz, con los soportes completos.",
      "Nuestro portafolio para esta industria reúne 63 materias primas: gomas e hidrocoloides, espesantes, conservantes, antioxidantes, edulcorantes, acidulantes, proteínas y extractos botánicos. Pides la muestra, la ensayas en tu propia matriz y solo entonces hablamos de volúmenes; la documentación de cada lote — ficha técnica, FDS y certificado de análisis — viaja con el pedido. Las presentaciones que publicamos son referenciales y se confirman según fabricante y lote, y la cotización va por WhatsApp con un asesor que conoce el portafolio."
    ],
    "retos": [
      {
        "titulo": "Reformular bajo sellos frontales",
        "texto": "Bajar azúcar y sodio sin perder cuerpo exige combinar edulcorantes con gomas y espesantes que devuelvan la textura. Te damos alternativas documentadas y muestras para ensayar en tu matriz, porque cada sistema alimentario se comporta distinto."
      },
      {
        "titulo": "Textura estable, lote tras lote",
        "texto": "Los hidrocoloides son sensibles al origen y al proceso de cada fabricante. Confirmamos la ficha técnica del lote antes de la venta y te avisamos si una especificación cambia, para que tu producción no se entere por sorpresa."
      },
      {
        "titulo": "Etiqueta limpia con criterio",
        "texto": "El consumidor pide ingredientes reconocibles, pero lo natural también tiene que ser estable y viable en costos. Nuestros extractos botánicos llegan con la documentación del fabricante, para que evalúes la tendencia con datos y no con entusiasmo."
      }
    ],
    "especialidadesClave": [
      "gomas-hidrocoloides",
      "espesantes-reologia",
      "conservantes",
      "antioxidantes",
      "edulcorantes",
      "extractos-botanicos"
    ],
    "regulatorio": "Los alimentos procesados requieren registro, permiso o notificación sanitaria ante el INVIMA según su nivel de riesgo, y el etiquetado frontal se rige por la Resolución 810 de 2021 y sus modificaciones. Te orientamos con los soportes documentales de cada ingrediente para que armes tu expediente con criterio; el trámite sigue siendo tuyo.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Formulo en el sector de alimentos y quiero cotizar ingredientes con documentación por lote."
  },
  {
    "slug": "bebidas",
    "titulo": "Lo difícil no es el sabor, es la estabilidad",
    "intro": [
      "Una bebida perdona poco: la pulpa que se asienta, el color que se apaga en el anaquel, el regusto que aparece cuando bajaste el azúcar por los sellos frontales. Quien formula bebidas en Colombia trabaja con sistemas de pH bajo, procesos térmicos exigentes y un clima que pone a prueba cualquier estabilidad. Y el auge de las bebidas botánicas y funcionales subió la vara: ahora el ingrediente también tiene que contar una historia, con soportes que la respalden.",
      "Para ese trabajo reunimos 31 materias primas seleccionadas: gomas e hidrocoloides para dar cuerpo y suspensión, acidulantes, edulcorantes, colorantes, conservantes y extractos botánicos. El primer paso es siempre una muestra ensayada en tu propia bebida, no una promesa de catálogo. Después, cada lote llega con su ficha técnica, la FDS en español y el certificado de análisis, en presentaciones que confirmamos según fabricante y lote. Tu asesor por WhatsApp acompaña el proceso completo, de la cotización al despacho."
    ],
    "retos": [
      {
        "titulo": "Suspensión que aguanta el anaquel",
        "texto": "Mantener pulpa o sólidos suspendidos durante toda la vida útil es un problema de reología, no de suerte. Nuestras gomas e hidrocoloides incluyen la ficha del fabricante y muestras para ajustar la dosis en tu proceso real."
      },
      {
        "titulo": "Sensación en boca sin azúcar",
        "texto": "Quitar azúcar deja la bebida delgada y con regusto. La combinación de edulcorantes con espesantes adecuados ayuda a recuperar cuerpo, y cada alternativa viene documentada para que tu equipo decida sobre resultados de banco, no sobre folletos."
      },
      {
        "titulo": "Color firme bajo el trópico",
        "texto": "Luz, calor y pH ácido castigan a los colorantes, sobre todo a los naturales. Te ayudamos a comparar opciones con las especificaciones del fabricante en la mano y a validar con muestra antes de comprometer una corrida de producción."
      }
    ],
    "especialidadesClave": [
      "gomas-hidrocoloides",
      "espesantes-reologia",
      "acidulantes-ph",
      "edulcorantes",
      "pigmentos-colorantes",
      "extractos-botanicos"
    ],
    "regulatorio": "Las bebidas se registran ante el INVIMA según su categoría y nivel de riesgo, y también les aplica el rotulado frontal de advertencia. Te ayudamos a reunir la documentación de soporte de cada ingrediente — composición, certificados del fabricante, usos permitidos — y el registro lo gestionas tú, con la carpeta completa.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Estoy desarrollando bebidas y quiero cotizar gomas, acidulantes o colorantes con muestra previa."
  },
  {
    "slug": "nutraceutico",
    "titulo": "Ingredientes que respaldan lo que tu etiqueta declara",
    "intro": [
      "El mercado nutracéutico en Colombia y la región crece más rápido que la confianza del consumidor, y esa brecha se cierra con evidencia documental: quien formula un suplemento dietario sabe que cada vitamina, cada aminoácido y cada extracto debe llegar con su potencia verificable, porque la etiqueta se convierte en una promesa ante el INVIMA y ante el cliente final. A eso se suman activos sensibles al calor y la humedad, matrices difíciles —gomitas, polvos instantáneos, bebidas— y consumidores que leen la lista de ingredientes con lupa.",
      "Nuestro portafolio nutracéutico reúne 30 referencias: vitaminas, proteínas y aminoácidos, antioxidantes, edulcorantes y gomas para dar cuerpo y estabilidad. Cada despacho sale con el certificado de análisis de su lote, y antes de comprometer una compra puedes evaluar muestras de laboratorio en tu propia fórmula. Si tienes dudas de grado, solubilidad o compatibilidad, las resolvemos por WhatsApp con un asesor que conoce el portafolio — las presentaciones son referenciales y se confirman según fabricante y lote."
    ],
    "retos": [
      {
        "titulo": "Potencia declarada, potencia entregada",
        "texto": "Las vitaminas pierden actividad con el tiempo, el calor y la humedad. Por eso entregamos el certificado de análisis del lote real —no valores típicos de catálogo— junto con la fecha de fabricación y las condiciones de almacenamiento, para que tu control de calidad libere con datos."
      },
      {
        "titulo": "Sabor sin traicionar la fórmula",
        "texto": "Proteínas y extractos botánicos suelen traer notas amargas o terrosas que el consumidor no perdona. Combinamos edulcorantes y gomas que ayudan a construir perfil y textura, y despachamos muestras para que ajustes el sensorial en tu propia matriz antes de escalar."
      },
      {
        "titulo": "Expediente sólido ante el INVIMA",
        "texto": "Un suplemento dietario se registra con soportes de cada ingrediente. Te ayudamos a reunir la documentación del fabricante —composición, certificados, especificaciones— para que armar tu expediente no frene el lanzamiento. El trámite es tuyo; los soportes y el criterio los ponemos nosotros."
      }
    ],
    "especialidadesClave": [
      "vitaminas",
      "proteinas-aminoacidos",
      "antioxidantes",
      "edulcorantes",
      "gomas-hidrocoloides",
      "extractos-botanicos"
    ],
    "regulatorio": "Los suplementos dietarios y los alimentos requieren registro o notificación sanitaria ante el INVIMA según su categoría. Te orientamos sobre los soportes que cada materia prima aporta a tu expediente; el trámite ante la autoridad lo adelanta tu empresa.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para mi línea nutracéutica (suplementos dietarios)."
  },
  {
    "slug": "veterinaria",
    "titulo": "Del premix al concentrado, sin eslabones sueltos",
    "intro": [
      "En producción animal el alimento es el rubro que decide la rentabilidad, y quien formula concentrados o premezclas lo sabe: un micronutriente mal dosificado o una vitamina degradada no se ven en la báscula del despacho, se ven semanas después en el galpón o en el estanque. A esa presión técnica se suman la volatilidad de los importados, los tiempos del registro ante el ICA y clientes pecuarios que piden resultados consistentes, ciclo tras ciclo.",
      "Nuestra línea de nutrición animal reúne 50 referencias entre premezclas veterinarias, vitaminas, aminoácidos, acidulantes, conservantes y enzimas, pensadas para plantas de alimento balanceado, laboratorios veterinarios y núcleos de producción. Trabajamos con certificado de análisis por lote y fecha de fabricación a la vista, enviamos muestras para tus pruebas de mezclado y un asesor técnico te acompaña por WhatsApp desde la cotización hasta el reabastecimiento. Las presentaciones publicadas son referenciales: siempre confirmamos contra la ficha del lote disponible."
    ],
    "retos": [
      {
        "titulo": "Vitaminas estables dentro de la premezcla",
        "texto": "Minerales traza, humedad y tiempo de bodega degradan las vitaminas en premezcla. Entregamos certificado de análisis y fecha de fabricación de cada lote, y te recomendamos presentaciones acordes con tu rotación real para que no pagues potencia que se pierde en el estante."
      },
      {
        "titulo": "Producir con menos antibióticos",
        "texto": "La industria pecuaria migra hacia esquemas con menor uso de antibióticos, y eso pone a acidulantes, enzimas y conservantes en el centro de la formulación. Te despachamos muestras con su documentación para que tu equipo técnico las evalúe en sus propias dietas y condiciones."
      },
      {
        "titulo": "Suministro que no frena la planta",
        "texto": "Una planta de balanceados no puede parar porque un importado se retrasó. Manejamos referencias equivalentes de distintos fabricantes y te presentamos la ficha técnica de cada alternativa, para que tu área de calidad decida la sustitución con datos y no contra el reloj."
      }
    ],
    "especialidadesClave": [
      "premezclas-veterinarias",
      "vitaminas",
      "proteinas-aminoacidos",
      "acidulantes-ph",
      "conservantes",
      "enzimas"
    ],
    "regulatorio": "Los alimentos para animales, aditivos y demás insumos pecuarios se registran ante el ICA. Te ayudamos a entender qué documentación de soporte del fabricante necesita tu expediente; el registro como tal lo tramita tu empresa.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para nutrición animal y mi línea veterinaria."
  },
  {
    "slug": "agricola",
    "titulo": "Nutrición vegetal documentada, del laboratorio al lote",
    "intro": [
      "Formular para el agro colombiano es formular para muchos países a la vez: suelos ácidos en el altiplano, aguas duras en los valles, cultivos que van del café tecnificado a la flor de exportación. Un fertilizante foliar que funciona en una zona se precipita en el tanque de otra, y el productor no distingue entre un mal insumo y una mala mezcla — simplemente no vuelve a comprar. Súmale registros ICA que toman su tiempo y materias primas importadas con precios que cambian entre cotización y cotización.",
      "Para ese terreno armamos 33 referencias: una base fuerte de nutrición vegetal —19 productos— más quelantes, adyuvantes, acidulantes y tensoactivos para completar la fórmula. Antes de que compres un kilo puedes revisar la ficha técnica del lote y pedir muestras para tus ensayos de compatibilidad y de campo. Y cuando el cultivo no da espera, la cotización tampoco: escríbenos por WhatsApp y un asesor que habla tu idioma técnico te responde en horario hábil."
    ],
    "retos": [
      {
        "titulo": "Micronutrientes disponibles, no precipitados",
        "texto": "El pH del suelo y del agua decide si un micronutriente llega a la planta o se queda en el fondo del tanque. Nuestros quelantes y acidulantes te dan herramientas para formular mezclas estables, y la ficha técnica de cada lote te dice exactamente con qué estás trabajando."
      },
      {
        "titulo": "Cada gota debe llegar al objetivo",
        "texto": "Un agroquímico bien formulado se pierde si la gota rebota, escurre o se evapora. Con adyuvantes y tensoactivos ajustas humectación, adherencia y penetración de tus mezclas; te enviamos muestras con documentación para que las valides en tus propios bioensayos."
      },
      {
        "titulo": "Registro ICA sin dolores de cabeza",
        "texto": "Registrar un fertilizante o un acondicionador exige soportes precisos de cada materia prima: composición, origen, especificaciones del fabricante. Reunimos esa documentación contigo desde la primera compra, para que el papeleo acompañe al producto en lugar de perseguirlo."
      }
    ],
    "especialidadesClave": [
      "nutricion-vegetal",
      "adyuvantes-agricolas",
      "quelantes",
      "acidulantes-ph",
      "tensoactivos"
    ],
    "regulatorio": "Los fertilizantes, acondicionadores de suelo y demás insumos agrícolas requieren registro ante el ICA. No adelantamos trámites en tu nombre, pero te orientamos sobre los soportes del fabricante que tu expediente va a necesitar.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para el sector agrícola (nutrición vegetal y adyuvantes)."
  },
  {
    "slug": "pinturas-recubrimientos",
    "titulo": "Del pigmento al brillo final, sin sorpresas de lote",
    "intro": [
      "Quien formula pinturas en Colombia lo sabe: el color no perdona. Un pigmento que cambia de proveedor, un solvente que llega con otra pureza o un dispersante descontinuado obligan a reformular contra el reloj, mientras el cliente espera el mismo tono y el mismo secado de siempre. Y todo con una tasa de cambio que mueve el costo de los importados de un trimestre a otro. Formular bien no basta: hay que poder repetirlo.",
      "Para ese oficio armamos un portafolio de 21 materias primas: solventes, pigmentos y colorantes, dispersantes y antiespumantes, modificadores de reología y nacarantes para acabados con efecto. Cada despacho sale con ficha técnica, FDS y certificado de análisis del lote, y antes de comprometer una compra puedes evaluar muestras en tu propia fórmula. Un asesor que conoce la línea te responde por WhatsApp: cotización, disponibilidad y la referencia difícil cuando aparece."
    ],
    "retos": [
      {
        "titulo": "Consistencia de color entre lotes",
        "texto": "Un mismo índice de color puede comportarse distinto según el fabricante y el lote. Por eso trabajamos con presentaciones y especificaciones referenciales, confirmamos la ficha técnica del lote antes de vender y despachamos con certificado de análisis para que tu control de calidad libere contra datos reales."
      },
      {
        "titulo": "Sustitución de referencias descontinuadas",
        "texto": "Cuando un aditivo sale del mercado, la reformulación corre por tu cuenta, pero la búsqueda no tiene que hacerlo. Proponemos equivalentes funcionales de nuestro portafolio, enviamos muestras con su documentación técnica y te acompañamos en la validación antes de escalar el cambio a producción."
      },
      {
        "titulo": "Solventes con papeles en regla",
        "texto": "Varios solventes de uso común en pinturas están vigilados por el régimen colombiano de sustancias controladas. Entregamos la FDS bajo SGA en español con cada despacho y te orientamos sobre los soportes que tu propia operación puede necesitar para almacenarlos y transportarlos sin sobresaltos."
      }
    ],
    "especialidadesClave": [
      "solventes",
      "pigmentos-colorantes",
      "dispersantes-antiespumantes",
      "espesantes-reologia",
      "polimeros",
      "nacarantes-efectos"
    ],
    "regulatorio": "Los insumos de esta línea se manejan bajo el SGA (Decreto 1496 de 2018), con FDS en español en cada despacho. Si empleas solventes clasificados como sustancias controladas, te orientamos sobre el CCITE que tu operación puede requerir ante MinJusticia — el trámite es tuyo, nosotros aportamos los soportes y el criterio.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar materias primas para pinturas y recubrimientos. Mi empresa es:"
  },
  {
    "slug": "textil",
    "titulo": "Química auxiliar que respeta la fibra y el proceso",
    "intro": [
      "La industria textil colombiana compite contra el mundo con procesos húmedos que no admiten improvisación: un descrude a medias mancha el teñido, un baño mal desengrasado se nota metros después y cada reproceso cuesta agua, energía y turnos de máquina. A eso se suman auxiliares que cambian de proveedor sin aviso y la presión creciente por procesos más limpios. En la planta, la diferencia entre una partida aprobada y una rechazada suele empezar en la química auxiliar.",
      "Nuestro portafolio textil reúne 17 materias primas para el proceso húmedo: tensoactivos y desengrasantes para preparación, enzimas y quelantes para baños más estables, biocidas para conservación, y acondicionadores y siliconas para el acabado. Todo llega con ficha técnica, FDS y certificado de análisis del lote, y puedes pedir muestras para correr tus propias pruebas de proceso antes de comprar. La cotización, la disponibilidad y el seguimiento van por WhatsApp, con un asesor que habla el idioma de la tintorería."
    ],
    "retos": [
      {
        "titulo": "Preparación pareja, teñido predecible",
        "texto": "Los aceites de tejeduría y las gomas que no salen en la preparación reaparecen como defectos en el teñido. Nuestros tensoactivos y desengrasantes llegan con especificaciones documentadas por lote, y puedes evaluarlos en muestras sobre tu propio sustrato antes de cambiar la receta del baño."
      },
      {
        "titulo": "Agua dura, baños que fallan",
        "texto": "El hierro y la dureza del agua desestabilizan blanqueos y tiñen desparejo. Un quelante bien elegido protege el baño, y nosotros te ayudamos a elegirlo: ficha técnica desde la cotización, muestra para tu prueba de laboratorio y el mismo material, documentado, en cada reposición."
      },
      {
        "titulo": "Presentaciones a escala de planta",
        "texto": "No toda tintorería consume tambores completos. Manejamos presentaciones referenciales según fabricante y lote, y buscamos el empaque que se ajuste a tu consumo real — del ensayo de laboratorio a la producción — para que el inventario no se convierta en capital quieto ni en producto vencido."
      }
    ],
    "especialidadesClave": [
      "tensoactivos",
      "desengrasantes",
      "quelantes",
      "enzimas",
      "acondicionadores",
      "siliconas-alternativas"
    ],
    "regulatorio": "Los procesos húmedos textiles responden por sus vertimientos ante la Resolución 631 de 2015, y todo insumo industrial se maneja bajo el SGA (Decreto 1496 de 2018). Te entregamos las FDS en español y los soportes del fabricante para que tu área ambiental y de seguridad trabajen con información completa — los permisos y caracterizaciones siguen siendo terreno de tu operación.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar auxiliares químicos para mi proceso textil. Mi empresa es:"
  },
  {
    "slug": "tratamiento-aguas",
    "titulo": "El agua que cumple empieza en la dosificación correcta",
    "intro": [
      "Operar una planta de tratamiento no acepta pausas: el agua entra todos los días, cambie o no la calidad del afluente, llueva o haga verano. Quedarse sin coagulante, sin regulador de pH o sin biocida no es un contratiempo comercial — es un parámetro fuera de norma, un vertimiento comprometido o una torre de enfriamiento en riesgo. Y en Colombia la exigencia sobre cada metro cúbico tratado solo va en una dirección: hacia arriba.",
      "Nuestra línea para plantas de tratamiento reúne 27 materias primas: acidulantes y reguladores de pH, polímeros para floculación, quelantes y dispersantes para sistemas de enfriamiento y calderas, biocidas para control microbiológico y desengrasantes para mantenimiento. Cada lote viaja con ficha técnica, FDS y certificado de análisis, hay muestras para tus ensayos de jarras y un asesor por WhatsApp que entiende de dosificación — y de la urgencia de una planta que no puede parar."
    ],
    "retos": [
      {
        "titulo": "Suministro que no puede fallar",
        "texto": "Una PTAR sin insumos incumple al día siguiente. Trabajamos con cotización ágil por WhatsApp, despachos a las principales ciudades del país y entregas programadas para plantas con consumo recurrente, de modo que la reposición llegue antes de que el tanque de químicos lo pida a gritos."
      },
      {
        "titulo": "Dosificar contra datos reales",
        "texto": "La dosis óptima depende de la concentración real del lote, no del valor típico del catálogo. Por eso cada despacho incluye su certificado de análisis y puedes pedir muestras para ajustar el ensayo de jarras antes de comprometer el consumo del mes."
      },
      {
        "titulo": "Afluentes que cambian de humor",
        "texto": "Un aguacero, un cambio de proceso aguas arriba o una temporada seca alteran el afluente y desacomodan la química. Nuestro portafolio cubre varias rutas de tratamiento — coagulación, ajuste de pH, control microbiológico — y el asesor te ayuda a contrastar alternativas con sus fichas técnicas en mano."
      }
    ],
    "especialidadesClave": [
      "acidulantes-ph",
      "quelantes",
      "polimeros",
      "biocidas-desinfectantes",
      "dispersantes-antiespumantes",
      "desengrasantes"
    ],
    "regulatorio": "Los vertimientos puntuales a cuerpos de agua y alcantarillado se miden contra la Resolución 631 de 2015, y el agua para consumo humano responde a la Resolución 2115 de 2007. Te orientamos con las FDS y los soportes del fabricante de cada insumo para que sustentes tu operación ante la autoridad ambiental — las caracterizaciones y los permisos siguen siendo responsabilidad de tu planta.",
    "mensajeWhatsApp": "Hola, Q'mical 👋 Quiero cotizar insumos para tratamiento de aguas. Mi empresa es:"
  }
];
