import { describe, it, expect, vi } from 'vitest'
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })
import { aliadoCanonico, normalizarAlianzas } from '../../core/alliances'
import { applyDecision, selectNode } from '../../core/GameEngine'
import { createInitialState } from '../../core/GameState'
import { sanitizeSave } from '../../core/SaveSystem'
import { EVENTS_DEF } from '../../data/events'

describe('una alianza es con un pueblo', () => {
  it('las variantes de un mismo pueblo cuentan una vez', () => {
    expect(normalizarAlianzas(['tehuelches', 'tehuelches_sur', 'tehuelches_laguna', 'kawesqar', 'kawesqar_nino', 'ranquel', 'ranqueles'])).toEqual(['tehuelches', 'kawesqar', 'ranqueles'])
  })
  it('pueblos distintos no se funden', () => {
    expect(aliadoCanonico('tobas_agua')).toBe('tobas_agua')   // el logro «Guardianes del Agua Oculta» lo pide así
    expect(aliadoCanonico('guaranies_ibera')).toBe('guaranies_ibera')
  })
  it('forjar dos variantes en la partida suma una alianza', () => {
    let gs = selectNode(createInitialState('educativo', 'T'), 'n00')
    gs = applyDecision(gs, { text: 'a', effects: {}, allianceKey: 'tehuelches_sur' }).state
    gs = { ...gs, currentNode: 'n00' }
    gs = applyDecision(gs, { text: 'b', effects: {}, allianceKey: 'tehuelches_laguna' }).state
    expect(gs.alliances).toEqual(['tehuelches'])
  })
  it('un guardado viejo con variantes se normaliza al cargar', () => {
    const d = JSON.parse(JSON.stringify(createInitialState('educativo', 'T')))
    d.alliances = ['kawesqar', 'kawesqar_canales']
    expect(sanitizeSave(d)!.alliances).toEqual(['kawesqar'])
  })
  it('ninguna familia de claves del juego queda con dos pueblos «iguales»', () => {
    const claves = [...new Set(Object.values(EVENTS_DEF).flatMap(e => e.decisions.flatMap(d => d.allianceKey ? [aliadoCanonico(d.allianceKey)] : [])))]
    const porBase: Record<string, string[]> = {}
    for (const k of claves) (porBase[k.split('_')[0]!] ??= []).push(k)
    const repetidas = Object.entries(porBase).filter(([b, v]) => v.length > 1 && !['tobas'].includes(b))
    expect(repetidas).toEqual([])
  })
})
