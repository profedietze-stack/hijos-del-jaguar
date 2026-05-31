// ══════════════════════════════════════════════════════
// MAIN.TS — Orquestador de la aplicación
// Conecta pantallas, motor de juego, audio y persistencia.
// Ningún módulo externo depende de este archivo.
// ══════════════════════════════════════════════════════

import './styles/main.css'

// ── Core ─────────────────────────────────────────────
import type { GameState }       from './core/GameState.js'
import { createInitialState }   from './core/GameState.js'

// ── Engine ────────────────────────────────────────────
import {
  applyDecision,
  advanceConquistador,
  selectNode as engineSelectNode,
  evaluateAchievements,
  normalizeConqState,
} from './core/GameEngine.js'

// ── Save ──────────────────────────────────────────────
import {
  saveGame, loadGame, clearSavedGame,
  pushToHistory, unlockAchievements, loadUnlockedAchievements,
} from './core/SaveSystem.js'

// ── Screens ───────────────────────────────────────────
import { mountSplash }                                  from './screens/SplashScreen.js'
import { mountMenu }                                    from './screens/MenuScreen.js'
import { mountIntro, selectDiff, getSelectedDiff }      from './screens/IntroScreen.js'
import { mountNameScreen, randomCaciqueName, getEnteredName, getSelectedToken } from './screens/NameScreen.js'
import { mountEventScreen }                             from './screens/EventScreen.js'
import { mountEndingScreen, captureEnding } from './screens/EndingScreen.js'
import { mountHistoryScreen, hsTab }                    from './screens/HistoryScreen.js'
import {
  buildMap, drawNodes, drawConquistador,
  animateConqStep, centerOnNextNodes,
  resetMap, setupResizeHandler,
  waitForMapThenCinematic,
  getNewHistMarkersForAct, runHistMarkerCinematic,
  animatePlayerToken,
} from './screens/MapScreen.js'

// ── UI ────────────────────────────────────────────────
import {
  initGlobalListeners, showScreen,
  showStatsBar, hideStatsBar, updateStatsBar,
  showNotifs, flashSaveIndicator, showConfirmModal,
} from './ui/dom.js'

// ── Audio ─────────────────────────────────────────────
import {
  playTrack, sfxClick, toggleMute,
  sfxNodeSelect, sfxDecision,
  sfxPositive, sfxNegative,
  sfxConqAdvance, sfxConqCatch,
} from './ui/audio.js'

// ── Modo Clase ────────────────────────────────────────
import { initClaseMode }                                from './ui/claseMode.js'

// ── Info Didáctica ────────────────────────────────────
import { openDidacticaOverlay }                         from './ui/didacticaOverlay.js'

// ── Data ──────────────────────────────────────────────
import { EVENTS_DEF } from './data/events.js'
import type { NodeState, ActNumber } from './data/types.js'

// ══════════════════════════════════════════════════════
// ESTADO GLOBAL DE LA SESIÓN
// ══════════════════════════════════════════════════════

// gs es la única variable mutable de sesión.
// Se reemplaza completo (patrón inmutable) en cada paso.
let gs: GameState = null!

// Callback inyectado al mapa; capturado para el resize handler
let _selectNodeFn: ((id: string) => void) | undefined

// Flag: estamos en el evento del conquistador (para flujo especial)
let _inCatchEvent = false

// ══════════════════════════════════════════════════════
// BOOTSTRAP
// ══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initClaseMode()
  initGlobalListeners()
  wireAllButtons()
  setupResizeHandler(
    () => gs,
    () => _selectNodeFn,
  )
  _registerServiceWorker()

  // El splash es el primer gesto del usuario.
  // Tone.js requiere un gesto para iniciar el AudioContext,
  // así que arrancamos el audio DESPUÉS de que el usuario hace click en el splash.
  mountSplash().then(() => {
    playTrack('menu')
    mountMenu()
  })
})

// ── Service Worker ────────────────────────────────────

function _registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .catch(() => { /* silencioso en dev o sin HTTPS */ })
}

// ══════════════════════════════════════════════════════
// CONEXIÓN DE BOTONES
// ══════════════════════════════════════════════════════

