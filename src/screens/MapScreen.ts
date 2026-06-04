import type { GameState } from '../core/GameState.js'
import { NODES_DEF, EDGES, CONQ_BRIDGE } from '../data/nodes.js'
import { showNotif } from '../ui/dom.js'
import { sfxCinematic, sfxNodeHover } from '../ui/audio.js'
import * as d3Lib from 'd3'
import * as topojson from 'topojson-client'

// ══════════════════════════════════════════════════════
// MAP SCREEN — renderizado D3 del mapa interactivo
// ══════════════════════════════════════════════════════

type D3Lib = typeof d3Lib

// ── Estado del mapa ───────────────────────────────────

let mapSvg:  ReturnType<D3Lib['select']> | null = null
let mapG:    ReturnType<D3Lib['select']> | null = null
let mapProj: ReturnType<D3Lib['geoMercator']> | null = null
let mapZoom: ReturnType<D3Lib['zoom']> | null = null
let _mapInitialized = false
let _topoCache: unknown = null
let _topoFetchPromise: Promise<unknown> | null = null
let _conqAnimating = false

const TOPO_STORAGE_KEY = 'jaguar_topo_v1'

// ── Nombres de actos ──────────────────────────────────

const ACT_NAMES: Record<number, string> = {
  1: 'Acto I · Huida',
  2: 'Acto II · Travesía',
  3: 'Acto III · El Sur',
  4: 'Acto IV · El Destino',
}

// ── Marcadores históricos ─────────────────────────────

interface HistMarker {
  id:        string
  lon:       number
  lat:       number
  act:       number
  icon:      string
  label:     string
  tip:       string
  year:      string
  narr:      string
  conquered: boolean   // true → mostrar efecto de fuego + token conquistador
}

const HIST_MARKERS: HistMarker[] = [
  { id: 'hm_cajamarca', lon: -78.5, lat: -7.2,  act: 2, icon: '⚔️', label: 'Cajamarca',
    conquered: true,
    year: '1532',
    tip:  '1532 — Pizarro captura al Inca Atahualpa con 168 hombres contra 80.000 guerreros.',
    narr: 'Francisco Pizarro captura al Inca Atahualpa. Con 168 hombres, caballos y cañones derrota a 80.000 guerreros. El Imperio Inca, el más grande de América, colapsa en una tarde.' },
  { id: 'hm_cusco',     lon: -72.0, lat: -13.5, act: 2, icon: '🏛️', label: 'Cusco',
    conquered: true,
    year: '1533',
    tip:  '1533 — Pizarro ejecuta a Atahualpa y entra a Cusco. El Tawantinsuyu se desintegra.',
    narr: 'Pizarro ejecuta a Atahualpa y entra a Cusco, la ciudad sagrada del Sol. El Tawantinsuyu — 2 millones de km², 12 millones de personas — se desintegra sin su cabeza.' },
  { id: 'hm_panama',    lon: -80.2, lat: 8.2,   act: 2, icon: '⚓', label: 'Panamá',
    conquered: true,
    year: '1519',
    tip:  '1519 — Fundación de Panamá. Base de operaciones de Pizarro hacia Sudamérica.',
    narr: 'Pedrarias Dávila funda la Ciudad de Panamá. Desde aquí parten las expediciones que conquistarán el sur. La máquina colonial se extiende.' },
  { id: 'hm_potosi',    lon: -65.7, lat: -19.6, act: 3, icon: '⛏️', label: 'Potosí',
    conquered: true,
    year: '1545',
    tip:  '1545 — El Cerro Rico: 40.000 toneladas de plata extraídas. Millones muertos en la mita.',
    narr: 'Descubrimiento del Cerro Rico de Potosí. La mina de plata más grande del mundo colonial. En tres siglos extraerán 40.000 toneladas. El precio: millones de muertos indígenas en la mita.' },
  { id: 'hm_tucuman',   lon: -65.2, lat: -26.8, act: 3, icon: '🏰', label: 'Tucumán',
    conquered: true,
    year: '1553',
    tip:  '1553 — Primera ciudad permanente en el Cono Sur. La expansión colonial llega al sur.',
    narr: 'Diego de Villaroel funda Santiago del Estero, primera ciudad permanente del actual territorio argentino. La expansión colonial alcanza el Cono Sur. No queda tierra sin mano de España.' },
  { id: 'hm_arauco',    lon: -73.0, lat: -37.5, act: 4, icon: '🦅', label: 'Guerra de Arauco',
    conquered: false,
    year: '1550–1810',
    tip:  '1550–1810 — Los mapuches resisten 260 años. El Biobío: frontera que España nunca cruzó.',
    narr: 'Los mapuches inician 260 años de guerra continua. El único pueblo que España nunca pudo conquistar. El río Biobío se convierte en frontera permanente — tierra que el Imperio nunca cruzó.' },
]

// ── Registro de marcadores ya mostrados (para cinemática única) ───────────
let _shownHistMarkers  = new Set<string>()
// ── Registro de marcadores que ya tienen token del conquistador ────────────
let _conqueredMarkers  = new Set<string>()

// ── Helpers ───────────────────────────────────────────

/** Último nodo completado del historial */
function lastCompleted(gs: GameState): string | null {
  return gs.history.length > 0 ? gs.history[gs.history.length - 1] : null
}

/** Nodo (bridge o jugador) donde está el conquistador */
function conqCurrentNode(gs: GameState): { lon: number; lat: number; name?: string } | null {
  const ri = gs.conq.routeIdx
  if (ri < CONQ_BRIDGE.length) return CONQ_BRIDGE[ri]
  const nodeId = gs.history[ri - CONQ_BRIDGE.length]
  return nodeId ? gs.nodes[nodeId] : null
}

// ── Geo-tip ───────────────────────────────────────────

function showGeoTip(ev: MouseEvent, html: string): void {
  const tip = document.getElementById('geo-tip')
  if (!tip) return
  tip.innerHTML = html
  tip.style.display = 'block'
  const PAD = 14
  tip.style.left = `${Math.min(ev.clientX + PAD, window.innerWidth  - tip.offsetWidth  - PAD)}px`
  tip.style.top  = `${Math.min(ev.clientY + PAD, window.innerHeight - tip.offsetHeight - PAD)}px`
}

function hideGeoTip(): void {
  const tip = document.getElementById('geo-tip')
  if (tip) tip.style.display = 'none'
}

// ── Camino de la tribu ────────────────────────────────

const TRIBE_TRAIL_COLOR     = 'rgba(107,184,74,.75)'
const TRIBE_TRAIL_GLOW      = 'rgba(45,90,30,.35)'
const TRIBE_FOOTPRINT_COLOR = 'rgba(196,136,42,.55)'

function _footprintPositions(x1: number, y1: number, x2: number, y2: number, count: number) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return []
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const pts: { x: number; y: number; angle: number }[] = []
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1)
    const side = i % 2 === 0 ? 1 : -1
    const perpRad = (angle + 90) * (Math.PI / 180)
    pts.push({ x: x1 + dx * t + side * 2.5 * Math.cos(perpRad), y: y1 + dy * t + side * 2.5 * Math.sin(perpRad), angle })
  }
  return pts
}

function _drawStaticFootprints(g: ReturnType<D3Lib['select']>, x1: number, y1: number, x2: number, y2: number): void {
  _footprintPositions(x1, y1, x2, y2, 5).forEach(p => {
    g.append('g').attr('transform', `translate(${p.x},${p.y}) rotate(${p.angle})`).attr('pointer-events', 'none')
      .append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '7px').attr('opacity', '.55').attr('fill', TRIBE_FOOTPRINT_COLOR)
      .attr('pointer-events', 'none').text('👣')
  })
}

export function drawTribePath(gs: GameState): void {
  if (!mapG || !mapProj) return
  mapG.selectAll('.tribe-trail').remove()
  const tg = mapG.insert('g', '.ng').attr('class', 'tribe-trail').attr('pointer-events', 'none')
  const hist = gs.history.filter(id => id !== '_conq_catch_node')
  if (hist.length < 2) return
  for (let i = 0; i < hist.length - 1; i++) {
    const a = gs.nodes[hist[i]], b = gs.nodes[hist[i + 1]]
    if (!a || !b) continue
    const [ax, ay] = mapProj([a.lon, a.lat]) as [number, number]
    const [bx, by] = mapProj([b.lon, b.lat]) as [number, number]
    tg.append('line').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by)
      .attr('stroke', TRIBE_TRAIL_GLOW).attr('stroke-width', 5).attr('stroke-linecap', 'round')
    tg.append('line').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by)
      .attr('stroke', TRIBE_TRAIL_COLOR).attr('stroke-width', 1.6)
      .attr('stroke-dasharray', '7,4').attr('stroke-linecap', 'round')
    _drawStaticFootprints(tg as unknown as ReturnType<D3Lib['select']>, ax, ay, bx, by)
  }
}

export function animateTribeStep(gs: GameState, fromNd: { lon: number; lat: number }, toNd: { lon: number; lat: number }): void {
  if (!mapG || !mapProj) return
  const [ax, ay] = mapProj([fromNd.lon, fromNd.lat]) as [number, number]
  const [bx, by] = mapProj([toNd.lon,  toNd.lat])   as [number, number]
  let tg = mapG.select('.tribe-trail')
  if (tg.empty()) tg = mapG.insert('g', '.ng').attr('class', 'tribe-trail').attr('pointer-events', 'none') as unknown as ReturnType<D3Lib['select']>
  tg.append('line').attr('x1', ax).attr('y1', ay).attr('x2', ax).attr('y2', ay)
    .attr('stroke', TRIBE_TRAIL_GLOW).attr('stroke-width', 5).attr('stroke-linecap', 'round')
    .transition().duration(1100).ease(d3Lib.easeCubicOut).attr('x2', bx).attr('y2', by)
  tg.append('line').attr('x1', ax).attr('y1', ay).attr('x2', ax).attr('y2', ay)
    .attr('stroke', TRIBE_TRAIL_COLOR).attr('stroke-width', 1.6)
    .attr('stroke-dasharray', '7,4').attr('stroke-linecap', 'round')
    .transition().duration(1100).ease(d3Lib.easeCubicOut).attr('x2', bx).attr('y2', by)
  _footprintPositions(ax, ay, bx, by, 5).forEach((p, i) => {
    const fg = (tg as ReturnType<D3Lib['select']>).append('g')
      .attr('transform', `translate(${p.x},${p.y}) rotate(${p.angle})`).attr('pointer-events', 'none').attr('opacity', 0)
    fg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '7px').attr('fill', TRIBE_FOOTPRINT_COLOR).attr('pointer-events', 'none').text('👣')
    fg.transition().delay(500 + i * 180).duration(450).ease(d3Lib.easeCubicOut).attr('opacity', .55)
  })
  // suppress unused warning
  void gs
}

// ── Marcadores históricos ─────────────────────────────

function drawHistMarkers(gs: GameState): void {
  if (!mapG || !mapProj || !gs.nodes) return
  mapG.selectAll('.hist-marker').remove()
  const currentAct = (() => {
    const last = lastCompleted(gs)
    return last && gs.nodes[last] ? gs.nodes[last].act : 1
  })()
  HIST_MARKERS.filter(m => m.act <= currentAct).forEach(m => {
    const [mx, my] = mapProj!([m.lon, m.lat]) as [number, number]
    const mg = mapG!.append('g').attr('class', 'hist-marker').attr('pointer-events', 'all')
      .attr('cursor', 'help').attr('transform', `translate(${mx},${my})`).attr('opacity', 0)
    mg.append('circle').attr('r', 9).attr('fill', 'rgba(60,20,5,.65)').attr('stroke', 'rgba(200,140,50,.7)').attr('stroke-width', 1.2)
    mg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central').attr('font-size', '10px').attr('pointer-events', 'none').text(m.icon)
    mg.append('rect').attr('x', -24).attr('y', 10).attr('width', 48).attr('height', 10).attr('fill', 'rgba(6,2,2,.75)').attr('rx', 2).attr('pointer-events', 'none')
    mg.append('text').attr('text-anchor', 'middle').attr('y', 17).attr('font-size', '5.5px').attr('font-family', 'Cinzel,serif').attr('fill', 'rgba(200,160,60,.9)').attr('pointer-events', 'none').text(m.label.toUpperCase())
    mg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev, `<strong style="color:#d4a017">${m.icon} ${m.label}</strong><br>${m.tip}`))
      .on('mouseleave', hideGeoTip)
    mg.transition().duration(800).ease(d3Lib.easeCubicOut).attr('opacity', 1)

    // Si ya fue mostrado en cinemática: token del conquistador fijo al lado
    if (_conqueredMarkers.has(m.id)) {
      _drawConqTokenAtPos(mx, my, m)
    }
  })
}

