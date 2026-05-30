import { CACIQUE_NAMES }  from '../data/nodes.js'
import { showScreen }      from '../ui/dom.js'

// ══════════════════════════════════════════════════════
// NAME SCREEN — elección del nombre del cacique
// ══════════════════════════════════════════════════════

export function mountNameScreen(): void {
  // Generar 8 sugerencias aleatorias
  const shuffled = [...CACIQUE_NAMES].sort(() => Math.random() - 0.5).slice(0, 8)
  const sugEl = document.getElementById('name-suggestions')
  if (sugEl) {
    sugEl.innerHTML = shuffled
      .map(n => `<button class="name-sug" data-name="${n}">${n}</button>`)
      .join('')
    sugEl.querySelectorAll<HTMLButtonElement>('.name-sug').forEach(btn => {
      btn.addEventListener('click', () => selectCaciqueName(btn.dataset.name ?? ''))
    })
  }

  // Resetear input
  const input = document.getElementById('cacique-name-input') as HTMLInputElement | null
  if (input) {
    input.value = ''
    input.oninput = () => {
      const btnConfirm = document.getElementById('btn-name-confirm') as HTMLButtonElement | null
      if (btnConfirm) btnConfirm.disabled = input.value.trim().length < 2
    }
  }

  const btnConfirm = document.getElementById('btn-name-confirm') as HTMLButtonElement | null
  if (btnConfirm) btnConfirm.disabled = true

  showScreen('name-screen')
  setTimeout(() => input?.focus(), 300)
}

export function selectCaciqueName(name: string): void {
  const input = document.getElementById('cacique-name-input') as HTMLInputElement | null
  if (!input) return
  input.value = name
  const btnConfirm = document.getElementById('btn-name-confirm') as HTMLButtonElement | null
  if (btnConfirm) btnConfirm.disabled = false
  input.focus()
}

export function randomCaciqueName(): void {
  const name = CACIQUE_NAMES[Math.floor(Math.random() * CACIQUE_NAMES.length)]
  selectCaciqueName(name)
}

/** Devuelve el nombre ingresado o null si es inválido */
export function getEnteredName(): string | null {
  const input = document.getElementById('cacique-name-input') as HTMLInputElement | null
  if (!input) return null
  const name = input.value.trim()
  return name.length >= 2 ? name : null
}
