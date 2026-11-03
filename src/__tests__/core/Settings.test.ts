import { describe, it, expect, vi } from 'vitest'
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })
vi.mock('../../ui/audio.js', () => ({ setMusicVolume() {}, setSfxVolume() {}, setMuted() {} }))
import { sanitizeSettings, SETTINGS_DEFAULTS } from '../../core/SettingsSystem'

describe('ajustes leídos campo por campo', () => {
  it('sin nada o con basura devuelve los valores por defecto', () => {
    for (const x of [null, undefined, 5, 'x', [], true]) expect(sanitizeSettings(x)).toEqual(SETTINGS_DEFAULTS)
  })
  it('un campo con el tipo cambiado cae a su valor por defecto y el resto se conserva', () => {
    const s = sanitizeSettings({ musicVolume: 'alto', sfxVolume: 30, muted: 1, textSize: 'enorme', reducedMotion: true })
    expect(s.musicVolume).toBe(SETTINGS_DEFAULTS.musicVolume)
    expect(s.sfxVolume).toBe(30)
    expect(s.muted).toBe(SETTINGS_DEFAULTS.muted)
    expect(s.textSize).toBe('normal')
    expect(s.reducedMotion).toBe(true)
  })
  it('el volumen se acota a 0–100', () => {
    expect(sanitizeSettings({ musicVolume: 9999, sfxVolume: -5 })).toMatchObject({ musicVolume: 100, sfxVolume: 0 })
    expect(sanitizeSettings({ musicVolume: NaN }).musicVolume).toBe(SETTINGS_DEFAULTS.musicVolume)
  })
})
