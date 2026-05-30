import type { Decision, ActNumber }   from '../data/types.js'
import type { EndingDef }              from '../data/types.js'
import type { GameState, FinishedGame, Notif } from './GameState.js'
import {
  cloneState, totalM,
  unlockChildren, isFinalNode,
} from './GameState.js'
import { resolveTurn, isDefeated }     from './StatSystem.js'
import { DIFF_CONFIG }                 from '../data/difficultyConfig.js'
import { ENDINGS_DEF, ENDING_PRIORITY } from '../data/endings.js'
import { LOGROS_DEF }                  from '../data/achievements.js'
import { CONQ_BRIDGE }                 from '../data/nodes.js'

// ══════════════════════════════════════════════════════
// GAME ENGINE — orquestador puro
// Todas las funciones toman un GameState y devuelven uno nuevo.
// Ninguna función tiene efectos secundarios (UI, audio, storage).
// ══════════════════════════════════════════════════════

// ── TIPOS DE RESULTADO ────────────────────────────────

export interface TurnResult {
  state:    GameState
  notifs:   Notif[]
  defeated: boolean
  finished: boolean          // llegó a un nodo final
  ending?:  EndingDef
}

export interface ConqMoveResult {
  state:  GameState
  caught: boolean            // el conquistador alcanzó al jugador
  reorg:  boolean            // turno de reorganización (sin movimiento)
  notifs: Notif[]
}

// ── 1. APLICAR DECISIÓN Y AVANZAR TURNO ──────────────

/**
 * Aplica la elección del jugador:
 * 1. Marca el nodo como completado
 * 2. Registra alianza si la hay
 * 3. Registra finalTag si la hay
 * 4. Resuelve efectos + decay + muertes
 * 5. Desbloquea nodos hijos
 * 6. Comprueba derrota / final
 */
export function applyDecision(gs: GameState, decision: Decision): TurnResult {
  const next = cloneState(gs)
  const notifs: Notif[] = []

  // — Registrar alianza
  if (decision.allianceKey && !next.alliances.includes(decision.allianceKey)) {
    next.alliances = [...next.alliances, decision.allianceKey]
    notifs.push({ msg: `🤝 Alianza forjada: ${decision.allianceKey.replace(/_/g, ' ')}`, kind: 'info' })
  }

  // — Registrar finalTag (destino elegido en la encrucijada)
  if (decision.finalTag) {
    next.finalTag = decision.finalTag
  }

  // — Determinar acto del nodo actual
  const nodeId  = next.currentNode!
  const node    = next.nodes[nodeId]
  const act     = (node?.act ?? 1) as ActNumber

  // — Aplicar efectos completos del turno
  const turn = resolveTurn(next.stats, decision.effects, act, next.diff, next.alliances)
  next.stats = turn.stats
  notifs.push(...turn.notifs)

  // — Marcar nodo completado y agregar al historial
  next.nodes = {
    ...next.nodes,
    [nodeId]: { ...node, completed: true },
  }
  if (!next.history.includes(nodeId)) {
    next.history = [...next.history, nodeId]
  }

  // — Desbloquear hijos
  next.nodes = unlockChildren(next.nodes, nodeId)

  // — ¿Derrota?
  const defeated = isDefeated(next.stats, next.diff)
  if (defeated) {
    const ending = ENDINGS_DEF['tragico']
    next.pendingGame = buildFinishedGame(next, ending)
    return { state: next, notifs, defeated: true, finished: true, ending }
  }

  // — ¿Nodo final?
  const finished = isFinalNode(nodeId)
  if (finished) {
    const dest   = resolveDestination(next.finalTag)
    const ending = resolveEnding(totalM(next.stats), next.alliances, dest, next.diff)
    next.pendingGame = buildFinishedGame(next, ending)
    return { state: next, notifs, defeated: false, finished: true, ending }
  }

  return { state: next, notifs, defeated: false, finished: false }
}

// ── 2. MOVER AL CONQUISTADOR ──────────────────────────

/**
 * Calcula y aplica el avance del conquistador para este turno.
 * Retorna el nuevo estado y si capturó al jugador.
 */
