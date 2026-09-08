import type { GameState } from '../core/GameState.js'
import type { EndingDef, Difficulty }   from '../data/types.js'
import { totalM }                        from '../core/GameState.js'
import { DIFF_CONFIG }                   from '../data/difficultyConfig.js'
import { LOGROS_DEF }                    from '../data/achievements.js'
import { EDGES }                         from '../data/nodes.js'
import { showScreen, showStatsBar, updateStatsBar } from '../ui/dom.js'
import * as d3Lib from 'd3'
import * as topojson from 'topojson-client'

// ══════════════════════════════════════════════════════
// ENDING SCREEN
// ══════════════════════════════════════════════════════

// ── Nombres de alianzas ───────────────────────────────

const ALLIANCE_NAMES: Record<string, string> = {
  // ── Originales ──────────────────────────────────────
  pipil:                 'Pipiles',
  cunas:                 'Cunas/Guna',
  caribes:               'Caribes',
  muiscas:               'Muiscas',
  inca:                  'Quechuas/Incas',
  yanomami:              'Yanomami',
  shipibo:               'Shipibo-Conibo',
  embera:                'Emberá',
  tehuelches:            'Tehuelches',
  tehuelches_laguna:     'Tehuelches (laguna)',
  tehuelches_invierno:   'Tehuelches (invierno)',
  kawesqar:              'Kawésqar',
  mapuches:              'Mapuches',
  mapuches_parlamento:   'Mapuches (parlamento)',
  ribeirinhos:           'Pueblo del Río',
  guardianes:            'Guardianes de la Selva',
  mojos:                 'Pueblo Mojos',
  mojos_ingenieros:      'Mojos (canales)',
  ranqueles:             'Ranqueles',
  sierras:               'Chamana de las Sierras',
  interprete:            'El Intérprete',
  // ── Expansión Acto I ────────────────────────────────
  tzotziles:             'Tzotziles de Chiapas',
  ngabe_bugle:           'Ngäbe-Buglé',
  cimarron:              'El Cimarrón',
  // ── Expansión Acto III ──────────────────────────────
  omaguacas:             'Omaguacas',
  tobas:                 'Tobas (Qom)',
  tobas_agua:            'Tobas (guardianes del agua)',
  guaranies_ibera:       'Guaraníes del Iberá',
  // ── Expansión Acto IV ───────────────────────────────
  yagua:                 'Yagua del Ucayali',
  guardianes_fuentes:    'Guardianes de las Fuentes',
  tehuelches_sur:        'Tehuelches del Sur',
  tehuelches_boleadoras: 'Tehuelches (boleadoras)',
  kawesqar_nino:         'Kawésqar (niño guía)',
  kawesqar_canales:      'Kawésqar (canales)',
  kawesqar_navegacion:   'Kawésqar (navegación)',
}

// ── Preguntas de reflexión ────────────────────────────

const REFL_PREGUNTAS: Record<string, string[]> = {
  amazonas: [
    '¿Por qué la Amazonía fue un refugio viable para pueblos que huían de la conquista?',
    '¿Qué diferencias hay entre "sobrevivir" y "resistir" culturalmente?',
    '¿Qué pueblos amazónicos reales mantuvieron el aislamiento voluntario hasta el siglo XX?',
  ],
  patagonia_arg: [
    '¿Por qué los españoles nunca pudieron colonizar la Patagonia durante el período colonial?',
    '¿Qué fue la "Conquista del Desierto" de 1879 y cómo cambió la situación de los tehuelches?',
    '¿Cómo se relaciona el territorio con la identidad cultural de un pueblo?',
  ],
  patagonia_chi: [
    '¿Qué hacía tan difícil la navegación de los canales patagónicos para los europeos?',
    '¿Por qué los kawésqar pudieron mantener su modo de vida mucho más tiempo que otros pueblos?',
    '¿Qué significa que un pueblo "desaparezca" — desaparecen las personas o desaparece la cultura?',
  ],
  tragico: [
    '¿Qué factores hacen que la resistencia indígena fracasara en muchos casos?',
    '¿Por qué la demografía indígena cayó tan drásticamente entre 1492 y 1650?',
    '¿Qué significa el "olvido" como herramienta de dominación colonial?',
  ],
  default: [
    '¿Qué decisiones del juego te resultaron más difíciles? ¿Por qué?',
    '¿Qué pueblos indígenas del recorrido todavía existen hoy? ¿En qué condiciones?',
    '¿Qué cambiaría si el mismo viaje lo narraras desde la perspectiva española?',
  ],
}

