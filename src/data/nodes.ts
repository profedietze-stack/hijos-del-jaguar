import type { NodeDef } from './types.js'

// ══════════════════════════════════════════════════════
// NODOS DEL MAPA — 4 Actos, 3 destinos finales
// ══════════════════════════════════════════════════════

export const NODES_DEF: Record<string, NodeDef> = {

  // ── ACTO I — HUIDA (Guatemala → Panamá) ─────────────────────
  n00: { id:'n00', name:'Guatemala',     lon:-90.3, lat:15.5,  act:1, icon:'🔥', desc:'El inicio. La aldea arde. Todo comenzó aquí.',                           eventPool:['e_inicio'],          next:['n01a','n01b'] },
  n01a:{ id:'n01a',name:'El Salvador',   lon:-88.9, lat:13.5,  act:1, icon:'🌳', desc:'Ruta por la selva oscura hacia el sur.',                                eventPool:['e_selva','e_selva_b'], next:['n02a','n02b'] },
  n01b:{ id:'n01b',name:'Honduras',      lon:-86.5, lat:14.8,  act:1, icon:'🌊', desc:'Cruzar los ríos de noche para borrar el rastro.',                       eventPool:['e_rio','e_rio_b'],    next:['n02a','n02c'] },
  n02a:{ id:'n02a',name:'Nicaragua',     lon:-85.2, lat:12.8,  act:1, icon:'🤝', desc:'Un pueblo desconocido en los márgenes de la ruta.',                     eventPool:['e_alianza','e_alianza_b'], next:['n02b','n03'] },
  n02b:{ id:'n02b',name:'Costa Rica',    lon:-83.8, lat:9.9,   act:1, icon:'💀', desc:'La enfermedad de los españoles llega antes que ellos.',                 eventPool:['e_fiebre','e_fiebre_b'],   next:['n03'] },
  n02c:{ id:'n02c',name:'Costa del Caribe', lon:-82.5, lat:13.5, act:1, icon:'⛵', desc:'La costa caribeña: piratas, mercaderes y pueblos libres.',            eventPool:['e_caribe','e_caribe_b'],   next:['n02d'] },
  n02d:{ id:'n02d',name:'Darién Norte',  lon:-77.2, lat:8.5,   act:1, icon:'🌿', desc:'El extremo del continente, donde la tierra se estrecha.',               eventPool:['e_darien_norte','e_darien_norte_b'], next:['n03'] },

  // ── CONVERGENCIA I → II ──────────────────────────────────────
  n03: { id:'n03', name:'Panamá',        lon:-79.5, lat:8.9,   act:2, icon:'🏔️', desc:'El cuello de América. Hay que cruzarlo.',                              eventPool:['e_istmo','e_istmo_b'], next:['n04a','n04b','n04c'] },

  // ── ACTO II — TRAVESÍA (Panamá → Bolivia) ───────────────────
  n04a:{ id:'n04a',name:'Darién – Selva',     lon:-77.0, lat:6.5,  act:2, icon:'🌿', desc:'La selva más cerrada del continente.',                             eventPool:['e_darien','e_darien_b'],  next:['n05a','n05b'] },
  n04b:{ id:'n04b',name:'Colombia – Pacífico',lon:-77.0, lat:3.8,  act:2, icon:'⚓', desc:'Seguir la costa del Pacífico hacia el sur.',                       eventPool:['e_costa','e_costa_b'],    next:['n05a','n05c'] },
  n04c:{ id:'n04c',name:'Venezuela – Llanos', lon:-67.0, lat:7.5,  act:2, icon:'🌾', desc:'Las llanuras interminables del norte de América del Sur.',          eventPool:['e_llanos','e_llanos_b'],  next:['n05c','n05d'] },
  n05a:{ id:'n05a',name:'Ecuador – Andes',    lon:-78.5, lat:-1.5, act:2, icon:'🏔️', desc:'Las montañas más altas jamás vistas.',                            eventPool:['e_andes','e_andes_b'],    next:['n05b','n06a'] },
  n05b:{ id:'n05b',name:'Perú – Amazonas Norte', lon:-74.5, lat:-4.0, act:2, icon:'🌊', desc:'El río que respira. La puerta a la selva infinita.',            eventPool:['e_amazonas','e_amazonas_b'], next:['n05e','n06a'] },
  n05c:{ id:'n05c',name:'Colombia – Interior',lon:-73.5, lat:5.5,  act:2, icon:'🏛️', desc:'El corazón andino de Colombia: pueblos y mercaderes.',             eventPool:['e_magdalena','e_magdalena_b'], next:['n05a','n06a'] },
  n05d:{ id:'n05d',name:'Guayana',            lon:-60.5, lat:4.5,  act:2, icon:'💎', desc:'Tierra de ríos negros y piedras que brillan.',                     eventPool:['e_guayana','e_guayana_b'],   next:['n05e','n06b'] },
  n05e:{ id:'n05e',name:'Amazonas Profundo',  lon:-66.0, lat:-2.5, act:2, icon:'🐆', desc:'El corazón verde del mundo. Pocos regresan.',                      eventPool:['e_selva_profunda','e_selva_profunda_b'], next:['n06b','n06a'] },

  // ── CONVERGENCIAS HACIA ACTO III ────────────────────────────
  n06a:{ id:'n06a',name:'Bolivia – Altiplano', lon:-67.5, lat:-17.0, act:3, icon:'☀️', desc:'El techo del mundo. El Lago Titicaca brilla abajo.',             eventPool:['e_altiplano','e_altiplano_b'], next:['n07a','n07b'] },
  n06b:{ id:'n06b',name:'Bolivia – Amazonas',  lon:-64.5, lat:-14.5, act:3, icon:'🌿', desc:'El Amazonas boliviano: ríos anchos y pueblos mojos.',            eventPool:['e_amazonas_boliviano','e_amazonas_boliviano_b'], next:['n07c','n07b'] },

  // ── ACTO III — EL SUR (Bolivia → La Encrucijada) ────────────
  n07a:{ id:'n07a',name:'Tucumán',          lon:-65.2, lat:-26.8, act:3, icon:'⚔️', desc:'Los conquistadores también llegaron hasta aquí.',                   eventPool:['e_tucuman','e_tucuman_b'],   next:['n08a','n08b'] },
  n07b:{ id:'n07b',name:'Mendoza',          lon:-68.8, lat:-32.9, act:3, icon:'🍇', desc:'Un valle fértil al pie de los Andes nevados.',                      eventPool:['e_mendoza','e_mendoza_b'],   next:['n08b','n08c'] },
  n07c:{ id:'n07c',name:'Misiones',         lon:-55.0, lat:-27.4, act:3, icon:'⛪', desc:'El territorio de las misiones jesuitas guaraníes.',                  eventPool:['e_misiones','e_misiones_b'], next:['n08a','n08b'] },
  n08a:{ id:'n08a',name:'Pampas',           lon:-63.0, lat:-35.5, act:3, icon:'🌾', desc:'La llanura infinita. El caballo ya llegó hasta aquí.',               eventPool:['e_pampas','e_pampas_b'],     next:['n09'] },
  n08b:{ id:'n08b',name:'Córdoba – Sierras',lon:-64.2, lat:-31.5, act:3, icon:'🌄', desc:'Las sierras del centro. Último refugio antes del sur.',              eventPool:['e_sierras','e_sierras_b'],   next:['n09'] },
  n08c:{ id:'n08c',name:'Neuquén – Mapuches',lon:-70.0, lat:-39.0, act:3, icon:'🦅', desc:'Tierra mapuche. El pueblo que nunca fue conquistado.',              eventPool:['e_mapuches','e_mapuches_b'], next:['n09'] },

  // ── CONVERGENCIA FINAL ───────────────────────────────────────
  n09: { id:'n09', name:'La Encrucijada', lon:-67.5, lat:-43.0, act:4, icon:'⭐', desc:'El momento de elegir el destino definitivo de tu pueblo.',             eventPool:['e_encrucijada'],             next:['n10a','n10b','n10c'] },

  // ── ACTO IV — Rama A: Amazonas Profundo ─────────────────────
  n10a: { id:'n10a',  name:'Alto Amazonas',      lon:-74.5, lat:-5.0,  act:4, icon:'🌿', desc:'Remontar el Amazonas hacia sus fuentes sagradas.',              eventPool:['e_amazonia_final_a','e_amazonia_final_b'], next:['n10a2'] },
  n10a2:{ id:'n10a2', name:'Confluencia Sagrada', lon:-73.5, lat:-7.0,  act:4, icon:'💧', desc:'Donde los ríos se unen y el tiempo se detiene.',               eventPool:['e_confluencia','e_confluencia_b'],          next:['n11a'] },
  n11a: { id:'n11a',  name:'Pueblo del Río',      lon:-73.0, lat:-9.0,  act:4, icon:'🏡', desc:'Fundar una nueva aldea donde el río nace.',                    eventPool:['e_fin_amazonas'],                           next:[] },

  // ── ACTO IV — Rama B: Patagonia Argentina ───────────────────
  n10b: { id:'n10b',  name:'Río Negro',        lon:-65.0, lat:-40.5, act:4, icon:'🌬️', desc:'Cruzar el río que marca el fin del mundo conocido.',              eventPool:['e_patagonia_arg_a','e_patagonia_arg_b'],   next:['n10b2'] },
  n10b2:{ id:'n10b2', name:'Las Lagunas Azules',lon:-66.5, lat:-43.5, act:4, icon:'🦢', desc:'Un campo de lagunas color turquesa en la estepa infinita.',       eventPool:['e_lagunas_azules','e_lagunas_azules_b'],   next:['n11b'] },
  n11b: { id:'n11b',  name:'Patagonia Argentina',lon:-66.0, lat:-48.0, act:4, icon:'🌟', desc:'La estepa infinita. El viento y las estrellas.',                 eventPool:['e_fin_patagonia_arg'],                      next:[] },

  // ── ACTO IV — Rama C: Patagonia Chilena ─────────────────────
  n10c: { id:'n10c',  name:'Paso Andino',      lon:-72.0, lat:-40.0, act:4, icon:'🏔️', desc:'Cruzar los Andes hacia la vertiente del Pacífico.',               eventPool:['e_patagonia_chi_a','e_patagonia_chi_b'],   next:['n10c2'] },
  n10c2:{ id:'n10c2', name:'Bosque Milenario', lon:-73.0, lat:-42.5, act:4, icon:'🌲', desc:'Árboles de tres mil años. El bosque más antiguo del continente.',  eventPool:['e_bosque_milenario','e_bosque_milenario_b'], next:['n11c'] },
  n11c: { id:'n11c',  name:'Patagonia Chilena', lon:-73.5, lat:-47.0, act:4, icon:'🌊', desc:'Los canales patagónicos: agua, bosque y silencio.',               eventPool:['e_fin_patagonia_chi'],                      next:[] },
}

