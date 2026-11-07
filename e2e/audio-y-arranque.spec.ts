import { test, expect } from '@playwright/test'
import { ARCHIVO_PISTA, ARCHIVO_VIENTO } from '../src/ui/audioLogic'
import { SAVE_KEY, vigilar, pasarSplash, empezarPartida, sembrarGuardado, guardadoAlBordeDelActo2, guardadoLimpio } from './ayudas'

/*
  E2E del arranque y del audio. Cubre lo que vitest no ve porque no abre el juego:
    - que se pueda empezar una partida desde un guardado limpio (el camino de entrada);
    - que cada pantalla pida la pista que corresponde, y que al cruzar de acto cambie;
    - que el juego cargue sin internet (service worker);
    - cero errores de consola, de página y de red en todo el recorrido.

  El audio no se escucha en un navegador sin cabeza: se comprueba QUÉ archivo se pide, que es lo
  que decide el código. Cómo suena lo juzga el oído, no un test.
*/

test.beforeEach(async ({ page }) => { await guardadoLimpio(page) })

test('arranque limpio: título, menú y la música del menú', async ({ page }) => {
  const d = vigilar(page)
  await page.goto('./')
  await expect(page).toHaveTitle(/Hijos del Jaguar/)
  await pasarSplash(page)
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.menu)
  // Sin partida guardada, «Continuar» no se puede tocar.
  await expect(page.locator('#btn-continue')).toBeDisabled()
  expect(d.errores).toEqual([])
  expect(d.externos, 'pedidos a terceros').toEqual([])
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
  expect(d.externos, 'pedidos a terceros').toEqual([])
})

test('al cruzar al acto 2 cambia la pista, y antes sonaba la del acto 1', async ({ page }) => {
  const d = vigilar(page)
  await sembrarGuardado(page, guardadoAlBordeDelActo2())
  await page.goto('./')
  await pasarSplash(page)
  await page.locator('#btn-continue').click()
  await expect(page.locator('#map-screen')).toBeVisible()
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.a1)
  expect(d.musica).not.toContain(ARCHIVO_PISTA.a2)

  await page.locator('#map-screen [role=button][aria-label^="Ir a Panamá"]').click()
  await expect.poll(() => d.musica).toContain(ARCHIVO_PISTA.a2)
  expect(d.errores).toEqual([])
  expect(d.externos, 'pedidos a terceros').toEqual([])
})

test('un guardado con los campos rotos no deja la pantalla muda', async ({ page }) => {
  const d = vigilar(page)
  const roto = { ...guardadoAlBordeDelActo2(), history: 'no-es-una-lista' }
  await sembrarGuardado(page, roto)
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
  expect(d.externos, 'pedidos a terceros').toEqual([])
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
  expect(d.externos, 'pedidos a terceros').toEqual([])
})

// ── Imágenes de eventos sin internet ───────────────────────────────────────────

const CACHE_IMG = 'jaguar-img-v1'
const claves = (page: import('@playwright/test').Page) =>
  page.evaluate(async (n) => (await (await caches.open(n)).keys()).map((r) => new URL(r.url).pathname), CACHE_IMG)

async function conWorkerActivo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('./')
  await pasarSplash(page)
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
}

test('el worker baja imágenes de eventos a su caché propia, y solo esas', async ({ page, context }) => {
  test.setTimeout(90_000)
  await conWorkerActivo(page)
  const base = new URL(page.url()).pathname.replace(/[^/]*$/, '')
  const buenas = ['andes.jpg', 'araucarias.jpg', 'boleadoras.jpg'].map((f) => `${base}images/events/${f}`)
  const ajenas = ['https://example.org/images/events/x.jpg', `${base}images/menu-bg.jpg`, `${base}geo/countries-110m.json`]
  await page.evaluate(({ urls }) => navigator.serviceWorker.controller!.postMessage({ tipo: 'precargar-imagenes', urls }), { urls: [...ajenas, ...buenas] })
  await expect.poll(() => claves(page), { timeout: 30_000 }).toEqual(expect.arrayContaining(buenas))
  // Nada ajeno entró en la caché de imágenes: ni otro servidor, ni el fondo del menú, ni el mapa.
  // (Sí pueden estar las imágenes de eventos que la propia pantalla ya mostró.)
  expect((await claves(page)).filter((k) => !k.startsWith(`${base}images/events/`))).toEqual([])

  // Sin red, la imagen sale de la caché: 200 y es un JPEG.
  await context.setOffline(true)
  const r = await page.evaluate(async (u) => { const x = await fetch(u); return { ok: x.ok, tipo: x.headers.get('content-type') } }, buenas[0]!)
  expect(r).toEqual({ ok: true, tipo: 'image/jpeg' })
})

test('al empezar una partida el juego pide la precarga y quedan TODAS las imágenes de los eventos', async ({ page, isMobile }) => {
  test.skip(isMobile, 'la precarga completa se mide en escritorio')
  test.setTimeout(150_000)
  const d = vigilar(page)
  await conWorkerActivo(page)
  await pasarSplash(page)
  await empezarPartida(page)
  // 20 s de espera deliberada + bajar ~50 imágenes de a una (en localhost, segundos).
  await expect.poll(async () => (await claves(page)).length, { timeout: 100_000, intervals: [2000] }).toBeGreaterThanOrEqual(45)
  expect(d.errores).toEqual([])
  expect(d.externos).toEqual([])
})