// ── Nombres de actos ──────────────────────────────────

const ACT_NAMES: Record<number, string> = {
  1: 'Acto I · Huida',
  2: 'Acto II · Travesía',
  3: 'Acto III · El Sur',
  4: 'Acto IV · El Destino',
}

// ── Títulos aborígenes ────────────────────────────────

interface LeaderTitle {
  cond:  (m: number, alliances: string[], history: string[], stats: GameState['stats']) => boolean
  title: string
  why:   string
}

const LEADER_TITLES: LeaderTitle[] = [
  { cond: (m, a)            => m >= 35 && a.length >= 4,
    title: 'Tlatoani del Horizonte',
    why:   'Guiaste a tu pueblo hacia el sur con abundancia y una red de alianzas que atraviesa el continente. Los cronistas de otros pueblos recordarán tu nombre.' },
  { cond: (m, a)            => m >= 30 && a.length >= 3,
    title: 'Cacique de los Cuatro Vientos',
    why:   'Tu liderazgo unió pueblos de tierras diferentes. Cuatro alianzas, treinta almas en pie: no es poca cosa para un camino sin mapa.' },
  { cond: (m, a)            => a.length >= 4 && m >= 20,
    title: 'Tejedora/Tejedor de Pueblos',
    why:   'Más alianzas que cualquier otra cosa define tu viaje. Entendiste que ningún pueblo sobrevive solo.' },
  { cond: (m, a)            => m >= 30 && a.length < 2,
    title: 'Cacique Solitario del Sur',
    why:   'Llegaste con mucha gente y pocas alianzas. Tu pueblo sobrevivió por su fortaleza interna, no por la de otros. Fuerza propia, horizonte propio.' },
  { cond: (_m, _a, _h, s)  => s.moral >= 70,
    title: 'Guardián/a del Fuego Vivo',
    why:   'La moral de tu pueblo nunca se apagó. Aún en los momentos más duros, supiste mantener vivo el fuego de la identidad colectiva.' },
  { cond: (_m, _a, h)      => h.length >= 12,
    title: 'Caminante de los Mil Días',
    why:   'Exploraste más lugares que la mayoría. Tu camino no fue el más corto, sino el más completo. Los mapas futuros llevarán tu huella.' },
  { cond: (_m, _a, _h, s)  => s.food >= 65,
    title: 'Señora/Señor de los Graneros',
    why:   'Nunca dejaste que tu pueblo pasara hambre real. En un viaje de meses por selvas y montañas, eso es sabiduría práctica.' },
  { cond: (_m, _a, _h, s)  => s.union >= 70,
    title: 'Cacique de la Palabra Unida',
    why:   'La unión de tu pueblo fue tu mayor arma. Donde otros se fragmentaron, vos mantuviste el círculo intacto.' },
  { cond: (m)               => m >= 20 && m < 25,
    title: 'Custodio/a de los Que Quedaron',
    why:   'El camino fue duro. Perdiste gente. Pero los que llegaron, llegaron por tu voluntad de no rendirte cuando era más fácil detenerse.' },
  { cond: (m)               => m < 15,
    title: 'El/La Último/a en Apagar el Fuego',
    why:   'El pueblo llegó diezmado. Pero llegó. Y en ese gesto de seguir hasta el final hay una dignidad que los vencedores nunca podrán escribir en sus crónicas.' },
  { cond: ()                => true,
    title: 'Cacique del Camino sin Nombre',
    why:   'Tu viaje no encaja en ningún molde conocido. Eso lo hace memorable.' },
]

// ── Helpers de cálculo ────────────────────────────────

function resolveLeaderTitle(
  m:        number,
  alliances: string[],
  history:  string[],
  stats:    GameState['stats'],
): LeaderTitle {
  return LEADER_TITLES.find(t => t.cond(m, alliances, history, stats)) ?? LEADER_TITLES[LEADER_TITLES.length - 1]
}

