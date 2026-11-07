import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/*
  Privacidad de los alumnos (son menores). Barre TODO el código: un archivo nuevo entra solo.
    - el nombre del cacique es lo único que se pide, y no sale del dispositivo;
    - lo que escribe el alumno nunca llega a innerHTML sin escapar;
    - ningún pedido de red sale del propio sitio.
  (Los recursos de terceros en el HTML y en las escenas están en sinTerceros.test.ts, y en el
  e2e se comprueba en vivo que ningún pedido sale a otro servidor.)
*/

const fuentes = import.meta.glob('../../**/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const codigo = Object.entries(fuentes).filter(([r]) => !r.includes('__tests__') && !r.endsWith('.test.ts'))
const indexHtml = readFileSync(fileURLToPath(new URL('../../../index.html', import.meta.url)), 'utf8')

describe('el barrido ve el código', () => {
  it('encuentra los archivos del juego (si no, nada de lo de abajo prueba algo)', () => {
    expect(codigo.length).toBeGreaterThan(20)
    expect(codigo.some(([r]) => r.endsWith('/main.ts'))).toBe(true)
  })
})

describe('qué se le pide al alumno', () => {
  it('un solo campo de texto libre: el nombre de pila, de 24 caracteres como mucho', () => {
    const textos = [...indexHtml.matchAll(/<input\b[^>]*type="text"[^>]*>/gs)].map((m) => m[0])
    expect(textos).toHaveLength(1)
    expect(textos[0]).toContain('id="cacique-name-input"')
    expect(Number(textos[0]!.match(/maxlength="(\d+)"/)?.[1])).toBeLessThanOrEqual(24)
  })

  it('ni correo, ni teléfono, ni contraseña, ni área de texto', () => {
    expect(indexHtml).not.toMatch(/type="(email|tel|password|url|search)"|<textarea|autocomplete="(email|tel|name|username)"/)
  })
})

describe('lo que escribe el alumno no llega a innerHTML sin escapar', () => {
  /**
   * El nombre viaja a tooltips, narración, certificado e historial. Cada `${…}` que lo
   * interpola dentro de una plantilla tiene que pasar por escapeHtml, salvo que esa línea no
   * sea HTML (un log o un textContent).
   */
  const CAMPOS = /caciqueName|tribeToken/
  it('toda interpolación de caciqueName / tribeToken está escapada o no es HTML', () => {
    const mal: string[] = []
    for (const [ruta, texto] of codigo) {
      texto.split('\n').forEach((linea, i) => {
        for (const m of linea.matchAll(/\$\{([^}]*)\}/g)) {
          if (!CAMPOS.test(m[1]!)) continue
          if (/^\s*escapeHtml\(/.test(m[1]!)) continue
          if (/^\s*(log|logError|console\.\w+)\(|cSet\(/.test(linea)) continue
          mal.push(`${ruta.replace('../../', 'src/')}:${i + 1}  ${linea.trim().slice(0, 90)}`)
        }
      })
    }
    expect(mal).toEqual([])
  })

  it('nadie escribe el nombre en innerHTML / outerHTML / insertAdjacentHTML con una suma de strings', () => {
    const mal: string[] = []
    for (const [ruta, texto] of codigo) {
      texto.split('\n').forEach((linea, i) => {
        if (/(innerHTML|outerHTML)\s*[+]?=|insertAdjacentHTML\(/.test(linea) && /\+\s*[\w.]*(caciqueName|tribeToken)|(caciqueName|tribeToken)[\w.]*\s*\+/.test(linea)) {
          mal.push(`${ruta}:${i + 1}`)
        }
      })
    }
    expect(mal).toEqual([])
  })
})

describe('nada sale del propio sitio', () => {
  it('no hay XHR, beacons, sockets ni document.write', () => {
    const mal = codigo.flatMap(([r, t]) => (/XMLHttpRequest|sendBeacon|new WebSocket|new EventSource|document\.write\(|new Function\(/.test(t) ? [r] : []))
    expect(mal).toEqual([])
  })

  it('todo fetch() pide un archivo propio, desde BASE_URL', () => {
    const mal: string[] = []
    for (const [ruta, texto] of codigo) {
      for (const m of texto.matchAll(/fetch\(\s*([^)]*)\)/g)) {
        if (!/^`\$\{import\.meta\.env\.BASE_URL\}/.test(m[1]!.trim())) mal.push(`${ruta}: fetch(${m[1]})`)
      }
    }
    expect(mal).toEqual([])
  })

  it('ningún fetch manda datos (sin body ni método POST)', () => {
    const mal = codigo.flatMap(([r, t]) => (/fetch\([^)]*\{[^}]*(method|body)/.test(t) ? [r] : []))
    expect(mal).toEqual([])
  })
})
