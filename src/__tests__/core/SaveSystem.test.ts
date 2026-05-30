import { describe, it, expect, beforeEach, vi } from 'vitest'

// ── Mock localStorage para entorno Node ───────────────
// Vitest corre en node; localStorage no existe de forma nativa.
// Usamos un objeto en memoria con la misma interfaz.
const _store: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => _store[k] ?? null,
  setItem:    (k: string, v: string) => { _store[k] = v },
  removeItem: (k: string) => { delete _store[k] },
  clear:      () => { for (const k in _store) delete _store[k] },
  get length() { return Object.keys(_store).length },
  key:        (i: number) => Object.keys(_store)[i] ?? null,
})
import {
  saveGame,
  loadGame,
  hasSavedGame,
  clearSavedGame,
  loadHistory,
  pushToHistory,
  loadUnlockedAchievements,
  saveUnlockedAchievements,
  unlockAchievements,
  SAVE_KEY,
  HISTORY_KEY,
  LOGROS_KEY,
} from '../../core/SaveSystem.js'
import { createInitialState } from '../../core/GameState.js'
import type { FinishedGame } from '../../core/GameState.js'

// ── Helpers ───────────────────────────────────────────

function makeFinishedGame(overrides: Partial<FinishedGame> = {}): FinishedGame {
  return {
    diff:         'educativo',
    caciqueName:  'Kaan',
    endTitle:     'Test',
    endBadge:     'TEST',
    endGlyph:     '🌿',
    endNarr:      'Narración de prueba',
    endRefl:      'Reflexión de prueba',
    m:            35,
    alliances:    ['al_1'],
    visitedCount: 5,
    date:         Date.now(),
    durationMs:   60000,
    conqCaught:   false,
    conqRouteIdx: 4,
    ...overrides,
  }
}

// ── Setup: limpiar localStorage antes de cada test ────

beforeEach(() => {
  localStorage.clear()
})

// ══════════════════════════════════════════════════════
// saveGame / loadGame
// ══════════════════════════════════════════════════════

describe('saveGame + loadGame', () => {
  it('roundtrip: guarda y carga el estado correctamente', () => {
    const gs = createInitialState('educativo', 'Kaan')
    saveGame(gs)
    const loaded = loadGame()
    expect(loaded).not.toBeNull()
    expect(loaded?.diff).toBe('educativo')
    expect(loaded?.caciqueName).toBe('Kaan')
    expect(loaded?.stats.food).toBe(gs.stats.food)
    expect(loaded?.stats.warriors).toBe(gs.stats.warriors)
  })

  it('preserva el historial y alianzas', () => {
    const gs = {
      ...createInitialState('educativo', 'Kaan'),
      history:   ['n00', 'n01'],
      alliances: ['al_test'],
    }
    saveGame(gs)
    const loaded = loadGame()
    expect(loaded?.history).toEqual(['n00', 'n01'])
    expect(loaded?.alliances).toContain('al_test')
  })

  it('preserva el estado del conquistador', () => {
    const gs = {
      ...createInitialState('educativo', 'Kaan'),
      conq: { routeIdx: 5, caught: false, reorgTurns: 1 },
    }
    saveGame(gs)
    const loaded = loadGame()
    expect(loaded?.conq.routeIdx).toBe(5)
    expect(loaded?.conq.reorgTurns).toBe(1)
  })

  it('devuelve null si no hay save', () => {
    expect(loadGame()).toBeNull()
  })

  it('devuelve null y limpia el key para JSON corrupto', () => {
    localStorage.setItem(SAVE_KEY, 'NO_ES_JSON{{{')
    const loaded = loadGame()
    expect(loaded).toBeNull()
    expect(localStorage.getItem(SAVE_KEY)).toBeNull()
  })

  it('devuelve null y limpia si los datos son inválidos (sin nodes)', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ diff: 'educativo' }))
    const loaded = loadGame()
    expect(loaded).toBeNull()
    expect(localStorage.getItem(SAVE_KEY)).toBeNull()
  })

  it('compatibilidad hacia atrás: construye conq si no está en el save', () => {
    // Save antiguo sin campo conq
    const gs       = createInitialState('educativo', 'Kaan')
    const payload  = {
      diff:        gs.diff,
      caciqueName: gs.caciqueName,
      stats:       gs.stats,
      nodes:       gs.nodes,
      history:     ['n00', 'n01', 'n02'],
      alliances:   [],
      currentNode: null,
      finalTag:    null,
      // sin campo conq
      startTime:   gs.startTime,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    const loaded = loadGame()
    expect(loaded).not.toBeNull()
    expect(loaded?.conq).toBeDefined()
    expect(typeof loaded?.conq.routeIdx).toBe('number')
    expect(loaded?.conq.caught).toBe(false)
  })
})

// ══════════════════════════════════════════════════════
// hasSavedGame / clearSavedGame
// ══════════════════════════════════════════════════════

