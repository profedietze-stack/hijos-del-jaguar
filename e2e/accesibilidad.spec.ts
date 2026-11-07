import { test, expect, type Page } from '@playwright/test'
import { pasarSplash, guardadoLimpio } from './ayudas'

/*
  Accesibilidad que ningún test de reglas ve:
    - en pantalla táctil, todo lo que se toca mide al menos 44 px (WCAG 2.5.5 / guía de Apple);
    - con teclado, el elemento enfocado se ve (WCAG 2.4.7).
  Se mide en las pantallas por las que pasa todo alumno antes de jugar.
*/

const MIN = 44

test.beforeEach(async ({ page }) => { await guardadoLimpio(page) })

/** Lo tocable que mide menos que MIN en alguno de los dos lados. */
async function chicos(page: Page): Promise<string[]> {
  return page.evaluate((min) => {
    const out: string[] = []
    const sel = 'button, a[href], [role=button], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const cand = new Set<HTMLElement>(document.querySelectorAll<HTMLElement>(sel))
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      const pointer = (e: HTMLElement | null) => !!e && getComputedStyle(e).cursor === 'pointer'
      if (pointer(el) && !pointer(el.parentElement)) cand.add(el)
    }
    for (const el of cand) {
      if (el instanceof SVGElement) continue                      // los nodos del mapa se miden aparte
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0 || s.visibility === 'hidden' || s.display === 'none') continue
      if (el.closest('[hidden], .screen:not(.active)')) continue  // pantallas que no están a la vista
      if (el.closest('#splash-screen') && getComputedStyle(el.closest('#splash-screen')!).display === 'none') continue
      if (s.display === 'inline') continue                        // enlace dentro de un párrafo (excepción de WCAG)
      if (r.width < min - 0.5 || r.height < min - 0.5) {
        out.push(`${el.id ? '#' + el.id : (el.className || el.tagName).toString().slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent ?? '').trim().slice(0, 18)}"`)
      }
    }
    return out
  }, MIN)
}

test.describe('táctil: targets de 44 px', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo en el proyecto de tablet')

  test('splash, menú, dificultad y nombre', async ({ page }) => {
    test.setTimeout(90_000)
    await page.goto('./')
    await page.locator('#btn-splash-start').waitFor({ state: 'visible', timeout: 20_000 })
    expect(await chicos(page), 'splash').toEqual([])
    await pasarSplash(page)
    await page.waitForTimeout(800)
    expect(await chicos(page), 'menú').toEqual([])
    await page.locator('#btn-nueva').click()
    await page.waitForTimeout(800)
    expect(await chicos(page), 'dificultad').toEqual([])
    await page.locator('#diff-edu').click()
    await page.locator('#btn-comenzar').click()
    await page.waitForTimeout(800)
    expect(await chicos(page), 'nombre').toEqual([])
  })
})

test.describe('teclado: el foco se ve', () => {
  test.skip(({ isMobile }) => isMobile, 'el teclado se prueba en escritorio')

  test('al tabular por el menú, cada elemento enfocado tiene algo que lo marque', async ({ page }) => {
    await page.goto('./')
    await pasarSplash(page)
    await page.waitForTimeout(800)
    const sinMarca: string[] = []
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      const r = await page.evaluate(() => {
        const e = document.activeElement as HTMLElement | null
        if (!e || e === document.body) return null
        const s = getComputedStyle(e)
        const conOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
        const conSombra = s.boxShadow !== 'none'
        return { id: e.id || e.tagName, visible: conOutline || conSombra }
      })
      if (r && !r.visible) sinMarca.push(r.id)
    }
    expect(sinMarca, 'elementos que reciben foco sin ninguna marca visible').toEqual([])
  })
})
