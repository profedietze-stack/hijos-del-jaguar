import { describe, it, expect } from 'vitest'
import { NODES_DEF } from '../../data/nodes'
import { EVENTS_DEF } from '../../data/events'

/** Hechos verificados en la auditoría de nov-2026: que no vuelvan a las cifras viejas. */
describe('hechos históricos corregidos', () => {
  it('los tepuyes: la edad del nodo no contradice a la del tooltip (1.800+ millones)', () => {
    expect(NODES_DEF['n_tepui']!.desc).not.toMatch(/mil millones de años/)
    expect(NODES_DEF['n_tepui']!.desc).toMatch(/2\.000 millones/)
    expect(EVENTS_DEF['e_tepui']!.narr).toMatch(/1\.800 millones/)
  })

  it('el Izozog es territorio guaraní izoceño, no solo chiquitano', () => {
    expect(NODES_DEF['n_banados']!.desc).toMatch(/izoce/)
    expect(EVENTS_DEF['e_banados']!.narr + (EVENTS_DEF['e_banados_b']?.narr ?? '')).not.toMatch(/Habitaron la región del Izozog/)
  })
})
