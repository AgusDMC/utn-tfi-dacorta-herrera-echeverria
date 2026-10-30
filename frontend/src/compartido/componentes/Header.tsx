import { Link, useLocation, useSearchParams } from 'react-router'
import { leerFiltros, urlCatalogo } from '../../catalogo/filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION } from '../../catalogo/tipos.ts'
import Marca from './Marca.tsx'
import estilos from './Header.module.css'

export default function Header() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const operacionActual = pathname === '/' ? leerFiltros(params).operacion : undefined

  return (
    <header className={estilos.header}>
      <div className={`contenedor ${estilos.barra}`}>
        <Marca />

        {/* Comprar / Alquilar aplican el filtro de operación del catálogo */}
        <nav aria-label="Principal">
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
          </ul>
        </nav>
      </div>
    </header>
  )
}