/**
 * Dibuja el token rojo del conquistador (corona + círculo rojo)
 * en la posición SVG (px, py), desplazado a la derecha del marcador.
 * Se inserta dentro del .hist-marker del marcador correspondiente.
 */
function _drawConqTokenAtPos(px: number, py: number, m: HistMarker): void {
  if (!mapG) return
  // offset: corona a la derecha del ícono del marcador
  const ox = 18, oy = -8
  const cg = mapG.append('g')
    .attr('class', 'hist-marker hist-conq-token')
    .attr('transform', `translate(${px + ox},${py + oy})`)
    .attr('pointer-events', 'all').attr('cursor', 'help')

  // Pulso exterior
  const pulse = cg.append('circle').attr('r', 11).attr('fill', 'none')
    .attr('stroke', 'rgba(192,57,43,.55)').attr('stroke-width', 1.2)
  pulse.append('animate').attr('attributeName', 'r').attr('values', '11;16;11')
    .attr('dur', '2.2s').attr('repeatCount', 'indefinite')

  // Círculo rojo del conquistador
  cg.append('circle').attr('r', 9).attr('fill', 'rgba(100,15,15,.88)')
    .attr('stroke', 'rgba(220,60,40,.9)').attr('stroke-width', 1.8)
  cg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
    .attr('font-size', '10px').attr('pointer-events', 'none').text('👑')

  // Fuego pequeño si ciudad conquistada
  if (m.conquered) {
    cg.append('text').attr('text-anchor', 'middle').attr('y', -11)
      .attr('font-size', '8px').attr('pointer-events', 'none').attr('opacity', '.85').text('🔥')
  }

  const tipHtml = `<strong style="color:#e07070">👑 Conquistado — ${m.year}</strong><br>${m.tip}`
  cg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev, tipHtml))
    .on('mouseleave', hideGeoTip)
}

// ── Token del jugador (tribu) ─────────────────────────

const PLAYER_FILL   = 'rgba(20,80,30,.88)'
const PLAYER_STROKE = 'rgba(70,200,80,.9)'
const PLAYER_PULSE  = 'rgba(60,180,60,.55)'

/**
 * Dibuja el token de la tribu del jugador.
 * Prioridad de posición: overrideNd > último nodo completado > n00 (inicio).
 * Así el token es visible desde el primer frame de la partida.
 */
export function drawPlayerToken(gs: GameState, overrideNd?: { lon: number; lat: number }): void {
  if (!mapG || !mapProj) return
  mapG.selectAll('.player-token-layer').remove()

  // Determinar posición: override → último completado → n00 (inicio de partida)
  let nd: { lon: number; lat: number } | null = overrideNd ?? null
  if (!nd) {
    const lastId = lastCompleted(gs)
    nd = lastId ? (gs.nodes[lastId] ?? null) : (gs.nodes['n00'] ?? null)
  }
  if (!nd) return

  const [x, y] = mapProj([nd.lon, nd.lat]) as [number, number]
  const token = gs.tribeToken ?? '🦅'
  // Offset: lado izquierdo del nodo (opuesto al conquistador que está a la derecha)
  const OX = -20, OY = -10

  const pg = mapG.append('g')
    .attr('class', 'player-token-layer')
    .attr('transform', `translate(${x + OX},${y + OY})`)
    .attr('pointer-events', 'all')
    .attr('cursor', 'help')

  // Pulso exterior verde
  const pulse = pg.append('circle').attr('r', 14).attr('fill', 'none')
    .attr('stroke', PLAYER_PULSE).attr('stroke-width', 1.2)
  pulse.append('animate').attr('attributeName', 'r').attr('values', '14;20;14')
    .attr('dur', '2.4s').attr('repeatCount', 'indefinite')

  // Halo suave
  pg.append('circle').attr('r', 14).attr('fill', 'none')
    .attr('stroke', 'rgba(70,180,60,.1)').attr('stroke-width', 8)

  // Círculo del jugador
  pg.append('circle').attr('r', 11)
    .attr('fill', PLAYER_FILL)
    .attr('stroke', PLAYER_STROKE).attr('stroke-width', 2)

  // Emoji de la tribu
  pg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
    .attr('font-size', '13px').attr('pointer-events', 'none').text(token)

  // Etiqueta debajo
  pg.append('rect').attr('x', -28).attr('y', 14).attr('width', 56).attr('height', 11)
    .attr('fill', 'rgba(4,8,4,.82)').attr('rx', 2).attr('pointer-events', 'none')
  pg.append('text').attr('text-anchor', 'middle').attr('y', 22)
    .attr('font-size', '6.5px').attr('font-family', 'Cinzel,serif')
    .attr('fill', 'rgba(80,210,90,.95)').attr('pointer-events', 'none').text('TU TRIBU')

  // Tooltip
  const cacique = gs.caciqueName ?? 'Cacique'
  pg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev,
    `<strong style="color:#4fce60">${token} ${cacique}</strong><br>Aquí se encuentra tu pueblo`))
    .on('mouseleave', hideGeoTip)
}

/**
 * Anima el token tribal deslizándose de fromNd a toNd.
 * Se llama desde main.ts después de que el jugador completa un nodo.
 */
export function animatePlayerToken(
  fromNd: { lon: number; lat: number },
  toNd:   { lon: number; lat: number },
  gs:     GameState,
): void {
  if (!mapG || !mapProj) return
  const OX = -20, OY = -10
  const [fx, fy] = mapProj([fromNd.lon, fromNd.lat]) as [number, number]
  const [tx, ty] = mapProj([toNd.lon,   toNd.lat])   as [number, number]
  const fxo = fx + OX, fyo = fy + OY
  const txo = tx + OX, tyo = ty + OY
  const token = gs.tribeToken ?? '🦅'

  // Quitar token estático — lo reconstruimos como animación
  mapG.selectAll('.player-token-layer').remove()

  // Línea de trail del movimiento
  mapG.append('line').attr('class', 'player-token-layer')
    .attr('x1', fxo).attr('y1', fyo).attr('x2', fxo).attr('y2', fyo)
    .attr('stroke', 'rgba(70,200,80,.5)').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3').attr('pointer-events', 'none')
    .transition().duration(900).ease(d3Lib.easeCubicInOut)
    .attr('x2', txo).attr('y2', tyo)

  // Token animado
  const slideG = mapG.append('g')
    .attr('class', 'player-token-layer player-token-anim')
    .attr('transform', `translate(${fxo},${fyo})`)
    .attr('pointer-events', 'none')

  slideG.append('circle').attr('r', 14).attr('fill', 'none')
    .attr('stroke', PLAYER_PULSE).attr('stroke-width', 1.2)
  slideG.append('circle').attr('r', 11)
    .attr('fill', PLAYER_FILL).attr('stroke', PLAYER_STROKE).attr('stroke-width', 2)
  slideG.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
    .attr('font-size', '13px').attr('pointer-events', 'none').text(token)

  slideG.transition().duration(900).ease(d3Lib.easeCubicInOut)
    .attr('transform', `translate(${txo},${tyo})`)
    .on('end', () => {
      // Reemplazar animación por token estático definitivo
      drawPlayerToken(gs)
    })
}

/**
 * Animación completa de "movimiento al nodo seleccionado" antes del evento.
 * 1. Pan suave de cámara hacia el destino
 * 2. Huella/camino tribal animado
 * 3. Token del jugador deslizándose desde fromNd → toNd
 * 4. Llama cb() cuando termina (~1200ms)
 *
 * Si fromNd y toNd son la misma posición (inicio en n00), llama cb() inmediatamente.
 */
export function animatePlayerToNode(
  fromNd: { lon: number; lat: number },
  toNd:   { lon: number; lat: number },
  gs:     GameState,
  cb:     () => void,
): void {
  if (!mapG || !mapProj) { cb(); return }

  // Misma posición → no hay movimiento (ej: primer click en n00)
  const samePos = Math.abs(fromNd.lon - toNd.lon) < 0.001 && Math.abs(fromNd.lat - toNd.lat) < 0.001
  if (samePos) { cb(); return }

  const DUR  = 1000  // token slide
  const OX   = -20, OY = -10
  const [fx, fy] = mapProj([fromNd.lon, fromNd.lat]) as [number, number]
  const [tx, ty] = mapProj([toNd.lon,   toNd.lat])   as [number, number]
  const fxo = fx + OX, fyo = fy + OY
  const txo = tx + OX, tyo = ty + OY
  const token = gs.tribeToken ?? '🦅'

  // ── 1. Pan suave de cámara (paralelo, 750ms) ──────────
  if (mapSvg && mapZoom) {
    const wrap = document.getElementById('map-canvas-wrap')
    const W = wrap?.clientWidth ?? 900, H = wrap?.clientHeight ?? 580
    const scale = 2.8
    const ptx = W / 2 - scale * tx, pty = H / 2 - scale * ty
    mapSvg.transition().duration(750).ease(d3Lib.easeCubicInOut)
      .call(mapZoom.transform as never, d3Lib.zoomIdentity.translate(ptx, pty).scale(scale))
  }

  // ── 2. Camino tribal animado (huellas) ────────────────
  animateTribeStep(gs, fromNd, toNd)

  // ── 3. Token del jugador deslizándose ─────────────────
  mapG.selectAll('.player-token-layer').remove()

  // Línea de trail del token
  mapG.append('line').attr('class', 'player-token-layer')
    .attr('x1', fxo).attr('y1', fyo).attr('x2', fxo).attr('y2', fyo)
    .attr('stroke', 'rgba(70,200,80,.5)').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3').attr('pointer-events', 'none')
    .transition().duration(DUR).ease(d3Lib.easeCubicInOut)
    .attr('x2', txo).attr('y2', tyo)

  const slideG = mapG.append('g')
    .attr('class', 'player-token-layer player-token-anim')
    .attr('transform', `translate(${fxo},${fyo})`)
    .attr('pointer-events', 'none')

  // Halo de movimiento
  slideG.append('circle').attr('r', 14).attr('fill', 'none')
    .attr('stroke', PLAYER_PULSE).attr('stroke-width', 1.2)
  // Círculo del jugador
  slideG.append('circle').attr('r', 11)
    .attr('fill', PLAYER_FILL).attr('stroke', PLAYER_STROKE).attr('stroke-width', 2)
  // Emoji de tribu
  slideG.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
    .attr('font-size', '13px').attr('pointer-events', 'none').text(token)

  slideG.transition().duration(DUR).ease(d3Lib.easeCubicInOut)
    .attr('transform', `translate(${txo},${tyo})`)
    .on('end', () => {
      // Reemplazar animación por token estático en el destino
      // Pasamos overrideNd porque gs.history no incluye toNd aún
      mapG!.selectAll('.player-token-layer').remove()
      drawPlayerToken(gs, toNd)
      // Pequeña pausa (legibilidad) antes de lanzar el evento
      setTimeout(cb, 120)
    })
}

// ── Conquistador ──────────────────────────────────────

