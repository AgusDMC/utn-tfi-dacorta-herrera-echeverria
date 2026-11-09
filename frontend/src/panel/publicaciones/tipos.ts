import type { Moneda, TipoOperacion } from '../../catalogo/tipos.ts'
import type { TonoEstado } from '../componentes/EtiquetaEstado.tsx'

export type EstadoPublicacion = 'ACTIVA' | 'PAUSADA' | 'ELIMINADA'
export type EstadoComercial = 'DISPONIBLE' | 'RESERVADA' | 'ALQUILADA' | 'VENDIDA'

export const ESTADOS_PUBLICACION: readonly EstadoPublicacion[] = ['ACTIVA', 'PAUSADA', 'ELIMINADA']

export const ETIQUETA_ESTADO_PUBLICACION: Record<EstadoPublicacion, string> = {
  ACTIVA: 'Activa',
  PAUSADA: 'Pausada',
  ELIMINADA: 'Eliminada',
}

// Para el filtro del listado
export const ETIQUETA_ESTADO_PUBLICACION_PLURAL: Record<EstadoPublicacion, string> = {
  ACTIVA: 'Activas',
  PAUSADA: 'Pausadas',
  ELIMINADA: 'Eliminadas',
}

export const TONO_ESTADO_PUBLICACION: Record<EstadoPublicacion, TonoEstado> = {
  ACTIVA: 'destacado',
  PAUSADA: 'en-curso',
  ELIMINADA: 'final',
}

export const ETIQUETA_ESTADO_COMERCIAL: Record<EstadoComercial, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
  ALQUILADA: 'Alquilada',
  VENDIDA: 'Vendida',
}

// Regla R3: una venta nunca queda alquilada y un alquiler nunca queda vendido
export const ESTADOS_COMERCIALES: Record<TipoOperacion, EstadoComercial[]> = {
  VENTA: ['DISPONIBLE', 'RESERVADA', 'VENDIDA'],
  ALQUILER: ['DISPONIBLE', 'RESERVADA', 'ALQUILADA'],
}

export const MONEDAS: readonly Moneda[] = ['PESOS', 'DOLARES']

export const ETIQUETA_MONEDA: Record<Moneda, string> = {
  PESOS: 'Pesos',
  DOLARES: 'Dólares',
}

// Lo que se edita en el alta y en la edición. Las expensas son siempre en pesos.
interface DatosPublicacion {
  titulo: string
  descripcion: string | null // vacía: el backend usa el resumen de la propiedad
  tipoOperacion: TipoOperacion
  precio: number
  moneda: Moneda
  expensas: number | null
}

// POST /api/admin/publicaciones (PublicacionCreateDto). El backend la crea ACTIVA y DISPONIBLE.
export interface NuevaPublicacion extends DatosPublicacion {
  propiedadId: number
}

// PUT /api/admin/publicaciones/{id} (PublicacionUpdateDto). La propiedad no se puede cambiar.
export interface CambiosPublicacion extends DatosPublicacion {
  estadoComercial: EstadoComercial
}

// Lo que entrega el formulario. La página arma con esto el cuerpo exacto del alta o de la edición.
export interface ValoresPublicacion extends NuevaPublicacion {
  estadoComercial: EstadoComercial | null // solo en la edición
}

// PublicacionDto
export interface Publicacion extends DatosPublicacion {
  id: number
  propiedadId: number
  descripcion: string
  estadoPublicacion: EstadoPublicacion
  estadoComercial: EstadoComercial
  fechaCreacion: string
  fechaPublicacion: string | null
  fechaUltActualizacion: string
}

export function esEstadoPublicacion(valor: string | null): valor is EstadoPublicacion {
  return ESTADOS_PUBLICACION.includes(valor as EstadoPublicacion)
}
