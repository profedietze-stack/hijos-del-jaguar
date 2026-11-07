import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { EVENTS_DEF } from '../../data/events'
import { NODES_DEF } from '../../data/nodes'
import { CLASE_DATA } from '../../data/claseData'

/*
  Banco de eventos: lo que no rompe nada ni sale en ningún log, pero se le nota al alumno.
  Un término que se toca y no abre nada, una etiqueta sin cerrar que se come el resto del
  párrafo, un evento que dice «Acto I» y está en el mapa del acto III.
  (Este juego no tiene respuesta correcta: sus decisiones se prueban en contenido.test.ts.)
*/

const dom = readFileSync(fileURLToPath(new URL('../../ui/dom.ts', import.meta.url)), 'utf8')
const eventos = Object.entries(EVENTS_DEF)

/** Claves del diccionario de ventanas de término (MODAL_DEFS no se exporta). */
const modales = new Set(
  [...dom.slice(dom.indexOf('const MODAL_DEFS'), dom.indexOf('export function showModal')).matchAll(/^ {2}(\w+): *\{/gm)].map((m) => m[1]!),
)

describe('términos tocables de la narración', () => {
  it('el diccionario de ventanas se leyó y la narración lo usa (si no, los demás tests no prueban nada)', () => {
    expect(modales.size).toBeGreaterThanOrEqual(3)
    const usos = eventos.reduce((n, [, e]) => n + (e.narr.match(/data-modal="/g) ?? []).length, 0)
    expect(usos).toBeGreaterThan(0)
  })

  it('todo data-modal apunta a una ventana que existe', () => {
    const mal = eventos.flatMap(([id, e]) =>
      [...e.narr.matchAll(/data-modal="([^"]*)"/g)].filter((m) => !modales.has(m[1]!)).map((m) => `${id}: «${m[1]}»`))
    expect(mal).toEqual([])
  })

  it('todo término con tooltip (.tt) trae su explicación', () => {
    const mal = eventos.flatMap(([id, e]) =>
      [...e.narr.matchAll(/<span class="tt"([^>]*)>/g)]
        .filter((m) => !/data-tip="[^"]{8,}"/.test(m[1]!))
        .map(() => id))
    expect(mal).toEqual([])
  })
})

describe('HTML propio de la narración', () => {
  const ETIQUETAS = ['span', 'em', 'strong', 'b', 'i']

  it('toda etiqueta que se abre se cierra', () => {
    const mal = eventos.flatMap(([id, e]) => ETIQUETAS.flatMap((t) => {
      const abre = (e.narr.match(new RegExp(`<${t}[\\s>]`, 'g')) ?? []).length
      const cierra = (e.narr.match(new RegExp(`</${t}>`, 'g')) ?? []).length
      return abre === cierra ? [] : [`${id}: <${t}> ${abre} abre / ${cierra} cierra`]
    }))
    expect(mal).toEqual([])
  })

  it('ninguna narración trae scripts ni manejadores de eventos', () => {
    const mal = eventos.filter(([, e]) => /<script|\son\w+\s*=|javascript:/i.test(e.narr + e.title + e.cap)).map(([id]) => id)
    expect(mal).toEqual([])
  })
})

describe('decisiones distintas entre sí', () => {
  it('ningún evento repite el texto de una decisión', () => {
    const mal = eventos.filter(([, e]) => new Set(e.decisions.map((d) => d.text.trim())).size !== e.decisions.length).map(([id]) => id)
    expect(mal).toEqual([])
  })

  it('ni dos decisiones con exactamente los mismos efectos (serían la misma elección)', () => {
    const firma = (d: (typeof EVENTS_DEF)[string]['decisions'][number]) =>
      JSON.stringify(Object.entries(d.effects).filter(([, v]) => v).sort(([a], [b]) => a.localeCompare(b)))
    const mal = eventos.filter(([, e]) => {
      const f = e.decisions.map(firma)
      return new Set(f).size !== f.length
    }).map(([id]) => id)
    expect(mal).toEqual([])
  })
})

describe('el acto del evento es el del mapa donde aparece', () => {
  const ROMANO: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 }

  it('la etiqueta «Acto N» de cada evento coincide con el acto de los nodos que lo usan', () => {
    const mal: string[] = []
    for (const n of Object.values(NODES_DEF)) {
      for (const eid of n.eventPool) {
        const e = EVENTS_DEF[eid]
        const m = e?.act.match(/^Acto (I{1,3}|IV)\b/)
        if (m && ROMANO[m[1]!] !== n.act) mal.push(`${eid} dice «${e!.act}» pero ${n.id} es del acto ${n.act}`)
      }
    }
    expect(mal).toEqual([])
  })
})

describe('fichas del modo clase', () => {
  const fichas = Object.entries(CLASE_DATA)

  it('cada ficha es de un evento que existe (si no, nunca se muestra)', () => {
    expect(fichas.filter(([id]) => !EVENTS_DEF[id]).map(([id]) => id)).toEqual([])
  })

  it('toda ficha trae contexto y una pregunta que es una pregunta', () => {
    const mal = fichas.filter(([, f]) => f.contexto.trim().length < 60 || !/\?\s*$/.test(f.pregunta.replace(/<[^>]+>/g, '').trim())).map(([id]) => id)
    expect(mal).toEqual([])
  })
})
