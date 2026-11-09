import { enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { Consulta, EstadoConsulta } from './tipos.ts'

// Una página (20 por página, de la más nueva a la más vieja). El backend no filtra por estado.
export function listarConsultas(pagina: number, senal?: AbortSignal) {
  return getJson<Pagina<Consulta>>(`/api/admin/consultas?page=${pagina}`, tokenSesion(), senal)
}

export function obtenerConsulta(id: number, senal?: AbortSignal) {
  return getJson<Consulta>(`/api/admin/consultas/${id}`, tokenSesion(), senal)
}

export function cambiarEstadoConsulta(id: number, estado: EstadoConsulta) {
  return enviarJson<Consulta>('PATCH', `/api/admin/consultas/${id}/estado`, { estado }, tokenSesion())
}
