// Tipos del catálogo público. Los valores de los enums salen del modelo de datos
// (docs/entrega-2/01-modelo-de-datos.md y database/migrations/V1__esquema_inicial.sql).

export type TipoOperacion = 'VENTA' | 'ALQUILER'
export type TipoPropiedad = 'CASA' | 'DEPARTAMENTO' | 'PH' | 'DUPLEX'
export type Moneda = 'PESOS' | 'DOLARES'
// El catálogo solo muestra publicaciones DISPONIBLE o RESERVADA (regla R1)
export type EstadoComercialVisible = 'DISPONIBLE' | 'RESERVADA'

export const TIPOS_OPERACION: readonly TipoOperacion[] = ['VENTA', 'ALQUILER']
export const TIPOS_PROPIEDAD: readonly TipoPropiedad[] = ['CASA', 'DEPARTAMENTO', 'PH', 'DUPLEX']

export const ETIQUETA_OPERACION: Record<TipoOperacion, string> = {
  VENTA: 'Venta',
  ALQUILER: 'Alquiler',
}

// Cómo se nombra cada operación en la navegación y en el buscador
export const ACCION_OPERACION: Record<TipoOperacion, string> = {
  VENTA: 'Comprar',
  ALQUILER: 'Alquilar',
}

export const ETIQUETA_ESTADO: Record<EstadoComercialVisible, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
}

export const ETIQUETA_TIPO: Record<TipoPropiedad, string> = {
  CASA: 'Casa',
  DEPARTAMENTO: 'Departamento',
  PH: 'PH',
  DUPLEX: 'Dúplex',
}

// Una publicación tal como se muestra en el listado del catálogo.
// Combina datos de la publicación y de su propiedad.
export interface PublicacionCatalogo {
  id: number // id de la publicación: es el que usa la ruta /propiedades/:id
  titulo: string
  tipoOperacion: TipoOperacion
  precio: number
  moneda: Moneda
  expensas: number | null // siempre en pesos (decisión D5)
  estadoComercial: EstadoComercialVisible
  tipoPropiedad: TipoPropiedad
  localidad: string
  cantAmbientes: number
  superficieTotal: number // m²
  portada: { url: string; descripcion: string | null } | null // imagen de orden 1
}

export interface ImagenPublicacion {
  url: string
  descripcion: string | null // texto alternativo (imagen_propiedad.descripcion)
}

// Una publicación con todo lo que muestra su ficha. La galería viene ordenada
// (imagen de orden 1 primero) y la descripción es la de la publicación.
export interface PublicacionDetalle extends PublicacionCatalogo {
  resumen: string // propiedad.resumen: la entrada que abre la descripción
  descripcion: string
  imagenes: ImagenPublicacion[]
  cantDormitorios: number
  cantBanios: number
  tienePatio: boolean
  anioConstruccion: number | null
}

export interface FiltrosCatalogo {
  operacion?: TipoOperacion
  tipo?: TipoPropiedad
  localidad?: string
}
