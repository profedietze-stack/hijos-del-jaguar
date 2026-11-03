// Una alianza es con un PUEBLO, no con un evento. Varios eventos del mapa ofrecían la «misma»
// alianza con claves distintas (tehuelches ×5, kawésqar ×4, ranquel/ranqueles...) y cada una
// contaba aparte para el final épico y los logros: una ruta podía «aliarse» cinco veces con los
// mismos tehuelches. Se normaliza al registrar y al cargar un guardado viejo.
const CANONICA: Record<string, string> = {
  tehuelches_laguna: 'tehuelches',
  tehuelches_invierno: 'tehuelches',
  tehuelches_sur: 'tehuelches',
  tehuelches_boleadoras: 'tehuelches',
  kawesqar_nino: 'kawesqar',
  kawesqar_canales: 'kawesqar',
  kawesqar_navegacion: 'kawesqar',
  mapuches_parlamento: 'mapuches',
  ranquel: 'ranqueles',
  mojos_ingenieros: 'mojos',
  guardianes_fuentes: 'guardianes',
}

export function aliadoCanonico(key: string): string {
  return CANONICA[key] ?? key
}

/** Lista sin repetidos, con cada clave llevada a su pueblo. */
export function normalizarAlianzas(keys: readonly string[]): string[] {
  return [...new Set(keys.map(aliadoCanonico))]
}
