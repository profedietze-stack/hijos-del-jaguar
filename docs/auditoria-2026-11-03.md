# Auditoría de Hijos del Jaguar — 2026-11-03

Rama: `qa/auditoria-completa` (sin push). Base: `1c4d1ef`.

## 1. Resumen ejecutivo

**Veredicto: no listo para el aula tal como estaba; con los arreglos de esta rama, listo para Modo Educativo.** Histórico y Legendario siguen prácticamente imposibles de ganar (ver §4) y eso es una decisión de diseño que queda pendiente.

Cinco hallazgos más importantes:

1. **Bloqueante (corregido):** «Continuar» reabría el último evento ya jugado, en bucle, y tras F5 el mapa quedaba vacío. `currentNode` nunca se limpiaba.
2. **Alta, seguridad (corregida):** el nombre del cacique entraba sin escapar a `innerHTML` en 5 lugares.
3. **Alta (corregida):** sin guardia de entrada, un doble clic montaba el evento dos veces (partidas duplicadas en el historial); un clic durante la cinemática revertía la partida.
4. **Alta (corregida):** el service worker servía el HTML cache-first con nombre de caché fijo: ningún arreglo llegaba a quien ya había abierto el juego. Además la pantalla de Créditos (atribuciones CC BY-SA) no se podía abrir.
5. **Alta, balance (pendiente):** Histórico gana 0–3 % y Legendario 0 % con cualquier política simulada; en Educativo «siempre la primera opción» gana 74 % contra 45 % al azar.

| Área | Semáforo | Nota |
|---|---|---|
| Jugabilidad | 🟡 | Bloqueantes corregidos; falta bloqueo de entrada en más pantallas |
| Balance | 🔴 | Histórico/Legendario inalcanzables; sesgo a la primera opción |
| Contenido | 🟡 | Hechos a revisar con fuente; anacronismos; alianzas duplicadas |
| UI/UX | 🟡 | Mute fuera de pantalla ≤ 812 px, mapa ilegible a 360 px |
| Rendimiento | ⚪ | **No medido** (ver §9) |
| Robustez | 🟢 | Guardado campo por campo, SW red-primero, offline verificado |
| Accesibilidad | 🟡 | Contraste y aria-labels pendientes, reduced-motion parcial |
| Código | 🟢 | tsc y build limpios, 182 tests; sin lint configurado |

## 2. Metodología

- **Estático:** lectura de código, `scripts/analisis-contenido.ts`, tests de grafo y contenido.
- **Simulación:** `scripts/simular.ts` juega el motor real (`applyDecision`, `advanceConquistador`, evento de captura) con 4 políticas × 9 rutas × 3 dificultades. 250 partidas por celda (25 para «óptima»): unas 24 000 partidas por corrida base.
- **Navegador:** un agente Opus jugó con Chromium real (chrome-devtools): 61 nodos y 67 aristas verificados, 4 finales distintos jugando de verdad (sin usar el seed de debug), 3 capturas del conquistador, offline con el servidor caído. Yo verifiqué después los arreglos en Chromium real (ver §3).
- **Repetición tras los arreglos (HEAD):** partida nueva desde guardado limpio en Chromium real, automatizada, Educativo, 72 pasos (nodos y decisiones) hasta FINAL TRÁGICO en Mendoza: una sola entrada en el historial, el guardado se borró, ningún banner de error del juego. Consola: solo avisos de AudioContext, Tone.js y `requestFullscreen` sin gesto (F3-21, sin corregir). Las cinemáticas de marcadores históricos y el tutorial piden clic: el arnés los cerró.
- **Limitación honesta:** mientras el agente probaba yo editaba y reconstruía; sus resultados indican sobre qué versión vio cada hallazgo.

## 3. Bugs

