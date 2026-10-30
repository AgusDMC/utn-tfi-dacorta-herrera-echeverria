import type { ReactNode } from 'react'
import estilos from './EncabezadoBusqueda.module.css'

interface Props {
  titulo: string
  detalle?: ReactNode // la cantidad de resultados, a la derecha del título
  children: ReactNode // el buscador
}

// Encabezado del catálogo: el título con la cantidad de resultados y, debajo, el buscador
export default function EncabezadoBusqueda({ titulo, detalle, children }: Props) {
  return (
    <section className={`contenedor ${estilos.encabezado}`} aria-labelledby="titulo-catalogo">
      <div className={estilos.cabecera}>
        <h1 id="titulo-catalogo" className={estilos.titulo}>
          {titulo}
        </h1>
        {detalle && <p className={estilos.detalle}>{detalle}</p>}
      </div>
      {children}
    </section>
  )
}