export function advanceConquistador(gs: GameState): ConqMoveResult {
  const next   = cloneState(gs)
  const notifs: Notif[] = []
  const conq   = next.conq

  if (conq.caught) return { state: next, caught: false, reorg: false, notifs }

  // — Turno de reorganización
  if (conq.reorgTurns > 0) {
    next.conq = { ...conq, reorgTurns: conq.reorgTurns - 1 }
    notifs.push({ msg: '⚔️ Los conquistadores se reagrupan…', kind: 'info' })
    return { state: next, caught: false, reorg: true, notifs }
  }

  const isEdu      = gs.diff === 'educativo'
  const lag        = isEdu ? 2 : 1
  const histLen    = gs.history.length
  const maxNormal  = CONQ_BRIDGE.length + histLen - lag
  const playerPos  = CONQ_BRIDGE.length + histLen - 1
  const ri         = conq.routeIdx

  const jumpProb = isEdu ? 0.12 : 0.32
  const doJump   = Math.random() < jumpProb

  let targetIdx: number
  let isJump = false

  if (doJump && ri < playerPos) {
    targetIdx = playerPos
    isJump    = true
  } else if (ri < maxNormal) {
    targetIdx = ri + 1
  } else {
    // No se mueve este turno
    return { state: next, caught: false, reorg: false, notifs }
  }

  next.conq = { ...conq, routeIdx: targetIdx, caught: isJump }

  const toName = conqNodeName(targetIdx, gs)
  notifs.push({ msg: `⚔️ Los conquistadores avanzan — ${toName}`, kind: 'loss' })

  if (isJump) {
    notifs.push({ msg: '⚔️ ¡Los conquistadores te han alcanzado!', kind: 'loss' })
  }

  return { state: next, caught: isJump, reorg: false, notifs }
}

/** Nombre del nodo de la ruta del conquistador en un índice dado */
function conqNodeName(idx: number, gs: GameState): string {
  if (idx < CONQ_BRIDGE.length) {
    return CONQ_BRIDGE[idx].name ?? ''
  }
  const playerIdx = idx - CONQ_BRIDGE.length
  const nodeId    = gs.history[playerIdx]
  return nodeId ? (gs.nodes[nodeId]?.name ?? '') : ''
}

// ── 3. SELECCIONAR NODO (navegación del mapa) ─────────

/**
 * El jugador seleccionó un nodo desbloqueado en el mapa.
 * Actualiza currentNode y asigna un evento aleatorio del pool
 * si el nodo aún no tiene eventId.
 */
export function selectNode(gs: GameState, nodeId: string): GameState {
  const next = cloneState(gs)
  const node = next.nodes[nodeId]
  if (!node || !node.unlocked || node.completed) return gs

  // Asignar evento si no tiene
  let eventId = node.eventId
  if (!eventId || eventId === '') {
    const pool = node.eventPool
    eventId    = pool[Math.floor(Math.random() * pool.length)]
    next.nodes = { ...next.nodes, [nodeId]: { ...node, eventId } }
  }

  next.currentNode = nodeId
  return next
}

// ── 4. RESOLVER DESTINO FINAL ─────────────────────────

/**
 * Convierte el finalTag de la encrucijada al destino de ending.
 */
function resolveDestination(finalTag: string | null): string {
  if (!finalTag) return 'tragico'
  if (finalTag === 'dest_amazonas')       return 'amazonas'
  if (finalTag === 'dest_patagonia_arg')  return 'patagonia_arg'
  if (finalTag === 'dest_patagonia_chi')  return 'patagonia_chi'
  // Tags de los nodos finales dentro de las ramas
  if (finalTag.startsWith('amazonas'))      return 'amazonas'
  if (finalTag.startsWith('patagonia_arg')) return 'patagonia_arg'
  if (finalTag.startsWith('chile') || finalTag.startsWith('patagonia_chi')) return 'patagonia_chi'
  return 'tragico'
}

// ── 5. RESOLVER ENDING ────────────────────────────────

