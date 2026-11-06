/**
 * De donde sale cada sonido del juego.
 *
 * Todos son grabaciones libres y se sirven desde este mismo sitio. Las de licencia CC-BY
 * piden atribucion: sin este credito no se pueden usar. Las CC0 no lo piden, pero se
 * nombran igual.
 *
 * Los archivos son las vistas previas de Freesound (unos 80 kbps), no los originales.
 */

export interface CreditoAudio {
  /** Nombre del archivo bajo `public/audio/`. */
  readonly archivo: string
  readonly titulo: string
  readonly autor: string
  readonly licencia: string
  readonly enlace: string
  readonly uso: string
}

export const CREDITOS_AUDIO: readonly CreditoAudio[] = [
  { archivo: 'musica/kerriflute.ogg', titulo: 'KerriFlute.wav', autor: 'ethang (flauta de Kerri)', licencia: 'CC BY 4.0', enlace: 'https://freesound.org/s/88795/', uso: 'Menú' },
  { archivo: 'musica/canyon_quena_solo1.ogg', titulo: 'CANYON QUENA SOLO 1.wav', autor: 'CarlosCarty', licencia: 'CC BY 4.0', enlace: 'https://freesound.org/s/431387/', uso: 'Acto I' },
  { archivo: 'musica/amazon_bamboo_loop.ogg', titulo: 'AMAZON BAMBOO FLUTE LOOP Am 132 BPM HQ', autor: 'CarlosCarty', licencia: 'CC BY 4.0', enlace: 'https://freesound.org/s/464010/', uso: 'Acto II' },
  { archivo: 'musica/ethno_native_atmosphere.ogg', titulo: 'Ethno Folk Native-American Flute Atmosphere', autor: 'szegvari', licencia: 'CC0', enlace: 'https://freesound.org/s/634118/', uso: 'Acto III' },
  { archivo: 'musica/old_flutist.ogg', titulo: 'THE OLD FLUTIST - FLUTE SOLO MELODY', autor: 'CarlosCarty', licencia: 'CC BY 4.0', enlace: 'https://freesound.org/s/520603/', uso: 'Acto IV' },
  { archivo: 'musica/desert_wind.ogg', titulo: 'Looping Gentle Wind Ambience on an Open Desert Plain', autor: 'dhallcomposer', licencia: 'CC0', enlace: 'https://freesound.org/s/697217/', uso: 'Ambiente del juego' },
  { archivo: 'sfx/', titulo: 'Interface Sounds', autor: 'Kenney (kenney.nl)', licencia: 'CC0', enlace: 'https://kenney.nl/assets/interface-sounds', uso: 'Efectos' },
]