describe('hasSavedGame', () => {
  it('devuelve false cuando no hay save', () => {
    expect(hasSavedGame()).toBe(false)
  })

  it('devuelve true después de guardar', () => {
    saveGame(createInitialState('educativo', 'X'))
    expect(hasSavedGame()).toBe(true)
  })
})

describe('clearSavedGame', () => {
  it('elimina el save del localStorage', () => {
    saveGame(createInitialState('educativo', 'X'))
    clearSavedGame()
    expect(hasSavedGame()).toBe(false)
    expect(loadGame()).toBeNull()
  })
})

// ══════════════════════════════════════════════════════
// pushToHistory / loadHistory
// ══════════════════════════════════════════════════════

describe('loadHistory', () => {
  it('devuelve array vacío cuando no hay historial', () => {
    expect(loadHistory()).toEqual([])
  })

  it('devuelve array vacío si el JSON está corrupto', () => {
    localStorage.setItem(HISTORY_KEY, 'CORRUPTOOO')
    expect(loadHistory()).toEqual([])
  })
})

describe('pushToHistory', () => {
  it('agrega una partida al historial', () => {
    const game = makeFinishedGame()
    pushToHistory(game)
    const h = loadHistory()
    expect(h).toHaveLength(1)
    expect(h[0].caciqueName).toBe('Kaan')
  })

  it('inserta la más reciente al inicio', () => {
    pushToHistory(makeFinishedGame({ caciqueName: 'Primera' }))
    pushToHistory(makeFinishedGame({ caciqueName: 'Segunda' }))
    const h = loadHistory()
    expect(h[0].caciqueName).toBe('Segunda')
    expect(h[1].caciqueName).toBe('Primera')
  })

  it('no supera las 20 entradas', () => {
    for (let i = 0; i < 25; i++) {
      pushToHistory(makeFinishedGame({ caciqueName: `Cacique${i}` }))
    }
    const h = loadHistory()
    expect(h).toHaveLength(20)
  })

  it('la entrada más reciente queda en [0] incluso al llegar a 20', () => {
    for (let i = 0; i < 25; i++) {
      pushToHistory(makeFinishedGame({ caciqueName: `Cacique${i}` }))
    }
    const h = loadHistory()
    expect(h[0].caciqueName).toBe('Cacique24')
  })

  it('preserva campos opcionales conqCaught y conqRouteIdx', () => {
    pushToHistory(makeFinishedGame({ conqCaught: true, conqRouteIdx: 7 }))
    const h = loadHistory()
    expect(h[0].conqCaught).toBe(true)
    expect(h[0].conqRouteIdx).toBe(7)
  })

  it('no falla con conqCaught/conqRouteIdx ausentes (backward compat)', () => {
    const oldGame = makeFinishedGame()
    delete (oldGame as any).conqCaught
    delete (oldGame as any).conqRouteIdx
    expect(() => pushToHistory(oldGame)).not.toThrow()
    const h = loadHistory()
    expect(h[0].conqCaught).toBeUndefined()
  })
})

// ══════════════════════════════════════════════════════
// unlockAchievements / loadUnlockedAchievements
// ══════════════════════════════════════════════════════

describe('loadUnlockedAchievements', () => {
  it('devuelve array vacío cuando no hay logros', () => {
    expect(loadUnlockedAchievements()).toEqual([])
  })

  it('devuelve array vacío si JSON está corrupto', () => {
    localStorage.setItem(LOGROS_KEY, '{{{')
    expect(loadUnlockedAchievements()).toEqual([])
  })
})

describe('saveUnlockedAchievements + loadUnlockedAchievements', () => {
  it('roundtrip: guarda y carga IDs correctamente', () => {
    saveUnlockedAchievements(['logro_1', 'logro_2'])
    expect(loadUnlockedAchievements()).toEqual(['logro_1', 'logro_2'])
  })
})

describe('unlockAchievements', () => {
  it('devuelve solo los IDs genuinamente nuevos', () => {
    saveUnlockedAchievements(['logro_1'])
    const fresh = unlockAchievements(['logro_1', 'logro_2', 'logro_3'])
    expect(fresh).toEqual(['logro_2', 'logro_3'])
  })

  it('no duplica logros ya existentes en el almacenamiento', () => {
    saveUnlockedAchievements(['logro_1'])
    unlockAchievements(['logro_1', 'logro_2'])
    const all = loadUnlockedAchievements()
    expect(all.filter(id => id === 'logro_1')).toHaveLength(1)
    expect(all).toContain('logro_2')
  })

  it('devuelve array vacío si todos los IDs ya estaban desbloqueados', () => {
    saveUnlockedAchievements(['logro_1', 'logro_2'])
    const fresh = unlockAchievements(['logro_1', 'logro_2'])
    expect(fresh).toEqual([])
  })

  it('devuelve array vacío si se pasa lista vacía', () => {
    const fresh = unlockAchievements([])
    expect(fresh).toEqual([])
  })

  it('funciona desde cero (sin logros previos)', () => {
    const fresh = unlockAchievements(['logro_1'])
    expect(fresh).toEqual(['logro_1'])
    expect(loadUnlockedAchievements()).toContain('logro_1')
  })
})
