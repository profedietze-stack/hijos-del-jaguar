// ══════════════════════════════════════════════════════
// LÓGICA DEL AUDIO — pura, sin navegador ni Howler
//
// Qué suena, cuándo y cuánto. Separada de audio.ts para poder probarla con vitest:
// el motor de sonido sólo ejecuta lo que esto decide.
// ══════════════════════════════════════════════════════

import type { ActNumber } from '../data/types.js'

export type PistaMusica = 'menu' | 'a1' | 'a2' | 'a3' | 'a4'

/** Archivos de música, bajo `audio/musica/`. */
export const ARCHIVO_PISTA: Readonly<Record<PistaMusica, string>> = {
  menu: 'kerriflute.ogg',
  a1:   'canyon_quena_solo1.ogg',
  a2:   'amazon_bamboo_loop.ogg',
  a3:   'ethno_native_atmosphere.ogg',
  a4:   'old_flutist.ogg',
}

/** Capa de ambiente que suena debajo de la música en el juego (no en el menú). */
export const ARCHIVO_VIENTO = 'desert_wind.ogg'

/** Efectos, bajo `audio/sfx/`. Cambiar un sonido es cambiar una línea de acá. */
export type NombreSfx =
  | 'click' | 'hover' | 'select' | 'decision' | 'positive'
  | 'negative' | 'conqAdvance' | 'conqCatch' | 'cinematic'

export interface DefSfx {
  readonly archivo: string
  /** Velocidad de reproducción: 1 = original; menos es más grave y más largo. */
  readonly rate:    number
  /** Volumen relativo 0..1 antes del volumen general de efectos. */
  readonly vol:     number
  /** Repeticiones y espacio entre ellas, en ms. */
  readonly veces?:  number
  readonly gapMs?:  number
}

export const SFX: Readonly<Record<NombreSfx, DefSfx>> = {
  click:       { archivo: 'click_003.ogg',        rate: 1,    vol: 0.7 },
  hover:       { archivo: 'tick_002.ogg',         rate: 1,    vol: 0.25 },
  select:      { archivo: 'select_002.ogg',       rate: 1,    vol: 0.7 },
  decision:    { archivo: 'confirmation_001.ogg', rate: 0.9,  vol: 0.8 },
  positive:    { archivo: 'confirmation_004.ogg', rate: 1,    vol: 0.8 },
  negative:    { archivo: 'error_003.ogg',        rate: 0.85, vol: 0.8 },
  conqAdvance: { archivo: 'bong_001.ogg',         rate: 0.7,  vol: 0.8, veces: 2, gapMs: 230 },
  conqCatch:   { archivo: 'bong_001.ogg',         rate: 0.5,  vol: 1,   veces: 3, gapMs: 260 },
  cinematic:   { archivo: 'open_003.ogg',         rate: 0.6,  vol: 0.7 },
}

/** Qué pista suena en cada acto. */
export function pistaDeActo(acto: ActNumber): PistaMusica {
  return `a${acto}` as PistaMusica
}

/** Acto 1..4 de un nodo, o 1 si no hay (partida recién empezada). */
export function actoValido(n: number | undefined): ActNumber {
  return (n === 2 || n === 3 || n === 4 ? n : 1) as ActNumber
}

/**
 * Duración del cruce entre una vuelta y la siguiente: 15 % de la pista, tope 2,5 s.
 * Con un cruce de más de la mitad de la pista las dos voces sonarían casi siempre juntas.
 */
export function duracionCruce(duracionPistaS: number): number {
  if (!Number.isFinite(duracionPistaS) || duracionPistaS <= 0) return 0
  return Math.min(2.5, duracionPistaS * 0.15)
}

/**
 * Cuántos ms faltan para arrancar la voz siguiente (antes de que termine la actual), o
 * `null` si la duración no es un número usable. Un stream puede reportar `NaN` o `Infinity`
 * y `setTimeout` los toma como 0: saldría una voz nueva tras otra. Con `null` quien llama
 * no programa nada y deja que la voz se repita con el loop nativo.
 */
export function msHastaSiguiente(duracionPistaS: number): number | null {
  if (!Number.isFinite(duracionPistaS) || duracionPistaS <= 0) return null
  const d = duracionPistaS - duracionCruce(duracionPistaS)
  return Math.max(0, d * 1000)
}

/** Volumen 0..100 de la interfaz → ganancia 0..1. Valores fuera de rango o NaN se acotan. */
export function gananciaDeVolumen(vol: number): number {
  if (!Number.isFinite(vol)) return 0
  return Math.max(0, Math.min(1, vol / 100))
}

/** Viento: se mezcla por debajo de la flauta. */
export const GANANCIA_VIENTO = 0.55
