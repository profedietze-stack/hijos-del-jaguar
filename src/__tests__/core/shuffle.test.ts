import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { shuffle } from '../../core/shuffle'

describe('shuffle (Fisher-Yates)', () => {
  it('no muta la entrada y conserva los elementos', () => {
    const a = [1, 2, 3, 4]
    const b = shuffle(a)
    expect(a).toEqual([1, 2, 3, 4])
    expect([...b].sort()).toEqual([1, 2, 3, 4])
  })
  it('reparte parejo: cada elemento cae en cada posición ~1/3', () => {
    const N = 30000
    const cnt = [0, 0, 0]
    for (let i = 0; i < N; i++) cnt[shuffle(['a', 'b', 'c']).indexOf('a')]!++
    for (const c of cnt) expect(c / N).toBeGreaterThan(0.31)
    for (const c of cnt) expect(c / N).toBeLessThan(0.36)
  })
})

describe('las decisiones se muestran barajadas', () => {
  it('EventScreen baraja ev.decisions antes de dibujar los botones', () => {
    const src = readFileSync(fileURLToPath(new URL('../../screens/EventScreen.ts', import.meta.url)), 'utf8')
    expect(src).toMatch(/shuffle\(ev\.decisions\)\.forEach/)
    expect(src).not.toMatch(/\n\s*ev\.decisions\.forEach/)
  })
})
