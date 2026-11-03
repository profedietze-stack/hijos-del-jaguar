// ══════════════════════════════════════════════════════
// TEXTO — escape de HTML y personalización de la narración.
// Funciones puras (sin DOM) para poder probarlas en node.
// ══════════════════════════════════════════════════════

/** Escapa un texto de usuario antes de interpolarlo en innerHTML. */
export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Inserta el nombre del cacique en la narración (que es HTML propio del juego).
 * El nombre se escapa, y se usa una función de reemplazo: con un string, JS
 * interpreta `$&`, `$1` o `$$` dentro del nombre.
 */
export function personalizeNarr(narrHtml: string, name: string): string {
  const n = escapeHtml(name)
  const sub = (from: string, to: string) => (s: string) => s.replace(from, () => to)
  return [
    sub('llama aparte al cacique,',                    `llama aparte al cacique ${n},`),
    sub('Doce guaraníes miran al cacique.',            `Doce guaraníes miran al cacique ${n}.`),
    sub('Le ofrecen al cacique hablar',                `Le ofrecen al cacique ${n} hablar`),
    sub('Cuando el cacique se acerca,',                `Cuando ${n} se acerca,`),
    sub('una expresión que el cacique nunca le vio',   `una expresión que ${n} nunca le vio`),
    sub('cerca de los pies del cacique:',              `cerca de los pies de ${n}:`),
    sub('ya no es solo tuya, cacique.',                `ya no es solo tuya, ${n}.`),
    sub(
      '<span class="ct" data-modal="cacique">cacique</span>',
      `<span class="ct" data-modal="cacique">cacique</span> <strong style="color:var(--ocre2)">${n}</strong>`,
    ),
  ].reduce((acc, f) => f(acc), narrHtml)
}
