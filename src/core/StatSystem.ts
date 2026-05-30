import type { Stats, DecisionEffect, Difficulty, ActNumber } from '../data/types.js'
import type { DifficultyConfig }                              from '../data/types.js'
import type { Notif }                                         from './GameState.js'
import { clamp, totalM }                                      from './GameState.js'
import { DIFF_CONFIG }                                        from '../data/difficultyConfig.js'

// ══════════════════════════════════════════════════════
// SISTEMA DE STATS
// Todas las funciones son puras: reciben estado, devuelven
// { stats, notifs } sin mutar nada.
// ══════════════════════════════════════════════════════

// ── 1. ESCALAR UN VALOR CON DIMINISHING RETURNS ───────

/**
 * Aplica los multiplicadores de dificultad a un valor de efecto.
 * Positivos: diminishing returns cuando stat > dimCutoff.
 * Negativos: protección parcial cuando stat < 20.
 */
function scaleValue(currentStat: number, val: number, cfg: DifficultyConfig): number {
  if (val === 0) return 0
  if (val > 0) {
    const factor =
      currentStat > cfg.dimCutoff
        ? 1 - (currentStat - cfg.dimCutoff) / 90
        : 1.0
    return Math.round(val * cfg.fxMult.pos * Math.max(0.35, factor))
  }
  // Negativo: amortiguación cuando el stat ya está muy bajo
  const floorProtect = currentStat < 20 ? 0.6 : 1.0
  return Math.round(val * cfg.fxMult.neg * floorProtect)
}

// ── 2. APLICAR EFECTOS DE UNA DECISIÓN ───────────────

export interface ApplyResult {
  stats:  Stats
  notifs: Notif[]
}

/**
 * Aplica los efectos de una decisión sobre las stats actuales.
 * Devuelve nuevas stats y notificaciones para mostrar.
 */
export function applyDecisionFX(
  stats:  Stats,
  fx:     DecisionEffect,
  diff:   Difficulty,
): ApplyResult {
  const cfg   = DIFF_CONFIG[diff]
  const s     = { ...stats }
  const notifs: Notif[] = []

  // ── Stats con diminishing returns (food, moral, salud, union)
  const scaled: Partial<Record<'food'|'moral'|'salud'|'union', number>> = {}

  if (fx.food  !== undefined) { scaled.food  = scaleValue(s.food,  fx.food,  cfg); s.food  = clamp(s.food  + scaled.food!) }
  if (fx.moral !== undefined) { scaled.moral = scaleValue(s.moral, fx.moral, cfg); s.moral = clamp(s.moral + scaled.moral!) }
  if (fx.salud !== undefined) { scaled.salud = scaleValue(s.salud, fx.salud, cfg); s.salud = clamp(s.salud + scaled.salud!) }
  if (fx.union !== undefined) { scaled.union = scaleValue(s.union, fx.union, cfg); s.union = clamp(s.union + scaled.union!) }

  // ── Unidades (sin diminishing returns)
  if (fx.warriors  !== undefined) s.warriors  = Math.max(0, s.warriors  + fx.warriors)
  if (fx.shamans   !== undefined) s.shamans   = Math.max(0, s.shamans   + fx.shamans)
  if (fx.civilians !== undefined) s.civilians = Math.max(0, s.civilians + fx.civilians)

  // ── Notificaciones por cambios de stat
  for (const key of ['food', 'moral', 'salud', 'union'] as const) {
    const v = scaled[key]
    if (v === undefined) continue
    const label = { food: 'alimentos', moral: 'moral', salud: 'salud', union: 'unión' }[key]
    if (v > 0) notifs.push({ msg: `+${v} ${label}`, kind: 'gain' })
    else if (v < 0) notifs.push({ msg: `${v} ${label}`, kind: 'loss' })
  }

  return { stats: s, notifs }
}

// ── 3. DECAY PASIVO POR ACTO ──────────────────────────

/**
 * Aplica el decay pasivo de food y salud correspondiente al acto actual.
 */
export function applyDecay(
  stats: Stats,
  act:   ActNumber,
  diff:  Difficulty,
): ApplyResult {
  const cfg   = DIFF_CONFIG[diff]
  const decay = cfg.decay[act] ?? cfg.decay[1]
  const s     = { ...stats }
  const notifs: Notif[] = []

  s.food  = clamp(s.food  + decay.food)
  s.salud = clamp(s.salud + decay.salud)

  if (decay.food  < 0) notifs.push({ msg: `${decay.food} alimentos (viaje)`,  kind: 'loss' })
  if (decay.salud < 0) notifs.push({ msg: `${decay.salud} salud (viaje)`,     kind: 'loss' })

  return { stats: s, notifs }
}

// ── 4. PENALIDAD POR FALTA DE ALIANZAS (histórico) ───

