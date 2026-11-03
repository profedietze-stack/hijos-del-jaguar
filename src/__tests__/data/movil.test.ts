import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const leer = (rel: string): string => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')
const html = leer('../../../index.html')
const mainCss = leer('../../styles/main.css')
const touch = leer('../../styles/components/touch.css')

/** Auditoría 2026-11-03, F3-09/F3-13/F3-15: el HUD y los controles táctiles en móvil. */
describe('móvil', () => {
  it('touch.css se importa al final, para pisar las reglas de cada pantalla', () => {
    const imports = [...mainCss.matchAll(/@import\s+'([^']+)'/g)].map(m => m[1])
    expect(imports[imports.length - 1]).toBe('./components/touch.css')
  })
  it('el botón de silencio no lleva estilo en línea (no se podría corregir desde CSS) y expone su estado', () => {
    const btn = html.match(/<button id="btn-mute"[^>]*>/)![0]
    expect(btn).not.toMatch(/style=/)
    expect(btn).toMatch(/aria-pressed=/)
    expect(touch).toMatch(/#btn-mute[\s\S]*min-width:\s*44px/)
  })
  it('los botones de sólo ícono tienen nombre accesible', () => {
    for (const id of ['map-ped-btn', 'ev-ped-btn', 'modal-close', 'ped-close']) {
      expect(html.match(new RegExp(`<button[^>]*id="${id}"[^>]*>`))![0], id).toMatch(/aria-label=/)
    }
  })
})
