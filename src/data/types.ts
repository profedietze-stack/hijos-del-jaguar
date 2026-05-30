// ══════════════════════════════════════════════════════
// TIPOS BASE DEL JUEGO
// ══════════════════════════════════════════════════════

export type Difficulty = 'educativo' | 'historico' | 'legendario'

export type ActNumber = 1 | 2 | 3 | 4

export interface Stats {
  food:      number
  moral:     number
  salud:     number
  union:     number
  warriors:  number
  shamans:   number
  civilians: number
}

export interface DecisionEffect {
  food?:      number
  moral?:     number
  salud?:     number
  union?:     number
  warriors?:  number
  shamans?:   number
  civilians?: number
}

export interface Decision {
  text:        string
  effects:     DecisionEffect
  hint?:       string
  allianceKey?: string
  finalTag?:   string
}

export interface GameEvent {
  title:     string
  act:       string
  img:       string
  cap:       string
  narr:      string
  decisions: Decision[]
  danger?:   boolean
}

export interface NodeDef {
  id:         string
  name:       string
  lon:        number
  lat:        number
  act:        ActNumber
  icon:       string
  desc:       string
  eventPool:  string[]
  next:       string[]
}

export interface NodeState extends NodeDef {
  completed:    boolean
  unlocked:     boolean
  eventId?:     string
  unlockedFrom?: string
}

export interface ConqState {
  routeIdx:   number
  caught:     boolean
  reorgTurns: number
}

export interface AchievementDef {
  id:     string
  modos:  Difficulty[]
  icon:   string
  nombre: string
  desc:   string
  cond:   (data: AchievementCheckData) => boolean
}

export interface AchievementCheckData {
  diff:        Difficulty
  m:           number
  alliances:   string[]
  visitedCount: number
  stats:       Stats
  end?:        { badge?: string }
  conquCaught?: boolean
}

export interface EndingDef {
  glyph: string
  badge: string
  title: string
  narr:  string
  refl:  string
  dest:  string
  cond:  (m: number, alliances: string[]) => boolean
}

export interface HistoricalMarker {
  lon:   number
  lat:   number
  act:   ActNumber
  icon:  string
  label: string
  tip:   string
}

export interface DifficultyConfig {
  label:    string
  desc:     string
  initStats: Stats
  fxMult:   { pos: number; neg: number }
  dimCutoff: number
  decay:    Record<number, { food: number; salud: number }>
  deathThreshold:   { food: number; salud: number }
  deathProb:        Record<number, number>
  lowUnionThreshold:   number
  lowUnionMoralPenalty: number
  lowUnionDeathProb:    number
  alliancePenaltyActFrom?:  number
  alliancePenaltyIfNone?:   { food: number; moral: number }
  defeatThreshold:  number
  endingThresholds: {
    epic:  { m: number; a: number }
    good:  { m: number }
  }
}
