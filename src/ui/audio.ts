// ══════════════════════════════════════════════════════
// AUDIO ENGINE v4 — Howler.js + grabaciones reales
//
//   Música:  una pista por acto (y una para el menú), con el viento del desierto
//            debajo. Streaming (`html5`): no se decodifica la pista entera en memoria,
//            que en una tablet vieja eran más de 50 MB para KerriFlute.
//   Efectos: archivos cortos decodificados (Web Audio), sin crear ni destruir nodos
//            por cada sonido.
//
// Qué suena y con qué parámetros lo decide `audioLogic.ts` (puro y con tests). Acá sólo
// se ejecuta.
//
// Reemplaza al motor con Tone.js: sintetizaba todo en vivo, con una reverb por
// convolución que se generaba al arrancar cada pista, y en tablets lentas cortaba el sonido.
//
// Cada loop se cruza consigo mismo: la voz siguiente arranca antes de que termine la actual
// y se mezclan, para que no se note el salto de las pistas cortas (20 a 40 s).
// ══════════════════════════════════════════════════════

import { Howl, Howler } from 'howler'
import type { ActNumber } from '../data/types.js'
import {
  ARCHIVO_PISTA, ARCHIVO_VIENTO, GANANCIA_VIENTO, SFX,
  actoValido, duracionCruce, gananciaDeVolumen, msHastaSiguiente, pistaDeActo,
  type NombreSfx, type PistaMusica,
} from './audioLogic.js'

type TrackName = 'menu' | 'game'

const BASE = (): string => `${import.meta.env.BASE_URL}audio/`

// ── Estado ────────────────────────────────────────────
let _muted    = false
let _musicGain = 0.8   // 0..1
let _sfxGain   = 0.8   // 0..1

let _pista: PistaMusica | null = null
let _viento: Looper | null = null
let _musica: Looper | null = null

// ── Throttles ─────────────────────────────────────────
let _lastHover  = 0
const HOVER_GAP = 150   // ms mínimos entre hover sounds

// ── Efectos ───────────────────────────────────────────
const _sfxCache = new Map<string, Howl>()
const _avisado  = new Set<string>()

function _avisar(que: string): void {
  if (_avisado.has(que)) return
  _avisado.add(que)
  console.warn('[audio]', que)
}

function _sfx(archivo: string): Howl {
  let h = _sfxCache.get(archivo)
  if (!h) {
    h = new Howl({
      src: [`${BASE()}sfx/${archivo}`],
      preload: true,
      onloaderror: () => _avisar(`no se pudo cargar el efecto ${archivo}`),
    })
    _sfxCache.set(archivo, h)
  }
  return h
}

function _tocarSfx(nombre: NombreSfx): void {
  const d = SFX[nombre]
  const veces = d.veces ?? 1
  for (let i = 0; i < veces; i++) {
    const lanzar = (): void => {
      try {
        const h  = _sfx(d.archivo)
        const id = h.play()
        h.rate(d.rate, id)
        h.volume(d.vol * _sfxGain, id)
      } catch { /* silencioso */ }
    }
    if (i === 0) lanzar()
    else setTimeout(lanzar, i * (d.gapMs ?? 200))
  }
}

/** Toc de madera — botones genéricos */
export function sfxClick(): void { _tocarSfx('click') }

/** Ping suave al pasar por encima de un nodo (throttleado) */
export function sfxNodeHover(): void {
  const now = Date.now()
  if (now - _lastHover < HOVER_GAP) return
  _lastHover = now
  _tocarSfx('hover')
}

/** Seleccionar un nodo en el mapa */
export function sfxNodeSelect(): void { _tocarSfx('select') }

/** Tomar una decisión en un evento */
export function sfxDecision(): void { _tocarSfx('decision') }

/** Resultado positivo (alianza, ganancia) */
export function sfxPositive(): void { _tocarSfx('positive') }

/** Resultado negativo (pérdida, peligro) */
export function sfxNegative(): void { _tocarSfx('negative') }

/** El conquistador avanza */
export function sfxConqAdvance(): void { _tocarSfx('conqAdvance') }

/** El conquistador te alcanza (alerta máxima) */
export function sfxConqCatch(): void { _tocarSfx('conqCatch') }

/** Cinemática / transición de acto */
export function sfxCinematic(): void { _tocarSfx('cinematic') }

// ── Música en loop con cruce ──────────────────────────

/**
 * Reproduce un archivo en bucle: cada vuelta es una voz nueva que entra con fundido
 * mientras la anterior sale. `parar()` apaga todo con un fundido y libera los elementos.
 */