function haversineKm(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calcRouteKm(history: string[], nodes: GameState['nodes']): number {
  let km = 0
  for (let i = 0; i < history.length - 1; i++) {
    const a = nodes[history[i]]
    const b = nodes[history[i + 1]]
    if (a && b) km += haversineKm(a.lon, a.lat, b.lon, b.lat)
  }
  return Math.round(km)
}

interface ScoreResult {
  total:     number
  breakdown: Array<{ label: string; val: number; mult: string }>
}

function calcScore(
  m:         number,
  alliances: string[],
  history:   string[],
  dur:       number,
  diff:      string,
): ScoreResult {
  const survScore    = m * 8
  const allyScore    = alliances.length * 120
  const exploreScore = history.length * 45
  const timeBonus    = dur > 0 ? Math.max(0, Math.round(800 - dur * 3)) : 0
  const diffMult     = diff === 'legendario' ? 2.0 : diff === 'historico' ? 1.5 : 1.0
  const diffMultStr  = diff === 'legendario' ? '×2'  : diff === 'historico' ? '×1.5' : '×1'
  const raw = Math.round((survScore + allyScore + exploreScore + timeBonus) * diffMult)
  return {
    total: raw,
    breakdown: [
      { label: 'Supervivientes', val: survScore,    mult: diffMultStr },
      { label: 'Alianzas',       val: allyScore,    mult: '' },
      { label: 'Exploración',    val: exploreScore, mult: '' },
      { label: 'Velocidad',      val: timeBonus,    mult: '' },
    ],
  }
}

// ── Radar SVG ─────────────────────────────────────────

interface RadarPoint { label: string; value: number; color: string }

function drawRadar(svgEl: SVGElement, data: RadarPoint[]): void {
  const cx = 120, cy = 120, r = 80, n = data.length
  const svg = d3Lib.select(svgEl)
  svg.selectAll('*').remove()
  ;[0.25, 0.5, 0.75, 1].forEach(f => {
    svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r * f)
      .attr('fill', 'none').attr('stroke', 'rgba(196,136,42,.1)').attr('stroke-width', 0.8)
  })
  const pts = data.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const rv = r * (d.value / 100)
    return {
      x: cx + rv * Math.cos(angle), y: cy + rv * Math.sin(angle),
      ax: cx + r  * Math.cos(angle), ay: cy + r  * Math.sin(angle),
    }
  })
  data.forEach((_, i) => {
    svg.append('line').attr('x1', cx).attr('y1', cy)
      .attr('x2', pts[i].ax).attr('y2', pts[i].ay)
      .attr('stroke', 'rgba(196,136,42,.15)').attr('stroke-width', 0.8)
  })
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ')
  svg.append('polygon').attr('points', poly)
    .attr('fill', 'rgba(196,136,42,.18)').attr('stroke', 'rgba(232,169,58,.7)').attr('stroke-width', 1.5)
  pts.forEach(p => {
    svg.append('circle').attr('cx', p.x).attr('cy', p.y).attr('r', 3)
      .attr('fill', 'var(--ocre2)').attr('stroke', 'rgba(0,0,0,.5)').attr('stroke-width', 1)
  })
}

// ── Mini mapa de ruta (ending) ────────────────────────

// Caché compartida con MapScreen (inyectada desde main.ts)
let _topoCache: unknown = null
export function setTopoCache(cache: unknown): void { _topoCache = cache }
export function getTopoCache(): unknown             { return _topoCache  }

