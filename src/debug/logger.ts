// ══════════════════════════════════════════════════════
// LOGGER — structured console output + error boundary
// Solo activo en import.meta.env.DEV. En producción
// todas las funciones son no-ops tree-shakeados por Vite.
// ══════════════════════════════════════════════════════

export type LogCat = 'ENGINE' | 'SAVE' | 'AUDIO' | 'SCREEN' | 'MAP' | 'DEBUG' | 'ERROR'

const STYLES: Record<LogCat, string> = {
  ENGINE: 'color:#e8a93a;font-weight:700',
  SAVE:   'color:#6db84a;font-weight:700',
  AUDIO:  'color:#5dade2;font-weight:700',
  SCREEN: 'color:#a569bd;font-weight:700',
  MAP:    'color:#1abc9c;font-weight:700',
  DEBUG:  'color:#e74c3c;font-weight:700',
  ERROR:  'color:#e74c3c;font-weight:700',
}

function _ts(): string {
  return new Date().toISOString().slice(11, 23)
}

export function log(cat: LogCat, msg: string, data?: unknown): void {
  if (!import.meta.env.DEV) return
  const prefix = `[JAGUAR][${cat}]`
  if (data !== undefined) {
    console.log(`%c${_ts()} ${prefix} ${msg}`, STYLES[cat] + ';font-family:monospace', data)
  } else {
    console.log(`%c${_ts()} ${prefix} ${msg}`, STYLES[cat] + ';font-family:monospace')
  }
}

export function logError(msg: string, err?: unknown): void {
  console.error(`[JAGUAR][ERROR] ${_ts()} ${msg}`, err ?? '')
}

// ── Error boundary ─────────────────────────────────────
// Captura errores runtime no manejados y los muestra en
// un overlay visible en pantalla (además de consola).

export function initErrorBoundary(): void {
  if (!import.meta.env.DEV) return

  window.addEventListener('error', (e) => {
    logError(`Uncaught: ${e.message}`, {
      file: e.filename?.split('/').pop(),
      line: e.lineno,
      col:  e.colno,
      err:  e.error,
    })
    _showErrorOverlay(`${e.message}\n  at ${e.filename?.split('/').pop()}:${e.lineno}:${e.colno}`)
  })

  window.addEventListener('unhandledrejection', (e) => {
    logError('Unhandled rejection', e.reason)
    _showErrorOverlay(String(e.reason?.stack ?? e.reason))
  })

  log('DEBUG', 'Error boundary active')
}

function _showErrorOverlay(msg: string): void {
  let el = document.getElementById('dev-error-overlay')
  if (!el) {
    el = document.createElement('div')
    el.id = 'dev-error-overlay'
    el.style.cssText = [
      'position:fixed;bottom:0;left:0;right:0;z-index:999999;',
      'background:#1a0000;border-top:3px solid #e74c3c;',
      'color:#ff6b6b;font-family:monospace;font-size:11px;',
      'padding:10px 14px;max-height:160px;overflow-y:auto;',
      'white-space:pre-wrap;line-height:1.5;',
    ].join('')
    const close = document.createElement('button')
    close.textContent = '✕ cerrar'
    close.style.cssText = 'float:right;background:#c0392b;color:#fff;border:none;padding:2px 8px;cursor:pointer;font-family:monospace;'
    close.onclick = () => el!.remove()
    el.appendChild(close)
    document.body.appendChild(el)
  }
  const line = document.createElement('div')
  line.textContent = `[${_ts()}] ▶ ${msg}`
  el.appendChild(line)
  el.scrollTop = el.scrollHeight
}
