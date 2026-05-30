// ══════════════════════════════════════════════════════
// CLASE MODE — Modo Escena en Clase
// Activado con ?modo=clase en la URL.
// Opción A: HUD oculto, texto y botones grandes para TV/proyector.
// Opción B: Ficha didáctica con contexto histórico y pregunta
//           antes de que el docente revele las decisiones.
// ══════════════════════════════════════════════════════

let _isClase = false

/**
 * Detecta el parámetro ?modo=clase en la URL y aplica
 * la clase CSS 'clase-mode' al body.
 * Llamar una vez en DOMContentLoaded.
 */
export function initClaseMode(): void {
  const params = new URLSearchParams(window.location.search)
  _isClase = params.get('modo') === 'clase'
  if (!_isClase) return

  document.body.classList.add('clase-mode')

  // Banner indicador en pantalla para el docente
  const banner = document.createElement('div')
  banner.id        = 'clase-banner'
  banner.innerHTML = '📚 Modo Clase activo — <a href="?" style="color:inherit;text-decoration:underline;opacity:.7">salir</a>'
  document.body.appendChild(banner)
}

/** Devuelve true si el Modo Clase está activo */
export function isClaseMode(): boolean {
  return _isClase
}

// ── Ficha didáctica ───────────────────────────────────

export interface FichaInfo {
  contexto: string
  pregunta: string
}

/**
 * Muestra el overlay de la ficha didáctica.
 * El overlay cubre el evento hasta que el docente hace clic en
 * "Ver decisiones →".
 */
export function showFichaDidactica(eventTitle: string, info: FichaInfo): void {
  const ficha = document.getElementById('clase-ficha')
  if (!ficha) return

  const el = (id: string) => document.getElementById(id)

  const titleEl = el('cf-title')
  const ctxEl   = el('cf-contexto')
  const pregEl  = el('cf-pregunta')

  if (titleEl) titleEl.textContent = eventTitle
  if (ctxEl)   ctxEl.innerHTML     = info.contexto
  if (pregEl)  pregEl.innerHTML    = info.pregunta

  ficha.classList.add('open')

  // El botón "Ver decisiones" se configura con un listener de un solo uso
  const btn = document.getElementById('cf-continuar')
  if (btn) {
    // Clonar para eliminar listeners previos
    const fresh = btn.cloneNode(true) as HTMLElement
    btn.replaceWith(fresh)
    fresh.addEventListener('click', () => hideFichaDidactica(), { once: true })
    fresh.focus()
  }
}

/** Cierra el overlay de la ficha didáctica */
export function hideFichaDidactica(): void {
  document.getElementById('clase-ficha')?.classList.remove('open')
}
