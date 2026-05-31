// ══════════════════════════════════════════════════════
// AUDIO ENGINE — Tone.js generativo
//
// ARQUITECTURA:
//   Master chain:   Compressor → Limiter → Destination
//   Música menú:    synths → vol → _menuRev* → Limiter
//   Música juego:   synths → vol → _gameDly* → _gameRev* → Limiter
//   SFX secos:      farm → sfxDryBus → Limiter
//   SFX con eco:    farm → sfxRevBus → sfxSharedRev* → Limiter
//
// REGLA ANTI-ARTIFACTS (* = pre-creado, nunca recreado):
//   1. Todos los Reverb se crean UNA VEZ en _initMasterChain().
//      Tone.Reverb usa OfflineAudioContext para generar su IR —
//      crearlo durante el gameplay produce un spike de CPU que
//      interrumpe el hilo de audio.
//   2. Todos los synths de SFX son pre-creados en farms (SFARM voces
//      por tipo). Las llamadas a sfxXxx() solo hacen triggerAttackRelease
//      sobre synths existentes → cero allocación durante el juego.
//   3. El Transport NUNCA se detiene entre tracks. Solo se paran
//      las Sequences/Loops del track anterior para evitar el click
//      del stop/start.
// ══════════════════════════════════════════════════════

import * as Tone from 'tone'

type TrackName = 'menu' | 'game'
type ToneTime  = number | string

let _started       = false
let _currentTrack: TrackName | null = null
let _menuParts:  Array<() => void> = []
let _gameParts:  Array<() => void> = []

// ── Master chain ──────────────────────────────────────
let _masterComp:    Tone.Compressor | null = null
let _masterLimiter: Tone.Limiter    | null = null

// ── Reverbs/delays pre-creados para música ────────────
// No recrear en _buildMenu/_buildGame → sin OfflineAudioContext spike
let _menuRev: Tone.Reverb        | null = null
let _gameRev: Tone.Reverb        | null = null
let _gameDly: Tone.FeedbackDelay | null = null

// ── Buses SFX ─────────────────────────────────────────
let _sfxDryBus:    Tone.Volume | null = null
let _sfxRevBus:    Tone.Volume | null = null
let _sfxSharedRev: Tone.Reverb | null = null

// ── Click/hover pools ─────────────────────────────────
const POOL = 3
let _clickMemPool: Tone.MembraneSynth[] = []
let _clickNoiPool: Tone.NoiseSynth[]    = []
let _hoverPool:    Tone.MembraneSynth[] = []
let _poolIdx = 0

// ── SFX Farm ──────────────────────────────────────────
// Synths pre-creados para todos los eventos del juego.
// Cada tipo tiene SFARM voces asignadas en round-robin.
// Cero allocación de nodos durante el gameplay.
const SFARM = 6
let _fMem: Tone.MembraneSynth[] = []  // bombo/percusión  → _sfxRevBus
let _fSin: Tone.Synth[]         = []  // flauta/tono sine → vibrato → _sfxRevBus
let _fSaw: Tone.Synth[]         = []  // peligro/negativo → _sfxRevBus
let _fMet: Tone.MetalSynth[]    = []  // shimmer/metal    → _sfxRevBus
let _fNoi: Tone.NoiseSynth[]    = []  // textura          → _sfxDryBus
let _fVib: Tone.Vibrato[]       = []  // vibratos inline para _fSin

// Índices round-robin independientes por tipo
let _iMem = 0, _iSin = 0, _iSaw = 0, _iMet = 0, _iNoi = 0

// Sintetizadores dedicados para cinemáticas (decay 1.8s — diferente al farm)
let _cinematicBell: Tone.MetalSynth | null = null
let _cinematicSub:  Tone.Synth      | null = null

// ── Helpers round-robin ───────────────────────────────

function _nm(): Tone.MembraneSynth | undefined { return _fMem[(_iMem++) % SFARM] }
function _ns(): Tone.Synth         | undefined { return _fSin[(_iSin++) % SFARM] }
function _nw(): Tone.Synth         | undefined { return _fSaw[(_iSaw++) % SFARM] }
function _nk(): Tone.MetalSynth    | undefined { return _fMet[(_iMet++) % SFARM] }
function _nn(): Tone.NoiseSynth    | undefined { return _fNoi[(_iNoi++) % SFARM] }

// ─────────────────────────────────────────────────────

async function _ensureStarted(): Promise<boolean> {
  if (_started) return true
  try {
    await Tone.start()
    _started = true
    _initMasterChain()
    return true
  } catch { return false }
}

