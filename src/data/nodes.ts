import type { NodeDef } from './types.js'

// ══════════════════════════════════════════════════════
// NODOS DEL MAPA — 4 Actos, 3 destinos finales
// ══════════════════════════════════════════════════════

export const NODES_DEF: Record<string, NodeDef> = {

  // ── ACTO I — HUIDA (Guatemala → Panamá) ─────────────────────
  n00: { id:'n00', name:'Guatemala',     lon:-90.3, lat:15.5,  act:1, icon:'🔥', desc:'El inicio. La aldea arde. Todo comenzó aquí.',                           eventPool:['e_inicio'],          next:['n01a','n01b','n00b'] },
  n00b:{ id:'n00b',name:'Volcanes de Guatemala', lon:-90.8, lat:14.2, act:1, icon:'🌋', desc:'Las cimas humeantes que los dioses kaqchikel habitaron desde el principio.', eventPool:['e_volcanes','e_volcanes_b'], next:['n01c'] },
  n01a:{ id:'n01a',name:'El Salvador',   lon:-88.9, lat:13.5,  act:1, icon:'🌳', desc:'Ruta por la selva oscura hacia el sur.',                                eventPool:['e_selva','e_selva_b'], next:['n01c'] },
  n01b:{ id:'n01b',name:'Honduras',      lon:-86.5, lat:14.8,  act:1, icon:'🌊', desc:'Cruzar los ríos de noche para borrar el rastro.',                       eventPool:['e_rio','e_rio_b'],    next:['n02c'] },
  n01c:{ id:'n01c',name:'Sierra Madre',  lon:-88.5, lat:13.0,  act:1, icon:'⛰️', desc:'Las alturas nubladas donde los españoles no se aventuran aún.',          eventPool:['e_sierra_madre','e_sierra_madre_b'], next:['n02a'] },
  n02a:{ id:'n02a',name:'Nicaragua',     lon:-85.2, lat:12.8,  act:1, icon:'🤝', desc:'Un pueblo desconocido en los márgenes de la ruta.',                     eventPool:['e_alianza','e_alianza_b'], next:['n_cocibolca'] },
  n_cocibolca:{ id:'n_cocibolca',name:'Lago Cocibolca', lon:-85.0, lat:11.6, act:1, icon:'🌅', desc:'El mar dulce: una laguna tan vasta que tiene olas, tiburones y sus propias islas sagradas.', eventPool:['e_cocibolca','e_cocibolca_b'], next:['n02b'] },
  n02b:{ id:'n02b',name:'Costa Rica',    lon:-84.0, lat:10.0,  act:1, icon:'💀', desc:'La enfermedad de los españoles llega antes que ellos.',                 eventPool:['e_fiebre','e_fiebre_b'],   next:['n_talamanca'] },
  n_talamanca:{ id:'n_talamanca',name:'Cordillera de Talamanca', lon:-83.0, lat:9.3, act:1, icon:'🏔️', desc:'Selvas nubladas tan cerradas que ningún ejército las cruzó jamás. Aquí los bribri guardan su mundo.', eventPool:['e_talamanca','e_talamanca_b'], next:['n03'] },
  n02c:{ id:'n02c',name:'Costa del Caribe', lon:-82.8, lat:13.6, act:1, icon:'⛵', desc:'La costa caribeña: piratas, mercaderes y pueblos libres.',            eventPool:['e_caribe','e_caribe_b'],   next:['n_mosquitia'] },
  n_mosquitia:{ id:'n_mosquitia',name:'La Mosquitia', lon:-83.4, lat:12.9, act:1, icon:'🐊', desc:'El último gran bosque de la costa: lagunas, manatíes y el pueblo misquito que nunca dobló la rodilla.', eventPool:['e_mosquitia','e_mosquitia_b'], next:['n02e'] },
  n02e:{ id:'n02e',name:'Bocas del Toro',lon:-82.2, lat:9.6,   act:1, icon:'🌺', desc:'El archipiélago caribeño donde el mar guarda secretos y aliados.',       eventPool:['e_bocas_toro','e_bocas_toro_b'],     next:['n02d'] },
  n02d:{ id:'n02d',name:'Darién Norte',  lon:-77.8, lat:8.6,   act:1, icon:'🌿', desc:'El extremo del continente, donde la tierra se estrecha.',               eventPool:['e_darien_norte','e_darien_norte_b'], next:['n_guna'] },
  n_guna:{ id:'n_guna',name:'Guna Yala', lon:-78.8, lat:9.4, act:1, icon:'🏝️', desc:'Cientos de islas de coral donde el pueblo guna organiza su propia ley frente al mar.', eventPool:['e_guna','e_guna_b'], next:['n03'] },

  // ── CONVERGENCIA I → II ──────────────────────────────────────
  n03: { id:'n03', name:'Panamá',        lon:-79.5, lat:8.9,   act:2, icon:'🏔️', desc:'El cuello de América. Hay que cruzarlo.',                              eventPool:['e_istmo','e_istmo_b'], next:['n04a','n04b','n04c'] },

  // ── ACTO II — TRAVESÍA (Panamá → Bolivia) ───────────────────
  n04a:{ id:'n04a',name:'Darién – Selva',     lon:-77.0, lat:6.5,  act:2, icon:'🌿', desc:'La selva más cerrada del continente.',                             eventPool:['e_darien','e_darien_b'],  next:['n05c'] },
  n04b:{ id:'n04b',name:'Colombia – Pacífico',lon:-77.0, lat:3.8,  act:2, icon:'⚓', desc:'Seguir la costa del Pacífico hacia el sur.',                       eventPool:['e_costa','e_costa_b'],    next:['n05c'] },
  n04c:{ id:'n04c',name:'Venezuela – Llanos', lon:-67.0, lat:7.5,  act:2, icon:'🌾', desc:'Las llanuras interminables del norte de América del Sur.',          eventPool:['e_llanos','e_llanos_b'],  next:['n_orinoco'] },
  n05a:{ id:'n05a',name:'Ecuador – Andes',    lon:-78.5, lat:-1.5, act:2, icon:'🏔️', desc:'Las montañas más altas jamás vistas.',                            eventPool:['e_andes','e_andes_b'],    next:['n_maranon'] },
  n05b:{ id:'n05b',name:'Perú – Amazonas Norte', lon:-74.5, lat:-4.0, act:2, icon:'🌊', desc:'El río que respira. La puerta a la selva infinita.',            eventPool:['e_amazonas','e_amazonas_b'], next:['n_andes_sur'] },
  n05c:{ id:'n05c',name:'Colombia – Interior',lon:-73.5, lat:5.5,  act:2, icon:'🏛️', desc:'El corazón andino de Colombia: pueblos y mercaderes.',             eventPool:['e_magdalena','e_magdalena_b'], next:['n05a'] },
  n05d:{ id:'n05d',name:'Guayana',            lon:-60.5, lat:4.5,  act:2, icon:'💎', desc:'Tierra de ríos negros y piedras que brillan.',                     eventPool:['e_guayana','e_guayana_b'],   next:['n_tepui'] },
  n05e:{ id:'n05e',name:'Amazonas Profundo',  lon:-66.0, lat:-2.5, act:2, icon:'🐆', desc:'El corazón verde del mundo. Pocos regresan.',                      eventPool:['e_selva_profunda','e_selva_profunda_b'], next:['n_llanos_mojos'] },
  n_maranon:  { id:'n_maranon',   name:'Río Marañón',          lon:-77.5, lat:-5.5,  act:2, icon:'🌊', desc:'El río que los quechuas llaman el padre del Amazonas. Sus aguas cafés bajan de los Andes con toda la fuerza de la cordillera.',                                              eventPool:['e_maranon','e_maranon_b'],           next:['n05b'] },
  n_andes_sur:{ id:'n_andes_sur', name:'Andes del Sur',         lon:-71.0, lat:-14.0, act:2, icon:'🏔️', desc:'Las cumbres nevadas donde la cordillera separa la Amazonía del altiplano. El último paso antes del mundo de los incas.',                                                  eventPool:['e_andes_sur','e_andes_sur_b'],       next:['n06a'] },
  n_orinoco:  { id:'n_orinoco',   name:'Delta del Orinoco',     lon:-62.5, lat:8.5,   act:2, icon:'🐊', desc:'El Orinoco se abre en cincuenta bocas antes de morir en el mar. Los warao viven sobre palafitos en ese laberinto de agua y manglar.',                                     eventPool:['e_orinoco','e_orinoco_b'],           next:['n05d'] },
  n_tepui:    { id:'n_tepui',     name:'Tepuyes de la Guayana', lon:-63.5, lat:4.0,   act:2, icon:'🪨', desc:'Mesetas de piedra que flotan sobre la selva como islas en el cielo. Tienen mil millones de años y en sus cimas hay mundos que ningún español vio jamás.',                 eventPool:['e_tepui','e_tepui_b'],               next:['n05e'] },
  n_llanos_mojos:{ id:'n_llanos_mojos', name:'Llanos de Mojos', lon:-63.0, lat:-13.0, act:2, icon:'🌾', desc:'Sabanas inundadas de Bolivia: cada año el río Mamoré las convierte en un mar interior. Los mojos viven sobre montículos artificiales que ellos mismos construyeron.',    eventPool:['e_llanos_mojos','e_llanos_mojos_b'], next:['n06b'] },

  // ── CONVERGENCIAS HACIA ACTO III ────────────────────────────
  n06a:{ id:'n06a',name:'Bolivia – Altiplano', lon:-67.5, lat:-17.0, act:3, icon:'☀️', desc:'El techo del mundo. El Lago Titicaca brilla abajo.',             eventPool:['e_altiplano','e_altiplano_b'], next:['n06c'] },
  n06b:{ id:'n06b',name:'Bolivia – Amazonas',  lon:-64.5, lat:-14.5, act:3, icon:'🌿', desc:'El Amazonas boliviano: ríos anchos y pueblos mojos.',            eventPool:['e_amazonas_boliviano','e_amazonas_boliviano_b'], next:['n07d'] },

  // ── ACTO III — EL SUR (Bolivia → La Encrucijada) ────────────
  // Corredor Oeste: n06a→n06c→n07a→★VallesCal→n07b→★AltoNeuquén→n08c→★SieVentana→n08b→n09
  // Corredor Este:  n06b→n07d→★Bañados→n07c→n08d→★Mesopotamia→n08a→★PampasSur→n08b→n09
  n06c:{ id:'n06c',name:'Quebrada de Humahuaca', lon:-65.4, lat:-23.2, act:3, icon:'🏜️', desc:'El cañón sagrado donde los omaguacas custodiaron durante siglos el camino al sur.', eventPool:['e_humahuaca','e_humahuaca_b'], next:['n07a'] },
  n07a:{ id:'n07a',name:'Tucumán',          lon:-65.2, lat:-26.8, act:3, icon:'⚔️', desc:'Los conquistadores también llegaron hasta aquí.',                   eventPool:['e_tucuman','e_tucuman_b'],   next:['n_valles_cal'] },
  n07b:{ id:'n07b',name:'Mendoza',          lon:-68.8, lat:-32.9, act:3, icon:'🍇', desc:'Un valle fértil al pie de los Andes nevados.',                      eventPool:['e_mendoza','e_mendoza_b'],   next:['n_alto_neuquen'] },
  n07c:{ id:'n07c',name:'Misiones',         lon:-55.0, lat:-27.4, act:3, icon:'⛪', desc:'El territorio de las misiones jesuitas guaraníes.',                  eventPool:['e_misiones','e_misiones_b'], next:['n08d'] },
  n07d:{ id:'n07d',name:'Gran Chaco',       lon:-61.0, lat:-22.5, act:3, icon:'🌵', desc:'El infierno verde: calor, sed y pueblos que conocen sus secretos.',  eventPool:['e_chaco','e_chaco_b'],       next:['n_banados'] },
  n08a:{ id:'n08a',name:'Pampas',           lon:-63.0, lat:-35.5, act:3, icon:'🌾', desc:'La llanura infinita. El caballo ya llegó hasta aquí.',               eventPool:['e_pampas','e_pampas_b'],     next:['n_pampas_sur'] },
  n08b:{ id:'n08b',name:'Córdoba – Sierras',lon:-64.2, lat:-31.5, act:3, icon:'🌄', desc:'Las sierras del centro. Último refugio antes del sur.',              eventPool:['e_sierras','e_sierras_b'],   next:['n09'] },
  n08c:{ id:'n08c',name:'Neuquén – Mapuches',lon:-70.0, lat:-39.0, act:3, icon:'🦅', desc:'Tierra mapuche. El pueblo que nunca fue conquistado.',              eventPool:['e_mapuches','e_mapuches_b'], next:['n_sie_ventana'] },
  n08d:{ id:'n08d',name:'Esteros del Iberá', lon:-57.8, lat:-28.5, act:3, icon:'🦜', desc:'El gran humedal guaraní: laberinto de agua, loros y camalotes.',    eventPool:['e_ibera','e_ibera_b'],       next:['n_mesopotamia'] },
  n_valles_cal:  { id:'n_valles_cal',   name:'Valles Calchaquíes', lon:-66.0, lat:-25.5, act:3, icon:'🏺', desc:'Cañones rojos habitados por los diaguitas desde hace milenios. Los calchaquíes resistieron a los españoles por más de un siglo.',           eventPool:['e_valles_cal','e_valles_cal_b'],     next:['n07b'] },
  n_alto_neuquen:{ id:'n_alto_neuquen', name:'Alto Neuquén',        lon:-70.0, lat:-37.5, act:3, icon:'🌲', desc:'El bosque de araucarias al norte de la Patagonia. Los pehuenches viven del piñón y conocen los pasos andinos como nadie.',                  eventPool:['e_alto_neuquen','e_alto_neuquen_b'], next:['n08c'] },
  n_sie_ventana: { id:'n_sie_ventana',  name:'Sierra de la Ventana',lon:-62.0, lat:-38.0, act:3, icon:'🪟', desc:'Una sierra solitaria en medio de las pampas, con una roca perforada por el viento que el horizonte convierte en ojo del mundo.',           eventPool:['e_sie_ventana','e_sie_ventana_b'],   next:['n08b'] },
  n_banados:     { id:'n_banados',      name:'Bañados del Izozog',  lon:-60.5, lat:-20.0, act:3, icon:'🐆', desc:'El gran humedal del Chaco boliviano: lagunas, jaguares y los chiquitanos que nunca se rindieron ante nadie.',                              eventPool:['e_banados','e_banados_b'],           next:['n07c'] },
  n_mesopotamia: { id:'n_mesopotamia',  name:'Mesopotamia',         lon:-59.0, lat:-31.0, act:3, icon:'🛶', desc:'La tierra entre el Paraná y el Uruguay. Los chaná navegan estos ríos desde hace siglos en canoas de totora, sin deberle nada a nadie.',   eventPool:['e_mesopotamia','e_mesopotamia_b'],   next:['n08a'] },
  n_pampas_sur:  { id:'n_pampas_sur',   name:'Pampa Interior',      lon:-65.5, lat:-37.0, act:3, icon:'🌾', desc:'La llanura abierta donde el viento no tiene donde detenerse. Los ranqueles viven aquí y conocen cada aguada, cada bajo, cada camino.',    eventPool:['e_pampas_sur','e_pampas_sur_b'],     next:['n08b'] },

  // ── CONVERGENCIA FINAL ───────────────────────────────────────
  n09: { id:'n09', name:'La Encrucijada', lon:-67.5, lat:-43.0, act:4, icon:'⭐', desc:'El momento de elegir el destino definitivo de tu pueblo.',             eventPool:['e_encrucijada','e_encrucijada_b'], next:['n10a','n10b','n10c'] },

  // ── ACTO IV — Rama A: Amazonas Profundo ─────────────────────
  n10a: { id:'n10a',  name:'Alto Amazonas',        lon:-74.5, lat:-5.0,  act:4, icon:'🌿', desc:'Remontar el Amazonas hacia sus fuentes sagradas.',                 eventPool:['e_amazonia_final_a','e_amazonia_final_b'],   next:['n10a2'] },
  n10a2:{ id:'n10a2', name:'Confluencia Sagrada',   lon:-73.5, lat:-7.0,  act:4, icon:'💧', desc:'Donde los ríos se unen y el tiempo se detiene.',                  eventPool:['e_confluencia','e_confluencia_b'],            next:['n10a3a','n10a3b'] },
  n10a3a:{ id:'n10a3a',name:'Los Yagua del Ucayali',lon:-71.5, lat:-8.5,  act:4, icon:'🎋', desc:'Un pueblo del río que conoce cada afluente como si fuera su casa.', eventPool:['e_yagua','e_yagua_b'],                       next:['n11a'] },
  n10a3b:{ id:'n10a3b',name:'Las Fuentes Sagradas', lon:-75.0, lat:-9.5,  act:4, icon:'⛰️', desc:'El punto donde el gran río nace como un hilo de agua pura.',        eventPool:['e_fuentes_sagradas','e_fuentes_sagradas_b'], next:['n11a'] },
  n11a: { id:'n11a',  name:'Pueblo del Río',        lon:-73.0, lat:-11.0, act:4, icon:'🏡', desc:'Fundar una nueva aldea donde el río nace.',                        eventPool:['e_fin_amazonas'],                            next:[] },

  // ── ACTO IV — Rama B: Patagonia Argentina ───────────────────
  n10b: { id:'n10b',  name:'Río Negro',            lon:-65.0, lat:-40.5, act:4, icon:'🌬️', desc:'Cruzar el río que marca el fin del mundo conocido.',                eventPool:['e_patagonia_arg_a','e_patagonia_arg_b'],     next:['n10b2'] },
  n10b2:{ id:'n10b2', name:'Las Lagunas Azules',    lon:-66.5, lat:-43.5, act:4, icon:'🦢', desc:'Un campo de lagunas color turquesa en la estepa infinita.',          eventPool:['e_lagunas_azules','e_lagunas_azules_b'],     next:['n10b3a','n10b3b'] },
  n10b3a:{ id:'n10b3a',name:'Los Tehuelches del Sur',lon:-69.0, lat:-46.0, act:4, icon:'🦬', desc:'Los maestros de la Patagonia profunda, guardianes del viento sur.', eventPool:['e_tehuelches_sur','e_tehuelches_sur_b'],     next:['n11b'] },
  n10b3b:{ id:'n10b3b',name:'La Gran Estepa',        lon:-65.5, lat:-46.0, act:4, icon:'🌾', desc:'La llanura sin fin donde el horizonte es solo viento y guanacos.',  eventPool:['e_gran_estepa','e_gran_estepa_b'],           next:['n11b'] },
  n11b: { id:'n11b',  name:'Patagonia Argentina',    lon:-67.0, lat:-49.5, act:4, icon:'🌟', desc:'La estepa infinita. El viento y las estrellas.',                   eventPool:['e_fin_patagonia_arg'],                       next:[] },

  // ── ACTO IV — Rama C: Patagonia Chilena ─────────────────────
  n10c: { id:'n10c',  name:'Paso Andino',           lon:-72.0, lat:-40.0, act:4, icon:'🏔️', desc:'Cruzar los Andes hacia la vertiente del Pacífico.',                eventPool:['e_patagonia_chi_a','e_patagonia_chi_b'],     next:['n10c2'] },
  n10c2:{ id:'n10c2', name:'Bosque Milenario',       lon:-73.0, lat:-42.5, act:4, icon:'🌲', desc:'Árboles de tres mil años. El bosque más antiguo del continente.',  eventPool:['e_bosque_milenario','e_bosque_milenario_b'], next:['n10c3a','n10c3b'] },
  n10c3a:{ id:'n10c3a',name:'Los Canales Australes', lon:-73.5, lat:-44.5, act:4, icon:'⛵', desc:'El laberinto de agua entre islas — solo los kawésqar lo conocen.',  eventPool:['e_canales_australes','e_canales_australes_b'], next:['n11c'] },
  n10c3b:{ id:'n10c3b',name:'Los Kawésqar',          lon:-75.2, lat:-46.0, act:4, icon:'🚣', desc:'El pueblo nómade del mar: viven en canoas, conocen cada canal.',    eventPool:['e_kawesqar','e_kawesqar_b'],                 next:['n11c'] },
  n11c: { id:'n11c',  name:'Patagonia Chilena',      lon:-73.5, lat:-48.5, act:4, icon:'🌊', desc:'Los canales patagónicos: agua, bosque y silencio.',                eventPool:['e_fin_patagonia_chi'],                       next:[] },
}

