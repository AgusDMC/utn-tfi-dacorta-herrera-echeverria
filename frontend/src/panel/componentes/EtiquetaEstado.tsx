import { ETIQUETA_ESTADO, type EstadoConsulta } from '../consultas/tipos.ts'
import estilos from './EtiquetaEstado.module.css'

// Estado de una consulta. El texto lo dice todo; el estilo solo ayuda a distinguirlo de un vistazo.
export default function EtiquetaEstado({ estado }: { estado: EstadoConsulta }) {
  return (
    <span className={estilos.etiqueta} data-estado={estado}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}
