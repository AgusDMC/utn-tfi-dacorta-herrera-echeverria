import { Link, useParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import estilos from './DetallePagina.module.css'

// Placeholder: reserva la estructura de la ficha (galería + información).
// Los datos, la galería y el formulario de consulta llegan en próximos bloques.
export default function DetallePagina() {
  const { id } = useParams()

  return (
    <div className="contenedor">
      <title>{tituloPagina('Detalle de la propiedad')}</title>

      <Link to="/" className={estilos.volver}>
        <span aria-hidden="true">←</span> Volver a propiedades
      </Link>

      <header className={estilos.encabezado}>
        <p className="antetitulo">Propiedad n.º {id}</p>
        <h1 className={estilos.titulo}>Detalle de la propiedad</h1>
      </header>

      <div className={estilos.grilla}>
        <div className={estilos.galeria}>
          <p>Acá se mostrarán las fotos de la propiedad.</p>
        </div>

        <aside className={estilos.info} aria-label="Información de la propiedad">
          <h2 className={estilos.infoTitulo}>Información</h2>
          <p className={estilos.infoTexto}>
            Muy pronto vas a encontrar acá el precio, las características y un formulario para
            hacer tu consulta.
          </p>
        </aside>
      </div>
    </div>
  )
}
