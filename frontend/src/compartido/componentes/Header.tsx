import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { leerFiltros, urlCatalogo } from '../../catalogo/filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION } from '../../catalogo/tipos.ts'
import { IconoPersona } from './Iconos.tsx'
import Marca from './Marca.tsx'
import estilos from './Header.module.css'

export default function Header() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const operacionActual = pathname === '/propiedades' ? leerFiltros(params).operacion : undefined

  // Al despegarse de la parte superior, el filete de abajo se marca para separar el
  // header del contenido que pasa por detrás (sin cambiar la altura, que movería la página)
  const [adherido, setAdherido] = useState(false)
  useEffect(() => {
    const actualizar = () => setAdherido(window.scrollY > 8)
    actualizar()
    window.addEventListener('scroll', actualizar, { passive: true })
    return () => window.removeEventListener('scroll', actualizar)
  }, [])

  return (
    <header className={estilos.header} data-adherido={adherido || undefined}>
      <div className={`contenedor ${estilos.barra}`}>
        <Marca />

        {/* Comprar / Alquilar aplican el filtro de operación del catálogo */}
        <nav aria-label="Principal" className={estilos.navegacion}>
          <ul className={estilos.menu}>
            {TIPOS_OPERACION.map((operacion) => (
              <li key={operacion}>
                <Link
                  to={urlCatalogo({ operacion })}
                  className={estilos.enlace}
                  aria-current={operacionActual === operacion ? 'page' : undefined}
                >
                  {ACCION_OPERACION[operacion]}
                </Link>
              </li>
            ))}
            {/* Nosotros y Contacto solo entran en la barra desde tablet; en el celular están en el pie */}
            <li className={estilos.institucional}>
              <Link to="/nosotros" className={estilos.enlace} aria-current={pathname === '/nosotros' ? 'page' : undefined}>
                Nosotros
              </Link>
            </li>
            <li className={estilos.institucional}>
              <Link to="/contacto" className={estilos.enlace} aria-current={pathname === '/contacto' ? 'page' : undefined}>
                Contacto
              </Link>
            </li>
          </ul>
          <Link
            to={urlCatalogo({})}
            className={`boton boton-secundario ${estilos.todas}`}
            aria-current={pathname === '/propiedades' && !operacionActual ? 'page' : undefined}
          >
            Ver propiedades
          </Link>
          {/* Acceso al panel: con sesión entra directo; sin sesión, la ruta protegida lleva al login.
              Donde no entra el texto queda el ícono, con el mismo nombre para lectores de pantalla. */}
          <Link to="/admin" className={`${estilos.enlace} ${estilos.acceso}`} title="Ingresar">
            <IconoPersona />
            <span className={estilos.accesoTexto}>Ingresar</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
