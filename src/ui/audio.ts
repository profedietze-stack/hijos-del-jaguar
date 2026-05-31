// ══════════════════════════════════════════════════════
// AUDIO ENGINE — Tone.js generativo
// Música procedimental: menú (flauta andina) + juego (tambores urgentes)
//
// ARQUITECTURA:
//   Master chain:  Compressor → Limiter → Destination
//   Música:        synths → vol → [reverb/delay] → masterComp
//   SFX secos:     synths → sfxDryBus → masterComp
//   SFX con reverb: synths → sfxRevBus → sfxSharedRev → masterComp
//
// El reverb compartido se crea UNA SOLA VEZ después de _ensureStarted().
// Crear Tone.Reverb en cada llamada genera spikes de CPU (OfflineAudioContext)
// que producen artifacts. Los pools de click/hover evitan GC pressure.
// ══════════════════════════════════════════════════════

import * as Tone from 'tone'

type TrackName = 'menu' | 'game'
type ToneTime  = number | string

let _started        = false
let _currentTrack: TrackName | null = null
let _menuParts:  Array<() => void> = []
let _gameParts:  Array<() => void> = []

// ── Master chain ──────────────────────────────────────
let _masterComp:    Tone.Compressor | null = null
let _masterLimiter: Tone.Limiter    | null = null

// ── SFX buses compartidos ─────────────────────────────
// Se crean una vez. sfxSharedRev es UN SOLO reverb para todos los SFX.
let _sfxDryBus:   Tone.Volume | null = null   // SFX sin reverb
let _sfxRevBus:   Tone.Volume | null = null   // SFX con reverb
let _sfxSharedRev: Tone.Reverb | null = null  // reverb compartido

// ── Pools de synths pre-creados (click y hover) ───────
// Evitan crear/destruir nodos en cada interacción del usuario.
const POOL = 3
let _clickMemPool:  Tone.MembraneSynth[] = []
let _clickNoiPool:  Tone.NoiseSynth[]    = []
let _hoverPool:     Tone.MembraneSynth[] = []
let _poolIdx = 0

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

/** Crea la cadena maestra UNA SOLA VEZ tras el primer gesto del usuario */
function _initMasterChain(): void {
  try {
    // Compresor suave: aplana picos cuando música + SFX se suman
    _masterComp = new Tone.Compressor({
      threshold: -18, ratio: 4, attack: 0.003, release: 0.12, knee: 6,
    }).toDestination()

    // Limiter de seguridad: nunca clipea
    _masterLimiter = new Tone.Limiter(-1).connect(_masterComp)

    // Bus seco para SFX cortos (sin reverb)
    _sfxDryBus = new Tone.Volume(-2).connect(_masterLimiter)

    // Bus reverb para SFX con espacio
    _sfxSharedRev = new Tone.Reverb({ decay: 1.8, wet: 0.28 })
    _sfxSharedRev.connect(_masterLimiter)
    _sfxRevBus = new Tone.Volume(-3).connect(_sfxSharedRev)

    // Pools de synths (click y hover — los más frecuentes)
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
  } catch { /* silencioso */ }
}

// ── Helpers SFX ──────────────────────────────────────

/** Conecta un nodo al bus SFX con reverb */
function _toRev<T extends Tone.ToneAudioNode>(node: T): T {
  if (_sfxRevBus) node.connect(_sfxRevBus)
  return node
}

/** Conecta un nodo al bus SFX seco */
function _toDry<T extends Tone.ToneAudioNode>(node: T): T {
  if (_sfxDryBus) node.connect(_sfxDryBus)
  return node
}

function _sfxDispose(nodes: Tone.ToneAudioNode[], delay = 800): void {
  setTimeout(() => nodes.forEach(n => { try { n.dispose() } catch { /* noop */ } }), delay)
}

// ── SFX: toc de madera (botones genéricos) ───────────
// Usa pool pre-creado — sin allocación de nodos en caliente

export function sfxClick(): void {
  if (!_started || !_sfxDryBus) return
  try {
    const idx = _poolIdx % POOL
    _poolIdx++
    _clickMemPool[idx]?.triggerAttackRelease('C2', '16n')
    _clickNoiPool[idx]?.triggerAttackRelease('16n')
  } catch { /* silencioso */ }
}

// ── SFX: hover sobre nodo ─────────────────────────────