function wireAllButtons(): void {
  // ── Menú ─────────────────────────────────────────────
  on('btn-mute',     () => { toggleMute() })
  on('btn-nueva',    () => { sfxClick(); mountIntro() })
  on('btn-continue', () => { sfxClick(); continueGame() })
  on('btn-history',  () => { sfxClick(); mountHistoryScreen() })
  on('btn-info-didactica', () => { sfxClick(); openDidacticaOverlay() })

  // ── Intro: dificultad ────────────────────────────────
  on('diff-edu',  () => { sfxClick(); selectDiff('educativo') })
  on('diff-his',  () => { sfxClick(); selectDiff('historico') })
  on('diff-leg',  () => { sfxClick(); selectDiff('legendario') })
  on('btn-comenzar',    () => { sfxClick(); onComenzarClicked() })
  on('btn-back-intro',  () => { sfxClick(); mountMenu() })

  // ── Nombre del cacique ───────────────────────────────
  on('btn-name-confirm', () => { sfxClick(); onNameConfirmed() })
  on('btn-name-random',  () => { sfxClick(); randomCaciqueName() })
  on('btn-back-name',    () => { sfxClick(); mountIntro() })

  // ── Mapa: botón de menú ──────────────────────────────
  on('map-menu-btn', () => {
    sfxClick()
    showConfirmModal(
      'Volver al menú',
      '¿Querés volver al menú? La partida se guarda automáticamente.',
      () => {
        playTrack('menu')
        hideStatsBar()
        mountMenu()
      },
    )
  })

  // ── Pantalla de evento: botón de menú ────────────────
  on('ev-menu-btn', () => {
    sfxClick()
    showConfirmModal(
      'Volver al menú',
      '¿Querés volver al menú? La partida se guarda automáticamente.',
      () => {
        playTrack('menu')
        hideStatsBar()
        mountMenu()
      },
    )
  })

  // ── Pantalla de fin ───────────────────────────────────
  on('btn-end-capture',  () => { sfxClick(); captureEnding() })
  on('btn-end-share',    () => { sfxClick(); document.getElementById('captura-overlay')?.classList.add('visible') })
  on('btn-end-newgame',  () => { sfxClick(); mountIntro() })
  on('btn-end-menu',     () => { sfxClick(); playTrack('menu'); hideStatsBar(); mountMenu() })

  // ── Overlay pedagógico ────────────────────────────────
  on('map-ped-btn', () => { sfxClick(); openPedOverlay() })
  on('ev-ped-btn',  () => { sfxClick(); openPedOverlay() })

  // ── Historial: tabs ───────────────────────────────────
  onDelegate('.hs-tab', (btn) => {
    sfxClick()
    const tab     = (btn as HTMLElement).dataset.tab ?? ''
    const panelId = `hs-panel-${tab}`
    hsTab(btn as HTMLElement, panelId)
  })
  on('hs-back-btn', () => { sfxClick(); playTrack('menu'); mountMenu() })

  // ── Captura: cerrar overlay ───────────────────────────
  on('btn-cerrar-captura', () => {
    const overlay = document.getElementById('captura-overlay')
    if (overlay) overlay.classList.remove('visible')
  })

  // ── Pedagogical overlay: cerrar ───────────────────────
  on('ped-close', () => {
    document.getElementById('ped-overlay')?.classList.remove('open')
  })

  // ── Info Didáctica: cerrar ────────────────────────────
  on('did-close', () => {
    document.getElementById('didactica-overlay')?.classList.remove('open')
  })

  // ── Fullscreen al hacer click en título ───────────────
  // (se maneja en IntroScreen con enterFullscreen)
}

// ── Helper: addEventListener por ID ──────────────────

function on(id: string, fn: (e: Event) => void): void {
  document.getElementById(id)?.addEventListener('click', fn)
}

/** Delega eventos en elementos dinámicos */
function onDelegate(selector: string, fn: (el: Element) => void): void {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest(selector)
    if (el) fn(el)
  })
}

// ══════════════════════════════════════════════════════
// FLUJO: INTRO → NOMBRE → NUEVA PARTIDA
// ══════════════════════════════════════════════════════

