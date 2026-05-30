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
    desc: 'Visita al menos 10 lugares en una sola partida.',
    cond: (d) => d.visitedCount >= 10,
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
    desc: 'Forja 5 o más alianzas únicas en modo Histórico.',
    cond: (d) => d.diff === 'historico' && [...new Set(d.alliances)].length >= 5,
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
    desc: 'Forja 4 o más alianzas en modo Legendario.',
    cond: (d) => d.diff === 'legendario' && [...new Set(d.alliances)].length >= 4,
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
]

export const LOGROS_KEY = 'jaguar_logros'
