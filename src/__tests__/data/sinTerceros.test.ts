import { describe, it, expect } from 'vitest'

import { readFileSync } from 'node:fs'
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
   * Las imágenes, que es lo que falta.
   *
   * El juego trae 120 fotos de Unsplash: 119 en los eventos y una en el prólogo. Es la fuga
   * más grande que le queda y la peor de las dos formas, porque no es una petición al abrir
   * sino **una por escena**: el tercero no se entera de que un chico abrió el juego, se entera
   * de qué escena está leyendo y cuánto tarda en pasarla. Y sin internet el juego se queda sin
   * una sola imagen.
   *
   * Arreglarlo es bajarlas a `public/images/events/` —el directorio ya está creado y vacío,
   * esperando— y cambiar las URL por rutas propias. Son unos 18 MB en el repositorio, así que
   * la decisión es del dueño del repositorio y no mía.
   *
   * Mientras tanto esto es un trinquete: fija la deuda en el número de hoy para que no crezca
   * sola. Un evento nuevo con una foto de afuera pone el test en rojo. Cuando las imágenes
   * bajen, este número va a cero y el test de arriba se extiende al archivo entero.
   */
  it('la deuda de imágenes de terceros no crece', () => {
    const eventos = leer('../../data/events.ts')
    const enEventos = origenesEn(eventos).filter((u) => u.includes('images.unsplash.com'))
    const enHtml = origenesEn(indexHtml).filter((u) => u.includes('images.unsplash.com'))

    expect({ eventos: enEventos.length, prologo: enHtml.length }).toEqual({
      eventos: 119,
      prologo: 1,
    })
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
