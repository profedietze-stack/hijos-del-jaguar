import { describe, it, expect, vi } from 'vitest'
import {
  applyDecisionFX,
  applyDecay,
  applyAlliancePenalty,
  isDefeated,
  rollDeaths,
  resolveTurn,
} from '../../core/StatSystem.js'
import type { Stats } from '../../data/types.js'

// ── Helpers ───────────────────────────────────────────

function makeStats(overrides: Partial<Stats> = {}): Stats {
  return {
    food:      50,
    moral:     50,
    salud:     55,
    union:     55,
    warriors:  20,
    shamans:   8,
    civilians: 22,
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════
// applyDecisionFX
// ══════════════════════════════════════════════════════

describe('applyDecisionFX', () => {
  // educativo: fxMult = { pos: 0.80, neg: 0.85 }, dimCutoff = 55

  it('aplica efecto positivo sin diminishing cuando stat <= dimCutoff', () => {
    // stat=30, val=+10, pos factor = 1.0 (30 <= 55)
    // scaled = Math.round(10 * 0.80 * 1.0) = 8
    const s = makeStats({ food: 30 })
    const { stats, notifs } = applyDecisionFX(s, { food: 10 }, 'educativo')
    expect(stats.food).toBe(38)
    expect(notifs.find(n => n.kind === 'gain')).toBeTruthy()
  })

  it('aplica diminishing returns cuando stat > dimCutoff', () => {
    // stat=85, val=+10, dimCutoff=55
    // factor = 1 - (85 - 55) / 90 = 1 - 0.333 = 0.667
    // scaled = Math.round(10 * 0.80 * max(0.35, 0.667)) = Math.round(10 * 0.80 * 0.667) = Math.round(5.333) = 5
    const s = makeStats({ food: 85 })
    const { stats } = applyDecisionFX(s, { food: 10 }, 'educativo')
    expect(stats.food).toBe(90)
  })

  it('aplica efecto negativo con factor estándar (stat >= 20)', () => {
    // stat=50, val=-10, neg mult = 0.85, floorProtect=1.0
    // scaled = Math.round(-10 * 0.85 * 1.0) = -9  (but JS: Math.round(-8.5) = -8)
    // Actually: Math.round(-10 * 0.85) = Math.round(-8.5) = -8 (JS rounds half to +∞)
    const s = makeStats({ food: 50 })
    const { stats } = applyDecisionFX(s, { food: -10 }, 'educativo')
    expect(stats.food).toBe(42)  // 50 + Math.round(-10 * 0.85) = 50 + (-9) = 41 ... let's verify
    // Math.round(-8.5) in JS = -8  →  50 + (-8) = 42
  })

  it('aplica floorProtect cuando stat < 20', () => {
    // stat=10, val=-10, neg mult=0.85, floorProtect=0.6
    // scaled = Math.round(-10 * 0.85 * 0.6) = Math.round(-5.1) = -5
    const s = makeStats({ food: 10 })
    const { stats } = applyDecisionFX(s, { food: -10 }, 'educativo')
    expect(stats.food).toBe(5)
  })

  it('clampea stats a [0, 100]', () => {
    const s = makeStats({ food: 98 })
    const { stats } = applyDecisionFX(s, { food: 50 }, 'educativo')
    expect(stats.food).toBe(100)
  })

  it('aplica efectos de unidades directamente (sin escala)', () => {
    const s = makeStats({ warriors: 20, civilians: 22 })
    const { stats } = applyDecisionFX(s, { warriors: -3, civilians: 2 }, 'educativo')
    expect(stats.warriors).toBe(17)
    expect(stats.civilians).toBe(24)
  })

  it('no reduce unidades por debajo de 0', () => {
    const s = makeStats({ warriors: 1 })
    const { stats } = applyDecisionFX(s, { warriors: -10 }, 'educativo')
    expect(stats.warriors).toBe(0)
  })

  it('genera notificaciones de loss para valores negativos', () => {
    const s = makeStats({ moral: 50 })
    const { notifs } = applyDecisionFX(s, { moral: -10 }, 'educativo')
    expect(notifs.find(n => n.kind === 'loss')).toBeTruthy()
  })

  it('no genera notificación si el efecto es 0', () => {
    const s = makeStats()
    const { notifs } = applyDecisionFX(s, { food: 0 }, 'educativo')
    expect(notifs).toHaveLength(0)
  })

  it('usa multiplicadores de historico (fxMult.neg = 1.25)', () => {
    // stat=50, val=-10, neg mult=1.25, floorProtect=1.0
    // scaled = Math.round(-10 * 1.25 * 1.0) = Math.round(-12.5) = -12  (JS rounds half toward +∞)
    // 50 + (-12) = 38
    const s = makeStats({ food: 50 })
    const { stats } = applyDecisionFX(s, { food: -10 }, 'historico')
    expect(stats.food).toBe(38)
  })
})

// ══════════════════════════════════════════════════════
// applyDecay
// ══════════════════════════════════════════════════════

describe('applyDecay', () => {
  it('aplica decay de acto 1 en educativo: food -6, salud -3', () => {
    const s = makeStats({ food: 50, salud: 55 })
    const { stats, notifs } = applyDecay(s, 1, 'educativo')
    expect(stats.food).toBe(44)
    expect(stats.salud).toBe(52)
    expect(notifs.filter(n => n.kind === 'loss')).toHaveLength(2)
  })

  it('aplica decay de acto 2 en educativo: food -9, salud -5', () => {
    const s = makeStats({ food: 50, salud: 55 })
    const { stats } = applyDecay(s, 2, 'educativo')
    expect(stats.food).toBe(41)
    expect(stats.salud).toBe(50)
  })

  it('aplica decay de acto 3 en educativo: food -12, salud -7', () => {
    const s = makeStats({ food: 50, salud: 55 })
    const { stats } = applyDecay(s, 3, 'educativo')
    expect(stats.food).toBe(38)
    expect(stats.salud).toBe(48)
  })

  it('clampea food a 0 si el decay supera el valor actual', () => {
    const s = makeStats({ food: 3 })
    const { stats } = applyDecay(s, 1, 'educativo')
    expect(stats.food).toBe(0)
  })

  it('aplica decay de historico acto 2: food -10, salud -6', () => {
    const s = makeStats({ food: 50, salud: 55 })
    const { stats } = applyDecay(s, 2, 'historico')
    expect(stats.food).toBe(40)
    expect(stats.salud).toBe(49)
  })
})

// ══════════════════════════════════════════════════════
// applyAlliancePenalty
// ══════════════════════════════════════════════════════

describe('applyAlliancePenalty', () => {
  it('no aplica penalidad en acto 1 (incluso sin alianzas) en historico', () => {
    const s = makeStats({ food: 50, moral: 50 })
    const { stats, notifs } = applyAlliancePenalty(s, 1, 'historico', [])
    expect(stats.food).toBe(50)
    expect(notifs).toHaveLength(0)
  })

  it('aplica penalidad en acto 3 sin alianzas en historico', () => {
    // penalty: { food: -5, moral: -8 }
    const s = makeStats({ food: 50, moral: 50 })
    const { stats, notifs } = applyAlliancePenalty(s, 3, 'historico', [])
    expect(stats.food).toBe(45)
    expect(stats.moral).toBe(42)
    expect(notifs).toHaveLength(1)
    expect(notifs[0].kind).toBe('loss')
  })

  it('no aplica penalidad si hay alianzas', () => {
    const s = makeStats({ food: 50, moral: 50 })
    const { stats } = applyAlliancePenalty(s, 3, 'historico', ['alianza_1'])
    expect(stats.food).toBe(50)
    expect(stats.moral).toBe(50)
  })

  it('no aplica penalidad en modo educativo (sin alliancePenaltyActFrom)', () => {
    const s = makeStats({ food: 50, moral: 50 })
    const { stats, notifs } = applyAlliancePenalty(s, 3, 'educativo', [])
    expect(stats.food).toBe(50)
    expect(notifs).toHaveLength(0)
  })
})

// ══════════════════════════════════════════════════════
// isDefeated
// ══════════════════════════════════════════════════════

describe('isDefeated', () => {
  it('devuelve false cuando hay suficientes supervivientes (educativo, umbral=8)', () => {
    // warriors=5, shamans=2, civilians=3 → total=10 > 8
    const s = makeStats({ warriors: 5, shamans: 2, civilians: 3 })
    expect(isDefeated(s, 'educativo')).toBe(false)
  })

  it('devuelve true cuando supervivientes < umbral educativo (8)', () => {
    // total = 1 + 1 + 1 = 3 < 8
    const s = makeStats({ warriors: 1, shamans: 1, civilians: 1 })
    expect(isDefeated(s, 'educativo')).toBe(true)
  })

  it('devuelve true cuando supervivientes < umbral historico (12)', () => {
    // total = 3 + 3 + 3 = 9 < 12
    const s = makeStats({ warriors: 3, shamans: 3, civilians: 3 })
    expect(isDefeated(s, 'historico')).toBe(true)
  })

  it('devuelve false en historico cuando total >= 12', () => {
    const s = makeStats({ warriors: 5, shamans: 4, civilians: 3 })
    expect(isDefeated(s, 'historico')).toBe(false)
  })
})

// ══════════════════════════════════════════════════════
// rollDeaths — mock Math.random
// ══════════════════════════════════════════════════════

describe('rollDeaths', () => {
  it('no mata a nadie cuando los stats están bien y random siempre es alto', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const s = makeStats({ food: 60, salud: 60, union: 60 })
    const { died, notifs } = rollDeaths(s, 1, 'educativo')
    expect(died).toBe(0)
    expect(notifs).toHaveLength(0)
    vi.restoreAllMocks()
  })

  it('mata un civil por hambre cuando food < umbral y random es bajo', () => {
    // deathThreshold.food = 25, deathProb[1] = 0.25
    // food=20 < 25, random=0.10 < 0.25 → muerte por hambre
    vi.spyOn(Math, 'random').mockReturnValue(0.10)
    const s = makeStats({ food: 20, salud: 60, union: 60 })
    const { stats, died } = rollDeaths(s, 1, 'educativo')
    expect(died).toBeGreaterThanOrEqual(1)
    expect(stats.civilians).toBeLessThan(22)
    vi.restoreAllMocks()
  })

  it('no mata por hambre cuando food >= umbral', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.10)
    // food=30 > threshold=25 → no muerte por hambre
    const s = makeStats({ food: 30, salud: 60, union: 60 })
    const before = s.civilians
    // solo puede morir por salud si salud < 25, pero salud=60
    const { stats } = rollDeaths(s, 1, 'educativo')
    expect(stats.civilians).toBe(before)
    vi.restoreAllMocks()
  })

  it('aplica penalidad de moral cuando union está por debajo del umbral', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // no desertion
    // lowUnionThreshold=28, lowUnionMoralPenalty=-4
    const s = makeStats({ food: 60, salud: 60, union: 20 })
    const { stats } = rollDeaths(s, 1, 'educativo')
    expect(stats.moral).toBe(46) // 50 - 4
    vi.restoreAllMocks()
  })
})

// ══════════════════════════════════════════════════════
// resolveTurn — integración de los 4 pasos
// ══════════════════════════════════════════════════════

describe('resolveTurn', () => {
  it('ejecuta decisión → decay → alianzas → muertes y devuelve stats + notifs + died', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // evitar muertes aleatorias
    const s   = makeStats()
    const fx  = { food: 10 }          // +food
    const res = resolveTurn(s, fx, 1, 'educativo', [])

    // food: +8 (scaled) luego -6 (decay) = 52
    expect(res.stats.food).toBe(52)
    expect(res.notifs.length).toBeGreaterThan(0)
    expect(typeof res.died).toBe('number')
    vi.restoreAllMocks()
  })

  it('devuelve died=0 cuando los stats están todos bien', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const s   = makeStats({ food: 80, salud: 80, union: 80 })
    const res = resolveTurn(s, {}, 1, 'educativo', [])
    expect(res.died).toBe(0)
    vi.restoreAllMocks()
  })
})
