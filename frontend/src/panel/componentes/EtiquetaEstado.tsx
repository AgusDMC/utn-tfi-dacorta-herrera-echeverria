import estilos from './EtiquetaEstado.module.css'

// Destacado: pide atención (consulta nueva, publicación activa). En curso: todavía cambia.
// Final: ya no cambia o es secundario.
export type TonoEstado = 'destacado' | 'en-curso' | 'final'

// Etiqueta de un estado. El texto lo dice todo; el tono solo ayuda a distinguirlo de un vistazo.
export default function EtiquetaEstado({ texto, tono }: { texto: string; tono: TonoEstado }) {
  return (
    <span className={estilos.etiqueta} data-tono={tono}>
      {texto}
    </span>
  )
}
