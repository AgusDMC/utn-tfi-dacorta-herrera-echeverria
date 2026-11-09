import { getJson, patchJson } from '../../compartido/api/clienteApi.ts'
import { obtenerSesion } from '../autenticacion/sesion.ts'
import type { Consulta, EstadoConsulta } from './tipos.ts'

// Sin sesión se manda un token vacío: el backend responde 401 y la pantalla vuelve al login
function token() {
  return obtenerSesion()?.token ?? ''
}

// El backend las devuelve de la más nueva a la más vieja y sin filtrar
export function listarConsultas(senal?: AbortSignal) {
  return getJson<Consulta[]>('/api/admin/consultas', token(), senal)
}

export function obtenerConsulta(id: number, senal?: AbortSignal) {
  return getJson<Consulta>(`/api/admin/consultas/${id}`, token(), senal)
}

export function cambiarEstadoConsulta(id: number, estado: EstadoConsulta) {
  return patchJson<Consulta>(`/api/admin/consultas/${id}/estado`, { estado }, token())
}
