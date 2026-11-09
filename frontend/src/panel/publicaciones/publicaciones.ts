import { borrar, enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { CambiosPublicacion, NuevaPublicacion, Publicacion } from './tipos.ts'

// Una página (20 por página, la última actualizada primero). Incluye pausadas y eliminadas;
// el backend no filtra por estado.
export function listarPublicaciones(pagina: number, senal?: AbortSignal) {
  return getJson<Pagina<Publicacion>>(`/api/admin/publicaciones?page=${pagina}`, tokenSesion(), senal)
}

export function obtenerPublicacion(id: number, senal?: AbortSignal) {
  return getJson<Publicacion>(`/api/admin/publicaciones/${id}`, tokenSesion(), senal)
}

export function crearPublicacion(datos: NuevaPublicacion) {
  return enviarJson<Publicacion>('POST', '/api/admin/publicaciones', datos, tokenSesion())
}

export function actualizarPublicacion(id: number, datos: CambiosPublicacion) {
  return enviarJson<Publicacion>('PUT', `/api/admin/publicaciones/${id}`, datos, tokenSesion())
}

export function activarPublicacion(id: number) {
  return enviarJson<Publicacion>('PATCH', `/api/admin/publicaciones/${id}/activar`, undefined, tokenSesion())
}

export function pausarPublicacion(id: number) {
  return enviarJson<Publicacion>('PATCH', `/api/admin/publicaciones/${id}/pausar`, undefined, tokenSesion())
}

// Baja lógica: el backend la deja ELIMINADA y la sigue devolviendo en el listado
export function darDeBajaPublicacion(id: number) {
  return borrar(`/api/admin/publicaciones/${id}`, tokenSesion())
}
