import { describe, it, expect } from 'vitest'
import {
  clamp,
  totalM,
  createInitialState,
  cloneState,
  isFinalNode,
  unlockChildren,
  getAvailableNodes,
} from '../../core/GameState.js'
import type { Stats } from '../../data/types.js'

// ── Helpers ───────────────────────────────────────────

function makeStats(overrides: Partial<Stats> = {}): Stats {
  return {
    food:      50,
    moral:     50,
    salud:     50,
    union:     50,
    warriors:  20,
    shamans:   8,
    civilians: 22,
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════
// clamp
// ══════════════════════════════════════════════════════

describe('clamp', () => {
  it('devuelve el valor cuando está dentro del rango', () => {
    expect(clamp(50)).toBe(50)
    expect(clamp(0)).toBe(0)
    expect(clamp(100)).toBe(100)
  })

  it('clampea al mínimo cuando el valor es menor', () => {
    expect(clamp(-1)).toBe(0)
    expect(clamp(-999)).toBe(0)
  })

  it('clampea al máximo cuando el valor es mayor', () => {
    expect(clamp(101)).toBe(100)
    expect(clamp(999)).toBe(100)
  })

  it('respeta un rango personalizado', () => {
    expect(clamp(5,  10, 20)).toBe(10)
    expect(clamp(25, 10, 20)).toBe(20)
    expect(clamp(15, 10, 20)).toBe(15)
  })
})

// ══════════════════════════════════════════════════════
// totalM
// ══════════════════════════════════════════════════════

describe('totalM', () => {
  it('suma guerreros + chamanes + civiles', () => {
    expect(totalM(makeStats({ warriors: 20, shamans: 8, civilians: 22 }))).toBe(50)
  })

  it('funciona con ceros', () => {
    expect(totalM(makeStats({ warriors: 0, shamans: 0, civilians: 0 }))).toBe(0)
  })

  it('ignora los stats no-población', () => {
    expect(totalM(makeStats({ warriors: 1, shamans: 1, civilians: 1 }))).toBe(3)
  })
})

// ══════════════════════════════════════════════════════
// isFinalNode
// ══════════════════════════════════════════════════════

describe('isFinalNode', () => {
  it('reconoce los tres nodos finales', () => {
    expect(isFinalNode('n11a')).toBe(true)
    expect(isFinalNode('n11b')).toBe(true)
    expect(isFinalNode('n11c')).toBe(true)
  })

  it('devuelve false para nodos intermedios', () => {
    expect(isFinalNode('n00')).toBe(false)
    expect(isFinalNode('n05')).toBe(false)
    expect(isFinalNode('n10')).toBe(false)
  })
})

// ══════════════════════════════════════════════════════
// createInitialState
// ══════════════════════════════════════════════════════

describe('createInitialState', () => {
  it('construye un estado con stats iniciales de educativo', () => {
    const gs = createInitialState('educativo', 'Kaan')
    expect(gs.diff).toBe('educativo')
    expect(gs.caciqueName).toBe('Kaan')
    expect(gs.stats.food).toBe(50)
    expect(gs.stats.warriors).toBe(20)
    expect(gs.history).toEqual([])
    expect(gs.alliances).toEqual([])
    expect(gs.currentNode).toBeNull()
    expect(gs.finalTag).toBeNull()
  })

  it('construye un estado con stats iniciales de historico', () => {
    const gs = createInitialState('historico', 'Ixchel')
    expect(gs.stats.food).toBe(48)
    expect(gs.stats.moral).toBe(45)
  })

  it('solo desbloquea n00 al inicio', () => {
    const gs = createInitialState('educativo', 'X')
    expect(gs.nodes['n00'].unlocked).toBe(true)
    // Al menos un nodo que no sea n00 debe estar bloqueado
    const othersLocked = Object.entries(gs.nodes)
      .filter(([id]) => id !== 'n00')
      .every(([, n]) => !n.unlocked)
    expect(othersLocked).toBe(true)
  })

  it('asigna un eventId a cada nodo desde su pool', () => {
    const gs = createInitialState('educativo', 'X')
    for (const [id, node] of Object.entries(gs.nodes)) {
      expect(node.eventId, `nodo ${id} sin eventId`).toBeDefined()
      expect(node.eventPool.includes(node.eventId!), `nodo ${id}: eventId no está en pool`).toBe(true)
    }
  })

  it('inicializa el conquistador en routeIdx=0, caught=false', () => {
    const gs = createInitialState('educativo', 'X')
    expect(gs.conq.routeIdx).toBe(0)
    expect(gs.conq.caught).toBe(false)
    expect(gs.conq.reorgTurns).toBe(0)
  })
})

// ══════════════════════════════════════════════════════
// cloneState
// ══════════════════════════════════════════════════════

describe('cloneState', () => {
  it('produce un objeto distinto (no la misma referencia)', () => {
    const gs    = createInitialState('educativo', 'X')
    const clone = cloneState(gs)
    expect(clone).not.toBe(gs)
  })

  it('las stats son una copia independiente', () => {
    const gs    = createInitialState('educativo', 'X')
    const clone = cloneState(gs)
    clone.stats.food = 99
    expect(gs.stats.food).toBe(50)
  })

  it('el historial es una copia independiente', () => {
    const gs    = createInitialState('educativo', 'X')
    const clone = cloneState(gs)
    clone.history.push('n00')
    expect(gs.history).toHaveLength(0)
  })

  it('conq es una copia independiente', () => {
    const gs    = createInitialState('educativo', 'X')
    const clone = cloneState(gs)
    clone.conq.routeIdx = 5
    expect(gs.conq.routeIdx).toBe(0)
  })

  it('los nodos son copias independientes', () => {
    const gs    = createInitialState('educativo', 'X')
    const clone = cloneState(gs)
    clone.nodes['n00'].completed = true
    expect(gs.nodes['n00'].completed).toBe(false)
  })
})

// ══════════════════════════════════════════════════════
// unlockChildren
// ══════════════════════════════════════════════════════

describe('unlockChildren', () => {
  it('desbloquea los hijos inmediatos de un nodo', () => {
    const gs = createInitialState('educativo', 'X')
    const parent = gs.nodes['n00']
    expect(parent.next.length).toBeGreaterThan(0)

    const updated = unlockChildren(gs.nodes, 'n00')
    for (const childId of parent.next) {
      expect(updated[childId]?.unlocked, `hijo ${childId} no desbloqueado`).toBe(true)
      expect(updated[childId]?.unlockedFrom).toBe('n00')
    }
  })

  it('no modifica los nodos ya desbloqueados', () => {
    const gs = createInitialState('educativo', 'X')
    const updated = unlockChildren(gs.nodes, 'n00')
    // n00 mismo seguía desbloqueado
    expect(updated['n00'].unlocked).toBe(true)
  })

  it('no lanza error si el parentId no existe', () => {
    const gs = createInitialState('educativo', 'X')
    expect(() => unlockChildren(gs.nodes, 'nXXX')).not.toThrow()
  })
})

// ══════════════════════════════════════════════════════
// getAvailableNodes
// ══════════════════════════════════════════════════════

describe('getAvailableNodes', () => {
  it('devuelve solo n00 al inicio', () => {
    const gs = createInitialState('educativo', 'X')
    const avail = getAvailableNodes(gs)
    expect(avail).toHaveLength(1)
    expect(avail[0].id).toBe('n00')
  })

  it('no incluye nodos completados', () => {
    const gs = createInitialState('educativo', 'X')
    // Marcar n00 como completado manualmente
    const modified = {
      ...gs,
      nodes: { ...gs.nodes, n00: { ...gs.nodes['n00'], completed: true } },
    }
    const avail = getAvailableNodes(modified)
    expect(avail.every(n => n.id !== 'n00')).toBe(true)
  })
})
