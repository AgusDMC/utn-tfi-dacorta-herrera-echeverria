import { useNavigate } from 'react-router'
import { tituloPagina } from '../../config.ts'
import Marca from '../../compartido/componentes/Marca.tsx'
import { cerrarSesion, obtenerSesion } from '../autenticacion/sesion.ts'
import estilos from './PanelPagina.module.css'

// Inicio del panel. Por ahora solo confirma la sesión; las secciones de gestión llegan después.
export default function PanelPagina() {
  const navigate = useNavigate()
  const sesion = obtenerSesion()

  function salir() {
    cerrarSesion()
    navigate('/admin/login', { replace: true, state: { sesionCerrada: true } })
  }

  return (
    <div className={estilos.pagina}>
      <title>{tituloPagina('Panel administrativo')}</title>

      <header className={estilos.barra}>
        <div className={`contenedor ${estilos.barraContenido}`}>
          <Marca />
          <div className={estilos.sesion}>
            <p className={estilos.email}>{sesion?.email}</p>
            <button type="button" className="boton boton-secundario" onClick={salir}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className={`contenedor ${estilos.contenido}`}>
        <h1 className={estilos.titulo}>Panel administrativo</h1>
        <p className={estilos.texto}>Desde este panel se van a administrar las propiedades y las consultas.</p>
      </main>
    </div>
  )
}
