# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (localhost:3000/hijos-del-jaguar/ by default)
npm run build        # tsc + vite build → dist/
npm run typecheck    # tsc --noEmit (no emit, just check)
npm run test         # vitest run (single pass)
npm run test:watch   # vitest watch
npm run test:coverage
```

Run single test file:
```bash
npx vitest run src/__tests__/core/GameEngine.test.ts
```

TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`). Always run `typecheck` before committing.

## Architecture

### Data flow (one-way)

```
src/data/        →  src/core/        →  src/screens/ + src/ui/
(static defs)       (pure engine)       (DOM / side-effects)
```

**`src/data/`** — pure static definitions, no logic:
- `types.ts` — all shared interfaces (`GameState`, `Stats`, `NodeDef`, `Decision`, etc.)
- `nodes.ts` — map node definitions + `CONQ_BRIDGE` (conquistador route)
- `events.ts` + `claseData.ts` — lazy-loaded by `EventScreen.preloadEventData()`
- `difficultyConfig.ts`, `endings.ts`, `achievements.ts` — config tables

**`src/core/`** — pure functions, zero DOM/audio/storage side-effects:
- `GameState.ts` — `GameState` interface + `cloneState`, `totalM`, `unlockChildren`
- `GameEngine.ts` — `applyDecision()`, `advanceConquistador()`, `selectNode()`, `evaluateAchievements()` — all return new state objects
- `StatSystem.ts` — `resolveTurn()`, `isDefeated()` — applies decay + death rolls
- `SaveSystem.ts` — `saveGame/loadGame/clearAllProgress` (key: `jaguar_save`), history (`jaguar_history`), achievements (`jaguar_logros`)
- `SettingsSystem.ts` — `initSettings/applySettings` (key: `jaguar_settings`); persists across save resets

**`src/screens/`** — one file per screen, mount functions return void, wire their own DOM:
- `MapScreen.ts` is the largest file (~1700 lines). Contains D3 SVG map, `waitForMapThenCinematic()`, conquistador animation, historical markers.
- `EventScreen.ts` lazy-imports `events.ts` + `claseData.ts` via `preloadEventData()`

**`src/ui/`** — cross-screen UI utilities:
- `dom.ts` — `showScreen()`, `showTutorial()`, `showConfirmModal()`, `initGlobalListeners()`
- `audio.ts` — Tone.js music (`playTrack('menu'|'game')`) + raw Web Audio SFX. Only 3 `MembraneSynth` instances persist; all SFX use auto-GC `OscillatorNode`. Volume controlled via `setMusicVolume/setSfxVolume/setMuted`.
- `SettingsModal.ts` — modal open/close, wires all `#cfg-*` controls to `SettingsSystem`

**`src/fx/`** — visual effects:
- `MenuEmbers.ts` — canvas 2D fire particle system for menu. Call `startMenuEmbers(containerId)` / `stopMenuEmbers()`.

**`src/main.ts`** — single orchestrator. Imports everything, wires all button IDs via `on(id, handler)`, manages the single mutable `gs: GameState`. No other file should hold game state.

### Key constraints

- `GameEngine` functions are pure — never call them expecting side effects. `main.ts` reads their return value and calls UI/audio/save separately.
- `events.ts` and `claseData.ts` are **not** imported at startup — only via `preloadEventData()` to keep the initial bundle small.
- `base` in `vite.config.ts` is `'/'` on Vercel (`process.env.VERCEL`) and `'/hijos-del-jaguar/'` locally.
- All imports use `.js` extension (ESM bundler mode, `allowImportingTsExtensions`).
- CSS encoding: use Python binary writes or the Write tool for files with emojis — never PowerShell `Set-Content`.

### localStorage keys

| Key | Content |
|---|---|
| `jaguar_save` | active game (JSON) |
| `jaguar_history` | `FinishedGame[]` (max 20) |
| `jaguar_logros` | achievement IDs `string[]` |
| `jaguar_settings` | `AppSettings` (survives save reset) |
| `hdj-tutorial-v1` | tutorial seen flag |

### Tests

Tests cover only `src/core/` (pure engine). Located in `src/__tests__/core/`. DOM-dependent code (`screens/`, `ui/`) has no tests.
