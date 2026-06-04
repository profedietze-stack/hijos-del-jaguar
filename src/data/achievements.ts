import type { AchievementDef } from './types.js'

export const LOGROS_DEF: AchievementDef[] = [

  // ── EDUCATIVO (4) ────────────────────────────────────────────
  {
    id: 'edu_superviviente',
    modos: ['educativo'],
    icon: '🌿',
    nombre: 'El Pueblo Camina',
    desc: 'Completa la partida con al menos 20 supervivientes.',
    cond: (d) => d.m >= 20,
  },
  {
    id: 'edu_alianzas',
    modos: ['educativo'],
    icon: '🤝',
    nombre: 'Tejedor de Pueblos',
    desc: 'Forja al menos 3 alianzas con pueblos del camino.',
    cond: (d) => [...new Set(d.alliances)].length >= 3,
  },
  {
    id: 'edu_recursos',
    modos: ['educativo'],
    icon: '🌽',
    nombre: 'Sabiduría Práctica',
    desc: 'Llega al final con todos los recursos por encima de 30.',
    cond: (d) => d.stats.food >= 30 && d.stats.moral >= 30 && d.stats.salud >= 30 && d.stats.union >= 30,
  },
  {
    id: 'edu_explorador',
    modos: ['educativo'],
    icon: '🗺️',
    nombre: 'Caminante Curioso',
    desc: 'Visita al menos 15 lugares en una sola partida.',
    cond: (d) => d.visitedCount >= 15,
  },

  // ── HISTÓRICO (6) ─────────────────────────────────────────────
  {
    id: 'his_incorruptible',
    modos: ['historico'],
    icon: '🔥',
    nombre: 'El Fuego No se Apaga',
    desc: 'Completa la partida en Histórico con moral ≥ 40.',
    cond: (d) => d.diff === 'historico' && d.stats.moral >= 40,
  },
  {
    id: 'his_red',
    modos: ['historico'],
    icon: '🕸️',
    nombre: 'La Gran Red',
    desc: 'Forja 7 o más alianzas únicas en modo Histórico.',
    cond: (d) => d.diff === 'historico' && [...new Set(d.alliances)].length >= 7,
  },
  {
    id: 'his_supervivencia',
    modos: ['historico'],
    icon: '⚔️',
    nombre: 'Contra Todo',
    desc: 'Llega al final en Histórico con al menos 25 supervivientes.',
    cond: (d) => d.diff === 'historico' && d.m >= 25,
  },
  {
    id: 'his_chamanes',
    modos: ['historico'],
    icon: '🌀',
    nombre: 'La Memoria Vive',
    desc: 'Conserva todos los chamanes: llega al final con 8 o más.',
    cond: (d) => d.diff === 'historico' && d.stats.shamans >= 8,
  },
  {
    id: 'his_escape',
    modos: ['historico'],
    icon: '🏃',
    nombre: 'Siempre Un Paso Adelante',
    desc: 'En Histórico, sobrevivir un encuentro con los conquistadores y completar la partida.',
    cond: (d) => d.diff === 'historico' && d.conquCaught === true,
  },
  {
    id: 'his_legendario',
    modos: ['historico'],
    icon: '🌟',
    nombre: 'Leyenda del Sur',
    desc: 'Completa Histórico con 30+ supervivientes, 4+ alianzas y destino épico.',
    cond: (d) =>
      d.diff === 'historico' &&
      d.m >= 30 &&
      [...new Set(d.alliances)].length >= 4 &&
      d.end?.badge?.includes('ÉPICO') === true,
  },

  // ── ALIANZAS ESPECIALES (4) ──────────────────────────────────
  {
    id: 'esp_ancestrales',
    modos: ['historico', 'legendario'],
    icon: '🏔️',
    nombre: 'Pueblos del Altiplano',
    desc: 'Forja alianza con los omaguacas, custodios del Camino del Inca en la Quebrada.',
    cond: (d) => d.alliances.includes('omaguacas'),
  },
  {
    id: 'esp_cimarron',
    modos: ['educativo', 'historico', 'legendario'],
    icon: '⛓️',
    nombre: 'Hermanos en la Fuga',
    desc: 'Forja alianza con el cimarrón — otro que también huyó del mismo sistema.',
    cond: (d) => d.alliances.includes('cimarron'),
  },
  {
    id: 'esp_guardianes_agua',
    modos: ['historico', 'legendario'],
    icon: '💧',
    nombre: 'Guardianes del Agua Oculta',
    desc: 'Forja alianzas con los tobas del agua y los guaraníes del Iberá: los pueblos del agua interior.',
    cond: (d) => d.alliances.includes('tobas_agua') && d.alliances.includes('guaranies_ibera'),
  },
  {
    id: 'esp_red_continental',
    modos: ['historico', 'legendario'],
    icon: '🌐',
    nombre: 'Red Continental',
    desc: 'Forja al menos una alianza en cada región: Mesoamérica, Caribe/Andes, Amazonas y Sur.',
    cond: (d) => {
      const a = d.alliances
      const meso  = a.some(x => ['pipil','tzotziles','ngabe_bugle'].includes(x))
      const andean = a.some(x => ['cunas','caribes','muiscas','inca','omaguacas'].includes(x))
      const amazon = a.some(x => ['yanomami','shipibo','embera','guardianes','ribeirinhos','mojos','mojos_ingenieros','yagua','guardianes_fuentes'].includes(x))
      const sur    = a.some(x => ['tehuelches','tehuelches_laguna','tehuelches_invierno','tehuelches_sur','kawesqar','kawesqar_nino','kawesqar_canales','kawesqar_navegacion','mapuches','mapuches_parlamento','ranqueles','sierras','tobas','tobas_agua','guaranies_ibera'].includes(x))
      return meso && andean && amazon && sur
    },
  },

  // ── LEGENDARIO (5) ────────────────────────────────────────────
  {
    id: 'leg_sobreviviente',
    modos: ['legendario'],
    icon: '💀',
    nombre: 'Contra el Apocalipsis',
    desc: 'Completa una partida en modo Legendario.',
    cond: (d) => d.diff === 'legendario',
  },
  {
    id: 'leg_alianzas',
    modos: ['legendario'],
    icon: '🌐',
    nombre: 'La Red Imposible',
    desc: 'Forja 6 o más alianzas en modo Legendario.',
    cond: (d) => d.diff === 'legendario' && [...new Set(d.alliances)].length >= 6,
  },
  {
    id: 'leg_imparable',
    modos: ['legendario'],
    icon: '🔱',
    nombre: 'Imparable',
    desc: 'Llega al final en Legendario con al menos 20 supervivientes.',
    cond: (d) => d.diff === 'legendario' && d.m >= 20,
  },
  {
    id: 'leg_fantasma',
    modos: ['legendario'],
    icon: '👻',
    nombre: 'El Pueblo Fantasma',
    desc: 'En Legendario, sobrevivir un encuentro con los conquistadores.',
    cond: (d) => d.diff === 'legendario' && d.conquCaught === true,
  },
  {
    id: 'leg_dios',
    modos: ['legendario'],
    icon: '🌟',
    nombre: 'Hijo del Jaguar',
    desc: 'Termina Legendario con final épico: 34+ supervivientes, 4+ alianzas.',
    cond: (d) =>
      d.diff === 'legendario' &&
      d.m >= 34 &&
      [...new Set(d.alliances)].length >= 4 &&
      d.end?.badge?.includes('ÉPICO') === true,
  },

  // ── LEGENDARIO ADICIONALES (3) ───────────────────────────────
  {
    id: 'leg_acero',
    modos: ['legendario'],
    icon: '🗡️',
    nombre: 'Voluntad de Acero',
    desc: 'En Legendario, llega al final con moral ≥ 60 — la mente nunca rota.',
    cond: (d) => d.diff === 'legendario' && d.stats.moral >= 60,
  },
  {
    id: 'leg_maestro',
    modos: ['legendario'],
    icon: '🎯',
    nombre: 'Maestro del Destino',
    desc: 'En Legendario, forja 8+ alianzas únicas Y llega con moral ≥ 50 Y 25+ supervivientes.',
    cond: (d) =>
      d.diff === 'legendario' &&
      [...new Set(d.alliances)].length >= 8 &&
      d.stats.moral >= 50 &&
      d.m >= 25,
  },
  {
    id: 'leg_leyenda',
    modos: ['legendario'],
    icon: '🐆',
    nombre: 'Leyenda Eterna',
    desc: 'El logro supremo: Legendario, final épico, 38+ supervivientes, 6+ alianzas, moral ≥ 65.',
    cond: (d) =>
      d.diff === 'legendario' &&
      d.m >= 38 &&
      [...new Set(d.alliances)].length >= 6 &&
      d.stats.moral >= 65 &&
      d.end?.badge?.includes('ÉPICO') === true,
  },
]

export const LOGROS_KEY = 'jaguar_logros'