export const EDGES: [string, string][] = [
  // Acto I — Oeste (cordillera) / Este (caribe), convergen en n03
  ['n00','n00b'], ['n00','n01a'], ['n00','n01b'],
  ['n00b','n01c'], ['n01a','n01c'],
  ['n01b','n02c'],
  ['n01c','n02a'],
  ['n02a','n_cocibolca'], ['n_cocibolca','n02b'], ['n02b','n_talamanca'], ['n_talamanca','n03'],
  ['n02c','n_mosquitia'], ['n_mosquitia','n02e'], ['n02e','n02d'], ['n02d','n_guna'], ['n_guna','n03'],
  // Acto II — Oeste: n04a/n04b → n05c → n05a → n_maranon → n05b → n_andes_sur → n06a
  //          Este:  n04c → n_orinoco → n05d → n_tepui → n05e → n_llanos_mojos → n06b
  ['n03','n04a'], ['n03','n04b'], ['n03','n04c'],
  ['n04a','n05c'], ['n04b','n05c'],
  ['n05c','n05a'],
  ['n05a','n_maranon'], ['n_maranon','n05b'], ['n05b','n_andes_sur'], ['n_andes_sur','n06a'],
  ['n04c','n_orinoco'], ['n_orinoco','n05d'], ['n05d','n_tepui'], ['n_tepui','n05e'], ['n05e','n_llanos_mojos'], ['n_llanos_mojos','n06b'],
  // Acto III — Oeste: n06a→n06c→n07a→★VallesCal→n07b→★AltoNeuq→n08c→★SieVent→n08b→n09
  //           Este:  n06b→n07d→★Bañados→n07c→n08d→★Mesopot→n08a→★PampasSur→n08b→n09
  ['n06a','n06c'], ['n06c','n07a'],
  ['n07a','n_valles_cal'], ['n_valles_cal','n07b'], ['n07b','n_alto_neuquen'], ['n_alto_neuquen','n08c'], ['n08c','n_sie_ventana'], ['n_sie_ventana','n08b'],
  ['n06b','n07d'], ['n07d','n_banados'], ['n_banados','n07c'], ['n07c','n08d'], ['n08d','n_mesopotamia'], ['n_mesopotamia','n08a'], ['n08a','n_pampas_sur'], ['n_pampas_sur','n08b'],
  ['n08b','n09'],
  // Acto IV
  ['n09','n10a'], ['n09','n10b'], ['n09','n10c'],
  ['n10a','n10a2'],
  ['n10a2','n10a3a'], ['n10a2','n10a3b'],
  ['n10a3a','n11a'], ['n10a3b','n11a'],
  ['n10b','n10b2'],
  ['n10b2','n10b3a'], ['n10b2','n10b3b'],
  ['n10b3a','n11b'], ['n10b3b','n11b'],
  ['n10c','n10c2'],
  ['n10c2','n10c3a'], ['n10c2','n10c3b'],
  ['n10c3a','n11c'], ['n10c3b','n11c'],
]

