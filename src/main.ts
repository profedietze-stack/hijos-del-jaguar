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
  saveGame, loadGame, clearSavedGame, clearAllProgress,
  pushToHistory, unlockAchievements, loadUnlockedAchievements,
} from './core/SaveSystem.js'

// ── Screens ───────────────────────────────────────────
import { mountSplash }                                  from './screens/SplashScreen.js'
import { mountMenu }                                    from './screens/MenuScreen.js'
import { mountCredits }                                 from './screens/CreditsScreen.js'
import { mountIntro, selectDiff, getSelectedDiff }      from './screens/IntroScreen.js'
import { mountNameScreen, randomCaciqueName, getEnteredName, getSelectedToken } from './screens/NameScreen.js'
import { mountEventScreen, preloadEventData }            from './screens/EventScreen.js'
import { showAftermath, showActTransition }           from './screens/AftermathScreen.js'
import { mountEndingScreen, captureEnding, setTopoCache, getTopoCache, showCaptureOverlay } from './screens/EndingScreen.js'
import { mountHistoryScreen, hsTab }                    from './screens/HistoryScreen.js'
import {
  buildMap, drawNodes, drawConquistador,
  animateConqStep, centerOnNextNodes,
  resetMap, setupResizeHandler,
  waitForMapThenCinematic,
  getNewHistMarkersForAct, runHistMarkerCinematic,
  animatePlayerToNode,
  getMapTopoCache,
} from './screens/MapScreen.js'

// ── UI ────────────────────────────────────────────────
import {
  initGlobalListeners, showScreen,
  showStatsBar, hideStatsBar, updateStatsBar,
  showNotifs, flashSaveIndicator, showConfirmModal,
  showAchievementToasts, showTutorial, tutorialSeen,
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

// ── Settings ──────────────────────────────────────────
import { initSettings }                                 from './core/SettingsSystem.js'
import { initSettingsModal, openSettings }              from './ui/SettingsModal.js'

// ── Debug (DEV only — tree-shaken en producción) ──────
import { log, initErrorBoundary }                       from './debug/logger.js'
import { initErrorBanner }                               from './ui/error-banner.js'

// ── Data ──────────────────────────────────────────────
// EVENTS_DEF eliminado: events.ts y claseData.ts se cargan de forma diferida
// desde EventScreen.preloadEventData() para reducir el bundle inicial.
import type { NodeState, ActNumber } from './data/types.js'
import { LOGROS_DEF }                from './data/achievements.js'

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
  initErrorBanner()
  initErrorBoundary()
  initSettings()
  initSettingsModal()
  initClaseMode()
  initGlobalListeners()
  wireAllButtons()
  setupResizeHandler(
    () => gs,
    () => _selectNodeFn,
  )
  _registerServiceWorker()

  // Debug panel — carga dinámica (fuera del bundle de producción)
  if (import.meta.env.DEV) {
    import('./debug/DebugPanel.js').then(({ initDebugPanel }) => {
      initDebugPanel({
        getGs:      () => gs,
        applyGs:    (newGs) => {
          gs = newGs
          // Reflejar cambios en el HUD si está visible
          const bar = document.getElementById('stats-bar')
          if (bar && bar.style.display !== 'none') updateStatsBar(gs)
        },
        selectNode: (id) => _selectNodeFn?.(id),
      })
    })
  }

  // El splash es el primer gesto del usuario.
  // Tone.js requiere un gesto para iniciar el AudioContext,
  // así que arrancamos el audio DESPUÉS de que el usuario hace click en el splash.
  mountSplash().then(() => {
    log('SCREEN', 'splash → menu')
    playTrack('menu')
    mountMenu()
  })
})

// ── Service Worker ────────────────────────────────────

/*
  El worker se pide contra la base con la que el juego se publica, no contra la raiz.

  `vite.config.ts` publica bajo `/hijos-del-jaguar/` salvo en Vercel, donde va en la raiz. Con
  `/sw.js` y `scope: '/'` fijos, en Vercel acertaba por casualidad y en cualquier otro sitio
  daba 404: cero service workers registrados, y por lo tanto cero modo offline.

  `BASE_URL` la escribe Vite con el valor de `base`, asi que las dos publicaciones aciertan sin
  que nadie tenga que acordarse. El `scope` va contra la misma base porque un worker no puede
  reclamar un alcance por encima de su propia ruta.
*/
function _registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  const base = import.meta.env.BASE_URL
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base })
    .catch((err) => {
      // Nada de tragarselo: el `catch` vacio que habia hizo que un 404 pareciera «no hay
      // soporte» durante meses. Sin HTTPS tambien falla, y ahi tambien conviene verlo.
      console.warn('[sw] no se pudo registrar el service worker', err)
    })
}

