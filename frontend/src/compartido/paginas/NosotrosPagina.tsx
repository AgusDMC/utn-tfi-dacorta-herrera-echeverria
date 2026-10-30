import { Link } from 'react-router'
import { NOMBRE_INMOBILIARIA, tituloPagina } from '../../config.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import estilos from './Institucional.module.css'

export default function NosotrosPagina() {
  return (
    <section className={`contenedor ${estilos.pagina}`}>
      <title>{tituloPagina('Nosotros')}</title>

      <h1 className={estilos.titulo}>Nosotros</h1>
      <p className={estilos.entrada}>
        {NOMBRE_INMOBILIARIA} es una inmobiliaria dedicada a la venta y el alquiler de casas, departamentos, PH y
        dúplex.
      </p>

      <div className={estilos.cuerpo}>
        <section className={estilos.bloque}>
          <h2>Qué hacemos</h2>
          <p>
            Publicamos propiedades en venta y en alquiler, con fotos y datos claros, para que puedas compararlas y
            elegir con tranquilidad.
          </p>
        </section>
        <section className={estilos.bloque}>
          <h2>Cómo trabajamos</h2>
          <p>
            Cada propiedad tiene su ficha con un botón para consultar. Recibimos tu consulta y nos comunicamos con vos
            por el medio que nos dejes.
          </p>
        </section>
      </div>

      <div className={estilos.acciones}>
        <Link to={urlCatalogo({})} className="boton boton-primario">
          Ver propiedades
        </Link>
        <Link to="/contacto" className="boton boton-secundario">
          Contacto
        </Link>
      </div>
    </section>
  )
}
