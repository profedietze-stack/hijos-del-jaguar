# 🐆 Hijos del Jaguar — La Gran Huida

> Juego narrativo de supervivencia histórica ambientado en la conquista española de América (1524).

**[▶ Jugar ahora](https://hijos-del-jaguar.vercel.app)** · Creado por **ProfeD.**

---

![Hijos del Jaguar — menú principal](public/images/menu-bg.jpg)

---

## Sobre el juego

Sos el **cacique** de los últimos sobrevivientes de tu aldea en las tierras altas de Guatemala, 1524. Hernán Cortés destruyó Tenochtitlán tres años antes. Ahora sus capitanes avanzan hacia el sur. Tu pueblo —cincuenta personas— espera tus decisiones.

El objetivo: **guiar a tu tribu desde Guatemala hasta la Patagonia** a través de 4 actos y más de 20 nodos en el mapa de América del Sur, tomando decisiones que afectan los recursos y la supervivencia del pueblo.

El juego mezcla **eventos históricos verificables** con dilemas de supervivencia. Los textos marcados en dorado corresponden a hechos documentados.

---

## Mecánicas

### Recursos (stats)
| Stat | Descripción |
|------|-------------|
| 🌽 **Alimentos** | Se consume cada turno. Sin comida, el pueblo muere. |
| ❤️ **Moral** | Baja con decisiones duras. A cero, la tribu se dispersa. |
| 💉 **Salud** | Las enfermedades europeas son el mayor peligro. |
| 🤝 **Unión** | La cohesión interna. Sin ella, empiezan las deserciones. |

Además gestionás **guerreros**, **chamanes** y **civiles** — cada grupo tiene un rol diferente en los eventos.

### El Conquistador
Un capitán español sigue tu ruta. Avanza turno a turno en paralelo al jugador. Si te alcanza, se desencadena un evento de captura. Las alianzas con otros pueblos son la clave para ralentizarlo.

### Alianzas
A lo largo del camino podés forjar acuerdos con pueblos del continente. Las alianzas acumuladas influyen en el final que obtenés y en los logros desbloqueables.

### Finales
Según el destino elegido, los supervivientes, las alianzas y los stats al llegar, el juego puede terminar con uno de **más de 12 finales diferentes**:

- 🌿 Amazonas (Épico / Resistencia / Desgarro / Dispersión)
- ⭐ Patagonia Argentina (Épico / Resistencia / Desgarro / Dispersión)
- 🌊 Patagonia Chilena (Épico / Resistencia / Desgarro / Dispersión)

---

## Modos de dificultad

| Modo | Descripción |
|------|-------------|
| **Educativo** | Curva moderada. Los errores cuestan y se acumulan — hay que pensar. |
| **Histórico** | La conquista fue brutal. Sin alianzas, sin recursos, no hay salida. |
| **Legendario** | Sin piedad. La historia no tuvo segunda oportunidad. |

---

## Actos y recorrido

El mapa cubre América desde Guatemala hasta la Patagonia, con más de **20 lugares visitables** y **+80 eventos narrativos únicos** (la mayoría con variantes):

| Acto | Zona | Lugares |
|------|------|---------|
| I | Centroamérica | Guatemala · El Salvador · Honduras · Costa Rica · Caribe · Darién |
| II | América del Sur (norte) | Panamá · Colombia · Venezuela · Ecuador · Perú · Amazonas |
| III | Cono Sur (norte) | Bolivia · Altiplano · Tucumán · Mendoza · Misiones |
| IV | Patagonia | Sur de Argentina y Chile — destinos finales |

---

## Logros

El juego incluye **9 logros** desbloqueables que persisten entre partidas:

| Logro | Condición |
|-------|-----------|
| El Pueblo Camina | Terminar con ≥ 20 supervivientes |
| Tejedor de Pueblos | Forjar ≥ 3 alianzas |
| Sabiduría Práctica | Llegar al final con todos los recursos > 30 |
| Caminante Curioso | Visitar ≥ 15 lugares en una partida |
| El Fuego No se Apaga | Completar Histórico con moral ≥ 40 |
| La Gran Red | Forjar ≥ 7 alianzas en Histórico |
| Contra Todo | Llegar al final en Histórico con ≥ 25 supervivientes |
| La Memoria Vive | Conservar todos los chamanes (≥ 8 al final) |
| Leyenda del Sur | Histórico con 30+ supervivientes, 4+ alianzas y final épico |

---

## Características técnicas

- **PWA** — instalable en celular (Android/iOS), funciona offline
- **Guardado automático** — la partida se guarda en cada decisión
- **Historial** — las últimas 20 partidas quedan registradas con su final y estadísticas
- **Audio generativo** — música ambiental con Tone.js (flauta, drones, percusión), efectos Web Audio API
- **Mapa SVG interactivo** con D3.js + TopoJSON y cinematográficas de apertura/acto
- **Modo Clase** — overlay pedagógico para uso en aula con fichas didácticas por evento
- **Configuración persistente** — volumen, accesibilidad, rendimiento (partículas, movimiento reducido)
- **Responsive** — funciona en móvil y escritorio

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | TypeScript + Vite |
| Mapa | D3.js + TopoJSON |
| Audio | Tone.js + Web Audio API |
| Estilos | CSS puro (custom properties, sin frameworks) |
| Tests | Vitest (motor puro) |
| Deploy | Vercel (CI/CD automático desde `main`) |

---

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000/hijos-del-jaguar/
npm run typecheck  # verificar tipos
npm run test       # tests del motor de juego
npm run build      # build de producción → dist/
```

---

## Uso educativo

Diseñado para **secundaria (12–18 años)**. Pensado para:

- Introducir la conquista española desde la perspectiva de los pueblos originarios
- Trabajar toma de decisiones con consecuencias reales (recursos, demografía, alianzas)
- Conectar eventos del juego con fuentes históricas verificables (texto dorado)
- Usar en clase con el **Modo Clase** integrado: fichas didácticas, preguntas de reflexión, contexto histórico por evento

---

## Licencia

Uso educativo libre. Contacto: profedietze@gmail.com
