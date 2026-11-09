import { enviarJson, getJson } from '../../compartido/api/clienteApi.ts'
import { tokenSesion } from '../autenticacion/sesion.ts'
import type { Consulta, EstadoConsulta } from './tipos.ts'

// El backend las devuelve de la más nueva a la más vieja y sin filtrar
export function listarConsultas(senal?: AbortSignal) {
  return getJson<Consulta[]>('/api/admin/consultas', tokenSesion(), senal)
}

export function obtenerConsulta(id: number, senal?: AbortSignal) {
  return getJson<Consulta>(`/api/admin/consultas/${id}`, tokenSesion(), senal)
}

export function cambiarEstadoConsulta(id: number, estado: EstadoConsulta) {
  return enviarJson<Consulta>('PATCH', `/api/admin/consultas/${id}/estado`, { estado }, tokenSesion())
}
