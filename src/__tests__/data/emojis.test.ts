import { describe, it, expect } from 'vitest'

/**
 * Windows 10 no trae glifos de Emoji 13.0 en adelante: se ven como cuadrados vacíos. Los
 * íconos de nodo son la única pista visual del mapa, así que un cuadrado es un nodo mudo.
 */
const POSTERIORES_A_12 = (cp: number) =>
  (cp >= 0x1faa9 && cp <= 0x1faff) ||                       // 13.0 y 14.0 (🪩…🫿), salvo lo ya cubierto abajo
  (cp >= 0x1fa96 && cp <= 0x1faa8) ||                       // 13.0 (🪖 🪗 🪘 🪙 🪚 🪛 🪜 🪝 🪞 🪟 🪠 🪡 🪢 🪣 🪤 🪥 🪦 🪧 🪨)
  [0x1f9a3, 0x1f9a4, 0x1f9ab, 0x1f9ac, 0x1f9cb, 0x1f6d6, 0x1f6d7, 0x1f6fb, 0x1f6fc,
   0x1f90c, 0x1f972, 0x1f977, 0x1f978, 0x1f979].includes(cp)

describe('emojis compatibles con Windows 10', () => {
  const fuentes = import.meta.glob(['../../**/*.ts', '../../../index.html'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>

  it('hay fuentes que revisar', () => {
    expect(Object.keys(fuentes).length).toBeGreaterThan(20)
  })

  it('ninguna fuente usa emojis de Unicode 13 o posterior', () => {
    const malos: string[] = []
    for (const [ruta, txt] of Object.entries(fuentes)) {
      if (ruta.includes('__tests__')) continue
      for (const ch of txt) {
        const cp = ch.codePointAt(0)!
        if (POSTERIORES_A_12(cp)) malos.push(`${ruta}: U+${cp.toString(16).toUpperCase()} ${ch}`)
      }
    }
    expect(malos).toEqual([])
  })
})
