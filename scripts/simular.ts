// Simulador headless: juega el motor REAL (GameEngine) miles de veces.
// Uso:  npx vite-node scripts/simular.ts [partidasPorCelda]
// No toca DOM ni localStorage. Reproduce el orden de main.ts:
//   selectNode -> applyDecision -> advanceConquistador -> (captura => _conq_catch).
import { createInitialState, totalM, type GameState } from '../src/core/GameState'
import { applyDecision, advanceConquistador, selectNode } from '../src/core/GameEngine'
import { applyDecisionFX } from '../src/core/StatSystem'
import { NODES_DEF } from '../src/data/nodes'
import { EVENTS_DEF } from '../src/data/events'
import type { Decision, Difficulty, NodeState } from '../src/data/types'

type Politica = 'azar' | 'primera' | 'codiciosa' | 'optima' | 'desgarro'
// SOLO=desgarro  -> corre unicamente la politica que busca el final «desgarro» (moral < 35)
const POLITICAS: Politica[] = process.env.SOLO === 'desgarro' ? ['desgarro'] : ['azar', 'primera', 'codiciosa', 'optima']
const DIFFS: Difficulty[] = ['educativo', 'historico', 'legendario']

// ── rutas n00 -> n09 (9) ─────────────────────────────
function rutas(): string[][] {
  const out: string[][] = []
  const rec = (n: string, p: string[]) => {
    const q = [...p, n]
    if (n === 'n09') return void out.push(q)
    for (const d of NODES_DEF[n]!.next) rec(d, q)
  }
  rec('n00', [])
  return out
}

// utilidad: lo que el propio juego premia (supervivientes) + colchón de recursos
function utilidad(gs: GameState): number {
  const s = gs.stats
  return totalM(s) * 3 + (s.food + s.salud) * 0.3 + (s.moral + s.union) * 0.2 + gs.alliances.length * 4
}

function elegir(gs: GameState, decs: Decision[], pol: Politica, rollout: (g: GameState, d: Decision) => number): number {
  if (pol === 'azar') return Math.floor(Math.random() * decs.length)
  if (pol === 'primera') return 0
  if (pol === 'desgarro') {
    let best = 0, bv = Infinity
    decs.forEach((d, i) => { const v = (d.effects.moral ?? 0) - 0.1 * ((d.effects.warriors ?? 0) + (d.effects.shamans ?? 0) + (d.effects.civilians ?? 0)); if (v < bv) { bv = v; best = i } })
    return best
  }
  if (pol === 'codiciosa') {
    let best = 0, bv = -Infinity
    decs.forEach((d, i) => {
      const fx = applyDecisionFX(gs.stats, d.effects, gs.diff).stats
      const v = utilidad({ ...gs, stats: fx, alliances: d.allianceKey && !gs.alliances.includes(d.allianceKey) ? [...gs.alliances, d.allianceKey] : gs.alliances })
      if (v > bv) { bv = v; best = i }
    })
    return best
  }
  // optima aproximada: promedio de rollouts al azar hasta el final
  let best = 0, bv = -Infinity
  decs.forEach((d, i) => { const v = rollout(gs, d); if (v > bv) { bv = v; best = i } })
  return best
}

interface Resultado {
  fin: 'victoria' | 'derrota'
  badge: string
  m: number
  nodoFinal: string
  turnos: number
  capturas: number
  alianzas: number
  anomalias: string[]
  curva: { food: number; moral: number; salud: number; union: number; m: number }[]
}

function chequear(gs: GameState, donde: string, an: string[]) {
  for (const [k, v] of Object.entries(gs.stats)) {
    if (!Number.isFinite(v) || v < 0 || ((k === 'food' || k === 'moral' || k === 'salud' || k === 'union') && v > 100)) an.push(`${donde}: ${k}=${v}`)
  }
}

