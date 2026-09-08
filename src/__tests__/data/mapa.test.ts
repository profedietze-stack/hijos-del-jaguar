import { describe, it, expect } from 'vitest'

import { NODES_DEF, EDGES } from '../../data/nodes'
import { EVENTS_DEF } from '../../data/events'

/**
 * El mapa, comprobado como grafo.
 *
 * El juego es un recorrido por un grafo de nodos, y hasta ahora no había un solo test sobre
 * los datos: los cuatro que existen prueban el motor, el estado, el guardado y las
 * estadísticas. Todo lo que puede salir mal en la forma del mapa salía mal en silencio y se
 * descubría jugando — o no se descubría.
 *
 * Y hay dos listas que describen el mismo mapa y se mantienen a mano:
 *
 * - `NODES_DEF[].next`, que es por donde el jugador **puede** ir.
 * - `EDGES`, que es lo que la pantalla del mapa **dibuja**.
 *
 * Dos fuentes para un solo hecho se separan sin avisar. Cuando se separan, o el mapa pinta un
 * camino que no se puede recorrer, o el jugador llega a un nodo por una línea que nadie
 * dibujó. Las dos versiones son confusas de una forma que el alumno no puede distinguir de un
 * error suyo.
 */
describe('el grafo del mapa', () => {
  const ids = Object.keys(NODES_DEF)
  const INICIO = 'n00'

  it('cada nodo se declara con su propia clave', () => {
    const mal = ids.filter((id) => NODES_DEF[id]!.id !== id)
    expect(mal).toEqual([])
  })

  it('todo destino de «next» es un nodo que existe', () => {
    const rotos = ids.flatMap((id) =>
      NODES_DEF[id]!.next.filter((d) => !NODES_DEF[d]).map((d) => `${id} → ${d}`),
    )
    expect(rotos).toEqual([])
  })

  it('los dos extremos de cada arista dibujada existen', () => {
    const rotos = EDGES.filter(([a, b]) => !NODES_DEF[a] || !NODES_DEF[b]).map(
      ([a, b]) => `${a} → ${b}`,
    )
    expect(rotos).toEqual([])
  })

  /**
   * Lo que se puede caminar y lo que se dibuja tienen que ser el mismo mapa.
   */
  it('«next» y las aristas dibujadas describen el mismo mapa', () => {
    const caminables = new Set(ids.flatMap((id) => NODES_DEF[id]!.next.map((d) => `${id} → ${d}`)))
    const dibujadas = new Set(EDGES.map(([a, b]) => `${a} → ${b}`))

    const sinDibujar = [...caminables].filter((e) => !dibujadas.has(e))
    const sinCamino = [...dibujadas].filter((e) => !caminables.has(e))

    expect({ sinDibujar, sinCamino }).toEqual({ sinDibujar: [], sinCamino: [] })
  })

  /** Un nodo al que no se llega es contenido escrito que nadie va a ver nunca. */
  it('a todo nodo se llega desde el principio', () => {
    const vistos = new Set([INICIO])
    const cola = [INICIO]
    while (cola.length) {
      for (const d of NODES_DEF[cola.pop()!]!.next) {
        if (!vistos.has(d)) {
          vistos.add(d)
          cola.push(d)
        }
      }
    }
    expect(ids.filter((id) => !vistos.has(id))).toEqual([])
  })

  /**
   * Y desde todo nodo se sigue avanzando, salvo los finales.
   *
   * Un nodo sin salida que no sea un final deja la partida trabada: el jugador llegó, resolvió
   * su evento y no hay a dónde ir. En un aula eso es un chico con la mano levantada.
   */
  it('ningún nodo intermedio deja la partida sin salida', () => {
    const finales = new Set(ids.filter((id) => NODES_DEF[id]!.act === 4 && NODES_DEF[id]!.next.length === 0))
    const trabados = ids.filter((id) => NODES_DEF[id]!.next.length === 0 && !finales.has(id))
    expect(trabados).toEqual([])
  })
})

/**
 * Los eventos, que son el contenido de verdad.
 *
 * Cada nodo nombra su `eventPool`. Un id mal escrito ahí no se ve al compilar —`string[]` se
 * traga cualquier cosa— y sale en la partida: el jugador pisa el nodo y no hay nada que leer.
 */
describe('los eventos que el mapa nombra', () => {
  const ids = Object.keys(NODES_DEF)

  it('todo evento de un pool existe', () => {
    const rotos = ids.flatMap((id) =>
      NODES_DEF[id]!.eventPool.filter((e) => !EVENTS_DEF[e]).map((e) => `${id}: ${e}`),
    )
    expect(rotos).toEqual([])
  })

  it('ningún nodo se queda sin nada que contar', () => {
    expect(ids.filter((id) => NODES_DEF[id]!.eventPool.length === 0)).toEqual([])
  })

  /**
   * Y al revés: un evento escrito que ningún nodo nombra es trabajo que nadie va a leer.
   *
   * Es la misma familia que el contenido del final del mazo que casi nunca salía: no rompe
   * nada, así que no se nota, y por eso se queda ahí para siempre.
   *
   * Los que empiezan con guion bajo quedan fuera, y no es una excepción de conveniencia: son
   * los que el código dispara por su cuenta, sin pasar por el mapa. `_conq_catch` es el
   * alcance del conquistador — `main.ts` fabrica un nodo al vuelo (`_conq_catch_node`) y lo
   * mete en la partida cuando la persecución te alcanza, así que no puede estar en el pool de
   * ningún nodo del mapa. El guion bajo es lo que marca esa diferencia en todo el proyecto.
   */
  it('ningún evento escrito se queda sin nodo que lo use', () => {
    const usados = new Set(ids.flatMap((id) => NODES_DEF[id]!.eventPool))
    const huerfanos = Object.keys(EVENTS_DEF).filter((e) => !e.startsWith('_') && !usados.has(e))
    expect(huerfanos).toEqual([])
  })

  /** Y que la convención siga siendo cierta: los de guion bajo, disparados desde el código. */
  it('los eventos de guion bajo son los que dispara el código, y existen', () => {
    const especiales = Object.keys(EVENTS_DEF).filter((e) => e.startsWith('_'))
    expect(especiales).toEqual(['_conq_catch'])
  })

  it('toda decisión de todo evento tiene texto y efectos', () => {
    const malas = Object.entries(EVENTS_DEF).flatMap(([id, ev]) =>
      (ev.decisions ?? []).flatMap((d, i) =>
        !d.text?.trim() || !d.effects ? [`${id}[${i}]`] : [],
      ),
    )
    expect(malas).toEqual([])
  })

  it('y ningún evento se queda sin decisiones', () => {
    const vacios = Object.entries(EVENTS_DEF)
      .filter(([, ev]) => !ev.decisions || ev.decisions.length === 0)
      .map(([id]) => id)
    expect(vacios).toEqual([])
  })
})