export function drawConquistador(gs: GameState): void {
  if (!mapG || !mapProj) return
  // Eliminar tanto la capa estática como la dinámica para redibujo completo
  mapG.selectAll('.conq-layer, .conq-bg-layer').remove()

  // ── 1. Ruta punteada: Tenochtitlán → cb1 → cb2 → cb3 → n00 ──────────────
  const routePoints: [number, number][] = []
  CONQ_BRIDGE.forEach(cb => {
    routePoints.push(mapProj!([cb.lon, cb.lat]) as [number, number])
  })
  // Conectar hasta n00 (Guatemala, primer nodo del jugador)
  const n00 = gs.nodes['n00']
  if (n00) routePoints.push(mapProj!([n00.lon, n00.lat]) as [number, number])

  for (let i = 0; i < routePoints.length - 1; i++) {
    const [x1, y1] = routePoints[i]
    const [x2, y2] = routePoints[i + 1]
    // conq-bg-layer: ruta estática — NO se elimina durante la animación del token
    mapG.append('line').attr('class', 'conq-bg-layer')
      .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
      .attr('stroke', 'rgba(180,50,30,.35)').attr('stroke-width', 1.4)
      .attr('stroke-dasharray', '5,4').attr('pointer-events', 'none')
  }

  // ── 2. Tenochtitlán — marcador permanente (cb0) ──────────────────────────
  const [tx, ty] = routePoints[0]
  // conq-bg-layer: marcador estático de Tenochtitlán
  const tg = mapG.append('g').attr('class', 'conq-bg-layer')
    .attr('transform', `translate(${tx},${ty})`).attr('cursor', 'help')

  // Base pirámide simplificada
  tg.append('rect').attr('x', -7).attr('y', 2).attr('width', 14).attr('height', 3)
    .attr('fill', 'rgba(160,110,40,.85)').attr('rx', .4).attr('pointer-events', 'none')
  tg.append('rect').attr('x', -5).attr('y', -1).attr('width', 10).attr('height', 4)
    .attr('fill', 'rgba(170,120,45,.85)').attr('rx', .4).attr('pointer-events', 'none')
  tg.append('rect').attr('x', -3).attr('y', -4).attr('width', 6).attr('height', 4)
    .attr('fill', 'rgba(180,130,50,.85)').attr('rx', .4).attr('pointer-events', 'none')
  // Llama pequeña encima
  tg.append('text').attr('text-anchor', 'middle').attr('y', -5)
    .attr('font-size', '7px').attr('pointer-events', 'none').text('🔥')
  // Label
  tg.append('rect').attr('x', -22).attr('y', 6).attr('width', 44).attr('height', 9)
    .attr('fill', 'rgba(4,2,2,.82)').attr('rx', 2).attr('pointer-events', 'none')
  tg.append('text').attr('text-anchor', 'middle').attr('y', 13)
    .attr('font-size', '5px').attr('font-family', 'Cinzel,serif')
    .attr('fill', 'rgba(220,150,50,.9)').attr('letter-spacing', '.1em')
    .attr('pointer-events', 'none').text('TENOCHTITLÁN')
  tg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev,
    '<strong style="color:#d4a017">🔥 Tenochtitlán — 1521</strong><br>Hernán Cortés derriba la capital azteca. La conquista avanza hacia el sur.'))
    .on('mouseleave', hideGeoTip)

  // ── 3. Waypoints intermedios (cb1, cb2, cb3) ─────────────────────────────
  CONQ_BRIDGE.slice(1).forEach((cb, i) => {
    const [wx, wy] = routePoints[i + 1]
    // conq-bg-layer: waypoints estáticos
    const wg = mapG!.append('g').attr('class', 'conq-bg-layer')
      .attr('transform', `translate(${wx},${wy})`).attr('cursor', 'help')
    wg.append('circle').attr('r', 5).attr('fill', 'rgba(80,10,5,.7)')
      .attr('stroke', 'rgba(180,60,40,.55)').attr('stroke-width', 1)
    wg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '5px').attr('pointer-events', 'none').text('👑')
    wg.append('rect').attr('x', -18).attr('y', 7).attr('width', 36).attr('height', 8)
      .attr('fill', 'rgba(4,2,2,.75)').attr('rx', 2).attr('pointer-events', 'none')
    wg.append('text').attr('text-anchor', 'middle').attr('y', 13)
      .attr('font-size', '4.5px').attr('font-family', 'Cinzel,serif')
      .attr('fill', 'rgba(200,90,70,.85)').attr('pointer-events', 'none')
      .text(cb.name.toUpperCase())
    wg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev,
      `<strong style="color:#e07070">👑 ${cb.name}</strong><br>Ruta de avance de los conquistadores.`))
      .on('mouseleave', hideGeoTip)
  })

  // ── 4. Token del conquistador en su posición actual ───────────────────────
  const wp = conqCurrentNode(gs)
  if (!wp) { drawHistMarkers(gs); return }
  const [cx, cy] = mapProj([wp.lon, wp.lat]) as [number, number]
  const cg = mapG.append('g').attr('class', 'conq-layer')
    .attr('transform', `translate(${cx + 18},${cy - 10})`).attr('cursor', 'help')
  const pulse = cg.append('circle').attr('r', 14).attr('fill', 'none')
    .attr('stroke', 'rgba(192,57,43,.6)').attr('stroke-width', 1.5)
  pulse.append('animate').attr('attributeName', 'r').attr('values', '14;20;14')
    .attr('dur', '1.8s').attr('repeatCount', 'indefinite')
  cg.append('circle').attr('r', 14).attr('fill', 'rgba(139,26,26,.1)')
    .attr('stroke', 'rgba(192,57,43,.15)').attr('stroke-width', 8)
  cg.append('circle').attr('r', 11).attr('fill', 'rgba(100,15,15,.85)')
    .attr('stroke', 'rgba(220,60,40,.9)').attr('stroke-width', 2)
  cg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
    .attr('font-size', '13px').attr('pointer-events', 'none').text('👑')
  cg.append('rect').attr('x', -32).attr('y', 14).attr('width', 64).attr('height', 11)
    .attr('fill', 'rgba(6,2,2,.82)').attr('rx', 2).attr('pointer-events', 'none')
  cg.append('text').attr('text-anchor', 'middle').attr('y', 22)
    .attr('font-size', '7px').attr('font-family', 'Cinzel,serif')
    .attr('fill', 'rgba(220,100,80,.95)').attr('pointer-events', 'none').text('CONQUISTADORES')
  const ri = gs.conq.routeIdx
  const playerPos = CONQ_BRIDGE.length + gs.history.length - 1
  const dist = playerPos - ri
  const distTxt = dist <= 0 ? '<span style="color:#e07070">⚠️ ¡Te han alcanzado!</span>'
    : dist === 1 ? '<span style="color:#e07070">⚠️ A UN NODO de distancia</span>'
    : dist === 2 ? '<span style="color:#d4a017">⚠ Dos nodos detrás</span>'
    : '<span style="color:#6db84a">Varios nodos de ventaja</span>'
  cg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev,
    `<strong style="color:#e07070">👑 Conquistadores — ${wp.name ?? ''}</strong><br>${distTxt}`))
    .on('mouseleave', hideGeoTip)

  drawHistMarkers(gs)
}

// ── Animación del conquistador ────────────────────────

function _showReorgCard(cb: () => void): void {
  const msgs = [
    'Los conquistadores se reagrupan…',
    'Las huestes españolas reorganizan sus fuerzas.',
    'Los soldados descansan. Por ahora.',
    'El capitán español espera noticias de sus exploradores.',
    'Los conquistadores pierden el rastro momentáneamente.',
  ]
  const msg = msgs[Math.floor(Math.random() * msgs.length)]
  showNotif(`⚔️ ${msg}`, 'info')
  const existing = document.getElementById('reorg-card')
  if (existing) existing.remove()
  const card = document.createElement('div')
  card.id = 'reorg-card'
  card.style.cssText = [
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9998;pointer-events:none',
    'text-align:center;font-family:"Cinzel",serif;font-size:clamp(.75rem,2vw,.95rem);letter-spacing:.12em;text-transform:uppercase',
    'padding:1rem 1.6rem;border-radius:3px;background:rgba(20,6,6,.9)',
    'border:1px solid rgba(192,57,43,.5);box-shadow:0 0 30px rgba(100,10,10,.5)',
    'color:rgba(220,140,100,.9);opacity:0;transition:opacity .5s ease',
  ].join(';')
  card.innerHTML = `<div style="font-size:1.1em;margin-bottom:.4rem">⚔️</div>${msg}`
  document.body.appendChild(card)
  requestAnimationFrame(() => requestAnimationFrame(() => { card.style.opacity = '1' }))
  setTimeout(() => {
    card.style.opacity = '0'
    setTimeout(() => { card.remove(); cb() }, 500)
  }, 2000)
}

function _animateConqAdvance(
  from:         { lon: number; lat: number },
  to:           { lon: number; lat: number },
  gs:           GameState,
  onSelectNode: ((id: string) => void) | undefined,
  onDone:       () => void,
): void {
  if (!mapSvg || !mapProj || !mapZoom) { _conqAnimating = false; onDone(); return }
  _conqAnimating = true
  const wrap = document.getElementById('map-canvas-wrap')
  const W = wrap?.clientWidth ?? 900, H = wrap?.clientHeight ?? 580
  const scale = 3.0, OX = 18, OY = -10

  const isMapVisible = () => document.getElementById('map-screen')?.classList.contains('active')

  function panTo(lon: number, lat: number, dur: number, cb: () => void) {
    if (!_conqAnimating || !isMapVisible()) { _conqAnimating = false; cb(); return }
    const [px, py] = mapProj!([lon, lat]) as [number, number]
    const tx = W / 2 - scale * px, ty = H / 2 - scale * py
    mapSvg!.transition().duration(dur).ease(d3Lib.easeCubicInOut)
      .call(mapZoom!.transform as never, d3Lib.zoomIdentity.translate(tx, ty).scale(scale))
      .on('end', cb)
  }

  function slideToken(fromWp: typeof from, toWp: typeof to, dur: number, cb: () => void) {
    if (!mapG || !mapProj) { cb(); return }
    const [fx, fy] = mapProj([fromWp.lon, fromWp.lat]) as [number, number]
    const [tx, ty] = mapProj([toWp.lon,   toWp.lat])   as [number, number]
    const fxo = fx + OX, fyo = fy + OY, txo = tx + OX, tyo = ty + OY
    mapG.selectAll('.conq-layer').remove()
    const slideG = mapG.append('g')
      .attr('class', 'conq-layer conq-token-anim')
      .attr('transform', `translate(${fxo},${fyo})`)
      .attr('pointer-events', 'none')
    mapG.insert('line', 'g.conq-token-anim')
      .attr('class', 'conq-layer')
      .attr('x1', fxo).attr('y1', fyo).attr('x2', fxo).attr('y2', fyo)
      .attr('stroke', 'rgba(220,60,40,.7)').attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3').attr('pointer-events', 'none')
      .transition().duration(dur).ease(d3Lib.easeCubicInOut)
      .attr('x2', txo).attr('y2', tyo)
    const halo = slideG.append('circle').attr('r', 14).attr('fill', 'none')
      .attr('stroke', 'rgba(192,57,43,.6)').attr('stroke-width', 1.5)
    halo.append('animate').attr('attributeName', 'r').attr('values', '14;20;14')
      .attr('dur', '1.8s').attr('repeatCount', 'indefinite')
    slideG.append('circle').attr('r', 14).attr('fill', 'rgba(139,26,26,.1)')
      .attr('stroke', 'rgba(192,57,43,.15)').attr('stroke-width', 8)
    slideG.append('circle').attr('r', 11).attr('fill', 'rgba(100,15,15,.85)')
      .attr('stroke', 'rgba(220,60,40,.9)').attr('stroke-width', 2)
    slideG.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '13px').attr('pointer-events', 'none').text('👑')
    slideG.append('rect').attr('x', -32).attr('y', 14).attr('width', 64).attr('height', 11)
      .attr('fill', 'rgba(6,2,2,.82)').attr('rx', 2).attr('pointer-events', 'none')
    slideG.append('text').attr('text-anchor', 'middle').attr('y', 22)
      .attr('font-size', '7px').attr('font-family', 'Cinzel,serif')
      .attr('fill', 'rgba(220,100,80,.95)').attr('pointer-events', 'none').text('CONQUISTADORES')
    slideG.transition().duration(dur).ease(d3Lib.easeCubicInOut)
      .attr('transform', `translate(${txo},${tyo})`).on('end', cb)
  }

  const _wait = (attempt: number, fn: () => void) => {
    if (attempt > 20) { _conqAnimating = false; return }
    if (isMapVisible()) { fn(); return }
    setTimeout(() => _wait(attempt + 1, fn), 100)
  }

  // Secuencia: slide del token + pan al destino en paralelo → centrar → callback
  _wait(0, () => {
    if (!_conqAnimating) return
    // Redibujar nodos CON onSelectNode para mantener los handlers activos
    drawNodes(gs, onSelectNode)
    // Slide del token (950ms) y pan al destino (950ms) en paralelo
    slideToken(from, to, 950, () => {
      if (!_conqAnimating) return
      // Al terminar el slide: conquistador estático en destino
      drawNodes(gs, onSelectNode)
      drawConquistador(gs)
    })
    panTo(to.lon, to.lat, 950, () => {
      if (!_conqAnimating) return
      setTimeout(() => {
        _conqAnimating = false
        if (isMapVisible()) _centerOnNextNodes(gs)
        onDone()
      }, 400)
    })
  })
}

/**
 * Versión animada para el UI del avance del conquistador.
 * Llama al callback con (caught: boolean) cuando termina la animación.
 */
