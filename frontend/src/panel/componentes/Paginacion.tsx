import type { Pagina } from '../../compartido/api/pagina.ts'
import estilos from './Paginacion.module.css'

interface Props {
  pagina: Pagina<unknown>
  onCambiar: (pagina: number) => void
}

// Anterior / Página X de Y / Siguiente. Al usuario se le muestra la página desde 1.
export default function Paginacion({ pagina, onCambiar }: Props) {
  if (pagina.totalPages <= 1) return null

  return (
    <nav aria-label="Paginación" className={estilos.paginacion}>
      <button type="button" className="boton boton-secundario" disabled={!pagina.hasPrevious} onClick={() => onCambiar(pagina.page - 1)}>
        Anterior
      </button>
      <p className={estilos.posicion}>
        Página {pagina.page + 1} de {pagina.totalPages}
      </p>
      <button type="button" className="boton boton-secundario" disabled={!pagina.hasNext} onClick={() => onCambiar(pagina.page + 1)}>
        Siguiente
      </button>
    </nav>
  )
}
