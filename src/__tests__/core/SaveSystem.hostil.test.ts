import { describe, it, expect, beforeEach, vi } from 'vitest'

const _store: Record<string, string> = {}
let _bloqueado = false
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => { if (_bloqueado) throw new Error('SecurityError'); return _store[k] ?? null },
  setItem:    (k: string, v: string) => { if (_bloqueado) throw new Error('SecurityError'); _store[k] = v },
  removeItem: (k: string) => { if (_bloqueado) throw new Error('SecurityError'); delete _store[k] },
})
import {
  saveGame, loadGame, hasSavedGame, loadHistory, loadUnlockedAchievements, unlockAchievements,
  takeSaveProblem, SAVE_KEY, HISTORY_KEY, LOGROS_KEY,
} from '../../core/SaveSystem.js'
import { createInitialState } from '../../core/GameState.js'

/** Guardado sano como objeto plano, al que cada test le rompe UN campo. */
function sano(): Record<string, unknown> {
  saveGame(createInitialState('educativo', 'Balam'))
  return JSON.parse(_store[SAVE_KEY]!)
}
function cargarCon(mut: (d: Record<string, unknown>) => void) {
  const d = sano()
  mut(d)
  _store[SAVE_KEY] = JSON.stringify(d)
  return loadGame()
}

beforeEach(() => {
  for (const k of Object.keys(_store)) delete _store[k]
  _bloqueado = false
  takeSaveProblem()
})

describe('guardado leído campo por campo', () => {
  it('un guardado sano carga', () => {
    expect(cargarCon(() => {})?.caciqueName).toBe('Balam')
  })

  const roto: [string, (d: Record<string, unknown>) => void][] = [
    ['history como número', d => { d.history = 5 }],
    ['history como objeto', d => { d.history = { a: 1 } }],
    ['alliances como objeto', d => { d.alliances = { x: 1 } }],
    ['nodes como string', d => { d.nodes = 'hola' }],
    ['stats como número', d => { d.stats = 7 }],
    ['diff inexistente', d => { d.diff = 'imposible' }],
    ['guardado que no es objeto', d => { for (const k of Object.keys(d)) delete d[k]; (d as unknown as { x: number }).x = 1 }],
  ]
  for (const [nombre, mut] of roto) {
    it(`${nombre}: no tira y no deja un estado a medias`, () => {
      const gs = cargarCon(mut)
      // o se descarta (null + aviso) o se recupera un estado jugable; nunca una excepción
      if (gs === null) {
        expect(takeSaveProblem()).toMatch(/guardada/)
        expect(hasSavedGame()).toBe(false)
      } else {
        expect(Array.isArray(gs.history)).toBe(true)
        expect(Array.isArray(gs.alliances)).toBe(true)
      }
    })
  }

  it('stats con campos NaN, negativos, strings o excedidos se normalizan', () => {
    const gs = cargarCon(d => {
      d.stats = { food: 'mucha', moral: -50, salud: 9999, union: null, warriors: 'x', shamans: -3, civilians: NaN }
    })!
    for (const v of Object.values(gs.stats)) expect(Number.isFinite(v)).toBe(true)
    expect(gs.stats.moral).toBe(0)
    expect(gs.stats.salud).toBe(100)
    expect(gs.stats.shamans).toBe(0)
  })

  it('currentNode inexistente cae a null', () => {
    expect(cargarCon(d => { d.currentNode = 'n_que_no_existe' })!.currentNode).toBeNull()
  })

  it('nodos desconocidos del guardado no se cuelan y los 61 siempre existen', () => {
    const gs = cargarCon(d => { (d.nodes as Record<string, unknown>)['zzz'] = { id: 'zzz' } })!
    expect(gs.nodes['zzz']).toBeUndefined()
    expect(Object.keys(gs.nodes)).toHaveLength(61)
  })

  it('un eventId que no es del pool se reemplaza', () => {
    const gs = cargarCon(d => { (d.nodes as Record<string, { eventId?: string }>)['n00']!.eventId = 'evento_falso' })!
    expect(gs.nodes['n00']!.eventPool).toContain(gs.nodes['n00']!.eventId)
  })
})

describe('historial y logros corruptos', () => {
  it('loadHistory siempre devuelve un array', () => {
    for (const malo of ['null', '{}', '123', '"x"', '{"a":1}', 'no es json']) {
      _store[HISTORY_KEY] = malo
      expect(Array.isArray(loadHistory())).toBe(true)
    }
  })
  it('loadUnlockedAchievements siempre devuelve un array de strings', () => {
    for (const malo of ['null', '{}', '123', '"abc"', '[1,2]', 'no es json']) {
      _store[LOGROS_KEY] = malo
      expect(loadUnlockedAchievements().every(x => typeof x === 'string')).toBe(true)
    }
  })
  it('unlockAchievements no tira con logros corruptos (antes dejaba trabada la pantalla final)', () => {
    _store[LOGROS_KEY] = '{}'
    expect(() => unlockAchievements(['a'])).not.toThrow()
    _store[LOGROS_KEY] = '123'
    expect(unlockAchievements(['a'])).toEqual(['a'])
  })
})

describe('localStorage bloqueado', () => {
  it('hasSavedGame, loadGame y los loaders no tiran', () => {
    _bloqueado = true
    expect(() => hasSavedGame()).not.toThrow()
    expect(loadGame()).toBeNull()
    expect(loadHistory()).toEqual([])
    expect(loadUnlockedAchievements()).toEqual([])
  })
})