export function advanceConquistadorAnimated(gs: GameState, cb: (caught: boolean) => void): void {
  if (gs.conq.caught) { cb(false); return }
  if (gs.conq.reorgTurns > 0) {
    _showReorgCard(() => cb(false))
    return
  }

  const ri = gs.conq.routeIdx
  const isEdu = gs.diff === 'educativo'
  const lag = isEdu ? 2 : 1
  const maxNormal = CONQ_BRIDGE.length + gs.history.length - lag
  const playerPos = CONQ_BRIDGE.length + gs.history.length - 1
  const jumpProb = isEdu ? 0.12 : 0.32
  const doJump = Math.random() < jumpProb

  let targetIdx: number
  let isJump = false
  if (doJump && ri < playerPos) { targetIdx = playerPos; isJump = true }
  else if (ri < maxNormal)       { targetIdx = ri + 1 }
  else                           { cb(false); return }

  const fromWp = conqCurrentNode(gs)
  // Note: gs is immutable — caller must update routeIdx/caught in the game state
  // We just animate from current to target position
  const gsCopy = { ...gs, conq: { ...gs.conq, routeIdx: targetIdx } }
  const toWp   = conqCurrentNode(gsCopy)
  if (!fromWp || !toWp) { cb(isJump); return }

  const toName = (toWp as { name?: string }).name ?? ''
  showNotif(`⚔️ Los conquistadores avanzan — ${toName}`, 'loss')
  if (isJump) showNotif('⚔️ ¡Los conquistadores te han alcanzado!', 'loss')

  _animateConqAdvance(fromWp, toWp, gs, undefined, () => cb(isJump))
}

/**
 * Anima el avance del conquistador usando el resultado del motor (engine-first).
 * Elimina el doble azar: la decisión ya fue tomada por el motor, aquí solo se anima.
 */
export function animateConqStep(
  oldGs:        GameState,
  newGs:        GameState,
  reorg:        boolean,
  cb:           () => void,
  onSelectNode?: (id: string) => void,
): void {
  if (reorg) { _showReorgCard(cb); return }
  const fromWp = conqCurrentNode(oldGs)
  const toWp   = conqCurrentNode(newGs)
  if (!fromWp || !toWp) { cb(); return }
  if (fromWp.lon === toWp.lon && fromWp.lat === toWp.lat) { cb(); return }
  _animateConqAdvance(fromWp, toWp, newGs, onSelectNode, cb)
}

// ── Cámara ────────────────────────────────────────────

function centerMapOn(lon: number, lat: number, scale: number): void {
  if (!mapSvg || !mapProj || !mapZoom) return
  const wrap = document.getElementById('map-canvas-wrap')
  const W = wrap?.clientWidth ?? 900, H = wrap?.clientHeight ?? 580
  const [px, py] = mapProj([lon, lat]) as [number, number]
  const tx = W / 2 - scale * px, ty = H / 2 - scale * py
  mapSvg.transition().duration(700).ease(d3Lib.easeCubicInOut)
    .call(mapZoom.transform as never, d3Lib.zoomIdentity.translate(tx, ty).scale(scale))
}

export function centerOnNextNodes(gs: GameState): void {
  _centerOnNextNodes(gs)
}

function _centerOnNextNodes(gs: GameState): void {
  if (!mapProj || !mapSvg || !gs.nodes) return
  const last = lastCompleted(gs)
  if (!last) return
  const lastNd = gs.nodes[last]
  if (!lastNd) return
  const nextNds = (lastNd.next ?? []).map(id => gs.nodes[id]).filter(n => n && n.unlocked && !n.completed)
  let lon: number, lat: number, scale: number
  if (nextNds.length === 0)      { lon = lastNd.lon;   lat = lastNd.lat;   scale = 2.8 }
  else if (nextNds.length === 1) { lon = nextNds[0].lon; lat = nextNds[0].lat; scale = 2.6 }
  else {
    const lons = nextNds.map(n => n.lon), lats = nextNds.map(n => n.lat)
    lon = lons.reduce((a, b) => a + b, 0) / lons.length
    lat = lats.reduce((a, b) => a + b, 0) / lats.length
    const span = Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats))
    scale = span < 5 ? 3.2 : span < 12 ? 2.4 : 1.8
  }
  const cWp = conqCurrentNode(gs)
  if (cWp) {
    const allLons = [lon, cWp.lon], allLats = [lat, cWp.lat]
    const cLon = (Math.max(...allLons) + Math.min(...allLons)) / 2
    const cLat = (Math.max(...allLats) + Math.min(...allLats)) / 2
    const span = Math.max(Math.max(...allLons) - Math.min(...allLons), Math.max(...allLats) - Math.min(...allLats))
    if (span < 30) { lon = cLon; lat = cLat; scale = span < 4 ? 2.8 : span < 10 ? 2.0 : span < 20 ? 1.5 : 1.2 }
  }
  setTimeout(() => centerMapOn(lon, lat, scale), 180)
}

// ── Nodos ─────────────────────────────────────────────

const LABEL_OFFSET: Record<string, [number, number]> = {
  n00: [0, 22], n00b: [-28, 14], n01a: [-24, 16], n01b: [24, 16], n01c: [-28, 14],
  n02a: [-24, 16], n02b: [24, 16], n02c: [24, 16], n02d: [24, 14], n02e: [28, 14],
  n03: [0, 22],
  n04a: [-28, 14], n04b: [28, 14], n04c: [28, 14],
  n05a: [-28, 14], n05b: [0, 22], n05c: [28, 14], n05d: [28, 14], n05e: [28, 14],
  n06a: [-28, 14], n06b: [28, 14], n06c: [28, 14],
  n07a: [-28, 14], n07b: [28, 14], n07c: [28, 14], n07d: [28, 14],
  n08a: [-28, 14], n08b: [0, 22], n08c: [28, 14], n08d: [28, 14],
  n09: [0, 22],
  n10a: [-28, 14], n10b: [0, 22], n10c: [28, 14],
  n10a2: [-28, 14], n10b2: [28, 14], n10c2: [28, 14],
  n10a3a: [28, 14], n10a3b: [-28, 14],
  n10b3a: [-28, 14], n10b3b: [28, 14],
  n10c3a: [-28, 14], n10c3b: [28, 14],
  n11a: [-28, 14], n11b: [0, 22], n11c: [28, 14],
}

export function drawNodes(gs: GameState, onSelectNode?: (nodeId: string) => void): void {
  if (!mapG || !mapProj) return
  mapG.selectAll('.ng,.el,.conq-layer,.player-token-layer').remove()
  drawTribePath(gs)

  const nodes = gs.nodes
  const visitedCount = gs.history.length
  const totalNodes   = Object.keys(NODES_DEF).length
  const act = visitedCount > 0 ? (gs.nodes[gs.history[visitedCount - 1]]?.act ?? 1) : 1
  const progEl = document.getElementById('map-progress')
  if (progEl) {
    progEl.innerHTML = `<div style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ocre);opacity:.7;">${ACT_NAMES[act] ?? 'Acto I'}</div><div style="font-family:'Cinzel',serif;font-size:.58rem;color:var(--parch2);opacity:.4;margin-top:.15rem;">${visitedCount} de ${totalNodes} lugares</div>`
  }

  // Actualizar título del acto y pista del mapa
  const actTitleEl = document.getElementById('map-act-title')
  if (actTitleEl) actTitleEl.textContent = ACT_NAMES[act] ?? 'Acto I · Huida'

  const last = lastCompleted(gs)
  const mapHintEl = document.getElementById('map-hint')
  if (mapHintEl) {
    const reachable = Object.values(gs.nodes).filter(n =>
      n.unlocked && !n.completed &&
      (last === null ? n.id === 'n00' : n.unlockedFrom === last)
    ).length
    mapHintEl.textContent = reachable > 1
      ? `${reachable} caminos posibles — elegí uno`
      : reachable === 1
        ? 'Elegí el próximo destino de tu pueblo'
        : visitedCount === 0 ? 'Elegí el primer destino' : 'Explorando…'
  }

  // Aristas
  EDGES.forEach(([aId, bId]) => {
    const a = nodes[aId], b = nodes[bId]
    if (!a || !b) return
    const [ax, ay] = mapProj!([a.lon, a.lat]) as [number, number]
    const [bx, by] = mapProj!([b.lon, b.lat]) as [number, number]
    const done = a.completed && b.completed
    const pivot = last ?? 'n00'
    const active = !done && ((aId === pivot && b.unlocked && !b.completed && b.unlockedFrom === last) ||
      (aId === 'n00' && last === null && b.unlocked && !b.completed))
    if (done) {
      mapG!.append('line').attr('class', 'el').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by).attr('stroke', 'rgba(196,136,42,.18)').attr('stroke-width', 5).attr('stroke-dasharray', '6,5')
      mapG!.append('line').attr('class', 'el').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by).attr('stroke', 'rgba(232,169,58,.85)').attr('stroke-width', 1.8).attr('stroke-dasharray', '6,5')
    } else if (active) {
      mapG!.append('line').attr('class', 'el').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by).attr('stroke', 'rgba(196,136,42,.35)').attr('stroke-width', 1.2).attr('stroke-dasharray', '5,4')
    } else {
      mapG!.append('line').attr('class', 'el').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by).attr('stroke', 'rgba(255,255,255,.06)').attr('stroke-width', .7).attr('stroke-dasharray', '3,5')
    }
  })

  // Nodos
  Object.values(nodes).forEach(nd => {
    if (nd.id === '_conq_catch_node') return
    const [x, y] = mapProj!([nd.lon, nd.lat]) as [number, number]
    const reachable = nd.unlocked && !nd.completed && ((last === null && nd.id === 'n00') || nd.unlockedFrom === last)
    const done = nd.completed
    const locked = !nd.unlocked
    const unlockedOtherPath = nd.unlocked && !nd.completed && nd.unlockedFrom !== last
    const g = mapG!.append('g').attr('class', 'ng').attr('transform', `translate(${x},${y})`)
    if (reachable) {
      const pulse = g.append('circle').attr('r', 16).attr('fill', 'none').attr('stroke', 'rgba(196,136,42,.55)').attr('stroke-width', 1.5)
      pulse.append('animate').attr('attributeName', 'r').attr('values', '16;22;16').attr('dur', '2s').attr('repeatCount', 'indefinite')
      g.append('circle').attr('r', 16).attr('fill', 'none').attr('stroke', 'rgba(196,136,42,.1)').attr('stroke-width', 9)
    }
    const r = 11
    g.append('circle').attr('r', r)
      .attr('fill', done ? 'rgba(196,136,42,.3)' : reachable ? 'rgba(196,136,42,.15)' : 'rgba(8,6,4,.8)')
      .attr('stroke', done ? 'rgba(196,136,42,.9)' : reachable ? 'rgba(232,169,58,1)' : 'rgba(255,255,255,.12)')
      .attr('stroke-width', reachable ? 2 : 1)
    g.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', locked && !unlockedOtherPath ? '8px' : '12px')
      .attr('opacity', locked && !unlockedOtherPath ? .2 : done ? 1 : reachable ? 1 : .35)
      .text(locked && !unlockedOtherPath ? '🔒' : nd.icon)
    const [lx, ly] = LABEL_OFFSET[nd.id] ?? [0, 20]
    const label = nd.name.split('–')[0].trim()
    const lcolor = done ? 'rgba(196,136,42,.8)' : reachable ? 'rgba(235,218,185,.95)' : unlockedOtherPath ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.22)'
    const estW = Math.max(label.length * 5.2 + 8, 30)
    g.append('rect').attr('x', lx - estW / 2).attr('y', ly - 8).attr('width', estW).attr('height', 11).attr('fill', 'rgba(6,4,2,.75)').attr('rx', 2).attr('opacity', locked && !unlockedOtherPath ? 0.3 : 1)
    g.append('text').attr('text-anchor', 'middle').attr('x', lx).attr('y', ly).attr('font-size', '7.5px').attr('font-family', 'Cinzel,serif').attr('fill', lcolor).attr('pointer-events', 'none').text(label)

    if (reachable && onSelectNode) {
      g.style('cursor', 'pointer')
      g.append('circle').attr('r', 26).attr('fill', 'transparent').attr('pointer-events', 'all')
      const showNdTip = (ev: MouseEvent) => {
        const tt = document.getElementById('map-node-tt')
        if (!tt) return
        tt.innerHTML = `<strong>${nd.icon} ${nd.name}</strong><span style="display:block;margin-top:.15rem">${nd.desc}</span>`
        tt.style.display = 'block'
        const wr = document.getElementById('map-canvas-wrap')?.getBoundingClientRect()
        if (!wr) return
        tt.style.left = `${Math.min((ev.clientX ?? 0) - wr.left + 14, wr.width - 220)}px`
        tt.style.top  = `${Math.max((ev.clientY ?? 0) - wr.top  - 60, 8)}px`
      }
      g.on('mouseenter', (ev: MouseEvent) => { sfxNodeHover(); showNdTip(ev) })
        .on('mouseleave', () => { const tt = document.getElementById('map-node-tt'); if (tt) tt.style.display = 'none' })
        .on('click', () => { const tt = document.getElementById('map-node-tt'); if (tt) tt.style.display = 'none'; onSelectNode(nd.id) })
      g.on('touchend', (ev: TouchEvent) => {
        ev.preventDefault()
        const tt = document.getElementById('map-node-tt')
        if (!tt) return
        if (tt.style.display === 'block') { tt.style.display = 'none'; onSelectNode(nd.id) }
        else {
          showNdTip(ev.changedTouches[0] as unknown as MouseEvent)
          setTimeout(() => { tt.style.display = 'none'; onSelectNode(nd.id) }, 700)
        }
      })
    } else if (unlockedOtherPath) {
      g.style('cursor', 'not-allowed')
      g.append('circle').attr('r', 26).attr('fill', 'transparent').attr('pointer-events', 'all')
      g.on('mouseenter', (ev: MouseEvent) => {
        const from = gs.nodes[nd.unlockedFrom ?? '']
        const tt = document.getElementById('map-node-tt')
        if (!tt) return
        tt.innerHTML = `<strong>${nd.icon} ${nd.name}</strong><span style="display:block;margin-top:.15rem;color:rgba(192,57,43,.9)">🔒 Solo accesible desde ${from ? from.name : 'otro camino'}</span>`
        tt.style.display = 'block'
        const wr = document.getElementById('map-canvas-wrap')?.getBoundingClientRect()
        if (!wr) return
        tt.style.left = `${Math.min(ev.clientX - wr.left + 14, wr.width - 220)}px`
        tt.style.top  = `${Math.max(ev.clientY  - wr.top  - 60, 8)}px`
      }).on('mouseleave', () => { const tt = document.getElementById('map-node-tt'); if (tt) tt.style.display = 'none' })
    }
  })

  drawConquistador(gs)
  drawPlayerToken(gs)
}

