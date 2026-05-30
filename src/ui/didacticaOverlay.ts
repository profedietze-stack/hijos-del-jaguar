// ══════════════════════════════════════════════════════
// OVERLAY INFO DIDÁCTICA
// Guía completa para docentes: uso en clase, contenido
// histórico, actividades, preguntas y vínculos curriculares.
// ══════════════════════════════════════════════════════

// ── Contenido de cada tab ────────────────────────────

const TABS = [
  { id: 'did-tab-clase',      label: '🎓 En clase'    },
  { id: 'did-tab-historia',   label: '📚 Historia'    },
  { id: 'did-tab-activ',      label: '🎯 Actividades' },
  { id: 'did-tab-preguntas',  label: '💬 Preguntas'   },
  { id: 'did-tab-curriculo',  label: '🔗 Currículo'   },
] as const

type TabId = typeof TABS[number]['id']

const CONTENT: Record<TabId, string> = {

  // ── Tab 1: En clase ───────────────────────────────

  'did-tab-clase': `
    <div class="did-section">
      <div class="did-sec-title">¿Qué es este juego?</div>
      <p class="did-p">
        <strong>Hijos del Jaguar</strong> es un juego narrativo de toma de decisiones históricas.
        Los jugadores lideran un grupo de 50 sobrevivientes indígenas desde Guatemala (1524) hasta
        la Patagonia, huyendo de la conquista española. Cada decisión afecta recursos, moral y
        población — y hay consecuencias reales derivadas de hechos históricos verificables.
      </p>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Duración estimada</div>
      <div class="did-grid2">
        <div class="did-card">
          <div class="did-card-icon">⏱️</div>
          <div class="did-card-name">Partida completa</div>
          <div class="did-card-desc">45 a 90 minutos según el ritmo del grupo</div>
        </div>
        <div class="did-card">
          <div class="did-card-icon">📅</div>
          <div class="did-card-name">Varias sesiones</div>
          <div class="did-card-desc">20–30 min por clase; la partida se guarda automáticamente entre sesiones</div>
        </div>
      </div>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Modos de juego</div>
      <div class="did-grid2">
        <div class="did-card">
          <div class="did-card-icon">📖</div>
          <div class="did-card-name">Educativo <span class="did-badge green">Recomendado</span></div>
          <div class="did-card-desc">
            Curva moderada. Muestra íconos de efectos en cada decisión (🌽−/+, 🔥+…).
            Ideal para primer contacto con el juego.
          </div>
        </div>
        <div class="did-card">
          <div class="did-card-icon">⚔️</div>
          <div class="did-card-name">Histórico <span class="did-badge amber">Desafiante</span></div>
          <div class="did-card-desc">
            Sin pistas. Penalidades más severas; sin alianzas en los actos finales el camino es brutal.
            Para grupos que ya completaron una partida.
          </div>
        </div>
      </div>
    </div>

    <div class="did-section">
      <div class="did-sec-title">🖥️ Modo Clase (proyector/TV)</div>
      <div class="did-highlight">
        <div class="did-hl-badge">URL ESPECIAL</div>
        <div class="did-hl-url">?modo=clase</div>
        <div class="did-hl-desc">Agregá <code>?modo=clase</code> al final de la URL para activarlo</div>
      </div>
      <ul class="did-list">
        <li>🔳 Oculta la barra de stats — el grupo ve solo la narrativa</li>
        <li>🔤 Botones más grandes, legibles desde la última fila del aula</li>
        <li>📋 <strong>Ficha didáctica histórica</strong> aparece automáticamente antes de cada decisión:
          2–3 oraciones de contexto verificable + pregunta de reflexión para debatir antes de votar</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">💡 Dinámica sugerida para clase</div>
      <ol class="did-steps">
        <li>Proyectar en pizarra digital o TV con <strong>?modo=clase</strong></li>
        <li>Leer en voz alta la narración del evento</li>
        <li>Leer la <strong>ficha histórica</strong> y debatir la pregunta de reflexión (3–5 min)</li>
        <li>Clic en "Ver decisiones →" para revelar las opciones</li>
        <li>El grupo <strong>vota por mano alzada</strong> o por escrito qué decide el cacique</li>
        <li>Discutir brevemente las consecuencias antes de continuar</li>
      </ol>
    </div>
  `,

  // ── Tab 2: Historia ──────────────────────────────

  'did-tab-historia': `
    <div class="did-section">
      <div class="did-sec-title">Acto I · Huida — Guatemala / Centroamérica (1524)</div>
      <ul class="did-list">
        <li>La conquista de Guatemala por Pedro de Alvarado (1524) y el incendio de Q'umarkaj</li>
        <li>Los <strong>tlaxcaltecas</strong> como aliados indígenas indispensables para la expansión española</li>
        <li>La <strong>viruela</strong> y las epidemias como armas involuntarias: 50–90% de mortalidad indígena</li>
        <li>Los <strong>pipiles</strong> de El Salvador y Guatemala: resistencia y sometimiento tardío (1528)</li>
        <li>Los <strong>garífunas</strong>: pueblo surgido de africanos libres y arahuacos caribeños</li>
        <li>El pueblo <strong>misquito</strong> de Honduras y Nicaragua: alianza estratégica con ingleses</li>
        <li>El <strong>Xibalbá</strong> maya-quiché: el inframundo como prueba, no como castigo</li>
        <li>Los <strong>quipus</strong> andinos y su destrucción sistemática por los españoles</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Acto II · Travesía — Colombia / Venezuela / Amazonía (1530–1550)</div>
      <ul class="did-list">
        <li><strong>Ciudad de Panamá</strong> (1519): primer puerto permanente del Pacífico, base de la conquista inca</li>
        <li>Francisco Pizarro y la conquista del <strong>Tawantinsuyu</strong> (Imperio Inca, 1532)</li>
        <li>Los <strong>muiscas</strong> de Colombia y el origen del mito de <strong>El Dorado</strong></li>
        <li>Los <strong>Guna</strong> (Kuna) del Darién: resistencia sostenida, Revolución de Tule (1925)</li>
        <li>El <strong>caballo</strong> en América: extinguido hace 10.000 años, regresado con los españoles en 1492</li>
        <li>El <strong>Qhapaq Ñan</strong> (camino inca): 40.000 km de vías pavimentadas, destruido por los españoles</li>
        <li>Los <strong>yanomami</strong> de la Guayana venezolana-brasileña: aislamiento voluntario y crisis contemporánea</li>
        <li>La Amazonía como <strong>jardín milenario</strong>: la "selva virgen" como obra humana de miles de años</li>
        <li>Pueblos en <strong>aislamiento voluntario</strong>: entre 50 y 100 grupos actuales en Brasil y Perú</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Acto III · El Sur — Bolivia / Argentina (1540–1600)</div>
      <ul class="did-list">
        <li>El <strong>lago Titicaca</strong> (3.812 msnm) y los <strong>Urus</strong> en sus islas flotantes de totora</li>
        <li>Los <strong>Llanos de Mojos</strong> (Bolivia): ingeniería hidráulica de 2.000 años y 100.000 km²</li>
        <li>Las <strong>misiones jesuitas</strong> (1609–1767): protección y transformación cultural guaraní</li>
        <li>Los <strong>huarpes</strong> de Mendoza: destrucción lenta por encomiendas y enfermedades</li>
        <li>Los <strong>ranqueles</strong> pampeanos y la <strong>Conquista del Desierto argentina</strong> (1879)</li>
        <li>Los <strong>mapuches</strong>: 300 años de resistencia efectiva — Tratado de Quilín (1641)</li>
        <li>La <strong>Cueva de las Manos</strong> (Patagonia): pinturas rupestres de 9.000 años</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Acto IV · El Destino — Patagonia / Amazonía</div>
      <ul class="did-list">
        <li><strong>Destino Amazonas</strong>: cientos de etnias fuera del alcance colonial durante siglos</li>
        <li><strong>Patagonia argentina</strong>: los <strong>tehuelches</strong> (Aonikenk), cazadores del guanaco; libres hasta 1879</li>
        <li><strong>Patagonia chilena</strong>: los <strong>kawésqar</strong>, navegantes nómades de los canales; no colonizados efectivamente hasta el siglo XX</li>
      </ul>
    </div>
  `,

  // ── Tab 3: Actividades ────────────────────────────

  'did-tab-activ': `
    <div class="did-section">
      <div class="did-sec-title">Antes del juego — preparación</div>
      <ul class="did-list">
        <li><strong>Mapa anticipatorio:</strong> Mostrar un mapa del continente y pedir al grupo que trace una ruta posible desde Guatemala hasta la Patagonia. ¿Qué obstáculos imaginan?</li>
        <li><strong>Lectura inicial:</strong> Texto breve sobre la conquista de Guatemala (1524). Identificar quiénes son los actores y qué perdió cada parte.</li>
        <li><strong>Debate de arranque:</strong> <em>"¿Cuándo tiene sentido huir en lugar de resistir? ¿Cuándo resistir en lugar de negociar?"</em></li>
        <li><strong>Personaje:</strong> Cada estudiante elige un nombre para su cacique/cacica antes de comenzar.</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Durante el juego — en tiempo real</div>
      <ul class="did-list">
        <li><strong>Diario del cacique:</strong> Cada estudiante escribe una entrada breve en primera persona después de cada decisión grupal. ¿Qué pensó antes de decidir? ¿Cómo se siente con las consecuencias?</li>
        <li><strong>Mapa del viaje:</strong> Marcar en un mapa físico o digital los lugares por los que pasa el grupo y qué ocurrió en cada uno.</li>
        <li><strong>Registro de decisiones:</strong> En el pizarrón: qué decidió el grupo, cuántos votaron cada opción, qué pasó. Comparar al final con otros grupos o rondas.</li>
        <li><strong>Rol del cronista:</strong> Un estudiante por turno toma el rol de "cronista" y resume el evento en 2 oraciones para el diario colectivo del aula.</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Después del juego — profundización</div>
      <ul class="did-list">
        <li><strong>Comparar con fuentes:</strong> Buscar una fuente histórica primaria o secundaria sobre un evento del juego (ej. la conquista de Guatemala, las misiones jesuitas). ¿Qué coincide? ¿Qué falta?</li>
        <li><strong>Cambio de perspectiva:</strong> Reescribir una escena del juego desde el punto de vista de un conquistador, de un aliado local o de un niño del grupo.</li>
        <li><strong>Investiga uno:</strong> Cada estudiante elige un pueblo mencionado (pipiles, cunas, mapuches, garífunas, kawésqar…) y presenta en 3 minutos qué pasó con ese pueblo después del período del juego.</li>
        <li><strong>Carta al futuro:</strong> El cacique/cacica escribe una carta a sus bisnietos contando el viaje: qué perdieron, qué aprendieron, qué preservaron.</li>
        <li><strong>Debate final:</strong> <em>"¿Tomaron las decisiones correctas? ¿Existe una decisión 'correcta' en este contexto?"</em></li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Para varias sesiones</div>
      <ul class="did-list">
        <li>Jugar la misma partida con <strong>dos decisiones distintas</strong> en el mismo evento clave y comparar cómo cambia el resultado final.</li>
        <li>Dividir en <strong>equipos</strong>: cada equipo lleva su propio libro de bitácora de decisiones y argumentos. Al final, comparan estrategias y resultados.</li>
        <li>Modo <strong>solo histórico</strong>: jugar primero en Educativo, luego en Histórico. ¿Qué cambió? ¿Por qué el mismo camino fue más difícil?</li>
      </ul>
    </div>
  `,

  // ── Tab 4: Preguntas ──────────────────────────────

  'did-tab-preguntas': `
    <div class="did-section">
      <div class="did-sec-title">Sobre la conquista de América</div>
      <ul class="did-list">
        <li>¿Por qué fue posible para un pequeño ejército español conquistar imperios de millones de personas? ¿Qué factores explican eso?</li>
        <li>¿Qué papel jugaron las enfermedades en la conquista? Si la viruela no fue intencional en la mayoría de los casos, ¿puede existir responsabilidad histórica sin intención?</li>
        <li>¿Qué significa que los conquistadores necesitaran aliados indígenas para conquistar a otros indígenas? ¿Cómo cambia eso nuestra imagen de la conquista como "invasión externa"?</li>
        <li>La Conquista del Desierto argentina ocurrió en 1879, casi 400 años después de Colón. ¿Cuándo termina una conquista?</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Sobre las decisiones del juego</div>
      <ul class="did-list">
        <li>¿Huir es rendirse o es resistir? ¿Cuándo es cada cosa?</li>
        <li>En el juego, las alianzas son cruciales para sobrevivir. ¿Con quién resultó difícil aliarse? ¿Por qué?</li>
        <li>¿Cuándo tiene sentido adoptar las herramientas del enemigo (caballos, mapas, lengua)? ¿Eso es adaptación o asimilación?</li>
        <li>¿Qué diferencia a una alianza genuina de una relación de dependencia o sumisión?</li>
        <li>La violencia puede parecer efectiva en el corto plazo pero atraer represalias mayores. ¿Cómo evaluarías el costo de una acción violenta considerando sus consecuencias futuras?</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Sobre identidad y cultura</div>
      <ul class="did-list">
        <li>¿Cuándo una cultura "cambia" y cuándo "desaparece"? ¿Dónde está la línea?</li>
        <li>Los garífunas surgieron de una mezcla cultural forzada. ¿Puede algo creado por el trauma convertirse también en una fortaleza? ¿Podés pensar en otros ejemplos?</li>
        <li>¿Tienen los pueblos derecho al aislamiento voluntario del mundo moderno? ¿Quién tiene la responsabilidad de proteger a quienes no pidieron esa protección?</li>
        <li>¿Qué se pierde cuando se destruye un sistema de escritura o de registro? ¿Puede recuperarse ese conocimiento?</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Conexiones con el presente</div>
      <ul class="did-list">
        <li>¿Qué tiene en común la situación del juego con las migraciones forzadas que ocurren hoy en el mundo?</li>
        <li>Los mapuches de Argentina y Chile siguen existiendo como pueblo después de 500 años de presión colonial. ¿Qué hace que un pueblo sobreviva durante tanto tiempo?</li>
        <li>¿Quiénes son los "dueños" de un ecosistema como la Amazonía, construido por pueblos durante miles de años?</li>
        <li>Los yanomami enfrentan hoy la contaminación de sus ríos por minería ilegal. ¿En qué se parece esa situación a la del juego?</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">Sobre el juego como herramienta</div>
      <ul class="did-list">
        <li>¿Qué decisión del juego fue la más difícil? ¿Por qué?</li>
        <li>¿El juego te cambió la manera de pensar sobre algún tema histórico? ¿Cuál?</li>
        <li>¿Qué cambiarías del juego para que refleje mejor la historia real? ¿Qué aspectos no puede capturar ningún juego?</li>
        <li>¿Qué diferencia hay entre aprender historia a través de un juego y aprenderla a través de un texto? ¿Qué gana y qué pierde cada formato?</li>
      </ul>
    </div>
  `,

  // ── Tab 5: Currículo ──────────────────────────────

  'did-tab-curriculo': `
    <div class="did-section">
      <div class="did-sec-title">📘 Historia y Ciencias Sociales</div>
      <ul class="did-list">
        <li>Conquista y colonización de América (siglos XV–XVII)</li>
        <li>Civilizaciones precolombinas: mayas, incas, pueblos centroamericanos y sudamericanos</li>
        <li>Resistencia indígena: modalidades, actores, resultados</li>
        <li>Sistemas de alianzas y conflictos interétnicos precoloniales</li>
        <li>Colonialismo tardío: Argentina y el Cono Sur en el siglo XIX</li>
        <li>Historia de los pueblos originarios de Argentina y Latinoamérica</li>
        <li>Derechos de los pueblos indígenas — Declaración de la ONU (2007)</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">🌎 Geografía</div>
      <ul class="did-list">
        <li>Ecosistemas de América Central y del Sur: selvas tropicales, Andes, llanos, pampas, canales patagónicos</li>
        <li>Migraciones forzadas: causas, rutas históricas y contemporáneas</li>
        <li>Geografía humana: cómo el territorio condiciona estrategias de supervivencia</li>
        <li>Biodiversidad y territorios indígenas: la Amazonía como caso de estudio</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">📝 Lengua y Literatura</div>
      <ul class="did-list">
        <li>Narrativa histórica y ficción histórica: diferencias y fronteras</li>
        <li>Perspectiva narrativa: ¿desde dónde se cuenta la historia oficial de la conquista?</li>
        <li>Análisis de crónicas coloniales vs. fuentes indígenas contemporáneas</li>
        <li>Escritura creativa: diario íntimo, carta, reescritura desde otra perspectiva</li>
        <li>Argumentación oral y escrita: defender una decisión con evidencia histórica</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">🧭 Ética y Filosofía</div>
      <ul class="did-list">
        <li>Toma de decisiones en condiciones de incertidumbre y presión extrema</li>
        <li>Responsabilidad moral: individual vs. colectiva; intención vs. consecuencia</li>
        <li>Colonialismo como problema ético: ¿cómo se evalúa el pasado desde el presente?</li>
        <li>El problema del fin que justifica los medios: ¿cuándo la violencia es defendible?</li>
        <li>Derechos humanos: territorio, identidad cultural, autodeterminación</li>
      </ul>
    </div>

    <div class="did-section">
      <div class="did-sec-title">🏛️ Formación Ciudadana</div>
      <ul class="did-list">
        <li>Memoria histórica y su importancia para las democracias contemporáneas</li>
        <li>Diversidad cultural como valor — pluralismo e interculturalidad</li>
        <li>Reconocimiento de derechos de pueblos originarios en la legislación argentina y latinoamericana</li>
        <li>Migraciones forzadas y derecho de asilo: dimensión contemporánea</li>
      </ul>
    </div>

    <div class="did-foot-note">
      Los textos subrayados en dorado dentro del juego tienen datos históricos verificables.
      Hacé clic sobre ellos para leer la fuente.
      Los marcados con 🌀 abren glosarios de términos históricos.
    </div>
  `,
}