export function applyAlliancePenalty(
  stats:     Stats,
  act:       ActNumber,
  diff:      Difficulty,
  alliances: string[],
): ApplyResult {
  const cfg    = DIFF_CONFIG[diff]
  const notifs: Notif[] = []

  if (
    cfg.alliancePenaltyActFrom !== undefined &&
    act >= cfg.alliancePenaltyActFrom &&
    alliances.length === 0 &&
    cfg.alliancePenaltyIfNone !== undefined
  ) {
    const p = cfg.alliancePenaltyIfNone
    const s = {
      ...stats,
      food:  clamp(stats.food  + p.food),
      moral: clamp(stats.moral + p.moral),
    }
    notifs.push({ msg: 'Sin aliados: el camino se vuelve brutal', kind: 'loss' })
    return { stats: s, notifs }
  }

  return { stats, notifs }
}

// ── 5. MUERTES POR HAMBRE / ENFERMEDAD / DESUNIÓN ────

export interface DeathResult {
  stats:  Stats
  notifs: Notif[]
  died:   number   // total de bajas en este ciclo
}

/**
 * Calcula y aplica muertes probabilísticas basadas en stats bajas.
 * Encapsula toda la lógica de azar del ciclo de turno.
 */
export function rollDeaths(
  stats: Stats,
  act:   ActNumber,
  diff:  Difficulty,
): DeathResult {
  const cfg       = DIFF_CONFIG[diff]
  const deathProb = cfg.deathProb[act] ?? cfg.deathProb[1]
  const s         = { ...stats }
  const notifs: Notif[] = []
  let died = 0

  // — Hambre —
  if (s.food < cfg.deathThreshold.food && Math.random() < deathProb) {
    s.civilians = Math.max(0, s.civilians - 1)
    notifs.push({ msg: 'Hambre: un civil falleció', kind: 'loss' })
    died++
  }

  // — Enfermedad —
  if (s.salud < cfg.deathThreshold.salud && Math.random() < deathProb) {
    if (diff === 'historico' && act >= 2 && Math.random() < 0.45) {
      s.warriors = Math.max(0, s.warriors - 1)
      notifs.push({ msg: 'Enfermedad: un guerrero falleció', kind: 'loss' })
    } else {
      s.shamans = Math.max(0, s.shamans - 1)
      notifs.push({ msg: 'Enfermedad: un chamán falleció', kind: 'loss' })
    }
    died++
  }

  // — Desunión: penalidad de moral + posible deserción —
  if (s.union < cfg.lowUnionThreshold) {
    s.moral = clamp(s.moral + cfg.lowUnionMoralPenalty)
    if (cfg.lowUnionMoralPenalty < 0) {
      notifs.push({ msg: `División interna: ${cfg.lowUnionMoralPenalty} moral`, kind: 'loss' })
    }
    if (cfg.lowUnionDeathProb && Math.random() < cfg.lowUnionDeathProb) {
      s.civilians = Math.max(0, s.civilians - 1)
      notifs.push({ msg: 'Deserción: un civil abandonó el grupo', kind: 'loss' })
      died++
    }
  }

  // — Desesperación (histórico, moral baja en Actos avanzados) —
  if (diff === 'historico' && s.moral < 20 && act >= 2 && Math.random() < 0.35) {
    s.civilians = Math.max(0, s.civilians - 1)
    notifs.push({ msg: 'Desesperación: un civil desertó', kind: 'loss' })
    died++
  }

  if (died > 0) {
    notifs.push({ msg: `💀 ${died} miembro${died > 1 ? 's' : ''} perdido${died > 1 ? 's' : ''}`, kind: 'loss' })
  }

  return { stats: s, notifs, died }
}

// ── 6. COMBINAR RESULTADOS EN SECUENCIA ──────────────

/**
 * Ejecuta el ciclo completo de un turno:
 * decisión → decay → penalidad alianzas → muertes
 */
export function resolveTurn(
  stats:     Stats,
  fx:        DecisionEffect,
  act:       ActNumber,
  diff:      Difficulty,
  alliances: string[],
): { stats: Stats; notifs: Notif[]; died: number } {
  const notifs: Notif[] = []
  let s = stats

  // 1. Efectos de decisión
  const r1 = applyDecisionFX(s, fx, diff)
  s = r1.stats
  notifs.push(...r1.notifs)

  // 2. Decay pasivo
  const r2 = applyDecay(s, act, diff)
  s = r2.stats
  notifs.push(...r2.notifs)

  // 3. Penalidad alianzas
  const r3 = applyAlliancePenalty(s, act, diff, alliances)
  s = r3.stats
  notifs.push(...r3.notifs)

  // 4. Muertes
  const r4 = rollDeaths(s, act, diff)
  s = r4.stats
  notifs.push(...r4.notifs)

  return { stats: s, notifs, died: r4.died }
}

// ── 7. COMPROBAR DERROTA ──────────────────────────────

/**
 * true si el grupo está en condición de derrota
 * (supervivientes < defeatThreshold)
 */
export function isDefeated(stats: Stats, diff: Difficulty): boolean {
  const cfg = DIFF_CONFIG[diff]
  return totalM(stats) < cfg.defeatThreshold
}
