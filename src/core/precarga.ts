// ══════════════════════════════════════════════════════
// PRECARGA DE IMÁGENES — qué bajar para que el juego ande sin internet
// Lógica pura (sin DOM): el service worker las baja, esto decide cuáles y cuándo.
// ══════════════════════════════════════════════════════

interface NodoConEventos { act: number; eventPool: readonly string[] }

/**
 * Las imágenes de todos los eventos, en el orden en que el alumno las va a necesitar: primero
 * las del acto 1, después las del 2, y así. Sin repetidas. Si la precarga se corta (se fue la
 * red, se cerró la tablet), lo que quedó bajado es lo más urgente.
 */
export function imagenesPorActo(
  nodos:   Record<string, NodoConEventos>,
  eventos: Record<string, { img: string }>,
): string[] {
  const porActo = Object.values(nodos).sort((a, b) => a.act - b.act)
  const vistas = new Set<string>()
  const orden: string[] = []
  for (const n of porActo) {
    for (const id of n.eventPool) {
      const img = eventos[id]?.img
      if (img && !vistas.has(img)) { vistas.add(img); orden.push(img) }
    }
  }
  return orden
}

/** Datos de `navigator.connection` que importan (no está en todos los navegadores). */
export interface Conexion { saveData?: boolean; effectiveType?: string }

/**
 * ¿Conviene gastar datos ahora? No con el ahorro de datos prendido ni con una conexión que el
 * navegador marca como lenta (2g / 3g): ahí las 12 MB le compiten el ancho de banda al juego.
 * Sin información de conexión (Safari, Firefox) se asume que sí: es el caso de un wifi.
 */
export function conexionPermitePrecarga(c: Conexion | undefined | null): boolean {
  if (!c) return true
  if (c.saveData) return false
  return !['slow-2g', '2g', '3g'].includes(c.effectiveType ?? '')
}