function onComenzarClicked(): void {
  const diff = getSelectedDiff()
  if (!diff) return
  mountNameScreen()
}

function onNameConfirmed(): void {
  const name = getEnteredName()
  if (!name) return
  const diff = getSelectedDiff()
  if (!diff) return
  const token = getSelectedToken()
  startNewGame(diff as 'educativo' | 'historico' | 'legendario', name, token)
}

function startNewGame(diff: 'educativo' | 'historico' | 'legendario', name: string, tribeToken = '🦅'): void {
  gs = createInitialState(diff, name, tribeToken)
  _inCatchEvent = false
  clearSavedGame()
  resetMap()

  _selectNodeFn = onSelectNode
  playTrack('game')
  showStatsBar()
  updateStatsBar(gs)

  showScreen('map-screen')
  requestAnimationFrame(() => requestAnimationFrame(() => {
    buildMap(gs, _selectNodeFn)
    waitForMapThenCinematic(gs, _selectNodeFn, (updatedGs) => { gs = updatedGs })
  }))
}

// ══════════════════════════════════════════════════════
// FLUJO: CONTINUAR PARTIDA
// ══════════════════════════════════════════════════════

function continueGame(): void {
  const loaded = loadGame()
  if (!loaded) {
    mountMenu()
    return
  }
  gs = normalizeConqState(loaded)
  // Safety: partidas antiguas pueden no tener caciqueName o tribeToken
  if (!gs.caciqueName) gs = { ...gs, caciqueName: 'el cacique' }
  if (!gs.tribeToken)  gs = { ...gs, tribeToken: '🦅' }
  _inCatchEvent = false
  _selectNodeFn = onSelectNode

  resetMap()
  playTrack('game')
  showStatsBar()
  updateStatsBar(gs)

  // Si hay un nodo activo, ir directo al evento
  if (gs.currentNode) {
    mountEventScreen(gs, onDecision)
  } else {
    buildMap(gs, _selectNodeFn)
    showScreen('map-screen')
  }
}

// ══════════════════════════════════════════════════════
// FLUJO: SELECCIÓN DE NODO EN EL MAPA
// ══════════════════════════════════════════════════════

function onSelectNode(nodeId: string): void {
  sfxNodeSelect()
  gs = engineSelectNode(gs, nodeId)
  saveGame(gs)
  flashSaveIndicator()
  mountEventScreen(gs, onDecision)
}

// ══════════════════════════════════════════════════════
// FLUJO: DECISIÓN EN EL EVENTO
// ══════════════════════════════════════════════════════

