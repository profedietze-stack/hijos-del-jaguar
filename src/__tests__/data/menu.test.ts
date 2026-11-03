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

/** F3-22: el menú decía «v3.0» a mano y package.json dice otra cosa; MenuScreen escribía la versión en un id que no existía. */
describe('versión del menú', () => {
  it('existe el elemento donde MenuScreen escribe la versión y no hay una versión fija a mano', () => {
    expect(html).toContain('id="menu-ver-num"')
    expect(html).not.toMatch(/ProfeD · v3\.0/)
  })
})

/** F3-20/F3-26 y el patrón error-banner: va primero, y el arranque no depende de DOMContentLoaded. */
describe('arranque de main.ts', () => {
  it('initErrorBanner() se llama antes de registrar nada más, fuera de DOMContentLoaded', () => {
    const i = main.indexOf('initErrorBanner()')
    const j = main.indexOf("document.addEventListener('DOMContentLoaded'")
    expect(i).toBeGreaterThan(-1)
    expect(i).toBeLessThan(j)
  })
  it('espera el primer pintado con respaldo (rAF no corre en una pestaña en segundo plano)', () => {
    expect(main).toMatch(/function trasPintar/)
    expect(main).not.toMatch(/requestAnimationFrame\(\(\) => requestAnimationFrame\(\(\) => \{\s*\n\s*buildMap/)
  })
})
