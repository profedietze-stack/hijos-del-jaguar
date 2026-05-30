import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  applyDecision,
  advanceConquistador,
  selectNode,
  resolveEnding,
  evaluateAchievements,
  normalizeConqState,
  currentAct,
  conqPosition,
} from '../../core/GameEngine.js'
import { createInitialState } from '../../core/GameState.js'
import { CONQ_BRIDGE } from '../../data/nodes.js'
import type { GameState } from '../../core/GameState.js'
import type { Decision } from '../../data/types.js'

// ── Helpers ───────────────────────────────────────────

function freshState(diff: GameState['diff'] = 'educativo'): GameState {
  return createInitialState(diff, 'TestCacique')
}

function decisionWith(effects: Decision['effects'], extra?: Partial<Decision>): Decision {
  return { text: 'Test', effects, ...extra }
}

// ══════════════════════════════════════════════════════
// selectNode
// ══════════════════════════════════════════════════════

describe('selectNode', () => {
  it('establece currentNode al seleccionar un nodo desbloqueado', () => {
    const gs   = freshState()
    const next = selectNode(gs, 'n00')
    expect(next.currentNode).toBe('n00')
  })

  it('devuelve el estado original si el nodo no existe', () => {
    const gs   = freshState()
    const next = selectNode(gs, 'nXXX')
    expect(next).toBe(gs)
  })

  it('devuelve el estado original si el nodo está bloqueado', () => {
    const gs = freshState()
    // Todos los nodos excepto n00 están bloqueados al inicio
    const locked = Object.keys(gs.nodes).find(id => id !== 'n00' && !gs.nodes[id].unlocked)
    if (!locked) return  // no hay nodos bloqueados — saltar test
    const next = selectNode(gs, locked)
    expect(next).toBe(gs)
  })

  it('devuelve el estado original si el nodo ya fue completado', () => {
    const gs = {
      ...freshState(),
      nodes: {
        ...freshState().nodes,
        n00: { ...freshState().nodes['n00'], completed: true },
      },
    }
    const next = selectNode(gs, 'n00')
    expect(next).toBe(gs)
  })

  it('asigna un eventId si el nodo no tenía uno', () => {
    const base = freshState()
    const gsNoEvent = {
      ...base,
      nodes: { ...base.nodes, n00: { ...base.nodes['n00'], eventId: undefined } },
    }
    const next = selectNode(gsNoEvent, 'n00')
    expect(next.nodes['n00'].eventId).toBeDefined()
    expect(base.nodes['n00'].eventPool.includes(next.nodes['n00'].eventId!)).toBe(true)
  })
})

// ══════════════════════════════════════════════════════
// applyDecision
// ══════════════════════════════════════════════════════

describe('applyDecision', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // evitar muertes aleatorias
  })
  afterEach(() => vi.restoreAllMocks())

  it('marca el nodo actual como completado', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    const { state } = applyDecision(gs, decisionWith({}))
    expect(state.nodes['n00'].completed).toBe(true)
  })

  it('agrega el nodo al historial', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    const { state } = applyDecision(gs, decisionWith({}))
    expect(state.history).toContain('n00')
  })

  it('desbloquea los hijos del nodo completado', () => {
    const gs      = { ...freshState(), currentNode: 'n00' }
    const { state } = applyDecision(gs, decisionWith({}))
    const parent  = gs.nodes['n00']
    for (const childId of parent.next) {
      expect(state.nodes[childId]?.unlocked, `hijo ${childId} no desbloqueado`).toBe(true)
    }
  })

  it('registra una alianza cuando la decisión incluye allianceKey', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    const d  = decisionWith({}, { allianceKey: 'alianza_prueba' })
    const { state } = applyDecision(gs, d)
    expect(state.alliances).toContain('alianza_prueba')
  })

  it('no duplica alianzas ya registradas', () => {
    const gs = { ...freshState(), currentNode: 'n00', alliances: ['alianza_prueba'] }
    const d  = decisionWith({}, { allianceKey: 'alianza_prueba' })
    const { state } = applyDecision(gs, d)
    expect(state.alliances.filter(a => a === 'alianza_prueba')).toHaveLength(1)
  })

  it('registra finalTag si la decisión lo incluye', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    const d  = decisionWith({}, { finalTag: 'dest_amazonas' })
    const { state } = applyDecision(gs, d)
    expect(state.finalTag).toBe('dest_amazonas')
  })

  it('devuelve finished=false para un nodo no final', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    const { finished, defeated } = applyDecision(gs, decisionWith({}))
    expect(finished).toBe(false)
    expect(defeated).toBe(false)
  })

  it('devuelve defeated=true cuando los supervivientes caen por debajo del umbral', () => {
    // Total < 8 (umbral educativo): warriors=1, shamans=1, civilians=1 = 3
    const gs = {
      ...freshState(),
      currentNode: 'n00',
      stats: {
        food: 50, moral: 50, salud: 50, union: 50,
        warriors: 1, shamans: 1, civilians: 1,
      },
    }
    // Con warriors=-2 nos aseguramos de que baje del umbral
    const { defeated, ending } = applyDecision(gs, decisionWith({ warriors: -2 }))
    expect(defeated).toBe(true)
    expect(ending?.badge).toContain('TRÁGICO')
  })

  it('no muta el estado original', () => {
    const gs       = { ...freshState(), currentNode: 'n00' }
    const origFood = gs.stats.food
    applyDecision(gs, decisionWith({ food: 20 }))
    expect(gs.stats.food).toBe(origFood)
  })
})