export function resolveEnding(
  m:         number,
  alliances: string[],
  dest:      string,
  diff:      string,
): EndingDef {
  const cfg     = DIFF_CONFIG[diff as keyof typeof DIFF_CONFIG]
  const { epic, good } = cfg.endingThresholds

  if (m < cfg.defeatThreshold) return ENDINGS_DEF['tragico']

  const priority = ENDING_PRIORITY[dest]
  if (!priority) return ENDINGS_DEF['tragico']

  for (const key of priority) {
    const ending = ENDINGS_DEF[key]
    if (ending && ending.cond(m, alliances)) {
      // Verificar umbrales explícitos de dificultad para épico/bueno
      if (key.endsWith('_excelente') && (m < epic.m || alliances.length < epic.a)) continue
      if (key.endsWith('_bueno')     && m < good.m) continue
      return ending
    }
  }

  // Fallback al amargo del destino
  const amargo = `${dest}_amargo`
  return ENDINGS_DEF[amargo] ?? ENDINGS_DEF['tragico']
}

// ── 6. CONSTRUIR RESUMEN DE PARTIDA TERMINADA ─────────

function buildFinishedGame(gs: GameState, ending: EndingDef): FinishedGame {
  return {
    diff:         gs.diff,
    caciqueName:  gs.caciqueName,
    endTitle:     ending.title,
    endBadge:     ending.badge,
    endGlyph:     ending.glyph,
    endNarr:      ending.narr,
    endRefl:      ending.refl,
    m:            totalM(gs.stats),
    alliances:    [...gs.alliances],
    visitedCount: gs.history.length,
    date:         Date.now(),
    durationMs:   Date.now() - gs.startTime,
    conqCaught:   gs.conq.caught,
    conqRouteIdx: gs.conq.routeIdx,
  }
}

// ── 7. COMPROBAR LOGROS ───────────────────────────────

/**
 * Evalúa qué logros se desbloquean con esta partida.
 * Devuelve solo los IDs que se cumplen (el SaveSystem filtrará duplicados).
 */
export function evaluateAchievements(gs: GameState, ending: EndingDef): string[] {
  const m     = totalM(gs.stats)
  const data  = {
    diff:        gs.diff,
    m,
    alliances:   gs.alliances,
    visitedCount: gs.history.length,
    stats:       gs.stats,
    end:         { badge: ending.badge },
    conquCaught: gs.conq.caught,
  }

  return LOGROS_DEF
    .filter(l => l.modos.includes(gs.diff) && l.cond(data))
    .map(l => l.id)
}

// ── 8. ACTO ACTUAL ────────────────────────────────────

/** Devuelve el número de acto donde está el jugador actualmente */
export function currentAct(gs: GameState): ActNumber {
  if (!gs.currentNode) return 1
  return (gs.nodes[gs.currentNode]?.act ?? 1) as ActNumber
}

// ── 9. POSICIÓN DEL CONQUISTADOR ─────────────────────

/** Coordenadas actuales del conquistador para dibujarlo en el mapa */
export function conqPosition(gs: GameState): { lon: number; lat: number } | null {
  const ri = gs.conq.routeIdx
  if (ri < CONQ_BRIDGE.length) {
    const b = CONQ_BRIDGE[ri]
    return { lon: b.lon, lat: b.lat }
  }
  const playerIdx = ri - CONQ_BRIDGE.length
  const nodeId    = gs.history[playerIdx]
  if (!nodeId) return null
  const node = gs.nodes[nodeId]
  return node ? { lon: node.lon, lat: node.lat } : null
}

// ── 10. RECALCULAR routeIdx al cargar save ────────────

/**
 * Después de cargar una partida, asegura que el routeIdx
 * del conquistador sea coherente con el historial actual.
 * (Para saves viejos o corruptos.)
 */
export function normalizeConqState(gs: GameState): GameState {
  const lag      = gs.diff === 'educativo' ? 2 : 1
  const histLen  = gs.history.length
  const minIdx   = Math.max(0, CONQ_BRIDGE.length + histLen - lag - 1)
  if (gs.conq.routeIdx < minIdx) {
    return {
      ...gs,
      conq: { ...gs.conq, routeIdx: minIdx },
    }
  }
  return gs
}
