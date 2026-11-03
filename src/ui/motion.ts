// ══════════════════════════════════════════════════════
// MOVIMIENTO REDUCIDO — una sola definición para toda la app.
// El ajuste «Reducir movimiento» solo ponía una clase CSS: las transiciones de D3, las
// animaciones SMIL del mapa y las brasas del menú seguían moviéndose.
// ══════════════════════════════════════════════════════

/** true si el jugador lo pidió en Ajustes o el sistema operativo lo pide. */
export function movimientoReducido(): boolean {
  try {
    return document.documentElement.classList.contains('cfg-reduced-motion')
      || matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

type D3Like = { transition: () => unknown }

/**
 * Hace que toda transición de D3 dure 0 ms (y sin demora) cuando el movimiento está reducido.
 * Se lee en cada llamada, así que cambiar el ajuste surte efecto sin recargar.
 */
export function parchearTransicionesD3(d3: D3Like): void {
  const proto = Object.getPrototypeOf(d3.transition()) as Record<string, unknown>
  if (proto.__movimientoReducido) return
  proto.__movimientoReducido = true
  for (const m of ['duration', 'delay'] as const) {
    const original = proto[m] as (this: unknown, ...a: unknown[]) => unknown
    // Con `arguments.length` D3 distingue leer (sin argumentos) de escribir: hay que reenviar tal cual.
    proto[m] = function (this: unknown, ...a: unknown[]) {
      if (a.length === 1 && typeof a[0] === 'number' && movimientoReducido()) return original.call(this, 0)
      return original.apply(this, a)
    }
  }
}

/** Congela las animaciones SMIL (<animate>) de un SVG si el movimiento está reducido. */
export function congelarSmil(svg: Element | null): void {
  if (svg && movimientoReducido() && 'pauseAnimations' in svg) (svg as unknown as SVGSVGElement).pauseAnimations()
}
