import type { EndingDef } from './types.js'

// ══════════════════════════════════════════════════════
// DESENLACES — 13 finales posibles
// Selección: dest (destino elegido en e_encrucijada)
//   + cond(m, alliances, stats) — moral, supervivientes, alianzas
// Orden de evaluación (épico → triunfal → resistencia → sombrío → dispersión)
// Fallback universal: 'tragico'
// ══════════════════════════════════════════════════════

export const ENDINGS_DEF: Record<string, EndingDef> = {

  // ── AMAZONAS (4 variantes) ────────────────────────────────────

  amazonas_excelente: {
    glyph: '🌿',
    badge: 'FINAL ÉPICO · AMAZONAS',
    title: 'Los Hijos del Río Grande',
    dest:  'amazonas',
    cond:  (m, a, s) => m >= 30 && a.length >= 4 && (s?.moral ?? 0) >= 60,
    narr:  `Generaciones después, los ancianos contarán que vinieron del fuego y encontraron el agua. Su pueblo mezcló palabras de seis lenguas distintas. Aprendieron a leer el río como otros leen el cielo. Los españoles nunca supieron que existían.<br><br>
El chamán que sobrevivió la huida fundó una escuela de memoria: cada niño aprende las historias del norte antes de aprender a nadar. La lengua original vive mezclada con la nueva — un idioma híbrido que ningún conquistador podría entender.<br><br>
En el corazón de la selva, un pueblo encontró la manera de seguir siendo pueblo. Y de enseñar a sus hijos que vinieron del fuego y no lo olvidaron.`,
    refl:  'La Amazonía albergó a cientos de culturas que los europeos nunca conocieron. Muchas subsistieron en aislamiento voluntario durante siglos. ¿Qué significa preservar una cultura cuando el mundo exterior la ignora por completo?',
  },

  amazonas_bueno: {
    glyph: '🌿',
    badge: 'AMAZONAS · RESISTENCIA',
    title: 'Raíces en el Agua Verde',
    dest:  'amazonas',
    cond:  (m, a) => m >= 20 && a.length >= 2,
    narr:  `Un asentamiento pequeño pero real, en un meandro del río que pocos conocen. Algunos jóvenes aprendieron las lenguas del río. Las tradiciones se mezclan con las del pueblo que los acogió. Pero el nombre propio sobrevivió.<br><br>
Los niños nacidos en el Amazonas ya no recuerdan Guatemala — solo conocen las historias que sus padres les cuentan por las noches, junto al río que nunca para. El río se volvió su nueva memoria.`,
    refl:  'La integración cultural no es siempre pérdida: puede ser también transformación. ¿Cuándo una cultura "cambia" y cuándo "desaparece"?',
  },

  amazonas_sombrío: {
    glyph: '🌧️',
    badge: 'AMAZONAS · DESGARRO',
    title: 'El Río que Apaga los Nombres',
    dest:  'amazonas',
    cond:  (m, _a, s) => m >= 15 && (s?.moral ?? 100) < 35,
    narr:  `Llegaron al Amazonas con los cuerpos pero sin el alma. El viaje los rompió de adentro: demasiadas pérdidas, demasiadas decisiones imposibles, demasiados que quedaron en el camino sin recibir ni siquiera un nombre para su lugar de muerte.<br><br>
Se instalaron junto al río. Sobrevivieron. Pero la tribu que salió unida de Guatemala llegó aquí en silencio — el silencio de los que perdieron demasiado para hablar de ello. Los chamanes dicen que las almas de los caídos todavía buscan el camino de vuelta al norte.`,
    refl:  'La trauma colectiva puede sobrevivir generaciones. ¿Cómo se reconstruye la identidad de un pueblo después de una pérdida masiva?',
  },

  amazonas_amargo: {
    glyph: '🌧️',
    badge: 'AMAZONAS · DISPERSIÓN',
    title: 'El Pueblo sin Nombre de Río',
    dest:  'amazonas',
    cond:  (_m, _a) => true,
    narr:  `Se instalaron cerca del río, pero nunca juntos del todo. Los más jóvenes adoptaron la lengua local en una generación. Las historias del norte se volvieron canciones que nadie entiende del todo.<br><br>
En cincuenta años, los nietos no sabrán de dónde vino su abuelo. Solo sabrán que vino de lejos, de un fuego que él nunca terminó de describir.`,
    refl:  'La pérdida cultural rara vez es violenta: ocurre en silencio, generación por generación. ¿Qué se puede hacer para frenarla?',
  },

  // ── PATAGONIA ARGENTINA (4 variantes) ────────────────────────

  patagonia_arg_excelente: {
    glyph: '⭐',
    badge: 'FINAL ÉPICO · PATAGONIA ARG.',
    title: 'El Pueblo del Viento Libre',
    dest:  'patagonia_arg',
    cond:  (m, a, s) => m >= 30 && a.length >= 4 && (s?.moral ?? 0) >= 60,
    narr:  `El viento patagónico se convirtió en su hogar más que cualquier estructura. Aprendieron a leer el tiempo tres días por adelantado, a cazar el guanaco sin perderlo, a encontrar agua donde nadie buscaba.<br><br>
Los tehuelches los adoptaron como hermanos. Dos pueblos distintos se volvieron uno nuevo, con un nombre que ninguno tenía antes. El chamán mayor vivió hasta los noventa años — lo suficiente para ver nietos nacidos ya en la estepa, que nunca conocieron otra patria que el viento.<br><br>
Cuando los españoles enviaron expediciones al sur, encontraron tierra vacía. El pueblo era invisible porque se había vuelto parte del paisaje.`,
    refl:  'Las identidades culturales no son estáticas: se fusionan, se transforman, crean algo nuevo. Los pueblos patagónicos que sobrevivieron al siglo XVI lo hicieron adaptándose sin perder lo esencial. ¿Qué es lo esencial?',
  },

  patagonia_arg_bueno: {
    glyph: '🌾',
    badge: 'PATAGONIA ARG. · RESISTENCIA',
    title: 'La Aldea del Viento',
    dest:  'patagonia_arg',
    cond:  (m, a) => m >= 20 && a.length >= 1,
    narr:  `Un asentamiento en el borde de la laguna turquesa. El viento lo golpea todos los días. Pero también los protege: nadie que no sepa caminar en este viento puede llegar hasta ellos.<br><br>
Los tehuelches les enseñaron a cazar con boleadoras. A cambio, el grupo compartió sus técnicas de cultivo de las tierras altas — nada que funcionara en la estepa, pero sí en los valles protegidos del viento. La alianza fue práctica antes de ser espiritual.`,
    refl:  'La Patagonia fue el último refugio real de los pueblos indígenas del cono sur. Su aislamiento geográfico fue a la vez su desventaja y su salvación. ¿Qué rol juega el territorio en la supervivencia cultural?',
  },

  patagonia_arg_sombrío: {
    glyph: '🌧️',
    badge: 'PATAGONIA ARG. · DESGARRO',
    title: 'El Viento que Carga los Muertos',
    dest:  'patagonia_arg',
    cond:  (m, _a, s) => m >= 15 && (s?.moral ?? 100) < 35,
    narr:  `La estepa patagónica tiene una cualidad particular: amplifica. El silencio se hace más silencioso. La soledad se hace más sola. El grupo llegó aquí con los corazones tan erosionados como las piedras del camino.<br><br>
Sobrevivieron. El viento los golpeó y los endureció. Pero el precio fue alto: el chamán perdió la voz durante meses — no por enfermedad, sino porque no encontraba palabras para lo que habían vivido. Cuando la recuperó, habló solo de los que no llegaron.`,
    refl:  'La Conquista del Desierto (1879) eliminó a los últimos pueblos patagónicos libres. Pero durante 350 años antes, la Patagonia fue territorio inaccesible. ¿A qué precio se compra la libertad?',
  },

  patagonia_arg_amargo: {
    glyph: '🌧️',
    badge: 'PATAGONIA ARG. · DISPERSIÓN',
    title: 'El Viento se Lleva los Nombres',
    dest:  'patagonia_arg',
    cond:  (_m, _a) => true,
    narr:  `Se dispersaron por la estepa en grupos pequeños. Sobrevivieron, pero en silencio. El pueblo que salió unido de Guatemala llegó al sur dividido en familias que a veces ya no se reconocen.<br><br>
El viento patagónico borra las huellas. También borra los nombres, si nadie los repite.`,
    refl:  'La Conquista del Desierto (1879) eliminó a los últimos pueblos patagónicos libres. Pero durante 350 años antes de eso, la Patagonia fue un territorio inaccesible para el poder colonial.',
  },

  // ── PATAGONIA CHILENA (4 variantes) ──────────────────────────

  patagonia_chi_excelente: {
    glyph: '🌊',
    badge: 'FINAL ÉPICO · PATAGONIA CHL.',
    title: 'Los Hijos del Canal',
    dest:  'patagonia_chi',
    cond:  (m, a, s) => m >= 30 && a.length >= 4 && (s?.moral ?? 0) >= 60,
    narr:  `Aprendieron a navegar los canales como los kawésqar: de memoria, sin mapa, guiados por el color del agua y la forma de las nubes. Su pueblo se convirtió en pueblo del mar.<br><br>
Los bosques milenarios los cubrieron. El musgo creció sobre sus primeras construcciones de piedra. El tiempo aquí tiene otra velocidad — una que los conquistadores, siempre con prisa, nunca supieron habitar.<br><br>
El chamán mayor aprendió a leer el cielo de los canales. Antes de morir, enseñó ese saber a doce discípulos. Cada uno enseñó a doce más. La cadena no se cortó.`,
    refl:  'Los kawésqar sobrevivieron 6.000 años en uno de los entornos más inhóspitos del planeta. El conocimiento de su territorio era tan sofisticado que los navegantes europeos tardaron siglos en entender los canales que ellos recorrían de memoria.',
  },

  patagonia_chi_bueno: {
    glyph: '🌿',
    badge: 'PATAGONIA CHL. · RESISTENCIA',
    title: 'Entre el Bosque y el Mar',
    dest:  'patagonia_chi',
    cond:  (m, a) => m >= 20 && a.length >= 1,
    narr:  `Un asentamiento en la costa, donde el bosque llega hasta el agua. Aprendieron a cazar el lobo marino y a reconocer cuándo el canal se pone peligroso. No son kawésqar, pero tampoco son ya exactamente lo que eran.<br><br>
La primera generación nacida en los canales no tuvo miedo al agua. La segunda no recordó el miedo al caballo. La tercera ya no supo bien de dónde vinieron sus abuelos — solo que vinieron de lejos, huyendo de algo que nunca alcanzó.`,
    refl:  'La Patagonia chilena fue el último lugar del mundo en ser colonizado. Su geografía laberíntica protegió a sus pueblos por siglos. ¿Puede el territorio ser también una forma de resistencia?',
  },

  patagonia_chi_sombrío: {
    glyph: '🌧️',
    badge: 'PATAGONIA CHL. · DESGARRO',
    title: 'La Niebla que Devora los Nombres',
    dest:  'patagonia_chi',
    cond:  (m, _a, s) => m >= 15 && (s?.moral ?? 100) < 35,
    narr:  `Los canales de la Patagonia chilena no tienen fondo visible. El agua es negra, la lluvia constante, el viento cortante. Para un pueblo que llegó destrozado por meses de huida, este paisaje no fue refugio — fue espejo.<br><br>
Se asentaron en una cala protegida. Sobrevivieron. Pero el chamán que había guiado el viaje murió ese primer invierno — no de frío, sino de agotamiento del alma. El grupo lo enterró mirando al norte, hacia la tierra que nunca volvió a ver.`,
    refl:  'El aislamiento puede ser protección o trampa. Los pueblos de la Patagonia chilena vivieron en aislamiento durante milenios. Cuando llegó el contacto externo en el siglo XIX, la mayoría no sobrevivió a las enfermedades.',
  },

  patagonia_chi_amargo: {
    glyph: '🌧️',
    badge: 'PATAGONIA CHL. · DISPERSIÓN',
    title: 'La Niebla no Distingue Nombres',
    dest:  'patagonia_chi',
    cond:  (_m, _a) => true,
    narr:  `La niebla de los canales los separó. Algunos aprendieron a navegar. Otros se quedaron en tierra. El grupo que salió unido de Guatemala llegó al sur del mundo en silencio y en pedazos.<br><br>
En los canales, la niebla borra todo: las costas, los horizontes, los nombres. Sobrevivieron. Eso es suficiente, dicen. Pero los chamanes saben que no es suficiente.`,
    refl:  'El aislamiento puede ser protección o trampa. Los pueblos de la Patagonia chilena vivieron en aislamiento durante milenios. Cuando llegó el contacto externo en el siglo XIX, la mayoría no sobrevivió a las enfermedades.',
  },

  // ── FINAL TRÁGICO (universal, fallback) ──────────────────────

  tragico: {
    glyph: '💀',
    badge: 'FINAL TRÁGICO',
    title: 'El Silencio de los Árboles',
    dest:  'tragico',
    cond:  (_m, _a) => true,
    narr:  `Los españoles escribieron en sus crónicas: "Pueblo sometido." No anotaron nombres, ni historias, ni lo que se perdió.<br><br>La conquista de América fue también la conquista del olvido.`,
    refl:  'Entre 1492 y 1650, la población indígena americana cayó de 50-60 millones a 5-6 millones. La mayoría murió por enfermedades. Recordar estas historias es también una forma de resistencia.',
  },

}

// Orden de evaluación por destino (épico → bueno → sombrío → amargo)
export const ENDING_PRIORITY: Record<string, string[]> = {
  amazonas:      ['amazonas_excelente',      'amazonas_bueno',      'amazonas_sombrío',      'amazonas_amargo'],
  patagonia_arg: ['patagonia_arg_excelente', 'patagonia_arg_bueno', 'patagonia_arg_sombrío', 'patagonia_arg_amargo'],
  patagonia_chi: ['patagonia_chi_excelente', 'patagonia_chi_bueno', 'patagonia_chi_sombrío', 'patagonia_chi_amargo'],
}
