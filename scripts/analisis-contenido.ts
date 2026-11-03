// Análisis estático de decisiones: dominancia, sesgo de posición, longitudes.
// Uso:  npx vite-node scripts/analisis-contenido.ts
import { EVENTS_DEF } from '../src/data/events'
import { NODES_DEF } from '../src/data/nodes'
import type { Decision } from '../src/data/types'

const K = ['food', 'moral', 'salud', 'union', 'warriors', 'shamans', 'civilians'] as const
const v = (d: Decision, k: (typeof K)[number]) => d.effects[k] ?? 0

// utilidad con los pesos del propio juego: lo que decide el final es m (supervivientes),
// la moral (<35 => desgarro), y las alianzas; food/salud evitan muertes.
const util = (d: Decision) =>
  3 * (v(d, 'warriors') + v(d, 'shamans') + v(d, 'civilians')) +
  0.35 * (v(d, 'food') + v(d, 'salud')) + 0.25 * (v(d, 'moral') + v(d, 'union')) + (d.allianceKey ? 4 : 0)

const dominaA = (a: Decision, b: Decision) =>
  K.every((k) => v(a, k) >= v(b, k)) && K.some((k) => v(a, k) > v(b, k)) && (!b.allianceKey || !!a.allianceKey)

const enPool = new Set(Object.values(NODES_DEF).flatMap((n) => n.eventPool))
let eventos = 0, conDominada = 0, trivial = 0, paresDom = 0
const posMejor: number[] = [0, 0, 0, 0]
const posPeor: number[] = [0, 0, 0, 0]
const triviales: string[] = []
const largos: string[] = []
let empates = 0
for (const [id, ev] of Object.entries(EVENTS_DEF)) {
  if (!enPool.has(id)) continue
  eventos++
  const ds = ev.decisions
  let hayDom = false
  ds.forEach((a, i) => ds.forEach((b, j) => { if (i !== j && dominaA(a, b)) { paresDom++; hayDom = true } }))
  if (hayDom) conDominada++
  if (ds.some((a, i) => ds.every((b, j) => i === j || dominaA(a, b)))) { trivial++; triviales.push(id) }
  const us = ds.map(util)
  const max = Math.max(...us), min = Math.min(...us)
  if (us.filter((u) => u === max).length > 1) empates++
  posMejor[us.indexOf(max)]!++
  posPeor[us.indexOf(min)]!++
  ds.forEach((d, i) => { if (d.text.length > 170) largos.push(`${id}[${i}] ${d.text.length}`) })
}
console.log(`eventos en pool=${eventos}; con alguna opción dominada=${conDominada}; con opción dominante sobre todas=${trivial}; pares dominados=${paresDom}`)
console.log('posición de la MEJOR (utilidad del juego): ', posMejor.slice(0, 3).map((n) => `${((n / eventos) * 100).toFixed(1)}%`).join(' / '), `(empates ${empates})`)
console.log('posición de la PEOR:                       ', posPeor.slice(0, 3).map((n) => `${((n / eventos) * 100).toFixed(1)}%`).join(' / '))
console.log('triviales:', triviales.join(', '))
console.log('decisiones >170 chars:', largos.length, largos.slice(0, 8).join('; '))

// alianzas: familias con claves duplicadas
const claves = Object.entries(EVENTS_DEF).flatMap(([id, e]) => e.decisions.flatMap((d) => d.allianceKey ? [[d.allianceKey, id] as const] : []))
const fam: Record<string, string[]> = {}
for (const [k] of claves) { const base = k.replace(/(_.*|es|s)$/, ''); (fam[base] ??= []).push(k) }
console.log('familias de alianza con >1 clave:', Object.entries(fam).filter(([, a]) => new Set(a).size > 1).map(([b, a]) => `${b}: ${[...new Set(a)].join('|')}`).join('  ||  '))
console.log('total claves de alianza distintas:', new Set(claves.map(([k]) => k)).size)

// ¿cuántas alianzas puede juntar una ruta?  (máximo por ruta, 1 decisión con alianza por evento)
const rec = (n: string, acc: number, best: { v: number }) => {
  const nd = NODES_DEF[n]!
  const maxA = Math.max(...nd.eventPool.map((e) => EVENTS_DEF[e]!.decisions.filter((d) => d.allianceKey).length ? 1 : 0))
  const a2 = acc + maxA
  if (!nd.next.length) { best.v = Math.max(best.v, a2); return }
  nd.next.forEach((d) => rec(d, a2, best))
}
const best = { v: 0 }; rec('n00', 0, best)
console.log('máximo de nodos con oportunidad de alianza en una ruta completa:', best.v)
