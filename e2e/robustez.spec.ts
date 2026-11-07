import { test, expect, type Page } from '@playwright/test'
import { vigilar, pasarSplash, empezarPartida, guardadoLimpio, sembrarGuardado, guardadoAlBordeDelActo2, abrirEvento, SAVE_KEY } from './ayudas'

/*
  Robustez: lo que el alumno puede tocar y lo que el aula puede romper.
    - el banner de errores existe en el build de producción y aparece solo;
    - un nombre con HTML no inyecta nada;
    - una partida entera de punta a punta con un bot, hasta el final y sin un error;
    - dedos (44 px) y teclado (foco visible).
*/

test.beforeEach(async ({ page }) => { await guardadoLimpio(page) })

// ── Banner de errores ──────────────────────────────────────────────────────────

test.describe('banner global de errores', () => {
  test('un error no atrapado se ve en pantalla', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('#__err_banner__')).toHaveCount(0)
    await page.evaluate(() => { setTimeout(() => { throw new Error('error-de-prueba-uno') }, 0) })
    const banner = page.locator('#__err_banner__')
    await expect(banner).toBeVisible()
    await expect(banner).toContainText('error-de-prueba-uno')
  })

  test('una promesa rechazada sin atender también', async ({ page }) => {
    await page.goto('./')
    await page.evaluate(() => { void Promise.reject(new Error('rechazo-de-prueba-dos')) })
    await expect(page.locator('#__err_banner__')).toContainText('rechazo-de-prueba-dos')
  })

  test('sigue ahí cuando el juego ya arrancó y la pantalla cambió', async ({ page }) => {
    await page.goto('./')
    await pasarSplash(page)
    await empezarPartida(page)
    await page.evaluate(() => { setTimeout(() => { throw new Error('error-en-el-mapa') }, 0) })
    await expect(page.locator('#__err_banner__')).toContainText('error-en-el-mapa')
  })
})

// ── Entrada no confiable ───────────────────────────────────────────────────────

test('un nombre con HTML se muestra como texto y no ejecuta nada', async ({ page }) => {
  test.setTimeout(150_000)
  const d = vigilar(page)
  await page.goto('./')
  await pasarSplash(page)
  // 24 caracteres es el tope del campo: cabe justo.
  const payload = '<img src=x onerror=_x=1>'
  expect(payload.length).toBeLessThanOrEqual(24)
  await empezarPartida(page, payload)

  // Abre el primer evento y recorre lo que muestra el nombre (narración, HUD, etc.).
  // Primera partida: tutorial (aparece a los ~2 s) y luego la cinemática de apertura.
  await page.locator('#tut-close').click({ timeout: 15_000 })
  await abrirEvento(page, 'Ir a Guatemala')
  await expect(page.locator('#event-screen')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('#dec-buttons button').first()).toBeVisible({ timeout: 30_000 })

  expect(await page.evaluate(() => (window as unknown as { _x?: number })._x)).toBeUndefined()
  // Ningún <img src="x"> se coló en el DOM.
  expect(await page.locator('img[src="x"]').count()).toBe(0)
  expect(d.errores).toEqual([])
  expect(d.externos).toEqual([])
})

// ── Guardar al salir ───────────────────────────────────────────────────────────

/**
 * En un aula lo normal es cerrar la pestaña o bloquear la tablet a mitad de camino. El juego
 * guarda en cada paso, pero la decisión recién tomada (con su cartel de consecuencias en
 * pantalla) todavía no se había guardado: quien cerraba ahí perdía lo que acababa de decidir.
 */
test('lo decidido se guarda también al ocultarse la página, sin esperar al siguiente paso', async ({ page }) => {
  test.setTimeout(120_000)
  const d = vigilar(page)
  await sembrarGuardado(page, guardadoAlBordeDelActo2())
  await page.goto('./')
  await pasarSplash(page)
  await page.locator('#btn-continue').click()
  await expect(page.locator('#map-screen')).toBeVisible()

  const historia = () => page.evaluate((k) => (JSON.parse(localStorage.getItem(k) ?? '{}').history ?? []).length as number, SAVE_KEY)
  expect(await historia()).toBe(7)   // Talamanca fue el último; Panamá todavía no se jugó

  // Abre el evento de Panamá y decide.
  await abrirEvento(page, 'Ir a Panamá')
  await page.locator('#dec-buttons button').first().click()
  await expect(page.locator('#aftermath-overlay')).toHaveClass(/visible/)

  // Ahí el alumno cierra: la página se oculta. Todavía no tocó «Continuar».
  expect(await historia(), 'antes de ocultarse, lo decidido no estaba guardado').toBe(7)
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  expect(await historia()).toBe(8)   // Panamá quedó en la historia

  // Y no resucita nada tras el final de una partida: ver `_partidaViva` en main.ts (unit en el bot).
  expect(d.errores).toEqual([])
})

// ── Impaciencia ────────────────────────────────────────────────────────────────

