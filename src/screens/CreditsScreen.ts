// ══════════════════════════════════════════════════════
// CREDITS SCREEN
// ══════════════════════════════════════════════════════

import { CREDITOS_IMAGENES } from '../data/creditos.js'
import { showScreen } from '../ui/dom.js'

/**
 * La lista de imágenes, pintada una sola vez.
 *
 * Las licencias CC-BY piden atribución, así que esto no es cortesía: es la condición para
 * poder usarlas. Y encaja con lo que el juego ya hace en todo lo demás — cada dato histórico
 * lleva su fuente; una imagen no debería ser la excepción.
 *
 * Se arma con nodos y `textContent`, no con `innerHTML`. Hoy el contenido es nuestro y no
 * habría riesgo, pero el día que un título traiga un `<` la diferencia entre las dos formas
 * es que una lo muestra y la otra lo ejecuta.
 */
function pintarImagenes(): void {
  const lista = document.getElementById('cr-imagenes')
  if (!lista || lista.childElementCount > 0) return

  for (const c of CREDITOS_IMAGENES) {
    const li = document.createElement('li')
    li.className = 'cr-img-item'

    const a = document.createElement('a')
    a.href = c.enlace
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = c.titulo

    const meta = document.createElement('span')
    meta.className = 'cr-img-meta'
    meta.textContent = ` — ${c.autor} · ${c.licencia}`

    li.append(a, meta)
    lista.append(li)
  }
}

export function mountCredits(): void {
  pintarImagenes()
  showScreen('credits-screen')
}
