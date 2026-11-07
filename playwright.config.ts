import { defineConfig, devices } from '@playwright/test'

// Los e2e corren contra el BUILD (dist), no contra el servidor de desarrollo: el service worker
// solo se registra en producción y es justo lo que hay que probar. Por eso el webServer
// reconstruye antes de servir: un e2e contra un dist viejo da verde por error.
const PUERTO = 4179

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}/hijos-del-jaguar/`,
    trace: 'retain-on-failure',
    serviceWorkers: 'allow',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'tablet', use: { ...devices['Galaxy Tab S4'] } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PUERTO} --strictPort`,
    url: `http://127.0.0.1:${PUERTO}/hijos-del-jaguar/`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