/** Crea toda la cadena de señal UNA SOLA VEZ tras el primer gesto del usuario */
function _initMasterChain(): void {
  try {
    // 1. Master bus
    _masterComp = new Tone.Compressor({
      threshold: -18, ratio: 4, attack: 0.003, release: 0.12, knee: 6,
    }).toDestination()
    _masterLimiter = new Tone.Limiter(-1).connect(_masterComp)

    // 2. Reverbs de música (se crean aquí, nunca en _buildMenu/_buildGame)
    _menuRev = new Tone.Reverb({ decay: 6,   wet: 0.55 }).connect(_masterLimiter)
    _gameRev = new Tone.Reverb({ decay: 2.5, wet: 0.30 }).connect(_masterLimiter)
    _gameDly = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.22, wet: 0.18 }).connect(_gameRev)

    // 3. Buses SFX
    _sfxDryBus    = new Tone.Volume(-2).connect(_masterLimiter)
    _sfxSharedRev = new Tone.Reverb({ decay: 1.8, wet: 0.28 }).connect(_masterLimiter)
    _sfxRevBus    = new Tone.Volume(-3).connect(_sfxSharedRev)

    // 4. Click/hover pools (los SFX más frecuentes)
    for (let i = 0; i < POOL; i++) {
      _clickMemPool.push(new Tone.MembraneSynth({
        pitchDecay: 0.04, octaves: 3,
        envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.05 },
        volume: -14,
      }).connect(_sfxDryBus))
      _clickNoiPool.push(new Tone.NoiseSynth({
        noise: { type: 'brown' as const },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.03 },
        volume: -22,
      }).connect(_sfxDryBus))
      _hoverPool.push(new Tone.MembraneSynth({
        pitchDecay: 0.02, octaves: 2,
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.03 },
        volume: -28,
      }).connect(_sfxDryBus))
    }

    // 5. SFX Farm: una voz por tipo × SFARM
    for (let i = 0; i < SFARM; i++) {
      // Bombo / percusión
      _fMem.push(new Tone.MembraneSynth({
        pitchDecay: 0.08, octaves: 5,
        envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 },
        volume: -10,
      }).connect(_sfxRevBus))

      // Flauta / tono (sine con vibrato inline)
      const vib = new Tone.Vibrato({ frequency: 5, depth: 0.1 }).connect(_sfxRevBus)
      _fVib.push(vib)
      _fSin.push(new Tone.Synth({
        oscillator: { type: 'sine' as const },
        envelope: { attack: 0.05, decay: 0.25, sustain: 0.4, release: 0.65 },
        volume: -18,
      }).connect(vib))

      // Peligro / negativo (sawtooth)
      _fSaw.push(new Tone.Synth({
        oscillator: { type: 'sawtooth' as const },
        envelope: { attack: 0.02, decay: 0.38, sustain: 0.08, release: 0.45 },
        volume: -20,
      }).connect(_sfxRevBus))

      // Shimmer / metal
      _fMet.push(new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.5, release: 0.5 },
        harmonicity: 3.0, modulationIndex: 16, resonance: 2200, octaves: 0.9,
        volume: -22,
      } as never).connect(_sfxRevBus))

      // Textura / ruido
      _fNoi.push(new Tone.NoiseSynth({
        noise: { type: 'brown' as const },
        envelope: { attack: 0.02, decay: 0.28, sustain: 0, release: 0.2 },
        volume: -26,
      }).connect(_sfxDryBus))
    }

    // 6. Campana cinemática dedicada (decay 1.8s — no encaja en el farm general)
    _cinematicBell = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 1.8, release: 2.0 },
      harmonicity: 2.0, modulationIndex: 8, resonance: 800, octaves: 0.5,
      volume: -20,
    } as never).connect(_sfxRevBus)
    _cinematicSub = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.3, decay: 1.5, sustain: 0, release: 2.0 },
      volume: -24,
    }).connect(_sfxDryBus)

  } catch { /* silencioso */ }
}

// ── SFX: botones genéricos ────────────────────────────

export function sfxClick(): void {
  if (!_started || !_sfxDryBus) return
  try {
    const idx = _poolIdx % POOL; _poolIdx++
    _clickMemPool[idx]?.triggerAttackRelease('C2', '16n')
    _clickNoiPool[idx]?.triggerAttackRelease('16n')
  } catch { /* silencioso */ }
}

// ── SFX: hover sobre nodo ─────────────────────────────

export function sfxNodeHover(): void {
  if (!_started || !_sfxDryBus) return
  try {
    const idx = _poolIdx % POOL; _poolIdx++
    _hoverPool[idx]?.triggerAttackRelease('G2', '32n')
  } catch { /* silencioso */ }
}

// ── SFX: seleccionar nodo en el mapa ─────────────────

export function sfxNodeSelect(): void {
  if (!_started) return
  try {
    const fl = _ns()
    const sh = _nk()
    fl?.triggerAttackRelease('E4', '4n')
    sh?.triggerAttackRelease('8n', '+0.04')
    fl?.triggerAttackRelease('B4', '4n', '+0.18')
  } catch { /* silencioso */ }
}

