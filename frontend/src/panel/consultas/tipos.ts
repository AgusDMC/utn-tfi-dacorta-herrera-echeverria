import type { TonoEstado } from '../componentes/EtiquetaEstado.tsx'

// Consultas tal como las devuelve el backend (ConsultaDto y el enum EstadoConsulta)

export type EstadoConsulta = 'NUEVA' | 'CONTACTADA' | 'EN_GESTION' | 'CERRADA' | 'DESCARTADA'

export const ESTADOS_CONSULTA: readonly EstadoConsulta[] = ['NUEVA', 'CONTACTADA', 'EN_GESTION', 'CERRADA', 'DESCARTADA']

export const ETIQUETA_ESTADO: Record<EstadoConsulta, string> = {
  NUEVA: 'Nueva',
  CONTACTADA: 'Contactada',
  EN_GESTION: 'En gestión',
  CERRADA: 'Cerrada',
  DESCARTADA: 'Descartada',
}

export const TONO_ESTADO: Record<EstadoConsulta, TonoEstado> = {
  NUEVA: 'destacado',
  CONTACTADA: 'en-curso',
  EN_GESTION: 'en-curso',
  CERRADA: 'final',
  DESCARTADA: 'final',
}

// Regla R11: la consulta avanza NUEVA → CONTACTADA → EN_GESTION → CERRADA y desde cualquier
// estado no final puede descartarse. CERRADA y DESCARTADA son finales. Hoy el backend no la
// valida: la pantalla solo ofrece estos pasos.
export const SIGUIENTES_ESTADOS: Record<EstadoConsulta, EstadoConsulta[]> = {
  NUEVA: ['CONTACTADA', 'DESCARTADA'],
  CONTACTADA: ['EN_GESTION', 'DESCARTADA'],
  EN_GESTION: ['CERRADA', 'DESCARTADA'],
  CERRADA: [],
  DESCARTADA: [],
}

export interface Consulta {
  id: number
  publicacionId: number
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  mensaje: string
  estado: EstadoConsulta
  fechaCreacion: string // instante ISO 8601
  fechaUltActualizacion: string
}

export function esEstadoConsulta(valor: string | null): valor is EstadoConsulta {
  return ESTADOS_CONSULTA.includes(valor as EstadoConsulta)
}