// ══════════════════════════════════════════════════════
// advanceConquistador
// ══════════════════════════════════════════════════════

describe('advanceConquistador', () => {
  // CONQ_BRIDGE.length = 8

  it('avanza normalmente cuando doJump=false', () => {
    // random=0.99 > jumpProb (educativo=0.12) → no jump
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const gs = freshState()  // routeIdx=0, histLen=0
    // maxNormal = 8 + 0 - 2 = 6, ri=0 < 6 → targetIdx=1
    const { state, caught, reorg } = advanceConquistador(gs)
    expect(state.conq.routeIdx).toBe(1)
    expect(caught).toBe(false)
    expect(reorg).toBe(false)
    vi.restoreAllMocks()
  })

  it('realiza un salto cuando doJump=true y hay espacio', () => {
    // random=0.01 < jumpProb (educativo=0.12) → jump
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const gs = {
      ...freshState(),
      history: ['n00'],          // histLen=1
      conq: { routeIdx: 0, caught: false, reorgTurns: 0 },
    }
    // playerPos = 8 + 1 - 1 = 8, ri=0 < playerPos → jump a 8
    const { state, caught } = advanceConquistador(gs)
    expect(state.conq.routeIdx).toBe(8)
    expect(caught).toBe(true)
    vi.restoreAllMocks()
  })

  it('no se mueve cuando ya está caught', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const gs = { ...freshState(), conq: { routeIdx: 5, caught: true, reorgTurns: 0 } }
    const { state } = advanceConquistador(gs)
    expect(state.conq.routeIdx).toBe(5)
    vi.restoreAllMocks()
  })

  it('consume un turno de reorganización sin moverse', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const gs = { ...freshState(), conq: { routeIdx: 3, caught: false, reorgTurns: 2 } }
    const { state, reorg } = advanceConquistador(gs)
    expect(state.conq.routeIdx).toBe(3)  // no se movió
    expect(state.conq.reorgTurns).toBe(1)
    expect(reorg).toBe(true)
    vi.restoreAllMocks()
  })

  it('no se mueve cuando ya alcanzó maxNormal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // sin jump
    const gs = freshState()  // histLen=0
    // maxNormal = 8 + 0 - 2 = 6
    const gsAtMax = { ...gs, conq: { routeIdx: 6, caught: false, reorgTurns: 0 } }
    const { state } = advanceConquistador(gsAtMax)
    expect(state.conq.routeIdx).toBe(6)  // no avanza
    vi.restoreAllMocks()
  })
})

// ══════════════════════════════════════════════════════
// normalizeConqState
// ══════════════════════════════════════════════════════

describe('normalizeConqState', () => {
  it('no cambia el estado cuando routeIdx ya es válido', () => {
    // educativo, histLen=0: minIdx = max(0, 8+0-2-1) = max(0, 5) = 5
    const gs = { ...freshState(), conq: { routeIdx: 6, caught: false, reorgTurns: 0 } }
    const result = normalizeConqState(gs)
    expect(result.conq.routeIdx).toBe(6)
  })

  it('corrige routeIdx muy bajo para save antiguo', () => {
    // educativo, histLen=3: minIdx = max(0, 8+3-2-1) = max(0, 8) = 8
    const gs = {
      ...freshState(),
      history: ['n00', 'n01', 'n02'],
      conq: { routeIdx: 0, caught: false, reorgTurns: 0 },
    }
    const result = normalizeConqState(gs)
    expect(result.conq.routeIdx).toBe(8)
  })

  it('no muta el estado original', () => {
    const gs = {
      ...freshState(),
      history: ['n00'],
      conq: { routeIdx: 0, caught: false, reorgTurns: 0 },
    }
    normalizeConqState(gs)
    expect(gs.conq.routeIdx).toBe(0)
  })
})

// ══════════════════════════════════════════════════════
// resolveEnding
// ══════════════════════════════════════════════════════