function onDecision(decisionIndex: number): void {
  // Obtener decisión del evento actual
  const nodeId  = gs.currentNode
  if (!nodeId) return
  const eventId = gs.nodes[nodeId]?.eventId
  if (!eventId) return
  const ev = EVENTS_DEF[eventId]
  if (!ev) return
  const decision = ev.decisions[decisionIndex]
  if (!decision) return

  // Guardar el acto actual ANTES de aplicar la decisión (para detectar cambio de acto)
  const prevAct = gs.history.length > 0
    ? (gs.nodes[gs.history[gs.history.length - 1]]?.act ?? 1)
    : 1

  // Nodo desde donde el jugador se mueve (para animar el token tribal)
  const prevLastNodeId = gs.history.length > 0 ? gs.history[gs.history.length - 1] : null
  const prevLastNode   = prevLastNodeId ? gs.nodes[prevLastNodeId] : null

  // SFX de decisión
  sfxDecision()

  // Aplicar la decisión al estado
  const result = applyDecision(gs, decision)
  gs = result.state
  // SFX según resultado (notificaciones de pérdida o ganancia)
  const hasLoss = result.notifs.some(n => n.kind === 'loss')
  const hasGain = result.notifs.some(n => n.kind === 'gain' || n.kind === 'info')
  if (hasLoss) setTimeout(sfxNegative, 180)
  else if (hasGain) setTimeout(sfxPositive, 180)
  showNotifs(result.notifs)
  updateStatsBar(gs)

  // ── ¿Fin de partida? (derrota o nodo final) ───────────
  if (result.finished || result.defeated) {
    if (!result.ending) return   // safety guard
    showEnding(result.ending)
    return
  }

  // ── Evento de captura del conquistador ────────────────
  // Después del catch event, el jugador puede sobrevivir o morir
  if (_inCatchEvent) {
    _inCatchEvent = false
    // Limpiar el nodo virtual del historial
    gs = {
      ...gs,
      history:  gs.history.filter(id => id !== '_conq_catch_node'),
      nodes:    Object.fromEntries(
        Object.entries(gs.nodes).filter(([k]) => k !== '_conq_catch_node'),
      ),
      conq: { ...gs.conq, caught: false, reorgTurns: 2 },
    }
    saveGame(gs)
    flashSaveIndicator()
    drawNodes(gs, _selectNodeFn)
    showScreen('map-screen')
    centerOnNextNodes(gs)
    return
  }

  // ── Motor del conquistador primero (sin doble azar) ──
  const preConqGs = gs
  const conqResult = advanceConquistador(gs)
  gs = conqResult.state
  showNotifs(conqResult.notifs)

  // Mostrar mapa con nodos y conquistador ya en su posición final
  showScreen('map-screen')
  drawNodes(gs, _selectNodeFn)
  drawConquistador(gs)
  updateStatsBar(gs)
  saveGame(gs)
  flashSaveIndicator()

  // Animar el token tribal del jugador desde el nodo anterior al nuevo
  const newLastNodeId = gs.history.length > 0 ? gs.history[gs.history.length - 1] : null
  const newLastNode   = newLastNodeId ? gs.nodes[newLastNodeId] : null
  if (prevLastNode && newLastNode && prevLastNodeId !== newLastNodeId) {
    animatePlayerToken(prevLastNode, newLastNode, gs)
  }

  // Detectar si hubo cambio de acto → marcadores históricos nuevos
  const newAct = gs.history.length > 0
    ? (gs.nodes[gs.history[gs.history.length - 1]]?.act ?? 1)
    : 1
  const newMarkers = newAct > prevAct ? getNewHistMarkersForAct(newAct) : []

  // Callback final: después del conquistador, mostrar cinemáticas históricas si hay
  const afterConq = () => {
    if (newMarkers.length > 0) {
      runHistMarkerCinematic(newMarkers, gs, _selectNodeFn, () => {
        centerOnNextNodes(gs)
      })
    } else {
      centerOnNextNodes(gs)
    }
  }

  // Animar el movimiento del conquistador (visual + SFX)
  if (gs.conq.caught) {
    sfxConqCatch()
    animateConqStep(preConqGs, gs, conqResult.reorg, () => {
      // Si hay marcadores históricos nuevos, mostrarlos ANTES del evento de captura.
      // Así nunca se superpone la cinemática con el event screen.
      if (newMarkers.length > 0) {
        runHistMarkerCinematic(newMarkers, gs, _selectNodeFn, () => {
          setTimeout(() => triggerConqCatch(), 400)
        })
      } else {
        setTimeout(() => triggerConqCatch(), 400)
      }
    }, _selectNodeFn)
  } else if (!conqResult.reorg) {
    sfxConqAdvance()
    animateConqStep(preConqGs, gs, conqResult.reorg, afterConq, _selectNodeFn)
  } else {
    animateConqStep(preConqGs, gs, conqResult.reorg, afterConq, _selectNodeFn)
  }
}

// ══════════════════════════════════════════════════════
// EVENTO ESPECIAL: EL CONQUISTADOR ALCANZA AL GRUPO
// ══════════════════════════════════════════════════════

