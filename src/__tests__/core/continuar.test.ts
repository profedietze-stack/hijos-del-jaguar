import { describe, it, expect, vi } from 'vitest'
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })
import { createInitialState } from '../../core/GameState'
import { applyDecision, selectNode } from '../../core/GameEngine'
import { sanitizeSave } from '../../core/SaveSystem'
import { EVENTS_DEF } from '../../data/events'

/** Regresión F3-01: «Continuar» reabría el último evento ya jugado, en bucle. */
describe('Continuar tras resolver un evento', () => {
  const jugar = () => {
    let gs = selectNode(createInitialState('educativo', 'T'), 'n00')
    const ev = EVENTS_DEF[gs.nodes['n00']!.eventId!]!
    gs = applyDecision(gs, ev.decisions[0]!).state
    return gs
  }

  it('applyDecision deja currentNode en null', () => {
    expect(jugar().currentNode).toBeNull()
  })

  it('un guardado con currentNode ya completado no reabre el evento', () => {
    const gs = jugar()
    const d = JSON.parse(JSON.stringify({ ...gs, pendingGame: null }))
    d.currentNode = 'n00'   // guardado «viejo» con el bug
    expect(sanitizeSave(d)!.currentNode).toBeNull()
  })

  it('un evento pendiente (nodo elegido, sin decidir) sí se conserva', () => {
    const gs = selectNode(createInitialState('educativo', 'T'), 'n00')
    const d = JSON.parse(JSON.stringify(gs))
    expect(sanitizeSave(d)!.currentNode).toBe('n00')
  })
})
