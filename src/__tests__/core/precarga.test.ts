import { describe, it, expect } from 'vitest'
import { imagenesPorActo, conexionPermitePrecarga } from '../../core/precarga'
import { NODES_DEF } from '../../data/nodes'
import { EVENTS_DEF } from '../../data/events'

describe('imagenesPorActo', () => {
  it('ordena por acto y no repite', () => {
    const nodos = {
      b: { act: 2, eventPool: ['e2', 'e1'] },
      a: { act: 1, eventPool: ['e1', 'e3'] },
      c: { act: 3, eventPool: ['e3'] },
    }
    const ev = { e1: { img: 'uno.jpg' }, e2: { img: 'dos.jpg' }, e3: { img: 'tres.jpg' } }
    expect(imagenesPorActo(nodos, ev)).toEqual(['uno.jpg', 'tres.jpg', 'dos.jpg'])
  })

  it('un evento que no existe o sin imagen no rompe la lista', () => {
    expect(imagenesPorActo({ a: { act: 1, eventPool: ['no_existe', 'sin'] } }, { sin: { img: '' } })).toEqual([])
  })

  it('con el juego real: cubre TODAS las imágenes de los eventos que algún nodo usa', () => {
    const lista = imagenesPorActo(NODES_DEF, EVENTS_DEF)
    const usadas = new Set(Object.values(NODES_DEF).flatMap((n) => n.eventPool).map((id) => EVENTS_DEF[id]?.img).filter(Boolean))
    expect(new Set(lista)).toEqual(usadas)
    expect(lista.length).toBeGreaterThan(30)
    expect(lista.length).toBe(new Set(lista).size)
  })

  it('con el juego real, las del acto 1 vienen antes que las del acto 4', () => {
    const lista = imagenesPorActo(NODES_DEF, EVENTS_DEF)
    const actoDe = (img: string) => Math.min(...Object.values(NODES_DEF).filter((n) => n.eventPool.some((id) => EVENTS_DEF[id]?.img === img)).map((n) => n.act))
    const actos = lista.map(actoDe)
    expect(actos).toEqual([...actos].sort((a, b) => a - b))
  })
})

describe('conexionPermitePrecarga', () => {
  it('sin información de conexión (Safari, Firefox) se asume wifi', () => {
    expect(conexionPermitePrecarga(undefined)).toBe(true)
    expect(conexionPermitePrecarga(null)).toBe(true)
    expect(conexionPermitePrecarga({})).toBe(true)
  })
  it('con ahorro de datos, no', () => {
    expect(conexionPermitePrecarga({ saveData: true, effectiveType: '4g' })).toBe(false)
  })
  it('con conexión lenta, no; con 4g, sí', () => {
    for (const t of ['slow-2g', '2g', '3g']) expect(conexionPermitePrecarga({ effectiveType: t }), t).toBe(false)
    expect(conexionPermitePrecarga({ effectiveType: '4g' })).toBe(true)
  })
})
