import type { DifficultyConfig } from './types.js'

export const DIFF_CONFIG: Record<string, DifficultyConfig> = {
  educativo: {
    label: 'Educativo',
    desc:  'Curva moderada. Los errores cuestan y se acumulan — hay que pensar.',
    initStats: { food: 50, moral: 50, salud: 55, union: 55, warriors: 20, shamans: 8, civilians: 22 },
    fxMult:    { pos: 0.80, neg: 0.85 },
    dimCutoff: 55,
    decay: {
      1: { food: -6,  salud: -3 },
      2: { food: -9,  salud: -5 },
      3: { food: -12, salud: -7 },
      4: { food: -8,  salud: -4 },
    },
    deathThreshold:      { food: 25, salud: 25 },
    deathProb:           { 1: 0.25, 2: 0.38, 3: 0.50, 4: 0.35 },
    lowUnionThreshold:   28,
    lowUnionMoralPenalty: -4,
    lowUnionDeathProb:   0.12,
    defeatThreshold:     8,
    endingThresholds: {
      epic: { m: 28, a: 2 },
      good: { m: 18 },
    },
  },

  historico: {
    label: 'Histórico',
    desc:  'La conquista fue brutal. Sin alianzas, sin recursos, no hay salida.',
    initStats: { food: 48, moral: 45, salud: 55, union: 55, warriors: 20, shamans: 8, civilians: 22 },
    fxMult:    { pos: 0.75, neg: 1.25 },
    dimCutoff: 55,
    decay: {
      1: { food: -6,  salud: -4 },
      2: { food: -10, salud: -6 },
      3: { food: -13, salud: -8 },
      4: { food: -9,  salud: -5 },
    },
    deathThreshold:      { food: 35, salud: 35 },
    deathProb:           { 1: 0.35, 2: 0.50, 3: 0.65, 4: 0.45 },
    lowUnionThreshold:   30,
    lowUnionMoralPenalty: -6,
    lowUnionDeathProb:   0.25,
    alliancePenaltyActFrom:  3,
    alliancePenaltyIfNone:   { food: -5, moral: -8 },
    defeatThreshold:     12,
    endingThresholds: {
      epic: { m: 30, a: 3 },
      good: { m: 20 },
    },
  },

  legendario: {
    label: 'Legendario',
    desc:  'Sin piedad. La historia no tuvo segunda oportunidad.',
    initStats: { food: 42, moral: 38, salud: 48, union: 45, warriors: 18, shamans: 6, civilians: 20 },
    fxMult:    { pos: 0.65, neg: 1.55 },
    dimCutoff: 60,
    decay: {
      1: { food: -8,  salud: -5  },
      2: { food: -12, salud: -8  },
      3: { food: -15, salud: -10 },
      4: { food: -11, salud: -7  },
    },
    deathThreshold:      { food: 42, salud: 40 },
    deathProb:           { 1: 0.45, 2: 0.60, 3: 0.75, 4: 0.55 },
    lowUnionThreshold:   35,
    lowUnionMoralPenalty: -9,
    lowUnionDeathProb:   0.35,
    alliancePenaltyActFrom:  2,
    alliancePenaltyIfNone:   { food: -8, moral: -12 },
    defeatThreshold:     15,
    endingThresholds: {
      epic: { m: 34, a: 4 },
      good: { m: 24 },
    },
  },
}