// ── Overlays geográficos (ríos, Andes, biomas) ────────

function renderOverlays(gs: GameState, lineF: (d: [number, number][]) => string | null, onSelectNode?: (nodeId: string) => void): void {
  if (!mapG || !mapProj) return

  const polyPath = (pts: [number, number][]) => {
    const px = pts.map(p => mapProj!(p) as [number, number])
    return 'M' + px.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z'
  }

  // Cuenca amazónica
  mapG.append('path').attr('d', polyPath([[-78,2],[-76,0],[-75,-2],[-73,-4],[-72,-6],[-70,-6],[-68,-4],[-65,-4],[-63,-3],[-60,-3],[-58,-2],[-55,-1],[-52,0],[-50,-1],[-48,-2],[-49,-5],[-51,-7],[-53,-9],[-56,-10],[-58,-10],[-60,-12],[-63,-12],[-65,-14],[-68,-12],[-70,-10],[-72,-8],[-74,-8],[-76,-6],[-78,-4],[-78,2]])).attr('fill','rgba(30,80,20,.28)').attr('stroke','rgba(40,120,30,.4)').attr('stroke-width',.6).attr('pointer-events','none')

  // Desierto de Atacama
  mapG.append('path').attr('d', polyPath([[-69,-18],[-70,-20],[-70,-24],[-69,-27],[-68,-26],[-67,-24],[-67,-20],[-68,-18],[-69,-18]])).attr('fill','rgba(180,140,60,.22)').attr('stroke','rgba(200,160,70,.3)').attr('stroke-width',.5).attr('pointer-events','none')

  // Pampa
  mapG.append('path').attr('d', polyPath([[-62,-30],[-60,-28],[-58,-28],[-56,-30],[-57,-34],[-60,-36],[-62,-34],[-63,-32],[-62,-30]])).attr('fill','rgba(80,120,30,.15)').attr('stroke','rgba(100,140,40,.2)').attr('stroke-width',.4).attr('pointer-events','none')

  // Andes (cadena de triángulos)
  const andesPts: [number,number][] = [
    [-77,1.5],[-77.2,0.5],[-77.8,-0.5],[-78.2,-1.5],[-78,-2.5],[-77.5,-3.5],[-77.8,-4.5],[-77.2,-5.5],[-77,-6.5],[-76.5,-7.5],
    [-76.8,-8.5],[-76.2,-9.5],[-76,-10.5],[-75.8,-11.5],[-75.5,-12.5],[-75.2,-13.5],[-75,-14.5],[-74.8,-15.5],[-74.5,-16.5],[-69.5,-17],
    [-68.5,-18],[-68.2,-19],[-68.8,-20],[-69.2,-21],[-69.5,-22],[-69.8,-23],[-70,-24],[-70.3,-25],[-70.5,-26],[-70.5,-27],
    [-70.8,-28],[-71,-29],[-71,-30],[-71.2,-31],[-71.2,-32],[-71.3,-33],[-71.5,-34],[-71.5,-35],[-71.8,-36],[-72,-37],
    [-72,-38],[-72.2,-39],[-72.5,-40],[-72.5,-41],[-72.8,-42],[-73,-43],[-73,-44],[-73.2,-45],[-73.5,-46],[-73.5,-47],
    [-73.8,-48],[-74,-49],[-74,-50],[-74.2,-51],[-74.5,-52],[-74.8,-53],[-75,-54],[-75.2,-54.8],
  ]
  const triG = mapG.append('g').attr('class', 'andes-tris')
  andesPts.forEach((pt, i) => {
    const [px, py] = mapProj!(pt) as [number, number]
    const h = i % 3 === 0 ? 9 : i % 3 === 1 ? 7 : 8, w = 7
    triG.append('path').attr('d', `M${px},${py - h} L${px + w/2},${py + 2} L${px - w/2},${py + 2}Z`)
      .attr('fill', 'rgba(200,185,150,.45)').attr('stroke', 'rgba(230,215,175,.65)').attr('stroke-width', .6).attr('stroke-linejoin', 'round').attr('pointer-events', 'none')
    if (i % 4 === 0) {
      const sh = h * .4
      triG.append('path').attr('d', `M${px},${py - h} L${px + w*sh/(2*h)},${py - h + sh} L${px - w*sh/(2*h)},${py - h + sh}Z`)
        .attr('fill', 'rgba(240,238,235,.55)').attr('stroke', 'none').attr('pointer-events', 'none')
    }
  })
  const [lax, lay] = mapProj([-74.5, -14]) as [number, number]
  mapG.append('text').attr('x', lax - 14).attr('y', lay).attr('font-size', '7px').attr('fill', 'rgba(230,215,165,.6)').attr('font-family', 'Cinzel,serif').attr('letter-spacing', '.18em').attr('transform', `rotate(-80,${lax-14},${lay})`).attr('pointer-events', 'none').text('ANDES')

  // Ríos principales
  const RIOS: { pts: [number,number][]; w: number; color: string; label: string; lpos: [number,number]; tip: string }[] = [
    { pts: [[-74,0],[-72,-2],[-70,-3],[-68,-3],[-65,-3],[-62,-3],[-58,-2],[-54,-1],[-50,-1],[-48,-1.5]], w: 3, color: 'rgba(40,110,200,.75)', label: 'Amazonas', lpos: [-61,-3], tip: 'El río más caudaloso del planeta: 20% del agua dulce del mundo. Red de 1.100 afluentes.' },
    { pts: [[-58,-14],[-57,-18],[-57,-20],[-57,-24],[-58,-28],[-58,-34]], w: 2, color: 'rgba(35,95,180,.65)', label: 'Paraná', lpos: [-57.5,-24], tip: 'El segundo río más largo de Sudamérica. Los guaraníes habitaban sus orillas.' },
    { pts: [[-76,2],[-75,4],[-74.5,6],[-74.5,9],[-74.8,11]], w: 1.5, color: 'rgba(40,100,190,.6)', label: 'Magdalena', lpos: [-74.5,6], tip: 'Río principal de Colombia. Los españoles lo usaron como vía de acceso al interior.' },
    { pts: [[-74,-6],[-72,-7],[-70,-8],[-68,-9],[-66,-10],[-64,-10],[-62,-9],[-60,-8],[-58,-6],[-55,-4],[-52,-3],[-50,-2],[-48,-1.5]], w: 2, color: 'rgba(40,105,192,.62)', label: 'Ucayali', lpos: [-66,-8], tip: 'Afluente sur del Amazonas. Los shipibo-conibo viven en sus orillas desde hace milenios.' },
    { pts: [[-70,-36],[-68,-37],[-66,-38],[-63,-38],[-60,-38],[-58,-38]], w: 1.2, color: 'rgba(35,90,175,.5)', label: 'Río Colorado', lpos: [-65,-38], tip: 'Límite sur del dominio colonial español. Al sur vivían tehuelches y mapuches.' },
  ]
  RIOS.forEach(r => {
    mapG!.append('path').datum(r.pts).attr('d', lineF as never).attr('fill', 'none').attr('stroke', r.color).attr('stroke-width', r.w).attr('stroke-linecap', 'round').attr('pointer-events', 'none')
    const [rx, ry] = mapProj!(r.lpos) as [number, number]
    mapG!.append('text').attr('x', rx).attr('y', ry - 5).attr('font-size', r.w > 2 ? '8px' : '6.5px').attr('fill', 'rgba(80,160,230,.8)').attr('font-family', 'Crimson Text,serif').attr('font-style', 'italic').attr('text-anchor', 'middle').attr('pointer-events', 'none').text(r.label)
    mapG!.append('circle').attr('cx', rx).attr('cy', ry - 5).attr('r', 12).attr('fill', 'transparent').attr('cursor', 'help')
      .on('mouseenter', (ev: MouseEvent) => showGeoTip(ev, `<strong style="color:#5ab0ff">🌊 ${r.label}</strong><br>${r.tip}`))
      .on('mouseleave', hideGeoTip)
  })

  _mapInitialized = true
  drawNodes(gs, onSelectNode)
}

// ── buildMap (punto de entrada) ───────────────────────

export function buildMap(gs: GameState, onSelectNode?: (nodeId: string) => void): void {
  const wrap = document.getElementById('map-canvas-wrap')
  if (!wrap) return
  const W = wrap.clientWidth || 900, H = wrap.clientHeight || 580
  if (_mapInitialized && mapG && mapProj) { drawNodes(gs, onSelectNode); return }
  _buildMapFull(wrap, W, H, gs, onSelectNode)
}

