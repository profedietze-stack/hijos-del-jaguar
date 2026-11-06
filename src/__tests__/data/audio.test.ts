import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  ARCHIVO_PISTA, ARCHIVO_VIENTO, SFX,
  actoValido, duracionCruce, gananciaDeVolumen, msHastaSiguiente, pistaDeActo,
} from '../../ui/audioLogic'
import { CREDITOS_AUDIO } from '../../data/creditosAudio'

const ruta = (rel: string): string => fileURLToPath(new URL(rel, import.meta.url))
const publico = (rel: string): string => ruta(`../../../public/${rel}`)
const sw = readFileSync(publico('sw.js'), 'utf8')

const precache = [...sw.slice(sw.indexOf('const STATIC_PRECACHE')).matchAll(/'\.\/(audio\/[^']+)'/g)].map((m) => m[1]!)

describe('qué pista suena en cada acto', () => {
  it('cada acto tiene su propia pista, distinta de las demás y del menú', () => {
    const pistas = ([1, 2, 3, 4] as const).map((a) => ARCHIVO_PISTA[pistaDeActo(a)])
    expect(new Set([...pistas, ARCHIVO_PISTA.menu]).size).toBe(5)
  })

  it('un acto fuera de rango o ausente cae en el 1, nunca en una pista que no existe', () => {
    for (const malo of [undefined, 0, 5, -1, NaN, 2.5]) {
      expect(ARCHIVO_PISTA[pistaDeActo(actoValido(malo))]).toBeTruthy()
    }
    expect(actoValido(undefined)).toBe(1)
    expect(actoValido(3)).toBe(3)
  })
})

describe('el cruce entre vueltas del loop', () => {
  it('es el 15 % de la pista con tope de 2,5 s', () => {
    expect(duracionCruce(20)).toBeCloseTo(2.5, 5)   // 15 % = 3 → tope 2,5
    expect(duracionCruce(10)).toBeCloseTo(1.5, 5)
    expect(duracionCruce(135)).toBe(2.5)
  })

  it('la voz siguiente arranca antes de que termine la actual, nunca después', () => {
    for (const d of [8, 20, 37.5, 135]) {
      const ms = msHastaSiguiente(d)!
      expect(ms).toBeLessThan(d * 1000)
      expect(ms).toBeGreaterThan(0)
    }
  })

  /**
   * Un stream puede reportar NaN o Infinity de duración, y setTimeout toma ambos como 0:
   * saldría una voz nueva tras otra hasta colgar la pestaña. Sin duración usable no se
   * programa nada (null) y la voz se repite con el loop nativo.
   */
  it('una duración rota (NaN, 0, negativa, Infinity) no produce un temporizador', () => {
    for (const d of [NaN, 0, -3, Infinity]) {
      expect(duracionCruce(d)).toBe(0)
      expect(msHastaSiguiente(d)).toBeNull()
    }
  })
})

describe('volumen', () => {
  it('0..100 → 0..1 y acota lo que no entra', () => {
    expect(gananciaDeVolumen(0)).toBe(0)
    expect(gananciaDeVolumen(50)).toBe(0.5)
    expect(gananciaDeVolumen(100)).toBe(1)
    expect(gananciaDeVolumen(250)).toBe(1)
    expect(gananciaDeVolumen(-10)).toBe(0)
    expect(gananciaDeVolumen(NaN)).toBe(0)
  })
})

describe('los archivos de audio existen y viajan con el juego', () => {
  const musica = [...Object.values(ARCHIVO_PISTA), ARCHIVO_VIENTO]
  const efectos = [...new Set(Object.values(SFX).map((d) => d.archivo))]

  it('cada pista y cada efecto que el código pide está en public/audio', () => {
    for (const f of musica) expect(existsSync(publico(`audio/musica/${f}`)), f).toBe(true)
    for (const f of efectos) expect(existsSync(publico(`audio/sfx/${f}`)), f).toBe(true)
  })

  /**
   * `cache.addAll` es todo o nada: una ruta que dé 404 y no queda nada precacheado. Y al
   * revés, un archivo que el juego pide y el worker no precachea hace que sin internet el
   * juego quede mudo sin avisar.
   */
  it('todo lo que se precachea existe en disco', () => {
    expect(precache.length).toBeGreaterThan(10)
    for (const p of precache) expect(existsSync(publico(p)), p).toBe(true)
  })

  it('todo lo que el código pide está precacheado', () => {
    for (const f of musica) expect(precache, f).toContain(`audio/musica/${f}`)
    for (const f of efectos) expect(precache, f).toContain(`audio/sfx/${f}`)
  })

  it('no hay en public/audio archivos que nadie pida (pesan en el precache y en la tablet)', () => {
    const pedidos = new Set([...musica.map((f) => `musica/${f}`), ...efectos.map((f) => `sfx/${f}`)])
    const enDisco = ['musica', 'sfx'].flatMap((d) => readdirSync(publico(`audio/${d}`)).map((f) => `${d}/${f}`))
    expect(enDisco.filter((f) => !pedidos.has(f))).toEqual([])
  })

  it('cada efecto tiene velocidad y volumen razonables', () => {
    for (const [n, d] of Object.entries(SFX)) {
      expect(d.rate, n).toBeGreaterThan(0.25)
      expect(d.rate, n).toBeLessThanOrEqual(2)
      expect(d.vol, n).toBeGreaterThan(0)
      expect(d.vol, n).toBeLessThanOrEqual(1)
    }
  })
})

describe('créditos del audio', () => {
  it('toda pista de música tiene su crédito con autor, licencia y enlace', () => {
    const musica = [...Object.values(ARCHIVO_PISTA), ARCHIVO_VIENTO]
    for (const f of musica) {
      const c = CREDITOS_AUDIO.find((x) => x.archivo === `musica/${f}`)
      expect(c, `falta el crédito de ${f}`).toBeTruthy()
      expect(c!.autor.length).toBeGreaterThan(2)
      expect(c!.licencia).toMatch(/^(CC0|CC BY 4\.0)$/)
      expect(c!.enlace).toMatch(/^https:\/\/(freesound\.org|kenney\.nl)\//)
    }
  })

  it('los efectos de Kenney están acreditados', () => {
    expect(CREDITOS_AUDIO.some((c) => /Kenney/.test(c.autor))).toBe(true)
  })

  it('ninguna licencia es NC ni SA: el juego se puede usar en cualquier aula', () => {
    for (const c of CREDITOS_AUDIO) expect(c.licencia, c.titulo).not.toMatch(/NC|SA|ND/)
  })
})

describe('Tone.js se fue', () => {
  it('ninguna fuente lo importa', () => {
    const fuentes = import.meta.glob('../../**/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
    const usan = Object.entries(fuentes)
      .filter(([r]) => !r.includes('__tests__'))
      .filter(([, t]) => /from\s+['"]tone['"]/.test(t))
      .map(([r]) => r)
    expect(usan).toEqual([])
  })

  it('ni está en las dependencias', () => {
    const pkg = JSON.parse(readFileSync(ruta('../../../package.json'), 'utf8')) as { dependencies?: Record<string, string> }
    expect(pkg.dependencies).not.toHaveProperty('tone')
    expect(pkg.dependencies).toHaveProperty('howler')
  })
})