export const EDGES: [string, string][] = [
  // Acto I
  ['n00','n01a'], ['n00','n01b'],
  ['n01a','n02a'], ['n01a','n02b'],
  ['n01b','n02a'], ['n01b','n02c'],
  ['n02a','n02b'], ['n02a','n03'],
  ['n02b','n03'],
  ['n02c','n02d'], ['n02d','n03'],
  // Acto II
  ['n03','n04a'], ['n03','n04b'], ['n03','n04c'],
  ['n04a','n05a'], ['n04a','n05b'],
  ['n04b','n05a'], ['n04b','n05c'],
  ['n04c','n05c'], ['n04c','n05d'],
  ['n05a','n05b'], ['n05a','n06a'],
  ['n05b','n05e'], ['n05b','n06a'],
  ['n05c','n05a'], ['n05c','n06a'],
  ['n05d','n05e'], ['n05d','n06b'],
  ['n05e','n06b'], ['n05e','n06a'],
  // Acto III
  ['n06a','n07a'], ['n06a','n07b'],
  ['n06b','n07c'], ['n06b','n07b'],
  ['n07a','n08a'], ['n07a','n08b'],
  ['n07b','n08b'], ['n07b','n08c'],
  ['n07c','n08a'], ['n07c','n08b'],
  ['n08a','n09'], ['n08b','n09'], ['n08c','n09'],
  // Acto IV
  ['n09','n10a'], ['n09','n10b'], ['n09','n10c'],
  ['n10a','n10a2'], ['n10a2','n11a'],
  ['n10b','n10b2'], ['n10b2','n11b'],
  ['n10c','n10c2'], ['n10c2','n11c'],
]

// Ruta del conquistador (nodos geográficos, no del grafo del juego)
export const CONQ_BRIDGE: { lon: number; lat: number; name?: string }[] = [
  { lon:-99.1, lat:19.4,  name:'Tenochtitlán' },
  { lon:-92.0, lat:17.0 },
  { lon:-90.3, lat:15.5 },  // Guatemala
  { lon:-88.9, lat:13.5 },  // El Salvador
  { lon:-86.5, lat:14.8 },  // Honduras
  { lon:-85.2, lat:12.8 },  // Nicaragua
  { lon:-83.8, lat:9.9  },  // Costa Rica
  { lon:-79.5, lat:8.9  },  // Panamá
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
