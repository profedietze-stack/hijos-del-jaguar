// ══════════════════════════════════════════════════════
// SERVICE WORKER — Hijos del Jaguar v2
// Estrategia por tipo de recurso:
//   - Install:     pre-cachea fuentes, iconos y manifest
//   - HTML (navegacion): red primero, cache de respaldo, para que llegue cada version nueva
//   - Same-origin: cache-first (assets con hash de Vite)
//   - Otros fetch: stale-while-revalidate
// ══════════════════════════════════════════════════════

const CACHE_NAME = 'jaguar-v6'

// Activos estaticos sin hash: fuentes, iconos, manifest.
//
// Relativas al propio worker, que se sirve desde la base con la que el juego se publica
// (`/hijos-del-jaguar/` en general, `/` en Vercel). Estaban ancladas a la raiz, y `addAll` es
// todo o nada: con una sola que diera 404 el install fallaba entero y el worker no llegaba a
// activarse nunca.
const STATIC_PRECACHE = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  './images/menu-bg.jpg',
  './geo/countries-110m.json',
  './fonts/cinzel-decorative-700.woff2',
  './fonts/cinzel-decorative-700-ext.woff2',
  './fonts/cinzel-400.woff2',
  './fonts/cinzel-400-ext.woff2',
  './fonts/crimson-text-400.woff2',
  './fonts/crimson-text-400-ext.woff2',
  './fonts/crimson-text-400i.woff2',
  './fonts/crimson-text-400i-ext.woff2',
  './fonts/crimson-text-600.woff2',
  './fonts/crimson-text-600-ext.woff2',
  './fonts/crimson-text-600i.woff2',
  './fonts/crimson-text-600i-ext.woff2',
  // Música y efectos: sin esto "anda sin internet" seria mentira, el juego quedaria mudo.
  './audio/musica/kerriflute.ogg',
  './audio/musica/canyon_quena_solo1.ogg',
  './audio/musica/amazon_bamboo_loop.ogg',
  './audio/musica/ethno_native_atmosphere.ogg',
  './audio/musica/old_flutist.ogg',
  './audio/musica/desert_wind.ogg',
  './audio/sfx/click_003.ogg',
  './audio/sfx/tick_002.ogg',
  './audio/sfx/select_002.ogg',
  './audio/sfx/confirmation_001.ogg',
  './audio/sfx/confirmation_004.ogg',
  './audio/sfx/error_003.ogg',
  './audio/sfx/bong_001.ogg',
  './audio/sfx/open_003.ogg',
]

// ── Install: pre-cachear shell estático ──────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: limpiar versiones anteriores ───────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch ─────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  // Ya no hay ramas para terceros: ni Unsplash ni el CDN de jsdelivr. Las imágenes
  // están en `images/events/`, el GeoJSON del mapa en `geo/` y html2canvas en
  // `vendor/`, así que todo entra por la rama de mismo origen de acá abajo y el
  // juego funciona igual sin red.

  // HTML: red primero. Con cache-first el index.html quedaba congelado: quien ya habia abierto el
  // juego seguia cargando los assets con hash viejos y ningun arreglo nuevo le llegaba.
  if (url.origin === self.location.origin && (request.mode === 'navigate' || request.destination === 'document')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          const copia = response.clone()
          event.waitUntil(caches.open(CACHE_NAME).then(c => c.put(request, copia)))
        }
        return response
      }).catch(() =>
        caches.open(CACHE_NAME).then(c => c.match(request)).then(cached =>
          cached ?? new Response(
            '<html><body style="font-family:serif;color:#f0e2c0;background:#080604;text-align:center;padding:4rem"><h2>Sin conexión</h2><p>Recargá cuando tengas internet para continuar la huida.</p></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          )
        )
      )
    )
    return
  }

  // Same-origin: cache-first (Vite hashea assets, son inmutables)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached
          return fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone())
            return response
          }).catch(() =>
            // Sin red y sin cache: HTML de fallback offline
            new Response(
              '<html><body style="font-family:serif;color:#f0e2c0;background:#080604;text-align:center;padding:4rem"><h2>Sin conexión</h2><p>Recargá cuando tengas internet para continuar la huida.</p></body></html>',
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          )
        })
      )
    )
    return
  }

  // Otros orígenes (Google Fonts CDN, etc.): stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(request).then(cached => {
        const networkFetch = fetch(request)
          .then(response => {
            if (response && response.status === 200 && response.type !== 'opaque') {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => cached ?? new Response(null, { status: 503 }))
        return cached ?? networkFetch
      })
    )
  )
})
