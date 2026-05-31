// ══════════════════════════════════════════════════════
// AUDIO ENGINE v3 — Tone.js + raw Web Audio API
//
// ARQUITECTURA ANTI-ARTIFACTS:
//
//   Clicks:  MembraneSynth[3] → clickVol → Tone.Destination
//   SFX:     OscillatorNode + GainNode → _rawOut → ctx.destination
//            (auto-GC automático tras osc.stop() — cero disposal manual)
//   Música:  Sequences → vol → lazyReverb → Tone.Destination
//
// POR QUÉ ESTO FUNCIONA:
//   La versión anterior tenía 9 NoiseSynths + 6 Tone.Vibrato
//   PRE-CREADOS en el farm. NoiseSynth usa AudioBufferSourceNode en
//   loop infinito; Vibrato usa un LFO continuo. Ambos procesan muestras
//   24/7 aunque no suenen nada → CPU del audio thread overloaded →
//   cualquier evento de JS (mousemove) produce dropouts.
//
//   Ahora: solo 3 MembraneSynths persistentes (click pool).
//   Todo lo demás (SFX de gameplay) usa OscillatorNode raw que
//   existe 0.2–2 segundos y luego el browser lo GC automáticamente.
// ══════════════════════════════════════════════════════

import * as Tone from 'tone'

type TrackName = 'menu' | 'game'
type ToneTime  = number | string

let _started       = false
let _currentTrack: TrackName | null = null
let _menuParts:  Array<() => void> = []
let _gameParts:  Array<() => void> = []

// ── Click pool (los ÚNICOS synths persistentes de SFX) ─
const POOL = 3
let _clickPool: Tone.MembraneSynth[] = []
let _clickVol:  Tone.Volume | null   = null
let _poolIdx   = 0

// ── Raw SFX output (GainNode nativo) ─────────────────
// Todos los OscillatorNode raw van aquí. Se controla separado
// del canal Tone.js para poder mutear con toggleMute().
let _rawOut: GainNode | null = null

// ── Throttles ─────────────────────────────────────────
let _lastHover  = 0
const HOVER_GAP = 150   // ms mínimos entre hover sounds

// ── Music reverbs (lazy — creados la primera vez) ─────
let _menuRev: Tone.Reverb        | null = null
let _gameRev: Tone.Reverb        | null = null
let _gameDly: Tone.FeedbackDelay | null = null

// ─────────────────────────────────────────────────────

async function _ensureStarted(): Promise<boolean> {
  if (_started) return true
  try {
    await Tone.start()
    _started = true
    _initChain()
    return true
  } catch { return false }
}

function _initChain(): void {
  try {
    // 1. Click pool: 3 MembraneSynths → Tone.Destination
    //    (sin NoiseSynth — los NoiseSynth corren continuamente)
    _clickVol = new Tone.Volume(-4).toDestination()
    for (let i = 0; i < POOL; i++) {
      _clickPool.push(new Tone.MembraneSynth({
        pitchDecay: 0.04, octaves: 3,
        envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.05 },
        volume: -14,
      }).connect(_clickVol))
    }

    // 2. Raw SFX output: GainNode nativo → ctx.destination
    //    Separado de Tone.Destination para poder controlarlo en toggleMute()
    const ctx = Tone.getContext().rawContext as AudioContext
    _rawOut = ctx.createGain()
    _rawOut.gain.value = 1.0
    _rawOut.connect(ctx.destination)

  } catch { /* silencioso */ }
}

// ── Raw WebAudio helpers ──────────────────────────────

/** Acceso al AudioContext nativo */
function _ctx(): AudioContext | null {
  try { return Tone.getContext().rawContext as AudioContext } catch { return null }
}

/**
 * Tono puro: crea OscillatorNode+GainNode, suena `dur` segundos,
 * se auto-GC tras osc.stop(). Si se pasa endFreq, hace sweep de frecuencia.
 */
