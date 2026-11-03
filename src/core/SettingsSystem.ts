// ══════════════════════════════════════════════════════
// SETTINGS SYSTEM — configuración persistente del jugador
// Clave: 'jaguar_settings' en localStorage
// Independiente del SaveSystem (sobrevive a borrar partida)
// ══════════════════════════════════════════════════════

import { setMusicVolume, setSfxVolume, setMuted } from '../ui/audio.js'

export interface AppSettings {
  musicVolume:      number          // 0–100
  sfxVolume:        number          // 0–100
  muted:            boolean
  reducedMotion:    boolean
  highContrast:     boolean
  textSize:         'normal' | 'large'
  particlesEnabled: boolean
  reducedFx:        boolean
  lang:             'es'
}

export const SETTINGS_DEFAULTS: AppSettings = {
  musicVolume:      80,
  sfxVolume:        80,
  muted:            false,
  reducedMotion:    false,
  highContrast:     false,
  textSize:         'normal',
  particlesEnabled: true,
  reducedFx:        false,
  lang:             'es',
}

const SETTINGS_KEY = 'jaguar_settings'

let _current: AppSettings = { ...SETTINGS_DEFAULTS }

// ── CRUD ──────────────────────────────────────────────

/**
 * Lee los ajustes CAMPO POR CAMPO: `{...defaults, ...parsed}` solo se defendía del JSON ilegible,
 * y un campo con el tipo cambiado (volumen como texto, `muted` como número) pasaba entero.
 */
export function sanitizeSettings(raw: unknown): AppSettings {
  const d = SETTINGS_DEFAULTS
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ...d }
  const r = raw as Record<string, unknown>
  const vol = (v: unknown, fb: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : fb)
  const bool = (v: unknown, fb: boolean) => (typeof v === 'boolean' ? v : fb)
  return {
    musicVolume:      vol(r.musicVolume, d.musicVolume),
    sfxVolume:        vol(r.sfxVolume, d.sfxVolume),
    muted:            bool(r.muted, d.muted),
    reducedMotion:    bool(r.reducedMotion, d.reducedMotion),
    highContrast:     bool(r.highContrast, d.highContrast),
    textSize:         r.textSize === 'large' ? 'large' : 'normal',
    particlesEnabled: bool(r.particlesEnabled, d.particlesEnabled),
    reducedFx:        bool(r.reducedFx, d.reducedFx),
    lang:             'es',
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...SETTINGS_DEFAULTS }
    return sanitizeSettings(JSON.parse(raw))
  } catch {
    return { ...SETTINGS_DEFAULTS }
  }
}

export function saveSettings(s: AppSettings): void {
  _current = { ...s }
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch { /* noop */ }
}

export function getSettings(): AppSettings { return _current }

// ── INIT (llamar una vez al arrancar la app) ──────────

export function initSettings(): AppSettings {
  _current = loadSettings()
  applySettings(_current)
  return _current
}

// ── APPLY — aplica todos los efectos secundarios ──────

export function applySettings(s: AppSettings): void {
  // Audio
  setMuted(s.muted)
  setMusicVolume(s.musicVolume)
  setSfxVolume(s.sfxVolume)

  // CSS classes en <html> — efectos visuales globales
  const html = document.documentElement
  html.classList.toggle('cfg-reduced-motion', s.reducedMotion)
  html.classList.toggle('cfg-high-contrast',  s.highContrast)
  html.classList.toggle('cfg-text-large',      s.textSize === 'large')
  html.classList.toggle('cfg-reduced-fx',      s.reducedFx)
}
