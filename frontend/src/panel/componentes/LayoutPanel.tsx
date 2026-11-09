import { NavLink, Outlet, useNavigate } from 'react-router'
import Marca from '../../compartido/componentes/Marca.tsx'
import { cerrarSesion, obtenerSesion } from '../autenticacion/sesion.ts'
import estilos from './LayoutPanel.module.css'

// El acceso lo controla RutaProtegida; este componente solo arma la pantalla del panel.
export default function LayoutPanel() {
  const navigate = useNavigate()
  const sesion = obtenerSesion()

  function salir() {
    cerrarSesion()
    navigate('/admin/login', { replace: true, state: { sesionCerrada: true } })
  }

  return (
    <div className={estilos.pagina}>
      <header className={estilos.barra}>
        <div className={`contenedor ${estilos.barraContenido}`}>
          <Marca />

          <nav aria-label="Panel" className={estilos.navegacion}>
            <NavLink to="/admin" end className={estilos.enlace}>
              Inicio
            </NavLink>
            <NavLink to="/admin/propiedades" className={estilos.enlace}>
              Propiedades
            </NavLink>
            <NavLink to="/admin/publicaciones" className={estilos.enlace}>
              Publicaciones
            </NavLink>
            <NavLink to="/admin/consultas" className={estilos.enlace}>
              Consultas
            </NavLink>
          </nav>

          <div className={estilos.sesion}>
            <p className={estilos.email}>{sesion?.email}</p>
            <button type="button" className="boton boton-secundario" onClick={salir}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className={`contenedor ${estilos.contenido}`}>
        <Outlet />
      </main>
    </div>
  )
}
