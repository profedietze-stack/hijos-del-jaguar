import type { GameEvent } from './types.js'

// ══════════════════════════════════════════════════════
// EVENTOS DEL JUEGO — 60 eventos, 4 Actos
// Cada nodo tiene un eventPool con 2 ids; se elige uno
// al azar para dar rejugabilidad.
// ══════════════════════════════════════════════════════

export const EVENTS_DEF: Record<string, GameEvent> = {

  // ── ACTO I — HUIDA (primarios) ───────────────────────────────

  e_inicio: {
    title: 'El Alba del Fuego',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
    cap:   'Fuego — el inicio de la huida',
    narr:  `El olor a madera quemada todavía está en la ropa de todos. Hace tres horas la aldea existía. Ahora solo existe el humo.<br><br>
Eres el <span class="ct" data-modal="cacique">cacique</span>. Sobreviviste porque estabas en el río cuando llegaron. Cincuenta personas te rodean en el claro: guerreros con heridas que todavía sangran, chamanes que lograron salvar los objetos sagrados, niños que no entienden qué pasó, ancianos que sí entienden y por eso tiemblan.<br><br>
El chamán mayor pone su mano en tu hombro: <em>"No hay nada que volver a buscar. El sur es el único norte que nos queda."</em><br><br>
Los <span class="tt" data-tip="Conquistadores: soldados profesionales enviados por la Corona española desde 1492. Usaban armadura de acero, arcabuces de chispa y caballos — tecnología que los pueblos indígenas nunca habían visto. Pero su arma más letal era invisible: las enfermedades europeas como la viruela, que mataron entre el 50 y el 90% de la población americana en pocas décadas.">conquistadores</span> saben que hay sobrevivientes. Vendrán al amanecer con perros de rastreo. El tiempo que hay para decidir se mide en minutos.`,
    decisions: [
      { text: 'Huir de noche. Los caballos pierden ventaja en la oscuridad de la selva.',       effects: { food: -5,  moral: +8,  salud: -5,  warriors: -1 } },
      { text: 'Esperar el amanecer. Los heridos graves no sobrevivirán el camino sin atención.', effects: { food: -8,  moral: +5,  salud: +12, civilians: -1 } },
      { text: 'Enviar guerreros de distracción al norte. Compran horas con su vida.',            effects: { food: -3,  moral: +15, salud: 0,   warriors: -3 } },
    ],
  },

  e_selva: {
    title: 'La Selva que Devora el Rastro',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Selva tropical centroamericana',
    narr:  `La selva cierra sobre el grupo como una boca que los traga. Es bueno y malo al mismo tiempo: los oculta, pero también los ralentiza. Los niños aprenden en horas a no romper ramas, a pisar donde ya pisó el de adelante, a no hacer ruido aunque tengan miedo.<br><br>
Al tercer día, un guerrero pisa una raíz oculta y se tuerce el tobillo con un crujido que todos escuchan. Puede caminar, pero despacio. Y el grupo ya camina despacio.<br><br>
Con el alba llegan ladridos. Los <span class="tt" data-tip="Aliados tlaxcaltecas: los tlaxcaltecas eran un pueblo nahua enemigo de los aztecas que se alió con Hernán Cortés en 1519. Sin ellos, la conquista de México habría sido imposible. Sus guerreros luego acompañaron las expediciones hacia Centroamérica, y su conocimiento del territorio los hacía rastreadores temibles.">tlaxcaltecas rastreadores</span> que trabajan para los españoles conocen esta selva casi tan bien como sus propios habitantes.<br><br>
La chamana mayor prepara en silencio una <span class="ct" data-modal="medicinaSelva">cataplasma de corteza de cedro y barro</span> para el tobillo. Hay un manantial cerca. Pero detenerse es arriesgarse.`,
    decisions: [
      { text: 'Detenerse y curar al herido. Este pueblo no abandona a los suyos — eso es lo que los diferencia de quienes los persiguen.', effects: { food: -5, moral: +12, salud: +8,  union: +10 } },
      { text: 'Continuar sin detenerse. Los ladridos se acercan. Cada minuto que pasa los acerca.',                                        effects: { food: -3, moral: -10, salud: -5,  union: -8  } },
    ],
  },

  e_rio: {
    title: 'El Río No Perdona',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Río de montaña — corriente traicionera',
    narr:  `Nadie dijo que el río estaría crecido. Las lluvias de los últimos días lo convirtieron en algo distinto — marrón, espeso, furioso. Pero no hay otro cruce visible, y detrás los persiguen.<br><br>
Entran al agua. Los más fuertes ayudan a los niños y a los ancianos. Por un momento parece posible. Entonces la corriente golpea a dos civiles desde abajo, los gira, los arrastra. Los guerreros intentan alcanzarlos. No llegan.<br><br>
El chamán mayor cierra los ojos cuando los pierde de vista. Cuando los abre, dice con una voz que no admite réplica: <em>"Ellos van al <span class="tt" data-tip="Xibalbá: en la cosmología maya-quiché, el inframundo regido por los Señores de la Muerte. A diferencia del infierno cristiano, el Xibalbá no era un castigo — era una prueba. Los héroes gemelos Hunahpú e Ixbalanqué lo cruzaron y volvieron. Es el viaje más difícil, no el más oscuro.">Xibalbá</span>. Su sacrificio nos compró tiempo que no debemos desperdiciar."</em><br><br>
Al otro lado, el agua borró el rastro. Los perros españoles no pueden cruzar aquí antes del mediodía.`,
    decisions: [
      { text: 'Avanzar rápido. Aprovechar cada minuto de ventaja que el río nos dio.',                        effects: { food: -5, moral: -5,  salud: +5,  union: -5,  civilians: -2 } },
      { text: 'Detenerse para un rito breve por los caídos. El pueblo necesita despedirse — o la moral se rompe.', effects: { food: -8, moral: +15, salud: 0,   union: +15, civilians: -2 } },
    ],
  },

  e_alianza: {
    title: 'La Tribu del Sur',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Encuentro entre pueblos — selva al amanecer',
    narr:  `Están ahí antes de que nadie los vea. Seis figuras entre los árboles, inmóviles, mirando. No llevan armas levantadas — eso es importante. Llevan armas al costado.<br><br>
Son <span class="tt" data-tip="Pueblo Pipil: grupo indígena de origen nahua establecido en El Salvador y parte de Guatemala. Habían migrado desde México siglos antes de la conquista, y hablaban una lengua emparentada con el náhuatl. Resistieron ferozmente la invasión española pero fueron finalmente sometidos en 1528. Su territorio fue uno de los primeros en ser repartido en encomiendas.">pipiles</span>. Viven aquí, en esta selva, y conocen cada árbol. Sus ojos no muestran miedo — muestran reconocimiento: ellos también han visto qué hace la gente de hierro cuando llega a una aldea.<br><br>
Su líder da un paso al frente. Habla en una lengua cercana a la que usa el chamán — no igual, pero comprensible: <em>"Podemos ayudarlos a cruzar hacia el sur. Si ustedes nos enseñan algo que valga la pena saber."</em><br><br>
Es la primera vez desde el incendio que alguien les ofrece ayuda en lugar de quitarles algo.`,
    decisions: [
      { text: 'Aceptar. Compartir los conocimientos de curación del chamán a cambio de guía y comida.', effects: { food: +20, moral: +15, salud: +8,  union: +10 }, allianceKey: 'pipil' },
      { text: 'Tomar comida sin comprometerse. No hay tiempo para alianzas.',                           effects: { food: +10, moral: +5,  union: -5 } },
      { text: 'Rechazar. No pueden cargar con más personas en peligro.',                               effects: { food: -5,  moral: -10, union: -5 } },
    ],
  },

  e_fiebre: {
    title: 'El Enemigo Invisible',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&q=80',
    cap:   'La enfermedad — el enemigo sin rostro',
    narr:  `Al quinto día de marcha, una mujer mayor no puede levantarse. Al sexto, cuatro personas más tienen la misma fiebre y manchas rojizas que el chamán reconoce con terror apenas contenido: <em>"Es la <span class="tt" data-tip="Viruela (huey cocoliztli): traída por los europeos, fue la mayor catástrofe demográfica de la historia. Los pueblos indígenas sin inmunidad previa morían en proporciones del 50 al 90%. La población americana cayó de unos 50 millones en 1492 a menos de 5 millones en 1650. La enfermedad llegaba antes que los conquistadores — el pueblo ya estaba devastado cuando llegaban los soldados.">enfermedad de los españoles</span>."</em><br><br>
Los guerreros se apartan sin decirlo. Los niños lloran sin que nadie los haga callar. El miedo a algo invisible es más difícil de combatir que cualquier ejército. Cinco enfermos. Todos expuestos. El grupo no puede detenerse mucho tiempo.`,
    decisions: [
      { text: 'Aislar a los enfermos. El chamán los cuida solo. Doloroso pero necesario.',    effects: { food: -10, moral: -15, salud: +10, union: -10, civilians: -2 } },
      { text: 'Todos cuidan a todos. Si se contagian, lo hacen juntos.',                      effects: { food: -15, moral: +8,  salud: -18, union: +15, civilians: -1 } },
      { text: 'Seguir avanzando. Los que puedan caminar vienen.',                             effects: { food: -5,  moral: -25, salud: -5,  union: -20, civilians: -3 } },
    ],
  },

  e_caribe: {
    title: 'Los Mares del Caribe',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Costa caribeña — el mar turquesa',
    narr:  `La costa caribeña es otro mundo: barcos de vela en el horizonte, mercaderes de lenguas extrañas, pueblos que comercian con todos sin lealtades fijas. El olor a sal y madera húmeda es completamente nuevo para casi todos.<br><br>
Un anciano <span class="tt" data-tip="Garífuna: pueblo de origen mixto africano y arahuaco caribeño, surgido en la isla de San Vicente. Los ingleses los deportaron al Caribe centroamericano en 1797 tras una rebelión. Hoy viven en Honduras, Belice, Guatemala y Nicaragua, conservando una lengua y cultura únicas en el mundo — mezcla de lenguas arahuacas, inglés, francés y lenguas africanas.">garífuna</span> los ve llegar desde la orilla y sonríe: <em>"Ustedes no son los primeros que corren. Y no serán los últimos."</em><br><br>
Puede llevarlos por mar hasta Panamá en tres días, borrando todo rastro. Pero cobra caro: la mitad de las reservas de comida.`,
    decisions: [
      { text: 'Pagar el precio. El mar es más rápido y borra el rastro mejor que la selva.',          effects: { food: -20, moral: +20, salud: +10, union: +5 } },
      { text: 'Negociar. Ofrecer servicio de los guerreros como protección durante el viaje.',        effects: { food: -8,  moral: +15, salud: +5,  warriors: -1 } },
      { text: 'Rechazar. No confiar en extraños. Seguir por tierra.',                                effects: { food: -5,  moral: -10, salud: -8 } },
    ],
  },

  e_darien_norte: {
    title: 'El Filo del Continente',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Darién — donde el continente se estrecha',
    narr:  `El continente se angosta hasta el punto en que casi podés ver los dos mares desde una sola colina. Al este el Caribe. Al oeste el Pacífico. En el medio: selva sin nombre, sin caminos, sin misericordia.<br><br>
Un niño de diez años encuentra algo que ningún adulto vio: un <span class="tt" data-tip="Quipu: sistema de registro andino basado en cuerdas con nudos de colores. Registraba números, calendarios y posiblemente narrativas complejas. Los quipus fueron destruidos masivamente por los españoles, que los consideraban instrumentos del diablo. Se perdieron irreversiblemente miles de registros históricos precolombinos.">quipu</span> colgado de una rama alta, con nudos que el chamán no termina de descifrar pero que parecen indicar una dirección.<br><br>
También hay huellas en el barro. De botas de cuero. Muy frescas — de ayer, o de esta mañana.`,
    decisions: [
      { text: 'Seguir el camino que marca el quipu. Confiar en quien pasó antes.',        effects: { food: -5,  moral: +10, salud: -5,  union: +8 } },
      { text: 'Alejarse rápido de las huellas. Las botas pueden volver.',                 effects: { food: -12, moral: +5,  salud: -10, warriors: -1 } },
      { text: 'Preparar una trampa. Si vuelven, que sea en sus términos.',                effects: { food: -5,  moral: +12, salud: -5,  warriors: -2 } },
    ],
  },

  // ── ACTO I — HUIDA (variantes _b) ────────────────────────────

  e_selva_b: {
    title: 'El Árbol que Escucha',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Selva centroamericana — la noche verde',
    narr:  `La selva de noche es otro mundo. Los mismos árboles del día se convierten en formas distintas. Cada sonido puede ser amenaza o promesa, y no hay manera de saberlo hasta que ya pasó.<br><br>
La chamana mayor se detiene frente a un árbol enorme, más ancho que cuatro personas abrazadas, y pone la mano abierta en su corteza. No dice nada durante un momento largo.<br><br>
<em>"Este árbol tiene trescientos años"</em>, dice. <em>"Vio pasar a nuestros abuelos. Nos va a ver pasar a nosotros."</em><br><br>
Al amanecer, en las raíces, encuentran comida que nadie dejó antes de dormirse: fruta fresca, un cuenco de agua limpia. Las huellas en el barro son de pies descalzos. No hay nadie visible.`,
    decisions: [
      { text: 'Tomar la ofrenda. Quienquiera que la dejó, merece gratitud.',     effects: { food: +15, moral: +18, union: +12 } },
      { text: 'Dejar la ofrenda intacta y seguir. No tomar lo que no es de ustedes.', effects: { food: -3, moral: +20, union: +10 } },
      { text: 'Esperar al que dejó la ofrenda. Puede ser un aliado.',            effects: { food: +15, moral: +10, salud: -5, union: +15 } },
    ],
  },

  e_rio_b: {
    title: 'Los Niños del Río',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Honduras — ríos de la costa atlántica',
    narr:  `El río está más crecido que ayer. Las lluvias de las últimas horas lo empujaron. No hay vado obvio. El cruce llevará horas por el camino largo, o minutos si hay uno corto que nadie del grupo conoce.<br><br>
Desde la orilla opuesta, seis niños <span class="tt" data-tip="Misquitos (Miskitu): pueblo indígena de la costa atlántica de Honduras y Nicaragua. Desarrollaron una relación estratégica con los ingleses en el siglo XVII, convirtiéndose en el único reino indígena aliado de una potencia europea. Su costa se llamó Mosquitia y conservó cierta autonomía hasta el siglo XIX. Su conocimiento de los ríos y costas era legendario entre los navegantes europeos.">misquitos</span> los observan sin miedo y señalan hacia el sur: hay un vado allí, dicen con las manos. Un cruce seguro que ningún adulto del grupo vería solo.<br><br>
Aceptar significa que esa aldea sabrá que el grupo pasó por aquí.`,
    decisions: [
      { text: 'Aceptar la guía de los niños. El vado secreto puede salvar horas.',        effects: { food: +5,  moral: +15, salud: +8, union: +10 } },
      { text: 'Cruzar solos por el camino más largo. No comprometer a los niños.',        effects: { food: -10, moral: +8,  salud: -8, union: +5  } },
      { text: 'Dar a los niños algo de comida y cruzar por donde indican.',               effects: { food: -8,  moral: +20, salud: +5, union: +12 } },
    ],
  },

  e_alianza_b: {
    title: 'El Mercado de las Lenguas',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Nicaragua — mercados precolombinos',
    narr:  `Un mercado escondido en el monte — no en ningún camino conocido, sino en un claro que requiere saber exactamente adónde ir. Lo frecuentan representantes de una docena de pueblos distintos. Nadie ataca aquí: es tierra de intercambio y esa regla tiene siglos de vigencia.<br><br>
Los <span class="tt" data-tip="Chorotegas: pueblo indígena de Nicaragua y Costa Rica con una lengua emparentada con el náhuatl. Eran comerciantes y ceramistas expertos. Fueron sometidos rápidamente por los españoles en la década de 1520, en parte porque sus rivales regionales les negaron apoyo. Su cultura fue asimilada forzosamente en pocas generaciones.">chorotegas</span> los señalan apenas entran: forasteros del norte, con esa manera de caminar que tienen los que huyen aunque intenten disimularlo.<br><br>
Circula información: los españoles abrieron una ruta nueva al sur. Y un rumor — dos personas lo mencionan sin saberlo — de que un grupo de fugitivos pasó hace dos semanas. La descripción que dan podría ser familia.`,
    decisions: [
      { text: 'Preguntar abiertamente por los fugitivos. Pueden ser familia.',              effects: { food: +10, moral: +20, union: +15 } },
      { text: 'Comerciar en silencio. No revelar quiénes son ni de dónde vienen.',         effects: { food: +18, moral: +5,  salud: +5  } },
      { text: 'Buscar información sobre la ruta española. Saber por dónde no ir.',         effects: { food: +8,  moral: +10, union: +8  } },
    ],
  },

  e_fiebre_b: {
    title: 'El Chamán que No Sabía',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&q=80',
    cap:   'Costa Rica — el chamán frente a lo desconocido',
    narr:  `El chamán mayor lleva tres días solo con los enfermos. Esta noche llama aparte al cacique, fuera del alcance del oído de los demás. Tarda en hablar.<br><br>
<em>"No sé qué es. En cuarenta años de chamán, nunca vi esto. Los remedios que conozco no funcionan."</em><br><br>
Es la primera vez en tu vida que lo escuchas admitir ignorancia completa. Cuatro personas murieron. En el borde del campamento hay una planta que el chamán nunca usó — solo la vio usar, hace años, en un pueblo del sur, en situación parecida. No conoce la dosis. No sabe si funciona aquí.<br><br>
<em>"Podría matar o curar. No sé. No sé."</em>`,
    decisions: [
      { text: 'Autorizar al chamán a probar con la planta desconocida. El riesgo de no hacer nada es mayor.', effects: { food: -5, moral: +10, salud: +20, civilians: -1 } },
      { text: 'Prohibirlo. No experimentar con los enfermos. Buscar otro camino.',                           effects: { food: -8, moral: -5,  salud: -10, civilians: -2 } },
      { text: 'Preguntar a los enfermos. Son ellos quienes deciden sobre su propio riesgo.',                 effects: { food: -5, moral: +20, salud: +10, union: +15, civilians: -1 } },
    ],
  },

  e_caribe_b: {
    title: 'La Nave Encallada',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Costa del Caribe — naufragio en la costa',
    narr:  `Una nave española encallada en la costa, semihundida, abandonada. Los marineros no están — o escaparon, o la selva los tuvo. El casco cruje con el oleaje pero no se hunde más.<br><br>
Dentro hay cosas que el grupo nunca vio de cerca: <span class="tt" data-tip="Arcabuces: armas de fuego de mecha usadas por los conquistadores. Tardaban entre 30 segundos y 1 minuto en recargarse, eran imprecisas con la pólvora mojada. Pero psicológicamente eran devastadoras para quienes nunca habían visto pólvora. Los pueblos indígenas aprendieron rápidamente a atacar durante las recargas, neutralizando su ventaja.">arcabuces</span> y pólvora sellada en cuero — todavía seca. Mapas con rutas que los españoles usan. Y comida seca suficiente para semanas.`,
    decisions: [
      { text: 'Tomar solo la comida. Las armas traen problemas que no pueden manejar.',   effects: { food: +30, moral: +5,  salud: +10 } },
      { text: 'Tomar todo, incluidas las armas. El conocimiento del enemigo es poder.',   effects: { food: +25, moral: +15, salud: +5, warriors: +2 } },
      { text: 'Quemar la nave. Que nadie la use. Y tomar la comida.',                     effects: { food: +25, moral: +20, union: +10 } },
    ],
  },

  e_darien_norte_b: {
    title: 'Las Marcas en los Árboles',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Darién — señales de pueblos anteriores',
    narr:  `El sendero termina en un claro donde alguien construyó algo hace tiempo: tres pilares de piedra con grabados que el chamán estudia de rodillas, pasando los dedos sobre las marcas.<br><br>
<em>"Lengua antigua"</em>, dice. <em>"Emparentada con la nuestra pero más vieja. Como si el español fuera para el quechua lo que este es para nuestra lengua."</em><br><br>
Los grabados parecen indicar una dirección hacia el sur. Pero también hay algo que el chamán interpreta como advertencia — una palabra que se repite tres veces junto al símbolo del agua.<br><br>
<em>"Alguien construyó esto para que nosotros lo encontráramos. O para que alguien exactamente como nosotros lo encontrara."</em>`,
    decisions: [
      { text: 'Seguir lo que indican los tallados, incluyendo la advertencia sobre el agua.', effects: { food: -5,  moral: +15, salud: +10, union: +10 } },
      { text: 'Copiar los tallados y seguir el propio camino. El conocimiento puede servir después.', effects: { food: -8, moral: +20, union: +8 } },
      { text: 'Quedarse un día para estudiar todo. Puede haber más información.',              effects: { food: -12, moral: +10, salud: +5,  union: +12 } },
    ],
  },

  // ── ACTO II — TRAVESÍA (primarios) ───────────────────────────

  e_istmo: {
    title: 'El Cuello del Mundo',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Montañas del istmo — paso entre dos océanos',
    narr:  `Panamá es angosto como la garganta de un jaguar. A un día al oeste: agua azul que ninguno del grupo tiene nombre para describir — el Pacífico. A un día al este: el Caribe que ya conocen. Y en el centro: <span class="tt" data-tip="Panamá la Vieja (1519): primera ciudad española permanente en el Pacífico americano, fundada por Pedrarias Dávila. Desde aquí Francisco Pizarro organizó la conquista del Imperio Inca. Fue también el punto de embarque de todo el oro andino hacia España.">Ciudad de Panamá</span>. Hay que rodearla sin ser vistos, sin que un perro ladre, sin que un guardia vea siluetas en las colinas.<br><br>
Un anciano del grupo conoce un paso de montaña que los españoles no descubrieron todavía. Pero desde ese paso, el camino se divide en tres.`,
    decisions: [
      { text: 'Paso secreto de montaña. Lento pero invisible. Hacia la selva del Darién.', effects: { food: -12, moral: +5,  salud: -10 } },
      { text: 'Rodear por la costa del Pacífico. Más rápido pero expuesto.',               effects: { food: -5,  moral: -5,  salud: -5,  warriors: -1 } },
      { text: 'Contactar mercaderes que cruzan hacia Venezuela. El camino del norte.',     effects: { food: -8,  moral: +8,  salud: -3,  union: +5  } },
    ],
  },

  e_darien: {
    title: 'La Selva sin Nombre',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Selva del Darién — la más densa del mundo',
    narr:  `El Darién. La selva más densa del continente — tan cerrada que los propios españoles evitan entrar profundo. Los árboles crecen sobre los árboles. Las raíces se convierten en paredes. El barro absorbe los pasos con sonido de succión. Dos días sin ver el sol. Tres. Los niños pequeños empiezan a llorar sin razón aparente.<br><br>
En el quinto día, un guerrero encuentra marcas en un árbol: talladas con precisión, geométricas. No españolas. Son de los <span class="tt" data-tip="Cunas / Guna: pueblo indígena del Darién panameño y las islas San Blas. Resistieron la colonización española y europea durante siglos. En 1925 protagonizaron la Revolución de Tule, estableciendo una comarca semi-autónoma reconocida por Panamá. Hoy mantienen una de las estructuras de autogobierno indígena más sólidas de América.">cunas</span>.<br><br>
La chamana las estudia y dice en voz baja: <em>"Conozco algo de su lengua. Alguien nos está indicando por dónde ir."</em>`,
    decisions: [
      { text: 'Seguir las marcas y buscar a los cunas. Pueden ser aliados.', effects: { food: +18, moral: +12, salud: +10, union: +8 }, allianceKey: 'cunas' },
      { text: 'Ignorar las marcas. No hay tiempo para riesgos.',             effects: { food: -10, moral: 0,   salud: -8 } },
    ],
  },

  e_costa: {
    title: 'El Mar del Sur',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Costa del Pacífico — el mar desconocido',
    narr:  `El océano al oeste brilla con una intensidad que ninguno del grupo tiene palabras para describir. Es el primer mar que la mayoría ve en su vida. Un pueblo de pescadores los observa desde las rocas — tienen piraguas enormes y algo que el pueblo de la selva nunca tiene suficiente: sal.<br><br>
Antes de que nadie hable, un pescador señala al norte. En la distancia, una nube de polvo que se mueve demasiado rápido para ser natural. <span class="tt" data-tip="Caballos en América: extinguidos en el continente hace 10.000 años, regresaron con los españoles en 1492. Para los pueblos indígenas que veían uno por primera vez, la experiencia era aterradora: jinete y animal parecían un ser único sobrenatural. Los aztecas los llamaron venados gigantes. La ventaja táctica que otorgaban era devastadora.">Caballos</span>.`,
    decisions: [
      { text: 'Pedir una piragua. Navegar pegados a la costa hacia el sur.',     effects: { food: +15, moral: +20, salud: +5, union: +5 } },
      { text: 'Internarse en el bosque costero. Más lento pero más seguro.',     effects: { food: -8,  moral: -5,  salud: -5, warriors: -1 } },
    ],
  },

  e_llanos: {
    title: 'Los Llanos Interminables',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Llanos venezolanos — la sabana infinita',
    narr:  `Al este de los Andes la tierra se desploma en una llanura que no tiene fin visible. El cielo ocupa más espacio que el suelo. El pasto llega a la cintura. Por primera vez en semanas, el grupo puede ver lejos — lo que también significa que pueden ser vistos.<br><br>
Al tercer día aparecen en el horizonte: treinta jinetes inmóviles. <span class="tt" data-tip="Caribes de los llanos: distintos a los caribes del Caribe, estos pueblos adoptaron el caballo español con asombrosa velocidad. En menos de una generación se convirtieron en jinetes expertos, usando contra los españoles la misma tecnología que estos usaban contra ellos. La palabra caníbal en español deriva de caribe — nombre que los europeos usaron para justificar su esclavización.">Caribes</span> a caballo, caballos tomados a los propios españoles. Observan sin hostilidad aparente. Su líder cabalga sola hacia adelante y pregunta: <em>"¿Adónde van los que no tienen tierra?"</em>`,
    decisions: [
      { text: 'Decir la verdad: huimos hacia el sur. Pedir permiso para cruzar.',           effects: { food: +10, moral: +15, union: +12, salud: 0 }, allianceKey: 'caribes' },
      { text: 'Decir que somos comerciantes. Pagar con lo que tenemos.',                    effects: { food: -15, moral: +5,  union: +5  } },
      { text: 'Correr. Los llanos son anchos, no pueden alcanzarnos a todos.',              effects: { food: -10, moral: -15, salud: -10, warriors: -1, civilians: -1 } },
    ],
  },

  e_magdalena: {
    title: 'El Río que Sube a los Andes',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Río Magdalena — Colombia interior',
    narr:  `El Magdalena sube desde el sur como una columna vertebral de agua que sostiene todo el interior colombiano. A lo largo de sus orillas viven los <span class="tt" data-tip="Muiscas: civilización andina de Colombia organizada en cacicazgos en la sabana de Bogotá. Eran orfebres extraordinarios y controlaban rutas comerciales que conectaban los Andes con la Amazonía. De sus ceremonias rituales nació la leyenda de El Dorado. Fueron sometidos por Gonzalo Jiménez de Quesada en 1538 — uno de los colapsos más rápidos de cualquier civilización precolombina.">muiscas</span>, que comercian con todos sin lealtades permanentes.<br><br>
Un mercader muisca que habla cuatro lenguas los intercepta con la expresión calculadora de quien lleva treinta años haciendo tratos: <em>"Los llevo hasta el paso del sur. A cambio: los conocimientos de medicina de su chamán. Mi hija lleva dos semanas con fiebre."</em>`,
    decisions: [
      { text: 'Aceptar el trato. La medicina del chamán por la guía del mercader.',        effects: { food: +12, moral: +18, salud: +8,  union: +10 }, allianceKey: 'muiscas' },
      { text: 'Curar a la niña sin pedir nada. La bondad tiene su propia recompensa.',    effects: { food: 0,   moral: +25, salud: +5,  union: +15 } },
      { text: 'Rechazar. Cada día que pasan aquí es un día que los perseguidores ganan.', effects: { food: -8,  moral: -8,  salud: -5  } },
    ],
  },

  e_guayana: {
    title: 'La Tierra de las Piedras que Brillan',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Guayana — tepuyes y ríos negros',
    narr:  `Las mesetas de piedra se elevan desde la selva como islas en el aire. Los <span class="tt" data-tip="Tepuyes: formaciones geológicas únicas de la Guayana venezolana, de hasta 3.000 metros de altura, formadas hace 1.800 millones de años. Cada cumbre es un ecosistema aislado con especies que no existen en ningún otro lugar del mundo. El tepuy Roraima fue la inspiración de El Mundo Perdido de Arthur Conan Doyle (1912).">tepuyes</span> generan sus propias nubes y lluvias. Las cascadas caen desde alturas que producen vértigo solo de mirar hacia arriba.<br><br>
En el río hay piedras que brillan con luz propia. <em>"Las llamamos lágrimas del sol"</em>, dice el chamán. Un guerrero quiere llevar algunas — pueden valer algo en el sur.<br><br>
Pero entre las sombras del dosel, figuras inmóviles: los <span class="tt" data-tip="Yanomami: uno de los pueblos indígenas más numerosos de Sudamérica, con entre 35.000 y 40.000 personas en la frontera entre Venezuela y Brasil. Resistieron el contacto exterior hasta el siglo XX. Hoy enfrentan una crisis grave por la minería ilegal de oro que contamina sus ríos con mercurio.">yanomami</span> observan desde el bosque.`,
    decisions: [
      { text: 'Dejar las piedras. No son de aquí para llevárselas.',                      effects: { food: 0,   moral: +15, union: +10 } },
      { text: 'Tomar algunas discretamente. Pueden valer algo en el sur.',                effects: { food: 0,   moral: -5,  union: -8,  salud: -3 } },
      { text: 'Acercarse a los yanomami en señal de paz. Compartir comida.',              effects: { food: -10, moral: +20, union: +15 }, allianceKey: 'yanomami' },
    ],
  },

  e_andes: {
    title: 'Los Gigantes de Piedra',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Los Andes — las montañas más altas del mundo',
    narr:  `Nadie dijo que las montañas serían tan grandes. En Guatemala había cordilleras, pero estas son diferentes — blancas en la cima aunque sea pleno verano, tan altas que las nubes pasan por debajo de ellas.<br><br>
El <span class="tt" data-tip="Soroche (mal de montaña): por encima de 3.000 metros el oxígeno escasea. El cuerpo no adaptado responde con dolores de cabeza, náuseas, fatiga extrema y dificultad para pensar con claridad. Los pueblos andinos tenían mayor capacidad pulmonar por adaptación genética milenaria, y usaban hojas de coca, que ayuda a oxigenar la sangre. Los españoles sufrían soroche gravemente en sus primeras expediciones andinas.">soroche</span> llega sin aviso. Tres ancianos no pueden seguir. Dos niños vomitan sin haber comido.<br><br>
Y desde lo alto de una roca, figuras que los miran. Detrás, lo que parece una ciudad construida dentro de la montaña. Son <span class="tt" data-tip="Quechuas: pueblo central del Tawantinsuyu (Imperio Inca). Su idioma es hablado hoy por entre 8 y 10 millones de personas. Construyeron 40.000 km de caminos pavimentados, más que el Imperio Romano. Su sistema de terrazas agrícolas transformó los Andes en tierra cultivable.">quechuas</span>. Y te observan sin pestañear.`,
    decisions: [
      { text: 'Presentarse con honestidad. Somos fugitivos del mismo enemigo.',     effects: { food: +25, moral: +25, salud: +20, union: +15 }, allianceKey: 'inca' },
      { text: 'Presentarse como guerreros libres. No mostrar debilidad.',           effects: { food: +10, moral: +10, salud: +8  } },
      { text: 'Continuar de noche, evitando la ciudad. Ya no confían en nadie.',   effects: { food: -10, moral: -10, salud: -10 } },
    ],
  },

  e_amazonas: {
    title: 'El Río que Respira',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'El Amazonas — el río más caudaloso del planeta',
    narr:  `Un guerrero grita desde una colina y nadie entiende qué dice hasta que llegan al borde y lo ven: agua. Tanta agua que el horizonte desaparece.<br><br>
El <span class="ct" data-modal="amazonasInfo">Amazonas</span>. Caimanes inmóviles como troncos en las orillas. Delfines rosados que emergen y sumergen sin apuro. Y desde la orilla sur, los ojos amarillos de un <span class="ct" data-modal="jaguarInfo">jaguar</span> que los mira un segundo y desaparece entre los árboles como si nunca hubiera estado.<br><br>
Al otro lado hay un pueblo que vive sobre el agua misma — balsas atadas entre sí que se mueven con la corriente. El chamán dice: <em>"Son los hijos del río. Generaciones sin pisar tierra firme."</em>`,
    decisions: [
      { text: 'Construir balsas y navegar río abajo. El agua borra todo rastro.',                          effects: { food: +10, moral: +22, salud: -5  } },
      { text: 'Pedir a los del río que enseñen a navegar. Aprender antes de entrar.',                     effects: { food: +18, moral: +15, salud: 0,   union: +12 }, allianceKey: 'ribeirinhos' },
      { text: 'Seguir por tierra junto al río. Las balsas son peligrosas para los niños.',               effects: { food: -10, moral: -5,  salud: 0   } },
    ],
  },

  e_selva_profunda: {
    title: 'El Corazón Verde',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Amazonia — el interior sin nombre',
    narr:  `Tres días sin ver el cielo. El dosel es tan espeso que la luz solar llega en fragmentos verdes y oblicuos que hacen todo parecer estar bajo el agua. Los niños pequeños empiezan a olvidar cómo es la luz directa.<br><br>
El chamán se detiene de golpe y levanta la mano. Todos se quedan quietos. Él estudia el suelo, los árboles, el espacio entre ellos. Durante un rato largo, nadie habla.<br><br>
<em>"Estamos siendo guiados"</em>, dice finalmente. <em>"No perseguidos — guiados. Alguien preparó este camino."</em><br><br>
Las plantas están dispuestas de manera demasiado regular para ser natural. Y entre los árboles aparece sin hacer ruido un anciano de ojos pintados de negro que los mira como si llevara toda la mañana esperándolos.`,
    decisions: [
      { text: 'Seguir al anciano. El que preparó el camino no tiene malas intenciones.',  effects: { food: +25, moral: +30, salud: +15, union: +20 }, allianceKey: 'guardianes' },
      { text: 'Agradecer y apartarse. Este lugar tiene dueños que no eligieron esto.',    effects: { food: -5,  moral: +10, salud: 0   } },
      { text: 'Preguntar si es posible quedarse. Esta selva puede ser el destino.',       effects: { food: +15, moral: +20, salud: +10, union: +15 } },
    ],
  },

  // ── ACTO II — TRAVESÍA (variantes _b) ────────────────────────

  e_istmo_b: {
    title: 'El Espía de Dios',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Panamá — la ciudad y sus secretos',
    narr:  `Un hombre se acerca al campamento nocturno. No hace ruido suficiente para despertar a los que duermen, pero tampoco el sigilo suficiente para no ser visto por los que están de guardia. Es intencional — quiere ser notado pero no amenazante.<br><br>
Viste ropa española pero habla sin acento en tres lenguas indígenas. Se presenta: <em>"Soy intérprete de los españoles. Llevo cuatro años sirviendo de puente entre dos mundos que se odian. Ya no quiero seguir."</em><br><br>
Los <span class="tt" data-tip="Intérpretes coloniales (lenguas o trujamanes): muchos indígenas fueron capturados específicamente para aprender español. La Malinche (Malintzin), intérprete de Hernán Cortés, es el caso más conocido y debatido: ¿traidora o superviviente que usó las herramientas disponibles? Los intérpretes conocían los planes españoles antes que los propios capitanes.">intérpretes coloniales</span> saben lo que ningún espía puede descubrir: los planes mientras todavía se discuten.`,
    decisions: [
      { text: 'Confiar en él. Alguien que traiciona a los españoles merece una oportunidad.', effects: { food: +10, moral: +15, union: +15 }, allianceKey: 'interprete' },
      { text: 'Tomar su información pero no llevarlo. Es un riesgo que no pueden asumir.',    effects: { food: +5,  moral: +5,  union: +5  } },
      { text: 'Rechazarlo. Quien traicionó una vez puede traicionar de nuevo.',               effects: { food: -5,  moral: +5,  union: -5  } },
    ],
  },

  e_darien_b: {
    title: 'El Veneno Verde',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Darién — la selva que enferma',
    narr:  `Dos guerreros amanecen con la piel con un tinte verdoso y fiebre altísima — el tipo que hace que los ojos no enfoquen y las palabras salgan descolocadas. El chamán reconoce el síntoma antes de que nadie pregunte: tocaron la savia de una planta específica sin saberlo.<br><br>
La cura existe. Una corteza que crece junto al agua — el chamán la reconocería al verla. Pero en el Darién, apartarse del grupo es un riesgo que puede no tener vuelta. Y los enfermos empeoran por horas.`,
    decisions: [
      { text: 'Mandar a tres guerreros a buscar la corteza. El riesgo para ellos, la salvación para los otros.', effects: { food: -5,  moral: -5,  salud: +18, warriors: -1 } },
      { text: 'Ir el chamán solo. Es su conocimiento y su responsabilidad.',                                    effects: { food: -3,  moral: +15, salud: +15, shamans: -1 } },
      { text: 'Construir una camilla y seguir cargando a los enfermos. La corteza puede aparecer en el camino.', effects: { food: -12, moral: +10, salud: -5,  union: +15 } },
    ],
  },

  e_costa_b: {
    title: 'Los Pescadores del Fin del Mundo',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Costa Pacífica colombiana — pueblos del mar',
    narr:  `Las balsas del pueblo <span class="tt" data-tip="Emberá: pueblo indígena de la costa pacífica de Colombia y Panamá. Expertos en la navegación de ríos torrentosos y costas del Pacífico. Hoy viven principalmente en el Chocó colombiano. Son reconocidos por sus artesanías de tagua y sus conocimientos de plantas medicinales del bosque húmedo.">emberá</span> son más grandes de lo que parecen desde lejos. Los reciben con la hospitalidad calculada de quien atiende extranjeros constantemente.<br><br>
<em>"Son el decimoséptimo grupo que pasa en tres años"</em>, dice la jefa. <em>"El continente se vacía hacia el sur."</em><br><br>
Tienen un sistema: cada grupo que pasa deja algo — una técnica, una semilla — y recibe guía y comida. <em>"Lo que ustedes saben vale más que el oro que no tienen"</em>.`,
    decisions: [
      { text: 'Participar del intercambio. Dejar conocimiento de medicina selvática.', effects: { food: +22, moral: +20, salud: +12, union: +15 }, allianceKey: 'embera' },
      { text: 'Pagar con trabajo. Los guerreros ayudan a pescar dos días.',            effects: { food: +28, moral: +10, salud: +10 } },
      { text: 'Solo aceptar lo mínimo y seguir. No quedarse más de una noche.',        effects: { food: +10, moral: +5,  salud: +5  } },
    ],
  },

  e_llanos_b: {
    title: 'El Fuego en la Llanura',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Llanos venezolanos — el fuego anual',
    narr:  `El horizonte está en llamas. El humo sube en columnas rectas — señal de que el viento no sopla todavía — y el cielo tiene el color del atardecer aunque sea mediodía.<br><br>
Para quien no lo sabe, parece el fin del mundo. Para quien lo sabe, es agricultura: los pueblos de los llanos queman la sabana cada año para fertilizarla y atraer la caza a los brotes nuevos. Llevan siglos haciendo esto. El fuego es su herramienta más antigua.<br><br>
Del humo emerge una mujer montada en caballo con la misma naturalidad con que el chamán entra a la selva. Se detiene y mira las caras del grupo. Se ríe: <em>"Todos los norteños tienen esa cara la primera vez."</em>`,
    decisions: [
      { text: 'Pedirle que guíe al grupo a través del fuego. Ella sabe por dónde es seguro.', effects: { food: +5,  moral: +18, salud: -5,  union: +12 } },
      { text: 'Rodear el fuego por el este. Más largo pero sin riesgo.',                     effects: { food: -12, moral: +5,  salud: 0   } },
      { text: 'Esperar a que el fuego pase. Pueden ser días.',                               effects: { food: -15, moral: -5,  salud: +10, union: +8 } },
    ],
  },

  e_magdalena_b: {
    title: 'La Ciudad que No Está en los Mapas',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Colombia interior — ciudades perdidas',
    narr:  `La vegetación es tan espesa sobre la ladera que la ciudad tarda en hacerse visible. Primero bordes demasiado rectos para ser naturales. Luego escaleras. Luego paredes. Una ciudad abandonada, engullida a medias por el bosque pero no destruida — las piedras intactas, solo cubiertas.<br><br>
El chamán camina entre las estructuras con una expresión que el cacique nunca le vio: algo entre reverencia y rabia.<br><br>
<em>"La abandonaron para que los españoles no la encontraran. No porque no valiera nada — porque valía demasiado para arriesgarse a perderla."</em><br><br>
Es posible quedarse aquí sin ser visto. Es posible que ya haya alguien más aquí sin ser visto.`,
    decisions: [
      { text: 'Instalarse aquí unos días. La ciudad invisible es el refugio perfecto.',       effects: { food: +15, moral: +28, salud: +20, union: +18 } },
      { text: 'Registrar la ubicación exacta y seguir. Este lugar merece ser recordado.',     effects: { food: +5,  moral: +20, union: +12 } },
      { text: 'Seguir inmediatamente. Una ciudad abandonada puede tener razones para estar vacía.', effects: { food: -5, moral: +5, salud: -3 } },
    ],
  },

  e_guayana_b: {
    title: 'El Río Negro',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Guayana — aguas que no reflejan el cielo',
    narr:  `El río tiene el color exacto del café negro, pero transparente — tan oscuro que no refleja el cielo, solo absorbe la luz. El chamán lo reconoce y dice antes de que nadie pregunte: <em>"Aguas negras. La materia de las plantas en el agua las hace ácidas. Y eso significa algo importante: en estas aguas no viven los <span class="tt" data-tip="Aguas negras y malaria: los ríos de aguas negras del Amazonas son naturalmente ácidos, lo que los hace inhóspitos para los mosquitos Anopheles, transmisores de la malaria. Los pueblos que vivían en sus orillas sufrían menos paludismo que los de los ríos de aguas claras o blancas — una ventaja enorme para la salud y la población.">mosquitos que traen fiebre</span>."</em><br><br>
Un pueblo ribereño los observa desde sus canoas enormes. Proponen cruzarlos al otro lado. A cambio: tres días de trabajo para todos.`,
    decisions: [
      { text: 'Aceptar. Tres días de trabajo por cruzar sin enfermedades es una ganga.', effects: { food: +10, moral: +15, salud: +25, union: +12 } },
      { text: 'Negociar. Dos días y compartir conocimientos de medicina.',               effects: { food: +5,  moral: +18, salud: +20, union: +15 } },
      { text: 'Construir las propias canoas. No deben nada a nadie.',                    effects: { food: -10, moral: +5,  salud: +15 } },
    ],
  },

  e_andes_b: {
    title: 'El Camino de los Incas',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Andes — el Qhapaq Ñan, camino real inca',
    narr:  `El camino de piedra aparece entre la maleza como algo que no debería poder existir en la montaña: perfectamente construido, perfectamente ancho, con drenaje lateral que lo mantiene seco. Cada cierta distancia, una estructura de piedra pequeña con la puerta orientada al este y comida almacenada dentro — maíz seco, papa, charqui. Todavía comestible.<br><br>
Es el <span class="tt" data-tip="Qhapaq Ñan (Camino Real Inca): red de 40.000 km de caminos pavimentados que conectaba el Tawantinsuyu desde Colombia hasta Chile. Más extenso que las vías romanas en su apogeo. Los españoles lo destruyeron sistemáticamente porque facilitaba la coordinación de la resistencia indígena. Declarado Patrimonio de la Humanidad en 2014.">Qhapaq Ñan</span> — el camino real inca. Y el problema es que también es la ruta de los mensajeros españoles que reemplazaron a los chasquis.`,
    decisions: [
      { text: 'Usar el camino y los depósitos. La comida inca los puede sostener semanas.',       effects: { food: +35, moral: +15, salud: +15 } },
      { text: 'Tomar comida de los depósitos y apartarse del camino inmediatamente.',             effects: { food: +20, moral: +8,  salud: +8  } },
      { text: 'Ignorar el camino. Es demasiado visible. La seguridad vale más que la comodidad.', effects: { food: -8,  moral: +5,  salud: -5  } },
    ],
  },

  e_amazonas_b: {
    title: 'La Tortuga y la Serpiente',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Amazonas — la selva que enseña',
    narr:  `La anaconda cruza el sendero de manera lenta y segura — no huye, no ataca, simplemente cruza porque tiene todo el derecho de cruzar. Tiene el grosor del torso de un guerrero adulto. Los niños se paralizan.<br><br>
Un anciano del grupo al que nadie prestó mucha atención durante todo el viaje da un paso al frente. Se agacha, habla a la serpiente en voz muy baja. Y la anaconda termina de cruzar y desaparece entre las raíces.<br><br>
El anciano explica después sin vanidad: <em>"No la convencí de nada. Solo le dije que pasaríamos rápido y que no íbamos a romper nada."</em><br><br>
Esa tarde descubren una laguna llena de tortugas. Más comida de la que necesitan ahora mismo.`,
    decisions: [
      { text: 'Tomar solo las tortugas necesarias. Respetar el equilibrio del lugar.', effects: { food: +20, moral: +22, salud: +10, union: +15 } },
      { text: 'Tomar todo lo posible. No saben cuándo volverán a tener tanta comida.', effects: { food: +35, moral: -5,  union: -8  } },
      { text: 'No tomar ninguna. Hay algo sagrado en este lugar.',                     effects: { food: 0,   moral: +30, union: +20 } },
    ],
  },

  e_selva_profunda_b: {
    title: 'Los Que No Quieren Ser Encontrados',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Amazonia — pueblos en aislamiento voluntario',
    narr:  `Dos días sin cruzarse con nadie. El grupo empieza a creer que están solos cuando encuentran algo que hace lo contrario de tranquilizar: una barrera de palos enterrados que cruza el sendero de lado a lado, perfectamente recta, claramente intencional.<br><br>
No es una trampa — no hay mecanismo. Es un aviso.<br><br>
El chamán lo estudia: <em>"Este es el límite de alguien que eligió no ser encontrado. Están del otro lado. Saben que estamos aquí. Esperan para ver qué hacemos."</em><br><br>
Más allá puede haber comida, agua, refugio. O puede haber solo la voluntad de un pueblo de que el mundo los ignore. Los <span class="tt" data-tip="Pueblos en aislamiento voluntario: existen hoy entre 50 y 100 grupos indígenas en el Amazonas que eligieron no tener contacto con el exterior. Brasil y Perú tienen políticas de no-contacto que reconocen su derecho a ese aislamiento. El contacto forzado históricamente los ha diezmado en pocos años.">pueblos en aislamiento</span> tienen ese derecho.`,
    decisions: [
      { text: 'Respetar el límite. Rodear por el norte. Su elección de aislamiento es sagrada.',        effects: { food: -15, moral: +25, salud: -8,  union: +20 } },
      { text: 'Dejar una ofrenda junto a la barrera y retroceder. Que decidan ellos si quieren contacto.', effects: { food: -8, moral: +20, union: +15 } },
      { text: 'Cruzar con cuidado y manos visibles. La necesidad es mayor que el protocolo.',           effects: { food: +20, moral: -10, salud: +10, union: -10 } },
    ],
  },

  // ── ACTO III — EL SUR (primarios) ────────────────────────────

  e_altiplano: {
    title: 'El Techo del Mundo',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80',
    cap:   'Altiplano boliviano — Lago Titicaca',
    narr:  `El altiplano boliviano demuestra que el mundo puede ser completamente diferente dependiendo de dónde uno está parado. Frío durante el día. Helado de noche. Un sol que quema aunque la temperatura sea baja. El <span class="tt" data-tip="Lago Titicaca: el lago navegable más alto del mundo, a 3.812 metros de altitud. Para los incas era sagrado — el lugar donde el dios Sol (Inti) creó a los primeros seres humanos. Sus islas albergaban templos que los españoles saquearon sistemáticamente. Hoy los Uros construyen y habitan islas flotantes de totora en sus aguas.">Lago Titicaca</span> brilla a lo lejos como plata derramada.<br><br>
El pueblo llegó tan lejos que algunos ya no lo creen del todo. Y eso lo dice uno de los guerreros jóvenes en voz alta, por primera vez: <em>"Llevamos meses huyendo. Hay aldeas al este donde podemos instalarnos sin que nadie nos busque."</em> Doce personas asienten levemente. No con entusiasmo — con cansancio.`,
    decisions: [
      { text: 'Hablar con honestidad. Reconocer el cansancio, pero explicar por qué seguimos.', effects: { food: 0,  moral: +15, union: +20 } },
      { text: 'Dar libertad a quien quiera irse. El pueblo libre no obliga a nadie.',           effects: { food: +5, moral: -10, union: +5, warriors: -2, civilians: -3 } },
      { text: 'Afirmar tu autoridad. Nadie se va sin permiso.',                                effects: { food: 0,  moral: -18, union: -22 } },
    ],
  },

  e_amazonas_boliviano: {
    title: 'El Amazonas en su Nacimiento',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Bolivia amazónica — tierra de los mojos',
    narr:  `El Amazonas aquí, en sus fuentes bolivianas, no es el monstruo del este: son ríos anchos y tranquilos que serpentean por llanuras que se inundan cada año con la misma regularidad que el sol sale por el este. El pueblo <span class="tt" data-tip="Mojos (Llanos de Mojos): civilización precolombina de Bolivia amazónica. Construyeron uno de los sistemas hidráulicos más sofisticados del continente: canales, terraplenes y plataformas elevadas que controlaban las inundaciones estacionales y convertían tierras anegadas en campos productivos. El sistema cubría más de 100.000 km² y tardó dos mil años en construirse.">mojos</span> vive en plataformas elevadas sobre el agua.<br><br>
Tienen comida almacenada para meses y canales navegables que ningún caballo puede seguir. Pero tienen también sus propios problemas: una enfermedad extraña que mata adultos y deja con vida solo a los niños.`,
    decisions: [
      { text: 'Ayudar con los enfermos. El chamán sabe de estas cosas.',                       effects: { food: +20, moral: +25, salud: -5,  union: +20 }, allianceKey: 'mojos' },
      { text: 'Quedarse el tiempo necesario y seguir. No son los salvadores de nadie.',        effects: { food: +15, moral: +5,  salud: 0   } },
      { text: 'Ofrecer guerreros para defenderlos de sus enemigos a cambio de guía.',          effects: { food: +10, moral: +10, warriors: -2, union: +15 } },
    ],
  },

  e_tucuman: {
    title: 'El Último Campamento Español',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Quebradas del noroeste argentino',
    narr:  `El noroeste tiene el mismo color de tierra que el altiplano pero más quebrado. Barrancos colorados, quebradas que se abren sin aviso, cactus que crecen tres metros de alto. Y en una de esas quebradas: cinco soldados españoles y un sacerdote con un libro abierto, perdidos, discutiendo sobre la dirección. No saben que los observan.<br><br>
<em>"Podría golpearlos desde aquí"</em>, susurra el explorador desde el árbol. Los guerreros del suelo hacen gestos afirmativos. El chamán niega con la cabeza: el sacerdote lleva un libro. En ese libro probablemente hay un mapa.`,
    decisions: [
      { text: 'Emboscar y eliminar la patrulla antes de que informe su posición.',  effects: { food: +5,  moral: -5,  salud: -10, warriors: -2 } },
      { text: 'Dejarlos pasar. Rodear. La violencia atrae más violencia.',          effects: { food: -8,  moral: +5,  salud: 0   } },
      { text: 'Capturar al sacerdote solo. Su mapa vale más que su vida.',          effects: { food: 0,   moral: 0,   salud: -5,  warriors: -1, union: -5 } },
    ],
  },

  e_mendoza: {
    title: 'El Valle de la Abundancia',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80',
    cap:   'Valle andino — Mendoza, Argentina',
    narr:  `El valle se abre de golpe después de días de quebradas angostas. Ancho, verde, con agua que corre entre piedras. El <span class="tt" data-tip="Huarpes: pueblo indígena de la región de Cuyo (Mendoza, San Juan). Vivían de la agricultura en el árido piedemonte andino con sistemas de riego sofisticados, y de la pesca en las lagunas de Guanacache. Fueron repartidos en encomiendas a partir de 1551. En pocas generaciones su población colapsó por el trabajo forzado y las enfermedades.">pueblo huarpe</span> los observa desde la distancia sin atacar, con esa mirada de quien aprendió a no fiarse pero tampoco a atacar sin razón.<br><br>
Es la primera vez en meses que nadie los persigue activamente. El chamán lo dice en voz alta y suena extraño: <em>"Estamos solos. Solo nosotros."</em> La tentación de quedarse en este valle se siente en todos.`,
    decisions: [
      { text: 'Descansar dos semanas. La tribu necesita recuperarse antes del último tramo.', effects: { food: +25, moral: +25, salud: +20, union: +15 } },
      { text: 'Descansar solo unos días y seguir. El sur todavía está muy lejos.',           effects: { food: +12, moral: +12, salud: +10 } },
    ],
  },

  e_misiones: {
    title: 'Los Pueblos de Dios',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Misiones jesuitas — selva del nordeste argentino',
    narr:  `Las ruinas de piedra roja emergen de la selva — cruces enormes, campanas con su cadena todavía puesta. Entre las estructuras, <span class="tt" data-tip="Guaraníes en las misiones: las reducciones jesuitas (1609-1767) fueron un experimento único: ciudades-estado indígenas autogobernadas que combinaban cultura guaraní con tecnología europea. Los guaraníes mantenían su lengua, su música y sus estructuras sociales. Cuando los jesuitas fueron expulsados por Carlos III en 1767, las misiones colapsaron en meses y sus habitantes fueron esclavizados o dispersados.">guaraníes</span> vestidos con ropas que mezclan lo propio con lo ajeno.<br><br>
Un sacerdote jesuita sale solo, con las manos visibles y abiertas. Se detiene a distancia prudente: <em>"Los soldados del rey no entran aquí. Solo los de Dios. Y Dios tiene mucho espacio para los que huyen."</em>`,
    decisions: [
      { text: 'Entrar a la misión. Descansar, comer, curar. El sacerdote parece honesto.',  effects: { food: +30, moral: +15, salud: +25, union: +10 } },
      { text: 'Quedarse en los límites. Aceptar comida pero no entrar.',                   effects: { food: +18, moral: +5,  salud: +12 } },
      { text: 'Rechazar. Un refugio que depende de extranjeros no es un refugio real.',    effects: { food: -5,  moral: -5,  salud: -5  } },
    ],
  },

  e_pampas: {
    title: 'El Mar de Pasto',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'La Pampa — llanura sin fin',
    narr:  `La llanura no termina. El pasto llega a la cintura. No hay un árbol en el horizonte. El cielo ocupa tres cuartas partes de lo que se puede ver. Y en ese horizonte sin accidentes: una línea de puntos oscuros que se mueven. Los <span class="tt" data-tip="Ranqueles: pueblo indígena pampeano que adoptó el caballo en el siglo XVII, transformando radicalmente su modo de vida. Se convirtieron en jinetes formidables que resistieron la colonización hasta la llamada Conquista del Desierto de 1879 — la campaña militar argentina que los diezmó y desplazó de sus tierras para entregárselas a terratenientes europeos.">ranqueles</span> a caballo observan desde lejos, sin atacar, esperando ver qué hacen los recién llegados.`,
    decisions: [
      { text: 'Acercarse a los ranqueles. Llevan a los niños al frente para mostrar que no son guerreros.', effects: { food: +20, moral: +15, union: +15, salud: +5 }, allianceKey: 'ranqueles' },
      { text: 'Intentar capturar caballos. Cambiaría todo si pudieran montarlos.',                         effects: { food: +5,  moral: +10, salud: -5, warriors: -1 } },
      { text: 'Continuar sin detenerse. Los ranqueles son impredecibles.',                                 effects: { food: -8,  moral: -5,  salud: -5  } },
    ],
  },

  e_sierras: {
    title: 'El Último Refugio',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Sierras de Córdoba — el corazón del continente',
    narr:  `Las sierras de Córdoba son pequeñas comparadas con los Andes — colinas, en realidad — pero tienen agua abundante, arroyos claros, árboles que dan sombra. Y ningún español visible todavía.<br><br>
Una chamana local aparece en el campamento al amanecer sin que nadie la haya escuchado llegar. Se sienta junto al fuego como si hubiera sido invitada. <em>"Tres pueblos vivieron en estas sierras antes que yo. Los tres se fueron al sur. Los tres tardaron años en llegar. Ninguno volvió."</em> Pausa. <em>"El sur guarda a los que buscan silencio. Pero primero los prueba."</em>`,
    decisions: [
      { text: 'Descansar aquí un mes. Las provisiones lo permiten y el pueblo lo necesita.',           effects: { food: +20, moral: +30, salud: +25, union: +20 } },
      { text: 'Escuchar a la chamana local. Pedirle que enseñe lo que sabe de este territorio.',      effects: { food: +10, moral: +20, salud: +15, union: +18 }, allianceKey: 'sierras' },
      { text: 'Seguir. El descanso es tentador pero el destino todavía está lejos.',                  effects: { food: -5,  moral: +5,  salud: -5  } },
    ],
  },

  e_mapuches: {
    title: 'Los Que Nadie Conquistó',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Neuquén — tierra mapuche',
    narr:  `Los mapuches los rodean al amanecer — no un cerco de guerra, sino de observación. Nadie tiene arco levantado. Solo miran desde distancias distintas, sin apurarse.<br><br>
Su <span class="tt" data-tip="Longko: jefe mapuche elegido por consenso de su comunidad, no por herencia. El liderazgo mapuche era descentralizado — cada comunidad tenía el suyo. Esta estructura horizontal fue una ventaja táctica: los españoles no podían descabezar el movimiento porque no había una sola cabeza.">longko</span> se acerca solo y habla despacio: <em>"Sabemos de ustedes desde hace semanas. La selva habla. Los pájaros hablan. ¿Buscan tierra, o buscan silencio?"</em><br><br>
Los <span class="tt" data-tip="Mapuches: única civilización indígena de América que resistió con éxito tanto al Imperio Inca como a los españoles durante 300 años — la Guerra de Arauco. Los españoles firmaron el Tratado de Quilín en 1641, reconociendo la soberanía mapuche al sur del Biobío. Hoy son el pueblo indígena más numeroso de Argentina y Chile.">mapuches</span> nunca fueron conquistados. Saben algo que nadie más sabe todavía.`,
    decisions: [
      { text: 'Decir la verdad: buscamos las dos cosas. Tierra propia y silencio de los perseguidores.', effects: { food: +20, moral: +30, salud: +15, union: +25 }, allianceKey: 'mapuches' },
      { text: 'Pedir solo paso. No queremos quedarnos en tierra ajena.',                                effects: { food: +10, moral: +15, salud: +5  } },
      { text: 'Preguntar cómo se defienden de los españoles. Aprender su método.',                     effects: { food: +5,  moral: +20, union: +15, warriors: +2 } },
    ],
  },

  // ── ACTO III — EL SUR (variantes _b) ─────────────────────────

  e_altiplano_b: {
    title: 'La Fiesta que No Para',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80',
    cap:   'Altiplano — la Fiesta del Sol',
    narr:  `Llegan al altiplano en pleno <span class="tt" data-tip="Inti Raymi (Fiesta del Sol): la celebración más importante del calendario inca, en el solsticio de invierno (21 de junio). Agradecía al Sol su regreso y pedía por la cosecha. Los españoles la prohibieron en 1572. Fue revivida en Cusco en 1944 y hoy es Patrimonio Cultural Inmaterial del Perú.">Inti Raymi</span>. Miles de personas de docenas de pueblos distintos celebran juntas. Nadie pregunta quiénes son ni de dónde vienen. Hay comida para todos.<br><br>
Por primera vez en meses, los guerreros ríen. Los niños bailan. El chamán llora viendo el ceremonial que no veía desde su propia infancia en Guatemala.<br><br>
Quedarse significa ser visto. Ser visto puede llegar a oídos que no conviene.`,
    decisions: [
      { text: 'Quedarse tres días completos. El pueblo lo necesita más que la prudencia.',        effects: { food: +30, moral: +35, salud: +25, union: +25 } },
      { text: 'Quedarse solo una noche. Comer, descansar, y partir antes del alba.',             effects: { food: +18, moral: +20, salud: +15, union: +15 } },
      { text: 'Observar desde lejos y seguir. La cautela es la única razón por la que llegaron hasta aquí.', effects: { food: -5, moral: +10, union: +5 } },
    ],
  },

  e_amazonas_boliviano_b: {
    title: 'Los Canales del Mundo Antiguo',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Llanos de Mojos — la ingeniería perdida',
    narr:  `El sistema de canales se extiende hasta donde alcanza la vista en las cuatro direcciones: líneas perfectamente rectas que cortan la llanura y la convierten en un tablero de campos y agua. No son naturales — los construyeron y los mantienen, generación tras generación.<br><br>
Un anciano mojos los lleva a ver el punto donde dos canales se cruzan en ángulo recto. El agua fluye en ambas direcciones sin mezclarse.<br><br>
<em>"Dos mil años"</em>, dice. <em>"Dos mil años construyendo esto. Los españoles van a llegar y van a creer que es natural. No van a entender lo que es. Y cuando no entiendan, van a destruirlo."</em>`,
    decisions: [
      { text: 'Pedir que enseñen el sistema. Este conocimiento debe sobrevivir a los españoles.', effects: { food: +15, moral: +25, salud: +10, union: +20 }, allianceKey: 'mojos_ingenieros' },
      { text: 'Ayudar a construir un tramo nuevo. Trabajo a cambio de refugio y comida.',        effects: { food: +20, moral: +18, salud: +8,  union: +15 } },
      { text: 'Registrar todo lo posible y seguir. Preservar la memoria es lo máximo que pueden hacer.', effects: { food: +8, moral: +22, union: +10 } },
    ],
  },

  e_tucuman_b: {
    title: 'El Sacerdote que Pregunta',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Tucumán — el sacerdote diferente',
    narr:  `Un sacerdote español llega solo, sin escolta y sin armas visibles. Camina despacio con un libro abierto — no como quien reza, sino como quien lee mientras camina. Cuando ve al grupo, se sienta en el suelo a distancia prudente y espera.<br><br>
Cuando el cacique se acerca, dice algo inesperado: <em>"Vengo a escuchar, no a hablar. Me dijeron que hay aquí cosas que ningún europeo entendió todavía. Si me permiten escuchar, cambio por comida y medicamentos."</em><br><br>
Un <span class="tt" data-tip="Frailes dominicos como Bartolomé de las Casas denunciaron activamente las atrocidades de la conquista. Las Leyes Nuevas de 1542, que intentaron proteger a los indígenas de la esclavitud, fueron resultado directo de esas denuncias. Sin embargo, la evangelización misma fue también una forma de conquista cultural, aunque algunos la ejercieron con mayor respeto que otros.">dominico</span> que quiere escuchar es algo que no vieron antes. Eso no lo hace necesariamente de fiar.`,
    decisions: [
      { text: 'Hablar con él. Un europeo que quiere escuchar es algo que no han visto.',  effects: { food: +8,  moral: +18, union: +10 } },
      { text: 'Pedir comida y medicamentos a cambio de tiempo. Ser pragmáticos.',         effects: { food: +20, moral: +5,  salud: +15 } },
      { text: 'Rechazar. Independientemente de sus intenciones, representa al mismo sistema.', effects: { food: -5, moral: +10, union: +5 } },
    ],
  },

  e_mendoza_b: {
    title: 'El Vino que Nadie Pidió',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80',
    cap:   'Mendoza — las primeras vides',
    narr:  `Los huarpes los llevan a ver algo extraño: hileras ordenadas de plantas con hojas plateadas que los españoles plantaron y luego abandonaron cuando los atacaron. Crecieron solas, sin que nadie las cuidara, y ahora tienen frutos pequeños y ácidos.<br><br>
El chamán prueba uno y frunce el gesto. Pero los guerreros jóvenes los prueban también, uno tras otro, y hay una discusión genuina sobre si el sabor es malo o simplemente nuevo.<br><br>
<em>"Los europeos fermentan esto"</em>, dice uno que lo escuchó en algún lugar. <em>"Lo convierten en bebida."</em> Nadie sabe exactamente cómo, pero hay semanas de comida disponible si saben qué hacer con estas plantas.`,
    decisions: [
      { text: 'Dedicar una semana a estudiar las plantas. El conocimiento nunca sobra.',   effects: { food: +20, moral: +22, salud: +15, union: +18 } },
      { text: 'Tomar fruta suficiente para el camino y seguir.',                           effects: { food: +15, moral: +10, salud: +8  } },
      { text: 'Quemar las vides. Son símbolo de ocupación en tierra ajena.',               effects: { food: +5,  moral: +15, union: +8  } },
    ],
  },

  e_misiones_b: {
    title: 'La Fuga de la Misión',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Misiones — cuando el refugio se convierte en trampa',
    narr:  `A medianoche llegan doce guaraníes escapados de la misión. No hacen ruido. Conocen el bosque mejor que el propio grupo. Algunos son niños. Están asustados pero decididos — esa combinación de quien tomó una decisión irrevocable.<br><br>
Al amanecer, el sacerdote jesuita a cargo aparece solo en el límite del campamento. Sin soldados. Con esa expresión de quien sabe que perdió algo y está decidiendo cómo responder.<br><br>
<em>"Les doy hasta mañana"</em>, dice. <em>"Si para mañana quieren volver, los recibo. Si no, que Dios los guíe."</em><br><br>
Doce guaraníes miran al cacique. La decisión les pertenece a ellos. Pero su presencia cambia el peso del grupo en todos los sentidos.`,
    decisions: [
      { text: 'Llevarlos. Doce personas más es un peso, pero nadie se devuelve a la esclavitud.',      effects: { food: -15, moral: +30, union: +20, civilians: +8, warriors: +2 } },
      { text: 'Dejar que ellos decidan solos. No intervenir en la decisión de otros.',                 effects: { food: -3,  moral: +10, union: +8  } },
      { text: 'Hablar con el sacerdote. Negociar su silencio a cambio de dejar ir a los guaraníes.', effects: { food: -8,  moral: +15, union: +10, civilians: +4 } },
    ],
  },

  e_pampas_b: {
    title: 'El Caballo que Nadie Domó',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'La Pampa — caballos cimarrones',
    narr:  `Una manada de caballos salvajes cruza la llanura a plena velocidad — cientos de ellos, el suelo que tiembla antes de que lleguen, el viento que hacen al pasar. Son cimarrones, hijos de los caballos que los españoles perdieron y que ahora viven como si siempre hubieran sido de aquí.<br><br>
Un guerrero joven llamado Ixak los sigue con los ojos hasta que desaparecen en el horizonte. No dice nada por un rato. Luego: <em>"Puedo amansar uno."</em><br><br>
Nadie del pueblo montó a caballo jamás. Pero el chamán tiene una teoría sobre Ixak — que tiene una manera con los animales que va más allá de la técnica. Lo llama <em>"escuchar sin orejas"</em>.`,
    decisions: [
      { text: 'Dejar que Ixak lo intente. Si funciona, cambia todo lo que son capaces de hacer.', effects: { food: +5,  moral: +25, salud: -5,  union: +15 } },
      { text: 'Capturar caballos en grupo con lazos. Método probado aunque lento.',              effects: { food: +8,  moral: +15, salud: -8,  warriors: -1 } },
      { text: 'No intentarlo. Los caballos son del mundo de los españoles. No es el camino.',    effects: { food: -5,  moral: +5,  union: +5  } },
    ],
  },

  e_sierras_b: {
    title: 'La Cueva de las Manos',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Sierras — pinturas rupestres de diez mil años',
    narr:  `En lo alto de una sierra, en una cueva que protege de la lluvia y el viento, hay algo que deja al grupo en silencio completo: miles de manos pintadas en la roca. De todos los tamaños — de adultos, de niños, de ancianos. De todos los colores que el rojo y el negro y el blanco pueden hacer juntos.<br><br>
El chamán se sienta frente a ellas y no habla por un tiempo largo. Cuando lo hace, su voz suena diferente:<br><br>
<em>"Diez mil años. Antes de los incas. Antes de los mayas. Antes de nosotros. Alguien ponía su mano en la roca y la pintaba para decir una sola cosa: estuve aquí. Existí. No me olviden."</em><br><br>
Los niños del grupo se acercan y ponen las suyas al lado, sin que nadie se los pida.`,
    decisions: [
      { text: 'Dejar que los niños pinten sus propias manos. Este lugar lo merece.',        effects: { food: -3, moral: +35, union: +30 } },
      { text: 'Registrar el lugar pero no agregar nada. No alterar lo que tiene diez mil años.', effects: { food: -3, moral: +25, union: +20 } },
      { text: 'Agregar una marca del pueblo entero. Así otros sabrán que pasaron.',         effects: { food: -5, moral: +28, union: +25 } },
    ],
  },

  e_mapuches_b: {
    title: 'El Parlamento',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Neuquén — el parlamento mapuche',
    narr:  `El parlamento mapuche no tiene presidium ni jerarquía visible. Un círculo de doce <span class="tt" data-tip="Longko: jefe comunitario mapuche elegido por consenso, no por herencia. El poder mapuche era descentralizado — cada comunidad tenía el suyo. Esta estructura horizontal fue una ventaja táctica: los españoles no podían descabezar al movimiento porque no había una sola cabeza. Los líderes individuales podían ser capturados sin colapsar la resistencia.">longkos</span> donde cada uno habla exactamente el mismo tiempo que los demás. Sin interrupción.<br><br>
Le ofrecen al cacique hablar durante el tiempo que necesite. Y luego le preguntan, uno por uno: qué pasó en el norte. Cuántos son los de hierro. Cómo se mueven. Cuántos resisten. Si hay formas de combatirlos que el pueblo todavía no conoce.<br><br>
Este parlamento es también un sistema de inteligencia. Y saben más de lo que muestran.`,
    decisions: [
      { text: 'Contar todo con exactitud. Esta información puede salvar vidas mapuches.',             effects: { food: +15, moral: +30, union: +25 }, allianceKey: 'mapuches_parlamento' },
      { text: 'Contar lo esencial y omitir lo que puede desmoralizar. No toda la verdad ayuda.',     effects: { food: +10, moral: +20, union: +15 } },
      { text: 'Escuchar más de lo que se habla. Aprender del único pueblo que resistió.',            effects: { food: +8,  moral: +25, union: +22, warriors: +1 } },
    ],
  },

  // ── ACTO IV — EL DESTINO ──────────────────────────────────────

  e_encrucijada: {
    title: 'La Encrucijada del Sur',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia del norte — donde los caminos se separan para siempre',
    narr:  `Han caminado durante meses. Guatemala está tan lejos que algunos niños ya no pueden imaginarla. Los que eran cincuenta ahora son los que son. Cada uno lleva en el cuerpo la historia de lo que cruzaron.<br><br>
El chamán mayor convoca a todos en círculo. No hay fuego — hay luna llena.<br><br>
<em>"Llegamos hasta aquí juntos"</em>, dice. Su voz no tiembla. <em>"Sobrevivimos la selva, los ríos, las enfermedades, el frío, el miedo. Lo que viene no es una huida. Es una elección."</em><br><br>
Señala al este: la estepa sin fin, el viento libre, la tierra de los <span class="tt" data-tip="Tehuelches (Aonikenk): cazadores-recolectores patagónicos, descritos por cronistas europeos como los más altos del mundo. Cazaban guanacos con bolas arrojadizas. Los españoles intentaron colonizar la Patagonia dos siglos sin éxito. Su territorio fue tomado recién en el siglo XIX.">tehuelches</span> que nunca fueron conquistados.<br><br>
Señala al oeste: los Andes patagónicos, la lluvia constante, los canales infinitos donde los <span class="tt" data-tip="Kawésqar (Alacalufes): pueblo nómade marino de los canales patagónicos chilenos. Navegaban miles de kilómetros de canales de memoria, sin mapas. El contacto con europeos en el siglo XIX los devastó en pocas décadas. Hoy quedan menos de 20 hablantes del idioma kawésqar.">kawésqar</span> navegan con dominio sobrenatural del mar.<br><br>
Señala hacia adentro: el Amazonas que aquí comienza como un hilo de agua limpia.<br><br>
<em>"Tres caminos. Esta decisión ya no es solo tuya, cacique. Es de todos nosotros."</em>`,
    decisions: [
      { text: 'El Amazonas. Remontar el gran río hacia su origen. La selva nos ocultará para siempre — y nos volverá parte de ella.',                    effects: { food: -5,  moral: +22, union: +12 }, finalTag: 'dest_amazonas'      },
      { text: 'La Patagonia argentina. La estepa y el viento libre. Vivir como los tehuelches: invisibles para quienes buscan ciudades.',               effects: { food: -8,  moral: +18, union: +18 }, finalTag: 'dest_patagonia_arg' },
      { text: 'La Patagonia chilena. Cruzar los Andes hacia el Pacífico. Los canales del fin del mundo — donde el mar protege mejor que cualquier ejército.', effects: { food: -10, moral: +20, union: +14 }, finalTag: 'dest_patagonia_chi' },
    ],
  },

  // ── Nodos intermedios Acto IV ─────────────────────────────────

  e_confluencia: {
    title: 'Donde los Ríos Recuerdan',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Confluencia amazónica — el encuentro de las aguas',
    narr:  `Dos ríos se encuentran y no se mezclan de inmediato — el agua oscura choca con el agua clara y las dos corren paralelas durante kilómetros, como si cada una necesitara tiempo para decidir si rendirse o no. El chamán se sienta en la orilla y observa esto durante horas sin hablar.<br><br>
Al amanecer convoca a todos: <em>"En sueños escuché algo. No palabras — un sentido. Este lugar es el del recuerdo. El río que no olvida de dónde viene es más fuerte que el que llega más lejos."</em><br><br>
Hay gente que quiere quedarse. Hay gente que siente que el destino real está más adentro. La chamana joven que casi nunca habla dice por primera vez en semanas: <span class="tt" data-tip="El Encuentro de las Aguas es un fenómeno real y visible del Amazonas: el Río Negro y el río Solimões corren paralelos 6 km antes de mezclarse, por diferencias de temperatura, velocidad y densidad. Es uno de los fenómenos naturales más impresionantes de América del Sur, visible incluso desde el espacio."><em>"El río que no olvida su origen es más fuerte que el que llega más lejos."</em></span>`,
    decisions: [
      { text: 'Fundar aquí, en la confluencia. Que el pueblo sea como estas aguas: recuerda de dónde viene y sigue fluyendo.',                  effects: { food: +12, moral: +30, salud: +10, union: +28 } },
      { text: 'Seguir río arriba. Llegar hasta donde ningún río viene de ningún otro. Al principio.',                                          effects: { food: -8,  moral: +25, salud: -5,  union: +15 } },
      { text: 'Aprender de ambos ríos: construir dos grupos que vivan separados pero próximos, y se mezclen con el tiempo.',                   effects: { food: +8,  moral: +22, salud: +8,  union: +20 } },
    ],
  },

  e_confluencia_b: {
    title: 'El Nombre del Lugar',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Confluencia amazónica — el momento de nombrar',
    narr:  `Acampan junto a la confluencia tres días. En el tercero, algo ocurre que nadie esperaba: los niños empiezan a llamar al lugar con un nombre que ningún adulto les enseñó. Lo dicen juntos, como si lo hubieran soñado en la misma noche.<br><br>
El chamán escucha el nombre y se queda muy quieto. Es una palabra de la lengua antigua — la que ya casi nadie usa — que significa algo parecido a <em>"el lugar donde las cosas distintas aprenden a ser una"</em>.<br><br>
Los <span class="tt" data-tip="Ribereños amazónicos: comunidades que organizan su vida entera alrededor del ritmo del río. Sus casas se construyen sobre palafitos para adaptarse a las crecidas anuales de hasta 15 metros. Conocen el calendario del río mejor que cualquier almanaque: cuándo subirá, cuánto, cuándo bajará.">pueblos del río</span> cercanos oyen el nombre y lo reconocen. Dicen que ese lugar siempre tuvo ese nombre — que solo esperaba que alguien lo recordara en voz alta.`,
    decisions: [
      { text: 'Aceptar el nombre como señal. Este lugar los estaba esperando.',                                          effects: { food: +10, moral: +35, salud: +8,  union: +32 } },
      { text: 'Consultar con los ancianos si el nombre tiene consecuencias. Nombrar un lugar es también reclamarlo.',    effects: { food: +5,  moral: +28, salud: +5,  union: +25 } },
      { text: 'Registrar el nombre y seguir. El lugar merece una ceremonia que todavía no pueden hacer.',                effects: { food: +8,  moral: +22, salud: +5,  union: +18 } },
    ],
  },

  e_lagunas_azules: {
    title: 'El Espejo del Cielo',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Patagonia — lagunas turquesa en la estepa',
    narr:  `En medio de la estepa seca, sin aviso, aparece un campo de lagunas del color exacto entre el verde y el azul, translúcidas, con <span class="tt" data-tip="Flamenco austral (Phoenicopterus chilensis): habita las lagunas saladas y alcalinas de la Patagonia y el altiplano andino. Su color rosado proviene de los pigmentos de los crustáceos que consume. Puede volar cientos de kilómetros entre lagunas siguiendo rutas aprendidas de sus padres. Es una especie en peligro de extinción.">flamencos rosados</span> que vuelan sin apuro sobre el agua.<br><br>
El agua es potable. Hay peces. Los flamencos no huyen cuando la tribu se acerca — señal, dice el chamán, de que este lugar no conoce el miedo todavía.<br><br>
Antes de que nadie pueda decirles que esperen, los niños corren hacia el agua y entran riendo. Por primera vez en meses, el pueblo ríe.`,
    decisions: [
      { text: 'Quedarse varios días. Los cuerpos y el espíritu necesitan esto más que la velocidad.', effects: { food: +18, moral: +35, salud: +25, union: +30 } },
      { text: 'Tomar agua, descansar una noche y seguir. El destino no espera.',                     effects: { food: +10, moral: +20, salud: +15, union: +15 } },
      { text: 'Explorar si hay tehuelches cerca. En un lugar así, alguien ya vive o viene.',         effects: { food: +8,  moral: +22, salud: +10, union: +20 }, allianceKey: 'tehuelches_laguna' },
    ],
  },

  e_lagunas_azules_b: {
    title: 'La Tormenta sobre las Lagunas',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia — cuando el cielo cae sobre el agua',
    narr:  `Están descansando junto a las lagunas cuando el cielo cambia en minutos. Una tormenta patagónica cae sin aviso: viento que dobla los arbustos hasta tocar el suelo, lluvia horizontal que corta la cara, truenos que rebotan en la estepa plana sin montañas que los absorban.<br><br>
No hay refugio natural visible. El chamán señala el centro de la laguna más grande: los flamencos se agruparon allí sobre el agua, completamente quietos. <em>"Ellos saben algo que nosotros todavía no sabemos"</em>, dice.<br><br>
Las <span class="tt" data-tip="Tormentas en la Patagonia: la estepa patagónica tiene una de las mayores actividades eléctricas del hemisferio sur. Sin árboles altos ni relieves marcados, los rayos caen directamente sobre la llanura. Los pueblos tehuelches desarrollaron técnicas específicas para sobrevivir estas tormentas, incluyendo mantenerse en grupos compactos y alejarse de objetos salientes.">tormentas patagónicas</span> son un enemigo con el que los tehuelches aprendieron a convivir durante milenios.`,
    decisions: [
      { text: 'Entrar al agua como los flamencos. Si ellos están seguros ahí, el pueblo también.',          effects: { food: 0,   moral: +28, salud: +5,  union: +35 } },
      { text: 'Buscar una hondonada baja en la estepa. El punto más bajo es el más seguro del rayo.',      effects: { food: +5,  moral: +15, salud: +10, union: +20 } },
      { text: 'Construir rápido un refugio colectivo con los materiales que llevan. Trabajar juntos.',     effects: { food: -5,  moral: +20, salud: +8,  union: +30 } },
    ],
  },

  e_bosque_milenario: {
    title: 'Los Árboles que Vieron Todo',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Bosque valdiviano — árboles de tres mil años',
    narr:  `Los árboles son tan anchos que tres personas con los brazos extendidos no pueden rodear el tronco. Sus raíces emergen del suelo como paredes naturales. La luz llega oblicua, en rayos sólidos de polvo dorado que hacen el bosque parecer un templo que nadie construyó.<br><br>
El chamán pone la palma sobre un tronco y cierra los ojos. Permanece así demasiado largo para ser incomodidad, demasiado corto para ser sueño. Cuando los abre: <em>"Tiene tres mil años. Cuando era joven, los olmecas construían sus cabezas de piedra gigantes. Vio todo lo que no vimos."</em><br><br>
Los <span class="tt" data-tip="Alerce (Fitzroya cupressoides): el árbol más longevo de América del Sur, con ejemplares de más de 3.600 años. Crece a ritmo de milímetros por año en la Patagonia chilena y argentina. Fue talado masivamente en los siglos XIX y XX. Hoy está protegido por ley en Chile y Argentina.">alerces</span> fueron sagrados para todos los pueblos que vivieron aquí.`,
    decisions: [
      { text: 'Pedir permiso al bosque para quedarse. Hacer un rito de llegada.',         effects: { food: +5,  moral: +38, salud: +10, union: +32 } },
      { text: 'Construir las primeras chozas entre las raíces. Este bosque es ya nuestra casa.', effects: { food: +15, moral: +28, salud: +15, union: +22 } },
      { text: 'Dejar ofrendas y seguir hacia la costa. El mar es el destino final.',      effects: { food: +8,  moral: +25, salud: +8,  union: +18 } },
    ],
  },

  e_bosque_milenario_b: {
    title: 'La Memoria del Musgo',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Bosque valdiviano — el musgo que lo cubre todo',
    narr:  `El musgo cubre todo — cada tronco, cada piedra, cada rama caída. No es decoración: es la vida dentro de la vida, el bosque dentro del bosque. Caminar entre estos árboles amortigua los sonidos: los pasos no hacen ruido, las voces se apagan, el viento llega convertido en susurro.<br><br>
Una niña de seis años se sienta en un tronco cubierto de musgo y no quiere levantarse. <em>"Está caliente"</em>, dice. Es verdad — el musgo retiene el calor del día durante la noche.<br><br>
Los <span class="tt" data-tip="Bosque valdiviano: uno de los dos únicos bosques templados lluviosos del hemisferio sur (el otro está en Nueva Zelanda). Recibe hasta 4.000 mm de lluvia anuales. Los pueblos mapuche y kawésqar conocían sus propiedades medicinales — hongos, musgos y cortezas para tratar desde infecciones hasta fracturas óseas.">pueblos originarios del bosque</span> usaban el musgo como aislante, colchón, vendaje y filtro de agua.`,
    decisions: [
      { text: 'Aprender del musgo. Estudiar cómo vive y qué puede hacer por el pueblo.',              effects: { food: +10, moral: +30, salud: +20, union: +25 } },
      { text: 'Instalarse donde el musgo es más espeso. La niña tenía razón: el calor es real.',      effects: { food: +8,  moral: +32, salud: +25, union: +28 } },
      { text: 'Recolectar musgo para el viaje. Es liviano y puede salvar vidas en el frío.',         effects: { food: +5,  moral: +22, salud: +18, union: +15 } },
    ],
  },

  // ── Rama A — Alto Amazonas ────────────────────────────────────

  e_amazonia_final_a: {
    title: 'Subir al Origen',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Alto Amazonas — remontando el río sagrado',
    narr:  `Remontar el Amazonas es navegar contra el tiempo. El río se angosta, se aclara, se vuelve más rápido. Los animales son menos cautelosos — no aprendieron todavía a temerle a los humanos que llegan de abajo.<br><br>
Al décimo día encuentran algo que detiene al grupo entero: un árbol enorme con marcas talladas en la corteza. Geométricas, precisas, del mismo tipo de escritura que el chamán reconoce de la lengua antigua del norte.<br><br>
Alguien de su pueblo, o de un pueblo hermano, estuvo aquí. No saben cuándo. No saben si volvió.<br><br>
<em>"Este árbol"</em>, dice el chamán con una voz rara, <em>"tiene la misma edad que nuestra escritura."</em>`,
    decisions: [
      { text: 'Detenerse aquí. El árbol es una señal. Este es el lugar.',            effects: { food: +10, moral: +35, salud: +10, union: +25 } },
      { text: 'Seguir río arriba. Si alguien pasó antes, el lugar real está más adentro.', effects: { food: -10, moral: +20, salud: -5,  union: +10 } },
    ],
  },

  e_amazonia_final_b: {
    title: 'El Río Que Sube',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Alto Amazonas — remontar hacia el origen',
    narr:  `Navegan río arriba y el mundo cambia gradualmente. El río se angosta, el agua se aclara, la selva se vuelve más antigua. Los animales son menos cautelosos — no aprendieron todavía a temerle a los humanos que llegan desde abajo.<br><br>
En el séptimo día, otra canoa los alcanza remando con velocidad notable. Son una familia de <span class="tt" data-tip="Shipibo-Conibo: pueblo indígena del alto Amazonas peruano. Conocidos por sus diseños geométricos que representan visiones del cosmos. Son expertos en medicina botánica. Su conocimiento del río es considerado enciclopédico por los investigadores que lo estudiaron.">shipibos</span> — adultos, niños, un anciano. Llevan tres generaciones haciendo el mismo recorrido: subir el río cuando el mundo de abajo se vuelve peligroso.`,
    decisions: [
      { text: 'Navegar juntos con los shipibos. Hay fuerza en los que comparten destino.',        effects: { food: +20, moral: +28, union: +22 }, allianceKey: 'shipibo' },
      { text: 'Aprender de ellos todo lo posible y luego seguir caminos distintos.',             effects: { food: +12, moral: +22, union: +15 } },
      { text: 'Dejarlos seguir su camino. Cada pueblo tiene su propio río.',                    effects: { food: +5,  moral: +15, union: +10 } },
    ],
  },

  e_fin_amazonas: {
    title: 'El Pueblo del Río Naciente',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Nacientes del Amazonas — el origen del agua',
    narr:  `El agua aquí es completamente distinta al río grande del este. Transparente, fría, rápida. Nace de una grieta en la roca cubierta de musgo. El Amazonas — ese monstruo de cinco mil kilómetros — comienza como un hilo de agua que cualquier niño del grupo podría cruzar de un salto.<br><br>
Tu pueblo se detiene.<br><br>
El chamán camina hasta el nacimiento, se arrodilla, moja las manos. Se queda así, con los ojos cerrados. Los demás lo rodean en silencio.<br><br>
Cuando levanta la vista, tiene los ojos húmedos. No de tristeza — de algo que es lo contrario exacto del miedo.<br><br>
<em>"Llegamos al principio"</em>, dice. <em>"Desde aquí, el mundo solo puede crecer."</em>`,
    decisions: [
      { text: 'Fundar aquí. Junto al origen del río más grande del mundo. Nadie nos encontrará nunca.', effects: { food: +15, moral: +40, salud: +15, union: +30 }, finalTag: 'amazonas_refugio' },
      { text: 'Construir una aldea flotante. Vivir sobre el río como los del río nos enseñaron.',       effects: { food: +20, moral: +30, salud: +20, union: +20 }, finalTag: 'amazonas_agua'   },
      { text: 'Integrarse con los guardianes de la selva profunda. Convertirnos en ellos.',            effects: { food: +25, moral: +25, salud: +25, union: +15 }, finalTag: 'amazonas_selva'  },
    ],
  },

  // ── Rama B — Patagonia Argentina ─────────────────────────────

  e_patagonia_arg_a: {
    title: 'El Río que Marca el Fin',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Río Negro — el límite sur del mundo conocido',
    narr:  `El Río Negro es ancho y oscuro y huele a tierra mojada y tiempo. Al norte: historia conocida — conquista, huida, sangre. Al sur: silencio. Un silencio que no es vacío sino esperando.<br><br>
Los <span class="tt" data-tip="Tehuelches (Aonikenk): cazadores-recolectores patagónicos. Los cronistas europeos los describieron como los más altos del mundo. Cazaban guanacos con bolas arrojadizas y arco. Los españoles nunca los sometieron. Fueron diezmados en el siglo XIX por las expediciones militares argentinas y las enfermedades.">tehuelches</span> los observan cruzar desde la orilla sur sin impedir el paso. Un anciano lanza hacia el grupo algo que cae cerca de los pies del cacique: un hueso con marcas, envuelto en cuero.<br><br>
<em>"Es un saludo"</em>, dice el chamán. <em>"Dice: bienvenidos al sur del mundo. Y dice: han llegado más lejos de lo que creían posible."</em>`,
    decisions: [
      { text: 'Cruzar el río y acercarse al anciano tehuelche con respeto.',                         effects: { food: +10, moral: +25, salud: +5,  union: +20 }, allianceKey: 'tehuelches' },
      { text: 'Cruzar en silencio. Asentarse lejos del territorio tehuelche. No molestar.',          effects: { food: -5,  moral: +15, salud: 0,   union: +10 } },
      { text: 'Cruzar y buscar el punto más inhóspito. Donde nadie quiera vivir, estarán seguros.',  effects: { food: -15, moral: +10, salud: -10 } },
    ],
  },

  e_patagonia_arg_b: {
    title: 'El Primer Invierno',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Patagonia argentina — el primer invierno del sur',
    narr:  `El invierno patagónico llega sin transición. En tres días la temperatura cae veinte grados. El viento que antes era constante ahora corta. El grupo no tiene las pieles ni los conocimientos para esto — vienen de climas que no enseñan el frío como amenaza de vida.<br><br>
Los tehuelches aparecen de nuevo, sin ser anunciados. Esta vez traen algo: pieles dobladas y leña ya cortada. Las dejan en un punto equidistante entre ellos y el campamento, se miran entre sí, y se van sin una palabra.<br><br>
No piden nada. No esperan agradecimiento visible. Solo lo hacen.`,
    decisions: [
      { text: 'Aceptar las pieles y la leña. Y dejar algo propio donde estaban.',                    effects: { food: +5,  moral: +30, salud: +25, union: +20 } },
      { text: 'Seguir a los tehuelches para agradecerles directamente.',                             effects: { food: +10, moral: +25, salud: +20, union: +25 }, allianceKey: 'tehuelches_invierno' },
      { text: 'Sobrevivir solos con lo que tienen. No crear dependencia.',                           effects: { food: -12, moral: +15, salud: -10, union: +10 } },
    ],
  },

  e_fin_patagonia_arg: {
    title: 'La Estepa del Fin del Mundo',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia argentina — viento y estrellas',
    narr:  `El viento es constante como una presencia viva — no hostil, sino insistente. El cielo nocturno tiene más estrellas de las que ninguno vio en su vida entera, como si el sur tuviera un cielo diferente al del norte.<br><br>
El anciano chamán camina solo hasta una laguna de color turquesa. Se sienta. Uno por uno, todos se acercan y se sientan también, sin que nadie lo pida. Un círculo que se forma solo.<br><br>
El chamán habla sin levantar la vista del agua: <em>"Este viento viene del sur profundo. Nadie sabe de dónde exactamente. Nadie fue más lejos y volvió para contarlo."</em><br><br>
Pausa. El viento.<br><br>
<em>"Eso significa que estamos en el último lugar. El único donde nadie buscará lo que no sabe que existe."</em>`,
    decisions: [
      { text: 'Fundar junto a la laguna. Hacer de este lugar el corazón de un pueblo nuevo.',                      effects: { food: +10, moral: +40, salud: +15, union: +35 }, finalTag: 'patagonia_arg_aldea'  },
      { text: 'Vivir como los tehuelches: moverse con las estaciones, sin dejar marca.',                          effects: { food: +20, moral: +25, salud: +20, union: +20 }, finalTag: 'patagonia_arg_nomada' },
      { text: 'Construir señales para los que vendrán después. Este lugar debe ser encontrado por otros fugitivos.', effects: { food: +5, moral: +30, salud: +10, union: +25 }, finalTag: 'patagonia_arg_faro'   },
    ],
  },

  // ── Rama C — Patagonia Chilena ────────────────────────────────

  e_patagonia_chi_a: {
    title: 'El Paso de los Cóndores',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Paso andino — cruzando hacia el Pacífico',
    narr:  `Los Andes patagónicos son más bajos que en el norte pero más húmedos. El paso está cubierto de niebla espesa y los <span class="tt" data-tip="Cóndor andino (Vultur gryphus): el ave voladora más grande del mundo, con una envergadura de hasta 3,2 metros. Vuela usando corrientes térmicas sin batir las alas durante horas. Casi todos los pueblos andinos lo veneraban como mensajero entre el mundo visible y el de los ancestros. Hoy está en peligro de extinción.">cóndores</span> vuelan en círculos sobre el grupo — señal, dice el chamán, de que los ancestros están mirando.<br><br>
Al bajar hacia el oeste, el cambio es total y repentino: selva oscura cubierta de musgo, ríos transparentes entre las piedras, lluvia constante que parece parte del lugar más que un evento.<br><br>
Nadie en el grupo tiene palabras para esta belleza específica. Ninguna lengua que conocen las tiene.`,
    decisions: [
      { text: 'Avanzar rápido antes de que la niebla cierre el paso.',         effects: { food: -10, moral: +20, salud: -8,  warriors: -1 } },
      { text: 'Ir despacio, con cuidado. Este lugar merece ser visto.',        effects: { food: -18, moral: +30, salud: -5,  union: +10  } },
    ],
  },

  e_patagonia_chi_b: {
    title: 'La Lluvia que No Para',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Patagonia chilena — la lluvia interminable',
    narr:  `Llueve sin parar durante cuatro días. El bosque absorbe el agua y la devuelve en cascadas. Los niños tosen. La ropa nunca se seca del todo. El suelo es barro blando bajo el musgo.<br><br>
Y sin embargo: hongos comestibles en cada árbol caído, agua pura en cada roca, peces en cada riachuelo. La abundancia y la incomodidad coexisten sin contradicción.<br><br>
Los kawésqar tienen una palabra que nadie puede traducir exactamente: <em>jemás</em>. El chamán la estudia horas. <em>"Creo que significa el estado de estar completamente a merced del clima — y encontrar paz en eso. No resignación. Paz activa."</em>`,
    decisions: [
      { text: 'Aprender jemás. Rendirse al clima en vez de combatirlo.',                      effects: { food: +20, moral: +30, salud: +15, union: +25 } },
      { text: 'Construir refugios más sólidos. Hay que dominar el ambiente, no rendirse.',    effects: { food: +10, moral: +10, salud: +20, union: +10 } },
      { text: 'Seguir moviéndose bajo la lluvia. Detenerse es morir.',                       effects: { food: +5,  moral: +5,  salud: -5,  union: +5  } },
    ],
  },

  e_fin_patagonia_chi: {
    title: 'Los Canales del Fin del Mundo',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Patagonia chilena — canales y bosques milenarios',
    narr:  `El mar entra por la tierra en canales interminables, como si el océano hubiera decidido colonizar el continente. No hay horizonte visible — solo más canales, más bosques, más agua que refleja el cielo gris.<br><br>
Los <span class="tt" data-tip="Kawésqar (Alacalufes): pueblo nómade marino de los canales patagónicos chilenos. Vivían en canoas de corteza, cazaban lobos marinos y recorrían miles de kilómetros de canales de memoria, sin mapas. El contacto con europeos en el siglo XIX los devastó rápidamente. Hoy quedan menos de 20 personas que hablan el idioma kawésqar.">kawésqar</span> se acercan en canoas sin mostrar miedo — vieron llegar a otros por el paso de la montaña antes. El anciano kawésqar señala el horizonte marino y dice algo que el chamán tarda en interpretar.<br><br>
<em>"Creo que dice: el agua cuida a los que la respetan. Pero también exige que la aprendan."</em>`,
    decisions: [
      { text: 'Aprender a vivir sobre el agua. Los kawésqar pueden enseñar.',                           effects: { food: +20, moral: +35, salud: +15, union: +30 }, finalTag: 'chile_agua',   allianceKey: 'kawesqar' },
      { text: 'Asentarse en la costa, entre el bosque y el mar. Lo mejor de los dos mundos.',          effects: { food: +15, moral: +30, salud: +20, union: +20 }, finalTag: 'chile_costa'  },
      { text: 'Internarse en el bosque milenario. Donde los árboles tienen mil años, nadie puede encontrarnos.', effects: { food: +10, moral: +40, salud: +10, union: +15 }, finalTag: 'chile_bosque' },
    ],
  },

  // ── EVENTO ESPECIAL: el conquistador alcanza al grupo ─────────

  _conq_catch: {
    title: '¡Los Conquistadores te Han Alcanzado!',
    act:   'Acto — Persecución',
    img:   'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
    cap:   'El momento que todos temían',
    narr:  `Llegaron antes del amanecer. Los perros de rastreo los encontraron — el olor del fuego, las huellas en el barro. Las antorchas brillan entre los árboles y el sonido de los cascos ya se distingue del viento.<br><br>
No hay tiempo para pensar. Solo para actuar. Cada decisión vale una vida — o todas.<br><br>
<span class="tt" data-tip="En situaciones de captura, los conquistadores solían tomar prisioneros para la encomienda o para exigir información sobre otros grupos. Las posibilidades de escape dependían del terreno, la oscuridad y la disposición a sacrificarse mutuamente.">Los guerreros miran al cacique</span>. Esperan una orden. La oscuridad todavía puede ser aliada — pero solo por unos minutos más.`,
    decisions: [
      {
        text: 'Dispersarse en la oscuridad. Cada uno por su cuenta — en el caos, algunos escapan.',
        effects: { food: -20, moral: -25, salud: -15, warriors: -4, civilians: -6, shamans: -1 },
      },
      {
        text: 'Los guerreros forman barrera. Los demás huyen mientras ellos compran tiempo con su vida.',
        effects: { food: -15, moral: +5,  salud: -10, warriors: -8, civilians: -2 },
      },
      {
        text: 'Rendirse. Negociar desde la debilidad — quizás el cacique pueda salvar a los niños.',
        effects: { food: 0,   moral: -45, salud: -5,  warriors: -6, civilians: -4, shamans: -2 },
      },
    ],
  },

}
