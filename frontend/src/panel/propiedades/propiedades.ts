import { borrar, enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { DatosPropiedad, Propiedad } from './tipos.ts'

// Una página del listado del panel (20 por página, de la más nueva a la más vieja). Solo activas.
export function listarPaginaPropiedades(pagina: number, senal?: AbortSignal) {
  return getJson<Pagina<Propiedad>>(`/api/admin/propiedades?page=${pagina}`, tokenSesion(), senal)
}

// Todas las propiedades activas, para elegirlas o nombrarlas en las publicaciones. Pide páginas
// de 100 (el máximo que acepta el backend) hasta la última.
export async function listarPropiedades(senal?: AbortSignal) {
  const todas: Propiedad[] = []
  for (let pagina = 0; ; pagina++) {
    const respuesta = await getJson<Pagina<Propiedad>>(`/api/admin/propiedades?page=${pagina}&size=100`, tokenSesion(), senal)
    todas.push(...respuesta.results)
    if (!respuesta.hasNext) return todas
  }
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