// ── SFX: tomar una decisión en evento ────────────────

export function sfxDecision(): void {
  if (!_started) return
  try {
    const b1 = _nm()
    const b2 = _nm()
    const tn = _ns()
    b1?.triggerAttackRelease('C1', '8n')
    b2?.triggerAttackRelease('G1', '8n', '+0.12')
    tn?.triggerAttackRelease('A2', '2n', '+0.08')
  } catch { /* silencioso */ }
}

// ── SFX: notificación positiva ────────────────────────

export function sfxPositive(): void {
  if (!_started) return
  try {
    const fl = _ns()
    const notes = ['A3', 'C4', 'E4', 'A4']
    notes.forEach((n, i) => fl?.triggerAttackRelease(n, '8n', `+${i * 0.13}`))
  } catch { /* silencioso */ }
}

// ── SFX: notificación negativa ────────────────────────

export function sfxNegative(): void {
  if (!_started) return
  try {
    const sw = _nw()
    const no = _nn()
    sw?.triggerAttackRelease('E3',  '8n')
    sw?.triggerAttackRelease('Eb3', '8n', '+0.15')
    sw?.triggerAttackRelease('D3',  '8n', '+0.3')
    no?.triggerAttackRelease('4n', '+0.05')
  } catch { /* silencioso */ }
}

// ── SFX: avance del conquistador ──────────────────────

export function sfxConqAdvance(): void {
  if (!_started) return
  try {
    const d1 = _nm()
    const d2 = _nm()
    const sh = _nk()
    d1?.triggerAttackRelease('C1', '4n')
    d2?.triggerAttackRelease('C1', '4n', '+0.22')
    sh?.triggerAttackRelease('16n', '+0.1')
  } catch { /* silencioso */ }
}

// ── SFX: conquistador te alcanza ──────────────────────

export function sfxConqCatch(): void {
  if (!_started) return
  try {
    const d1  = _nm()
    const d2  = _nm()
    const d3  = _nm()
    const dng = _nw()
    d1?.triggerAttackRelease('C1', '8n')
    d2?.triggerAttackRelease('C1', '8n', '+0.18')
    d3?.triggerAttackRelease('C1', '8n', '+0.36')
    dng?.triggerAttackRelease('A1', '2n', '+0.2')
  } catch { /* silencioso */ }
}

// ── SFX: cinemática / transición ─────────────────────
// Usa campana dedicada (decay 1.8s)

export function sfxCinematic(): void {
  if (!_started) return
  try {
    _cinematicBell?.triggerAttackRelease('2n', '+0')
    _cinematicSub?.triggerAttackRelease('A1', '1n', '+0.1')
  } catch { /* silencioso */ }
}

// ── Música MENÚ: flauta de pan andina + drone ────────
// Usa _menuRev pre-creado — sin OfflineAudioContext spike

function _buildMenu(): void {
  if (!_menuRev || !_masterLimiter) return
  try {
    // Volúmenes conectan al reverb pre-existente
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
        drone.dispose(); drone5.dispose()
        vol.dispose(); vol2.dispose()
        // _menuRev NO se disposa — es un nodo persistente
      } catch { /* noop */ } },
    ]
  } catch { /* silencioso */ }
}

// ── Música JUEGO: tambores urgentes + quena ──────────
// Usa _gameRev y _gameDly pre-creados

function _buildGame(): void {
  if (!_gameRev || !_gameDly) return
  try {
    // Volúmenes conectan a los efectos pre-existentes
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
        bombo.dispose(); mid.dispose(); click.dispose()
        melody.dispose(); quena.dispose(); qVib.dispose()
        volMain.dispose(); volPerc.dispose()
        // _gameRev y _gameDly NO se disposan — son nodos persistentes
      } catch { /* noop */ } },
    ]
  } catch { /* silencioso */ }
}

// ── Parar el track actual ─────────────────────────────

function _stopCurrent(): void {
  try {
    ;(_currentTrack === 'menu' ? _menuParts : _gameParts).forEach(fn => fn())
    _menuParts = []
    _gameParts = []
    // NO llamar transport.stop() — produce un click audible.
    // Las Sequences ya fueron paradas arriba; cancel() limpia
    // cualquier evento one-shot rezagado.
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
  // Arrancar el transport si no está corriendo (primera vez)
  if (Tone.getTransport().state !== 'started') {
    Tone.getTransport().start()
  }
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
  try { Tone.getDestination().mute = _muted } catch { /* silencioso */ }
  const btn = document.getElementById('btn-mute')
  if (btn) {
    btn.textContent = _muted ? '🔇' : '🔊'
    btn.style.opacity = _muted ? '0.9' : '0.55'
  }
}