function triggerConqCatch(): void {
  // Determinar el acto actual para la narrativa
  const currentAct: ActNumber = (
    gs.currentNode && gs.nodes[gs.currentNode]?.act
      ? gs.nodes[gs.currentNode].act
      : 2
  ) as ActNumber

  // Inyectar el nodo virtual de captura
  const catchNode: NodeState = {
    id:           '_conq_catch_node',
    name:         'Emboscada del Conquistador',
    desc:         'Los conquistadores te han alcanzado.',
    icon:         '⚔️',
    lon:          gs.nodes[gs.history[gs.history.length - 1] ?? 'n00']?.lon ?? -65,
    lat:          gs.nodes[gs.history[gs.history.length - 1] ?? 'n00']?.lat ?? -15,
    act:          currentAct,
    eventPool:    ['_conq_catch'],
    eventId:      '_conq_catch',
    completed:    false,
    unlocked:     true,
    next:         [],
  }

  gs = {
    ...gs,
    nodes: { ...gs.nodes, _conq_catch_node: catchNode },
    currentNode: '_conq_catch_node',
  }

  _inCatchEvent = true
  mountEventScreen(gs, onDecision)
}

// ══════════════════════════════════════════════════════
// FLUJO: PANTALLA FINAL
// ══════════════════════════════════════════════════════

function showEnding(ending: import('./data/types.js').EndingDef): void {
  // Evaluar logros de esta partida
  const earnedIds  = evaluateAchievements(gs, ending)
  const freshIds   = unlockAchievements(earnedIds)       // guarda y devuelve solo los nuevos
  const allUnlocked = loadUnlockedAchievements()

  // Guardar en historial y limpiar save
  if (gs.pendingGame) {
    pushToHistory(gs.pendingGame)
  }
  clearSavedGame()

  playTrack('menu')
  mountEndingScreen(gs, ending, allUnlocked, freshIds)
}

// ══════════════════════════════════════════════════════
// OVERLAY PEDAGÓGICO
// ══════════════════════════════════════════════════════

const PED_TABS = [
  { id: 'cronologia', label: 'Cronología' },
  { id: 'conquista',  label: 'La Conquista' },
  { id: 'pueblos',    label: 'Pueblos' },
  { id: 'docente',    label: 'Nota docente' },
]

