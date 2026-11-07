import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/*
  La integración continua es la red de todo lo demás: si el workflow llama a un script que se
  renombró, el CI falla (o peor, pasa sin correr nada). Este test no ejecuta el workflow —eso lo
  hace GitHub— pero comprueba que habla de scripts que existen y que corre lo que tiene que correr.
*/

const leer = (rel: string): string => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')
const ci = leer('../../../.github/workflows/ci.yml')
const pkg = JSON.parse(leer('../../../package.json')) as { scripts: Record<string, string> }

const usados = [...ci.matchAll(/npm (?:run )?([\w:-]+)/g)].map((m) => m[1]!).filter((s) => s !== 'ci')

describe('workflow de CI', () => {
  it('cada `npm run X` del workflow existe en package.json', () => {
    expect(usados.length).toBeGreaterThan(5)
    const faltan = usados.filter((s) => s !== 'test' && !pkg.scripts[s])
    expect(faltan).toEqual([])
    expect(pkg.scripts.test).toBeTruthy()
  })

  it('corre lo que el proyecto exige antes de dar algo por terminado', () => {
    for (const paso of ['lint', 'typecheck', 'test', 'build', 'presupuesto', 'e2e']) {
      expect(usados, `el CI no corre «${paso}»`).toContain(paso)
    }
  })

  it('la partida completa tiene su trabajo aparte, no en cada push', () => {
    expect(usados).toContain('e2e:largo')
    expect(ci).toMatch(/partida-completa:[\s\S]*?if: github\.event_name == 'schedule' \|\| github\.event_name == 'workflow_dispatch'/)
  })

  it('el e2e corto no incluye la partida completa, y el largo solo ella', () => {
    expect(pkg.scripts.e2e).toMatch(/--grep-invert @largo/)
    expect(pkg.scripts['e2e:largo']).toMatch(/--grep @largo/)
  })

  it('las acciones llevan versión fija (nada de @main ni @latest)', () => {
    const acciones = [...ci.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1]!)
    expect(acciones.length).toBeGreaterThan(0)
    expect(acciones.filter((a) => !/@v\d+$|@[0-9a-f]{40}$/.test(a))).toEqual([])
  })

  it('no lleva credenciales ni secretos escritos', () => {
    expect(ci).not.toMatch(/password|token\s*:|secret|api[_-]?key|ghp_|AKIA|-----BEGIN/i)
  })
})
