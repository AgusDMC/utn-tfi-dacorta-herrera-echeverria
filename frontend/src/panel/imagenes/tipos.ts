// Largo máximo de la descripción de una imagen, el mismo que valida el backend
export const LARGO_DESCRIPCION = 200

// Una imagen de una propiedad, tal como la devuelve el backend (ImagenPropiedadDto).
// La de menor orden es la portada en el sitio público.
export interface ImagenPropiedad {
  id: number
  propiedadId: number
  descripcion: string | null // se usa como texto alternativo
  url: string
  storageKey: string
  orden: number
  fechaCreacion: string
}
