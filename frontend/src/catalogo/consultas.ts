import { postJson } from '../compartido/api/clienteApi.ts'

// Los datos que pide POST /api/consultas (ConsultaCreateDto del backend).
// Email y teléfono son opcionales, pero hace falta al menos uno.
export interface NuevaConsulta {
  publicacionId: number
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  mensaje: string
}

export async function enviarConsulta(consulta: NuevaConsulta) {
  await postJson('/api/consultas', consulta)
}