function _buildMapFull(wrap: HTMLElement, W: number, H: number, gs: GameState, onSelectNode?: (nodeId: string) => void): void {
  d3Lib.select('#map-svg').selectAll('*').remove()
  mapSvg = d3Lib.select('#map-svg').attr('viewBox', `0 0 ${W} ${H}`) as unknown as ReturnType<D3Lib['select']>
  d3Lib.select('#map-svg').style('overflow', 'hidden')

  mapProj = d3Lib.geoMercator().center([-72, -6]).scale(W * 1.32).translate([W / 2, H / 2])
  const path  = d3Lib.geoPath().projection(mapProj)
  const lineF = d3Lib.line<[number,number]>().x(dp => (mapProj!(dp) as [number,number])[0]).y(dp => (mapProj!(dp) as [number,number])[1]).curve(d3Lib.curveCatmullRom.alpha(.5))

  mapG   = mapSvg!.append('g') as unknown as ReturnType<D3Lib['select']>
  mapZoom = d3Lib.zoom<SVGSVGElement, unknown>().scaleExtent([.4, 12]).on('zoom', (e: { transform: unknown }) => mapG!.attr('transform', e.transform as string)) as unknown as ReturnType<D3Lib['zoom']>
  mapSvg!.call(mapZoom as never)

  const svgEl = document.getElementById('map-svg') as unknown as SVGElement
  svgEl.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault() }, { passive: false })
  svgEl.addEventListener('touchmove',  e => { if (e.touches.length > 1) e.preventDefault() }, { passive: false })

  // Graticule
  const grat = d3Lib.geoGraticule().step([10, 10])
  const gratG = mapG!.append('g').attr('pointer-events', 'none')
  grat.lines().forEach((line: Parameters<typeof path>[0]) => {
    gratG.append('path').datum(line).attr('d', path).attr('fill', 'none').attr('stroke', 'rgba(60,140,200,.08)').attr('stroke-width', .3)
  })

  // Spinner de carga
  const spinner = document.createElement('div')
  spinner.id = 'map-loading'
  spinner.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(196,136,42,.5);font-family:Cinzel,serif;font-size:.75rem;letter-spacing:.2em;pointer-events:none;z-index:5'
  spinner.textContent = 'Cargando mapa…'
  wrap.appendChild(spinner)

  if (!_topoFetchPromise) {
    // Intentar cargar desde sessionStorage antes de hacer fetch
    if (!_topoCache) {
      try {
        const raw = sessionStorage.getItem(TOPO_STORAGE_KEY)
        if (raw) _topoCache = JSON.parse(raw)
      } catch (_) { /* sessionStorage no disponible */ }
    }
    _topoFetchPromise = _topoCache
      ? Promise.resolve(_topoCache)
      : fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(r => r.json())
          .then((w: unknown) => {
            _topoCache = w
            try { sessionStorage.setItem(TOPO_STORAGE_KEY, JSON.stringify(w)) } catch (_) { /* sin storage */ }
            return w
          })
          .catch(() => { _topoFetchPromise = null; return null })
  }

  _topoFetchPromise.then(world => {
    document.getElementById('map-loading')?.remove()
    if (!world) { _renderFallback(lineF, gs, onSelectNode); return }
    type TopoWorld = import('topojson-specification').Topology
    const topo = world as unknown as TopoWorld
    const countries = topojson.feature(topo, (topo.objects as Record<string, import('topojson-specification').GeometryCollection>)[Object.keys(topo.objects)[0]]) as { features: unknown[] }
    const inRegion = (f: unknown) => {
      try {
        const c = path.centroid(f as Parameters<typeof path.centroid>[0])
        if (!c || isNaN(c[0])) return false
        const [lon, lat] = mapProj!.invert!(c) as [number, number]
        return lon > -118 && lon < -33 && lat > -57 && lat < 30
      } catch { return false }
    }
    const regional = countries.features.filter(inRegion)
    const landColor = (f: unknown) => {
      try {
        const [, lat] = mapProj!.invert!(path.centroid(f as Parameters<typeof path.centroid>[0])) as [number, number]
        if (lat > 22) return '#1e2e12'
        if (lat > 14) return '#1a2f10'
        if (lat > -5) return '#1c3212'
        if (lat > -25) return '#182d0f'
        return '#13260c'
      } catch { return '#162210' }
    }
    mapG!.append('g').attr('pointer-events', 'none').selectAll('path').data(regional).enter().append('path')
      .attr('d', path as never).attr('fill', landColor as never).attr('stroke', '#3a6828').attr('stroke-width', .8).attr('stroke-linejoin', 'round')
    const regionIds = new Set(regional.map((f: unknown) => String((f as { id: unknown }).id)))
    const borders = topojson.mesh(topo, (topo.objects as Record<string, import('topojson-specification').GeometryCollection>)[Object.keys(topo.objects)[0]], (a, b) => a !== b && regionIds.has(String((a as { id: unknown }).id)) && regionIds.has(String((b as { id: unknown }).id)))
    mapG!.append('path').datum(borders as Parameters<typeof path>[0]).attr('d', path).attr('fill', 'none').attr('stroke', '#4a7830').attr('stroke-width', .4).attr('pointer-events', 'none')
    renderOverlays(gs, lineF as never, onSelectNode)
  }).catch(() => { document.getElementById('map-loading')?.remove(); _renderFallback(lineF, gs, onSelectNode) })
}

function _renderFallback(lineF: (d: [number, number][]) => string | null, gs: GameState, onSelectNode?: (nodeId: string) => void): void {
  if (!mapG || !mapProj) return
  const pts: [number,number][] = [
    [-117,28],[-110,24],[-105,20],[-97,19],[-92,18],[-90,18],[-88,16],[-83,10],[-77,8],[-75,11],[-70,12],
    [-62,11],[-60,8],[-61,4],[-52,4],[-50,2],[-48,0],[-44,2],[-35,-8],[-35,-14],[-39,-18],[-40,-22],
    [-44,-24],[-48,-28],[-52,-34],[-53,-34],[-58,-34],[-58,-38],[-62,-39],[-65,-46],[-65,-55],[-66,-56],
    [-68,-54],[-72,-50],[-75,-46],[-72,-40],[-70,-38],[-71,-34],[-72,-30],[-70,-20],[-75,-14],[-76,-8],
    [-78,-2],[-75,0],[-78,2],[-77,4],[-75,8],[-78,8],[-83,10],[-89,16],[-92,18],[-97,19],[-105,20],[-110,24],[-117,28]
  ]
  const px = pts.map(p => mapProj!(p) as [number, number])
  const d  = 'M' + px.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z'
  mapG.append('path').attr('d', d).attr('fill', '#162210').attr('stroke', '#3a6828').attr('stroke-width', .8).attr('pointer-events', 'none')
  renderOverlays(gs, lineF, onSelectNode)
}

// ── Resize ────────────────────────────────────────────

export function resetMap(): void {
  _mapInitialized    = false
  _conqAnimating     = false
  _shownHistMarkers  = new Set<string>()
  _conqueredMarkers  = new Set<string>()
}

// ══════════════════════════════════════════════════════
// CINEMÁTICA DE APERTURA
// Secuencia: pan a Tenochtitlán → llamas → cartel 1 →
// cartel 2 → conquistador avanza → pan a Guatemala
// ══════════════════════════════════════════════════════

/** Espera a que buildMap termine y lanza la cinemática */
export function waitForMapThenCinematic(
  gs:           GameState,
  onSelectNode: ((id: string) => void) | undefined,
  onGsUpdate:   (newGs: GameState) => void,
): void {
  const _wait = (attempts: number) => {
    if (attempts > 60) { runOpeningCinematic(gs, onSelectNode, onGsUpdate); return }
    if (_mapInitialized && mapSvg && mapProj && mapZoom) {
      setTimeout(() => runOpeningCinematic(gs, onSelectNode, onGsUpdate), 200)
    } else {
      setTimeout(() => _wait(attempts + 1), 50)
    }
  }
  _wait(0)
}

