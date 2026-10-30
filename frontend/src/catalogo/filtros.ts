import {
  TIPOS_OPERACION,
  TIPOS_PROPIEDAD,
  type FiltrosCatalogo,
  type TipoOperacion,
  type TipoPropiedad,
} from './tipos.ts'

// Filtros del catálogo en la URL: /?operacion=VENTA&tipo=CASA&localidad=Santa+Rosa
// Así una búsqueda se puede compartir y el botón Atrás vuelve a la anterior.

function esOperacion(valor: string | null): valor is TipoOperacion {
  return TIPOS_OPERACION.includes(valor as TipoOperacion)
}

function esTipoPropiedad(valor: string | null): valor is TipoPropiedad {
  return TIPOS_PROPIEDAD.includes(valor as TipoPropiedad)
}

// Lee los filtros de la URL. Los valores desconocidos se ignoran.
export function leerFiltros(params: URLSearchParams): FiltrosCatalogo {
  const operacion = params.get('operacion')
  const tipo = params.get('tipo')
  const localidad = params.get('localidad')?.trim()

  return {
    operacion: esOperacion(operacion) ? operacion : undefined,
    tipo: esTipoPropiedad(tipo) ? tipo : undefined,
    localidad: localidad || undefined,
  }
}

// Arma la URL del catálogo para un conjunto de filtros
export function urlCatalogo(filtros: FiltrosCatalogo): string {
  const params = new URLSearchParams()
  if (filtros.operacion) params.set('operacion', filtros.operacion)
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.localidad) params.set('localidad', filtros.localidad)

  const query = params.toString()
  return query ? `/?${query}` : '/'
}

export function hayFiltros(filtros: FiltrosCatalogo): boolean {
  return Boolean(filtros.operacion || filtros.tipo || filtros.localidad)
}

// El buscador navega con este estado para que el foco pase a los resultados
// (el formulario se vuelve a montar y, sin esto, el foco se perdería).
export const ESTADO_ENFOCAR_RESULTADOS = { enfocarResultados: true }

export function pideEnfocarResultados(estado: unknown): boolean {
  return typeof estado === 'object' && estado !== null && 'enfocarResultados' in estado
}