| ID | Sev. | Qué pasa | Estado |
|---|---|---|---|
| F3-01 | Bloqueante | Continuar reabre el evento ya jugado; tras F5 mapa vacío | **Corregido `c962496`**, verificado en Chromium: F5 + Continuar → mapa con 3 nodos siguientes |
| F3-02 | Alta | Clic durante la cinemática: estado revertido + TypeError | **Corregido `59346a1`**, verificado: el clic se ignora |
| F3-03 | Alta | Doble clic: evento montado 2 veces, historial duplicado, partida zombi | **Corregido `59346a1`**, verificado: triple clic = 1 evento; decidir dos veces aplica una |
| F3-04 | Alta (seg.) | XSS del nombre en narración, tooltip, final, historial; `$&`/`$$` | **Corregido `fe11de1`**, verificado por el agente |
| F3-05 | Alta | SW cache-first para HTML, `jaguar-v4` fijo; en dev cacheaba src | **Corregido `5ca5638`**, verificado: `jaguar-v5`, offline OK con servidor caído (curl 000) |
| F3-06 | Alta | No existe `#btn-credits` | **Corregido `6abf1d6`** (verificación visual pendiente) |
| F3-07 | Alta | Guardado con tipos cambiados / historial / logros corruptos | **Corregido `8dee8e9`**, 12 tests en rojo con el código viejo; no re-probado en navegador |
| F3-08 | Media | 🪟🪨🦬 (Emoji 13) vacíos en Windows 10 | **Corregido `38e8c3f`** |
| F3-09 | Alta | `#btn-mute` fuera de pantalla a 360, 768 y 812 px | **Corregido** (commit de UI móvil); verificado a 360×640 (mute 306–350, 44×44) y 812×375; 768×1024 no re-medido |
| F3-10 | Media | Mapa a 360 px | **Parcial:** cabecera en una fila de 62 px y leyenda compacta (111×86). Las etiquetas de nodos siguen apiladas con el zoom 3,2 de la cinemática: pendiente |
| F3-11/12 | Media | «Educativo» cortado; narración de 1 línea apaisado | **Corregido**, verificado a 360×640 (botones en columna) y 812×375 (columna derecha desplazable) |
| F3-13 | Media | Objetivos táctiles < 44 px | **Corregido** para mute, 📚, Menú, chips, continuar y cerrar (medido 44 px a 360); la dificultad quedó en 44 px por CSS, no re-medida |
| F3-14 | Media | reduced-motion no frena D3, SMIL ni brasas | Pendiente |
| F3-15 | Media | Contraste y aria-labels | **Parcial:** aria-labels, `aria-pressed` del mute y opacidad de Menú/📚 corregidos; contraste de las pistas de efecto y del pie de imagen pendiente |
| F3-16 | Media | El aviso de consecuencias se cierra solo a los 3,2 s | Pendiente |
| F3-17 | Media | Offline: imágenes de eventos no vistos rotas | Pendiente |
| F3-18..27 | Baja | Escape en modales, mute no persiste, warnings de AudioContext, «v3.0» vs 0.2.0, tuteo/voseo mezclados, etc. | Pendiente (detalle en el informe del agente) |
| — | Media | `drawTribePath` tiraba TypeError con GameState armado a mano | **Corregido `6f46f02`** (el test cubre el helper nuevo, no la versión vieja) |
| — | Media | `initErrorBanner()` está dentro de `DOMContentLoaded`, no en la primera línea del módulo | Pendiente |
| — | Baja | Doble `requestAnimationFrame` en `startNewGame`: en pestaña en segundo plano el mapa no se construye hasta volver | Pendiente (propuesta: `setTimeout` de respaldo) |

## 4. Simulación (motor real)

Victoria % (llegar a un final sin derrota). Total sobre 9 rutas.

| Dificultad | azar | siempre 1.ª | codiciosa | óptima aprox.* |
|---|---|---|---|---|
| Educativo | 45 % | 74 % | 89 % | 72 % |
| Histórico | 0 % | 0 % | 3 % | 3 % |
| Legendario | 0 % | 0 % | 0 % | 0 % |

\* «Óptima aproximada» = una decisión mirando 6 partidas al azar hasta el final. Es débil: los números de Histórico y Legendario son una cota inferior, **no** una prueba de imposibilidad.

- **Dónde se muere:** la mayoría de las derrotas ocurren en el evento de captura `_conq_catch` (≈ 4 700 en Legendario, 4 300 en Histórico, 1 400 en Educativo). Cada captura cuesta unos 11–12 supervivientes sobre 50.
- **Economía:** alimentos ≈ 0 hacia el turno 7 en las tres dificultades (decay −6/−9/−12 por turno contra aportes menores). Salud también cae a < 10 hacia la mitad del recorrido.
- **Rangos:** 0 anomalías (sin NaN, negativos ni valores sobre el tope) en las partidas simuladas.
- **Finales nunca alcanzados:** los 3 DESGARRO (`m ≥ 15 && moral < 35`) no aparecieron en ninguna partida, ni con una política que minimiza la moral (450 partidas × 3 dificultades). Los eventos finales suman +25 a +40 de moral en toda opción. No es una prueba formal.
- **Duración esperada en minutos:** no medida. Cada partida son 28 eventos; sin telemetría de lectura no doy un número.

## 5. Contenido

**Decisiones (118 eventos en pool):**

- La mejor opción según la fórmula del propio juego es la **primera en el 78 %** de los eventos (peor: 10 %). Azar esperado: 33–50 %.
- **31 eventos** tienen una opción que gana en todos los indicadores; **72** tienen al menos una opción dominada; 120 pares dominados. Lista: `scripts/analisis-contenido.ts`. Hoy lo fija un tope (ratchet) en `contenido.test.ts`.
- **Alianzas duplicadas:** `tehuelches` (5 claves), `kawesqar` (4), `ranquel`/`ranqueles`. Cada clave cuenta como una alianza distinta para el final épico y los logros: hay 45 claves y una ruta ofrece hasta 22 oportunidades.

**A revisar (no cambiado a ciegas):**

