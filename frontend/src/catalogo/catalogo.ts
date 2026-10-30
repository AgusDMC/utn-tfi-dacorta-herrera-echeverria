import { PUBLICACIONES_DEMO } from './datos/datosDemo.ts'
import type { FiltrosCatalogo, PublicacionCatalogo } from './tipos.ts'

// Punto único de acceso a los datos del catálogo.
// Hoy filtra los datos demo en memoria. Cuando exista la API, estas funciones
// van a consultar GET /api/catalogo y GET /api/catalogo/localidades con los
// mismos filtros; los componentes que las usan no cambian.

export function buscarPublicaciones(filtros: FiltrosCatalogo): PublicacionCatalogo[] {
  const localidad = filtros.localidad?.toLowerCase()
  return PUBLICACIONES_DEMO.filter(
    (publicacion) =>
      (!filtros.operacion || publicacion.tipoOperacion === filtros.operacion) &&
      (!filtros.tipo || publicacion.tipoPropiedad === filtros.tipo) &&
      (!localidad || publicacion.localidad.toLowerCase() === localidad),
  )
}

// Localidades que tienen publicaciones visibles (para el selector del buscador)
export function obtenerLocalidades(): string[] {
  const localidades = new Set(PUBLICACIONES_DEMO.map((publicacion) => publicacion.localidad))
  return [...localidades].sort((a, b) => a.localeCompare(b, 'es'))
}