/** Lanza la secuencia cinemática de apertura */
export function runOpeningCinematic(
  gs:           GameState,
  onSelectNode: ((id: string) => void) | undefined,
  onGsUpdate:   (newGs: GameState) => void,
): void {
  if (!mapSvg || !mapProj || !mapZoom || !mapG) return

  sfxCinematic()

  const TENOCHTITLAN = CONQ_BRIDGE[0]  // lon:-99.1, lat:19.4
  const wrap = document.getElementById('map-canvas-wrap')
  if (!wrap) return
  const W = wrap.clientWidth || 900
  const H = wrap.clientHeight || 580

  // ── Carteles narrativos ───────────────────────────────
  function _showCard(html: string, duration: number, cb: () => void): void {
    let card = document.getElementById('cinematic-card') as HTMLDivElement | null
    if (!card) {
      card = document.createElement('div')
      card.id = 'cinematic-card'
      card.style.cssText = [
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
        'z-index:9999;pointer-events:none;text-align:center;',
        "font-family:'Cinzel Decorative',serif;",
        'padding:1.4rem 2rem;border-radius:4px;',
        'background:rgba(4,2,2,.88);border:1px solid rgba(192,57,43,.5);',
        'box-shadow:0 0 40px rgba(139,26,26,.4);',
        'max-width:min(90vw,520px);opacity:0;',
        'transition:opacity 1s ease;',
      ].join('')
      document.body.appendChild(card)
    }
    card.innerHTML = html
    card.style.opacity = '0'
    requestAnimationFrame(() => requestAnimationFrame(() => { card!.style.opacity = '1' }))
    setTimeout(() => {
      card!.style.opacity = '0'
      setTimeout(() => cb(), 700)
    }, duration)
  }

  function _removeCard(): void {
    const c = document.getElementById('cinematic-card')
    if (c) { c.style.opacity = '0'; setTimeout(() => c.remove(), 700) }
  }

  // ── Templo Mayor + llamas de Tenochtitlán ────────────
  function _addFireEffect(): void {
    if (!mapG || !mapProj) return
    const [fx, fy] = mapProj([TENOCHTITLAN.lon, TENOCHTITLAN.lat]) as [number, number]

    mapG.selectAll('.tenochtitlan-layer').remove()
    const fg = mapG.append('g')
      .attr('class', 'tenochtitlan-layer')
      .attr('transform', `translate(${fx},${fy})`)
      .attr('pointer-events', 'all')
      .attr('cursor', 'help')
      .attr('opacity', 0)

    // Halo ciudad ardiendo
    fg.append('circle').attr('r', 22)
      .attr('fill', 'rgba(90,12,4,.35)')
      .attr('stroke', 'rgba(200,60,15,.4)').attr('stroke-width', 1.2)

    // Templo Mayor — pirámide escalonada
    fg.append('rect').attr('x', -12).attr('y', 4).attr('width', 24).attr('height', 4)
      .attr('fill', 'rgba(180,130,60,.9)').attr('rx', .5)
    fg.append('rect').attr('x', -9).attr('y', -1).attr('width', 18).attr('height', 6)
      .attr('fill', 'rgba(190,140,65,.9)').attr('rx', .5)
    fg.append('rect').attr('x', -6).attr('y', -6).attr('width', 12).attr('height', 6)
      .attr('fill', 'rgba(200,150,70,.9)').attr('rx', .5)
    // Torres gemelas (Huitzilopochtli + Tláloc)
    fg.append('rect').attr('x', -6).attr('y', -11).attr('width', 4).attr('height', 5)
      .attr('fill', 'rgba(210,160,75,.95)')
    fg.append('rect').attr('x', 2).attr('y', -11).attr('width', 4).attr('height', 5)
      .attr('fill', 'rgba(210,160,75,.95)')
    // Sol azteca
    const sunG = fg.append('g').attr('transform', 'translate(0,-15)')
    sunG.append('circle').attr('r', 4)
      .attr('fill', 'rgba(240,180,30,.95)')
      .attr('stroke', 'rgba(255,210,50,.8)').attr('stroke-width', .8)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = Math.cos(angle) * 5, y1 = Math.sin(angle) * 5
      const x2 = Math.cos(angle) * 7.5, y2 = Math.sin(angle) * 7.5
      sunG.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke', 'rgba(255,210,50,.7)').attr('stroke-width', .8)
    }
    sunG.append('circle').attr('r', 4).attr('fill', 'none')
      .attr('stroke', 'rgba(255,220,60,.5)').attr('stroke-width', .6)
      .append('animate')
        .attr('attributeName', 'r').attr('values', '4;6.5;4')
        .attr('dur', '2.4s').attr('repeatCount', 'indefinite')

    // Label
    fg.append('rect').attr('x', -28).attr('y', 10).attr('width', 56).attr('height', 10)
      .attr('fill', 'rgba(4,2,2,.82)').attr('rx', 2)
    fg.append('text').attr('text-anchor', 'middle').attr('y', 18)
      .attr('font-size', '5.5px').attr('font-family', 'Cinzel,serif')
      .attr('fill', 'rgba(220,160,50,.95)').attr('letter-spacing', '.14em')
      .text('TENOCHTITLÁN')

    // Tooltip
    fg.on('mouseenter', (ev: MouseEvent) => showGeoTip(ev,
      '<strong style="color:#d4a017">🗿 Tenochtitlán — 1521</strong><br>El Imperio Azteca colapsa. Hernán Cortés derriba la capital mexica con 80.000 aliados tlaxcaltecas. La máquina de la conquista se pone en marcha hacia el sur.'))
      .on('mouseleave', hideGeoTip)

    // Llamas, humo, brasas — arrancan después del fade-in
    function _startFlames(): void {
      // Resplandor base pulsante
      const glowBase = fg.append('ellipse')
        .attr('cx', 0).attr('cy', 4).attr('rx', 14).attr('ry', 5)
        .attr('fill', 'rgba(220,60,10,.22)').attr('opacity', 0);
      (function _pulseGlow() {
        (glowBase as unknown as { interrupt: () => typeof glowBase }).interrupt()
        glowBase.transition().duration(900).ease(d3Lib.easeSinInOut)
          .attr('opacity', .45).attr('rx', 16)
          .transition().duration(900).ease(d3Lib.easeSinInOut)
          .attr('opacity', .18).attr('rx', 13)
          .on('end', _pulseGlow)
      })()

      // Llamas principales
      const flameColors = [
        'rgba(255,55,5,.82)', 'rgba(255,120,10,.78)', 'rgba(255,175,25,.72)',
        'rgba(210,40,8,.75)', 'rgba(255,95,5,.8)', 'rgba(255,215,45,.65)',
        'rgba(240,65,12,.7)',
      ]
      const flameConfig: [number, number, number, number, number, number, number][] = [
        [-10, 0, 0, 1500, 2.2, 3.2, -42], [-6, 280, 2, 1700, 2.8, 4.0, -46],
        [-2, 100, 5, 1300, 2.0, 3.0, -38], [2, 450, 1, 1600, 2.6, 3.8, -44],
        [6, 200, 4, 1400, 2.4, 3.5, -40],  [10, 600, 2, 1800, 2.0, 3.2, -43],
        [-8, 750, 6, 1200, 1.8, 2.8, -36], [8, 350, 3, 1550, 2.2, 3.4, -41],
        [0, 900, 0, 1650, 3.0, 4.2, -48],  [-4, 500, 4, 1350, 1.9, 2.9, -37],
        [4, 150, 6, 1750, 2.5, 3.7, -45],
      ]
      flameConfig.forEach(([ox, delay, ci, dur, rxB, ryB, peak]) => {
        const col = flameColors[ci % flameColors.length]
        const puff = fg.append('ellipse').attr('cx', ox).attr('cy', -6)
          .attr('rx', rxB).attr('ry', ryB).attr('fill', col).attr('opacity', 0)
        function _animPuff() {
          (puff as unknown as { interrupt: () => void }).interrupt()
          const jitter = (Math.random() - .5) * 3
          puff.attr('cy', -6).attr('opacity', .85 + Math.random() * .15)
              .attr('rx', rxB).attr('ry', ryB)
          puff.transition().duration(dur + Math.random() * 200 - 100)
            .ease(d3Lib.easeCubicOut)
            .attr('cy', peak + (Math.random() * 5 - 2.5))
            .attr('cx', ox + jitter)
            .attr('rx', rxB * 1.9 + Math.random() * 1.5)
            .attr('ry', ryB * 2.4 + Math.random() * 2)
            .attr('opacity', 0)
            .on('end', _animPuff)
        }
        setTimeout(_animPuff, delay)
      })

      // Humo
      const smokeColors = [
        'rgba(60,50,45,.28)', 'rgba(80,65,55,.22)',
        'rgba(45,38,35,.25)', 'rgba(70,58,50,.20)',
      ]
      const smokeConfig: [number, number, number, number, number, number][] = [
        [-8, 400, 3200, 3, 11, -72], [5, 900, 3600, 4, 13, -80],
        [-3, 1500, 2900, 3, 10, -65], [9, 200, 3400, 3, 12, -75],
        [-6, 1100, 3100, 2.5, 9, -68], [2, 1800, 3800, 4, 14, -84],
        [6, 650, 3000, 3, 11, -70],
      ]
      smokeConfig.forEach(([ox, delay, dur, r0, r1, py]) => {
        const col = smokeColors[Math.floor(Math.random() * smokeColors.length)]
        const smoke = fg.append('circle').attr('cx', ox).attr('cy', -20)
          .attr('r', r0).attr('fill', col).attr('opacity', 0)
        function _animSmoke() {
          (smoke as unknown as { interrupt: () => void }).interrupt()
          const driftX = (Math.random() - .5) * 8
          smoke.attr('cy', -22).attr('cx', ox).attr('opacity', 0).attr('r', r0)
          smoke.transition().duration(dur + Math.random() * 400)
            .ease(d3Lib.easeLinear)
            .attr('cy', py + (Math.random() * 8 - 4))
            .attr('cx', ox + driftX)
            .attr('r', r1 + Math.random() * 3)
            .attr('opacity', col.includes('.28') ? .32 : .22)
            .transition().duration(dur * 0.4)
            .attr('opacity', 0)
            .on('end', _animSmoke)
        }
        setTimeout(_animSmoke, delay)
      })

      // Brasas / chispas
      const emberColors = ['rgba(255,230,80,.9)', 'rgba(255,180,40,.85)', 'rgba(255,100,20,.8)']
      ;(function _emberLoop() {
        const ex = (Math.random() - .5) * 18
        const col = emberColors[Math.floor(Math.random() * emberColors.length)]
        const em = fg.append('circle').attr('cx', ex).attr('cy', -8)
          .attr('r', .8 + Math.random() * .7).attr('fill', col).attr('opacity', .9)
        em.transition().duration(800 + Math.random() * 600)
          .ease(d3Lib.easeCubicOut)
          .attr('cy', -50 - Math.random() * 20)
          .attr('cx', ex + (Math.random() - .5) * 10)
          .attr('r', .3).attr('opacity', 0)
          .on('end', () => em.remove())
        if (Math.random() > .3) {
          const ex2 = (Math.random() - .5) * 18
          const em2 = fg.append('circle').attr('cx', ex2).attr('cy', -8)
            .attr('r', .8 + Math.random() * .7).attr('fill', col).attr('opacity', .9)
          em2.transition().duration(800 + Math.random() * 600)
            .ease(d3Lib.easeCubicOut)
            .attr('cy', -50 - Math.random() * 20)
            .attr('cx', ex2 + (Math.random() - .5) * 10)
            .attr('r', .3).attr('opacity', 0)
            .on('end', () => em2.remove())
        }
        setTimeout(_emberLoop, 120 + Math.random() * 180)
      })()
    }

    // Fade-in del grupo; llamas arrancan al completarse
    fg.transition().duration(1100).ease(d3Lib.easeCubicOut).attr('opacity', 1)
      .on('end', _startFlames)
  }

  // PASO 1: Pan a Tenochtitlán con zoom
  const scale = 4.0
  const [px, py] = mapProj([TENOCHTITLAN.lon, TENOCHTITLAN.lat]) as [number, number]
  const tx = W / 2 - scale * px, ty = H / 2 - scale * py

  mapSvg.transition().duration(2400).ease(d3Lib.easeCubicInOut)
    .call(mapZoom.transform as never, d3Lib.zoomIdentity.translate(tx, ty).scale(scale))
    .on('end', () => {
      // PASO 2: Llamas y humo
      _addFireEffect()
      setTimeout(() => {
        // PASO 3: Dibujar nodos y conquistador
        drawNodes(gs, onSelectNode)
        drawConquistador(gs)
        setTimeout(() => {
          // PASO 4: Cartel — Caída de Tenochtitlán
          _showCard(
            `<div style="color:#e07070;font-size:clamp(.8rem,2.5vw,1.1rem);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.6rem">1521</div>
             <div style="color:#f0c060;font-size:clamp(1rem,3vw,1.5rem);margin-bottom:.8rem">Tenochtitlán ha caído</div>
             <div style="color:rgba(240,220,180,.75);font-size:clamp(.7rem,2vw,.9rem);font-family:'Crimson Text',serif;font-style:italic">El Imperio Azteca colapsa. La máquina de la conquista se pone en marcha.</div>`,
            4500,
            () => {
              // PASO 5: Cartel — Huye
              _showCard(
                `<div style="color:#e07070;font-size:clamp(.8rem,2.5vw,1.1rem);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.6rem">Los conquistadores avanzan</div>
                 <div style="color:#f0c060;font-size:clamp(1rem,3vw,1.5rem);margin-bottom:.8rem">¡Huye hacia el sur!</div>
                 <div style="color:rgba(240,220,180,.75);font-size:clamp(.7rem,2vw,.9rem);font-family:'Crimson Text',serif;font-style:italic">Tu pueblo espera en Guatemala. Guíalos.</div>`,
                4000,
                () => {
                  _removeCard()
                  // PASO 6: Conquistador avanza de cb0 → cb1 animado
                  const fromWp = CONQ_BRIDGE[0]
                  const newGs: GameState = { ...gs, conq: { ...gs.conq, routeIdx: 1 } }
                  const toWp = CONQ_BRIDGE[1]
                  showNotif(`⚔️ ${toWp.name ?? 'Avance'} — Los españoles avanzan`, 'loss')
                  // Propagar el nuevo estado a main.ts ANTES de que el jugador interactúe
                  onGsUpdate(newGs)
                  _animConqCinematic(fromWp, toWp, newGs, onSelectNode, () => {
                    // PASO 7: Pan a Guatemala
                    _panToGuatemala(newGs, onSelectNode)
                  })
                }
              )
            }
          )
        }, 2400)
      }, 1800)
    })
}

/** Animación del conquistador específicamente para la cinemática (sin mutar gs externo) */
function _animConqCinematic(
  from: { lon: number; lat: number },
  to:   { lon: number; lat: number },
  gs:   GameState,
  onSelectNode: ((id: string) => void) | undefined,
  onDone: () => void
): void {
  if (!mapSvg || !mapProj || !mapZoom || !mapG) { onDone(); return }
  const wrap = document.getElementById('map-canvas-wrap')
  if (!wrap) { onDone(); return }
  const W = wrap.clientWidth || 900, H = wrap.clientHeight || 580
  const scale = 4.0
  const [fx, fy] = mapProj([from.lon, from.lat]) as [number, number]
  const [tx, ty] = mapProj([to.lon,   to.lat])   as [number, number]
  const fxo = fx + 18, fyo = fy - 10
  const txo = tx + 18, tyo = ty - 10

  mapG.selectAll('.conq-layer').remove()
  const slideG = mapG.append('g').attr('class', 'conq-layer conq-token-anim')
    .attr('transform', `translate(${fxo},${fyo})`).attr('pointer-events', 'none')
  // Icono del conquistador
  slideG.append('circle').attr('r', 10).attr('fill', 'rgba(180,30,20,.82)')
    .attr('stroke', '#e87060').attr('stroke-width', 1.2)
  slideG.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('font-size', '11px').text('👑')

  // Línea de ruta
  mapG.insert('line', 'g.conq-token-anim').attr('class', 'conq-layer')
    .attr('x1', fxo).attr('y1', fyo).attr('x2', fxo).attr('y2', fyo)
    .attr('stroke', 'rgba(200,60,40,.5)').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
    .transition().duration(800).attr('x2', txo).attr('y2', tyo)

  slideG.transition().duration(1000).ease(d3Lib.easeCubicInOut)
    .attr('transform', `translate(${txo},${tyo})`)
    .on('end', () => {
      // Pan al nuevo punto
      const ptx = W / 2 - scale * tx, pty = H / 2 - scale * ty
      mapSvg!.transition().duration(800).ease(d3Lib.easeCubicInOut)
        .call(mapZoom!.transform as never, d3Lib.zoomIdentity.translate(ptx, pty).scale(scale))
        .on('end', () => {
          drawNodes(gs, onSelectNode)
          drawConquistador(gs)
          setTimeout(onDone, 400)
        })
    })
}

/** Pan final a Guatemala — donde empieza el jugador */
function _panToGuatemala(gs: GameState, onSelectNode?: (id: string) => void): void {
  if (!mapSvg || !mapProj || !mapZoom) return
  const wrap = document.getElementById('map-canvas-wrap')
  if (!wrap) return
  const W = wrap.clientWidth || 900, H = wrap.clientHeight || 580
  const GUATEMALA = { lon: -90.3, lat: 15.5 }
  const s2 = 3.2
  const [gx, gy] = mapProj([GUATEMALA.lon, GUATEMALA.lat]) as [number, number]
  const gtx = W / 2 - s2 * gx, gty = H / 2 - s2 * gy
  mapSvg.transition().duration(2000).ease(d3Lib.easeCubicInOut)
    .call(mapZoom.transform as never, d3Lib.zoomIdentity.translate(gtx, gty).scale(s2))
    .on('end', () => {
      drawNodes(gs, onSelectNode)
      drawConquistador(gs)
      // Listo — el jugador puede interactuar
    })
}

// ══════════════════════════════════════════════════════
// CINEMÁTICA DE MARCADORES HISTÓRICOS
// Cuando un nuevo acto se alcanza, algunos marcadores
// históricos se vuelven visibles. Para cada marcador nuevo
// se dispara una mini-cinemática: pan → texto → pan de vuelta.
// ══════════════════════════════════════════════════════

/**
 * Devuelve los marcadores del acto `newAct` que no se han mostrado aún.
 * Registra los devueltos para no repetirlos.
 */
export function getNewHistMarkersForAct(newAct: number): HistMarker[] {
  const fresh = HIST_MARKERS.filter(m => m.act === newAct && !_shownHistMarkers.has(m.id))
  fresh.forEach(m => _shownHistMarkers.add(m.id))
  return fresh
}

/**
 * Ejecuta la cinemática encadenada para una lista de marcadores históricos.
 * Al terminar todos llama onDone().
 */