// ── Abrir overlay ────────────────────────────────────

let _initialized = false

export function openDidacticaOverlay(): void {
  const overlay = document.getElementById('didactica-overlay')
  if (!overlay) return

  if (!_initialized) _buildContent()
  overlay.classList.add('open')
  // Activar primer tab
  _activateTab('did-tab-clase')
}

// ── Construir el contenido (una sola vez) ────────────

function _buildContent(): void {
  _initialized = true

  // Tabs
  const tabBar = document.getElementById('did-tabs')
  if (tabBar) {
    tabBar.innerHTML = TABS.map(t =>
      `<button class="ped-tab${t.id === 'did-tab-clase' ? ' active' : ''}"
        data-did-tab="${t.id}">${t.label}</button>`
    ).join('')

    tabBar.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-did-tab]') as HTMLElement | null
      if (!btn) return
      _activateTab(btn.dataset.didTab as TabId)
    })
  }

  // Contenido del primer tab por defecto
  const content = document.getElementById('did-content')
  if (content) content.innerHTML = CONTENT['did-tab-clase']
}

function _activateTab(tabId: TabId): void {
  const tabBar = document.getElementById('did-tabs')
  const content = document.getElementById('did-content')
  if (!tabBar || !content) return

  tabBar.querySelectorAll<HTMLElement>('[data-did-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.didTab === tabId)
  })

  content.innerHTML = CONTENT[tabId] ?? ''
  // Scroll al tope del contenido al cambiar tab
  const body = document.getElementById('did-body')
  if (body) body.scrollTop = 0
}
