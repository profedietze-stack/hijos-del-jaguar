// Tramos del rastro de la tribu en el mapa. Puro y tolerante: un GameState armado a mano
// (sin history, con nodes parcial) no puede tirar TypeError al dibujar.

export interface TrailPoint { lon: number; lat: number }

interface TrailSource {
  history?: unknown
  nodes?: unknown
}

const esPunto = (n: unknown): n is TrailPoint =>
  typeof n === 'object' && n !== null &&
  Number.isFinite((n as TrailPoint).lon) && Number.isFinite((n as TrailPoint).lat)

/** Pares consecutivos de nodos visitados con coordenadas válidas (ignora el nodo virtual de captura). */
export function tribeTrailSegments(gs: TrailSource): [TrailPoint, TrailPoint][] {
  const hist = Array.isArray(gs.history) ? gs.history.filter((id): id is string => typeof id === 'string' && id !== '_conq_catch_node') : []
  const nodes = (typeof gs.nodes === 'object' && gs.nodes !== null ? gs.nodes : {}) as Record<string, unknown>
  const out: [TrailPoint, TrailPoint][] = []
  for (let i = 0; i < hist.length - 1; i++) {
    const a = nodes[hist[i]!], b = nodes[hist[i + 1]!]
    if (esPunto(a) && esPunto(b)) out.push([a, b])
  }
  return out
}
