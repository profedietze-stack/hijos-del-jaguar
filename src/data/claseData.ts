// ══════════════════════════════════════════════════════
// CLASE DATA — Contenido pedagógico para Modo Clase
// Mapeado por eventId → { contexto, pregunta }
// Si un evento no tiene entrada aquí, la ficha se omite.
// ══════════════════════════════════════════════════════

export interface ClaseInfo {
  contexto: string   // 2-3 frases de contexto histórico verificable
  pregunta: string   // pregunta abierta para debate en clase
}

export const CLASE_DATA: Record<string, ClaseInfo> = {

  // ── ACTO I ───────────────────────────────────────────

  e_inicio: {
    contexto:
      'La conquista de Guatemala comenzó en 1524 bajo Pedro de Alvarado, capitán de Hernán Cortés. ' +
      'En menos de tres años los principales reinos mayas-quichés fueron derrotados militarmente. ' +
      'La capital quiché, Q\'umarkaj (Utatlán), fue incendiada en 1524 con sus gobernantes adentro. ' +
      'Los sobrevivientes que huyeron hacia el sur son una realidad histórica documentada en crónicas de la época.',
    pregunta:
      '¿Por qué un grupo de sobrevivientes elegiría huir en lugar de rendirse o resistir? ' +
      '¿En qué casos <em>huir</em> puede ser una forma activa de resistencia cultural?',
  },

  e_selva: {
    contexto:
      'Los tlaxcaltecas se aliaron con Hernán Cortés en 1519 como enemigos del Imperio Azteca y acompañaron las expediciones hacia Centroamérica. ' +
      'Sus conocimientos del territorio los hacían rastreadores temibles. ' +
      'Sin aliados indígenas, la conquista de América habría sido prácticamente imposible para un puñado de soldados europeos.',
    pregunta:
      '¿Por qué algunos pueblos indígenas eligieron aliarse con los conquistadores contra otros pueblos? ' +
      '¿Qué nos dice esto sobre las relaciones políticas y rivalidades que ya existían <em>antes</em> de la llegada de los europeos?',
  },

  e_rio: {
    contexto:
      'En la cosmología maya-quiché, el Xibalbá era el mundo subterráneo de los Señores de la Muerte, pero no equivalía al infierno cristiano: era un lugar de pruebas y transformación. ' +
      'Los héroes gemelos del Popol Vuh lo cruzaron y regresaron convertidos en el Sol y la Luna. ' +
      'El ritual funerario maya reconocía la muerte como parte de un ciclo, no como un final.',
    pregunta:
      '¿Por qué importa la manera en que una comunidad interpreta sus pérdidas? ' +
      '¿Qué papel cumplen los rituales y los relatos en mantener la cohesión de un grupo durante una crisis extrema?',
  },

  e_alianza: {
    contexto:
      'Los pipiles eran un pueblo de origen nahua establecido en El Salvador y Guatemala que resistió la invasión española durante años, siendo de los últimos en ser sometidos en Centroamérica en 1528. ' +
      'Su lengua, el náhuat, estaba emparentada con el náhuatl y permitía comunicación parcial con otros pueblos mesoamericanos. ' +
      'Habían migrado desde México siglos antes de la conquista y conocían bien el territorio centroamericano.',
    pregunta:
      'La oferta del líder pipil es de intercambio igualitario: ayuda a cambio de conocimiento. ' +
      '¿En qué se diferencia esta propuesta de la relación entre conquistadores y pueblos sometidos? ' +
      '¿Qué condiciones hacen posible una alianza <em>genuina</em> entre comunidades?',
  },

  e_fiebre: {
    contexto:
      'Las enfermedades europeas —viruela, sarampión, tifus— llegaron a América antes que la mayoría de los soldados. ' +
      'Los pueblos indígenas sin inmunidad previa morían en proporciones del 50 al 90%. ' +
      'Entre 1492 y 1650 la población americana cayó de aproximadamente 50-60 millones a menos de 6 millones. ' +
      'En muchos casos las epidemias precedían a los ejércitos conquistadores por años.',
    pregunta:
      'Si la enfermedad fue el arma más letal de la conquista y en general no fue intencional, ' +
      '¿eso cambia nuestra evaluación moral de lo que ocurrió? ' +
      '¿Puede existir responsabilidad histórica sin intención?',
  },

  e_caribe: {
    contexto:
      'Los garífunas son un pueblo único surgido en la isla de San Vicente de la mezcla entre africanos libres —fugados de naufragios o resistentes al esclavismo— y el pueblo arahuaco local. ' +
      'Los ingleses los deportaron masivamente a la costa de Honduras en 1797 tras una rebelión. ' +
      'Hoy conservan una lengua que combina arahuaco, inglés, francés y lenguas africanas.',
    pregunta:
      'Los garífunas son resultado de una mezcla forzada por el colonialismo, pero construyeron una identidad propia y única. ' +
      '¿Puede algo creado por el trauma convertirse en fuente de fortaleza cultural? ' +
      '¿Qué hace "auténtica" a una identidad cultural?',
  },

  e_darien_norte: {
    contexto:
      'Los quipus eran el sistema de registro andino: cuerdas con nudos codificados que registraban números, calendarios, datos censales y posiblemente narrativas complejas. ' +
      'Los españoles los destruyeron masivamente por considerarlos "hechicería". ' +
      'Se perdieron irreversiblemente miles de registros históricos precolombinos. ' +
      'Hoy quedan menos de mil quipus en el mundo.',
    pregunta:
      'La destrucción de sistemas de escritura es una herramienta de conquista cultural. ' +
      '¿Qué se pierde cuando se destruye la manera en que un pueblo registra su historia? ' +
      '¿Puede recuperarse ese conocimiento perdido?',
  },

  // ── ACTO II ──────────────────────────────────────────

  e_istmo: {
    contexto:
      'Ciudad de Panamá, fundada en 1519, fue la primera ciudad española permanente en el Pacífico americano. ' +
      'Desde allí Francisco Pizarro organizó la conquista del Imperio Inca en 1532. ' +
      'Todo el oro andino pasaba por esta ciudad hacia España, convirtiéndola en el punto de mayor concentración de poder colonial del continente en el siglo XVI.',
    pregunta:
      '¿Por qué importa el control de los "cuellos de botella" geográficos —pasos de montaña, canales, puertos— en la historia de la conquista? ' +
      '¿Qué papel juega la geografía en el avance o la resistencia al poder colonial?',
  },

  e_darien: {
    contexto:
      'Los Guna (también llamados Kuna) son un pueblo indígena del Darién panameño que resistió la colonización durante siglos. ' +
      'En 1925 protagonizaron la Revolución de Tule, estableciendo una comarca semi-autónoma reconocida por el gobierno panameño. ' +
      'Hoy tienen una de las estructuras de autogobierno indígena más sólidas de América, con leyes propias sobre territorio, recursos y cultura.',
    pregunta:
      '¿Qué condiciones —geográficas, culturales, políticas— permitieron a los Guna resistir donde otros pueblos no pudieron? ' +
      '¿Qué lecciones ofrece su historia sobre la resistencia sostenida a largo plazo?',
  },

  e_costa: {
    contexto:
      'Los caballos se extinguieron en América hace 10.000 años y regresaron con los españoles en 1492. ' +
      'Para los pueblos que los veían por primera vez, un jinete armado parecía sobrenatural: los aztecas los llamaron "venados gigantes". ' +
      'La ventaja táctica era enorme —pero los pueblos indígenas aprendieron a neutralizarla en pocos años, atacando durante las recargas y en terrenos difíciles.',
    pregunta:
      '¿Cómo cambia el equilibrio de poder la introducción de una tecnología que un lado no conoce? ' +
      '¿Podés pensar en ejemplos contemporáneos donde una brecha tecnológica crea ventajas o desventajas similares?',
  },

  e_llanos: {
    contexto:
      'Los pueblos llaneros de Venezuela y Colombia adoptaron el caballo español con una velocidad que sorprendió a los propios conquistadores. ' +
      'En menos de una generación los caribes y llaneros se convirtieron en jinetes expertos que usaban contra los españoles la misma tecnología que estos habían traído. ' +
      'En el siglo XVIII, zonas enteras de los llanos quedaron fuera del control colonial efectivo.',
    pregunta:
      '¿Qué dice de la capacidad de resistencia indígena que pudieron adaptar la tecnología del conquistador tan rápidamente? ' +
      '¿Adoptar herramientas del colonizador es una forma de resistencia o de asimilación?',
  },

  e_magdalena: {
    contexto:
      'Los muiscas eran una civilización andina con redes comerciales que conectaban los Andes con la Amazonía. ' +
      'Sus ceremonias rituales —en particular una en que un cacique se cubría de oro y se sumergía en una laguna— dieron origen al mito europeo de El Dorado. ' +
      'Los españoles gastaron décadas y miles de vidas buscando una ciudad de oro que nunca existió.',
    pregunta:
      '¿Qué nos dice el mito de El Dorado sobre cómo los europeos imaginaban América? ' +
      '¿Cómo pueden los malentendidos y los mitos tener consecuencias históricas concretas y devastadoras?',
  },

  e_guayana: {
    contexto:
      'Los yanomami son uno de los pueblos indígenas más numerosos de Sudamérica —entre 35.000 y 40.000 personas en la frontera de Venezuela y Brasil. ' +
      'Resistieron el contacto exterior hasta el siglo XX. ' +
      'Hoy enfrentan una crisis grave por la minería ilegal de oro que contamina sus ríos con mercurio: en 2022 el gobierno brasileño reconoció oficialmente la emergencia humanitaria en su territorio.',
    pregunta:
      'Los yanomami eligieron el aislamiento durante siglos y hoy enfrentan amenazas que vienen precisamente del mundo que evitaron. ' +
      '¿Tienen los pueblos derecho al aislamiento total? ' +
      '¿Quién tiene la responsabilidad de proteger a comunidades que no pidieron esa protección?',
  },

  e_andes: {
    contexto:
      'El Tawantinsuyu (Imperio Inca) construyó 40.000 km de caminos pavimentados —más que el Imperio Romano en su apogeo. ' +
      'Sus sistemas de terrazas agrícolas transformaron los Andes en tierra cultivable. ' +
      'Los quechuas tenían mayor capacidad pulmonar por adaptación genética al altiplano —una ventaja que los soldados españoles que sufrían el soroche nunca pudieron igualar en la primera generación.',
    pregunta:
      'El conocimiento del propio territorio puede ser una forma de poder y resistencia. ' +
      '¿Qué ventajas concretas les dio a los pueblos andinos su adaptación al altiplano? ' +
      '¿Podés pensar en otros casos históricos donde el conocimiento del territorio cambió el resultado de un conflicto?',
  },

  e_amazonas: {
    contexto:
      'La Amazonía albergó cientos de civilizaciones precolombinas, muchas con ciudades a orillas del río. ' +
      'Investigaciones recientes muestran que la "selva virgen" amazónica es en realidad un jardín milenario: las comunidades indígenas plantaban deliberadamente los árboles frutales que hoy parecen silvestres. ' +
      'El Amazonas descarga el 20% de toda el agua dulce que los ríos llevan al mar.',
    pregunta:
      '¿Qué cambia en nuestra comprensión de la Amazonía si sabemos que fue diseñada y mantenida por pueblos durante miles de años? ' +
      '¿Quiénes son los "dueños" de un ecosistema que tardó milenios en construirse?',
  },

  e_selva_profunda: {
    contexto:
      'Hoy existen entre 50 y 100 grupos indígenas en la Amazonía que eligieron no tener contacto con el exterior. ' +
      'Brasil y Perú reconocen legalmente el derecho a ese aislamiento. ' +
      'El contacto forzado los ha diezmado históricamente en pocos años: enfermedades para las que no tienen inmunidad producen el mismo efecto que produjo la viruela hace 500 años.',
    pregunta:
      '¿Puede un pueblo elegir el aislamiento total en el mundo contemporáneo? ' +
      '¿Quién tiene el derecho de decidir por comunidades que no participan en el diálogo político? ' +
      '¿Tiene el Estado la responsabilidad de proteger a quienes no pidieron esa protección?',
  },

  // ── ACTO III ─────────────────────────────────────────

  e_altiplano: {
    contexto:
      'El lago Titicaca, a 3.812 metros de altitud, era el lugar sagrado de origen del sol (Inti) en la cosmología inca. ' +
      'Los Urus construyeron y habitaron islas flotantes de totora en sus aguas desde antes del Imperio Inca. ' +
      'El agotamiento de las personas en fuga es un factor documentado en todas las grandes migraciones históricas, incluyendo los éxodos contemporáneos.',
    pregunta:
      'El cansancio hace que las personas cuestionen un proyecto colectivo que antes apoyaban. ' +
      '¿Cómo deben liderar quienes guían una comunidad exhausta? ' +
      '¿Cuándo tiene más sentido detenerse y cuándo seguir?',
  },

  e_amazonas_boliviano: {
    contexto:
      'Los Llanos de Mojos en Bolivia tienen uno de los sistemas hidráulicos precolombinos más sofisticados del continente. ' +
      'Canales, terraplenes y plataformas elevadas controlaban las inundaciones estacionales de la Amazonía boliviana, convirtiendo tierras anegadas en campos productivos. ' +
      'El sistema cubría más de 100.000 km² y tardó dos milenios en construirse. Los españoles lo destruyeron sin entender lo que era.',
    pregunta:
      '¿Por qué es importante entender que muchas "selvas vírgenes" de América del Sur fueron en realidad diseñadas por civilizaciones humanas durante milenios? ' +
      '¿Qué implica esto para los debates actuales sobre derechos territoriales indígenas?',
  },

  e_tucuman: {
    contexto:
      'El noroeste argentino fue una de las últimas regiones en ser incorporadas al control español efectivo. ' +
      'Los pueblos diaguitas resistieron con guerrilla de montaña durante décadas en las quebradas del Tucumán. ' +
      'Las patrullas españolas perdidas en el interior eran frecuentes: los mapas europeos del siglo XVI eran notoriamente inexactos para las zonas andinas y subtropicales.',
    pregunta:
      'La violencia puede parecer la respuesta más eficaz en el corto plazo, pero puede atraer represalias mayores. ' +
      '¿Cuándo tiene sentido evitar una confrontación aunque se tenga la posibilidad de ganarla? ' +
      '¿Cómo se evalúa el costo de una acción violenta considerando sus consecuencias futuras?',
  },

  e_mendoza: {
    contexto:
      'Los huarpes de la región de Cuyo fueron incorporados al sistema de encomiendas desde 1551. ' +
      'El trabajo forzado en minas y haciendas, combinado con las enfermedades europeas, colapsó su población en pocas generaciones. ' +
      'Para 1600 la región estaba casi despoblada — no por guerra directa, sino por un proceso gradual y sistemático.',
    pregunta:
      'Los huarpes no fueron "conquistados" en un único momento de guerra: su destrucción fue gradual, a través del trabajo forzado y la enfermedad. ' +
      '¿De qué maneras puede un pueblo ser destruido sin un acto de guerra explícito? ' +
      '¿Qué formas toma el colonialismo lento?',
  },

  e_misiones: {
    contexto:
      'Las misiones jesuitas (1609-1767) fueron un experimento único: comunidades guaraníes autogobernadas que combinaban cultura guaraní con tecnología europea. ' +
      'Los guaraníes mantenían su lengua, música y estructuras sociales. ' +
      'Cuando los jesuitas fueron expulsados por Carlos III en 1767, las misiones colapsaron en meses y sus habitantes fueron esclavizados o dispersados.',
    pregunta:
      'Las misiones jesuitas protegían a los guaraníes de la esclavitud directa pero también transformaban su cultura. ' +
      '¿Puede existir un colonialismo "benevolente"? ' +
      '¿Cómo se evalúa una institución que hace simultáneamente daño y bien?',
  },

  e_pampas: {
    contexto:
      'Los ranqueles y otros pueblos pampeanos adoptaron el caballo en el siglo XVII y resistieron la colonización hasta la Conquista del Desierto de 1879 — ' +
      'la campaña militar argentina que exterminó y desplazó a los últimos pueblos libres de la Pampa para entregar sus tierras a terratenientes europeos. ' +
      'Fue uno de los genocidios más tardíos del continente americano.',
    pregunta:
      'La Conquista del Desierto ocurrió en 1879 — más de 350 años después de la llegada de Colón. ' +
      '¿Por qué la conquista de América no fue un evento sino un proceso que duró siglos? ' +
      '¿Cuándo termina una conquista?',
  },

  e_sierras: {
    contexto:
      'Las sierras de Córdoba tenían poblaciones precolombinas de comechingones y sanavirones. ' +
      'Documentos del siglo XVII registran grupos indígenas de diversas procedencias instalados en zonas serranas fuera de los circuitos coloniales principales. ' +
      'La superposición de culturas y el encuentro de pueblos desplazados fue una realidad compleja — no todos llegaron a los mismos destinos ni en las mismas condiciones.',
    pregunta:
      '¿Qué hace que una persona o un grupo "llegue" a su destino? ' +
      '¿Es solo llegar físicamente a un lugar, o incluye también poder establecerse, sobrevivir y mantener la propia cultura?',
  },

  e_mapuches: {
    contexto:
      'Los mapuches son el único pueblo indígena de América que resistió con éxito tanto al Imperio Inca como a los conquistadores españoles durante 300 años — la Guerra de Arauco. ' +
      'Los españoles firmaron el Tratado de Quilín en 1641 reconociendo la soberanía mapuche al sur del Biobío. ' +
      'Su resistencia se basó en parte en una estructura política descentralizada: sin un líder central que capturar, los españoles no podían "descabezar" el movimiento.',
    pregunta:
      'Los mapuches resistieron en parte porque su estructura política descentralizada no tenía un único líder al que capturar. ' +
      '¿Qué ventajas y desventajas tiene el liderazgo distribuido versus el centralizado en situaciones de conflicto? ' +
      '¿Podés pensar en ejemplos contemporáneos?',
  },

  // ── ACTO IV ──────────────────────────────────────────

  e_encrucijada: {
    contexto:
      'Los tres destinos representan ecosistemas y pueblos reales que ofrecieron siglos más de tiempo a quienes llegaban. ' +
      'La Amazonía albergó cientos de etnias fuera del alcance colonial; la Patagonia argentina con los tehuelches resistió hasta el siglo XIX; ' +
      'los canales chilenos con los kawésqar —que navegaban miles de kilómetros de memoria— no fueron colonizados efectivamente hasta el siglo XX.',
    pregunta:
      'La decisión final es colectiva: el chamán dice explícitamente que ya no es decisión del cacique solo, sino de todos. ' +
      '¿Cuándo deben tomarse las decisiones colectivamente y cuándo deben ser individuales? ' +
      '¿Qué cambia en la responsabilidad moral cuando una decisión es compartida por toda una comunidad?',
  },

}
