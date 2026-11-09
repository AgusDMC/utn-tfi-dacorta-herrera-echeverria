import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import estilos from './PanelPagina.module.css'

// Inicio del panel: una entrada a cada sección que ya existe
export default function PanelPagina() {
  return (
    <>
      <title>{tituloPagina('Panel administrativo')}</title>

      <h1 className={estilos.titulo}>Panel administrativo</h1>
      <p className={estilos.texto}>Desde acá se administran las consultas. Más adelante se van a sumar las propiedades.</p>

      <Link to="/admin/consultas" className={`boton boton-primario ${estilos.acceso}`}>
        Ver consultas
      </Link>
    </>
  )
}