| Dónde | Dice | Revisar | Fuente |
|---|---|---|---|
| Nodo `n_banados` | «los chiquitanos que nunca se rindieron» | El Izozog es territorio izoceño-guaraní | [Ramsar 1087](https://rsis.ramsar.org/ris/1087) |
| Nodo `n_tepui` | «mil millones de años» | 1 700–2 000 millones | [Meteored](https://www.meteored.com.ar/noticias/ciencia/brasil-alberga-una-de-las-formaciones-geologicas-mas-antiguas-de-la-tierra-monte-roraima.html) |
| Nodo `n07c` Misiones | «misiones jesuitas guaraníes» en 1524 | Primera reducción: 1609 | [Wikipedia](https://www.Wikipedia.org/wiki/Jesuit_Reduction) |
| Varios | Tucumán, Mendoza, Córdoba, Pampas con caballo | Fundaciones de 1560–1573 y caballo en la pampa posteriores a 1524: anacronismo si el juego pretende rigor | **No verifiqué las fechas de fundación** |
| Tooltip mapuches | «único pueblo que derrotó militarmente a España» | Afirmación fuerte y discutida | sin fuente verificada |
| Cifras de población | 50 M → 5 M (tooltip); 60 M → 6 M (main.ts) | Unificar y citar | — |

Ortografía: sin corrector automático disponible; no se revisó sistemáticamente. Voseo/tuteo: README y menú voseando («Sos», «Podés»), eventos y cinemática en tuteo («Eres», «Huye»).

## 6. Rendimiento

**No medido** (ver §9). Observaciones de código: `drawNodes` redibuja todo; la cinemática de apertura no es cancelable; hay doble rAF en el arranque. Bundle inicial: JS 193 KB (62 KB gzip) + d3 80 KB + tone 262 KB; `events` (173 KB) y `claseData` se cargan diferidos.

## 7. Deuda técnica y riesgos

- No hay lint ni tests de pantallas (DOM); `MapScreen.ts` tiene 1 750 líneas.
- Los timeouts de la cinemática no se cancelan al salir al menú.
- `EDGES` y `next[]` son dos listas a mano (hoy un test las compara).
- `_busy` en `main.ts` es un flag manual: una animación que no llame a su callback lo dejaría bloqueado.
- El nombre del cacique no se valida al cargar más allá de recortarlo a 24 caracteres (se escapa al mostrar).

## 8. Mejoras sugeridas (impacto / esfuerzo)

| Prioridad | Mejora |
|---|---|
| Alto / bajo | Fijar CSS del HUD (mute visible ≤ 812 px), `aria-label` y objetivos ≥ 44 px |
| Alto / medio | Rebalancear Histórico/Legendario: costo de la captura, decay de alimentos; barajar el orden de las opciones al mostrarlas (hoy la 1.ª es la mejor 78 %) |
| Alto / medio | Unificar claves de alianza por pueblo |
| Medio / bajo | Botón «saltar cinemática»; guardar al empezar (hoy cerrar durante la cinemática pierde la partida) |
| Medio / medio | Informe para el docente (supervivientes, alianzas, decisiones) exportable |
| Medio / medio | Precachear imágenes de eventos para el modo offline completo |
| Medio / medio | Visitado con ✓ y no solo color (daltonismo); reduced-motion real en D3 |
| Bajo / alto | Revisión histórica del contenido por un docente de Historia |

## 9. Qué NO se pudo verificar

- **Rendimiento (Fase 4):** no medí FPS, heap, fugas de listeners ni Lighthouse. Quedó sin hacer.
- **Pestaña en segundo plano, redimensionar en vivo, botón atrás, touch real:** el agente no pudo probarlos con sus herramientas.
- **Ruta atlántica completa:** el agente la jugó hasta n04c (murió en Histórico); no la terminó.
- **Playwright:** no disponible desde este entorno; usé chrome-devtools (Chromium real).
- **Browser pane de la app:** no dispara `requestAnimationFrame`, el mapa no se construye (se queda en «Cargando mapa…»); por eso verifiqué en Chromium real.
- **Guardados hostiles en navegador** tras el arreglo `8dee8e9`: probados con tests unitarios, no re-probados a mano.
- **Créditos:** el botón existe y está cableado; no lo abrí visualmente.
- **Política «óptima»:** débil (ver §4).

## 10. Commits y cómo revertirlos

Todos en `qa/auditoria-completa`. Revertir uno: `git revert <hash>`.

| Hash | Cambio |
|---|---|
| `361c838` | launch.json: puerto 3002, strictPort, sin abrir navegador |
| `e74166b` | scripts/simular.ts y scripts/analisis-contenido.ts |
| `fe11de1` | escape del nombre (core/text.ts) |
| `8dee8e9` | guardado campo por campo |
| `38e8c3f` | tres íconos Emoji 13 |
| `6f46f02` | drawTribePath tolerante (core/trail.ts) |
| `a33409e` | test de integridad de decisiones + ratchet |
| `c962496` | currentNode se limpia (Continuar) |
| `59346a1` | bloqueo de entrada `_busy` |
| `6abf1d6` | botón de Créditos |
| `5ca5638` | SW: HTML red primero, `jaguar-v5`, sin SW en dev |