// Ruta del conquistador (nodos geográficos, no del grafo del juego)
// Ruta pre-Guatemala del conquistador: Tenochtitlán → jugador (n00)
// Después de cb3, el conquistador sigue la ruta histórica del jugador.
export const CONQ_BRIDGE: { lon: number; lat: number; name: string }[] = [
  { lon:-99.1, lat:19.4, name:'Tenochtitlán'       },
  { lon:-96.7, lat:17.1, name:'Oaxaca'              },
  { lon:-92.9, lat:16.7, name:'Chiapas'             },
  { lon:-91.5, lat:15.9, name:'Frontera Guatemala'  },
]

export const ACT_NAMES: Record<number, string> = {
  1: 'Acto I · Huida',
  2: 'Acto II · Travesía',
  3: 'Acto III · El Sur',
  4: 'Acto IV · El Destino',
}

export const CACIQUE_NAMES = [
  // Mayas y quichés
  'Balam','Ixchel','Hunahpú','Ixbalanqué','Kukul','Zipacná','Cabrakan',
  'Tojil','Awilix','Jacawitz','Ixquic','Vucub','Xbalanqué','Ah Puch',
  'Itzamná','Chaac','Kukulcán','Hun Hunahpú','Ixmucané','Tepeu',
  // Nahuas y aztecas
  'Xochitl','Citlali','Tonatiuh','Coatl','Cuauhtli','Mazatl','Ocelotl',
  'Quetzal','Ixtli','Tlaloc','Huitzilin','Nahuatl','Cipactli',
  // Andinos y quechuas
  'Amaru','Illari','Qori','Sumaq','Wayra','Inti','Pacari','Kuntur',
  'Mamani','Yupanki','Tupac','Killa','Rimac','Urco',
]
