import { borrar, enviarFormulario, enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { ImagenPropiedad } from './tipos.ts'

// Las imágenes de una propiedad activa, en el orden en que se muestran
export function listarImagenes(propiedadId: number, senal?: AbortSignal) {
  return getJson<ImagenPropiedad[]>(`/api/admin/imagenes-propiedad/propiedad/${propiedadId}`, tokenSesion(), senal)
}

// Sube el archivo; la URL y el orden los define el backend
export function subirImagen(propiedadId: number, archivo: File, descripcion: string) {
  const formulario = new FormData()
  formulario.set('propiedadId', String(propiedadId))
  if (descripcion) formulario.set('descripcion', descripcion)
  formulario.set('archivo', archivo)
  return enviarFormulario<ImagenPropiedad>('/api/admin/imagenes-propiedad', formulario, tokenSesion())
}

export function cambiarDescripcionImagen(id: number, descripcion: string | null) {
  return enviarJson<ImagenPropiedad>('PUT', `/api/admin/imagenes-propiedad/${id}`, { descripcion }, tokenSesion())
}

// Borra la imagen y también su archivo en el almacenamiento
export function eliminarImagen(id: number) {
  return borrar(`/api/admin/imagenes-propiedad/${id}`, tokenSesion())
}