function buildEndingRouteMap(gs: GameState): void {
  const svg  = document.getElementById('end-route-svg')  as SVGElement | null
  const wrap = document.getElementById('end-route-wrap')
  if (!svg || !wrap || !gs.nodes) return
  const W = wrap.clientWidth  || 700
  const H = wrap.clientHeight || 300
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)

  const allNodes = Object.values(gs.nodes)
  const lons = allNodes.map(n => n.lon)
  const lats = allNodes.map(n => n.lat)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const PAD_LON = 6, PAD_LAT = 5
  const cLon   = (minLon + maxLon) / 2
  const cLat   = (minLat + maxLat) / 2
  const spanLon = (maxLon - minLon) + PAD_LON * 2
  const spanLat = (maxLat - minLat) + PAD_LAT * 2
  const MARGIN  = 0.82
  const scaleByW = (W * MARGIN) / spanLon * 54
  const scaleByH = (H * MARGIN) / spanLat * 54
  const scale    = Math.min(scaleByW, scaleByH, 320)

  const proj   = d3Lib.geoMercator().center([cLon, cLat]).scale(scale).translate([W / 2, H / 2])
  const pathFn = d3Lib.geoPath().projection(proj)
  const svgSel = d3Lib.select(svg)
  svgSel.selectAll('*').remove()
  const g = svgSel.append('g')

  const render = () => {
    if (_topoCache) {
      type TopoWorld = import('topojson-specification').Topology
      const topo = _topoCache as unknown as TopoWorld
      const countries = topojson.feature(topo, (topo.objects as Record<string, import('topojson-specification').GeometryCollection>)[Object.keys(topo.objects)[0]]) as { features: unknown[] }
      const inReg = (f: unknown) => {
        try {
          const c = pathFn.centroid(f as Parameters<typeof pathFn.centroid>[0])
          if (!c || isNaN(c[0])) return false
          return c[0] > -20 && c[0] < W + 20 && c[1] > -20 && c[1] < H + 20
        } catch { return false }
      }
      g.append('g').selectAll('path').data(countries.features.filter(inReg)).enter().append('path')
        .attr('d', pathFn as unknown as string)
        .attr('fill', '#13230c').attr('stroke', '#3a6828').attr('stroke-width', 0.5)
        .attr('pointer-events', 'none')
    }
    const nodes   = gs.nodes
    const histSet = new Set(gs.history)
    const edgeIdx = new Set(EDGES.map(([a, b]) => `${a}|${b}`))
    EDGES.forEach(([aId, bId]) => {
      const a = nodes[aId], b = nodes[bId]; if (!a || !b) return
      const [ax, ay] = proj([a.lon, a.lat]) as [number, number]
      const [bx, by] = proj([b.lon, b.lat]) as [number, number]
      g.append('line').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by)
        .attr('stroke', 'rgba(255,255,255,.04)').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,4')
    })
    for (let i = 0; i < gs.history.length - 1; i++) {
      const a = gs.history[i], b = gs.history[i + 1]
      const key = edgeIdx.has(`${a}|${b}`) ? `${a}|${b}` : edgeIdx.has(`${b}|${a}`) ? `${b}|${a}` : null
      if (!key) continue
      const na = nodes[a], nb = nodes[b]; if (!na || !nb) continue
      const [ax, ay] = proj([na.lon, na.lat]) as [number, number]
      const [bx, by] = proj([nb.lon, nb.lat]) as [number, number]
      g.append('line').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by)
        .attr('stroke', 'rgba(196,136,42,.22)').attr('stroke-width', 5).attr('stroke-dasharray', '7,5')
      g.append('line').attr('x1', ax).attr('y1', ay).attr('x2', bx).attr('y2', by)
        .attr('stroke', 'rgba(232,169,58,.9)').attr('stroke-width', 1.8).attr('stroke-dasharray', '7,5')
    }
    Object.values(nodes).forEach(nd => {
      const [x, y] = proj([nd.lon, nd.lat]) as [number, number]
      const vis = histSet.has(nd.id)
      const ng = g.append('g').attr('transform', `translate(${x},${y})`)
      if (vis) {
        ng.append('circle').attr('r', 7).attr('fill', 'rgba(196,136,42,.2)').attr('stroke', 'rgba(232,169,58,.85)').attr('stroke-width', 1.5)
        ng.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('font-size', '8px').attr('pointer-events', 'none').text(nd.icon)
      } else {
        ng.append('circle').attr('r', 3.5).attr('fill', 'rgba(8,6,4,.6)').attr('stroke', 'rgba(255,255,255,.08)').attr('stroke-width', 0.6)
      }
    })
    const s = nodes[gs.history[0]]
    const e = nodes[gs.history[gs.history.length - 1]]
    if (s) { const [sx, sy] = proj([s.lon, s.lat]) as [number, number]; g.append('text').attr('x', sx).attr('y', sy - 13).attr('text-anchor', 'middle').attr('font-size', '6px').attr('font-family', 'Cinzel,serif').attr('fill', 'rgba(232,169,58,.8)').attr('pointer-events', 'none').text('INICIO') }
    if (e) { const [ex, ey] = proj([e.lon, e.lat]) as [number, number]; g.append('text').attr('x', ex).attr('y', ey - 13).attr('text-anchor', 'middle').attr('font-size', '6px').attr('font-family', 'Cinzel,serif').attr('fill', 'rgba(232,169,58,.8)').attr('pointer-events', 'none').text('DESTINO') }
  }

  // Intentar sessionStorage antes de hacer fetch
  if (!_topoCache) {
    try {
      const raw = sessionStorage.getItem('jaguar_topo_v1')
      if (raw) _topoCache = JSON.parse(raw)
    } catch (_) { /* sin storage */ }
  }
  if (_topoCache) { render(); return }
  const fetchPromise = fetch(`${import.meta.env.BASE_URL}geo/countries-110m.json`)
    .then(r => r.json()).then((w: unknown) => {
      _topoCache = w
      try { sessionStorage.setItem('jaguar_topo_v1', JSON.stringify(w)) } catch (_) { /* sin storage */ }
      return w
    })
    .catch(() => null)
  fetchPromise.then(() => render()).catch(() => render())
}

