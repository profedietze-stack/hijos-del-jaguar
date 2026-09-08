import { CACIQUE_NAMES }  from '../data/nodes.js'
import { showScreen }      from '../ui/dom.js'

// Tokens tribales — emojis representativos de culturas aborígenes americanas
export const TRIBE_TOKENS: { emoji: string; name: string }[] = [
  { emoji: '🦅', name: 'Cóndor'        },
  { emoji: '🐆', name: 'Jaguar'         },
  { emoji: '🦁', name: 'Puma'           },
  { emoji: '🐍', name: 'Serpiente'      },
  { emoji: '🦜', name: 'Guacamayo'      },
  { emoji: '☀️', name: 'Sol Inca'       },
  { emoji: '🌙', name: 'Quilla'         },
  { emoji: '🐢', name: 'Tortuga'        },
  { emoji: '🦋', name: 'Mariposa'       },
  { emoji: '🌽', name: 'Maíz sagrado'   },
  { emoji: '🌺', name: 'Flor Amazónica' },
  { emoji: '⛰️', name: 'Andes'          },
]

let _selectedToken = TRIBE_TOKENS[0].emoji   // default: Cóndor

// ══════════════════════════════════════════════════════
// NAME SCREEN — elección del nombre y token del cacique
// ══════════════════════════════════════════════════════

export function mountNameScreen(): void {
  // Generar 8 sugerencias aleatorias
  // Fisher-Yates: `sort(() => Math.random() - 0.5)` no reparte parejo y
  // proponía casi siempre los mismos ocho nombres de la lista.
  const barajados = [...CACIQUE_NAMES]
  for (let i = barajados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[barajados[i], barajados[j]] = [barajados[j]!, barajados[i]!]
  }
  const shuffled = barajados.slice(0, 8)
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

  // Selector de token tribal
  _buildTokenPicker()

  showScreen('name-screen')
  setTimeout(() => input?.focus(), 300)
}

/** Construye la grilla de selección de token tribal */
function _buildTokenPicker(): void {
  const container = document.getElementById('tribe-token-picker')
  if (!container) return

  const btns = TRIBE_TOKENS.map(t => {
    const sel = t.emoji === _selectedToken ? ' selected' : ''
    return `<button class="token-btn${sel}" data-emoji="${t.emoji}" title="${t.name}" aria-label="${t.name}"><span class="token-emoji">${t.emoji}</span><span class="token-name">${t.name}</span></button>`
  }).join('')

  container.innerHTML = `<div class="token-picker-label">Elige el símbolo de tu tribu</div><div class="token-grid">${btns}</div>`

  container.querySelectorAll<HTMLButtonElement>('.token-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _selectedToken = btn.dataset.emoji ?? TRIBE_TOKENS[0].emoji
      container.querySelectorAll('.token-btn').forEach(b => b.classList.remove('selected'))
      btn.classList.add('selected')
    })
  })
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

/** Devuelve el emoji del token de tribu seleccionado */
export function getSelectedToken(): string {
  return _selectedToken
}
