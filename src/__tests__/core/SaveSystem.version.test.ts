import { describe, it, expect, beforeEach, vi } from 'vitest'

const _store: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => _store[k] ?? null,
  setItem:    (k: string, v: string) => { _store[k] = v },
  removeItem: (k: string) => { delete _store[k] },
})
import { saveGame, loadGame, migrarGuardado, takeSaveProblem, SAVE_KEY, SAVE_VERSION } from '../../core/SaveSystem.js'
import { createInitialState } from '../../core/GameState.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function sano(): Record<string, unknown> {
  saveGame(createInitialState('educativo', 'Balam'))
  return JSON.parse(_store[SAVE_KEY]!)
}

beforeEach(() => {
  for (const k of Object.keys(_store)) delete _store[k]
  takeSaveProblem()
})

describe('guardado versionado', () => {
  it('saveGame escribe la versión actual', () => {
    expect(sano().version).toBe(SAVE_VERSION)
  })

  it('un guardado del formato original (sin version) sigue cargando: no se pierde la partida de nadie', () => {
    const d = sano()
    delete d.version
    _store[SAVE_KEY] = JSON.stringify(d)
    expect(loadGame()?.caciqueName).toBe('Balam')
    expect(takeSaveProblem()).toBeNull()
  })

  it('la migración lo lleva a la versión actual y no toca lo demás', () => {
    const viejo = { diff: 'educativo', caciqueName: 'Balam', extra: 1 }
    const nuevo = migrarGuardado(viejo) as Record<string, unknown>
    expect(nuevo.version).toBe(SAVE_VERSION)
    expect(nuevo.caciqueName).toBe('Balam')
    expect(nuevo.extra).toBe(1)
  })

  it('una versión futura no se migra ni se pierde: se leen los campos que se conocen', () => {
    const d = sano()
    d.version = SAVE_VERSION + 5
    d.campoDelFuturo = { algo: true }
    _store[SAVE_KEY] = JSON.stringify(d)
    expect((migrarGuardado(d) as Record<string, unknown>).version).toBe(SAVE_VERSION + 5)
    expect(loadGame()?.caciqueName).toBe('Balam')
  })

  it('una versión que no es un entero válido se trata como el formato original', () => {
    for (const v of ['2', -1, 1.5, NaN, null, {}]) {
      const d = sano()
      d.version = v
      _store[SAVE_KEY] = JSON.stringify(d)
      expect(loadGame()?.caciqueName, `version=${String(v)}`).toBe('Balam')
    }
  })

  it('lo que no es un objeto pasa sin romper (lo rechaza sanitizeSave después)', () => {
    for (const x of [null, 5, 'texto', [1, 2]]) expect(() => migrarGuardado(x)).not.toThrow()
    _store[SAVE_KEY] = 'no-es-json'
    expect(loadGame()).toBeNull()
  })
})

describe('cableado', () => {
  /**
   * Hoy la única migración no cambia datos, así que ningún test de comportamiento nota si
   * loadGame deja de llamarla. El día que haya una migración de verdad, ese olvido pierde
   * partidas: se comprueba que la carga pasa SIEMPRE por migrarGuardado antes de sanitizar.
   */
  it('loadGame migra antes de sanitizar', () => {
    const fuente = readFileSync(fileURLToPath(new URL('../../core/SaveSystem.ts', import.meta.url)), 'utf8')
    expect(fuente).toMatch(/sanitizeSave\(migrarGuardado\(parsed\)\)/)
  })

  it('SAVE_VERSION tiene una migración por cada paso (0→1, 1→2, …)', () => {
    const fuente = readFileSync(fileURLToPath(new URL('../../core/SaveSystem.ts', import.meta.url)), 'utf8')
    const bloque = fuente.slice(fuente.indexOf('const MIGRACIONES'), fuente.indexOf('export function migrarGuardado'))
    const pasos = (bloque.match(/^\s{2}\(raw\) =>/gm) ?? []).length
    expect(pasos).toBe(SAVE_VERSION)
  })
})
