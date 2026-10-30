import { Link } from 'react-router'
import { CONTACTO, NOMBRE_INMOBILIARIA } from '../../config.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION, TIPOS_PROPIEDAD, type TipoPropiedad } from '../../catalogo/tipos.ts'
import Marca from './Marca.tsx'
import estilos from './Footer.module.css'

const anio = new Date().getFullYear()

const PLURAL_TIPO: Record<TipoPropiedad, string> = {
  CASA: 'Casas',
  DEPARTAMENTO: 'Departamentos',
  PH: 'PH',
  DUPLEX: 'Dúplex',
}

// Pie de página: la marca con sus datos de contacto, tres columnas de navegación y la línea legal
export default function Footer() {
  const { telefono, email, direccion, matricula } = CONTACTO

  return (
    <footer className={estilos.footer}>
      <div className={`contenedor ${estilos.rejilla}`}>
        <div className={estilos.marca}>
          <Marca />
          <p className={estilos.lema}>Casas, departamentos, PH y dúplex en venta y alquiler.</p>
          <ul className={estilos.contacto}>
            {telefono && (
              <li>
                <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`}>{telefono}</a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {direccion && <li>{direccion}</li>}
          </ul>
        </div>

        <nav aria-labelledby="pie-propiedades">
          <h2 id="pie-propiedades" className={estilos.titulo}>
            Propiedades
          </h2>
          <ul className={estilos.enlaces}>
            {TIPOS_OPERACION.map((operacion) => (
              <li key={operacion}>
                <Link to={urlCatalogo({ operacion })}>{ACCION_OPERACION[operacion]}</Link>
              </li>
            ))}
            <li>
              <Link to={urlCatalogo({})}>Ver todas</Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="pie-tipos">
          <h2 id="pie-tipos" className={estilos.titulo}>
            Tipos de propiedad
          </h2>
          <ul className={estilos.enlaces}>
            {TIPOS_PROPIEDAD.map((tipo) => (
              <li key={tipo}>
                <Link to={urlCatalogo({ tipo })}>{PLURAL_TIPO[tipo]}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="pie-inmobiliaria">
          <h2 id="pie-inmobiliaria" className={estilos.titulo}>
            Inmobiliaria
          </h2>
          <ul className={estilos.enlaces}>
            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={`contenedor ${estilos.legal}`}>
        <p>
          © {anio} {NOMBRE_INMOBILIARIA}
          {matricula && <> · Matrícula {matricula}</>}
        </p>
        <Link to="/admin/login">Acceso administración</Link>
      </div>
    </footer>
  )
}