function _tone(
  freq:    number,
  vol:     number,
  dur:     number,
  type:    OscillatorType = 'sine',
  offset:  number = 0,
  endFreq?: number,
): void {
  if (!_rawOut) return
  const ctx = _ctx(); if (!ctx) return
  try {
    const now = ctx.currentTime + offset
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 5), now + dur * 0.45)
    }
    // Envelope: ataque suave + decay exponencial
    g.gain.setValueAtTime(0.001, now)
    g.gain.linearRampToValueAtTime(vol, now + Math.min(0.008, dur * 0.12))
    g.gain.exponentialRampToValueAtTime(0.001, now + dur)
    osc.connect(g)
    g.connect(_rawOut)
    osc.start(now)
    osc.stop(now + dur + 0.02)   // tras stop(): GC automático
  } catch { /* silencioso */ }
}

/**
 * Drum hit: sine con pitch sweep descendente (simula MembraneSynth).
 * startHz = pitch inicial (audible), baja al 12% en `dur*0.45` segundos.
 */
function _drum(startHz: number, vol: number, dur: number, offset = 0): void {
  _tone(startHz, vol, dur, 'sine', offset, startHz * 0.12)
}

// ── SFX ──────────────────────────────────────────────

/** Toc de madera — botones genéricos (pool pre-creado) */
export function sfxClick(): void {
  if (!_started || !_clickVol) return
  try {
    const idx = _poolIdx % POOL; _poolIdx++
    _clickPool[idx]?.triggerAttackRelease('C2', '16n')
  } catch { /* silencioso */ }
}

/** Ping suave al pasar por encima de un nodo (throttleado) */
export function sfxNodeHover(): void {
  if (!_started) return
  const now = Date.now()
  if (now - _lastHover < HOVER_GAP) return
  _lastHover = now
  _tone(880, 0.04, 0.035, 'sine')
}

/** Seleccionar un nodo en el mapa */
export function sfxNodeSelect(): void {
  if (!_started) return
  _tone(659, 0.12, 0.20, 'sine')
  _tone(988, 0.09, 0.18, 'sine', 0.16)
}

/** Tomar una decisión en un evento */
export function sfxDecision(): void {
  if (!_started) return
  _drum(420, 0.28, 0.30)
  _drum(300, 0.20, 0.18, 0.12)
  _tone(110, 0.12, 0.55, 'triangle', 0.08)
}

/** Resultado positivo (alianza, ganancia) */
export function sfxPositive(): void {
  if (!_started) return
  ;[220, 277, 330, 440].forEach((hz, i) =>
    _tone(hz, 0.11, 0.22, 'sine', i * 0.13),
  )
}

/** Resultado negativo (pérdida, peligro) */
export function sfxNegative(): void {
  if (!_started) return
  _tone(164, 0.14, 0.20, 'sawtooth', 0.00)
  _tone(155, 0.12, 0.20, 'sawtooth', 0.16)
  _tone(146, 0.10, 0.25, 'sawtooth', 0.32)
}

/** El conquistador avanza */
export function sfxConqAdvance(): void {
  if (!_started) return
  _drum(500, 0.26, 0.38, 0.00)
  _drum(500, 0.20, 0.30, 0.22)
  _tone(880, 0.07, 0.18, 'sine', 0.10)
}

/** El conquistador te alcanza (alerta máxima) */
export function sfxConqCatch(): void {
  if (!_started) return
  _drum(600, 0.30, 0.45, 0.00)
  _drum(600, 0.26, 0.38, 0.18)
  _drum(600, 0.22, 0.30, 0.36)
  _tone(110, 0.16, 1.20, 'sawtooth', 0.20)
}

/** Cinemática / transición de acto */
export function sfxCinematic(): void {
  if (!_started) return
  _tone(880, 0.13, 2.20, 'sine', 0.00)
  _tone(55,  0.09, 1.80, 'sine', 0.10)
}

// ── Música MENÚ ───────────────────────────────────────

