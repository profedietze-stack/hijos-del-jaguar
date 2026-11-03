import { describe, it, expect } from 'vitest'
import { tribeTrailSegments } from '../../core/trail'

describe('tribeTrailSegments', () => {
  it('estado sin history ni nodes no tira', () => {
    expect(tribeTrailSegments({})).toEqual([])
  })
  it('history parcial, nodes ausente o con basura', () => {
    expect(tribeTrailSegments({ history: ['a', 'b'] })).toEqual([])
    expect(tribeTrailSegments({ history: 5, nodes: null })).toEqual([])
    expect(tribeTrailSegments({ history: ['a', 'b'], nodes: { a: null, b: { lon: 1, lat: 2 } } })).toEqual([])
  })
  it('une nodos consecutivos e ignora la captura', () => {
    const nodes = { a: { lon: 0, lat: 0 }, b: { lon: 1, lat: 1 }, c: { lon: 2, lat: 2 } }
    expect(tribeTrailSegments({ history: ['a', 'b', '_conq_catch_node', 'c'], nodes })).toHaveLength(2)
  })
  it('coordenadas NaN se descartan', () => {
    expect(tribeTrailSegments({ history: ['a', 'b'], nodes: { a: { lon: NaN, lat: 0 }, b: { lon: 1, lat: 1 } } })).toEqual([])
  })
})
