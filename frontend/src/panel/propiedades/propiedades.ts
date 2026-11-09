import { borrar, enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { DatosPropiedad, Propiedad } from './tipos.ts'

// Solo devuelve las propiedades activas
export function listarPropiedades(senal?: AbortSignal) {
  return getJson<Propiedad[]>('/api/admin/propiedades', tokenSesion(), senal)
}

export function obtenerPropiedad(id: number, senal?: AbortSignal) {
  return getJson<Propiedad>(`/api/admin/propiedades/${id}`, tokenSesion(), senal)
}

export function crearPropiedad(datos: DatosPropiedad) {
  return enviarJson<Propiedad>('POST', '/api/admin/propiedades', datos, tokenSesion())
}

export function actualizarPropiedad(id: number, datos: DatosPropiedad) {
  return enviarJson<Propiedad>('PUT', `/api/admin/propiedades/${id}`, datos, tokenSesion())
}

// Baja lógica: el backend responde a DELETE marcando la propiedad como inactiva, no la borra
export function darDeBajaPropiedad(id: number) {
  return borrar(`/api/admin/propiedades/${id}`, tokenSesion())
}
