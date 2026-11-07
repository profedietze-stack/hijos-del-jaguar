import { test, expect, type Page } from '@playwright/test'
import { SAVE_KEY } from '../src/core/SaveSystem'
import { ARCHIVO_PISTA, ARCHIVO_VIENTO } from '../src/ui/audioLogic'

/*
  E2E del arranque y del audio. Cubre lo que vitest no ve porque no abre el juego:
    - que se pueda empezar una partida desde un guardado limpio (el camino de entrada);
    - que cada pantalla pida la pista que corresponde, y que al cruzar de acto cambie;
    - que el juego cargue sin internet (service worker);
    - cero errores de consola, de página y de red en todo el recorrido.

  El audio no se escucha en un navegador sin cabeza: se comprueba QUÉ archivo se pide, que es lo
  que decide el código. Cómo suena lo juzga el oído, no un test.
*/

const MUSICA = '/audio/musica/'

interface Diario { errores: string[]; musica: string[] }

/** Engancha el diario ANTES de navegar: un error de arranque no se puede recuperar después. */
function vigilar(page: Page): Diario {
  const d: Diario = { errores: [], musica: [] }
  page.on('pageerror', (e) => d.errores.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') d.errores.push(`console: ${m.text()}`) })
  page.on('requestfailed', (r) => {
    // Un stream de audio que se corta al cambiar de pista termina en ERR_ABORTED: no es un fallo.
    if (r.failure()?.errorText === 'net::ERR_ABORTED') return
    d.errores.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`)
  })
  page.on('response', (r) => { if (r.status() >= 400) d.errores.push(`http ${r.status()}: ${r.url()}`) })
  page.on('request', (r) => {
    const i = r.url().indexOf(MUSICA)
    if (i >= 0) d.musica.push(r.url().slice(i + MUSICA.length))
  })
  return d
}

async function pasarSplash(page: Page): Promise<void> {
  await page.locator('#btn-splash-start').click({ timeout: 20_000 })
  await expect(page.locator('#menu-screen')).toBeVisible()
}

async function empezarPartida(page: Page): Promise<void> {
  await page.locator('#btn-nueva').click()
  await page.locator('#diff-edu').click()
  await page.locator('#btn-comenzar').click()
  await page.locator('#cacique-name-input').fill('Tecun')
  await page.locator('#btn-name-confirm').click()
  await expect(page.locator('#map-screen')).toBeVisible({ timeout: 20_000 })
}

test.beforeEach(async ({ page }) => {
  // Cada prueba arranca desde un guardado limpio. (El navegador del test no tiene salida de
  // audio, así que no hace falta silenciar el juego.)
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* sin storage */ } })
})

test('arranque limpio: título, menú y la música del menú', async ({ page }) => {
  const d = vigilar(page)
  await page.goto('./')
  await expect(page).toHaveTitle(/Hijos del Jaguar/)
  await pasarSplash(page)
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.menu)
  // Sin partida guardada, «Continuar» no se puede tocar.
  await expect(page.locator('#btn-continue')).toBeDisabled()
  expect(d.errores).toEqual([])
})

test('desde un guardado limpio se puede empezar y suena el acto 1 con el viento', async ({ page }) => {
  const d = vigilar(page)
  await page.goto('./')
  await pasarSplash(page)
  await empezarPartida(page)
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.a1)
  await expect.poll(() => d.musica).toContain(ARCHIVO_VIENTO)
  // Tiene que haber nodos elegibles: un mapa sin salida deja la partida muerta.
  expect(await page.locator('#map-screen [role=button][aria-label^="Ir a"]').count()).toBeGreaterThan(0)
  expect(d.errores).toEqual([])
})

/**
 * Guardado sembrado en el último nodo del acto 1 (Talamanca), con Panamá —el primero del acto 2—
 * ya elegible. Ahí es donde el audio tiene que cambiar de pista.
 */
function guardadoAlBordeDelActo2(): Record<string, unknown> {
  const recorrido = ['n00', 'n01a', 'n01c', 'n02a', 'n_cocibolca', 'n02b', 'n_talamanca']
  const nodes: Record<string, unknown> = {}
  for (const id of recorrido) nodes[id] = { completed: true, unlocked: true }
  nodes['n03'] = { completed: false, unlocked: true, unlockedFrom: 'n_talamanca' }
  return {
    diff: 'educativo', caciqueName: 'Tecun', tribeToken: '🦅',
    stats: { food: 60, moral: 60, salud: 60, union: 60, warriors: 40, shamans: 5, civilians: 80 },
    nodes, history: recorrido, alliances: [], currentNode: null, finalTag: null,
    conq: { routeIdx: 5, caught: false, reorgTurns: 0 }, startTime: Date.now(),
  }
}

test('al cruzar al acto 2 cambia la pista, y antes sonaba la del acto 1', async ({ page }) => {
  const d = vigilar(page)
  // Va después del `clear` del beforeEach, así que prevalece.
  await page.addInitScript(([k, v]) => { try { localStorage.setItem(k!, v!) } catch { /* sin storage */ } },
    [SAVE_KEY, JSON.stringify(guardadoAlBordeDelActo2())])
  await page.goto('./')
  await pasarSplash(page)
  await page.locator('#btn-continue').click()
  await expect(page.locator('#map-screen')).toBeVisible()
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.a1)
  expect(d.musica).not.toContain(ARCHIVO_PISTA.a2)

  await page.locator('#map-screen [role=button][aria-label^="Ir a Panamá"]').click()
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.a2)
  expect(d.errores).toEqual([])
})

test('un guardado con los campos rotos no deja la pantalla muda', async ({ page }) => {
  const d = vigilar(page)
  const roto = { ...guardadoAlBordeDelActo2(), history: 'no-es-una-lista' }
  await page.addInitScript(([k, v]) => { try { localStorage.setItem(k!, v!) } catch { /* sin storage */ } },
    [SAVE_KEY, JSON.stringify(roto)])
  await page.goto('./')
  await pasarSplash(page)
  // «Continuar» está activo (hay algo guardado), pero lo guardado no sirve.
  await expect(page.locator('#btn-continue')).toBeEnabled()
  await page.locator('#btn-continue').click()
  // Vuelve al menú, descarta el guardado roto y no tira ningún error.
  await expect(page.locator('#menu-screen')).toBeVisible()
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), SAVE_KEY)).toBeNull()
  // El juego sigue vivo: se puede empezar una partida nueva.
  await empezarPartida(page)
  expect(d.errores).toEqual([])
})

test('sin internet el juego carga y la música sale del caché', async ({ page, context }) => {
  test.setTimeout(90_000)
  // Esta prueba necesita el caché: no limpia el storage ni lo toca entre visitas.
  await page.goto('./')
  await pasarSplash(page)
  // Primera visita: el worker se instala. Segunda: ya controla la página.
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).length), { timeout: 30_000 }).toBeGreaterThan(0)
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)

  await context.setOffline(true)
  const d = vigilar(page)
  await page.reload()
  await expect(page).toHaveTitle(/Hijos del Jaguar/)
  await pasarSplash(page)
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.menu)
  // Cada archivo pedido sin red tiene que haber vuelto del caché, no fallado.
  expect(d.errores).toEqual([])
})
