import { describe, it, expect } from 'vitest'
import { escapeHtml, personalizeNarr } from '../../core/text'

describe('escapeHtml', () => {
  it('neutraliza etiquetas, comillas y &', () => {
    expect(escapeHtml(`<img src=x onerror="a()"> & 'b'`)).toBe(
      '&lt;img src=x onerror=&quot;a()&quot;&gt; &amp; &#39;b&#39;',
    )
  })
  it('tolera null y undefined', () => {
    expect(escapeHtml(undefined)).toBe('')
    expect(escapeHtml(null)).toBe('')
  })
})

describe('personalizeNarr', () => {
  const narr = 'Cuando el cacique se acerca, todos callan.'
  it('inserta el nombre', () => {
    expect(personalizeNarr(narr, 'Balam')).toBe('Cuando Balam se acerca, todos callan.')
  })
  it('un nombre con HTML se muestra como texto', () => {
    const out = personalizeNarr(narr, '<img src=x onerror=alert(1)>')
    expect(out).not.toContain('<img')
    expect(out).toContain('&lt;img')
  })
  it('los patrones $& y $$ del nombre no se interpretan', () => {
    expect(personalizeNarr(narr, '$&')).toBe('Cuando $&amp; se acerca, todos callan.')
    expect(personalizeNarr(narr, '$$')).toBe('Cuando $$ se acerca, todos callan.')
  })
})

/**
 * Barrido de todas las pantallas: ninguna línea que interpole el nombre del cacique en HTML
 * puede hacerlo sin escapeHtml. Recorre con glob, no con una lista de archivos.
 */
describe('el nombre del cacique no llega crudo a innerHTML', () => {
  const fuentes = import.meta.glob('../../**/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const RE_INTERP = /\$\{[^}]*\b(caciqueName|cacique)\b[^}]*\}/
  const RE_ASIGN = /innerHTML\s*=\s*(?:\w+\.)?caciqueName\s*;/

  it('hay fuentes que revisar', () => {
    expect(Object.keys(fuentes).length).toBeGreaterThan(20)
  })

  it('cada interpolación usa escapeHtml', () => {
    const malas: string[] = []
    for (const [ruta, txt] of Object.entries(fuentes)) {
      if (ruta.includes('__tests__') || ruta.includes('/debug/')) continue
      txt.split('\n').forEach((l, i) => {
        if ((RE_INTERP.test(l) || RE_ASIGN.test(l)) && !l.includes('escapeHtml(') && !l.includes('textContent') && !l.includes('cSet(')) {
          malas.push(`${ruta}:${i + 1}: ${l.trim().slice(0, 120)}`)
        }
      })
    }
    expect(malas).toEqual([])
  })
})