class Looper {
  private vivo   = true
  private voces  = new Set<Howl>()
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private readonly archivo: string,
    private readonly nivel: () => number,   // ganancia actual de este canal
  ) {
    this.nuevaVoz()
  }

  private nuevaVoz(): void {
    if (!this.vivo) return
    const h = new Howl({
      src: [`${BASE()}musica/${this.archivo}`],
      html5: true,
      volume: 0,
      onloaderror: () => _avisar(`no se pudo cargar la música ${this.archivo}`),
      onplayerror: () => {
        _avisar(`el navegador no dejó reproducir ${this.archivo}`)
        // Reintenta en cuanto el usuario toque algo: Howler avisa con `unlock`.
        h.once('unlock', () => { if (this.vivo) h.play() })
      },
    })
    this.voces.add(h)
    h.once('load', () => {
      if (!this.vivo) { this.soltar(h); return }
      const dur   = h.duration()
      const cruce = duracionCruce(dur)
      const espera = msHastaSiguiente(dur)
      // Sin duración usable (un stream puede dar NaN o Infinity) no hay cruce posible:
      // la voz se repite con el loop nativo, con un salto pero sin voces en cadena.
      if (espera === null) h.loop(true)
      h.play()
      h.fade(0, this.nivel(), cruce * 1000)
      if (espera === null) return
      this.timer = setTimeout(() => {
        // La voz siguiente entra mientras ésta se apaga.
        this.nuevaVoz()
        h.fade(h.volume() as number, 0, cruce * 1000)
        setTimeout(() => this.soltar(h), cruce * 1000 + 100)
      }, espera)
    })
  }

  private soltar(h: Howl): void {
    try { h.stop(); h.unload() } catch { /* noop */ }
    this.voces.delete(h)
  }

  /** Reaplica el volumen del canal a las voces que suenan. */
  actualizarVolumen(): void {
    const n = this.nivel()
    this.voces.forEach(h => { try { if (h.playing()) h.volume(n) } catch { /* noop */ } })
  }

  parar(fundidoMs = 1200): void {
    this.vivo = false
    if (this.timer) clearTimeout(this.timer)
    this.voces.forEach(h => {
      try { h.fade(h.volume() as number, 0, fundidoMs) } catch { /* noop */ }
      setTimeout(() => this.soltar(h), fundidoMs + 100)
    })
  }
}

// ── API pública ───────────────────────────────────────

/**
 * Pone la música. `menu` es la del menú; `game` es la del acto en curso (por defecto el 1).
 * Si ya suena esa misma pista no hace nada, así que se puede llamar en cada nodo.
 * Como Howler espera el primer toque del usuario para desbloquear el audio, llamarla al
 * arrancar es seguro: queda en cola.
 */
export async function playTrack(track: TrackName, acto?: ActNumber): Promise<void> {
  const quiere: PistaMusica = track === 'menu' ? 'menu' : pistaDeActo(actoValido(acto))
  if (_pista === quiere) return
  _pista = quiere

  _musica?.parar()
  _musica = new Looper(ARCHIVO_PISTA[quiere], () => _musicGain)

  if (track === 'game') {
    if (!_viento) _viento = new Looper(ARCHIVO_VIENTO, () => _musicGain * GANANCIA_VIENTO)
  } else if (_viento) {
    _viento.parar()
    _viento = null
  }
}

export function stopAudio(): void {
  _musica?.parar(); _musica = null
  _viento?.parar(); _viento = null
  _pista = null
}

// ── Mute / volumen ────────────────────────────────────

export function isMuted(): boolean { return _muted }

/** Setea el volumen de música (0–100). */
export function setMusicVolume(vol: number): void {
  _musicGain = gananciaDeVolumen(vol)
  _musica?.actualizarVolumen()
  _viento?.actualizarVolumen()
}

/** Setea el volumen de efectos (0–100). */
export function setSfxVolume(vol: number): void {
  _sfxGain = gananciaDeVolumen(vol)
}

/** Silencia o activa todo el audio explícitamente (sin toggle). */
export function setMuted(val: boolean): void {
  _muted = val
  try { Howler.mute(val) } catch { /* noop */ }
  _syncMuteBtn()
}

/** Toggle legado (mantiene compatibilidad con el botón del HUD). */
export function toggleMute(): void {
  setMuted(!_muted)
}

function _syncMuteBtn(): void {
  const btn = document.getElementById('btn-mute')
  if (btn) {
    btn.textContent   = _muted ? '🔇' : '🔊'
    btn.style.opacity = _muted ? '0.9' : '0.55'
    btn.setAttribute('aria-pressed', String(_muted))
    btn.setAttribute('aria-label', _muted ? 'Activar sonido' : 'Silenciar música')
  }
}
