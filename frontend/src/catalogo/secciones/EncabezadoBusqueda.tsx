import type { ReactNode } from 'react'
import estilos from './EncabezadoBusqueda.module.css'

interface Props {
  titulo: string
  children: ReactNode // el buscador
}

// Encabezado compacto que reemplaza al hero cuando hay filtros activos,
// para que los resultados queden a la vista.
export default function EncabezadoBusqueda({ titulo, children }: Props) {
  return (
    <section className={`contenedor ${estilos.encabezado}`} aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo" className={estilos.titulo}>
        {titulo}
      </h1>
      {children}
    </section>
  )
}
