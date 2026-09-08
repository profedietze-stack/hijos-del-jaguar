import type { GameEvent } from './types.js'

// ══════════════════════════════════════════════════════
// EVENTOS DEL JUEGO — 87 eventos, 4 Actos
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


  // ── ACTO I — Nodos nuevos ───────────────────────────────────

  e_volcanes: {
    title: 'La Boca del Dios',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=1200&q=80',
    cap:   'Volcán Santiaguito — Guatemala',
    narr:  `El Santiaguito lanza ceniza como si supiera que su pueblo huye. El chamán mayor detiene el grupo al borde del cráter dormido y cierra los ojos: <em>"Ixchel habla desde las piedras calientes. Pide algo antes de dejarnos ir."</em><br><br>
Todos miran el volcán. La columna de ceniza dibuja formas — o quizás nadie puede evitar ver formas cuando tiene miedo. Un guerrero viejo cuenta que su abuelo conocía el camino por las faldas interiores del volcán, un sendero que los conquistadores nunca encontraron en sus mapas.<br><br>
Pero el suelo tiembla. Y cada temblor puede ser el preludio de algo peor, o solo el volcán durmiendo. Los <span class="tt" data-tip="Kaqchikeles: pueblo maya que habitó el altiplano guatemalteco central. Su capital era Iximché. Aliados iniciales de los españoles por rivalidades con los k'iches, luego resistieron la ocupación cuando llegaron las cargas tributarias. La región volcánica era su territorio sagrado — el volcán Santiaguito era considerado morada de deidades.">ancianos kaqchikeles</span> dicen que el volcán protege a quienes lo respetan.`,
    decisions: [
      { text: 'Realizar la ofrenda que pide el chamán. La ceniza sagrada marcará el camino correcto.', effects: { food: -6,  moral: +18, salud: 0,   union: +12 } },
      { text: 'Tomar el sendero interior del volcán. La vieja ruta que los mapas españoles no tienen.', effects: { food: -4,  moral: +10, salud: -8,  warriors: +1 } },
      { text: 'Alejarse de las faldas. Un volcán activo no distingue entre perseguido y perseguidor.', effects: { food: -8,  moral: +5,  salud: +5,  civilians: 0 } },
    ],
  },

  e_volcanes_b: {
    title: 'Polvo de Estrellas',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&q=80',
    cap:   'Ceniza volcánica — altiplano de Guatemala',
    narr:  `La lluvia de ceniza cae sobre el grupo como una noche a mediodía. Los caballos de los conquistadores que se acercan resoplan y se niegan a avanzar — la ceniza les irrita los ojos, los desorienta. Por primera vez desde que comenzó la huida, el grupo tiene una ventaja que no pidieron.<br><br>
Una niña de siete años señala al cielo cenizo: <em>"El volcán nos está tapando."</em> El guerrero más viejo asiente despacio. Algunos pueblos del altiplano conocen estas tormentas de ceniza como <span class="tt" data-tip="Toscaltetl (náhuatl): polvo de los dioses. Las erupciones volcánicas menores eran interpretadas como mensajes o protecciones divinas por varios pueblos mesoamericanos. El volcán Santa María y el Santiaguito fueron escenario de encuentros entre pueblos refugiados y fuerzas coloniales durante décadas.">toscaltetl</span> — el polvo de los dioses — y saben que duran exactamente el tiempo necesario.<br><br>
Pero hay que decidir: aprovechar la confusión para correr, o detenerse y que la ceniza borre las huellas del grupo del suelo.`,
    decisions: [
      { text: 'Correr mientras los caballos están ciegos. Es ahora o nunca.', effects: { food: -3, moral: +15, salud: -6, warriors: 0 } },
      { text: 'Detenerse. Dejar que la ceniza entierre las huellas. El rastro desaparecerá.', effects: { food: -2, moral: +8,  salud: 0,  union: +8  } },
    ],
  },

  e_sierra_madre: {
    title: 'Los Tejidos del Viento',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=80',
    cap:   'Bosque nublado — Sierra Madre de Chiapas',
    narr:  `El camino sube durante horas. A tres mil metros, la neblina lo convierte todo en susurros. El grupo encuentra algo que no esperaba: otra tribu que también huye.<br><br>
Son <span class="tt" data-tip="Tzotziles: pueblo maya de los Altos de Chiapas. Su nombre en su propio idioma, Batz'i k'op, significa 'el verdadero hablar'. Habitaron la Sierra Madre de Chiapas durante siglos y resistieron la conquista española durante más tiempo que muchos pueblos del sur. Su territorio de alta montaña era difícil para los caballos y arcabuces españoles.">tzotziles</span> de los Altos de Chiapas — quince personas, la mitad niños. Llevan menos comida que el grupo, pero conocen cada piedra de esta sierra. Su guía más anciano, una mujer de pelo completamente blanco, estudia al cacique durante un minuto largo sin decir nada. Luego habla en tzotzil. Una joven traduce: <em>"Dice que tus ojos parecen de alguien que sabe adónde va pero no sabe cómo llegar."</em><br><br>
La montaña brumosa devuelve el eco de cascos de caballos, lejanos aún, desde el valle.`,
    decisions: [
      { text: 'Unirse a los tzotziles. Dos grupos solos mueren; uno junto puede sobrevivir.', allianceKey: 'tzotziles', effects: { food: -8, moral: +15, salud: +5,  civilians: +8, union: +15 } },
      { text: 'Aceptar solo su guía. Ella conoce el camino; el grupo le da protección a cambio.',  effects: { food: -5, moral: +10, salud: 0,   warriors: +1, union: +8  } },
      { text: 'Seguir solos. Más gente es más ruido, más rastro, más riesgo.',                     effects: { food: -3, moral: -5,  salud: 0,   warriors: 0,  union: -5  } },
    ],
  },

  e_sierra_madre_b: {
    title: 'La Niebla que Esconde',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&q=80',
    cap:   'Niebla densa — altas cumbres de Chiapas',
    narr:  `La niebla de la sierra tiene una consistencia que el grupo no conocía: no es niebla que pasa, es niebla que se queda. Los rastreadores pierden el rastro — nadie puede seguir huellas en roca cubierta de musgo mojado.<br><br>
Por primera vez en días, el grupo puede detenerse sin miedo. Un guerrero joven propone aprovechar el tiempo para descansar de verdad: curar heridas, reparar sandalias, enseñar a los niños pequeños cómo caminar sin hacer ruido. Hay agua en todas partes — los helechos gotean.<br><br>
El chamán encuentra <span class="tt" data-tip="Plantas medicinales de los Altos de Chiapas: el bosque de niebla (mesófilo de montaña) de la Sierra Madre contiene una biodiversidad extraordinaria. Los pueblos tzotzil y tzeltal conocían plantas como la hierba santa (Piper auritum), el árnica silvestre, y diversas orquídeas con propiedades medicinales que los chamanes usaban para tratar heridas, fiebres y estados de ánimo colectivo.">plantas medicinales de la niebla</span> que en el valle no existen. La chamana dice que pueden sanar heridas que parecían perdidas.`,
    decisions: [
      { text: 'Descansar dos días completos. El cuerpo y el espíritu del grupo están al límite.',  effects: { food: -10, moral: +20, salud: +20, union: +10 } },
      { text: 'Solo una noche. Suficiente para curar heridas, no suficiente para confiarse.',       effects: { food: -6,  moral: +12, salud: +12, union: +5  } },
      { text: 'Seguir de noche en la niebla. Si ellos no pueden rastrear, tampoco pueden bloquearnos.', effects: { food: -4,  moral: +5,  salud: -5,  warriors: +1  } },
    ],
  },

  e_bocas_toro: {
    title: 'El Archipiélago de los Libres',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',
    cap:   'Archipiélago del Caribe — Bocas del Toro',
    narr:  `Las islas del archipiélago son un mundo aparte. Los <span class="tt" data-tip="Ngäbe-Buglé: pueblo indígena de Panamá y Costa Rica que habitó la región de Bocas del Toro. Resistieron la evangelización española durante siglos gracias a su territorio fragmentado en islas y selvas. Las islas caribeñas actuaron como refugio para comunidades indígenas, cimarrones (esclavos africanos fugados) y piratas que desafiaban el poder colonial.">ngäbe-buglé</span> que los reciben llevan generaciones construyendo canoas que navegan entre islas sin ser vistas desde tierra firme.<br><br>
Un hombre de mediana edad, con cicatrices que cuentan muchas historias, examina al grupo desde la orilla. Habla en un español entrecortado que aprendió de esclavos africanos fugados: <em>"Aquí los conquistadores no entran. El mar no entiende de mapas de España."</em><br><br>
El grupo está exhausto. Las piernas no recuerdan ya lo que es terreno seco. Pero el agua clara y los peces son abundantes, y las islas tienen una calidad que el grupo necesita con urgencia: tiempo para respirar.`,
    decisions: [
      { text: 'Quedarse varias semanas. Aprender la navegación de islas — puede ser clave al sur.',  allianceKey: 'ngabe_bugle', effects: { food: +15, moral: +20, salud: +15, union: +12 } },
      { text: 'Solo descansar tres días y seguir. El destino final está lejos todavía.',             effects: { food: +8,  moral: +12, salud: +10, union: +5                              } },
      { text: 'Preguntar a los ngäbe-buglé sobre el paso hacia el sur. Su conocimiento vale más que el descanso.', effects: { food: +5, moral: +15, salud: +5, warriors: +1 } },
    ],
  },

  e_bocas_toro_b: {
    title: 'La Lengua del Cimarrón',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Costa caribeña — Bocas del Toro, Panamá',
    narr:  `Entre los habitantes del archipiélago hay un hombre que no es del lugar. Es africano — o más precisamente, era africano antes de escapar de los barcos de los españoles hace tres años. Se llama a sí mismo Cimarrón porque es lo que es: un hombre libre que vive fuera del sistema de los conquistadores.<br><br>
Su historia y la del grupo se tocan en el mismo punto: ambos huyen del mismo poder. Él habla poco, escucha mucho, y una noche señala un mapa que trazó él mismo en la arena con una rama: rutas de escape que ningún español conoce porque las aprendió de ngäbe-buglé, de esclavos fugados como él, y de su propio sufrimiento.<br><br>
<em>"El sur es libre todavía"</em>, dice. <em>"Pero hay que saber cómo llegar."</em><br><br>
Ofrece guiar al grupo hasta Panamá por caminos interiores. A cambio, solo pide que lo lleven con ellos.`,
    decisions: [
      { text: 'Aceptar al cimarrón. Su conocimiento y sus conexiones pueden salvar al grupo.', allianceKey: 'cimarron', effects: { food: -5, moral: +22, salud: 0,  union: +15, warriors: +2 } },
      { text: 'Darle comida y agradecerle el mapa, pero seguir solos. Más gente, más riesgo.',  effects: { food: -3, moral: +8,  salud: 0,  union: +5                                        } },
    ],
  },

  // ── ACTO I — Nodos nuevos (corredores profundos) ─────────────

  e_cocibolca: {
    title: 'El Mar Dulce',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&q=80',
    cap:   'Lago Cocibolca — el mar de agua dulce',
    narr:  `El agua no termina nunca. Es un lago tan grande que tiene horizonte, olas y su propio temperamento. Los <span class="tt" data-tip="Chorotega: pueblo de origen mesoamericano que migró desde el sur de México siglos antes de la conquista. Hablaban una lengua mangue y dejaron miles de petroglifos en la isla de Ometepe. Eran agricultores, alfareros y comerciantes que dominaban las rutas del lago.">chorotegas</span> que pescan en sus orillas lo llaman Cocibolca: el mar dulce.<br><br>
En el centro se levanta <span class="tt" data-tip="Ometepe: isla formada por dos volcanes (Concepción y Maderas) unidos por un istmo. Era un santuario indígena cubierto de petroglifos y estatuas de basalto. Su nombre náhuatl significa 'dos cerros'.">Ometepe</span>, una isla de dos volcanes que los chorotegas tienen por sagrada. Cruzar el lago en canoa acorta días de camino — pero el agua guarda <span class="tt" data-tip="El Lago de Nicaragua tiene tiburones toro, una especie capaz de adaptarse al agua dulce remontando el río San Juan desde el Caribe. Durante siglos se creyó que eran una especie única de 'tiburón de lago'.">tiburones que viven donde ningún tiburón debería</span>.<br><br>
Un pescador chorotega ofrece guiar las canoas. Pide a cambio que el chamán bendiga su isla.`,
    decisions: [
      { text: 'Cruzar el lago de noche con las canoas chorotegas. Rápido, pero el agua es traicionera.', allianceKey: 'chorotega', effects: { food: +8,  moral: +10, salud: -5,  union: +8,  civilians: -1 } },
      { text: 'Rodear la orilla a pie. Más lento y más hambre, pero tierra firme bajo los pies.',         effects: { food: -12, moral: 0,   salud: +3,  union: +3 } },
      { text: 'Detenerse en Ometepe a ofrendar. El pueblo necesita sentir que los dioses siguen con ellos.', effects: { food: -6,  moral: +18, salud: +2,  union: +12 } },
    ],
  },

  e_cocibolca_b: {
    title: 'La Piedra que Mira',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=1200&q=80',
    cap:   'Petroglifos de Ometepe — la memoria en piedra',
    narr:  `En una playa de la isla, medio enterradas, hay <span class="tt" data-tip="Los petroglifos y estatuas de Ometepe representan figuras humanas, animales y seres duales. Algunas estatuas muestran a una persona con un segundo ser (jaguar, ave) sobre la cabeza: el alter ego o 'nahual' del chamán. Datan de entre el 800 y el 1500 d.C.">estatuas de piedra con rostros humanos y, encima de cada cabeza, un segundo ser</span>: un jaguar, un águila. El chamán mayor se arrodilla. Reconoce lo que ve.<br><br>
<em>"Es el doble del alma"</em>, murmura. <em>"Este pueblo sabía lo mismo que nosotros, en otra lengua."</em><br><br>
Hay comida enterrada como ofrenda junto a las piedras — maíz seco, semillas. Tomarla sería sobrevivir un día más. Dejarla intacta sería respetar a quienes la pusieron ahí.`,
    decisions: [
      { text: 'Dejar la ofrenda. No se roba a los muertos de otro pueblo, aunque se tenga hambre.',  effects: { food: -4,  moral: +20, union: +15 } },
      { text: 'Tomar parte de la ofrenda y dejar algo propio a cambio. Un trueque con los antiguos.', effects: { food: +10, moral: +5,  union: +2 } },
    ],
  },

  e_talamanca: {
    title: 'La Montaña que Nadie Cruzó',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80',
    cap:   'Bosque nuboso de Talamanca',
    narr:  `La cordillera se levanta envuelta en nubes que nunca se van. El bosque gotea. Cada paso es barro y raíz. Pero es justo por eso que aquí están a salvo: <span class="tt" data-tip="La Cordillera de Talamanca, entre Costa Rica y Panamá, fue una de las regiones que España nunca logró someter por completo. Su geografía abrupta y la resistencia de sus pueblos mantuvieron el territorio fuera del control colonial durante siglos.">ningún ejército con caballos y armaduras cruzó jamás estas montañas</span>.<br><br>
Los <span class="tt" data-tip="Bribri: pueblo originario de Talamanca. Su sociedad es matrilineal —el clan se hereda por la madre— y está organizada en clanes. Su figura espiritual es el 'awá', médico-sacerdote. Veneran a Sibö, el dios creador. Resistieron la conquista durante todo el período colonial.">bribri</span> aparecen sin ruido entre los árboles. Su mundo se hereda por las madres, y su médico — el awá — lee las enfermedades como quien lee el cielo. Una mujer mayor, cabeza de su clan, observa al grupo largo rato antes de hablar.<br><br>
<em>"Pueden pasar. Pero la montaña pide algo a cambio de dejarlos pasar."</em>`,
    decisions: [
      { text: 'Pedir guía bribri por los pasos secretos. Aliarse con quien nunca fue vencido.', allianceKey: 'bribri', effects: { food: +6,  moral: +15, salud: +5,  union: +12, warriors: +1 } },
      { text: 'Cruzar solos para no deber nada. El bosque nuboso castiga al apurado.',          effects: { food: -10, moral: -5,  salud: -12, union: -3 } },
      { text: 'Quedarse unos días con el awá a curar a los enfermos antes de seguir.',          effects: { food: -8,  moral: +8,  salud: +18, union: +8 } },
    ],
  },

  e_talamanca_b: {
    title: 'Lo que Sabe el Awá',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'El awá bribri — médico y guardián del saber',
    narr:  `El <span class="tt" data-tip="El awá es el médico tradicional bribri, depositario de un saber que se transmite oralmente durante años de aprendizaje. Conoce cientos de plantas, los cantos curativos y la genealogía de los clanes. Su rol es a la vez espiritual y práctico.">awá</span> se sienta frente a la chamana del grupo. No comparten lengua, pero comparten oficio. Durante una noche entera intercambian lo que saben: ella le enseña a tratar la fiebre de los españoles que ya vio matar; él le muestra plantas de altura que cortan el dolor y cierran heridas.<br><br>
Cuando amanece, el awá entrega un atado de cortezas y hojas. <em>"Esto no cura todo. Pero te dará días. Y los días, ahora, son todo lo que tienen."</em><br><br>
A cambio, mira a los ojos de la chamana: <em>"Enséñame a reconocer la enfermedad de hierro antes de que llegue a mi montaña."</em>`,
    decisions: [
      { text: 'Compartir todo el saber sobre la peste. El conocimiento no se acapara entre pueblos hermanos.', effects: { food: +4,  moral: +18, salud: +10, union: +12 } },
      { text: 'Recibir las plantas pero guardar algún secreto. La cautela también es supervivencia.',         effects: { food: +2,  moral: +5,  salud: +8,  union: -3 } },
    ],
  },

  e_mosquitia: {
    title: 'El Pueblo que No Se Arrodilla',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&q=80',
    cap:   'Lagunas y manglares de La Mosquitia',
    narr:  `El bosque se abre en un laberinto de lagunas, manglares y canales donde el agua dulce y el mar se confunden. Aquí viven los <span class="tt" data-tip="Miskito (o misquito): pueblo de la costa caribe de Nicaragua y Honduras. Nunca fueron conquistados por España. Se aliaron con ingleses y holandeses, obtuvieron armas de fuego y llegaron a formar un reino reconocido. Su territorio permaneció fuera del control colonial español durante todo el período.">misquitos</span>, y caminan como quien nunca tuvo amo.<br><br>
Tienen armas de fuego — conseguidas de los ingleses, enemigos de España — y conocen cada canal de este laberinto de agua donde ningún galeón puede entrar. Entre ellos hay rostros africanos: <span class="tt" data-tip="Los 'sambos' o misquitos-zambos surgieron de la unión entre indígenas misquitos y africanos sobrevivientes de naufragios de barcos esclavistas. Reforzaron la resistencia armada de la costa contra los españoles.">descendientes de esclavos que naufragaron y se hicieron libres aquí</span>.<br><br>
Su líder evalúa al grupo. <em>"Los que huyen de los españoles son bienvenidos. Pero esta costa se defiende. ¿Saben pelear?"</em>`,
    decisions: [
      { text: 'Sellar una alianza guerrera con los misquitos. Aprender a moverse y luchar en el agua.', allianceKey: 'misquito', effects: { food: +10, moral: +15, salud: 0,  union: +10, warriors: +3 } },
      { text: 'Pedir solo paso silencioso por los canales. No buscar más guerras de las necesarias.',   effects: { food: +4,  moral: +5,  salud: +2,  union: +3 } },
      { text: 'Conseguir canoas y partir rápido. El tiempo perdido es ventaja para el conquistador.',  effects: { food: -3,  moral: -3,  salud: +5,  union: -2 } },
    ],
  },

  e_mosquitia_b: {
    title: 'Los Que Cazan el Agua',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=80',
    cap:   'Manatíes en las lagunas — el sustento de la costa',
    narr:  `El hambre aprieta. Los misquitos ofrecen enseñar lo que mejor saben hacer: cazar <span class="tt" data-tip="El manatí era una fuente clave de alimento en La Mosquitia. Los misquitos eran cazadores expertos con arpón desde canoas. Hoy el manatí antillano está en peligro de extinción, pero entonces sostenía a poblaciones enteras de la costa.">manatíes</span>, los grandes animales mansos de las lagunas, con arpón desde la canoa.<br><br>
Es comida abundante — pero la cacería lleva días, y el chamán mayor mira el agua con respeto: <em>"Estos animales nos dan de comer. No los matemos más de lo que el hambre pide."</em><br><br>
Mientras tanto, un vigía misquito trae noticia: una partida de cazadores de esclavos españoles ronda el borde sur del manglar.`,
    decisions: [
      { text: 'Cazar lo justo y partir antes de que lleguen los españoles. Comida medida, riesgo medido.', effects: { food: +14, moral: +5,  salud: +5,  union: +5 } },
      { text: 'Quedarse a llenar las reservas pese al peligro. El hambre mata más seguro que el español.', effects: { food: +24, moral: -8,  salud: +3,  union: -5,  warriors: -1 } },
    ],
  },

  e_guna: {
    title: 'Las Islas de la Ley Propia',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
    cap:   'Archipiélago de Guna Yala — cientos de islas de coral',
    narr:  `Cientos de islas de arena y coral salpican el mar, tan bajas que parecen flotar. Son el territorio <span class="tt" data-tip="Guna (o kuna): pueblo del Caribe panameño. Su sociedad es matrilineal y se gobierna por congresos comunales donde los 'saglas' (jefes) cantan la historia y las decisiones se toman en común. Siglos después, en 1925, protagonizaron una revolución que les valió autonomía dentro de Panamá: la comarca de Guna Yala.">guna</span>, y aquí no manda un rey ni un español: manda el <span class="tt" data-tip="El congreso guna es la asamblea donde la comunidad delibera. El 'sagla' no ordena: conduce y canta. Las decisiones importantes se toman colectivamente, escuchando a todos. Es una de las formas de autogobierno indígena más duraderas de América.">congreso</span>, donde todos hablan y el jefe canta.<br><br>
Esa misma noche el grupo es invitado a la casa grande. En la penumbra, el sagla guna entona la historia de su pueblo — horas de canto — y al terminar pide que el cacique cuente la suya: el incendio, la huida, el sur.<br><br>
Las mujeres guna cosen <span class="tt" data-tip="Las molas son textiles de capas de tela cosidas a mano por las mujeres guna, con diseños geométricos y figurativos. Cada una cuenta algo. Son arte, identidad y memoria a la vez.">molas</span>: telas que cuentan historias en figuras de colores.`,
    decisions: [
      { text: 'Contar toda la historia ante el congreso. Que otro pueblo guarde la memoria del incendio.', effects: { food: +6,  moral: +20, salud: +3,  union: +15 } },
      { text: 'Aceptar refugio unos días entre las islas para recuperar fuerzas antes del istmo.',        effects: { food: +12, moral: +8,  salud: +12, union: +6,  civilians: +1 } },
      { text: 'Agradecer y partir al alba. Las islas son seguras, pero el sur llama.',                    effects: { food: +3,  moral: +3,  salud: +4,  union: +2 } },
    ],
  },

  e_guna_b: {
    title: 'La Tela que Recuerda',
    act:   'Acto I · Huida',
    img:   'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1200&q=80',
    cap:   'Molas guna — la memoria cosida a mano',
    narr:  `Una anciana guna se sienta junto a la chamana y, sin mediar palabra, empieza a coser. Capa sobre capa de tela, va recortando y revelando figuras: un jaguar, un río, una fila de personas caminando hacia abajo, hacia el sur.<br><br>
Está cosiendo la historia del grupo en una <span class="tt" data-tip="Cada mola es única y narra algo: un mito, un sueño, un hecho. Que la anciana guna cosiera la historia del grupo es un gesto de acogida profundo: significa que ese pueblo pasajero quedará en la memoria visual de los guna.">mola</span>. Cuando termina, la entrega. <em>"Ahora su camino también vive en nuestras manos. Si se pierden, esta tela recordará que existieron."</em><br><br>
El gesto deja al grupo en silencio. Por primera vez desde el incendio, alguien promete recordarlos.`,
    decisions: [
      { text: 'Recibir la mola y entregar a cambio un objeto sagrado del pueblo. Memorias intercambiadas.', effects: { food: 0,   moral: +22, salud: +2,  union: +18 } },
      { text: 'Agradecer y pedir aprender a leer las molas, para llevar el arte al sur.',                   effects: { food: -2,  moral: +14, salud: 0,   union: +10 } },
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

  // ── ACTO II — Nodos nuevos (corredores profundos) ────────────

  e_maranon: {
    title: 'El Padre del Amazonas',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Río Marañón — el primer Amazonas',
    narr:  `El río aparece de golpe al bajar la última cuesta andina: café y furioso, tan ancho que la orilla opuesta apenas se distingue. Lleva troncos enteros como si fueran palitos. El chamán lo mira largo tiempo antes de hablar:<br><br>
<em>"Los <span class="tt" data-tip="Los quechuas llaman al Marañón 'Amaru Mayu' — el río serpiente. Durante siglos fue considerado el verdadero nacimiento del Amazonas, porque sus fuentes están más arriba que las del Ucayali. Los exploradores modernos siguen debatiendo cuál rama es la principal.">quechuas dicen que este río es el abuelo del Amazonas</span>. Que los otros ríos grandes del sur son sus hijos."</em><br><br>
En la orilla hay piraguas y, junto a ellas, hombres y mujeres <span class="tt" data-tip="Shipibo-Conibo: pueblo indígena del Perú amazónico. Sus mujeres son reconocidas por sus diseños geométricos kené — bordados y pintados — que representan visiones chamánicas y mapas del cosmos. Su chamán (onanya) trabaja con ayahuasca para curar enfermedades del alma.">shipibo</span> con diseños geométricos en la ropa que el chamán del grupo no puede dejar de mirar. Los diseños se curvan y se bifurcan como ríos vistos desde arriba.<br><br>
Uno de los shipibo señala hacia abajo, hacia donde el río baja: <em>"El agua los llevará más rápido que sus piernas. Pero hay que saber leer el río."</em>`,
    decisions: [
      { text: 'Aceptar la guía shipibo. Navegar el Marañón y aprender a leer sus corrientes.', allianceKey: 'shipibo', effects: { food: +14, moral: +18, salud: +5,  union: +12 } },
      { text: 'Cruzar el río y seguir por tierra hacia el sur. El río es impredecible.',        effects: { food: -10, moral: +5,  salud: -8,  union: +3  } },
      { text: 'Quedarse unos días para aprender los diseños kené con la chamana. El conocimiento viaja.', effects: { food: -4, moral: +22, salud: +2, union: +10 } },
    ],
  },

  e_maranon_b: {
    title: 'Las Manos en el Barro',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Cerámica shipibo — el cosmos en las manos',
    narr:  `Una mujer shipibo trabaja el barro junto al río con una concentración que no admite interrupciones. La chamana se sienta cerca, mirando. Después de un rato la mujer le habla sin dejar de trabajar:<br><br>
<em>"¿Ves este patrón? No lo inventé yo. Lo vi en el río cuando me enseñaron a mirar. El río ya lo sabe todo — nosotros solo lo <span class="tt" data-tip="El kené shipibo es un sistema visual que reproduce los patrones que los chamanos ven durante las ceremonias con ayahuasca. No es decoración: es un mapa del cosmos, una cura, un mensaje. Cada mujer aprende el kené de su madre y lo interpreta en cerámica, telas y pinturas corporales.">copiamos en barro y en tela</span>."</em><br><br>
Le da a la chamana un trozo de arcilla sin forma y espera. Los niños del grupo se acercan. Alguien en el grupo sabe trabajar el barro — no con estos patrones, pero sí con las manos. Pueden intercambiar lo que saben.`,
    decisions: [
      { text: 'Sentarse todos a aprender. El arte del barro es también el arte de la paciencia.',         effects: { food: -4,  moral: +20, salud: +3,  union: +14 } },
      { text: 'Agradecer e intercambiar técnicas de cultivo por diseños. Conocimiento por conocimiento.', effects: { food: +8,  moral: +15, salud: 0,   union: +10 } },
    ],
  },

  e_andes_sur: {
    title: 'El Último Paso',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Abra andina — el paso entre dos mundos',
    narr:  `El paso está a más de cuatro mil metros. El aire es tan delgado que los pulmones trabajan el doble para hacer la mitad. Los niños lloran sin razón clara. Un anciano se marea y tiene que sentarse. El chamán distribuye sin decir nada hojas de <span class="tt" data-tip="La hoja de coca (Erythroxylum coca) ha sido usada en los Andes durante más de 4.000 años. Masticar hojas de coca con una pequeña cantidad de cal activa sus alcaloides, que reducen el cansancio, el hambre, el frío y el mal de altura. Los misioneros españoles intentaron prohibirla, pero como dependía de ella la mano de obra de las minas de plata, la Corona la toleró.">coca</span> y hace señas para que todos mastiquen.<br><br>
Desde el paso, los dos mundos: al norte la Amazonía verde e infinita de donde vienen. Al sur el altiplano abierto, azul de frío, con el Titicaca brillando a lo lejos como un espejo. Un grupo de hombres <span class="tt" data-tip="Collas (o kollas): denominación que usaban los incas para los pueblos aimaras del altiplano boliviano-peruano. Fueron incorporados al Tawantinsuyu pero mantuvieron identidad propia. Su territorio incluía las orillas del Titicaca, el lago más alto del mundo navegable.">collas</span> los observa desde abajo, desde el primer tambo del altiplano.`,
    decisions: [
      { text: 'Bajar directo al tambo colla. El altiplano frío necesita ropa y guía antes que comida.', effects: { food: -6,  moral: +12, salud: -8,  union: +8  } },
      { text: 'Acampar en el paso una noche para que los enfermos se aclimaten gradualmente.',          effects: { food: -10, moral: +8,  salud: +15, union: +5  } },
      { text: 'Enviar guerreros adelante a pedir hospitalidad antes de bajar todos.',                   effects: { food: -4,  moral: +10, salud: +5,  warriors: -2 } },
    ],
  },

  e_andes_sur_b: {
    title: 'Las Llamas del Cielo',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80',
    cap:   'Llamas en el altiplano andino',
    narr:  `Los animales aparecen al doblar una roca y nadie del grupo sabe qué son. Son grandes como venados pero de cuello largo y mirada tranquila, y el hombre que los guía camina entre ellos como si fueran amigos viejos. Cuando el grupo se paraliza, el hombre se ríe.<br><br>
<em>"Son <span class="tt" data-tip="La llama (Lama glama) fue domesticada en los Andes hace unos 6.000 años a partir del guanaco. Es el único animal de carga grande que América tuvo — los Andes no contaban con bueyes, caballos ni asnos. Una llama puede cargar 30 kg durante horas a gran altitud. También provee lana, carne y cuero. Sin llamas, el Imperio Inca no habría podido abastecer sus ciudades de altura.">llamas</span>"</em>, dice. <em>"No muerden. Solo escupen cuando están muy molestas."</em><br><br>
El hombre es un <span class="tt" data-tip="Aymara: pueblo indígena del altiplano peruano-boliviano, uno de los más numerosos de América del Sur. Hablaban y hablan aimara, lengua distinta del quechua. Fueron incorporados al Imperio Inca pero mantuvieron su identidad. Hoy son entre 2 y 3 millones de personas en Bolivia, Perú y Chile.">aymara</span> que pastorea un rebaño de treinta. Ofrece vender dos llamas — carne y carga — a precio razonable: trabajo durante tres días.`,
    decisions: [
      { text: 'Aceptar el trato. Dos llamas cambian por completo la capacidad de carga del grupo.', effects: { food: +20, moral: +12, salud: +8,  union: +8  } },
      { text: 'Trabajar los tres días y aprender también a pastorear. El conocimiento vale más.',    effects: { food: +14, moral: +18, salud: +5,  union: +12 } },
    ],
  },

  e_orinoco: {
    title: 'El Río que Nace Dos Veces',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Delta del Orinoco — laberinto de bocas',
    narr:  `El Orinoco no termina — se multiplica. En su delta se divide en cincuenta brazos que avanzan entre manglares tan altos que bloquean el horizonte. Sin guía es imposible distinguir qué caño lleva al mar abierto y qué caño termina en pantano sin salida.<br><br>
Los <span class="tt" data-tip="Warao (Guarao): pueblo indígena del delta del Orinoco. Su nombre en su propia lengua significa 'gente de la canoa' o 'gente del agua'. Construyen palafitos sobre el agua y navegan el delta desde hace miles de años. Hoy son unos 36.000. El delta es uno de los ecosistemas más ricos de América del Sur, con más de 1.500 especies de vegetales.">warao</span> viven en casas sobre el agua, construidas sobre pilotes de madera dura que el río no consume. Han vivido así tanto tiempo que el agua ya no les parece extraña — es el suelo de su mundo.<br><br>
Una mujer warao en canoa los intercepta sin miedo y pregunta, en un español rudimentario que aprendió de misioneros: <em>"¿Adónde quieren llegar? Hay cien caminos en este delta. Solo dos no mueren."</em>`,
    decisions: [
      { text: 'Confiar en la mujer warao. Dejar que guíe por los brazos seguros del delta.',  allianceKey: 'warao', effects: { food: +12, moral: +15, salud: +8,  union: +10 } },
      { text: 'Seguirla pero enviar guerreros adelante a explorar. No confiar ciegamente.',   effects: { food: +6,  moral: +8,  salud: +5,  warriors: -1 } },
      { text: 'Pedir que enseñe al grupo a leer el delta. Aprender a orientarse solos.',      effects: { food: +3,  moral: +18, salud: +3,  union: +12 } },
    ],
  },

  e_orinoco_b: {
    title: 'Los Palafitos del Fin del Mundo',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Palafitos warao — casas sobre el agua',
    narr:  `La aldea entera flota. Los niños corren por tablones que se balancean sobre el río y no se caen. Un abuelo teje una canoa nueva con la misma naturalidad con que otro anciano tallaría madera en tierra firme. La comunidad vive en ciclos que el delta determina: temporada seca, temporada de agua, temporada de peces, temporada de fruta de moriche.<br><br>
El chamán warao muestra al grupo la planta que lo sostiene todo: la <span class="tt" data-tip="El moriche (Mauritia flexuosa) es una palmera que los warao llaman el árbol de la vida. Da fruta, savia fermentable, fibras para tejer, madera para construcción y larvas comestibles (gusano de moriche) de alto valor proteico. Los warao extraen también una harina de su tronco.">palma de moriche</span>. La llama el árbol de la vida y no es exageración: da comida, fibra, madera y algo más que el chamán muestra con una larva blanca en la palma de la mano.<br><br>
Algunos del grupo abren bien los ojos. Otros apartan la mirada.`,
    decisions: [
      { text: 'Probar el gusano de moriche. Si es alimento para ellos, puede serlo para nosotros también.', effects: { food: +18, moral: +10, salud: +5,  union: +8  } },
      { text: 'Aprender a recolectar la fruta de moriche. Es menos dramático y también alimenta.',          effects: { food: +12, moral: +12, salud: +3,  union: +6  } },
    ],
  },

  e_tepui: {
    title: 'El Mundo de Arriba',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    cap:   'Tepuyes — mesetas en el cielo',
    narr:  `Las paredes de roca suben verticales desde la selva hasta perderse en las nubes. Son demasiado rectas para ser naturales, pero lo son. Los <span class="tt" data-tip="Los tepuyes del Escudo Guayanés son formaciones de arenisca de entre 1.000 y 3.000 metros de altura. Tienen más de 1.800 millones de años — algunas de las rocas más antiguas del planeta. Cada cumbre es un ecosistema aislado con especies que evolucionaron allí sin contacto con el mundo de abajo. El Roraima sirvió de inspiración para 'El Mundo Perdido' de Arthur Conan Doyle.">tepuyes tienen más de mil millones de años</span>. Lo que vive arriba nunca estuvo abajo.<br><br>
Los <span class="tt" data-tip="Pemón: pueblo indígena de la Gran Sabana venezolana y la Guayana. Los tepuyes son parte central de su cosmología. Para los pemón, los tepuyes son el hogar de seres espirituales llamados 'makunaima' — el trickster cultural que creó el mundo actual. La Gran Sabana es un territorio sagrado que los pemón habitaron por siglos.">pemón</span> que viven al pie de los tepuyes los reciben con curiosidad real: no muchos grupos pasan por aquí. Su chamán es joven — apenas veinte años — pero habla con la seguridad de quien conoce algo que el resto del mundo ignora.<br><br>
<em>"Arriba hay plantas que curan enfermedades que abajo no tienen nombre. Pero el tepuy no deja subir a cualquiera."</em>`,
    decisions: [
      { text: 'Pedir que el chamán pemón suba con la chamana del grupo a buscar medicinas.',       allianceKey: 'pemon', effects: { food: -8,  moral: +20, salud: +22, union: +12 } },
      { text: 'Descansar al pie del tepuy unos días. El lugar tiene una calma que el grupo necesita.', effects: { food: -5,  moral: +18, salud: +10, union: +10 } },
      { text: 'Seguir camino y pedir solo información sobre la ruta al sur. El tiempo no espera.',    effects: { food: -2,  moral: +8,  salud: +3,  union: +5  } },
    ],
  },

  e_tepui_b: {
    title: 'La Lluvia que Nace Arriba',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Tepuy — nubes que generan su propia lluvia',
    narr:  `Las nubes no vienen del horizonte: nacen de la cima misma del tepuy, se forman y llueven sobre su pie con una regularidad que los pemón conocen de memoria. Cada mañana la cascada crece. Cada tarde mengua. El agua es limpia y fría como nada que el grupo haya probado antes.<br><br>
En la pared del tepuy, a la altura de los ojos, hay pinturas. No talladas: pintadas en rojo y negro sobre la roca, protegidas del agua por una saliente de piedra. Figuras humanas, animales, formas que podrían ser mapas o podrían ser otra cosa.<br><br>
El chamán pemón explica sin ser preguntado: <em>"Los hicieron los <span class="tt" data-tip="Los petroglifos y pinturas rupestres de la Guayana tienen entre 2.000 y 4.000 años. Los pemón los atribuyen a los 'makunaima', seres anteriores al mundo actual. Representan visiones chamánicas, rutas de migración y mapas del territorio. Muchos están siendo dañados por la humedad y el turismo no controlado.">makunaima</span>. Son los primeros del mundo. Nos dejaron instrucciones en las piedras."</em>`,
    decisions: [
      { text: 'Copiar las pinturas en cuero. Llevar las instrucciones más allá de este lugar.', effects: { food: -2, moral: +22, union: +15 } },
      { text: 'Observar y recordar. Lo que se memoriza no se pierde si el cuero se moja.',      effects: { food: 0,  moral: +15, union: +10 } },
    ],
  },

  e_llanos_mojos: {
    title: 'El Mar que Viene y Va',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Llanos de Mojos — el mar interior boliviano',
    narr:  `La sabana se inunda. No de golpe, sino despacio, como si el suelo respirara agua hacia afuera. En el horizonte no hay tierra firme — solo la línea donde el agua termina y el cielo empieza. En este mar interior que dura meses, la única tierra seca son las <span class="tt" data-tip="Las lomas de los Llanos de Mojos son montículos artificiales construidos por los mojos para vivir sobre el agua durante las inundaciones anuales. Algunos tienen hasta 300 metros de diámetro y 6 metros de altura. La red de lomas y canales artificiales que construyeron es uno de los sistemas de ingeniería hidráulica precolombinos más extensos de América del Sur.">lomas</span> — montículos de tierra que alguien construyó hace siglos exactamente para esto.<br><br>
Los <span class="tt" data-tip="Mojos (Moxos): pueblo indígena de la Amazonía boliviana. Construyeron entre los siglos IV y XIV una red de canales, lomas artificiales y campos elevados que les permitía vivir en una sabana que se inunda el 70% del año. Los jesuitas establecieron misiones entre ellos en el siglo XVII.">mojos</span> los ven llegar desde las lomas y los reciben como a gente que llegó en buen momento: el agua sube, no baja, y la tierra seca es valiosa.<br><br>
<em>"Sigan la cadena de lomas hacia el sur"</em>, dice el jefe, <em>"o el agua los lleva a donde ustedes no quieren ir."</em>`,
    decisions: [
      { text: 'Seguir la cadena de lomas bajo guía mojos. Caminar donde ellos indican.',           allianceKey: 'mojos', effects: { food: +10, moral: +15, salud: +8,  union: +12 } },
      { text: 'Pedir canoas y cruzar el mar interior. Más rápido, aunque el agua asusta.',         effects: { food: +4,  moral: +8,  salud: -5,  union: +4  } },
      { text: 'Quedarse en la loma hasta que el agua baje. El tiempo perdido puede ser descanso.', effects: { food: -8,  moral: +12, salud: +15, union: +8  } },
    ],
  },

  e_llanos_mojos_b: {
    title: 'Las Lomas que No Tienen Nombre',
    act:   'Acto II · Travesía',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Lomas artificiales — ingeniería del agua',
    narr:  `Un anciano mojo lleva al chamán a la cima de la loma más alta y le muestra el horizonte. Desde arriba, lo que parecía tierra al azar tiene una forma: canales rectos, lomas en cadena, campos de cultivo elevados sobre el agua. Una ciudad de agua y tierra que nadie construyó de una vez, sino generación por generación.<br><br>
<em>"Esto no lo hizo un rey"</em>, dice el anciano. <em>"Lo hizo cada familia. Cada familia, su parte. Y así, en cien años, esto."</em><br><br>
El chamán lo traduce para el cacique después, en voz baja: <em>"Dice que cuando un pueblo trabaja sin que nadie ordene, hace cosas que ningún rey puede ordenar."</em><br><br>
La frase queda en el aire sobre el mar interior de Bolivia, donde el agua brilla y no hay ningún conquistador a la vista.`,
    decisions: [
      { text: 'Aprender el sistema de canales. Un pueblo que maneja el agua puede vivir donde otros no pueden.', effects: { food: +5,  moral: +25, union: +18 } },
      { text: 'Descansar en la loma y escuchar más historias. Este pueblo guarda mucho para enseñar.',          effects: { food: -4,  moral: +20, union: +14 } },
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

  // ── ACTO III — Nodos nuevos ─────────────────────────────────────────

  e_humahuaca: {
    title: 'El Cañón que Recuerda',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=80',
    cap:   'Quebrada de Humahuaca — Jujuy, Argentina',
    narr:  `El cañón corta la tierra como una herida antigua. Las paredes de roca pintada en ocres, rojos y verdes narran historias que preceden a los incas. Los <span class="tt" data-tip="Omaguacas: pueblo indígena que habitó la Quebrada de Humahuaca (actual Jujuy, Argentina) durante siglos. Controlaban el tráfico entre el Altiplano andino y las llanuras del sur. Resistieron la conquista española décadas antes que muchos otros pueblos del continente.">omaguacas</span> que custodian la quebrada ya saben por qué viene el grupo — han visto pasar a otros que también huían.<br><br>
Una mujer mayor con un tocado de plumas de cóndor los recibe en silencio. Luego habla despacio: <em>"Este cañón ha visto pasar a los incas. Ahora pasan ustedes. Pasarán también los que los persiguen. La quebrada no recuerda a los perseguidores — solo a los que siguen su camino."</em><br><br>
Ofrecen hospedaje, comida y algo más valioso: conocimiento del sistema de postas del Camino del Inca que todavía funciona en este tramo, aunque los españoles no lo saben aún.`,
    decisions: [
      { text: 'Aceptar el hospedaje y aprender el sistema de postas incaico.', allianceKey: 'omaguacas', effects: { food: +12, moral: +18, salud: +10, union: +12 } },
      { text: 'Solo descansar una noche. Agradecer y continuar antes del amanecer.', effects: { food: +6, moral: +10, salud: +8, union: +5 } },
      { text: 'Preguntar por los rastros de conquistadores en el norte. La información vale más.', effects: { food: +4, moral: +12, salud: +5, warriors: +1 } },
    ],
  },

  e_humahuaca_b: {
    title: 'La Posta del Cóndor',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80',
    cap:   'Alturas andinas — Camino del Inca, Quebrada de Humahuaca',
    narr:  `El Camino del Inca en este tramo es una obra de ingeniería que los siglos no borran: piedras planas, perfectas, que suben y bajan el cañón con una precisión que ningún conquistador ha podido imitar. Las postas — refugios de piedra cada cierta distancia — siguen en pie.<br><br>
En la posta más alta, a más de tres mil metros, el grupo descansa mientras el viento trae un sonido inesperado: una bocina. Los omaguacas dicen que es la señal de que hay movimiento de tropas españolas al norte. El sistema de señales del Camino del Inca todavía funciona — los omaguacas lo mantienen en secreto.<br><br>
El chamán mayor mira las piedras del camino. Pone la mano sobre ellas y dice en voz baja: <em>"Estas piedras llevan la memoria de un millón de pies. Añadan los suyos."</em>`,
    decisions: [
      { text: 'Usar el sistema de señales para saber exactamente dónde están los españoles.', effects: { food: -4, moral: +20, salud: 0,  warriors: +2 } },
      { text: 'Bajar rápido antes de que las señales atraigan más atención.', effects: { food: -6, moral: +10, salud: -5, union: +8  } },
    ],
  },

  e_chaco: {
    title: 'El Infierno Verde',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Gran Chaco — Argentina, Paraguay, Bolivia',
    narr:  `Nadie llama al Chaco por casualidad. Los que lo conocen lo respetan: cuarenta grados a la sombra, espinas en cada arbusto, sed que puede matar en horas. Pero los españoles tampoco lo cruzan — es uno de los pocos lugares del continente que todavía no han penetrado con caballos.<br><br>
Los <span class="tt" data-tip="Tobas (Qom): pueblo indígena del Gran Chaco. Conocían cada fuente de agua del Chaco, cada camino entre las espinas, y durante siglos mantuvieron su independencia frente a incas y españoles por igual. El Gran Chaco no fue colonizado hasta finales del siglo XIX.">tobas</span> que aparecen de entre los arbustos no atacan — observan. Su líder, un hombre de cincuenta años cubierto de tatuajes geométricos, hace un gesto que la chamana interpreta: quieren ver las manos del cacique. Si están callosas de trabajo, son de los suyos. Si están suaves, son de los que mandan.`,
    decisions: [
      { text: 'Mostrar las manos y esperar su juicio.', allianceKey: 'tobas', effects: { food: +8, moral: +22, salud: +5, union: +15 } },
      { text: 'Intercambiar lo que tienen por agua y guía a través del Chaco.', effects: { food: -5, moral: +12, salud: +15, warriors: +1 } },
      { text: 'Rodear el Chaco por el borde. Más lento pero más seguro.', effects: { food: -10, moral: +5, salud: 0, union: +3 } },
    ],
  },

  e_chaco_b: {
    title: 'El Secreto del Agua',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200&q=80',
    cap:   'Aguada en el Gran Chaco',
    narr:  `El guía toba los lleva durante horas por un laberinto de quebrachos y espinillos que parecen todos iguales. Luego se detiene y señala el suelo. No hay nada visible. Hace un gesto: cavar.<br><br>
A medio metro de profundidad: agua limpia, fría. Una aguada subterránea que el Chaco guarda bajo la tierra árida. El grupo bebe hasta que los estómagos duelen.<br><br>
El guía explica, por señas y algunas palabras en castellano roto, que hay docenas de estas aguadas ocultas en el Chaco. Los tobas las conocen todas. Los españoles no encontraron ninguna todavía — por eso enviaron expediciones que murieron de sed. <em>"El Chaco no los mata"</em>, dice el guía. <em>"La ignorancia los mata."</em><br><br>
Ofrece trazar un mapa de las aguadas. Pero pide algo a cambio: que el grupo lleve un mensaje a los guaraníes del sur.`,
    decisions: [
      { text: 'Aceptar el mapa y el encargo. Los mensajes entre pueblos son sagrados.', allianceKey: 'tobas_agua', effects: { food: +10, moral: +25, salud: +10, union: +18 } },
      { text: 'Aceptar el mapa pero no el encargo. El grupo no puede comprometerse con más.', effects: { food: +8,  moral: +10, salud: +10, union: +5  } },
    ],
  },

  e_ibera: {
    title: 'El Espejo del Cielo',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',
    cap:   'Esteros del Iberá — Corrientes, Argentina',
    narr:  `El mundo se vuelve líquido. Las lagunas del Iberá se extienden hasta donde alcanza la vista, separadas por lenguas de tierra flotante donde crecen camalotes y habitan más pájaros de los que el grupo creyó que existían. Los loros llenan el aire de conversación.<br><br>
Los <span class="tt" data-tip="Guaraníes del Iberá: los esteros del Iberá (actual Corrientes, Argentina) eran territorio guaraní. El nombre Iberá proviene del guaraní y significa agua brillante. Esta región de humedales era prácticamente inaccesible para los españoles a caballo.">guaraníes del Iberá</span> viven en canoas y plataformas flotantes — un pueblo que el agua hace intocable. Un joven de no más de dieciséis años guía al grupo a través de los canales en silencio absoluto, señalando con el remo cada desvío.<br><br>
Al tercer canal, el chico señala algo en el agua: la silueta de un yacaré de más de dos metros, inmóvil como un tronco. Luego mira al cacique y sonríe por primera vez.`,
    decisions: [
      { text: 'Quedarse unos días. Los esteros son inaccesibles para los perseguidores y el grupo necesita descanso.', allianceKey: 'guaranies_ibera', effects: { food: +15, moral: +22, salud: +18, union: +12 } },
      { text: 'Seguir navegando sin detenerse. Los canales son el camino más rápido al sur.', effects: { food: +5,  moral: +15, salud: +8,  warriors: +1 } },
    ],
  },

  e_ibera_b: {
    title: 'La Canción de los Camalotes',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    cap:   'Humedal del Iberá al atardecer',
    narr:  `La noche en los esteros tiene una calidad distinta. El grupo duerme en plataformas flotantes de juncos tejidos — las camas más extrañas que conocieron — mientras los sonidos del humedal los envuelven: ranas, aves nocturnas, el sonido sordo de los yacarés moviéndose en el agua oscura.<br><br>
Una chamana guaraní mayor visita el campamento con regalos: peces ahumados, miel silvestre, y algo inesperado — información. Sabe, por su propia red de mensajeros acuáticos, que los conquistadores enviaron un contingente hacia el sur hace menos de un mes. Trae un mapa trazado con carbón sobre corteza de árbol.<br><br>
<em>"Mis abuelos decían que el agua recuerda todo lo que pasa sobre ella"</em>, dice la chamana. <em>"El Iberá recuerda a los que la cruzaron antes. Pronto los recordará a ustedes también."</em>`,
    decisions: [
      { text: 'Agradecer el mapa y el aviso. La información sobre los conquistadores es oro.', effects: { food: +8,  moral: +28, salud: +5,  warriors: +2 } },
      { text: 'Pedir que la chamana los guíe hasta la salida sur del humedal.', effects: { food: +5,  moral: +20, salud: +10, union: +8  } },
    ],
  },

  // ── ACTO III — Nodos nuevos (corredores profundos) ───────────

  e_valles_cal: {
    title: 'El Valle de los Señores',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    cap:   'Valles Calchaquíes — cañones rojos del noroeste',
    narr:  `Los cañones son rojos. No es metáfora — la roca tiene ese color, oxidada durante millones de años, y con la luz del atardecer el mundo parece estar en llamas tranquilas. El grupo lleva dos días sin ver un conquistador. Aquí los españoles tardaron más de un siglo en entrar, y cuando entraron, los <span class="tt" data-tip="Diaguitas calchaquíes: confederación de pueblos del noroeste argentino que resistió la conquista española durante más de 130 años, hasta 1665. Las llamadas 'Guerras Calchaquíes' fueron tres ciclos de resistencia. Sus líderes más conocidos son Juan Calchaquí y el cacique Bohórquez. Cuando finalmente fueron derrotados, los españoles realizaron una deportación masiva para separar las comunidades.">diaguitas calchaquíes</span> los recibieron con flechas durante décadas.<br><br>
Los calchaquíes actuales los observan desde las ruinas de <span class="tt" data-tip="Quilmes: ciudad diaguita de hasta 3.000 habitantes, construida en terrazas sobre un cerro. Fue sitiada y rendida en 1665. Los sobrevivientes fueron deportados a pie hasta Buenos Aires — una marcha de 1.300 km que mató a la mitad. El 'Barrio de los Quilmes', al sur de Buenos Aires, lleva su nombre hoy.">Quilmes</span>: una ciudad en terrazas que todavía se sostiene sobre el cerro como desafiando al tiempo. Su líder, una mujer de mirada directa, habla sin rodeos: <em>"Vinieron a quedarse o a pasar?"</em>`,
    decisions: [
      { text: 'Quedarse unas semanas. Este pueblo resistió tanto que tiene mucho para enseñar.',   allianceKey: 'calchaqui', effects: { food: +8,  moral: +20, salud: +8,  union: +15 } },
      { text: 'Pedir guía por los pasos andinos hacia el sur. La resistencia calchaquí les ganó ventaja.', effects: { food: +5,  moral: +12, salud: +5,  union: +8  } },
      { text: 'Solo reabastecerse y seguir. El tiempo de los parones ya pasó.',                    effects: { food: +12, moral: +5,  salud: 0,   union: +3  } },
    ],
  },

  e_valles_cal_b: {
    title: 'El Viento del Este',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&q=80',
    cap:   'Quebradas del noroeste — el viento zonda',
    narr:  `El viento llega sin aviso desde el este, caliente y seco como un horno. Los calchaquíes lo llaman <span class="tt" data-tip="Zonda: viento cálido y seco del norte argentino, similar al foehn europeo. Cae de los Andes después de perder humedad. Los pueblos originarios del noroeste lo asociaban con cambios de humor colectivos — y no sin razón: estudios modernos vinculan los vientos zonda con aumentos de tensión social.">zonda</span>. Cuando sopla, los animales se agitan y los niños lloran sin saber por qué.<br><br>
Una calchaquí anciana le dice a la chamana que en los días de zonda no se toman decisiones importantes. <em>"El viento revuelve los pensamientos antes de que lleguen a la boca."</em><br><br>
Pero la chamana siente algo distinto: el zonda trae un olor que reconoce. Humo de campamento — y no el de ellos.`,
    decisions: [
      { text: 'Moverse de noche aunque el zonda dificulte la marcha. El humo no espera.',  effects: { food: -8,  moral: +8,  salud: -5,  warriors: +1 } },
      { text: 'Esperar que el viento pase. La anciana calchaquí tiene razón sobre el zonda.', effects: { food: -6,  moral: +12, salud: +5,  union: +8  } },
    ],
  },

  e_alto_neuquen: {
    title: 'El Árbol que Alimenta',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Araucarias del norte patagónico',
    narr:  `Los árboles son distintos a todo lo anterior: gruesos como torres, con ramas que crecen en espiral y una corteza de escamas que parece armadura. Son <span class="tt" data-tip="Araucaria araucana (pehuén): árbol sagrado del pueblo mapuche-pehuenche. Sus piñones (piñas) contienen semillas grandes y nutritivas que pueden comerse crudas, cocidas o fermentadas. Un bosque de araucarias puede sostener a una comunidad durante el invierno entero. El árbol puede vivir más de 1.000 años.">araucarias</span> — el pueblo pehuenche les llama pehuén y les debe la vida.<br><br>
Los <span class="tt" data-tip="Pehuenches: pueblo mapuche del norte neuquino. Su nombre significa literalmente 'gente del pehuén'. Vivían nomádicamente entre la cordillera y el piedemonte, siguiendo los ciclos de los piñones. Fueron conocidos por su fiereza ante cualquier invasión y por su profundo conocimiento del terreno andino.">pehuenches</span> están recolectando piñones cuando el grupo llega. No se alarman — en su territorio, son ellos los que deciden quién entra. Un hombre joven se acerca con un puñado de piñas y las ofrece sin decir palabra. El chamán lo acepta.<br><br>
<em>"Los que dan sin que se lo pidan suelen querer algo"</em>, murmura un guerrero. El pehuenche se ríe — entendió.`,
    decisions: [
      { text: 'Unirse a la recolección de piñones. Ayudar a cambio de quedarse unos días.',  allianceKey: 'pehuenche', effects: { food: +22, moral: +15, salud: +8,  union: +12 } },
      { text: 'Aceptar los piñones de regalo y seguir. No deben más tiempo del necesario.',   effects: { food: +12, moral: +8,  salud: +5,  union: +5  } },
      { text: 'Pedir que los guíen por los pasos andinos de invierno. El conocimiento pehuenche vale más que la comida.', effects: { food: +6, moral: +18, salud: +3, warriors: +1 } },
    ],
  },

  e_alto_neuquen_b: {
    title: 'La Noche sin Fin',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=1200&q=80',
    cap:   'Cielo del sur patagónico — el cruce del firmamento',
    narr:  `Nadie del grupo había visto el cielo así. Sin luz de ciudad, sin humo de incendio, sin nada entre los ojos y las estrellas. El chamán se sienta en el suelo y no dice nada durante mucho tiempo.<br><br>
Un pehuenche anciano se sienta junto a él. Señala al sur: <em>"Por ahí, el camino del cielo va derecho."</em> Señala una banda blanca que cruza el firmamento — la <span class="tt" data-tip="La Vía Láctea fue usada como mapa celeste por muchos pueblos originarios del sur. Los mapuches y pehuenches conocían el eje norte-sur de la Vía Láctea como guía de orientación nocturna, y sus estrellas más brillantes tenían nombres y roles en la cosmología. El Cruce del Sur (Cruz del Sur) era la brújula del hemisferio austral.">Vía Láctea</span>. <em>"Eso que ven es el camino de las almas. También es el camino hacia donde van."</em><br><br>
Los niños más pequeños se quedan dormidos mirando arriba.`,
    decisions: [
      { text: 'Aprender a navegar de noche por las estrellas del sur. Conocimiento que no pesa.',  effects: { food: -3,  moral: +22, salud: +2,  union: +14 } },
      { text: 'Descansar esa noche bajo las estrellas. El grupo necesita paz tanto como comida.',   effects: { food: -5,  moral: +18, salud: +10, union: +12 } },
    ],
  },

  e_sie_ventana: {
    title: 'El Ojo del Sur',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=80',
    cap:   'Sierra de la Ventana — la roca agujereada',
    narr:  `En medio de las pampas infinitas, una sierra. No es enorme — los Andes la harían pequeña — pero su presencia en tanta llanura la hace imposible de ignorar. Y en la cima del cerro más alto, una roca con un agujero perfecto: la <span class="tt" data-tip="El Cerro de la Ventana (1.243 m) en la sierra bonaerense homónima tiene en su cima una perforación natural en la roca de unos 5 metros de ancho. Fue lugar sagrado para los pueblos pampeanos. Los tehuelches y luego los ranqueles conocían perfectamente la sierra como punto de referencia en la pampa.">ventana</span> que da nombre a todo el lugar — un arco natural por el que se ve el cielo.<br><br>
El chamán insiste en subir. Nadie lo detiene — hay algo en su manera de mirar esa roca que no acepta discusión.<br><br>
Desde el agujero, el horizonte de la pampa se ve en las cuatro direcciones a la vez. <em>"Este es el centro"</em>, dice cuando baja. <em>"No el geográfico. El que necesitábamos encontrar."</em>`,
    decisions: [
      { text: 'Hacer una ofrenda en la ventana de roca. El chamán dice que este lugar escucha.',        effects: { food: -4,  moral: +25, salud: +3,  union: +18 } },
      { text: 'Usar la sierra como atalaya y orientarse definitivamente hacia el destino final.',        effects: { food: -2,  moral: +12, salud: 0,   union: +8,  warriors: +1 } },
      { text: 'Acampar al pie de la sierra unos días. El grupo lleva meses sin lugar estable.',         effects: { food: -8,  moral: +15, salud: +15, union: +12 } },
    ],
  },

  e_sie_ventana_b: {
    title: 'Las Pinturas Bajo la Roca',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&q=80',
    cap:   'Arte rupestre — cuevas de la sierra bonaerense',
    narr:  `Una cueva al pie del cerro que nadie vería si no supiera que existe: pequeña, baja, con el techo negro de humo de miles de fuegos. Y en las paredes: pinturas. Manos negativas — manos que alguien puso sobre la roca y sopló pintura alrededor — y figuras de animales que el grupo ya no reconoce. <span class="tt" data-tip="Las pinturas rupestres de la Sierra de la Ventana y la pampa bonaerense tienen entre 3.000 y 8.000 años de antigüedad. Los guanacos, ñandúes y felinos son los animales más representados. La técnica de manos en negativo (soplando pigmento rojo sobre la mano apoyada en la roca) aparece en cuevas de los cinco continentes.">Guanacos y ñandúes</span>, sobre todo. Animales de la pampa que estas pinturas conocen desde antes de que hubiera palabras para nombrarlos.<br><br>
Un guerrero pone su mano sobre una de las manos pintadas — del mismo tamaño exacto — y se queda así un momento que nadie interrumpe.`,
    decisions: [
      { text: 'Agregar la mano del grupo a las pinturas. Que la cueva sepa que pasaron.',           effects: { food: -2,  moral: +22, union: +16 } },
      { text: 'Solo observar. No modificar lo que no les pertenece — solo entrar en contacto.',      effects: { food: 0,   moral: +18, union: +12 } },
    ],
  },

  e_banados: {
    title: 'El Jaguar No Pregunta',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=80',
    cap:   'Bañados del Izozog — el Chaco boliviano',
    narr:  `Agua y barro y calor. El Chaco no tiene término medio — o es selva cerrada o es llanura sin agua. Pero aquí, en el Izozog, hay algo distinto: un sistema de lagunas que en la época seca se convierten en refugio de todo lo que vive entre el Chaco y la Amazonía.<br><br>
Un jaguar cruza el sendero a cincuenta metros, sin apuro. Es el tercero en dos días. Los <span class="tt" data-tip="Chiquitanos: pueblo indígena de las tierras bajas de Bolivia, entre el Chaco y la Amazonía. Habitaron la región del Izozog durante siglos antes de ser reducidos en las misiones jesuíticas del siglo XVII. Su nombre viene del español 'chico' — por el tamaño de sus puertas — no de su propia lengua. Eran agricultores, cazadores y artesanos con una tradición musical que sobrevivió a la evangelización.">chiquitanos</span> que viven aquí lo miran cruzar con la misma expresión que el chamán usa para mirar el fuego: respeto sin miedo.<br><br>
<em>"El jaguar no persigue — solo va"</em>, dice un chiquitano. <em>"El que tiene miedo es el que corre."</em>`,
    decisions: [
      { text: 'Aprender a moverse en el Chaco como los chiquitanos. Cazar y orientarse aquí.',  allianceKey: 'chiquitano', effects: { food: +15, moral: +18, salud: +5,  union: +12 } },
      { text: 'Cruzar rápido el Izozog antes de la subida del agua. El tiempo chaqueño no espera.', effects: { food: -5,  moral: +8,  salud: -5,  union: +3  } },
      { text: 'Descansar en una laguna alta. El grupo necesita bañarse, curar heridas y respirar.', effects: { food: +5,  moral: +12, salud: +18, union: +10 } },
    ],
  },

  e_banados_b: {
    title: 'El Venado del Agua',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',
    cap:   'Ciervo de los pantanos — señor del bañado',
    narr:  `El animal que sale del agua es demasiado grande para ser un ciervo y demasiado grácil para ser otra cosa. Tiene las patas traseras más largas que las delanteras — adaptación para caminar en pantanos — y cuernos que se ramifican como árboles desnudos. Es el <span class="tt" data-tip="El ciervo de los pantanos (Blastocerus dichotomus) es el cérvido más grande de Sudamérica, con hasta 150 kg y cuernos de 60 cm. Vive en bañados, pantanales y orillas de ríos desde Bolivia hasta Argentina. Es un indicador ecológico clave: donde hay ciervo de los pantanos, el humedal está sano. Hoy está amenazado por la caza y la pérdida de hábitat.">ciervo de los pantanos</span>. Los chiquitanos se detienen y no hablan mientras cruza.<br><br>
El chamán también se detiene. Más tarde, cuando el ciervo se perdió en el junco, dice: <em>"Los animales que caminan en el agua llevan el mismo camino que nosotros. Los dos estamos entre dos mundos."</em>`,
    decisions: [
      { text: 'Cazar el ciervo. La carne durará días y el grupo lleva tiempo con hambre.',      effects: { food: +25, moral: -10, salud: +5,  union: -5  } },
      { text: 'Dejarlo pasar. Hay otras formas de conseguir comida que no incluyen eso.',       effects: { food: -3,  moral: +20, salud: 0,   union: +12 } },
    ],
  },

  e_mesopotamia: {
    title: 'Entre Dos Ríos',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Mesopotamia argentina — el Paraná y el Uruguay',
    narr:  `Dos ríos enormes encierran este territorio como brazos: el Paraná al oeste, el Uruguay al este. Entre ellos, una tierra tan fértil y húmeda que los árboles no saben parar de crecer. Los <span class="tt" data-tip="Chaná: pueblo indígena del delta del Paraná y el litoral argentino. Expertos navegantes en canoas de madera tallada. Vivían de la pesca, la caza y la recolección. Fueron diezmados rápidamente por el contacto europeo en el siglo XVI — su lengua ya es casi inaccesible. No deben confundirse con los charrúas uruguayos ni con los guaraníes.">chaná</span> que los reciben son hombres y mujeres del río: sus canoas tienen formas que el grupo nunca vio, talladas de un solo tronco con herramientas de piedra.<br><br>
Un anciano chaná mide al cacique con la mirada y dice, a través de un joven que chapurrea guaraní: <em>"Hace dos años pasaron otros fugitivos. Iban más al sur. Encontraron lo que buscaban — o lo que los encontró a ellos."</em><br><br>
La frase queda suspendida como el agua en el aire del Paraná.`,
    decisions: [
      { text: 'Preguntar todo lo que saben sobre los fugitivos anteriores. Pueden ser familia o guía.', effects: { food: +10, moral: +20, union: +15 } },
      { text: 'Navegar con los chaná unos días. Aprender el río antes de cruzarlo.',                   allianceKey: 'chana', effects: { food: +15, moral: +15, salud: +8,  union: +12 } },
      { text: 'Cruzar rápido hacia el sur. Las noticias de otros grupos son esperanza pero también trampa.', effects: { food: -5, moral: +8, union: +5 } },
    ],
  },

  e_mesopotamia_b: {
    title: 'Los Embalsados',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&q=80',
    cap:   'Islas flotantes del Paraná',
    narr:  `La isla se mueve. No es ilusión — la corriente lleva consigo una masa de vegetación entretejida, árboles incluidos, que navega el Paraná como si tuviera voluntad propia. Los <span class="tt" data-tip="Embalsados: islas flotantes naturales formadas por la acumulación de plantas acuáticas (principalmente camalotes) en el Paraná. Pueden tener cientos de metros de largo y viajar decenas de kilómetros. Algunos son tan sólidos que soportan árboles grandes. Los chaná los usaban como refugios temporales y plataformas de pesca.">embalsados</span> del Paraná son tierra que viaja.<br><br>
Un chaná le explica al chamán cómo reconocer los seguros de los peligrosos: <em>"Los que llevan camalote blanco van rápido — peligrosos. Los de camalote lila, despacio — esos se pueden subir."</em><br><br>
Subirán más rápido que caminando, sin dejar rastro, sin gastar energía. El único problema: no controlan a dónde van.`,
    decisions: [
      { text: 'Subirse al embalsado lila. La corriente decide — y a veces decide bien.',  effects: { food: +5,  moral: +18, salud: +5,  union: +10 } },
      { text: 'Seguir por tierra junto al río. Más lento, pero sin depender del camalote.', effects: { food: -8,  moral: +5,  salud: -3,  union: +3  } },
    ],
  },

  e_pampas_sur: {
    title: 'La Tierra que No Perdona',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Pampa interior — viento, horizonte y nada más',
    narr:  `Tres días sin un árbol. El viento viene del sur sin nada que lo frene — ni una colina, ni un arbusto alto — y golpea de frente como si tuviera intención. Los niños aprenden a caminar inclinados. Los guerreros aprenden que el frío de la pampa no avisa: llega de golpe cuando el sol cae.<br><br>
Los <span class="tt" data-tip="Ranqueles (Rankülche): pueblo mapuche de la pampa interior argentina. Su territorio incluía lo que hoy es La Pampa y San Luis. Eran jinetes expertos y conocían cada aguada, médano y bajo de la llanura. Resistieron la conquista militar hasta 1878-1879, cuando la Campaña del Desierto los sometió. El cacique Pincén fue el último en rendirse.">ranqueles</span> aparecen a caballo — con caballos tomados a los mismos españoles — y rodean al grupo sin atacar. Su cacique desmonta y camina hasta el cacique del grupo. Los mira de arriba abajo.<br><br>
<em>"¿Cuántos son?"</em> No es una amenaza. Es una evaluación.`,
    decisions: [
      { text: 'Responder con honestidad y pedir paso. Los ranqueles respetan al que no miente.',  allianceKey: 'ranquel', effects: { food: +12, moral: +18, salud: +5,  union: +12 } },
      { text: 'Pedir guía ranquel por los aguajes de la pampa. Sin agua, la llanura mata.',        effects: { food: +8,  moral: +12, salud: +12, union: +8  } },
      { text: 'Ofrecer a los guerreros como aliados temporales. La fuerza también es moneda.',     effects: { food: +5,  moral: +8,  union: +5,  warriors: -2 } },
    ],
  },

  e_pampas_sur_b: {
    title: 'El Ñandú y la Luna',
    act:   'Acto III · El Sur',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Ñandúes en la pampa — los corredores del horizonte',
    narr:  `Los <span class="tt" data-tip="El ñandú (Rhea americana) es el ave no voladora más grande de América, con hasta 1,5 metros de altura y 30 kg. Corre a 60 km/h. Los pueblos pampeanos lo cazaban con boleadoras — tres piedras unidas por tiras de cuero que se lanzaban para enredar las patas. Los huevos y la carne son alimento, las plumas sirven para todo. La caza del ñandú requería coordinación de varios cazadores formando un semicírculo.">ñandúes</span> corren en grupo hacia el este, asustados por algo que el grupo no ve todavía. Los ranqueles no necesitan discutir — cuatro de ellos salen al galope en formación de arco, con las <span class="tt" data-tip="Boleadoras: arma de caza y guerra pampeana, adoptada luego por los gauchos. Consiste en dos o tres bolas de piedra o plomo envueltas en cuero, unidas por tiras. Se lanza girando sobre la cabeza y envuelve las patas del animal al impactar. Origen precolombino: hay boleadoras en Argentina de más de 9.000 años.">boleadoras</span> girando sobre sus cabezas.<br><br>
Cinco minutos después vuelven con dos ñandúes. El grupo come esa noche hasta saciarse por primera vez en semanas. Un niño ranquel le enseña a un niño del grupo a lanzar una boleadora pequeña. La primera vez falla. La segunda vez, no mucho.`,
    decisions: [
      { text: 'Aprender las boleadoras. Un arma de la pampa para un pueblo que viaja por la pampa.', effects: { food: +20, moral: +18, salud: +5,  union: +14 } },
      { text: 'Solo agradecer la carne. No siempre hay tiempo para aprender todo.',                   effects: { food: +20, moral: +8,  salud: +5,  union: +5  } },
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

  e_encrucijada_b: {
    title: 'El Peso de los que No Llegaron',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    cap:   'Patagonia — la llanura que termina el mundo conocido',
    narr:  `El chamán mayor convoca una ceremonia inesperada. No anuncia destinos — anuncia cuentas.<br><br>
Nombra a cada persona que partió de Guatemala y no llegó hasta aquí. Cada nombre cae sobre el círculo como una piedra. Son muchos más de los que el grupo recuerda conscientemente. Los niños que nacieron en el camino escuchan por primera vez cuántos murieron antes de que ellos existieran.<br><br>
Cuando termina, el silencio dura mucho tiempo. Luego el chamán habla:<br><br>
<em>"Los que no llegaron también eligieron. Eligieron con su vida que nosotros siguiéramos. Ahora les debemos una elección que valga lo que ellos pagaron."</em><br><br>
El sol está cayendo sobre el horizonte patagónico. Hay tres caminos. Y el peso de los muertos en cada paso.`,
    decisions: [
      { text: 'El Amazonas. Los que murieron en la selva nos señalaron ese camino con su sacrificio. Terminar donde ellos quisieron llegar.',                effects: { food: -3,  moral: +28, union: +15 }, finalTag: 'dest_amazonas'      },
      { text: 'La estepa patagónica. Los que murieron en las pampas nos dieron esa tierra. Quedarnos donde ellos cayeron.',                               effects: { food: -6,  moral: +25, union: +22 }, finalTag: 'dest_patagonia_arg' },
      { text: 'Los canales del fin del mundo. El lugar más lejano posible — donde ninguna memoria de persecución pueda alcanzarnos jamás.',                effects: { food: -8,  moral: +30, union: +18 }, finalTag: 'dest_patagonia_chi' },
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

  // ── ACTO IV — Nuevos nodos intermedios (bifurcaciones) ────

  // Rama A · n10a3a — Los Yagua del Ucayali
  e_yagua: {
    title: 'Los Guardianes del Ucayali',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Alto Ucayali — el río que nunca para',
    narr:  `Aparecen en las orillas sin hacer ruido, pintados de rojo achiote con diseños que el chamán reconoce como mapas: no del territorio, sino del cuerpo. Cara, brazos, torso — todo un lenguaje de posición en el mundo.<br><br>
Son <span class="tt" data-tip="Yagua: pueblo indígena del alto Amazonas peruano y colombiano. Hablan una lengua aíslada sin parentesco demostrado con ningún otro idioma. Sus pinturas corporales de achiote tienen función ritual y social: indican identidad, estatus y relación con el mundo espiritual.">yagua</span>. Llevan generaciones viviendo entre estos afluentes y conocen cada recodo del río como el interior de su propia casa.<br><br>
Su líder ofrece algo que no se pide pero se reconoce: comida, refugio por una noche, silencio sobre el paso del grupo.<br><br>
<em>"¿Cuánto tiempo llevan viviendo aquí?"</em> pregunta el chamán.<br><br>
El líder piensa. <em>"Desde antes de que el río tuviera su nombre actual."</em>`,
    decisions: [
      { text: 'Quedarse tres días aprendiendo sus rutas del río. El conocimiento salva vidas.',    effects: { food: +20, moral: +25, salud: +15, union: +20 }, allianceKey: 'yagua' },
      { text: 'Intercambiar técnicas de curación por guía a través del laberinto de afluentes.',   effects: { food: +15, moral: +20, salud: +20, union: +15 } },
      { text: 'Agradecer y seguir camino propio. No crear lazos que dificulten avanzar.',          effects: { food: +5,  moral: +15, salud: +5,  union: +10 } },
    ],
  },

  e_yagua_b: {
    title: 'El Río Que Recuerda',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
    cap:   'Ucayali — aguas que guardan memoria',
    narr:  `Los yagua tienen una práctica que el chamán no vio en ningún otro pueblo: cuando alguien del grupo muere, arrojan al río un objeto que perteneció a esa persona. Dicen que el río lo lleva al mar, el mar a las nubes, las nubes al origen.<br><br>
El chamán escucha esto y se queda muy quieto por un tiempo largo. Luego pregunta si pueden hacer lo mismo con sus muertos — los que dejaron atrás, los que cayeron en los ríos del norte.<br><br>
Los yagua consultan entre ellos. La respuesta llega en la misma tarde: <em>"El Ucayali conecta con todos los ríos. Lo que se le entrega aquí llega a todos los lugares al mismo tiempo."</em><br><br>
Es la primera vez desde Guatemala que alguien les ofrece una manera de despedirse de los que perdieron.`,
    decisions: [
      { text: 'Hacer el rito yagua por cada persona que perdieron en el camino. Es hora.',         effects: { food: +10, moral: +40, salud: +10, union: +35 } },
      { text: 'Observar el rito sin participar. Respetar sin apropiarse.',                        effects: { food: +5,  moral: +28, salud: +5,  union: +22 } },
      { text: 'Combinar el rito yagua con las propias tradiciones. Crear algo nuevo entre los dos.', effects: { food: +8, moral: +32, salud: +8, union: +30 } },
    ],
  },

  // Rama A · n10a3b — Las Fuentes Sagradas
  e_fuentes_sagradas: {
    title: 'El Principio del Agua',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1200&q=80',
    cap:   'Fuentes del Amazonas — donde el río nace',
    narr:  `Remontan el afluente durante días. El río se vuelve más angosto, más limpio, más rápido. Al decimoquinto día encuentran el punto donde el agua emerge directamente de la roca: una grieta en la piedra de la que brota un hilo de agua tan transparente que parece inexistente hasta que lo tocan.<br><br>
El chamán se arrodilla y moja la frente. Se levanta despacio.<br><br>
<em>"Este agua no fue nunca tocada por mano española. Nunca. Nadie sabe que está aquí."</em><br><br>
Los niños del grupo se acercan y ponen las manos bajo el hilo. El agua está fría con ese frío que solo tienen las cosas que vienen de muy adentro de la tierra.`,
    decisions: [
      { text: 'Fundar aquí, en la fuente. Nadie busca en el origen de un río.',                    effects: { food: +18, moral: +42, salud: +18, union: +35 } },
      { text: 'Construir un santuario en la fuente y seguir buscando el lugar definitivo.',        effects: { food: +10, moral: +35, salud: +12, union: +28 } },
      { text: 'Guardar silencio absoluto sobre este lugar. La fuente debe seguir siendo secreta.', effects: { food: +12, moral: +30, salud: +10, union: +25 } },
    ],
  },

  e_fuentes_sagradas_b: {
    title: 'Los Que Siempre Estuvieron',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    cap:   'Fuentes del Amazonas — el encuentro inesperado',
    narr:  `En la cabecera del río, donde esperaban encontrar solo piedra y agua, hay una aldea pequeña. Diez familias. Llevan generaciones aquí — tantas que no recuerdan haber venido de otro lugar. Para ellos, este es simplemente el mundo.<br><br>
No muestran sorpresa al ver al grupo. El anciano que parece ser el líder dice: <em>"Sabíamos que vendrían. El río siempre trae a los que el mundo de abajo ya no puede sostener."</em><br><br>
Los <span class="tt" data-tip="Pueblos cabecera: en muchas cuencas amazónicas, los grupos que habitan las fuentes de los ríos son considerados guardianes del origen del agua. En cosmovisiones amazónicas, el agua viene de las montañas, que son el mundo de los ancestros.">guardianes de las fuentes</span> son pocos pero llevan una relación con el lugar que ningún ejército puede deshacer.`,
    decisions: [
      { text: 'Pedirles vivir junto a ellos. Esta aldea es lo que buscaban.',                     effects: { food: +25, moral: +38, salud: +20, union: +32 }, allianceKey: 'guardianes_fuentes' },
      { text: 'Establecerse cerca pero separados. Cerca del refugio, lejos de la dependencia.',   effects: { food: +18, moral: +28, salud: +15, union: +22 } },
      { text: 'Intercambiar historias del norte a cambio de conocimiento del lugar.',             effects: { food: +12, moral: +32, salud: +10, union: +25 } },
    ],
  },

  // Rama B · n10b3a — Los Tehuelches del Sur
  e_tehuelches_sur: {
    title: 'Los Maestros de la Estepa Profunda',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia austral — tierra tehuelche del sur',
    narr:  `Los <span class="tt" data-tip="Tehuelches australes (Aonikenk): el grupo más meridional de los tehuelches, cazadores de guanacos con bolas arrojadizas. Conocían miles de kilómetros de estepa de memoria. Los conquistadores nunca los sometieron.">tehuelches del sur</span> tienen algo que distingue a los que vivieron siempre en un lugar: no necesitan explicar su territorio porque no existe en ellos la idea de que alguien pueda no conocerlo.<br><br>
El encuentro ocurre sin palabras iniciales. Comparten un fuego que nadie encendió para los otros pero que los otros pueden usar. Con el tiempo, el silencio se vuelve cómodo. Cómodo es el primer paso de la confianza.<br><br>
Al tercer día, un tehuelche joven enseña sin ser pedido: cómo leer el viento, cómo encontrar agua bajo la estepa seca, cómo moverse sin dejar rastro visible.`,
    decisions: [
      { text: 'Aprender todo lo que enseñen. Su conocimiento de este lugar es irremplazable.',    effects: { food: +22, moral: +30, salud: +20, union: +25 }, allianceKey: 'tehuelches_sur' },
      { text: 'Proponer vida en paralelo: dos grupos que se ayudan sin fusionarse.',               effects: { food: +18, moral: +25, salud: +15, union: +22 } },
      { text: 'Compartir las propias historias. Que el intercambio sea mutuo.',                   effects: { food: +12, moral: +28, salud: +10, union: +28 } },
    ],
  },

  e_tehuelches_sur_b: {
    title: 'El Secreto de las Bolas',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    cap:   'Patagonia — la caza como arte y ciencia',
    narr:  `Los tehuelches cazan guanacos con <span class="tt" data-tip="Boleadoras: arma de caza formada por piedras envueltas en cuero unidas con tiras del mismo material. Se arrojan girando y enredan las patas del animal. Los tehuelches las usaban con precisión asombrosa. Adoptadas luego por los gauchos.">boleadoras</span>: piedras unidas por tiras de cuero que se arrojan girando y enredan las patas del animal. La destreza es tal que los guerreros jóvenes del grupo quedan en silencio mirando.<br><br>
Un tehuelche viejo observa el asombro con satisfacción tranquila: <em>"Esto que ven — quince años de práctica. No hay atajo. Pero hay método."</em><br><br>
Ofrece enseñar a quienes quieran. La condición: paciencia. Y aceptar que los primeros intentos serán malos.`,
    decisions: [
      { text: 'Dedicar dos semanas a aprender. La habilidad vale el tiempo.',                     effects: { food: +30, moral: +28, salud: +12, union: +20, warriors: +2 } },
      { text: 'Aprender lo básico mientras el tehuelche caza para el grupo.',                     effects: { food: +25, moral: +20, salud: +10, union: +15 } },
      { text: 'Intercambiar: enseñarles medicina del norte a cambio de técnicas de caza.',        effects: { food: +20, moral: +30, salud: +18, union: +25 }, allianceKey: 'tehuelches_boleadoras' },
    ],
  },

  // Rama B · n10b3b — La Gran Estepa
  e_gran_estepa: {
    title: 'El Horizonte que No Acaba',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia — la estepa sin límite visible',
    narr:  `La estepa es tan plana que se puede ver la curvatura de la tierra. El viento es constante — no como tormenta sino como clima, como si el movimiento del aire fuera aquí el estado normal del mundo en reposo.<br><br>
Los <span class="tt" data-tip="Guanaco (Lama guanicoe): el herbívoro terrestre más grande de Sudamérica. Su lana es más fina que la de la llama. Un guanaco adulto puede correr a 60 km/h.">guanacos</span> cruzan en manadas de cientos, el suelo que vibra antes de que lleguen. El chamán observa el movimiento y dice: <em>"Todo lo que necesitamos está en movimiento. Nosotros también tenemos que aprender a movernos con lo que se mueve."</em><br><br>
La estepa, vacía a primera vista, está llena de señales para quien sabe leerlas.`,
    decisions: [
      { text: 'Seguir las manadas. El guanaco sabe dónde está el agua y el refugio.',              effects: { food: +28, moral: +22, salud: +18, union: +20 } },
      { text: 'Establecerse en el punto donde los vientos se cruzan. El centro de la estepa.',     effects: { food: +15, moral: +30, salud: +15, union: +28 } },
      { text: 'Construir una toldo permanente y aprender a cazar desde un lugar fijo.',            effects: { food: +22, moral: +18, salud: +20, union: +15 } },
    ],
  },

  e_gran_estepa_b: {
    title: 'La Noche Patagónica',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    cap:   'Patagonia — el cielo del sur',
    narr:  `La noche patagónica no tiene competencia. Sin árboles altos, sin montañas cercanas, sin ninguna fuente de luz humana en kilómetros a la redonda, el cielo del sur es un espectáculo que el grupo completo recibe en silencio.<br><br>
La <span class="tt" data-tip="Cruz del Sur (Crux): constelación visible solo desde el hemisferio sur, usada para navegación por marinos y pueblos indígenas durante milenios. Los tehuelches, kawésqar y mapuches tenían nombres propios para ella y la usaban para orientación en la Patagonia.">Cruz del Sur</span> está en el centro. El chamán la señala con emoción contenida: <em>"La conocíamos de las historias de los navegantes. Pero nunca la vi así. Nunca."</em><br><br>
Un guerrero joven propone algo que nadie esperaba: dibujar el cielo en cuero. Hacer un mapa de las estrellas del sur para no perderse nunca más.`,
    decisions: [
      { text: 'Pasar una semana mapeando el cielo austral. Es el primer mapa propio.',            effects: { food: -5,  moral: +40, salud: +5,  union: +32 } },
      { text: 'Observar y memorizar. No todo el conocimiento necesita ser escrito.',               effects: { food: +5,  moral: +30, salud: +8,  union: +25 } },
      { text: 'Celebrar con un rito. El cielo del sur merece una ceremonia de llegada.',           effects: { food: +8,  moral: +35, salud: +10, union: +38 } },
    ],
  },

  // Rama C · n10c3a — Los Canales Australes
  e_canales_australes: {
    title: 'El Laberinto del Agua',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Canales patagónicos — el mar entre las islas',
    narr:  `No hay costa — hay cientos de costas. El mar entra por la tierra en canales que se bifurcan, se cruzan, se pierden. Cada curva revela otra bifurcación. Sin guía, perderse aquí es la única opción disponible.<br><br>
Un niño kawésqar de no más de diez años aparece en la orilla observando. No tiene miedo. Tiene esa calma específica de quien está completamente en casa.<br><br>
El chamán intenta comunicarse. El niño responde en su lengua y señala con seguridad hacia el norte del canal, luego al este, luego dibuja con el dedo en el agua algo que podría ser un mapa.<br><br>
Hay algo universal en la urgencia que ambos comparten sin necesitar palabras.`,
    decisions: [
      { text: 'Seguir al niño. Un kawésqar de diez años sabe más de estos canales que cualquier adulto del grupo.', effects: { food: +15, moral: +28, salud: +15, union: +25 }, allianceKey: 'kawesqar_nino' },
      { text: 'Pedir que lleve a los adultos de su comunidad. Necesitan guías más experimentados.',                  effects: { food: +10, moral: +22, salud: +10, union: +18 } },
      { text: 'Construir una balsa y explorar solos el primer canal. Aprender haciendo.',                             effects: { food: -8,  moral: +20, salud: -8,  union: +15, warriors: -1 } },
    ],
  },

  e_canales_australes_b: {
    title: 'El Idioma del Agua',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Canales — cuando el agua habla',
    narr:  `Los kawésqar se mueven por los canales sin brújula ni mapa visible. Leen el color del agua: verde oscuro es fondo rocoso y peligroso; verde claro es seguro; negro es profundidad sin fondo. Leen la dirección del oleaje entre las islas. Leen el comportamiento de los lobos marinos en las rocas.<br><br>
El chamán pasa tres días en una canoa kawésqar aprendiendo a mirar. Al final del tercer día dice algo que sorprende al grupo:<br><br>
<em>"El agua aquí habla. No en metáfora. En información real. Hay que aprender a escucharla."</em><br><br>
Un guerrero mayor pregunta: <em>"¿Y cuánto tiempo lleva aprender?"</em> El kawésqar señala a sus hijos pequeños: <em>"Así de chicos empezamos."</em>`,
    decisions: [
      { text: 'Dedicar meses a aprender. Vale más este conocimiento que la velocidad.',            effects: { food: +20, moral: +35, salud: +20, union: +30 }, allianceKey: 'kawesqar_canales' },
      { text: 'Aprender lo esencial para no morir. El resto viene con la práctica.',               effects: { food: +15, moral: +25, salud: +15, union: +22 } },
      { text: 'Pedir a los kawésqar que naveguen con el grupo hasta el destino final.',            effects: { food: +12, moral: +30, salud: +12, union: +28 } },
    ],
  },

  // Rama C · n10c3b — Los Kawésqar
  e_kawesqar: {
    title: 'El Pueblo del Mar Eterno',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    cap:   'Archipiélago kawésqar — el fin del mundo habitado',
    narr:  `Los <span class="tt" data-tip="Kawésqar (también llamados Alacalufes): pueblo nómade marino de los canales patagónicos chilenos. Vivían en canoas de corteza, cazaban lobos marinos y recorrían miles de kilómetros de canales de memoria. El contacto con europeos los devastó: hoy quedan menos de 20 hablantes del idioma.">kawésqar</span> no tienen aldeas: tienen canoas. Su casa es el agua. Sus fuegos arden en la proa, en el agua misma.<br><br>
La anciana más respetada examina al cacique durante un tiempo incómodo. Luego habla, y el jóven intérprete traduce con lentitud:<br><br>
<em>"Dice que llegaron con demasiado peso. No en las manos. En aquí."</em> Señala el pecho. <em>"Dice que el mar solo acepta a los que aprendieron a soltar."</em><br><br>
El chamán escucha esto y no dice nada por mucho tiempo.`,
    decisions: [
      { text: 'Aprender a vivir sobre el agua como los kawésqar. Empezar desde cero.',             effects: { food: +20, moral: +38, salud: +18, union: +32 }, allianceKey: 'kawesqar' },
      { text: 'Establecerse en tierra cerca de ellos. Aprender sin perder lo que ya saben.',       effects: { food: +15, moral: +28, salud: +15, union: +25 } },
      { text: 'Escuchar a la anciana. Hacer una ceremonia de soltar lo que ya no pueden cargar.', effects: { food: +10, moral: +42, salud: +12, union: +38 } },
    ],
  },

  e_kawesqar_b: {
    title: 'La Canoa que No Necesita Mapa',
    act:   'Acto IV · El Destino',
    img:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    cap:   'Canales kawésqar — navegación sin brújula',
    narr:  `La canoa kawésqar es una obra de ingeniería que nadie creería capaz de cruzar los canales más peligrosos del continente. La madera de coigüe, curvada al fuego, ligada con tendones, calafateada con algas. Una embarcación que vive como el agua que la rodea: flexible, viva, temporal.<br><br>
Un hombre kawésqar les enseña a construir una. No da instrucciones — los hace trabajar junto a él, corrigiendo con las manos sin decir palabras. En cuatro días, el grupo tiene su primera canoa propia.<br><br>
El kawésqar la empuja al agua y con un solo movimiento de remo la lleva a velocidad sorprendente.<br><br>
<em>"La canoa es parte del cuerpo"</em>, dice. <em>"Cuando entiendan eso, pueden ir a cualquier lugar."</em>`,
    decisions: [
      { text: 'Construir más canoas. Si conocen el agua, conocen esta tierra.',                   effects: { food: +22, moral: +32, salud: +18, union: +28 } },
      { text: 'Aprender a navegar antes de construir más. La habilidad precede al material.',     effects: { food: +15, moral: +30, salud: +15, union: +25 } },
      { text: 'Combinar canoas kawésqar con técnicas propias. Crear algo nuevo.',                 effects: { food: +18, moral: +35, salud: +12, union: +32 }, allianceKey: 'kawesqar_navegacion' },
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
