import type { ReactNode } from 'react'
import estilos from './CabeceraListado.module.css'

interface Props {
  idTitulo: string
  titulo: string
  detalle?: ReactNode // texto que acompaña al título (bajada o cantidad de resultados)
  children?: ReactNode // controles a la derecha (por ejemplo, las flechas del carrusel)
  className?: string // permite alinear la cabecera con la grilla que sigue
}

// Cabecera de un listado: filete superior, título en serif y bajada en sans.
export default function CabeceraListado({ idTitulo, titulo, detalle, children, className }: Props) {
  return (
    <div className={`${estilos.cabecera} ${className ?? ''}`}>
      <h2 id={idTitulo} className={estilos.titulo}>
        {titulo}
      </h2>
      {detalle && <div className={estilos.detalle}>{detalle}</div>}
      {children}
    </div>
  )
}
