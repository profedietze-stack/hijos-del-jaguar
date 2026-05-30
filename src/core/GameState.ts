import type { Difficulty, Stats, NodeState, DecisionEffect } from '../data/types.js'
import { NODES_DEF }   from '../data/nodes.js'
import { DIFF_CONFIG } from '../data/difficultyConfig.js'

// ══════════════════════════════════════════════════════
// ESTADO EXTENDIDO DEL CONQUISTADOR
// ══════════════════════════════════════════════════════
export interface ConqState {
  routeIdx:   number
  caught:     boolean
  reorgTurns: number
}

// ══════════════════════════════════════════════════════
// DATOS DE LA PARTIDA TERMINADA (para historial)
// ══════════════════════════════════════════════════════
export interface FinishedGame {
  diff:        Difficulty
  caciqueName: string
  endTitle:    string
  endBadge:    string
  endGlyph:    string
  endNarr:     string
  endRefl:     string
  m:           number          // supervivientes al terminar
  alliances:   string[]
  visitedCount: number
  date:        number          // Date.now()
  durationMs:  number
  // Progreso del conquistador al terminar (opcional por backward-compat)
  conqCaught?:   boolean
  conqRouteIdx?: number
}

// ══════════════════════════════════════════════════════
// NOTIFICACIÓN DE CAMBIO DE STAT
// ══════════════════════════════════════════════════════
export type NotifKind = 'gain' | 'loss' | 'info'
export interface Notif {
  msg:  string
  kind: NotifKind
}

// ══════════════════════════════════════════════════════
// ESTADO PRINCIPAL DEL JUEGO (inmutable por convención)
// Las funciones del engine devuelven NUEVOS objetos.
// ══════════════════════════════════════════════════════
export interface GameState {
  diff:         Difficulty
  caciqueName:  string
  stats:        Stats
  nodes:        Record<string, NodeState>
  history:      string[]        // IDs de nodos visitados en orden
  alliances:    string[]        // alliance keys acumuladas
  currentNode:  string | null
  finalTag:     string | null   // tag del destino elegido (e_encrucijada)
  conq:         ConqState
  startTime:    number          // Date.now() al iniciar
  pendingGame:  FinishedGame | null  // datos listos para guardar en historial
}

// ── HELPERS ───────────────────────────────────────────

/** Suma total de supervivientes */
export function totalM(s: Stats): number {
  return s.warriors + s.shamans + s.civilians
}

/** Clamp 0–100 por defecto */
export function clamp(v: number, mn = 0, mx = 100): number {
  return Math.max(mn, Math.min(mx, v))
}

// ── FACTORY: estado inicial ───────────────────────────

/**
 * Construye un GameState fresco para una partida nueva.
 * Asigna aleatoriamente un evento de cada pool de nodo.
 */
export function createInitialState(diff: Difficulty, caciqueName: string): GameState {
  const cfg = DIFF_CONFIG[diff]

  // Clonar nodos y asignar evento aleatorio de cada pool
  const nodes: Record<string, NodeState> = {}
  for (const [id, def] of Object.entries(NODES_DEF)) {
    const pool = def.eventPool
    const eventId = pool[Math.floor(Math.random() * pool.length)]
    nodes[id] = {
      ...def,
      completed:   false,
      unlocked:    id === 'n00',   // solo el nodo inicial desbloqueado
      eventId,
      unlockedFrom: undefined,
    }
  }

  return {
    diff,
    caciqueName,
    stats:       { ...cfg.initStats },
    nodes,
    history:     [],
    alliances:   [],
    currentNode: null,
    finalTag:    null,
    conq: {
      routeIdx:   0,
      caught:     false,
      reorgTurns: 0,
    },
    startTime:   Date.now(),
    pendingGame: null,
  }
}

// ── CLONAR ESTADO (shallow-deep híbrido para perf) ────

export function cloneState(gs: GameState): GameState {
  return {
    ...gs,
    stats:    { ...gs.stats },
    history:  [...gs.history],
    alliances:[...gs.alliances],
    conq:     { ...gs.conq },
    nodes:    cloneNodes(gs.nodes),
    pendingGame: gs.pendingGame ? { ...gs.pendingGame, alliances: [...gs.pendingGame.alliances] } : null,
  }
}

function cloneNodes(nodes: Record<string, NodeState>): Record<string, NodeState> {
  const out: Record<string, NodeState> = {}
  for (const [k, v] of Object.entries(nodes)) out[k] = { ...v }
  return out
}

// ── UTILIDAD: obtener nodos desbloqueados no visitados ─

export function getAvailableNodes(gs: GameState): NodeState[] {
  return Object.values(gs.nodes).filter(n => n.unlocked && !n.completed)
}

// ── UTILIDAD: comprobar si un nodo es final ───────────

export function isFinalNode(nodeId: string): boolean {
  return ['n11a', 'n11b', 'n11c'].includes(nodeId)
}

// ── UTILIDAD: desbloquear hijos de un nodo ────────────

export function unlockChildren(
  nodes: Record<string, NodeState>,
  parentId: string,
): Record<string, NodeState> {
  const out = { ...nodes }
  const parent = out[parentId]
  if (!parent) return out
  for (const childId of parent.next) {
    if (out[childId] && !out[childId].unlocked) {
      out[childId] = { ...out[childId], unlocked: true, unlockedFrom: parentId }
    }
  }
  return out
}

// ── TIPOS AUXILIARES para efectos escalados ───────────

export interface ScaledFX {
  food?:  number
  moral?: number
  salud?: number
  union?: number
}

/** Extrae solo las keys de stat del DecisionEffect */
export function toStatEffect(fx: DecisionEffect): ScaledFX {
  const out: ScaledFX = {}
  if (fx.food  !== undefined) out.food  = fx.food
  if (fx.moral !== undefined) out.moral = fx.moral
  if (fx.salud !== undefined) out.salud = fx.salud
  if (fx.union !== undefined) out.union = fx.union
  return out
}
