import { describe, it, expect, vi, afterEach } from 'vitest'
import * as d3 from 'd3'
import { parchearTransicionesD3, movimientoReducido } from '../../ui/motion'

function simular(reducido: boolean) {
  vi.stubGlobal('document', { documentElement: { classList: { contains: (c: string) => reducido && c === 'cfg-reduced-motion' } } })
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
}
afterEach(() => vi.unstubAllGlobals())

describe('movimiento reducido', () => {
  it('lo detecta por el ajuste del juego o por el sistema', () => {
    simular(true); expect(movimientoReducido()).toBe(true)
    simular(false); expect(movimientoReducido()).toBe(false)
    vi.stubGlobal('document', { documentElement: { classList: { contains: () => false } } })
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    expect(movimientoReducido()).toBe(true)
  })
  it('las transiciones de D3 duran 0 ms con el movimiento reducido y normal sin él', () => {
    simular(false)
    parchearTransicionesD3(d3)
    simular(true)
    expect(d3.transition().duration(1800).duration()).toBe(0)
    expect(d3.transition().delay(500).delay()).toBe(0)
    simular(false)
    expect(d3.transition().duration(1800).duration()).toBe(1800)
  })
  it('parchear dos veces no apila envoltorios', () => {
    simular(false)
    parchearTransicionesD3(d3); parchearTransicionesD3(d3)
    expect(d3.transition().duration(300).duration()).toBe(300)
  })
})
