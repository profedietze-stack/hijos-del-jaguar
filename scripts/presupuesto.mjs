// Presupuesto de peso del build. Falla (exit 1) si algo pasa de su tope.
//
//   npm run build && npm run presupuesto
//
// Por qué: en una tablet de aula con wifi de escuela, cada KB cuenta, y el peso crece de a poco
// —una dependencia, una imagen sin comprimir— sin que nadie lo note hasta que el juego tarda un
// minuto en abrir. Los topes están en `presupuesto.json`, con un margen de ~15 % sobre lo que
// pesa hoy: para subirlos hay que decidirlo (y escribir por qué en el commit), no descubrirlo.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const dist = join(raiz, 'dist')
const topes = JSON.parse(readFileSync(join(raiz, 'presupuesto.json'), 'utf8'))

const KB = 1024
const fmt = (n) => (n >= 1024 * KB ? `${(n / KB / KB).toFixed(2)} MB` : `${(n / KB).toFixed(1)} KB`)

function recorrer(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? recorrer(p) : [p]
  })
}

let archivos
try { archivos = recorrer(dist) } catch {
  console.error('No hay dist/: correr `npm run build` antes.')
  process.exit(2)
}

const tamano = (p) => statSync(p).size
const gz = (p) => gzipSync(readFileSync(p), { level: 9 }).length
const nombre = (p) => p.slice(dist.length + 1).replaceAll('\\', '/')

const fallas = []
const filas = []
function medir(que, valor, tope) {
  const ok = valor <= tope
  filas.push(`${ok ? 'ok ' : 'MAL'} ${que.padEnd(34)} ${fmt(valor).padStart(10)} / ${fmt(tope)}`)
  if (!ok) fallas.push(`${que}: ${fmt(valor)} pasa el tope de ${fmt(tope)}`)
}

// JS y CSS, comprimidos (así viajan). El grupo se reconoce por el prefijo del nombre con hash.
const codigo = archivos.filter((p) => ['.js', '.css'].includes(extname(p)) && nombre(p).startsWith('assets/'))
medir('JS + CSS (gzip, total)', codigo.reduce((s, p) => s + gz(p), 0), topes.codigoGzipTotalKB * KB)
for (const [prefijo, tope] of Object.entries(topes.codigoGzipPorArchivoKB)) {
  const p = codigo.find((f) => extname(f) === '.js' && nombre(f).startsWith(`assets/${prefijo}`))
  if (!p) { fallas.push(`no hay un archivo assets/${prefijo}*.js: el presupuesto apunta a algo que ya no existe`); continue }
  medir(`  ${prefijo}* (gzip)`, gz(p), tope * KB)
}

const css = codigo.filter((p) => extname(p) === '.css')
medir('CSS (gzip, total)', css.reduce((s, p) => s + gz(p), 0), topes.cssGzipKB * KB)

// Carpetas de recursos (sin comprimir: son jpg/ogg/woff2, ya comprimidos).
for (const [carpeta, tope] of Object.entries(topes.carpetasMB)) {
  // Los .map (mapas de fuente) están en dist pero no los baja nadie que no abra las DevTools.
  const suma = archivos.filter((p) => nombre(p).startsWith(`${carpeta}/`) && extname(p) !== '.map').reduce((s, p) => s + tamano(p), 0)
  medir(`${carpeta}/`, suma, tope * KB * KB)
}

// Una imagen suelta de más de N KB es casi siempre un original sin comprimir.
const tapeImg = topes.imagenMaxKB * KB
const gordas = archivos.filter((p) => /\.(jpe?g|png|webp)$/i.test(p) && tamano(p) > tapeImg)
for (const p of gordas) fallas.push(`${nombre(p)}: ${fmt(tamano(p))} pasa el tope por imagen de ${fmt(tapeImg)}`)
filas.push(`${gordas.length ? 'MAL' : 'ok '} ${'imágenes sueltas'.padEnd(34)} ${String(gordas.length).padStart(10)} sobre ${fmt(tapeImg)}`)

medir('dist/ completo (sin mapas)', archivos.filter((p) => extname(p) !== '.map').reduce((s, p) => s + tamano(p), 0), topes.distTotalMB * KB * KB)

console.log(filas.join('\n'))
if (fallas.length) {
  console.error(`\nPresupuesto superado:\n - ${fallas.join('\n - ')}`)
  process.exit(1)
}
console.log('\nPresupuesto de peso: ok')
