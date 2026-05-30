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

// ── Helpers SFX ──────────────────────────────────────

/** Crea un reverb pequeño y lo conecta al destino. Devuelve un dispose fn. */
function _sfxRev(decay = 1.2, wet = 0.25): [Tone.Reverb, () => void] {
  const r = new Tone.Reverb({ decay, wet }).toDestination()
  return [r, () => { try { r.dispose() } catch { /* noop */ } }]
}

function _sfxDispose(nodes: Tone.ToneAudioNode[], delay = 600): void {
  setTimeout(() => nodes.forEach(n => { try { n.dispose() } catch { /* noop */ } }), delay)
}

// ── SFX: toc de madera (botones genéricos) ───────────

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
    _sfxDispose([mem, noise])
  } catch { /* silencioso */ }
}

// ── SFX: seleccionar nodo en el mapa ─────────────────
// Nota suave de quena + shimmer de metal

export function sfxNodeSelect(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(2.2, 0.38)
    const vib = new Tone.Vibrato({ frequency: 4, depth: 0.1 }).connect(rev)
    const flute = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.06, decay: 0.25, sustain: 0.45, release: 0.7 },
      volume: -12,
    }).connect(vib)
    const shimmer = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.18, release: 0.12 },
      harmonicity: 3.1, modulationIndex: 16, resonance: 3200, octaves: 0.8,
      volume: -22,
    } as never).connect(rev)
    // Acorde pentatónico suave: tónica + quinta
    flute.triggerAttackRelease('E4', '4n')
    shimmer.triggerAttackRelease('8n', '+0.04')
    flute.triggerAttackRelease('B4', '4n', '+0.18')
    _sfxDispose([flute, vib, shimmer, rev], 1200)
    setTimeout(dispRev, 1200)
  } catch { /* silencioso */ }
}

// ── SFX: hover sobre nodo ─────────────────────────────
// Toc muy suave, casi inaudible

export function sfxNodeHover(): void {
  if (!_started) return
  try {
    const mem = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2,
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.03 },
      volume: -22,
    }).toDestination()
    mem.triggerAttackRelease('G2', '32n')
    _sfxDispose([mem], 300)
  } catch { /* silencioso */ }
}

// ── SFX: tomar una decisión en evento ────────────────
// Dos golpes de tambor + nota grave de resolución

export function sfxDecision(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(1.8, 0.3)
    const bombo = new Tone.MembraneSynth({
      pitchDecay: 0.07, octaves: 4,
      envelope: { attack: 0.001, decay: 0.28, sustain: 0, release: 0.15 },
      volume: -4,
    }).connect(rev)
    const mid = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 3,
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.08 },
      volume: -9,
    }).connect(rev)
    const tone = new Tone.Synth({
      oscillator: { type: 'triangle' as const },
      envelope: { attack: 0.04, decay: 0.5, sustain: 0.1, release: 0.8 },
      volume: -16,
    }).connect(rev)
    bombo.triggerAttackRelease('C1', '8n')
    mid.triggerAttackRelease('G1', '8n', '+0.12')
    tone.triggerAttackRelease('A2', '2n', '+0.08')
    _sfxDispose([bombo, mid, tone, rev], 1600)
    setTimeout(dispRev, 1600)
  } catch { /* silencioso */ }
}

// ── SFX: notificación positiva (alianza, logro) ───────
// Arpegio ascendente pentatónico

export function sfxPositive(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(2.5, 0.42)
    const vib = new Tone.Vibrato({ frequency: 5, depth: 0.08 }).connect(rev)
    const fl  = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.6 },
      volume: -11,
    }).connect(vib)
    const notes = ['A3','C4','E4','A4']
    notes.forEach((n, i) => fl.triggerAttackRelease(n, '8n', `+${i * 0.13}`))
    _sfxDispose([fl, vib, rev], 1800)
    setTimeout(dispRev, 1800)
  } catch { /* silencioso */ }
}