export function sfxNodeHover(): void {
  if (!_started || !_sfxDryBus) return
  try {
    const idx = _poolIdx % POOL
    _poolIdx++
    _hoverPool[idx]?.triggerAttackRelease('G2', '32n')
  } catch { /* silencioso */ }
}

// ── SFX: seleccionar nodo en el mapa ─────────────────
// Nota suave de quena + shimmer de metal

export function sfxNodeSelect(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const vib = new Tone.Vibrato({ frequency: 4, depth: 0.1 })
    _toDry(vib)
    const flute = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.06, decay: 0.25, sustain: 0.45, release: 0.7 },
      volume: -16,
    }).connect(vib)
    const shimmer = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.18, release: 0.12 },
      harmonicity: 3.1, modulationIndex: 16, resonance: 3200, octaves: 0.8,
      volume: -28,
    } as never)
    _toRev(shimmer)
    flute.triggerAttackRelease('E4', '4n')
    shimmer.triggerAttackRelease('8n', '+0.04')
    flute.triggerAttackRelease('B4', '4n', '+0.18')
    _sfxDispose([flute, vib, shimmer], 1400)
  } catch { /* silencioso */ }
}

// ── SFX: tomar una decisión en evento ────────────────

export function sfxDecision(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const bombo = new Tone.MembraneSynth({
      pitchDecay: 0.07, octaves: 4,
      envelope: { attack: 0.001, decay: 0.28, sustain: 0, release: 0.15 },
      volume: -10,
    })
    _toRev(bombo)
    const mid = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 3,
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.08 },
      volume: -14,
    })
    _toRev(mid)
    const tone = new Tone.Synth({
      oscillator: { type: 'triangle' as const },
      envelope: { attack: 0.04, decay: 0.5, sustain: 0.1, release: 0.8 },
      volume: -20,
    })
    _toRev(tone)
    bombo.triggerAttackRelease('C1', '8n')
    mid.triggerAttackRelease('G1', '8n', '+0.12')
    tone.triggerAttackRelease('A2', '2n', '+0.08')
    _sfxDispose([bombo, mid, tone], 1800)
  } catch { /* silencioso */ }
}

// ── SFX: notificación positiva (alianza, logro) ───────

export function sfxPositive(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const vib = new Tone.Vibrato({ frequency: 5, depth: 0.08 })
    _toRev(vib)
    const fl = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.6 },
      volume: -16,
    }).connect(vib)
    const notes = ['A3','C4','E4','A4']
    notes.forEach((n, i) => fl.triggerAttackRelease(n, '8n', `+${i * 0.13}`))
    _sfxDispose([fl, vib], 2000)
  } catch { /* silencioso */ }
}

// ── SFX: notificación negativa (pérdida, peligro) ─────

export function sfxNegative(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const syn = new Tone.Synth({
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.02, decay: 0.35, sustain: 0.05, release: 0.4 },
      volume: -18,
    })
    _toRev(syn)
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' as const },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.2 },
      volume: -24,
    })
    _toDry(noise)
    syn.triggerAttackRelease('E3', '8n')
    syn.triggerAttackRelease('Eb3', '8n', '+0.15')
    syn.triggerAttackRelease('D3', '8n', '+0.3')
    noise.triggerAttackRelease('4n', '+0.05')
    _sfxDispose([syn, noise], 1600)
  } catch { /* silencioso */ }
}

// ── SFX: avance del conquistador ──────────────────────

export function sfxConqAdvance(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const drum = new Tone.MembraneSynth({
      pitchDecay: 0.09, octaves: 5,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.2 },
      volume: -8,
    })
    _toRev(drum)
    const metal = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.22, release: 0.15 },
      harmonicity: 4.2, modulationIndex: 28, resonance: 2800, octaves: 1.2,
      volume: -22,
    } as never)
    _toRev(metal)
    drum.triggerAttackRelease('C1', '4n')
    drum.triggerAttackRelease('C1', '4n', '+0.22')
    metal.triggerAttackRelease('16n', '+0.1')
    _sfxDispose([drum, metal], 1400)
  } catch { /* silencioso */ }
}

// ── SFX: conquistador te alcanza (alerta máxima) ──────

export function sfxConqCatch(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const drum = new Tone.MembraneSynth({
      pitchDecay: 0.12, octaves: 6,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 },
      volume: -6,
    })
    _toRev(drum)
    const danger = new Tone.Synth({
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.01, decay: 0.8, sustain: 0.2, release: 1.2 },
      volume: -15,
    })
    _toRev(danger)
    ;[0, 0.18, 0.36].forEach(t => drum.triggerAttackRelease('C1', '8n', `+${t}`))
    danger.triggerAttackRelease('A1', '2n', '+0.2')
    _sfxDispose([drum, danger], 2800)
  } catch { /* silencioso */ }
}

