import type { PublicacionCatalogo } from '../tipos.ts'
import TarjetaPublicacion from './TarjetaPublicacion.tsx'
import estilos from './GrillaPublicaciones.module.css'

// Las tarjetas en una grilla que crece con el ancho: 1, 2 y 3 columnas
export default function GrillaPublicaciones({ publicaciones }: { publicaciones: PublicacionCatalogo[] }) {
  return (
    <ul role="list" className={estilos.grilla}>
      {publicaciones.map((publicacion) => (
        <li key={publicacion.id}>
          <TarjetaPublicacion publicacion={publicacion} />
        </li>
      ))}
    </ul>
  )
}