function jugar(diff: Difficulty, ruta: string[] | null, pol: Politica, profundidad = 0): Resultado {
  let gs = createInitialState(diff, 'Sim')
  const an: string[] = []
  const curva: Resultado['curva'] = []
  let capturas = 0
  let idx = 0
  let guard = 0

  const rolloutFn = (g: GameState, d: Decision): number => {
    const N = 6
    let tot = 0
    for (let r = 0; r < N; r++) tot += resolver(g, d)
    return tot / N
  }
  // un paso de rollout: aplica d y completa la partida al azar
  const resolver = (g: GameState, d: Decision): number => {
    const res = jugarDesde(g, d)
    return res
  }

  // aplica la decision d en el estado g (nodo actual ya seleccionado) y sigue al azar
  const jugarDesde = (g0: GameState, d0: Decision): number => {
    let g = g0
    let r = applyDecision(g, d0)
    g = r.state
    if (r.finished) return r.defeated ? 0 : totalM(g.stats) + 20
    let g2 = 0
    for (;;) {
      if (++g2 > 80) return 0
      const c = advanceConquistador(g)
      g = c.state
      if (c.caught) {
        const f = capturar(g)
        if (f.finished) return f.defeated ? 0 : totalM(f.state.stats)
        g = f.state
      }
      const sig = Object.values(g.nodes).filter((n) => n.unlocked && !n.completed && n.unlockedFrom === g.history[g.history.length - 1])
      if (!sig.length) return totalM(g.stats)
      let nn = sig[Math.floor(Math.random() * sig.length)]!
      if (g.history[g.history.length - 1] === undefined) nn = g.nodes['n00']!
      g = selectNode(g, nn.id)
      const ev = EVENTS_DEF[g.nodes[nn.id]!.eventId!]!
      r = applyDecision(g, ev.decisions[Math.floor(Math.random() * ev.decisions.length)]!)
      g = r.state
      if (r.finished) return r.defeated ? 0 : totalM(g.stats) + 20
    }
  }

  function capturar(g: GameState): { state: GameState; finished: boolean; defeated: boolean } {
    const catchNode: NodeState = {
      id: '_conq_catch_node', name: 'x', desc: '', icon: '', lon: 0, lat: 0,
      act: (g.nodes[g.currentNode ?? g.history[g.history.length - 1] ?? 'n00']?.act ?? 2) as 1 | 2 | 3 | 4,
      eventPool: ['_conq_catch'], eventId: '_conq_catch', completed: false, unlocked: true, next: [],
    }
    let s: GameState = { ...g, nodes: { ...g.nodes, _conq_catch_node: catchNode }, currentNode: '_conq_catch_node' }
    const decs = EVENTS_DEF['_conq_catch']!.decisions
    const di = pol === 'primera' ? 0 : pol === 'azar' ? Math.floor(Math.random() * decs.length) : pol === 'desgarro' ? 2 : -1
    let pick = di
    if (pick < 0) { let bv = -Infinity; decs.forEach((d, i) => { const v = utilidad({ ...s, stats: applyDecisionFX(s.stats, d.effects, s.diff).stats }); if (v > bv) { bv = v; pick = i } }) }
    const r = applyDecision(s, decs[pick]!)
    s = r.state
    if (r.finished) return { state: s, finished: true, defeated: r.defeated }
    const prev = s.history.filter((id) => id !== '_conq_catch_node')
    s = {
      ...s, history: prev, currentNode: prev[prev.length - 1] ?? s.currentNode,
      nodes: Object.fromEntries(Object.entries(s.nodes).filter(([k]) => k !== '_conq_catch_node')),
      conq: { ...s.conq, caught: false, reorgTurns: 2 },
    }
    return { state: s, finished: false, defeated: false }
  }

  for (;;) {
    if (++guard > 120) throw new Error('bucle infinito en la simulacion')
    // elegir nodo
    const last = gs.history[gs.history.length - 1]
    const cand = Object.values(gs.nodes).filter((n) => n.unlocked && !n.completed && (last === undefined ? n.id === 'n00' : n.unlockedFrom === last))
    if (!cand.length) throw new Error(`sin nodos disponibles tras ${last}`)
    let nodo: NodeState
    if (ruta && idx < ruta.length) nodo = gs.nodes[ruta[idx]!]!
    else nodo = cand[Math.floor(Math.random() * cand.length)]!
    if (!cand.some((c) => c.id === nodo.id)) throw new Error(`ruta invalida: ${nodo.id} no disponible`)
    idx++
    gs = selectNode(gs, nodo.id)
    const ev = EVENTS_DEF[gs.nodes[nodo.id]!.eventId!]!
    const di = elegir(gs, ev.decisions, pol, rolloutFn)
    const r = applyDecision(gs, ev.decisions[di]!)
    gs = r.state
    chequear(gs, nodo.id, an)
    curva.push({ food: gs.stats.food, moral: gs.stats.moral, salud: gs.stats.salud, union: gs.stats.union, m: totalM(gs.stats) })
    if (r.finished) {
      return { fin: r.defeated ? 'derrota' : 'victoria', badge: r.ending?.badge ?? '?', m: totalM(gs.stats), nodoFinal: nodo.id, turnos: gs.history.length, capturas, alianzas: gs.alliances.length, anomalias: an, curva }
    }
    const c = advanceConquistador(gs)
    gs = c.state
    if (c.caught) {
      capturas++
      const f = capturar(gs)
      gs = f.state
      chequear(gs, '_conq', an)
      if (f.finished) return { fin: f.defeated ? 'derrota' : 'victoria', badge: 'captura', m: totalM(gs.stats), nodoFinal: '_conq_catch_node', turnos: gs.history.length, capturas, alianzas: gs.alliances.length, anomalias: an, curva }
    }
  }
}

