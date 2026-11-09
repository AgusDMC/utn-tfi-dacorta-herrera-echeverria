import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import estilos from './PanelPagina.module.css'

// Inicio del panel: una entrada a cada sección que ya existe
export default function PanelPagina() {
  return (
    <>
      <title>{tituloPagina('Panel administrativo')}</title>

      <h1 className={estilos.titulo}>Panel administrativo</h1>
      <p className={estilos.texto}>Desde acá se administran las propiedades, sus publicaciones y las consultas.</p>

      <div className={estilos.accesos}>
        <Link to="/admin/propiedades" className="boton boton-primario">
          Ver propiedades
        </Link>
        <Link to="/admin/publicaciones" className="boton boton-secundario">
          Ver publicaciones
        </Link>
        <Link to="/admin/consultas" className="boton boton-secundario">
          Ver consultas
        </Link>
      </div>
    </>
  )
}
