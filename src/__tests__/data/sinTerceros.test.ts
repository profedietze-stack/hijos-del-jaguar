import { describe, it, expect } from 'vitest'

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const leer = (rel: string): string =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')

// El HTML y el CSS se leen del disco. `?raw` sirve para el HTML pero devuelve la cadena vacía
// para una hoja de estilos: vitest no procesa CSS salvo que se le pida, y un test que lee
// vacío pasa siempre — que es la peor forma de fallar.
const indexHtml = leer('../../../index.html')
const tokensCss = leer('../../styles/tokens.css')

/**
 * El juego no le pide nada a un servidor ajeno.
 *
 * Los que lo abren son menores. Cada recurso que se trae de afuera le cuenta a un tercero la
 * IP del aula, la hora y qué se estaba mirando — y no hace falta que ese tercero guarde nada
 * para que el dato ya haya salido. Y hay un motivo que se nota el mismo día: el wifi de una
 * escuela se cae y el filtro de contenidos bloquea dominios, así que todo lo que venga de
 * afuera es algo que puede faltar en medio de la clase.
 *
 * La cabecera pedía las tres tipografías a Google **además** de traerlas de `/fonts`, que es
 * de donde las usa `tokens.css`. El comentario que la acompañaba la llamaba «fallback de
 * red», y ahí estaba el error de concepto: un `<link rel="stylesheet">` no es un plan B que
 * espera a que el plan A falle — se descarga siempre. Así que no protegía de nada y filtraba
 * en todas las cargas, incluidas las que ya tenían la letra puesta.
 */
describe('el juego no le pide nada a terceros', () => {
  const origenesEn = (texto: string): readonly string[] =>
    [...texto.matchAll(/https?:\/\/[^\s"')]+/g)]
      .map((m) => m[0])
      .filter((url) => !url.startsWith('http://localhost'))
      // El espacio de nombres de un SVG es un identificador, no una descarga.
      .filter((url) => !url.startsWith('http://www.w3.org/'))

  it('la cabecera no pide tipografías, hojas ni scripts a un servidor ajeno', () => {
    const cabecera = indexHtml.slice(0, indexHtml.indexOf('</head>'))
    expect(origenesEn(cabecera)).toEqual([])
  })

  /**
   * Las imágenes, que era la fuga más grande.
   *
   * El juego traía 120 fotos de Unsplash: 119 en los eventos y una en el prólogo. Era la peor
   * de las dos formas de filtrar, porque no es una petición al abrir sino **una por escena**:
   * el tercero no se enteraba de que un chico abrió el juego, se enteraba de qué escena estaba
   * leyendo y cuánto tardaba en pasarla. Y sin internet el juego se quedaba sin una sola
   * imagen.
   *
   * Ahora las cincuenta que quedaron vienen de Wikimedia Commons, con licencia libre, y se
   * sirven desde `public/images/events/`. Cada una se miró una por una contra la ficha de su
   * escena antes de entrar.
   */
  it('ninguna escena pide su imagen a un servidor ajeno', () => {
    expect(origenesEn(leer('../../data/events.ts'))).toEqual([])
  })

  it('ni el prólogo', () => {
    expect(origenesEn(indexHtml)).toEqual([])
  })

  /**
   * Y todas apuntan a un archivo que existe.
   *
   * Una ruta mal escrita no se ve al compilar —es una cadena— y en la partida deja la escena
   * sin fondo, que es justo el fallo que nadie reporta porque parece decisión de diseño.
   */
  it('cada imagen que una escena nombra está en el repositorio', () => {
    const eventos = leer('../../data/events.ts')
    const nombradas = [...eventos.matchAll(/images\/events\/([a-z0-9-]+)\.jpg/g)]
      .map((m) => m[1]!)
    expect(nombradas.length).toBeGreaterThan(100)

    const enDisco = new Set(
      readdirSync(fileURLToPath(new URL('../../../public/images/events', import.meta.url)))
        .map((f) => f.replace(/\.jpg$/, '')),
    )
    const rotas = [...new Set(nombradas)].filter((n) => !enDisco.has(n))
    expect(rotas).toEqual([])
  })

  /** Y toda imagen servida declara de dónde salió: las CC-BY piden atribución. */
  it('cada imagen tiene su ficha de crédito', () => {
    const creditos = leer('../../data/creditos.ts')
    const enDisco = readdirSync(
      fileURLToPath(new URL('../../../public/images/events', import.meta.url)),
    ).map((f) => f.replace(/\.jpg$/, ''))

    const sinFicha = enDisco.filter((n) => !creditos.includes(`archivo: "${n}"`))
    expect(sinFicha).toEqual([])
  })

  it('ni la hoja que define las tipografías', () => {
    expect(origenesEn(tokensCss)).toEqual([])
  })

  /**
   * Y que las tres familias sigan estando servidas desde el propio sitio: si alguien quitara
   * un `@font-face`, el test de arriba seguiría en verde y el juego se quedaría sin letra.
   */
  it('las tres familias se declaran contra archivos propios', () => {
    for (const familia of ['Cinzel Decorative', 'Cinzel', 'Crimson Text']) {
      expect(tokensCss, `falta @font-face de ${familia}`).toContain(`font-family: '${familia}'`)
    }
    expect(tokensCss).toMatch(/src:\s*url\('\/fonts\//)
  })
})
