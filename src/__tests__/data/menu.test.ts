import { describe, it, expect } from 'vitest'
import html from '../../../index.html?raw'
import main from '../../main.ts?raw'

/** Todo `on('btn-x', …)` de main.ts necesita su `id="btn-x"` en index.html (F3-06: Créditos inalcanzables). */
describe('los botones que main.ts conecta existen en index.html', () => {
  it('cada on(\'id\') tiene su elemento', () => {
    const ids = [...main.matchAll(/\bon\('([a-z0-9-]+)'/g)].map(m => m[1]!)
    expect(ids.length).toBeGreaterThan(10)
    const faltan = ids.filter(id => !html.includes(`id="${id}"`))
    expect(faltan).toEqual([])
  })
})
