import type { EndingDef } from './types.js'

// ══════════════════════════════════════════════════════
// DESENLACES — 10 finales posibles
// Selección: dest (destino elegido en e_encrucijada)
//   + cond(supervivientes, alianzas) para épico/bueno/amargo
// Fallback universal: 'tragico'
// ══════════════════════════════════════════════════════

export const ENDINGS_DEF: Record<string, EndingDef> = {

  // ── AMAZONAS (3 variantes) ────────────────────────────────────

  amazonas_excelente: {
    glyph: '🌿',
    badge: 'FINAL ÉPICO · AMAZONAS',
    title: 'Los Hijos del Río Grande',
    dest:  'amazonas',
    cond:  (m, a) => m >= 30 && a.length >= 2,
    narr:  'Generaciones después, los ancianos contarán que vinieron del fuego y encontraron el agua. Su pueblo mezcló palabras de seis lenguas distintas. Aprendieron a leer el río como otros leen el cielo. Los españoles nunca supieron que existían.<br><br>En el corazón de la selva, un pueblo encontró la manera de seguir siendo pueblo.',
    refl:  'La Amazonía albergó a cientos de culturas que los europeos nunca conocieron. Muchas subsistieron en aislamiento voluntario durante siglos. ¿Qué significa preservar una cultura cuando el mundo exterior la ignora por completo?',
  },

  amazonas_bueno: {
    glyph: '🌿',
    badge: 'AMAZONAS · RESISTENCIA',
    title: 'Raíces en el Agua Verde',
    dest:  'amazonas',
    cond:  (m, _) => m >= 20,
    narr:  'Un asentamiento pequeño pero real, en un meandro del río que pocos conocen. Algunos jóvenes aprendieron las lenguas del río. Las tradiciones se mezclan con las del pueblo que los acogió. Pero el nombre propio sobrevivió.',
    refl:  'La integración cultural no es siempre pérdida: puede ser también transformación. ¿Cuándo una cultura "cambia" y cuándo "desaparece"?',
  },

  amazonas_amargo: {
    glyph: '🌧️',
    badge: 'AMAZONAS · DISPERSIÓN',
    title: 'El Pueblo sin Nombre de Río',
    dest:  'amazonas',
    cond:  (_m, _a) => true,
    narr:  'Se instalaron cerca del río, pero nunca juntos del todo. Los más jóvenes adoptaron la lengua local en una generación. Las historias del norte se volvieron canciones que nadie entiende del todo.',
    refl:  'La pérdida cultural rara vez es violenta: ocurre en silencio, generación por generación. ¿Qué se puede hacer para frenarla?',
  },

  // ── PATAGONIA ARGENTINA (3 variantes) ────────────────────────

  patagonia_arg_excelente: {
    glyph: '⭐',
    badge: 'FINAL ÉPICO · PATAGONIA ARG.',
    title: 'El Pueblo del Viento Libre',
    dest:  'patagonia_arg',
    cond:  (m, a) => m >= 30 && a.length >= 2,
    narr:  'El viento patagónico se convirtió en su hogar más que cualquier estructura. Aprendieron a leer el tiempo tres días por adelantado, a cazar el guanaco sin perderlo, a encontrar agua donde nadie buscaba.<br><br>Los tehuelches los adoptaron como hermanos. Dos pueblos distintos se volvieron uno nuevo, con un nombre que ninguno tenía antes.',
    refl:  'Las identidades culturales no son estáticas: se fusionan, se transforman, crean algo nuevo. Los pueblos patagónicos que sobrevivieron al siglo XVI lo hicieron adaptándose sin perder lo esencial. ¿Qué es lo esencial?',
  },

  patagonia_arg_bueno: {
    glyph: '🌾',
    badge: 'PATAGONIA ARG. · RESISTENCIA',
    title: 'La Aldea del Viento',
    dest:  'patagonia_arg',
    cond:  (m, _) => m >= 20,
    narr:  'Un asentamiento en el borde de la laguna turquesa. El viento lo golpea todos los días. Pero también los protege: nadie que no sepa caminar en este viento puede llegar hasta ellos.',
    refl:  'La Patagonia fue el último refugio real de los pueblos indígenas del cono sur. Su aislamiento geográfico fue a la vez su desventaja y su salvación. ¿Qué rol juega el territorio en la supervivencia cultural?',
  },

  patagonia_arg_amargo: {
    glyph: '🌧️',
    badge: 'PATAGONIA ARG. · DISPERSIÓN',
    title: 'El Viento se Lleva los Nombres',
    dest:  'patagonia_arg',
    cond:  (_m, _a) => true,
    narr:  'Se dispersaron por la estepa en grupos pequeños. Sobrevivieron, pero en silencio. El pueblo que salió unido de Guatemala llegó al sur dividido en familias que a veces ya no se reconocen.',
    refl:  'La Conquista del Desierto (1879) eliminó a los últimos pueblos patagónicos libres. Pero durante 350 años antes de eso, la Patagonia fue un territorio inaccesible para el poder colonial.',
  },

  // ── PATAGONIA CHILENA (3 variantes) ──────────────────────────

  patagonia_chi_excelente: {
    glyph: '🌊',
    badge: 'FINAL ÉPICO · PATAGONIA CHL.',
    title: 'Los Hijos del Canal',
    dest:  'patagonia_chi',
    cond:  (m, a) => m >= 30 && a.length >= 2,
    narr:  'Aprendieron a navegar los canales como los kawésqar: de memoria, sin mapa, guiados por el color del agua y la forma de las nubes. Su pueblo se convirtió en pueblo del mar.<br><br>Los bosques milenarios los cubrieron. El musgo creció sobre sus primeras construcciones de piedra. El tiempo aquí tiene otra velocidad.',
    refl:  'Los kawésqar sobrevivieron 6.000 años en uno de los entornos más inhóspitos del planeta. El conocimiento de su territorio era tan sofisticado que los navegantes europeos tardaron siglos en entender los canales que ellos recorrían de memoria.',
  },

  patagonia_chi_bueno: {
    glyph: '🌿',
    badge: 'PATAGONIA CHL. · RESISTENCIA',
    title: 'Entre el Bosque y el Mar',
    dest:  'patagonia_chi',
    cond:  (m, _) => m >= 20,
    narr:  'Un asentamiento en la costa, donde el bosque llega hasta el agua. Aprendieron a cazar el lobo marino y a reconocer cuándo el canal se pone peligroso. No son kawésqar, pero tampoco son ya exactamente lo que eran.',
    refl:  'La Patagonia chilena fue el último lugar del mundo en ser colonizado. Su geografía laberíntica protegió a sus pueblos por siglos. ¿Puede el territorio ser también una forma de resistencia?',
  },

  patagonia_chi_amargo: {
    glyph: '🌧️',
    badge: 'PATAGONIA CHL. · DISPERSIÓN',
    title: 'La Niebla no Distingue Nombres',
    dest:  'patagonia_chi',
    cond:  (_m, _a) => true,
    narr:  'La niebla de los canales los separó. Algunos aprendieron a navegar. Otros se quedaron en tierra. El grupo que salió unido de Guatemala llegó al sur del mundo en silencio y en pedazos.',
    refl:  'El aislamiento puede ser protección o trampa. Los pueblos de la Patagonia chilena vivieron en aislamiento durante milenios. Cuando llegó el contacto externo en el siglo XIX, la mayoría no sobrevivió a las enfermedades.',
  },

  // ── FINAL TRÁGICO (universal, fallback) ──────────────────────

  tragico: {
    glyph: '💀',
    badge: 'FINAL TRÁGICO',
    title: 'El Silencio de los Árboles',
    dest:  'tragico',
    cond:  (_m, _a) => true,
    narr:  'Los españoles escribieron en sus crónicas: "Pueblo sometido." No anotaron nombres, ni historias, ni lo que se perdió.<br><br>La conquista de América fue también la conquista del olvido.',
    refl:  'Entre 1492 y 1650, la población indígena americana cayó de 50-60 millones a 5-6 millones. La mayoría murió por enfermedades. Recordar estas historias es también una forma de resistencia.',
  },

}

// Orden de evaluación por destino (épico → bueno → amargo)
export const ENDING_PRIORITY: Record<string, string[]> = {
  amazonas:      ['amazonas_excelente',      'amazonas_bueno',      'amazonas_amargo'],
  patagonia_arg: ['patagonia_arg_excelente', 'patagonia_arg_bueno', 'patagonia_arg_amargo'],
  patagonia_chi: ['patagonia_chi_excelente', 'patagonia_chi_bueno', 'patagonia_chi_amargo'],
}
