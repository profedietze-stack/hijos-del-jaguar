import { hasSavedGame }  from '../core/SaveSystem.js'
import { showScreen, hideStatsBar } from '../ui/dom.js'

// ══════════════════════════════════════════════════════
// MENU SCREEN
// ══════════════════════════════════════════════════════

export function mountMenu(): void {
  showScreen('menu-screen')
  hideStatsBar()

  const btnContinue = document.getElementById('btn-continue') as HTMLButtonElement | null
  if (btnContinue) btnContinue.disabled = !hasSavedGame()

  const btnHistory = document.getElementById('btn-history') as HTMLButtonElement | null
  if (btnHistory) btnHistory.disabled = false
}
