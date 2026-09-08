/**
 * De donde sale cada imagen del juego.
 *
 * Todas vienen de Wikimedia Commons, todas tienen licencia libre y todas se sirven desde
 * este mismo sitio: mientras se juega no hay una sola peticion a un tercero.
 *
 * Estan aqui por dos motivos. Las licencias CC-BY piden atribucion, y el juego ya cita la
 * fuente de cada dato historico — una imagen no deberia ser la excepcion.
 *
 * Generado. No editar a mano.
 */

export interface CreditoImagen {
  readonly archivo: string
  readonly titulo: string
  readonly autor: string
  readonly licencia: string
  readonly enlace: string
}

export const CREDITOS_IMAGENES: readonly CreditoImagen[] = [
  { archivo: "aguada-chaco", titulo: "Familia de capibara.jpg", autor: "Ludwinsiles", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Familia_de_capibara.jpg" },
  { archivo: "amazonia-boliviana", titulo: "R\u00edo Mamor\u00e9 I, Bolivia.jpg", autor: "Yulacha", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:R\u00edo_Mamor\u00e9_I,_Bolivia.jpg" },
  { archivo: "andes", titulo: "Laguna Antacocha con los nevados Cashan, Rurec, Huants\u00e1n y Shacsha 2.jpg", autor: "Cbrescia", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Laguna_Antacocha_con_los_nevados_Cashan,_Rurec,_Huants\u00e1n_y_Shacsha_2.jpg" },
  { archivo: "araucarias", titulo: "Hojas y ramas de pehu\u00e9n (Araucaria araucana). Icalma, Regi\u00f3n de La Araucan\u00eda, Chile.jpg", autor: "CARLOS TEIXIDOR CADENAS", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Hojas_y_ramas_de_pehu\u00e9n_(Araucaria_araucana)._Icalma,_Regi\u00f3n_de_La_Araucan\u00eda,_Chile.jpg" },
  { archivo: "boleadoras", titulo: "Le Tour du monde-04-p248.jpg", autor: "Horace Castelli", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Le_Tour_du_monde-04-p248.jpg" },
  { archivo: "bosque-valdiviano", titulo: "Valdivian temperate rainforest.JPG", autor: "Albh", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Valdivian_temperate_rainforest.JPG" },
  { archivo: "ceramica-shipibo", titulo: "Tinaja shipibo MNA.jpg", autor: "Autor desconocido", licencia: "Attribution", enlace: "https://commons.wikimedia.org/wiki/File:Tinaja_shipibo_MNA.jpg" },
  { archivo: "chaco", titulo: "Kvinna sittande utanf\u00f6r hydda som tillverkar keramik. Bolivianska Chaco. Gran Chaco - SMVK - 004786.tif", autor: "Erland Nordenski\u00f6ld", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Kvinna_sittande_utanf\u00f6r_hydda_som_tillverkar_keramik._Bolivianska_Chaco._Gran_Chaco_-_SMVK_-_004786.tif" },
  { archivo: "cielo-sur", titulo: "VISTA\u2019s view of the Small Magellanic Cloud.jpg", autor: "ESO/VISTA VMC", licencia: "CC BY 4.0", enlace: "https://commons.wikimedia.org/wiki/File:VISTA\u2019s_view_of_the_Small_Magellanic_Cloud.jpg" },
  { archivo: "ciervo-pantanos", titulo: "Male Marsh Deer PE Rio do Peixe 1.jpg", autor: "Miguelrangeljr", licencia: "CC BY 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Male_Marsh_Deer_PE_Rio_do_Peixe_1.jpg" },
  { archivo: "cimarrones", titulo: "SR245u (92) Een optocht van boschneger.jpg", autor: "Autor desconocido", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:SR245u_(92)_Een_optocht_van_boschneger.jpg" },
  { archivo: "ciudad-perdida", titulo: "CIUDAD PERDIDA 2.jpg", autor: "Giancarlos1234", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:CIUDAD_PERDIDA_2.jpg" },
  { archivo: "condor", titulo: "Andean Condor in full flight.JPG", autor: "Wer-Al Zwowe", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Andean_Condor_in_full_flight.JPG" },
  { archivo: "conquistadores", titulo: "Codex azcatitlan222.jpg", autor: "Unknown authorUnknown author", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Codex_azcatitlan222.jpg" },
  { archivo: "cueva-manos", titulo: "Pinturas rupestres - s\u00edmbolos humanos.jpg", autor: "LuigiStudio", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Pinturas_rupestres_-_s\u00edmbolos_humanos.jpg" },
  { archivo: "embalsados", titulo: "Aquatic invasive plant water hyacinth eichhornia crassipes in full bloom.jpg", autor: "Ramey V, U.S. Fish and Wildlife Service", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Aquatic_invasive_plant_water_hyacinth_eichhornia_crassipes_in_full_bloom.jpg" },
  { archivo: "encuentro-pueblos", titulo: "Book 2 0752 Feather painters and their works.tif", autor: "Gary Francisco Keller, artwork created under supervision of Bernardino de Sahag\u00fa", licencia: "CC BY 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Book_2_0752_Feather_painters_and_their_works.tif" },
  { archivo: "fuego-llanura", titulo: "Bosque Encantado, Parque nacional de Garajonay, La Gomera, Espa\u00f1a, 2012-12-14, DD 20.jpg", autor: "Diego Delso", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Bosque_Encantado,_Parque_nacional_de_Garajonay,_La_Gomera,_Espa\u00f1a,_2012-12-14,_DD_20.jpg" },
  { archivo: "humahuaca", titulo: "Hornocal.JPG", autor: "Lahi", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Hornocal.JPG" },
  { archivo: "ibera", titulo: "Yacar\u00e9 Correntino.JPG", autor: "Mark115", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Yacar\u00e9_Correntino.JPG" },
  { archivo: "jaguar", titulo: "3 Jaguars killing a Caiman, Parque Estadual Encontro das \u00c1guas Thomas-Fuhrmann.jpg", autor: "Thomas Fuhrmann", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:3_Jaguars_killing_a_Caiman,_Parque_Estadual_Encontro_das_\u00c1guas_Thomas-Fuhrmann.jpg" },
  { archivo: "llamas", titulo: "Lama glama Laguna Colorada 2.jpg", autor: "kallerna", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Lama_glama_Laguna_Colorada_2.jpg" },
  { archivo: "llanos", titulo: "Llanos1.jpg", autor: "Haroldarmitage", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Llanos1.jpg" },
  { archivo: "llanos-mojos", titulo: "Beni Department a\u00e9rea 25.jpg", autor: "Sam Beebe", licencia: "CC BY-SA 2.0", enlace: "https://commons.wikimedia.org/wiki/File:Beni_Department_a\u00e9rea_25.jpg" },
  { archivo: "lluvia-patagonia", titulo: "Glaciar colgante.jpg", autor: "Milodon3", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Glaciar_colgante.jpg" },
  { archivo: "lomas-mojos", titulo: "Beni Department a\u00e9rea 25.jpg", autor: "Sam Beebe", licencia: "CC BY-SA 2.0", enlace: "https://commons.wikimedia.org/wiki/File:Beni_Department_a\u00e9rea_25.jpg" },
  { archivo: "manati", titulo: "Manatee with calf.PD.jpg", autor: "Galen Rathbun", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Manatee_with_calf.PD.jpg" },
  { archivo: "maranon", titulo: "R\u00edo Mara\u00f1\u00f3n 00277.jpg", autor: "Waterloo1883", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:R\u00edo_Mara\u00f1\u00f3n_00277.jpg" },
  { archivo: "marcas-arboles", titulo: "Petroglifos El Sobrante..jpg", autor: "Milodon3", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Petroglifos_El_Sobrante..jpg" },
  { archivo: "mercado-precolombino", titulo: "Codex Mendoza folio 46r.jpg", autor: "Autor desconocido", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Codex_Mendoza_folio_46r.jpg" },
  { archivo: "misiones-jesuitas", titulo: "Ruins of San Ignacio Min\u00ed.jpg", autor: "Fernando", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Ruins_of_San_Ignacio_Min\u00ed.jpg" },
  { archivo: "mola", titulo: "Papo Mola.JPG", autor: "Jessesamuel", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Papo_Mola.JPG" },
  { archivo: "nandu", titulo: "Nandu Rhea americana Tierpark Hellabrunn-1.jpg", autor: "Rufus46", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Nandu_Rhea_americana_Tierpark_Hellabrunn-1.jpg" },
  { archivo: "niebla-cumbres", titulo: "Forest Los Tilos.jpg", autor: "Autor desconocido", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Forest_Los_Tilos.jpg" },
  { archivo: "pacifico-costa", titulo: "Oc\u00e9ano pacifico en el Choco, Colombia.jpg", autor: "Luis P\u00e9rez", licencia: "CC BY 2.0", enlace: "https://commons.wikimedia.org/wiki/File:Oc\u00e9ano_pacifico_en_el_Choco,_Colombia.jpg" },
  { archivo: "panama-antigua", titulo: "Cabildo en las ruinas de Panam\u00e1 Viejo.JPG", autor: "Ayaita", licencia: "CC0", enlace: "https://commons.wikimedia.org/wiki/File:Cabildo_en_las_ruinas_de_Panam\u00e1_Viejo.JPG" },
  { archivo: "parana", titulo: "Paran\u00e1.jpg", autor: "Luis Argerich from Buenos Aires, Argentina", licencia: "CC BY 2.0", enlace: "https://commons.wikimedia.org/wiki/File:Paran\u00e1.jpg" },
  { archivo: "quebrada-noa", titulo: "Quebrada de las Conchas 06.jpg", autor: "Bernard Gagnon", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Quebrada_de_las_Conchas_06.jpg" },
  { archivo: "rio-honduras", titulo: "Patuca medio e ind\u00edgena Miskito.jpg", autor: "Marcio Mart\u00ednez", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Patuca_medio_e_ind\u00edgena_Miskito.jpg" },
  { archivo: "rio-negro", titulo: "Rio negro em manaus 3.jpg", autor: "Marina macuco", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Rio_negro_em_manaus_3.jpg" },
  { archivo: "salto-tepuy", titulo: "Salto Angel - Kerepakupai Ven\u00e1.JPG", autor: "Heribert Dezeo", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Salto_Angel_-_Kerepakupai_Ven\u00e1.JPG" },
  { archivo: "selva-amazonica", titulo: "Amazon Rainforest.jpg", autor: "Antonio Campoy", licencia: "CC BY 2.0", enlace: "https://commons.wikimedia.org/wiki/File:Amazon_Rainforest.jpg" },
  { archivo: "selva-centroamerica", titulo: "Hana Highway Overlook.jpg", autor: "Jonathanking", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Hana_Highway_Overlook.jpg" },
  { archivo: "sierras-cordoba", titulo: "Los Gigantes Mayo 2026 0022.jpg", autor: "Gedankenstuecke", licencia: "CC BY-SA 4.0", enlace: "https://commons.wikimedia.org/wiki/File:Los_Gigantes_Mayo_2026_0022.jpg" },
  { archivo: "talamanca-bosque", titulo: "Chirrip\u00f3.jpg", autor: "Peter Andersen", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Chirrip\u00f3.jpg" },
  { archivo: "tehuelches", titulo: "Museo LP 050 Manto Tehuelche.JPG", autor: "Claudio Elias", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Museo_LP_050_Manto_Tehuelche.JPG" },
  { archivo: "tepuy", titulo: "Los Jacuzzis.jpg", autor: "Luis Ovalles", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Los_Jacuzzis.jpg" },
  { archivo: "vides", titulo: "Vigne en fleur.JPG", autor: "V\u00e9ronique PAGNIER", licencia: "CC BY-SA 3.0", enlace: "https://commons.wikimedia.org/wiki/File:Vigne_en_fleur.JPG" },
  { archivo: "viruela", titulo: "Healer (ticitl) tending to people suffering from smallpox in 1520 in Book 12 of the Florentine Codex, 1577.jpg", autor: "Bernardino de Sahag\u00fan.", licencia: "Public domain", enlace: "https://commons.wikimedia.org/wiki/File:Healer_(ticitl)_tending_to_people_suffering_from_smallpox_in_1520_in_Book_12_of_the_Florentine_Codex,_1577.jpg" },
  { archivo: "volcan-guatemala", titulo: "Pacaya-10.JPG", autor: "Autor desconocido", licencia: "CC BY-SA 2.5", enlace: "https://commons.wikimedia.org/wiki/File:Pacaya-10.JPG" },
]