// ══════════════════════════════════════════════════════
// CONEXIÓN DE BOTONES
// ══════════════════════════════════════════════════════

function wireAllButtons(): void {
  // ── Menú ─────────────────────────────────────────────
  on('btn-mute',     () => { toggleMute() })
  on('btn-nueva',    () => { sfxClick(); mountIntro() })
  on('btn-credits',         () => { sfxClick(); mountCredits() })
  on('btn-credits-back',    () => { sfxClick(); playTrack('menu'); mountMenu() })
  on('tut-close',           () => { /* handled by showTutorial */ })
  on('btn-reset-all', () => {
    sfxClick()
    showConfirmModal(
      '⚠️ Borrar todo el progreso',
      'Se eliminarán <strong>todas las partidas guardadas, el historial y los logros</strong> desbloqueados. Esta acción no se puede deshacer.',
      () => {
        clearAllProgress()
        gs = null!
        _inCatchEvent = false
        _selectNodeFn = undefined
        hideStatsBar()
        resetMap()
        mountMenu()
      },
    )
  })
  on('btn-continue', () => { sfxClick(); continueGame() })
  on('btn-history',  () => { sfxClick(); mountHistoryScreen() })
  on('btn-settings', () => { sfxClick(); openSettings() })
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
  on('btn-end-share',    () => { sfxClick(); showCaptureOverlay() })
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
  log('ENGINE', `nueva partida diff=${diff} name="${name}" token=${tribeToken}`)
  gs = createInitialState(diff, name, tribeToken)
  _inCatchEvent = false
  clearSavedGame()
  resetMap()

  _selectNodeFn = onSelectNode
  playTrack('game')
  showStatsBar()
  updateStatsBar(gs)

  showScreen('map-screen')
  // Precargar events.ts y claseData.ts en segundo plano mientras el jugador
  // ve la cinematica de apertura (~10s) — estaran listos antes del primer nodo.
  preloadEventData()

  requestAnimationFrame(() => requestAnimationFrame(() => {
    buildMap(gs, _selectNodeFn)
    if (!tutorialSeen()) {
      // Primera partida: mostrar tutorial primero, lanzar cinemática al cerrar
      setTimeout(() => {
        showTutorial(() => {
          waitForMapThenCinematic(gs, _selectNodeFn, (updatedGs) => { gs = updatedGs })
        })
      }, 2200)
    } else {
      // Partidas siguientes: cinemática directa
      waitForMapThenCinematic(gs, _selectNodeFn, (updatedGs) => { gs = updatedGs })
    }
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

  // Precargar datos de eventos en segundo plano
  preloadEventData()

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

  // Posición actual del token: último nodo completado, o n00 al inicio
  const fromId = gs.history.length > 0 ? gs.history[gs.history.length - 1] : null
  const fromNd = fromId ? gs.nodes[fromId] : gs.nodes['n00']
  const toNd   = gs.nodes[nodeId]

  const _launchEvent = () => {
    gs = engineSelectNode(gs, nodeId)
    saveGame(gs)
    flashSaveIndicator()
    mountEventScreen(gs, onDecision)
  }

  // Animar token hacia el nodo seleccionado, luego lanzar el evento
  if (fromNd && toNd) {
    animatePlayerToNode(fromNd, toNd, gs, _launchEvent)
  } else {
    _launchEvent()
  }
}

// ══════════════════════════════════════════════════════
// FLUJO: DECISIÓN EN EL EVENTO
// ══════════════════════════════════════════════════════

function onDecision(_decisionIndex: number, decision: import('./data/types.js').Decision): void {
  // La decision ya viene del callback de EventScreen (que tiene EVENTS_DEF cargado).
  // main.ts ya no necesita importar EVENTS_DEF -- split del bundle.
  if (!decision) return

  // Guardar el acto actual ANTES de aplicar la decision (para detectar cambio de acto)
  const prevAct = gs.history.length > 0
    ? (gs.nodes[gs.history[gs.history.length - 1]]?.act ?? 1)
    : 1

  // SFX de decision
  sfxDecision()

  // Aplicar la decision al estado
  const result = applyDecision(gs, decision)
  gs = result.state
  log('ENGINE', `decision → node=${gs.currentNode ?? 'none'} defeated=${result.defeated} finished=${result.finished}`, gs.stats)

  // SFX segun resultado (feedback auditivo inmediato, antes del aftermath card)
  const hasLoss = result.notifs.some(n => n.kind === 'loss')
  const hasGain = result.notifs.some(n => n.kind === 'gain' || n.kind === 'info')
  if (hasLoss) setTimeout(sfxNegative, 180)
  else if (hasGain) setTimeout(sfxPositive, 180)

  // Actualizar stats bar de inmediato (el jugador ve el cambio en el HUD)
  updateStatsBar(gs)

  // Fin de partida -> ir al ending directamente (sin aftermath card)
  if (result.finished || result.defeated) {
    if (!result.ending) return
    log('ENGINE', `ending → ${result.ending.badge}`)
    showEnding(result.ending)
    return
  }

  // Aftermath card: mostrar consecuencias antes de volver al mapa
  showAftermath(result.notifs, () => _afterAftermath(prevAct))
}

/** Continua el flujo de juego despues de que el jugador descarta el aftermath card. */
function _afterAftermath(prevAct: number): void {
  // -- Evento de captura del conquistador --
  if (_inCatchEvent) {
    _inCatchEvent = false
    const prevHistory = gs.history.filter(id => id !== '_conq_catch_node')
    gs = {
      ...gs,
      history:     prevHistory,
      currentNode: prevHistory[prevHistory.length - 1] ?? gs.currentNode,
      nodes:       Object.fromEntries(
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

  // -- Motor del conquistador (sin doble azar) --
  const preConqGs = gs
  const conqResult = advanceConquistador(gs)
  gs = conqResult.state
  log('ENGINE', `conquistador → routeIdx=${gs.conq.routeIdx} caught=${conqResult.caught} reorg=${conqResult.reorg}`)
  showNotifs(conqResult.notifs)

  // Mostrar mapa con nodos y conquistador ya en su posicion final
  showScreen('map-screen')
  drawNodes(gs, _selectNodeFn)
  drawConquistador(gs)
  updateStatsBar(gs)
  saveGame(gs)
  log('SAVE', `auto-save history=${gs.history.length} alliances=${gs.alliances.length}`)
  flashSaveIndicator()

  // Detectar si hubo cambio de acto
  const newAct = gs.history.length > 0
    ? (gs.nodes[gs.history[gs.history.length - 1]]?.act ?? 1)
    : 1
  const newMarkers = newAct > prevAct ? getNewHistMarkersForAct(newAct) : []

  // Callback: despues del conquistador, cinematica de acto + marcadores
  const afterConq = () => {
    if (newAct > prevAct) {
      showActTransition(newAct, () => {
        if (newMarkers.length > 0) {
          runHistMarkerCinematic(newMarkers, gs, _selectNodeFn, () => centerOnNextNodes(gs))
        } else {
          centerOnNextNodes(gs)
        }
      })
    } else if (newMarkers.length > 0) {
      runHistMarkerCinematic(newMarkers, gs, _selectNodeFn, () => centerOnNextNodes(gs))
    } else {
      centerOnNextNodes(gs)
    }
  }

  // Animar el movimiento del conquistador (visual + SFX)
  if (gs.conq.caught) {
    sfxConqCatch()
    animateConqStep(preConqGs, gs, conqResult.reorg, () => {
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

  // Compartir el topo-cache con EndingScreen para evitar un segundo fetch del GeoJSON
  const cached = getMapTopoCache()
  if (cached) setTopoCache(cached)
  else if (getTopoCache() === null) setTopoCache(null)   // asegura que EndingScreen lea sessionStorage

  playTrack('menu')
  mountEndingScreen(gs, ending, allUnlocked, freshIds)

  // Toasts de logros recien desbloqueados (LOGROS_DEF ya esta en el bundle)
  if (freshIds.length > 0) {
    const toasts = freshIds
      .map(id => LOGROS_DEF.find(a => a.id === id))
      .filter((a): a is NonNullable<typeof a> => !!a)
      .map(a => ({ icon: a.icon, nombre: a.nombre, desc: a.desc }))
    showAchievementToasts(toasts, 1200)
  }
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

