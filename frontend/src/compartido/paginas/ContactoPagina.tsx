import { Link } from 'react-router'
import { CONTACTO, tituloPagina } from '../../config.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import estilos from './Institucional.module.css'

export default function ContactoPagina() {
  const { telefono, email, direccion, horario, matricula } = CONTACTO

  return (
    <section className={`contenedor ${estilos.pagina}`}>
      <title>{tituloPagina('Contacto')}</title>

      <h1 className={estilos.titulo}>Contacto</h1>
      <p className={estilos.entrada}>
        Para consultar por una propiedad, abrí su ficha y usá el botón &ldquo;Consultar por esta propiedad&rdquo;.
        Por cualquier otra consulta, escribinos o llamanos.
      </p>

      <dl className={estilos.datos}>
        {telefono && (
          <div className={estilos.dato}>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`}>{telefono}</a>
            </dd>
          </div>
        )}
        {email && (
          <div className={estilos.dato}>
            <dt>Correo electrónico</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
        )}
        {direccion && (
          <div className={estilos.dato}>
            <dt>Dirección</dt>
            <dd>{direccion}</dd>
          </div>
        )}
        {horario && (
          <div className={estilos.dato}>
            <dt>Horario de atención</dt>
            <dd>{horario}</dd>
          </div>
        )}
        {matricula && (
          <div className={estilos.dato}>
            <dt>Matrícula</dt>
            <dd>{matricula}</dd>
          </div>
        )}
      </dl>

      <div className={estilos.acciones}>
        <Link to={urlCatalogo({})} className="boton boton-primario">
          Ver propiedades
        </Link>
      </div>
    </section>
  )
}
