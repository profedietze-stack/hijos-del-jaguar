import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DIFF_CONFIG } from '../../data/difficultyConfig'

describe('la dificultad crece de Educativo a Legendario', () => {
  const [e, h, l] = [DIFF_CONFIG.educativo!, DIFF_CONFIG.historico!, DIFF_CONFIG.legendario!]
  it('el conquistador salta más a medida que sube la dificultad', () => {
    expect(e.conqJumpProb).toBeLessThan(h.conqJumpProb)
    expect(h.conqJumpProb).toBeLessThan(l.conqJumpProb)
  })
  it('los efectos negativos pesan más, los umbrales de muerte son más altos y se empieza con menos', () => {
    expect(e.fxMult.neg).toBeLessThan(h.fxMult.neg)
    expect(h.fxMult.neg).toBeLessThan(l.fxMult.neg)
    expect(l.deathThreshold.food).toBeGreaterThan(e.deathThreshold.food)
    expect(l.initStats.food).toBeLessThan(e.initStats.food)
  })
})

describe('el texto de dificultad no cita números a mano', () => {
  it('IntroScreen toma el % de salto de DIFF_CONFIG', () => {
    const src = readFileSync(fileURLToPath(new URL('../../screens/IntroScreen.ts', import.meta.url)), 'utf8')
    expect(src).not.toMatch(/\d+% de salto/)
    expect(src).toMatch(/conqJumpProb/)
  })
})
