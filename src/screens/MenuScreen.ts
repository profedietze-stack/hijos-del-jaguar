import { hasSavedGame }  from '../core/SaveSystem.js'
import { showScreen, hideStatsBar } from '../ui/dom.js'

// ══════════════════════════════════════════════════════
// MENU SCREEN
// ══════════════════════════════════════════════════════

declare const __APP_VERSION__: string

export function mountMenu(): void {
  showScreen('menu-screen')
  hideStatsBar()

  // Version dinamica desde package.json (inyectada por Vite define)
  const verEl = document.getElementById('menu-ver-num')
  if (verEl) verEl.textContent = `v${__APP_VERSION__}`

  const btnContinue = document.getElementById('btn-continue') as HTMLButtonElement | null
  if (btnContinue) btnContinue.disabled = !hasSavedGame()

  const btnHistory = document.getElementById('btn-history') as HTMLButtonElement | null
  if (btnHistory) btnHistory.disabled = false
}