// ── Hitos de ruta ─────────────────────────────────────

function renderHitos(history: string[], nodes: GameState['nodes']): void {
  const cont = document.getElementById('end-hitos')
  if (!cont) return
  cont.innerHTML = ''
  history.forEach(nid => {
    const nd = nodes[nid]; if (!nd) return
    const el = document.createElement('div')
    el.className = 'ehito'
    el.innerHTML = `<div class="ehito-dot">${nd.icon}</div>
      <div class="ehito-name">${nd.name.split('–')[0].trim()}</div>
      <div class="ehito-act">${ACT_NAMES[nd.act] ?? ''}</div>`
    cont.appendChild(el)
  })
}

// ── Logros ────────────────────────────────────────────

function renderLogros(diff: Difficulty, desbloqueados: Set<string>, nuevos: Set<string>): void {
  const el = document.getElementById('logros-grid')
  if (!el) return
  const relevantes = LOGROS_DEF.filter(l => l.modos.includes(diff))
  el.innerHTML = relevantes.map(l => {
    const ok      = desbloqueados.has(l.id)
    const esNuevo = nuevos.has(l.id)
    return `<div class="logro-card ${ok ? 'desbloqueado' : 'bloqueado'}">
      <div class="logro-icon">${l.icon}</div>
      <div class="logro-info">
        <div class="logro-nombre">${l.nombre}</div>
        <div class="logro-desc">${l.desc}</div>
        ${esNuevo ? '<div class="logro-nuevo">✦ Desbloqueado ahora</div>' : ''}
      </div>
    </div>`
  }).join('')
}

// ── Captura de pantalla ───────────────────────────────

/** true si el dispositivo es táctil (Android, iOS) */
function isTouchDevice(): boolean {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
}