// ── corrida ──────────────────────────────────────────
const N = Number(process.argv[2] ?? 300)
const rs = rutas()
console.log(`rutas n00->n09: ${rs.length}; partidas por celda: ${N} (optima: ${Math.max(10, Math.floor(N / 10))})`)
const global: Record<string, { n: number; win: number; m: number }> = {}
const muertes: Record<string, number> = {}
const badges: Record<string, number> = {}
const anomalias: string[] = []
const curvaAcum: Record<string, number[][]> = {}

for (const diff of DIFFS) {
  for (const pol of POLITICAS) {
    const n = pol === 'optima' ? Math.max(10, Math.floor(N / 10)) : N
    const fila: string[] = []
    let tw = 0, tn = 0, tm = 0
    rs.forEach((ruta, ri) => {
      let w = 0, msum = 0
      for (let i = 0; i < n; i++) {
        const r = jugar(diff, ruta, pol)
        if (r.fin === 'victoria') w++
        msum += r.m
        tn++
        if (r.fin === 'derrota') muertes[`${diff}/${r.nodoFinal}`] = (muertes[`${diff}/${r.nodoFinal}`] ?? 0) + 1
        else badges[`${diff}/${pol}/${r.badge}`] = (badges[`${diff}/${pol}/${r.badge}`] ?? 0) + 1
        if (r.anomalias.length) anomalias.push(...r.anomalias.slice(0, 2))
        if (pol === 'azar') {
          const key = `${diff}`
          const cur = (curvaAcum[key] ??= [])
          r.curva.forEach((c, k) => { (cur[k] ??= [0, 0, 0, 0, 0, 0]); cur[k]![0]! += c.food; cur[k]![1]! += c.moral; cur[k]![2]! += c.salud; cur[k]![3]! += c.union; cur[k]![4]! += c.m; cur[k]![5]! += 1 })
        }
      }
      tw += w; tm += msum
      fila.push(`${Math.round((w / n) * 100)}`)
      void ri
    })
    const k = `${diff}/${pol}`
    global[k] = { n: tn, win: tw, m: tm / tn }
    console.log(`${diff.padEnd(10)} ${pol.padEnd(9)} victoria% por ruta [${fila.join(' ')}]  total=${Math.round((tw / tn) * 100)}%  m medio=${(tm / tn).toFixed(1)}`)
  }
}
console.log('\n== muertes por (dificultad/nodo), top 15 ==')
Object.entries(muertes).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([k, v]) => console.log(`${k}: ${v}`))
console.log('\n== finales alcanzados ==')
Object.entries(badges).sort().forEach(([k, v]) => console.log(`${k}: ${v}`))
console.log('\n== anomalias de rango ==', anomalias.length, anomalias.slice(0, 10))
console.log('\n== curva media (azar) por turno: food moral salud union m ==')
for (const [d, cur] of Object.entries(curvaAcum)) {
  console.log(d + ': ' + cur.filter((_, i) => i % 3 === 0).map((c, i) => `t${i * 3 + 1}[${[0, 1, 2, 3, 4].map((j) => Math.round(c[j]! / c[5]!)).join(',')}]`).join(' '))
}