// ── SFX: notificación negativa (pérdida, peligro) ─────
// Descenso cromático + ruido grave

export function sfxNegative(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(1.5, 0.25)
    const syn = new Tone.Synth({
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.02, decay: 0.35, sustain: 0.05, release: 0.4 },
      volume: -13,
    }).connect(rev)
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' as const },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.2 },
      volume: -20,
    }).connect(rev)
    syn.triggerAttackRelease('E3', '8n')
    syn.triggerAttackRelease('Eb3', '8n', '+0.15')
    syn.triggerAttackRelease('D3', '8n', '+0.3')
    noise.triggerAttackRelease('4n', '+0.05')
    _sfxDispose([syn, noise, rev], 1400)
    setTimeout(dispRev, 1400)
  } catch { /* silencioso */ }
}

// ── SFX: avance del conquistador ──────────────────────
// Tambor de guerra amenazante + metal

export function sfxConqAdvance(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(1.2, 0.2)
    const drum = new Tone.MembraneSynth({
      pitchDecay: 0.09, octaves: 5,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.2 },
      volume: -3,
    }).connect(rev)
    const metal = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.22, release: 0.15 },
      harmonicity: 4.2, modulationIndex: 28, resonance: 2800, octaves: 1.2,
      volume: -16,
    } as never).connect(rev)
    drum.triggerAttackRelease('C1', '4n')
    drum.triggerAttackRelease('C1', '4n', '+0.22')
    metal.triggerAttackRelease('16n', '+0.1')
    _sfxDispose([drum, metal, rev], 1200)
    setTimeout(dispRev, 1200)
  } catch { /* silencioso */ }
}

// ── SFX: conquistador te alcanza (alerta máxima) ──────
// Tres golpes + nota de terror

export function sfxConqCatch(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(2.0, 0.35)
    const drum = new Tone.MembraneSynth({
      pitchDecay: 0.12, octaves: 6,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 },
      volume: 0,
    }).connect(rev)
    const danger = new Tone.Synth({
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.01, decay: 0.8, sustain: 0.2, release: 1.2 },
      volume: -10,
    }).connect(rev)
    ;[0, 0.18, 0.36].forEach(t => drum.triggerAttackRelease('C1', '8n', `+${t}`))
    danger.triggerAttackRelease('A1', '2n', '+0.2')
    _sfxDispose([drum, danger, rev], 2500)
    setTimeout(dispRev, 2500)
  } catch { /* silencioso */ }
}

// ── SFX: cinemática / transición de acto ─────────────
// Campana grave + reverb largo

export function sfxCinematic(): void {
  if (!_started) return
  try {
    const [rev, dispRev] = _sfxRev(5.0, 0.6)
    const bell = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 1.8, release: 2.0 },
      harmonicity: 2.0, modulationIndex: 8, resonance: 800, octaves: 0.5,
      volume: -14,
    } as never).connect(rev)
    const sub = new Tone.Synth({
      oscillator: { type: 'sine' as const },
      envelope: { attack: 0.3, decay: 1.5, sustain: 0, release: 2.0 },
      volume: -18,
    }).connect(rev)
    bell.triggerAttackRelease('2n', '+0')
    sub.triggerAttackRelease('A1', '1n', '+0.1')
    _sfxDispose([bell, sub, rev], 5000)
    setTimeout(dispRev, 5000)
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

// ── Toggle mute ───────────────────────────────────────

let _muted = false

export function isMuted(): boolean { return _muted }

export function toggleMute(): void {
  _muted = !_muted
  try {
    Tone.getDestination().mute = _muted
  } catch { /* silencioso */ }
  // Actualizar ícono del botón si existe en el DOM
  const btn = document.getElementById('btn-mute')
  if (btn) {
    btn.textContent = _muted ? '🔇' : '🔊'
    btn.style.opacity = _muted ? '0.9' : '0.55'
  }
}