function _buildMenu(): void {
  if (!_started) return
  try {
    // Reverb lazy (una sola vez)
    if (!_menuRev) {
      _menuRev = new Tone.Reverb({ decay: 6, wet: 0.55 })
      _menuRev.toDestination()
    }

    const vol  = new Tone.Volume(-10).connect(_menuRev)
    const vol2 = new Tone.Volume(-16).connect(_menuRev)

    const drone = new Tone.Synth({
      oscillator: { type: 'triangle' as const },
      envelope:   { attack: 2.5, decay: 1, sustain: 0.8, release: 4 },
    }).connect(vol2)
    drone.triggerAttack('A1')

    const drone5 = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope:   { attack: 3, decay: 1, sustain: 0.7, release: 4 },
    }).connect(vol2)
    drone5.triggerAttack('E2')

    const vib   = new Tone.Vibrato({ frequency: 4.5, depth: 0.12 }).connect(vol)
    const flute = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope:   { attack: 0.18, decay: 0.3, sustain: 0.6, release: 0.9 },
      volume: -6,
    }).connect(vib)

    const fluteSeq = [
      'A3','r','E4','r','D4','C4','r','A3',
      'r','G3','A3','r','C4','r','E4','r',
      'D4','E4','r','A4','r','G4','E4','r',
      'C4','r','A3','r','G3','r','A3','r',
    ]
    const fluteLoop = new Tone.Sequence((time: ToneTime, note: string) => {
      if (note !== 'r') flute.triggerAttackRelease(note, '2n', time)
    }, fluteSeq, '2n')
    fluteLoop.start(0)

    const shaker = new Tone.NoiseSynth({
      noise: { type: 'white' as const },
      envelope: { attack: 0.002, decay: 0.06, sustain: 0, release: 0.04 },
      volume: -30,
    }).connect(_menuRev)
    const shakerLoop = new Tone.Loop((time: ToneTime) => {
      shaker.triggerAttackRelease('16n', time)
    }, '8n')
    shakerLoop.start(0)

    const rain = new Tone.NoiseSynth({
      noise: { type: 'pink' as const },
      envelope: { attack: 0.8, decay: 1.2, sustain: 0, release: 1.5 },
      volume: -34,
    }).connect(_menuRev)
    const rainLoop = new Tone.Loop((time: ToneTime) => {
      if (Math.random() < 0.3) rain.triggerAttackRelease('2n', time)
    }, '4')
    rainLoop.start(2)

    Tone.getTransport().bpm.value = 52

    _menuParts = [
      () => { try { drone.triggerRelease()  } catch { /* noop */ } },
      () => { try { drone5.triggerRelease() } catch { /* noop */ } },
      () => { fluteLoop.stop();  fluteLoop.dispose()  },
      () => { shakerLoop.stop(); shakerLoop.dispose() },
      () => { rainLoop.stop();   rainLoop.dispose()   },
      () => { try {
        flute.dispose(); vib.dispose()
        shaker.dispose(); rain.dispose()
        drone.dispose();  drone5.dispose()
        vol.dispose();    vol2.dispose()
        // _menuRev se REUTILIZA — no se disposa
      } catch { /* noop */ } },
    ]
  } catch { /* silencioso */ }
}

// ── Música JUEGO ──────────────────────────────────────

