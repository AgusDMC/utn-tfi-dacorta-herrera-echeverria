import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import estilos from './NoEncontradaPagina.module.css'

export default function NoEncontradaPagina() {
  return (
    <section className={`contenedor ${estilos.pagina}`}>
      <title>{tituloPagina('Página no encontrada')}</title>

      <p className="antetitulo">Error 404</p>
      <h1 className={estilos.titulo}>No encontramos esta página</h1>
      <p className={estilos.texto}>
        Es posible que la dirección esté mal escrita o que la página ya no exista.
      </p>
      <Link to="/" className="boton boton-primario">
        Ver propiedades
      </Link>
    </section>
  )
}
