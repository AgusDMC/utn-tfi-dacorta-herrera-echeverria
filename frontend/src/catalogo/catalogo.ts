import { DETALLES_DEMO, PUBLICACIONES_DEMO } from './datos/datosDemo.ts'
import type { FiltrosCatalogo, PublicacionCatalogo, PublicacionDetalle } from './tipos.ts'

// Punto único de acceso a los datos del catálogo.
// Hoy filtra los datos demo en memoria. Cuando exista la API, estas funciones
// van a consultar GET /api/catalogo, GET /api/catalogo/localidades y el detalle de una
// publicación con los mismos parámetros; los componentes que las usan no cambian.

export function buscarPublicaciones(filtros: FiltrosCatalogo): PublicacionCatalogo[] {
  const localidad = filtros.localidad?.toLowerCase()
  return PUBLICACIONES_DEMO.filter(
    (publicacion) =>
      (!filtros.operacion || publicacion.tipoOperacion === filtros.operacion) &&
      (!filtros.tipo || publicacion.tipoPropiedad === filtros.tipo) &&
      (!localidad || publicacion.localidad.toLowerCase() === localidad),
  )
}

// Una publicación visible con su ficha completa; undefined si no existe o no es visible
export function obtenerPublicacion(id: number): PublicacionDetalle | undefined {
  const publicacion = PUBLICACIONES_DEMO.find((candidata) => candidata.id === id)
  const detalle = DETALLES_DEMO[id]
  return publicacion && detalle ? { ...publicacion, ...detalle } : undefined
}

// Localidades que tienen publicaciones visibles (para el selector del buscador)
export function obtenerLocalidades(): string[] {
  const localidades = new Set(PUBLICACIONES_DEMO.map((publicacion) => publicacion.localidad))
  return [...localidades].sort((a, b) => a.localeCompare(b, 'es'))
}
