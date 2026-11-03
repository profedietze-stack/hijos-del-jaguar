import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * El juego le habla al alumno de vos (rioplatense). Un tuteo suelto ("Eres", "Elige",
 * "Lidera") rompe la voz. Barre todo src/ con glob, no con una lista de archivos, y el
 * index.html por fs (no está bajo src/).
 */
const fuentes = import.meta.glob('../../**/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const TUTEO = /\b(Eres|Elige|Lidera|Toca para|Investiga uno|Puedes|Tienes|Quieres|Debes|Sabes|Haz clic)\b/

function lineasMalas(ruta: string, txt: string): string[] {
  const out: string[] = []
  txt.split('\n').forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return
    if (TUTEO.test(l)) out.push(`${ruta}:${i + 1}: ${l.trim().slice(0, 100)}`)
  })
  return out
}

describe('voseo consistente', () => {
  it('hay fuentes que revisar', () => {
    expect(Object.keys(fuentes).length).toBeGreaterThan(20)
  })

  it('ningún .ts de src/ usa tuteo en el texto que ve el alumno', () => {
    const malas = Object.entries(fuentes)
      .filter(([ruta]) => !ruta.includes('__tests__') && !ruta.includes('/debug/'))
      .flatMap(([ruta, txt]) => lineasMalas(ruta, txt))
    expect(malas).toEqual([])
  })

  it('index.html tampoco', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf-8')
    expect(lineasMalas('index.html', html)).toEqual([])
  })
})
