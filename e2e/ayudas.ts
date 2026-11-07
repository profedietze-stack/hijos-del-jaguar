import { expect, type Page } from '@playwright/test'
import { SAVE_KEY } from '../src/core/SaveSystem'

export { SAVE_KEY }

const MUSICA = '/audio/musica/'

export interface Diario {
  errores:   string[]
  musica:    string[]
  /** Pedidos a cualquier servidor que no sea el del propio juego (privacidad: tiene que quedar vacío). */
  externos:  string[]
}

/** Engancha el diario ANTES de navegar: un error de arranque no se puede recuperar después. */
export function vigilar(page: Page): Diario {
  const d: Diario = { errores: [], musica: [], externos: [] }
  page.on('pageerror', (e) => d.errores.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') d.errores.push(`console: ${m.text()}`) })
  page.on('requestfailed', (r) => {
    // Un stream de audio que se corta al cambiar de pista termina en ERR_ABORTED: no es un fallo.
    if (r.failure()?.errorText === 'net::ERR_ABORTED') return
    d.errores.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`)
  })
  page.on('response', (r) => { if (r.status() >= 400) d.errores.push(`http ${r.status()}: ${r.url()}`) })
  page.on('request', (r) => {
    const url = r.url()
    const i = url.indexOf(MUSICA)
    if (i >= 0) d.musica.push(url.slice(i + MUSICA.length))
    if (/^(data|blob|about):/.test(url)) return
    if (new URL(url).hostname !== '127.0.0.1') d.externos.push(url)
  })
  return d
}

export async function pasarSplash(page: Page): Promise<void> {
  await page.locator('#btn-splash-start').click({ timeout: 20_000 })
  await expect(page.locator('#menu-screen')).toBeVisible()
}

export async function empezarPartida(page: Page, nombre = 'Tecun', diff: 'edu' | 'his' | 'leg' = 'edu'): Promise<void> {
  await page.locator('#btn-nueva').click()
  await page.locator(`#diff-${diff}`).click()
  await page.locator('#btn-comenzar').click()
  await page.locator('#cacique-name-input').fill(nombre)
  await page.locator('#btn-name-confirm').click()
  await expect(page.locator('#map-screen')).toBeVisible({ timeout: 20_000 })
}

/** Siembra un guardado antes de que cargue el juego (va después del `clear` del beforeEach). */
export async function sembrarGuardado(page: Page, guardado: unknown): Promise<void> {
  await page.addInitScript(([k, v]) => { try { localStorage.setItem(k!, v!) } catch { /* sin storage */ } },
    [SAVE_KEY, JSON.stringify(guardado)])
}

/**
 * Guardado en el último nodo del acto 1 (Talamanca), con Panamá —el primero del acto 2—
 * ya elegible. Ahí es donde el audio tiene que cambiar de pista.
 */
export function guardadoAlBordeDelActo2(): Record<string, unknown> {
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

/** Cada prueba arranca desde un guardado limpio (se llama desde un beforeEach). */
export async function guardadoLimpio(page: Page): Promise<void> {
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* sin storage */ } })
}

/**
 * Abre el evento de un nodo del mapa tocándolo como un alumno. El juego ignora los toques
 * mientras anima (cinemática de apertura, token, conquistador), así que se reintenta con tope;
 * si en ~60 s no abre, la partida quedó colgada y es un fallo.
 */
export async function abrirEvento(page: Page, aria: string): Promise<void> {
  const vp = page.viewportSize() ?? { width: 1280, height: 800 }
  let abrio = false
  for (let i = 0; i < 20 && !abrio; i++) {
    await page.waitForTimeout(2000)
    const c = await page.locator(`#map-screen [role=button][aria-label^="${aria}"] circle[r="26"]`).first().boundingBox()
    if (c && c.y > 110 && c.y < vp.height - 20 && c.x > 0 && c.x < vp.width - 10) await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2)
    abrio = await page.locator('#event-screen.active').waitFor({ timeout: 4000 }).then(() => true, () => false)
  }
  expect(abrio, `el evento de «${aria}» no se abrió: la partida quedó colgada`).toBe(true)
}
