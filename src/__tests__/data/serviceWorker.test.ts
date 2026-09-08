import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const leer = (rel: string): string =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')

const sw        = leer('../../../public/sw.js')
const indexHtml = leer('../../../index.html')
const viteConf  = leer('../../../vite.config.ts')

/**
 * El código sin sus comentarios.
 *
 * Sin esto el test se encuentra a sí mismo: el comentario que explica el arreglo cita
 * `scope: '/'` para decir por qué estaba mal, y la comprobación de que ya no está lo daba por
 * presente. Un test que lee la explicación en vez del código es un test que no mira nada.
 */
const sinComentarios = (fuente: string): string =>
  fuente
    // Los bloques van por regex y no por líneas: este proyecto escribe `/* … */` sin la
    // columna de asteriscos al margen, así que filtrar por el principio de cada línea deja
    // dentro todo el cuerpo del comentario — que es justo donde está la cita del error viejo.
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l))
    .join('\n')

const mainTs = sinComentarios(leer('../../main.ts'))

/**
 * El service worker, que no se instalaba nunca fuera de Vercel.
 *
 * `vite.config.ts` publica el juego bajo `/hijos-del-jaguar/` salvo en Vercel, donde va en la
 * raíz. El registro pedía `/sw.js` con `scope: '/'`, las dos cosas absolutas desde la raíz. En
 * Vercel eso acierta por casualidad; en cualquier otro sitio —y en desarrollo— el archivo está
 * en `/hijos-del-jaguar/sw.js` y `/sw.js` da 404.
 *
 * Comprobado en el navegador antes del arreglo: `/sw.js` → 404,
 * `/hijos-del-jaguar/sw.js` → 200, `getRegistrations()` → **cero**.
 *
 * Y el fallo era mudo por dos motivos que se sumaban. El registro terminaba en un
 * `.catch(() => {})` con el comentario «silencioso en dev o sin HTTPS», así que el 404 se
 * tragaba junto con los casos que sí son normales. Y aunque se hubiera registrado, las rutas
 * del pre-cacheo también arrancaban con `/`: `cache.addAll` rechaza entero si **una sola**
 * falla, así que el install habría fallado igual. Dos capas del mismo error de base, y las dos
 * daban el mismo resultado: cero modo offline en un juego que se usa en aulas con mal wifi.
 *
 * Además había dos registros: uno en `index.html` y otro en `main.ts`, con opciones distintas.
 * Dos sitios donde arreglar lo mismo es el motivo de que uno se arregle y el otro no.
 */
describe('el registro del service worker', () => {
  it('no se registra desde dos lados a la vez', () => {
    expect(indexHtml).not.toMatch(/serviceWorker\s*\.\s*register|serviceWorker\.register/)
    expect(mainTs.match(/serviceWorker\.register/g) ?? []).toHaveLength(1)
  })

  it('se pide contra la base con la que el juego se publica, no contra la raíz', () => {
    // La base sale de vite.config, así que fijarla a mano en el registro es fijar una de las
    // dos publicaciones y romper la otra.
    expect(viteConf).toMatch(/base:.*hijos-del-jaguar/)

    expect(mainTs, 'la ruta del worker no sale de BASE_URL').toMatch(/import\.meta\.env\.BASE_URL/)
    expect(mainTs).toMatch(/register\(`\$\{base\}sw\.js`,\s*\{\s*scope:\s*base\s*\}\)/)
    expect(mainTs, 'seguía pidiendo /sw.js desde la raíz').not.toMatch(/register\('\/sw\.js'/)
    expect(mainTs, "seguía reclamando scope '/'").not.toMatch(/scope:\s*'\/'/)
  })

  it('y un fallo de registro deja rastro en vez de perderse', () => {
    // Un `catch` vacío es lo que hizo que un 404 pareciera «no hay soporte» durante meses.
    expect(mainTs).not.toMatch(/\.catch\(\(\)\s*=>\s*\{\s*\/\*[^}]*\*\/\s*\}\)/)
    expect(mainTs).toMatch(/console\.(warn|error)/)
  })
})

describe('el pre-cacheo del service worker', () => {
  // El corte va de la declaración al cierre del array. Buscar `install` como final era
  // frágil: la palabra aparece antes, en el comentario que explica por qué esto se arregló.
  const desde = sw.indexOf('const STATIC_PRECACHE')
  const precache = sw.slice(desde, sw.indexOf(']', desde) + 1)

  /**
   * `cache.addAll` es todo o nada: una sola ruta que dé 404 tira el install entero y el worker
   * no llega a activarse. Con el juego bajo `/hijos-del-jaguar/`, cada `/fonts/...` era un 404.
   */
  it('ninguna ruta del pre-cacheo se ancla a la raíz del dominio', () => {
    const absolutas = [...precache.matchAll(/'(\/[^']*)'/g)].map((m) => m[1]!)
    expect(absolutas).toEqual([])
  })

  it('las rutas son relativas al propio worker, que vive en la base', () => {
    const rutas = [...precache.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]!)
    expect(rutas.length).toBeGreaterThan(10)
    expect(rutas.every((r) => r.startsWith('./'))).toBe(true)
  })

  /**
   * Y el nombre de la caché sube cuando cambia lo precacheado: si no, quien ya tenga el worker
   * instalado se queda con la lista vieja para siempre, que es la única forma de que un
   * arreglo de rutas no llegue nunca a quien más lo necesita.
   */
  it('el nombre de la caché acompaña al cambio de rutas', () => {
    // El número va fijo a propósito: obliga a subirlo a conciencia cada vez que
    // cambia lo precacheado. v3 fue el arreglo de las rutas; v4, sacar las ramas
    // de terceros y meter el GeoJSON del mapa en el pre-cacheo.
    expect(sw).toMatch(/const CACHE_NAME = 'jaguar-v4'/)
  })
})
