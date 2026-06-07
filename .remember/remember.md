# Handoff

## State
Canvas 2D fire ember system fully implemented and TypeScript-clean. Fixed loading spinner bug (CSS specificity). Menu visuals overhauled with stronger gradients, faster drift, solid buttons.

## Next
1. User hasn't confirmed the ember visuals yet — they should visit http://localhost:3000/hijos-del-jaguar/ and give feedback on the fire effect.
2. If adjustments needed: tune `EMBER_COUNT`, `GLOW_ALPHA`, `vy` speed, or hue range in `src/fx/MenuEmbers.ts`.

## Context
- `src/fx/MenuEmbers.ts` — new module, 55 canvas 2D embers with radial gradient cores + halos, pulsing base glow
- `src/styles/base.css` — added `[hidden] { display: none !important }` to fix loading overlay bug
- `src/screens/MenuScreen.ts` — calls `startMenuEmbers('menu-particles')` on mount
- `index.html` — `<div id="menu-particles"></div>` added inside `#menu-screen`
- Vite dev server: `http://localhost:3000/hijos-del-jaguar/` (may need restart)
