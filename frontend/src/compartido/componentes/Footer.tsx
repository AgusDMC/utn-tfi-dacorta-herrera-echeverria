import { Link } from 'react-router'
import { NOMBRE_INMOBILIARIA } from '../../config.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION } from '../../catalogo/tipos.ts'
import Marca from './Marca.tsx'
import estilos from './Footer.module.css'

const anio = new Date().getFullYear()

// El footer usa la misma estructura de dos columnas (7/5) y el mismo filete vertical
// que la grilla de propiedades: la marca a la izquierda y, a la derecha, la navegación
// y la línea legal.
export default function Footer() {
  return (
    <footer className={estilos.footer}>
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.marca}>
          <Marca />
        </div>

        <div className={estilos.lateral}>
          <nav aria-label="Pie de página">
            <ul className={estilos.enlaces}>
              {TIPOS_OPERACION.map((operacion) => (
                <li key={operacion}>
                  <Link to={urlCatalogo({ operacion })}>{ACCION_OPERACION[operacion]}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={estilos.legal}>
            <p>
              © {anio} {NOMBRE_INMOBILIARIA}
            </p>
            <Link to="/admin/login">Acceso administración</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
