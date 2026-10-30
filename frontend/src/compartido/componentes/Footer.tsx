import { Link } from 'react-router'
import { NOMBRE_INMOBILIARIA } from '../../config.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION } from '../../catalogo/tipos.ts'
import Marca from './Marca.tsx'
import estilos from './Footer.module.css'

const anio = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={estilos.footer}>
      <div className="contenedor">
        <div className={estilos.principal}>
          <div>
            <Marca />
            <p className={estilos.descripcion}>Propiedades en venta y alquiler.</p>
          </div>

          <nav aria-label="Pie de página">
            <ul className={estilos.enlaces}>
              {TIPOS_OPERACION.map((operacion) => (
                <li key={operacion}>
                  <Link to={urlCatalogo({ operacion })}>{ACCION_OPERACION[operacion]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={estilos.legal}>
          <p>
            © {anio} {NOMBRE_INMOBILIARIA}
          </p>
          <Link to="/admin/login">Acceso administración</Link>
        </div>
      </div>
    </footer>
  )
}