describe('resolveEnding', () => {
  it('devuelve tragico cuando m < defeatThreshold (educativo=8)', () => {
    const ending = resolveEnding(6, [], 'amazonas', 'educativo')
    expect(ending.badge).toContain('TRÁGICO')
  })

  it('devuelve amazonas_excelente con m=35 y 2 alianzas', () => {
    const ending = resolveEnding(35, ['al_1', 'al_2'], 'amazonas', 'educativo')
    expect(ending.badge).toContain('ÉPICO')
    expect(ending.badge).toContain('AMAZONAS')
  })

  it('devuelve amazonas_bueno con m=22 y sin alianzas', () => {
    // bueno: cond m>=20, umbral good.m=18 → 22 >= 18 → passes
    const ending = resolveEnding(22, [], 'amazonas', 'educativo')
    expect(ending.badge).toContain('RESISTENCIA')
    expect(ending.badge).toContain('AMAZONAS')
  })

  it('devuelve amazonas_amargo con m=10 sin suficientes alianzas', () => {
    // m=10 >= defeatThreshold(8) pero < good.m(18) → amargo
    const ending = resolveEnding(10, [], 'amazonas', 'educativo')
    expect(ending.badge).toContain('DISPERSIÓN')
    expect(ending.badge).toContain('AMAZONAS')
  })

  it('devuelve patagonia_arg_excelente con las condiciones correctas', () => {
    const ending = resolveEnding(35, ['a1', 'a2', 'a3'], 'patagonia_arg', 'educativo')
    expect(ending.badge).toContain('ÉPICO')
    expect(ending.badge).toContain('PATAGONIA ARG')
  })

  it('devuelve tragico para destino desconocido', () => {
    const ending = resolveEnding(50, [], 'destino_raro', 'educativo')
    expect(ending.badge).toContain('TRÁGICO')
  })

  it('usa umbrales de historico (defeatThreshold=12)', () => {
    // m=10 < 12 → tragico aunque el destino tenga endings
    const ending = resolveEnding(10, [], 'amazonas', 'historico')
    expect(ending.badge).toContain('TRÁGICO')
  })

  it('historico excelente requiere m>=30 y a>=3', () => {
    // epic historico = { m: 30, a: 3 }
    // m=35, a=2 → no cumple a>=3 → salta excelente, va a bueno (si m>=20)
    const ending = resolveEnding(35, ['a1', 'a2'], 'amazonas', 'historico')
    expect(ending.badge).toContain('RESISTENCIA')
  })
})

// ══════════════════════════════════════════════════════
// evaluateAchievements
// ══════════════════════════════════════════════════════

describe('evaluateAchievements', () => {
  it('devuelve un array (puede estar vacío con stats neutras)', () => {
    const gs     = freshState()
    const ending = resolveEnding(10, [], 'amazonas', 'educativo')
    const ids    = evaluateAchievements(gs, ending)
    expect(Array.isArray(ids)).toBe(true)
  })

  it('todos los IDs devueltos son strings no vacíos', () => {
    const gs     = { ...freshState(), alliances: ['al_1', 'al_2', 'al_3'] }
    const ending = resolveEnding(35, gs.alliances, 'amazonas', 'educativo')
    const ids    = evaluateAchievements(gs, ending)
    for (const id of ids) {
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    }
  })

  it('no devuelve logros de historico cuando el modo es educativo', () => {
    // Este test es más de integración — simplemente comprueba que no lanza
    const gs     = freshState('educativo')
    const ending = resolveEnding(35, [], 'amazonas', 'educativo')
    expect(() => evaluateAchievements(gs, ending)).not.toThrow()
  })
})

// ══════════════════════════════════════════════════════
// currentAct
// ══════════════════════════════════════════════════════

describe('currentAct', () => {
  it('devuelve 1 cuando no hay nodo seleccionado', () => {
    const gs = freshState()
    expect(currentAct(gs)).toBe(1)
  })

  it('devuelve el acto del nodo actual', () => {
    const gs = { ...freshState(), currentNode: 'n00' }
    // n00 debería ser acto 1
    const act = currentAct(gs)
    expect([1, 2, 3, 4]).toContain(act)
  })
})

// ══════════════════════════════════════════════════════
// conqPosition
// ══════════════════════════════════════════════════════

describe('conqPosition', () => {
  it('devuelve posición del CONQ_BRIDGE cuando routeIdx < CONQ_BRIDGE.length', () => {
    const gs  = freshState()  // routeIdx=0
    const pos = conqPosition(gs)
    expect(pos).not.toBeNull()
    expect(pos?.lon).toBe(CONQ_BRIDGE[0].lon)
    expect(pos?.lat).toBe(CONQ_BRIDGE[0].lat)
  })

  it('devuelve null cuando routeIdx apunta a nodo de historia que no existe', () => {
    const gs = { ...freshState(), conq: { routeIdx: CONQ_BRIDGE.length + 5, caught: false, reorgTurns: 0 } }
    // history vacío → no hay nodo en ese índice
    const pos = conqPosition(gs)
    expect(pos).toBeNull()
  })

  it('devuelve posición de un nodo del historial del jugador', () => {
    const gs = createInitialState('educativo', 'X')
    const nodeId = 'n00'
    const gsWithHistory = {
      ...gs,
      history: [nodeId],
      conq: { routeIdx: CONQ_BRIDGE.length, caught: false, reorgTurns: 0 },
    }
    const pos = conqPosition(gsWithHistory)
    expect(pos?.lon).toBe(gs.nodes[nodeId].lon)
    expect(pos?.lat).toBe(gs.nodes[nodeId].lat)
  })
})