const PED_CONTENT: Record<string, string> = {
  cronologia: `
    <div style="font-size:.82rem;line-height:1.85;color:var(--parch2)">
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1492</strong> — Colón llega a América. Inicio del período colonial.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1519</strong> — Hernán Cortés conquista Tenochtitlán. Caída del Imperio Azteca.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1532</strong> — Francisco Pizarro captura al Inca Atahualpa en Cajamarca. 168 soldados españoles contra 80.000 guerreros.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1533</strong> — Pizarro ejecuta a Atahualpa y entra al Cusco. Fin del Tawantinsuyu.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1541</strong> — Francisco de Orellana navega el Amazonas de oeste a este por primera vez.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1545</strong> — Descubrimiento del Cerro Rico de Potosí. Inicio de la explotación masiva de plata.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1550</strong> — Inicio de la Guerra de Arauco. Los mapuches resisten durante 260 años.</div>
      <div style="margin-bottom:.55rem"><strong style="color:var(--ocre2)">1550–1600</strong> — La población indígena colapsa en un 90% por enfermedades, esclavitud y violencia.</div>
    </div>`,
  conquista: `
    <div style="font-size:.82rem;line-height:1.85;color:var(--parch2)">
      <p>La conquista española fue uno de los mayores genocidios de la historia humana. Entre 1492 y 1650, la población indígena de América pasó de aproximadamente 60 millones a menos de 6 millones.</p>
      <p>Las causas fueron múltiples: <strong style="color:var(--ocre)">enfermedades</strong> (viruela, sarampión — sin inmunidad previa), <strong style="color:var(--ocre)">esclavitud</strong> en minas y encomiendas, <strong style="color:var(--ocre)">violencia directa</strong> y destrucción de los sistemas alimentarios.</p>
      <p>En el juego, el conquistador representa el avance histórico real del dominio colonial hacia el sur. Tu objetivo: llegar a los confines del continente — Patagonia y Amazonas — antes de ser alcanzado.</p>
      <p style="font-style:italic;opacity:.65">Los pueblos que nunca fueron conquistados — mapuches, kawésqar, yanomami — lo lograron por la geografía, la resistencia armada y el aislamiento voluntario.</p>
    </div>`,
  pueblos: `
    <div style="font-size:.82rem;line-height:1.85;color:var(--parch2)">
      <p>Durante la travesía podés aliarte con distintos pueblos del continente:</p>
      <ul style="padding-left:1.1rem;margin:.4rem 0;list-style:none">
        <li style="margin-bottom:.5rem">🌿 <strong style="color:var(--ocre2)">Muiscas</strong> — Altiplano colombiano. Civilización con escritura proto-jeroglífica y sofisticado sistema de intercambio.</li>
        <li style="margin-bottom:.5rem">🌊 <strong style="color:var(--ocre2)">Shipibo-Conibo</strong> — Amazonía peruana. Conocimiento profundo de plantas medicinales.</li>
        <li style="margin-bottom:.5rem">🏔 <strong style="color:var(--ocre2)">Quechuas / Incas</strong> — Herederos del Tawantinsuyu. Aliados valiosos en los Andes.</li>
        <li style="margin-bottom:.5rem">🦅 <strong style="color:var(--ocre2)">Mapuches</strong> — El único pueblo que derrotó militarmente a España. Su territorio nunca fue conquistado durante el período colonial.</li>
        <li style="margin-bottom:.5rem">🌬 <strong style="color:var(--ocre2)">Tehuelches</strong> — Cazadores-recolectores patagónicos. Llamados "patagones" por los europeos por su estatura.</li>
        <li style="margin-bottom:.5rem">⛵ <strong style="color:var(--ocre2)">Kawésqar</strong> — Nómades de los canales australes. Adaptados al clima más extremo del continente.</li>
      </ul>
    </div>`,
  docente: `
    <div style="font-size:.82rem;line-height:1.85;color:var(--parch2)">
      <p><strong style="color:var(--ocre2)">¿Para qué nivel?</strong><br>Secundaria (12–18 años). Modo Educativo para introducir el tema; modo Histórico para grupos con conocimiento previo.</p>
      <p><strong style="color:var(--ocre2)">Contenidos curriculares</strong><br>Historia colonial americana · Geografía de América del Sur · Diversidad cultural · Derechos de pueblos originarios · Pensamiento crítico sobre el relato histórico dominante.</p>
      <p><strong style="color:var(--ocre2)">Actividades sugeridas post-juego</strong></p>
      <ul style="padding-left:1.1rem;margin:.3rem 0">
        <li>Discusión grupal: ¿qué decisiones tomaron? ¿cuáles fueron las más difíciles?</li>
        <li>Investigar uno de los pueblos aliados con los que interactuaron.</li>
        <li>Narrar la misma historia desde la perspectiva española.</li>
        <li>Comparar la ruta del juego con mapas históricos reales.</li>
        <li>Reflexionar: ¿qué pueblos del recorrido siguen existiendo hoy? ¿en qué condiciones?</li>
      </ul>
      <p style="margin-top:.8rem;font-size:.73rem;opacity:.45">Hijos del Jaguar · Creado por ProfeD · 2024</p>
    </div>`,
}

function openPedOverlay(): void {
  const tabsEl = document.getElementById('ped-tabs')
  const contentEl = document.getElementById('ped-content')
  if (!tabsEl || !contentEl) return

  // Construir tabs (solo en primera apertura o si están vacíos)
  if (!tabsEl.innerHTML) {
    tabsEl.innerHTML = PED_TABS.map((t, i) =>
      `<button class="ped-tab${i === 0 ? ' active' : ''}" data-ped="${t.id}">${t.label}</button>`
    ).join('')

    tabsEl.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLElement>('.ped-tab')
      if (!btn) return
      tabsEl.querySelectorAll('.ped-tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      contentEl.innerHTML = PED_CONTENT[btn.dataset.ped ?? 'cronologia'] ?? ''
    })
  }

  // Mostrar el primer tab
  const firstTab = tabsEl.querySelector<HTMLElement>('.ped-tab')
  tabsEl.querySelectorAll('.ped-tab').forEach(b => b.classList.remove('active'))
  if (firstTab) {
    firstTab.classList.add('active')
    contentEl.innerHTML = PED_CONTENT[firstTab.dataset.ped ?? 'cronologia'] ?? ''
  }

  document.getElementById('ped-overlay')?.classList.add('open')
}
