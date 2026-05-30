// ══════════════════════════════════════════════════════
// AUDIO ENGINE — Tone.js generativo
// Música procedimental: menú (flauta andina) + juego (tambores urgentes)
// ══════════════════════════════════════════════════════

import * as Tone from 'tone'

type TrackName = 'menu' | 'game'
type ToneTime  = number | string

let _started        = false
let _currentTrack: TrackName | null = null
let _menuParts:  Array<() => void> = []
let _gameParts:  Array<() => void> = []

async function _ensureStarted(): Promise<boolean> {
  if (_started) return true
  try {
    await Tone.start()
    _started = true
    return true
  } catch { return false }
}

// ── SFX: toc de madera ───────────────────────────────

export function sfxClick(): void {
  if (!_started) return
  try {
    const mem = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 3,
      envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.05 },
      volume: -10,
    }).toDestination()
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' as const },
      envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.03 },
      volume: -18,
    }).toDestination()
    mem.triggerAttackRelease('C2', '16n')
    noise.triggerAttackRelease('16n')
    setTimeout(() => { try { mem.dispose(); noise.dispose() } catch { /* noop */ } }, 400)
  } catch { /* silencioso */ }
}

// ── Música MENÚ: flauta de pan andina + drone ────────

function _buildMenu(): void {
  try {
    const rev   = new Tone.Reverb({ decay: 6, wet: 0.55 }).toDestination()
    const vol   = new Tone.Volume(-8).connect(rev)
    const vol2  = new Tone.Volume(-14).connect(rev)

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
      volume: -4,
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
      volume: -28,
    }).connect(rev)
    const shakerLoop = new Tone.Loop((time: ToneTime) => {
      shaker.triggerAttackRelease('16n', time)
    }, '8n')
    shakerLoop.start(0)

    const rain = new Tone.NoiseSynth({
      noise: { type: 'pink' as const },
      envelope: { attack: 0.8, decay: 1.2, sustain: 0, release: 1.5 },
      volume: -32,
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
    const rev     = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination()
    const dly     = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.22, wet: 0.18 }).connect(rev)
    const volMain = new Tone.Volume(-6).connect(dly)
    const volPerc = new Tone.Volume(-4).connect(rev)

    const bombo = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 5,
      envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 },
      volume: 2,
    }).connect(volPerc)

    const mid = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 3,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.1 },
      volume: -2,
    }).connect(volPerc)

    const click = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
      volume: -12,
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
      volume: -8,
    }).connect(volMain)

    const melSeq = [
      'A2','r','C3','r','E3','D3','r','A2',
      'r','G2','A2','r','C3','r','E3','r',
    ]
    const melLoop = new Tone.Sequence((time: ToneTime, note: string) => {
      if (note !== 'r') melody.triggerAttackRelease(note, '8n', time)
    }, melSeq, '8n')
    melLoop.start(0)

    const qVib   = new Tone.Vibrato({ frequency: 5.5, depth: 0.18 }).connect(volMain)
    const quena  = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope:   { attack: 0.08, decay: 0.2, sustain: 0.55, release: 0.6 },
      volume: -10,
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