export function runHistMarkerCinematic(
  markers:      HistMarker[],
  gs:           GameState,
  onSelectNode: ((id: string) => void) | undefined,
  onDone:       () => void,
): void {
  if (markers.length === 0) { onDone(); return }
  const [first, ...rest] = markers
  _showOneHistCinematic(first, gs, () => {
    // Encadenar el siguiente marcador o terminar
    runHistMarkerCinematic(rest, gs, onSelectNode, onDone)
  })
}

function _showOneHistCinematic(
  marker: HistMarker,
  gs:     GameState,
  onDone: () => void,
): void {
  if (!mapSvg || !mapProj || !mapZoom) { onDone(); return }
  const wrap = document.getElementById('map-canvas-wrap')
  if (!wrap) { onDone(); return }
  const W = wrap.clientWidth || 900, H = wrap.clientHeight || 580
  const scale = 3.8

  sfxCinematic()

  // ── Cámara robusta: usa 'end interrupt' + fallback timeout ──────────────
  function _panTo(lon: number, lat: number, sc: number, dur: number, cb: () => void): void {
    if (!mapSvg || !mapProj || !mapZoom) { cb(); return }
    const [px2, py2] = mapProj([lon, lat]) as [number, number]
    const tx = W / 2 - sc * px2, ty = H / 2 - sc * py2
    let fired = false
    const proceed = () => { if (fired) return; fired = true; cb() }
    const t = mapSvg.transition().duration(dur).ease(d3Lib.easeCubicInOut)
      .call(mapZoom!.transform as never, d3Lib.zoomIdentity.translate(tx, ty).scale(sc))
    ;(t as unknown as { on: (ev: string, fn: () => void) => void }).on('end', proceed)
    ;(t as unknown as { on: (ev: string, fn: () => void) => void }).on('interrupt', proceed)
    setTimeout(proceed, dur + 400)   // fallback por si D3 no dispara el evento
  }

  // ── Efecto de fuego sobre la ciudad conquistada ──────────────────────────
  function _addFireEffect(mx: number, my: number): void {
    if (!mapG) return
    mapG.selectAll(`.hist-fire-${marker.id}`).remove()
    const fires = ['🔥', '🔥', '🔥']
    fires.forEach((f, i) => {
      const offx = (i - 1) * 8
      const fg = mapG!.append('g')
        .attr('class', `hist-marker hist-fire-${marker.id}`)
        .attr('transform', `translate(${mx + offx},${my - 16})`)
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
      fg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('font-size', '10px').attr('pointer-events', 'none').text(f)
      fg.append('animateTransform')
        .attr('attributeName', 'transform').attr('type', 'translate')
        .attr('values', `${mx + offx},${my - 16};${mx + offx},${my - 20};${mx + offx},${my - 16}`)
        .attr('dur', `${1.2 + i * 0.25}s`).attr('repeatCount', 'indefinite')
      fg.transition().delay(i * 150).duration(600).ease(d3Lib.easeCubicOut).attr('opacity', 1)
    })
  }

  // ── Token del conquistador + halo (aparece en la cinemática) ────────────
  function _addConqTokenEffect(mx: number, my: number): void {
    if (!mapG) return
    mapG.selectAll(`.hist-conq-cinematic-${marker.id}`).remove()
    const ox = 18, oy = -8
    const cg = mapG.append('g')
      .attr('class', `hist-marker hist-conq-cinematic-${marker.id}`)
      .attr('transform', `translate(${mx + ox},${my + oy})`)
      .attr('pointer-events', 'none')
      .attr('opacity', 0)

    // Gran halo rojo pulsante para la entrada
    const bigHalo = cg.append('circle').attr('r', 22).attr('fill', 'none')
      .attr('stroke', 'rgba(192,57,43,.45)').attr('stroke-width', 2)
    bigHalo.append('animate').attr('attributeName', 'r').attr('values', '22;32;22')
      .attr('dur', '1.6s').attr('repeatCount', 'indefinite')

    cg.append('circle').attr('r', 9).attr('fill', 'rgba(100,15,15,.88)')
      .attr('stroke', 'rgba(220,60,40,.9)').attr('stroke-width', 1.8)
    cg.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '10px').text('👑')

    cg.transition().duration(700).ease(d3Lib.easeCubicOut).attr('opacity', 1)
  }

  // ── Card histórica con botón "Continuar con la huida" ───────────────────
  function _showHistCard(cb: () => void): void {
    // Limpiar instancias previas
    document.getElementById('hist-cinematic-overlay')?.remove()
    document.getElementById('hist-cinematic-card')?.remove()

    // ── Overlay oscuro que bloquea todo el juego detrás ──────────────────
    const overlay = document.createElement('div')
    overlay.id = 'hist-cinematic-overlay'
    overlay.style.cssText = [
      'position:fixed;top:0;left:0;width:100%;height:100%;',
      'background:rgba(0,0,0,.72);',
      'z-index:9990;pointer-events:all;',   // captura clicks, bloquea juego
      'opacity:0;transition:opacity .6s ease;',
    ].join('')
    document.body.appendChild(overlay)
    requestAnimationFrame(() => requestAnimationFrame(() => { overlay.style.opacity = '1' }))

    // ── Card centrada encima del overlay ─────────────────────────────────
    const card = document.createElement('div')
    card.id = 'hist-cinematic-card'
    const borderColor = marker.conquered ? 'rgba(192,57,43,.6)'  : 'rgba(80,140,50,.5)'
    const glowColor   = marker.conquered ? 'rgba(80,20,10,.6)'   : 'rgba(30,80,20,.4)'
    card.style.cssText = [
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      'z-index:9999;pointer-events:auto;text-align:center;',
      "font-family:'Cinzel',serif;",
      'padding:1.6rem 2.2rem 1.2rem;border-radius:5px;',
      `background:rgba(4,2,2,.97);border:1px solid ${borderColor};`,
      `box-shadow:0 0 60px ${glowColor},0 0 120px rgba(0,0,0,.8);`,
      'max-width:min(92vw,580px);width:100%;',
      'opacity:0;transition:opacity .8s ease;',
    ].join('')

    const conqBadge = marker.conquered
      ? `<div style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(120,20,10,.55);border:1px solid rgba(192,57,43,.45);border-radius:3px;padding:.22rem .7rem;margin-bottom:.8rem;font-size:.65rem;letter-spacing:.13em;color:rgba(230,100,80,.95)">👑 CONQUISTADO POR ESPAÑA</div>`
      : ''

    card.innerHTML = `
      ${conqBadge}
      <div style="color:rgba(200,120,60,.85);font-size:clamp(.65rem,2vw,.85rem);letter-spacing:.14em;text-transform:uppercase;margin-bottom:.4rem">${marker.year}</div>
      <div style="color:#f0d090;font-size:clamp(1.05rem,3vw,1.4rem);margin-bottom:.8rem">${marker.icon} ${marker.label}</div>
      <div style="color:rgba(215,225,185,.8);font-size:clamp(.74rem,2vw,.92rem);font-family:'Crimson Text',serif;font-style:italic;line-height:1.7;margin-bottom:1.4rem">${marker.narr}</div>
      <button id="hist-card-continue" style="
        font-family:'Cinzel',serif;font-size:.74rem;letter-spacing:.1em;cursor:pointer;
        background:rgba(50,20,10,.85);border:1px solid rgba(180,90,40,.65);color:rgba(230,175,80,.98);
        padding:.5rem 1.4rem;border-radius:3px;transition:background .2s,border-color .2s,color .2s;
      ">Continuar con la huida →</button>`

    document.body.appendChild(card)
    requestAnimationFrame(() => requestAnimationFrame(() => { card.style.opacity = '1' }))

    const btn = document.getElementById('hist-card-continue')
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        ;(btn as HTMLButtonElement).style.background    = 'rgba(100,45,10,.95)'
        ;(btn as HTMLButtonElement).style.borderColor   = 'rgba(230,150,60,.85)'
        ;(btn as HTMLButtonElement).style.color         = '#fff'
      })
      btn.addEventListener('mouseleave', () => {
        ;(btn as HTMLButtonElement).style.background    = 'rgba(50,20,10,.85)'
        ;(btn as HTMLButtonElement).style.borderColor   = 'rgba(180,90,40,.65)'
        ;(btn as HTMLButtonElement).style.color         = 'rgba(230,175,80,.98)'
      })
      btn.addEventListener('click', () => {
        overlay.style.opacity = '0'
        card.style.opacity    = '0'
        setTimeout(() => {
          overlay.remove()
          card.remove()
          cb()
        }, 700)
      })
    }
  }

  // ── Secuencia principal ───────────────────────────────────────────────────
  //
  // Bug de Cajamarca (primer marcador):
  //   _animateConqAdvance llama _centerOnNextNodes() JUSTO ANTES de onDone().
  //   _centerOnNextNodes hace setTimeout(centerMapOn, 180ms).
  //   Si el interrupt se dispara a 80ms (antes de esos 180ms) no hay
  //   transición activa que cancelar → noop.
  //   Luego el pan empieza a 150ms, pero centerMapOn arranca a 180ms y
  //   lo interrumpe 30ms después → D3 dispara 'interrupt' → proceed() se
  //   llama inmediatamente sin que la cámara se haya movido.
  //
  // Fix:
  //   • interrupt a 260ms  → después de que centerMapOn arrange (180ms)
  //   • pan a 380ms        → 120ms después del interrupt, transición limpia
  //   • fuego visible 2500ms antes del cartel → jugador puede ver la ciudad

  setTimeout(() => {
    if (mapSvg) (mapSvg as unknown as { interrupt: () => void }).interrupt()
  }, 260)

  // PASO 1: Pan al marcador histórico
  setTimeout(() => _panTo(marker.lon, marker.lat, scale, 1800, () => {
    const [mx, my] = mapProj!([marker.lon, marker.lat]) as [number, number]

    // PASO 2: Token del conquistador aparece en la ciudad
    _addConqTokenEffect(mx, my)

    // PASO 3: Fuego aparece 400ms después del token (efecto de llegada)
    if (marker.conquered) {
      setTimeout(() => _addFireEffect(mx, my), 400)
    }

    // PASO 4: Card aparece 2500ms después del pan — el jugador tiene tiempo
    // de ver la ciudad conquistada / el evento antes de que aparezca el texto
    setTimeout(() => {
      _showHistCard(() => {
        // PASO 5: Limpiar efectos cinemáticos y marcar como conquistado
        _conqueredMarkers.add(marker.id)
        mapG?.selectAll(`.hist-conq-cinematic-${marker.id}`).remove()
        mapG?.selectAll(`.hist-fire-${marker.id}`).remove()

        // PASO 6: Pan de vuelta al jugador
        _panBackToPlayer(gs, () => {
          drawHistMarkers(gs)
          onDone()
        })
      })
    }, 2500)
  }), 380)
}

/** Pan de vuelta a la zona del jugador después de una cinemática histórica */
function _panBackToPlayer(gs: GameState, onDone: () => void): void {
  if (!mapSvg || !mapProj || !mapZoom) { onDone(); return }
  const wrap = document.getElementById('map-canvas-wrap')
  const W = wrap?.clientWidth ?? 900, H = wrap?.clientHeight ?? 580
  const last = lastCompleted(gs)
  const nd = last ? gs.nodes[last] : null
  if (!nd) { onDone(); return }
  const scale = 2.6
  const [px, py] = mapProj([nd.lon, nd.lat]) as [number, number]
  const tx = W / 2 - scale * px, ty = H / 2 - scale * py
  let fired = false
  const proceed = () => { if (fired) return; fired = true; onDone() }
  const t = mapSvg.transition().duration(1600).ease(d3Lib.easeCubicInOut)
    .call(mapZoom.transform as never, d3Lib.zoomIdentity.translate(tx, ty).scale(scale))
  ;(t as unknown as { on: (ev: string, fn: () => void) => void }).on('end', proceed)
  ;(t as unknown as { on: (ev: string, fn: () => void) => void }).on('interrupt', proceed)
  setTimeout(proceed, 2200)
}

export function setupResizeHandler(getGs: () => GameState, getSelectNodeFn: () => ((id: string) => void) | undefined): void {
  let _resizeTimer: ReturnType<typeof setTimeout>
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer)
    _resizeTimer = setTimeout(() => {
      const active = document.querySelector('.screen.active')
      if (active?.id === 'map-screen') {
        resetMap()
        buildMap(getGs(), getSelectNodeFn())
      }
    }, 300)
  })
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const active = document.querySelector('.screen.active')
      if (active?.id === 'map-screen') {
        resetMap()
        buildMap(getGs(), getSelectNodeFn())
      }
    }, 500)
  })
}
