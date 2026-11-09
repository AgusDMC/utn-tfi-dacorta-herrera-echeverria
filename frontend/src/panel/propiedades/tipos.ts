import type { TipoPropiedad } from '../../catalogo/tipos.ts'

// Lo que se carga en el formulario y se envía en el alta y la edición
// (PropiedadCreateDto y PropiedadUpdateDto tienen los mismos campos)
export interface DatosPropiedad {
  tipoPropiedad: TipoPropiedad
  resumen: string
  direccion: string
  localidad: string
  cantAmbientes: number
  cantDormitorios: number
  cantBanios: number
  tienePatio: boolean
  superficieTotal: number
  anioConstruccion: number | null
}

// Una propiedad tal como la devuelve el backend (PropiedadDto)
export interface Propiedad extends DatosPropiedad {
  id: number
  activa: boolean
  fechaCreacion: string
  fechaUltActualizacion: string
}