// ── SFX: cinemática / transición de acto ─────────────

export function sfxCinematic(): void {
  if (!_started || !_sfxRevBus) return
  try {
    const bell = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 1.8, release: 2.0 },
      harmonicity: 2.0, modulationIndex: 8, resonance: 800, octaves: 0.5,
      volume: -20,
    } as never)
    _toRev(bell)
    const sub = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.3, decay: 1.5, sustain: 0, release: 2.0 },
      volume: -24,
    })
    _toDry(sub)
    bell.triggerAttackRelease('2n', '+0')
    sub.triggerAttackRelease('A1', '1n', '+0.1')
    _sfxDispose([bell, sub], 5500)
  } catch { /* silencioso */ }
}

// ── Música MENÚ: flauta de pan andina + drone ────────

function _buildMenu(): void {
  try {
    // La música conecta al masterLimiter para pasar por el compresor maestro
    const dest = _masterLimiter ?? Tone.getDestination()

    const rev  = new Tone.Reverb({ decay: 6, wet: 0.55 }).connect(dest)
    const vol  = new Tone.Volume(-10).connect(rev)
    const vol2 = new Tone.Volume(-16).connect(rev)

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
    }).connect(rev)
    const shakerLoop = new Tone.Loop((time: ToneTime) => {
      shaker.triggerAttackRelease('16n', time)
    }, '8n')
    shakerLoop.start(0)

    const rain = new Tone.NoiseSynth({
      noise: { type: 'pink' as const },
      envelope: { attack: 0.8, decay: 1.2, sustain: 0, release: 1.5 },
      volume: -34,
    }).connect(rev)
    const rainLoop = new Tone.Loop((time: ToneTime) => {
      if (Math.random() < 0.3) rain.triggerAttackRelease('2n', time)
    }, '4')
    rainLoop.start(2)

    Tone.getTransport().bpm.value = 52
    Tone.getTransport().start()

    _menuParts = [
      () => { try { drone.triggerRelease() } catch { /* noop */ } },
      () => { try { drone5.triggerRelease() } catch { /* noop */ } },
      () => { fluteLoop.stop(); fluteLoop.dispose() },
      () => { shakerLoop.stop(); shakerLoop.dispose() },
      () => { rainLoop.stop(); rainLoop.dispose() },
      () => { try {
        flute.dispose(); vib.dispose(); shaker.dispose(); rain.dispose()
        drone.dispose(); drone5.dispose(); vol.dispose(); vol2.dispose(); rev.dispose()
      } catch { /* noop */ } },
    ]
  } catch { /* silencioso */ }
}

// ── Música JUEGO: tambores urgentes + quena ──────────

function _buildGame(): void {
  try {
    const dest = _masterLimiter ?? Tone.getDestination()

    const rev     = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).connect(dest)
    const dly     = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.22, wet: 0.18 }).connect(rev)
    const volMain = new Tone.Volume(-8).connect(dly)
    const volPerc = new Tone.Volume(-6).connect(rev)

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
    Tone.getTransport().start()

    _gameParts = [
      () => { percLoop.stop(); percLoop.dispose() },
      () => { melLoop.stop(); melLoop.dispose() },
      () => { quenaLoop.stop(); quenaLoop.dispose() },
      () => { try {
        bombo.dispose(); mid.dispose(); click.dispose()
        melody.dispose(); quena.dispose(); qVib.dispose()
        volMain.dispose(); volPerc.dispose(); dly.dispose(); rev.dispose()
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
    Tone.getTransport().stop()
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
  if (track === 'menu') _buildMenu()
  else                  _buildGame()
}

export function stopAudio(): void {
  _stopCurrent()
}

// ── Toggle mute ───────────────────────────────────────

let _muted = false

export function isMuted(): boolean { return _muted }

export function toggleMute(): void {
  _muted = !_muted
  try {
    Tone.getDestination().mute = _muted
  } catch { /* silencioso */ }
  const btn = document.getElementById('btn-mute')
  if (btn) {
    btn.textContent = _muted ? '🔇' : '🔊'
    btn.style.opacity = _muted ? '0.9' : '0.55'
  }
}
