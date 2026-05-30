import { DIFF_CONFIG }           from '../data/difficultyConfig.js'
import { showScreen }             from '../ui/dom.js'
import { enterFullscreen }        from '../ui/dom.js'

// ══════════════════════════════════════════════════════
// INTRO SCREEN — selección de dificultad
// ══════════════════════════════════════════════════════

type Difficulty = 'educativo' | 'historico' | 'legendario' | ''

let _selectedDiff: Difficulty = ''

/** Devuelve la dificultad actualmente seleccionada */
export function getSelectedDiff(): Difficulty {
  return _selectedDiff
}

export function mountIntro(): void {
  enterFullscreen()

  _selectedDiff = ''

  // Resetear estado visual de botones de dificultad
  const eduBtn = document.getElementById('diff-edu')
  const hisBtn = document.getElementById('diff-his')
  const legBtn = document.getElementById('diff-leg')
  if (eduBtn) eduBtn.classList.remove('selected')
  if (hisBtn) hisBtn.classList.remove('selected')
  if (legBtn) legBtn.classList.remove('selected')

  const descEl   = document.getElementById('diff-desc')
  const detailEl = document.getElementById('diff-detail')
  if (descEl)   descEl.textContent = 'Elegí un modo para continuar.'
  if (detailEl) detailEl.innerHTML = ''

  const btnComenzar = document.getElementById('btn-comenzar') as HTMLButtonElement | null
  if (btnComenzar) btnComenzar.disabled = true

  showScreen('intro-screen')

  // Scroll al tope
  requestAnimationFrame(() => {
    const s = document.getElementById('intro-scroll')
    if (s) s.scrollTop = 0
  })
}

/** Selecciona dificultad; actualiza UI */
export function selectDiff(diff: 'educativo' | 'historico' | 'legendario'): void {
  _selectedDiff = diff
  const cfg = DIFF_CONFIG[diff]

  document.getElementById('diff-edu')?.classList.toggle('selected', diff === 'educativo')
  document.getElementById('diff-his')?.classList.toggle('selected', diff === 'historico')
  document.getElementById('diff-leg')?.classList.toggle('selected', diff === 'legendario')

  const descEl = document.getElementById('diff-desc')
  if (descEl) descEl.textContent = cfg.desc

  const detailEl = document.getElementById('diff-detail')
  if (detailEl) {
    if (diff === 'historico') {
      detailEl.innerHTML = `
        <ul style="text-align:left;padding-left:1.2rem;font-size:.78rem;opacity:.65;line-height:1.7">
          <li>Efectos negativos amplificados ×1.25</li>
          <li>Umbrales de muerte más altos</li>
          <li>Penalidad por falta de alianzas en Acto III</li>
          <li>Conquistador más agresivo (32% de salto)</li>
        </ul>`
    } else if (diff === 'legendario') {
      detailEl.innerHTML = `
        <ul style="text-align:left;padding-left:1.2rem;font-size:.78rem;opacity:.65;line-height:1.7">
          <li>Estadísticas iniciales reducidas</li>
          <li>Efectos negativos amplificados ×1.55</li>
          <li>Efectos positivos reducidos ×0.65</li>
          <li>Penalidad por falta de alianzas desde el Acto II</li>
          <li>Conquistador brutal: 48% de salto directo</li>
          <li>Umbrales de muerte extremos — un error puede ser fatal</li>
        </ul>`
    } else {
      detailEl.innerHTML = ''
    }
  }

  const btnComenzar = document.getElementById('btn-comenzar') as HTMLButtonElement | null
  if (btnComenzar) btnComenzar.disabled = false
}