/**
 * d3-zoom interrumpe las transiciones del mapa en cuanto el jugador toca. La cinemática de
 * apertura seguía con `.on('end')`, que una transición interrumpida nunca dispara: el mapa
 * quedaba alejado para siempre y los clics ignorados (`_busy`). Un alumno impaciente tocando
 * Guatemala mientras corre la cinemática dejaba la partida inutilizable.
 */
test('tocar el mapa durante la cinemática de apertura no cuelga la partida', async ({ page }) => {
  test.setTimeout(150_000)
  const d = vigilar(page)
  await page.goto('./')
  await pasarSplash(page)
  await empezarPartida(page)
  await page.locator('#tut-close').click({ timeout: 15_000 })
  const nodo = page.locator('#map-screen [role=button][aria-label^="Ir a"]').first()
  // En cuanto el nodo se pueda tocar, o sea todavía en plena cinemática, tocarlo.
  await page.waitForFunction(() => {
    const e = document.querySelector('#map-screen [role=button][aria-label^="Ir a"]')
    if (!e) return false
    const b = e.getBoundingClientRect()
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2
    return cx > 0 && cy > 110 && cx < innerWidth && cy < innerHeight && e.contains(document.elementFromPoint(cx, cy))
  }, undefined, { timeout: 60_000 })
  const caja = (await nodo.boundingBox())!
  await page.mouse.click(caja.x + caja.width / 2, caja.y + caja.height / 2)

  // La cinemática tiene que terminar igual: el mapa se acerca (el nodo crece de ~50 a ~175 px)...
  await expect.poll(async () => (await nodo.boundingBox())?.width ?? 0, { timeout: 60_000 }).toBeGreaterThan(120)
  // ...y la partida tiene que poder seguir: el nodo abre su evento. Mientras corren los carteles
  // de la cinemática el juego ignora los clics a propósito, así que se reintenta con tope.
  let abrio = false
  for (let intento = 0; intento < 12 && !abrio; intento++) {
    await page.waitForTimeout(3000)
    const c = await nodo.boundingBox()
    if (!c) continue
    await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2)
    abrio = await page.locator('#event-screen.active').waitFor({ timeout: 5000 }).then(() => true, () => false)
  }
  expect(abrio, 'el evento no se abrió en ~100 s: la partida quedó colgada').toBe(true)
  expect(d.errores).toEqual([])
})

// ── Partida completa con un bot ────────────────────────────────────────────────

type Politica = 'primera' | 'ultima' | 'azar'

/** Un solo paso del bot: toca lo que haga avanzar la partida. Devuelve qué hizo. */
async function paso(page: Page, politica: Politica, n: number): Promise<string> {
  return page.evaluate(([pol, i]) => {
    const visible = (el: Element | null): el is HTMLElement => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
    }
    const activa = (id: string) => document.getElementById(id)?.classList.contains('active') ?? false
    if (activa('ending-screen')) return 'fin'


    const hito = document.getElementById('hist-card-continue')
    if (visible(hito)) { hito.click(); return 'hito' }

    const tut = document.getElementById('tut-close')
    if (visible(tut)) { tut.click(); return 'tutorial' }

    // Las capas se prenden con la clase `visible` y se apagan con `fadeout`: el rectángulo del
    // botón sigue existiendo mientras se desvanecen, así que mirar el tamaño no alcanza.
    const prendida = (id: string) => { const e = document.getElementById(id); return !!e && e.classList.contains('visible') && !e.classList.contains('fadeout') }
    if (prendida('act-transition')) return 'esperando-transicion'   // se cierra sola a los 4 s
    const aft = document.getElementById('aftermath-continue')
    if (prendida('aftermath-overlay') && visible(aft)) { aft.click(); return 'aftermath' }
    if (document.getElementById('aftermath-overlay')?.classList.contains('fadeout')) return 'esperando-aftermath'

    const cf = document.getElementById('cf-continuar')
    if (visible(cf)) { cf.click(); return 'ficha' }

    if (activa('event-screen')) {
      const bs = [...document.querySelectorAll<HTMLButtonElement>('#dec-buttons button')].filter(b => visible(b) && !b.disabled)
      if (bs.length) {
        const k = pol === 'primera' ? 0 : pol === 'ultima' ? bs.length - 1 : (i! * 7 + 3) % bs.length
        bs[k]!.click()
        return 'decision'
      }
      return 'esperando-evento'
    }

    if (activa('map-screen')) {
      const nodos = [...document.querySelectorAll<SVGElement>('#map-screen [role=button][aria-label^="Ir a"]')]
      // Tocable de verdad: el centro del nodo está en pantalla y nada lo tapa (la cinemática de
      // apertura y el tutorial dejan el mapa fuera de cuadro o tapado durante unos segundos).
      // Se apunta al círculo táctil del nodo (el ícono): el centro de la caja entera incluye el
      // cartel con el nombre y puede caer en el vacío.
      const icono = (e: SVGElement): Element => e.querySelector('circle[r="26"]') ?? e
      // Un punto del nodo que el jugador pueda tocar: en pantalla y sin nada encima. Un marcador
      // de conquistador puede quedar tapando el centro, así que se prueban también los costados.
      const puntoTocable = (e: SVGElement): [number, number] | null => {
        const b = icono(e).getBoundingClientRect()
        const cx = b.x + b.width / 2, cy = b.y + b.height / 2, r = b.width / 4
        for (const [dx, dy] of [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r], [-r, -r], [r, r], [-r, r], [r, -r]] as const) {
          const x = cx + dx, y = cy + dy
          if (x > 0 && y > 110 && x < innerWidth && y < innerHeight && e.contains(document.elementFromPoint(x, y))) return [Math.round(x), Math.round(y)]
        }
        return null
      }
      const orden = nodos.map((_, j) => j)
      const k0 = pol === 'primera' ? 0 : pol === 'ultima' ? nodos.length - 1 : (i! * 5 + 1) % Math.max(1, nodos.length)
      const turno = pol === 'ultima' ? orden.reverse() : [...orden.slice(k0), ...orden.slice(0, k0)]
      for (const j of turno) {
        const p = puntoTocable(nodos[j]!)
        if (p) return `nodo:${p[0]}:${p[1]}`
      }
      return 'esperando-mapa'
    }
    return 'otro'
  }, [politica, n] as const)
}