export async function captureEnding(): Promise<void> {
  // En dispositivos táctiles (iOS/Android), html2canvas falla por imágenes CORS.
  // Mostramos la captura-overlay con instrucciones nativas del sistema operativo.
  if (isTouchDevice()) {
    _showMobileCaptureOverlay()
    return
  }

  // Desktop: html2canvas funciona correctamente
  const btn    = document.querySelector<HTMLButtonElement>('.end-btn-main')
  const status = document.getElementById('end-capture-status')
  if (btn)    { btn.disabled = true; btn.textContent = '⏳ Capturando…' }
  if (status) { status.textContent = ''; status.classList.remove('visible') }
  try {
    const html2canvas = await loadHtml2Canvas()
    const doc = document.getElementById('end-doc')
    if (!doc) throw new Error('No se encontró #end-doc')
    const canvas = await html2canvas(doc, {
      backgroundColor: '#080604', scale: 2, useCORS: true, allowTaint: false,
      scrollX: 0, scrollY: 0,
      width: doc.scrollWidth, height: doc.scrollHeight,
      windowWidth: doc.scrollWidth, windowHeight: doc.scrollHeight,
    })
    const link = document.createElement('a')
    const date = new Date().toLocaleDateString(undefined).replace(/\//g, '-')
    link.download = `hijos-del-jaguar-${date}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    if (status) { status.textContent = '✓ Imagen descargada correctamente'; status.style.color = 'var(--jade3)'; status.classList.add('visible') }
  } catch {
    // Si html2canvas falla en desktop, ofrecer la tarjeta manual
    _showMobileCaptureOverlay()
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📸 Guardar resultado' }
    setTimeout(() => status?.classList.remove('visible'), 5000)
  }
}

/**
 * Muestra la captura-overlay (tarjeta solo-texto) con instrucciones de captura nativa.
 * Exportada para que main.ts la use en el botón "Ver tarjeta" también.
 * Funciona en cualquier dispositivo y no depende de html2canvas ni CORS.
 */
export function showCaptureOverlay(): void { _showMobileCaptureOverlay() }

function _showMobileCaptureOverlay(): void {
  // Actualizar instrucción según plataforma
  const instrEl = document.getElementById('captura-instruccion')
  if (instrEl) {
    const ua = navigator.userAgent
    const isIOS     = /iPad|iPhone|iPod/.test(ua)
    const isMacOS   = /Mac/.test(ua) && !isIOS
    const isAndroid = /Android/.test(ua)
    if (isIOS) {
      instrEl.innerHTML = '📱 Presioná <strong>Botón lateral + Volumen arriba</strong> (o <strong>Home + Power</strong> en iPhone 8 o anterior) para capturar la pantalla.'
    } else if (isAndroid) {
      instrEl.innerHTML = '📱 Presioná <strong>Botón de encendido + Bajar volumen</strong> al mismo tiempo para capturar la pantalla.'
    } else if (isMacOS) {
      instrEl.innerHTML = 'Mac: <strong>Cmd + Shift + 4</strong> para capturar área, o <strong>Cmd + Shift + 3</strong> para pantalla completa.'
    } else {
      instrEl.innerHTML = 'Windows: <strong>Impr Pant</strong> o <strong>Win + Shift + S</strong> para capturar la pantalla.'
    }
  }
  document.getElementById('captura-overlay')?.classList.add('visible')
}

type Html2CanvasFn = (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>

function loadHtml2Canvas(): Promise<Html2CanvasFn> {
  const win = window as unknown as { html2canvas?: Html2CanvasFn }
  if (win.html2canvas) return Promise.resolve(win.html2canvas)
  return new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src     = `${import.meta.env.BASE_URL}vendor/html2canvas.min.js`
    s.onload  = () => res((window as unknown as { html2canvas: Html2CanvasFn }).html2canvas)
    s.onerror = () => rej(new Error('No se pudo cargar html2canvas'))
    document.head.appendChild(s)
  })
}

// ── Tarjeta de captura ────────────────────────────────

function _populateCaptureCard(
  gs:      GameState,
  ending:  EndingDef,
  lt:      LeaderTitle,
  score:   ScoreResult,
  newIds:  string[],
  endDate: string,
): void {
  const cSet     = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v }
  const cSetHtml = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.innerHTML   = v }
  const m = totalM(gs.stats)
  const s = gs.stats

  cSet('captura-glyph',  ending.glyph)
  cSet('captura-badge',  ending.badge)
  cSet('captura-title',  ending.title)
  cSet('captura-leader', lt.title + (gs.caciqueName ? ` — ${gs.caciqueName}` : ''))

  // Grid de stats con clases CSS definidas en history.css
  cSetHtml('captura-stats', [
    `<div><div class="cap-stat-val">${m}</div><div class="cap-stat-label">Supervivientes</div></div>`,
    `<div><div class="cap-stat-val">${gs.alliances.length}</div><div class="cap-stat-label">Alianzas</div></div>`,
    `<div><div class="cap-stat-val">${gs.history.length}</div><div class="cap-stat-label">Lugares</div></div>`,
    `<div><div class="cap-stat-val" style="font-size:.9rem">🌽${s.food}</div><div class="cap-stat-label">Alimentos</div></div>`,
    `<div><div class="cap-stat-val" style="font-size:.9rem">🔥${s.moral}</div><div class="cap-stat-label">Moral</div></div>`,
    `<div><div class="cap-stat-val" style="font-size:.9rem">💊${s.salud}</div><div class="cap-stat-label">Salud</div></div>`,
  ].join(''))

  cSet('captura-score', score.total.toLocaleString())

  const newSet    = new Set(newIds)
  const ganados   = LOGROS_DEF.filter(l => newSet.has(l.id))
  cSetHtml('captura-logros', ganados.length > 0
    ? ganados.map(l => `<span class="cap-logro">${l.icon} ${l.nombre}</span>`).join('')
    : '')

  cSet('captura-footer', `${endDate} · ${gs.diff === 'legendario' ? '💀 Legendario' : gs.diff === 'historico' ? '⚔️ Histórico' : '📖 Educativo'}`)
}

// ── mountEndingScreen ─────────────────────────────────

export function mountEndingScreen(
  gs:             GameState,
  ending:         EndingDef,
  unlockedIds:    string[],
  newIds:         string[],
): void {
  const m          = totalM(gs.stats)
  const s          = gs.stats
  const alliances  = gs.alliances
  const history    = gs.history
  const nodes      = gs.nodes
  const diff       = gs.diff
  const dur        = Math.round((Date.now() - gs.startTime) / 60000)
  const totalNodes = Object.keys(nodes).length
  const visitedCount = history.length
  const dest       = ending.dest ?? 'tragico'

  // ── Sello
  const set = (id: string, v: string) => {
    const el = document.getElementById(id); if (el) el.textContent = v
  }
  set('end-glyph', ending.glyph)
  set('end-badge', ending.badge)
  set('end-title', ending.title)

  // ── Título aborigen
  const lt       = resolveLeaderTitle(m, alliances, history, s)
  const nameEl   = document.getElementById('end-leader-label')
  if (nameEl) {
    nameEl.innerHTML = gs.caciqueName
      ? `Cacique <span style="color:var(--ocre2);font-family:'Cinzel',serif;font-size:1rem">${gs.caciqueName}</span> — Tu título como líder`
      : 'Tu título como líder'
  }
  set('end-leader-title', lt.title)
  set('end-leader-why',   lt.why)

  // ── Narrativa
  const narrEl = document.getElementById('end-narr')
  if (narrEl) narrEl.innerHTML = ending.narr

  // ── Kilómetros
  const km = calcRouteKm(history, nodes)
  set('end-km-label', `~ ${km.toLocaleString()} km recorridos`)

  // ── Hitos
  renderHitos(history, nodes)

  // ── Stats grid
  const cfg       = DIFF_CONFIG[diff]
  const dfeatThr  = cfg.defeatThreshold
  const modeLabel = diff === 'legendario' ? '💀 Legendario' : diff === 'historico' ? '⚔️ Histórico' : '📖 Educativo'
  const endDate   = new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })
  const avgRes    = Math.round((s.food + s.moral + s.salud + s.union) / 4)

  const cards = [
    { val: m,                         label: 'Supervivientes',  sub: 'de 50 iniciales',       danger: m < dfeatThr * 2,          warn: m < dfeatThr * 3  },
    { val: s.warriors,                label: 'Guerreros',       sub: 'al llegar',              danger: s.warriors < 3,            warn: false              },
    { val: s.shamans,                  label: 'Chamanes',        sub: 'al llegar',              danger: s.shamans < 2,             warn: false              },
    { val: s.civilians,               label: 'Civiles',         sub: 'al llegar',              danger: false,                     warn: false              },
    { val: alliances.length,          label: 'Alianzas',        sub: 'pueblos aliados',        danger: false,                     warn: alliances.length < 2},
    { val: visitedCount,              label: 'Lugares',         sub: `de ${totalNodes} posibles`, danger: false,                  warn: false              },
    { val: km.toLocaleString(),label: 'Kilómetros',      sub: 'recorridos aprox.',      danger: false,                     warn: false              },
    { val: dur,                       label: 'Minutos',         sub: 'tiempo de juego',        danger: false,                     warn: false              },
    { val: modeLabel,                 label: 'Dificultad',      sub: '',                       danger: false,                     warn: false              },
    { val: avgRes,                    label: 'Recursos finales',sub: 'promedio',               danger: avgRes < 25,               warn: avgRes < 45        },
  ] as const

  const statsGrid = document.getElementById('end-stats-grid')
  if (statsGrid) {
    statsGrid.innerHTML = cards.map(c => `
      <div class="esg-card">
        <div class="esg-val${c.danger ? ' danger' : c.warn ? ' warn' : ''}">${c.val}</div>
        <div class="esg-label">${c.label}</div>
        ${c.sub ? `<div class="esg-sub">${c.sub}</div>` : ''}
      </div>`).join('')
  }

  // ── Puntaje
  const score = calcScore(m, alliances, history, dur, diff)
  set('end-score-value', score.total.toLocaleString())
  const breakdownEl = document.getElementById('end-score-breakdown')
  if (breakdownEl) {
    breakdownEl.textContent = score.breakdown
      .map(b => `${b.label}: ${b.val}${b.mult ? ` ${b.mult}` : ''}`)
      .join(' · ')
  }

  // ── Radar
  const radarData: RadarPoint[] = [
    { label: 'Supervivencia', value: Math.round(m / 50 * 100),              color: '#d4a017' },
    { label: 'Alianzas',      value: Math.min(100, alliances.length * 20),  color: '#27ae60' },
    { label: 'Exploración',   value: Math.round(visitedCount / totalNodes * 100), color: '#3498db' },
    { label: 'Recursos',      value: avgRes,                                color: '#9b59b6' },
    { label: 'Cohesión',      value: Math.min(100, s.union + 5),            color: '#e67e22' },
  ]
  const radarSvg = document.getElementById('end-radar-svg') as SVGElement | null
  if (radarSvg) drawRadar(radarSvg, radarData)
  const radarLabels = document.getElementById('end-radar-labels')
  if (radarLabels) {
    radarLabels.innerHTML = radarData.map(d => `
      <div class="erl-row">
        <div class="erl-dot" style="background:${d.color}"></div>
        <div class="erl-name">${d.label}</div>
        <div class="erl-bar-bg"><div class="erl-bar-fill" style="width:${d.value}%;background:${d.color}66"></div></div>
        <div class="erl-pct">${d.value}%</div>
      </div>`).join('')
  }

  // ── Alianzas
  const allianceEl = document.getElementById('end-alliances-list')
  if (allianceEl) {
    if (alliances.length === 0) {
      allianceEl.innerHTML = '<span class="eal-tag none">Sin alianzas forjadas</span>'
    } else {
      const unique = [...new Set(alliances)]
      allianceEl.innerHTML = unique.map(a => `<span class="eal-tag">${ALLIANCE_NAMES[a] ?? a}</span>`).join('')
    }
  }

  // ── Reflexión
  const reflEl = document.getElementById('end-refl')
  if (reflEl) reflEl.innerHTML = `<strong>🎓 Reflexión Educativa</strong>${ending.refl}`
  const preguntas = REFL_PREGUNTAS[dest] ?? REFL_PREGUNTAS['default']
  const reflPEl = document.getElementById('end-refl-preguntas')
  if (reflPEl) reflPEl.innerHTML = preguntas.map(p => `<div class="erp-item">${p}</div>`).join('')

  // ── Footer
  set('end-footer-date', `Partida completada el ${endDate}`)

  // ── Logros
  renderLogros(diff, new Set(unlockedIds), new Set(newIds))

  // ── Tarjeta de captura manual (captura-overlay)
  _populateCaptureCard(gs, ending, lt, score, newIds, endDate)

  // ── Mostrar pantalla
  showScreen('ending-screen')
  showStatsBar()
  updateStatsBar(gs)

  requestAnimationFrame(() => {
    const screen = document.getElementById('ending-screen')
    if (screen) screen.scrollTop = 0
    requestAnimationFrame(() => buildEndingRouteMap(gs))
  })

}
