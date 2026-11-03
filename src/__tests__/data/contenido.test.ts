import { describe, it, expect } from 'vitest'
import { EVENTS_DEF } from '../../data/events'
import { NODES_DEF } from '../../data/nodes'

const K = ['food', 'moral', 'salud', 'union', 'warriors', 'shamans', 'civilians'] as const

describe('decisiones: integridad numérica y de texto', () => {
  const todas = Object.entries(EVENTS_DEF).flatMap(([id, ev]) => ev.decisions.map((d, i) => ({ id, i, d })))

  it('hay entre 2 y 4 decisiones por evento', () => {
    const mal = Object.entries(EVENTS_DEF).filter(([, e]) => e.decisions.length < 2 || e.decisions.length > 4).map(([id]) => id)
    expect(mal).toEqual([])
  })
  it('todo efecto es un entero finito y acotado', () => {
    const mal = todas.flatMap(({ id, i, d }) => K.flatMap(k => {
      const v = d.effects[k]
      return v !== undefined && (!Number.isInteger(v) || Math.abs(v) > 60) ? [`${id}[${i}].${k}=${v}`] : []
    }))
    expect(mal).toEqual([])
  })
  it('el texto de las decisiones no lleva HTML ni es muy largo', () => {
    const mal = todas.filter(({ d }) => /[<>]/.test(d.text) || d.text.length > 200).map(({ id, i }) => `${id}[${i}]`)
    expect(mal).toEqual([])
  })
  it('ninguna decisión pierde más gente que la que tiene la tribu al empezar', () => {
    const mal = todas.filter(({ d }) => -((d.effects.warriors ?? 0) + (d.effects.shamans ?? 0) + (d.effects.civilians ?? 0)) > 20).map(({ id, i }) => `${id}[${i}]`)
    expect(mal).toEqual([])
  })
})

/**
 * Ratchet de dominancia: una opción igual o peor en TODO que otra no es una decisión.
 * Hoy hay 79 pares así (eran 120 en la auditoría 2026-11-03). El test no obliga a arreglarlos de golpe pero
 * impide que aparezcan más: si baja, bajar el tope.
 */
describe('opciones dominadas (ratchet)', () => {
  const enPool = new Set(Object.values(NODES_DEF).flatMap(n => n.eventPool))
  it('no hay más pares dominados que el tope actual', () => {
    let pares = 0
    for (const [id, ev] of Object.entries(EVENTS_DEF)) {
      if (!enPool.has(id)) continue
      const ds = ev.decisions
      ds.forEach((a, i) => ds.forEach((b, j) => {
        if (i === j) return
        const ge = K.every(k => (a.effects[k] ?? 0) >= (b.effects[k] ?? 0))
        const gt = K.some(k => (a.effects[k] ?? 0) > (b.effects[k] ?? 0))
        if (ge && gt && (!b.allianceKey || a.allianceKey)) pares++
      }))
    }
    expect(pares).toBeLessThanOrEqual(79)
  })

  it('ninguna opción es mejor o igual que TODAS las demás (decisión sin decisión)', () => {
    const triviales: string[] = []
    for (const [id, ev] of Object.entries(EVENTS_DEF)) {
      if (!enPool.has(id)) continue
      const ds = ev.decisions
      const domina = (a: typeof ds[number], b: typeof ds[number]) =>
        K.every(k => (a.effects[k] ?? 0) >= (b.effects[k] ?? 0)) && K.some(k => (a.effects[k] ?? 0) > (b.effects[k] ?? 0)) && (!b.allianceKey || !!a.allianceKey)
      if (ds.some((a, i) => ds.every((b, j) => i === j || domina(a, b)))) triviales.push(id)
    }
    expect(triviales).toEqual([])
  })
})