async function jugarHastaElFinal(page: Page, politica: Politica): Promise<{ pasos: number; vistos: Set<string> }> {
  const vistos = new Set<string>()
  const traza: string[] = []
  const estado = () => page.evaluate(() => `nodos=[${[...document.querySelectorAll('#map-screen [role=button][aria-label^="Ir a"]')].map(e => { const b = e.getBoundingClientRect(); const cx = b.x + b.width / 2, cy = b.y + b.height / 2; const t = document.elementFromPoint(cx, cy); return `${e.getAttribute('aria-label')!.slice(5, 20)}@${Math.round(cx)},${Math.round(cy)} top=${t?.tagName}#${t?.id}.${String((t as HTMLElement)?.className?.baseVal ?? (t as HTMLElement)?.className).slice(0, 20)}` }).join(' ; ')}] pantalla=${document.querySelector('.screen.active')?.id ?? '?'} overlays=${['aftermath-overlay', 'act-transition', 'clase-ficha', 'ped-overlay', 'didactica-overlay', 'tut-overlay'].filter(i => { const e = document.getElementById(i); return e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 0 }).join(',')}`)
  let ultimaAccion = Date.now()
  let ultimoError = ''
  for (let n = 0; n < 1500; n++) {
    let que = await paso(page, politica, n)
    if (que.startsWith('nodo:')) {
      // Los nodos del mapa son SVG con handlers de d3: solo responden a un clic real.
      const [, x, y] = que.split(':')
      try {
        await page.mouse.click(Number(x), Number(y))
        // Durante la cinemática el juego ignora los clics (está ocupado): solo vale si abrió el evento.
        await page.locator('#event-screen.active').waitFor({ timeout: 8000 })
        que = 'nodo'
      } catch (e) { que = 'esperando-nodo'; ultimoError = String((e as Error).message).split(String.fromCharCode(10)).slice(0, 4).join(' | ') }
    }
    vistos.add(que)
    traza.push(que)
    if (que === 'fin') return { pasos: n, vistos }
    if (que.startsWith('esperando') || que === 'otro') {
      // Las animaciones tardan: esperar, pero con tope. Un juego colgado no puede esperar para siempre.
      if (Date.now() - ultimaAccion > 45_000) await page.screenshot({ path: 'test-results/colgada.png' })  // queda como evidencia
      if (Date.now() - ultimaAccion > 45_000) throw new Error(`partida colgada en «${que}» tras ${n} pasos. ${await estado()}. Último error de clic: ${ultimoError}`)
      await page.waitForTimeout(250)
    } else {
      ultimaAccion = Date.now()
      await page.waitForTimeout(120)
    }
  }
  throw new Error(`la partida no terminó en 1500 pasos. ${await estado()}. Últimos: ${traza.slice(-40).join(' ')}`)
}

for (const [nombre, diff, politica] of [
  ['educativo, siempre la primera opción',  'edu', 'primera'],
  ['histórico, siempre la última opción',   'his', 'ultima'],
  ['legendario, opciones al azar fijo',     'leg', 'azar'],
] as const) {
  test(`partida completa hasta el final: ${nombre} @largo`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'una partida entera alcanza con el escritorio; la tablet se prueba en las pruebas cortas')
    test.setTimeout(600_000)
    const d = vigilar(page)
    await page.goto('./')
    await pasarSplash(page)
    await empezarPartida(page, 'Bot', diff)
    const { pasos, vistos } = await jugarHastaElFinal(page, politica)
    await expect(page.locator('#ending-screen')).toHaveClass(/active/)
    // El bot tiene que haber pasado por eventos de verdad, no saltado directo al final.
    expect(vistos.has('decision')).toBe(true)
    expect(pasos).toBeGreaterThan(5)
    expect(d.errores).toEqual([])
    expect(d.externos).toEqual([])
  })
}
