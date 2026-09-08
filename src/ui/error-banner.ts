// ══════════════════════════════════════════════════════
// ERROR BANNER — visible en dev Y producción
// Captura window 'error' + 'unhandledrejection'.
// Excluye rechazos de APIs del browser (audio, permisos).
// Tap en el banner copia el stack al portapapeles.
// ══════════════════════════════════════════════════════

const IGNORE_RE = /permissions check failed|notallowederror|the play\(\) request/i

function _format(msg: string, file?: string, line?: number, col?: number): string {
  const loc = file ? ` @ ${file.split('/').pop()}:${line ?? '?'}:${col ?? '?'}` : ''
  return `${msg}${loc}`
}

function _show(text: string): void {
  let banner = document.getElementById('__err_banner__')
  if (!banner) {
    banner = document.createElement('div')
    banner.id = '__err_banner__'
    Object.assign(banner.style, {
      position: 'fixed', bottom: '0', left: '0', right: '0',
      zIndex: '999999', background: '#1a0000',
      borderTop: '3px solid #e74c3c', color: '#ff6b6b',
      fontFamily: 'monospace', fontSize: '12px',
      padding: '8px 12px', maxHeight: '180px', overflowY: 'auto',
      whiteSpace: 'pre-wrap', lineHeight: '1.5', cursor: 'pointer',
    })
    banner.title = 'Tap to copy · X to close'

    const btn = document.createElement('button')
    btn.textContent = '✕'
    Object.assign(btn.style, {
      float: 'right', background: '#c0392b', color: '#fff',
      border: 'none', padding: '2px 8px', cursor: 'pointer',
      fontFamily: 'monospace', fontSize: '12px',
    })
    btn.onclick = (e) => { e.stopPropagation(); banner!.remove() }
    banner.appendChild(btn)

    banner.addEventListener('click', () => {
      const txt = banner!.innerText.replace('✕', '').trim()
      navigator.clipboard?.writeText(txt).catch(() => {/* ok */})
    })

    document.body.appendChild(banner)
  }

  const ts = new Date().toISOString().slice(11, 23)
  const line = document.createElement('div')
  line.textContent = `[${ts}] ▶ ${text}`
  banner.appendChild(line)
  banner.scrollTop = banner.scrollHeight
}

export function initErrorBanner(): void {
  window.addEventListener('error', (e) => {
    _show(_format(e.message, e.filename, e.lineno, e.colno))
  })

  window.addEventListener('unhandledrejection', (e) => {
    const msg = String(e.reason?.message ?? e.reason ?? '')
    if (IGNORE_RE.test(msg)) return
    const stack = e.reason?.stack ? `\n${e.reason.stack}` : ''
    _show(`Unhandled rejection: ${msg}${stack}`)
  })
}
