import { CONTACTO, NOMBRE_INMOBILIARIA, tituloPagina } from '../../config.ts'
import Correo from '../componentes/Correo.tsx'
import { useDescripcionPagina } from '../useDescripcionPagina.ts'
import { IconoCorreo, IconoMatricula, IconoReloj, IconoTelefono, IconoUbicacion } from '../componentes/Iconos.tsx'
import { IlustracionPuerta } from '../componentes/Ilustraciones.tsx'
import iconos from '../componentes/Iconos.module.css'
import estilos from './Institucional.module.css'

export default function ContactoPagina() {
  const { telefono, email, direccion, horario, matricula } = CONTACTO
  const telefonoLimpio = telefono?.replace(/[^\d+]/g, '')
  useDescripcionPagina(
    `Medios de contacto de ${NOMBRE_INMOBILIARIA} para consultar por propiedades en venta y alquiler, o por cualquier otra duda sobre la inmobiliaria.`,
  )

  return (
    <section className={`contenedor ${estilos.pagina} ${estilos.contacto}`}>
      <title>{tituloPagina('Contacto')}</title>

      <div>
        <h1 className={estilos.titulo}>Contacto</h1>
        <p className={estilos.entrada}>
          Si viste una propiedad que te interesa, entrá a su ficha y dejanos tu consulta. Te respondemos con los datos
          que necesites. Para cualquier otra consulta, podés llamarnos o escribirnos.
        </p>

        <ul role="list" className={estilos.medios}>
          {telefono && (
            <li className={estilos.medio}>
              <span className={iconos.redondel}>
                <IconoTelefono />
              </span>
              <span className={estilos.medioTexto}>
                <span className={estilos.medioEtiqueta}>Teléfono</span>
                <a href={`tel:${telefonoLimpio}`} className={estilos.medioValor}>
                  {telefono}
                </a>
              </span>
            </li>
          )}
          {email && (
            <li className={estilos.medio}>
              <span className={iconos.redondel}>
                <IconoCorreo />
              </span>
              <span className={estilos.medioTexto}>
                <span className={estilos.medioEtiqueta}>Correo electrónico</span>
                <a href={`mailto:${email}`} className={estilos.medioValor}>
                  <Correo direccion={email} />
                </a>
              </span>
            </li>
          )}
        </ul>

        <div className={estilos.acciones}>
          {telefono && (
            <a href={`tel:${telefonoLimpio}`} className="boton boton-primario">
              Llamar
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="boton boton-secundario">
              Escribir
            </a>
          )}
        </div>
      </div>

      {(direccion || horario || matricula) && (
        <aside className={estilos.panel} aria-label="Datos de la inmobiliaria">
          <span className={estilos.panelDibujo}>
            <IlustracionPuerta />
          </span>
          <dl className={estilos.datos}>
            {direccion && (
              <div className={estilos.dato}>
                <IconoUbicacion className={iconos.iconoChico} />
                <dt>Dirección</dt>
                <dd>{direccion}</dd>
              </div>
            )}
            {horario && (
              <div className={estilos.dato}>
                <IconoReloj className={iconos.iconoChico} />
                <dt>Horario de atención</dt>
                <dd>{horario}</dd>
              </div>
            )}
            {matricula && (
              <div className={estilos.dato}>
                <IconoMatricula className={iconos.iconoChico} />
                <dt>Matrícula</dt>
                <dd>{matricula}</dd>
              </div>
            )}
          </dl>
        </aside>
      )}
    </section>
  )
}
