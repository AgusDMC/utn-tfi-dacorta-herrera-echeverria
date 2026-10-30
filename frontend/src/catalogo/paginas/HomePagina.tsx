import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import Buscador from '../componentes/Buscador.tsx'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import GrillaPublicaciones from '../componentes/GrillaPublicaciones.tsx'
import ComoConsultar from '../secciones/ComoConsultar.tsx'
import EntradasHome from '../secciones/EntradasHome.tsx'
import HeroCatalogo from '../secciones/HeroCatalogo.tsx'
import estilos from './HomePagina.module.css'

// Las propiedades recientes que se muestran en la home; el resto está en el catálogo
const CANTIDAD_RECIENTES = 6

// Home: el hero con el buscador, las entradas al catálogo, las propiedades más nuevas y cómo consultar
export default function HomePagina() {
  const recientes = buscarPublicaciones({}).slice(0, CANTIDAD_RECIENTES)

  return (
    <>
      <title>{tituloPagina('Propiedades en venta y alquiler')}</title>

      <HeroCatalogo>
        <Buscador filtros={{}} localidades={obtenerLocalidades()} />
      </HeroCatalogo>

      <EntradasHome />

      {recientes.length > 0 && (
        <section className={`contenedor ${estilos.seccion}`} aria-labelledby="titulo-recientes">
          <CabeceraListado
            idTitulo="titulo-recientes"
            titulo="Propiedades recientes"
            detalle={
              <Link to={urlCatalogo({})} className={estilos.verTodas}>
                Ver todas las propiedades
              </Link>
            }
          />
          <GrillaPublicaciones publicaciones={recientes} />
        </section>
      )}

      <ComoConsultar />
    </>
  )
}
