// ══════════════════════════════════════════════════════
// SETTINGS MODAL — UI del panel de configuración
// ══════════════════════════════════════════════════════

import type { AppSettings }                       from '../core/SettingsSystem.js'
import { getSettings, saveSettings, applySettings } from '../core/SettingsSystem.js'
import { startMenuEmbers, stopMenuEmbers }          from '../fx/MenuEmbers.js'

// ── Helpers ───────────────────────────────────────────

function q<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null
}

function _patch(patch: Partial<AppSettings>): void {
  const next = { ...getSettings(), ...patch }
  saveSettings(next)
  applySettings(next)
}

// ── Abrir / cerrar ────────────────────────────────────

export function openSettings(): void {
  const overlay = q('settings-overlay')
  if (!overlay) return

  _syncControls()

  overlay.hidden = false
  void overlay.offsetWidth       // forzar reflow para transición CSS
  overlay.classList.add('open')

  overlay.addEventListener('click', _onOverlayClick)
  document.addEventListener('keydown', _onEscape)
}

export function closeSettings(): void {
  const overlay = q('settings-overlay')
  if (!overlay) return
  overlay.classList.remove('open')
  setTimeout(() => { overlay.hidden = true }, 260)
  overlay.removeEventListener('click', _onOverlayClick)
  document.removeEventListener('keydown', _onEscape)
}

function _onOverlayClick(e: Event): void {
  const modal = q('settings-modal')
  if (modal && !modal.contains(e.target as Node)) closeSettings()
}

function _onEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape') closeSettings()
}

// ── Sincronizar controles con settings actuales ───────

function _syncControls(): void {
  const s = getSettings()

  const musicSlider = q<HTMLInputElement>('cfg-music-vol')
  const sfxSlider   = q<HTMLInputElement>('cfg-sfx-vol')
  const musicVal    = q('cfg-music-val')
  const sfxVal      = q('cfg-sfx-val')

  if (musicSlider) musicSlider.value = String(s.musicVolume)
  if (sfxSlider)   sfxSlider.value   = String(s.sfxVolume)
  if (musicVal)    musicVal.textContent = String(s.musicVolume)
  if (sfxVal)      sfxVal.textContent   = String(s.sfxVolume)

  _setCheck('cfg-muted',          s.muted)
  _setCheck('cfg-reduced-motion', s.reducedMotion)
  _setCheck('cfg-high-contrast',  s.highContrast)
  _setCheck('cfg-text-large',     s.textSize === 'large')
  _setCheck('cfg-particles',      s.particlesEnabled)
  _setCheck('cfg-reduced-fx',     s.reducedFx)
}

function _setCheck(id: string, val: boolean): void {
  const el = q<HTMLInputElement>(id)
  if (el) el.checked = val
}

// ── Init: wirea todos los eventos del modal ───────────

export function initSettingsModal(): void {
  // Botón cerrar
  q('cfg-close')?.addEventListener('click', closeSettings)

  // Tabs
  document.querySelectorAll<HTMLButtonElement>('.cfg-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab
      document.querySelectorAll('.cfg-tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.cfg-panel').forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      q(`cfg-panel-${target}`)?.classList.add('active')
    })
  })

  // ── Audio ──
  const musicSlider = q<HTMLInputElement>('cfg-music-vol')
  const sfxSlider   = q<HTMLInputElement>('cfg-sfx-vol')
  const musicVal    = q('cfg-music-val')
  const sfxVal      = q('cfg-sfx-val')

  musicSlider?.addEventListener('input', () => {
    const v = Number(musicSlider!.value)
    if (musicVal) musicVal.textContent = String(v)
    _patch({ musicVolume: v })
  })

  sfxSlider?.addEventListener('input', () => {
    const v = Number(sfxSlider!.value)
    if (sfxVal) sfxVal.textContent = String(v)
    _patch({ sfxVolume: v })
  })

  q('cfg-muted')?.addEventListener('change', e => {
    _patch({ muted: (e.target as HTMLInputElement).checked })
  })

  // ── Accesibilidad ──
  q('cfg-reduced-motion')?.addEventListener('change', e => {
    _patch({ reducedMotion: (e.target as HTMLInputElement).checked })
  })

  q('cfg-high-contrast')?.addEventListener('change', e => {
    _patch({ highContrast: (e.target as HTMLInputElement).checked })
  })

  q('cfg-text-large')?.addEventListener('change', e => {
    _patch({ textSize: (e.target as HTMLInputElement).checked ? 'large' : 'normal' })
  })

  // ── Rendimiento ──
  q('cfg-particles')?.addEventListener('change', e => {
    const enabled = (e.target as HTMLInputElement).checked
    _patch({ particlesEnabled: enabled })
    // Solo afecta si estamos en el menú
    if (enabled) startMenuEmbers('menu-particles')
    else         stopMenuEmbers()
  })

  q('cfg-reduced-fx')?.addEventListener('change', e => {
    _patch({ reducedFx: (e.target as HTMLInputElement).checked })
  })
}