function _buildGame(): void {
  if (!_started) return
  try {
    // Reverb y delay lazy (una sola vez)
    if (!_gameRev) {
      _gameRev = new Tone.Reverb({ decay: 2.5, wet: 0.30 })
      _gameRev.toDestination()
    }
    if (!_gameDly) {
      _gameDly = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.22, wet: 0.18 })
      _gameDly.connect(_gameRev)
    }

    const volMain = new Tone.Volume(-8).connect(_gameDly)
    const volPerc = new Tone.Volume(-6).connect(_gameRev)

    const bombo = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 5,
      envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 },
      volume: -2,
    }).connect(volPerc)

    const mid = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 3,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.1 },
      volume: -5,
    }).connect(volPerc)

    const click = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
      volume: -16,
    } as never).connect(volPerc)

    const percSeq = [
      'C1','r','G1','r','C1','G1','r','C1',
      'C1','r','G1','C1','r','G1','r','C1',
    ]
    const percLoop = new Tone.Sequence((time: ToneTime, hit: string) => {
      if (hit !== 'r') {
        bombo.triggerAttackRelease(hit === 'C1' ? 'C1' : 'G1', '8n', time)
        if (hit === 'G1') mid.triggerAttackRelease('G1', '8n', time)
        if (Math.random() < 0.3) click.triggerAttackRelease('16n', time)
      }
    }, percSeq, '8n')
    percLoop.start(0)

    const melody = new Tone.Synth({
      oscillator: { type: 'sawtooth' as const },
      envelope:   { attack: 0.02, decay: 0.12, sustain: 0.35, release: 0.4 },
      volume: -12,
    }).connect(volMain)

    const melSeq = [
      'A2','r','C3','r','E3','D3','r','A2',
      'r','G2','A2','r','C3','r','E3','r',
    ]
    const melLoop = new Tone.Sequence((time: ToneTime, note: string) => {
      if (note !== 'r') melody.triggerAttackRelease(note, '8n', time)
    }, melSeq, '8n')
    melLoop.start(0)

    const qVib  = new Tone.Vibrato({ frequency: 5.5, depth: 0.18 }).connect(volMain)
    const quena = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope:   { attack: 0.08, decay: 0.2, sustain: 0.55, release: 0.6 },
      volume: -14,
    }).connect(qVib)

    const quenaSeq = [
      'A3','r','r','C4','r','E4','D4','r',
      'r','A3','r','G3','A3','r','r','C4',
    ]
    const quenaLoop = new Tone.Sequence((time: ToneTime, note: string) => {
      if (note !== 'r') quena.triggerAttackRelease(note, '4n', time)
    }, quenaSeq, '4n')
    quenaLoop.start('2m')

    Tone.getTransport().bpm.value = 88

    _gameParts = [
      () => { percLoop.stop();  percLoop.dispose()  },
      () => { melLoop.stop();   melLoop.dispose()   },
      () => { quenaLoop.stop(); quenaLoop.dispose() },
      () => { try {
        bombo.dispose();  mid.dispose();   click.dispose()
        melody.dispose(); quena.dispose(); qVib.dispose()
        volMain.dispose(); volPerc.dispose()
        // _gameRev y _gameDly se REUTILIZAN — no se disposan
      } catch { /* noop */ } },
    ]
  } catch { /* silencioso */ }
}

// ── Stop track ────────────────────────────────────────

function _stopCurrent(): void {
  try {
    ;(_currentTrack === 'menu' ? _menuParts : _gameParts).forEach(fn => fn())
    _menuParts = []
    _gameParts = []
    Tone.getTransport().cancel()
  } catch { /* silencioso */ }
  _currentTrack = null
}

// ── API pública ───────────────────────────────────────

export async function playTrack(track: TrackName): Promise<void> {
  if (_currentTrack === track) return
  const ok = await _ensureStarted()
  if (!ok) return
  _stopCurrent()
  _currentTrack = track
  if (Tone.getTransport().state !== 'started') Tone.getTransport().start()
  if (track === 'menu') _buildMenu()
  else                  _buildGame()
}

export function stopAudio(): void {
  _stopCurrent()
  try { Tone.getTransport().stop() } catch { /* noop */ }
}

// ── Toggle mute ───────────────────────────────────────

let _muted = false

export function isMuted(): boolean { return _muted }

export function toggleMute(): void {
  _muted = !_muted
  // Canal Tone.js (música + click pool)
  try { Tone.getDestination().mute = _muted } catch { /* noop */ }
  // Canal raw SFX (oscillators nativos)
  if (_rawOut) _rawOut.gain.value = _muted ? 0 : 1
  // Botón UI
  const btn = document.getElementById('btn-mute')
  if (btn) {
    btn.textContent    = _muted ? '🔇' : '🔊'
    btn.style.opacity  = _muted ? '0.9' : '0.55'
  }
}
