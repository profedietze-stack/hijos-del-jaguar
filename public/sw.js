// ══════════════════════════════════════════════════════
// SERVICE WORKER — Hijos del Jaguar
// Estrategia: stale-while-revalidate para todos los assets.
// Permite jugar sin conexión después de la primera carga.
// ══════════════════════════════════════════════════════

const CACHE_NAME  = 'jaguar-v1'
const SHELL_URLS  = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg']

// ── INSTALL: cachear el shell de la app ───────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  )
})

// ── ACTIVATE: limpiar caches viejos ──────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── FETCH: stale-while-revalidate ────────────────────

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  // Ignorar solicitudes no-cacheable (chrome-extension, etc.)
  const url = new URL(req.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(req).then(cached => {
        // Siempre intentar actualizar en segundo plano
        const networkFetch = fetch(req)
          .then(response => {
            // Solo cachear respuestas válidas (no opaque, no error)
            if (
              response &&
              response.status === 200 &&
              response.type !== 'opaque'
            ) {
              cache.put(req, response.clone())
            }
            return response
          })
          .catch(() => {
            // Red no disponible — devolver caché si existe
            return cached ?? new Response('Sin conexión — recargá cuando tengas internet.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          })

        // Si hay versión en caché, servir inmediatamente y actualizar detrás
        return cached ?? networkFetch
      })
    )
  )
})
