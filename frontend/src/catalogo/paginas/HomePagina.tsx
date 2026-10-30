import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import Buscador from '../componentes/Buscador.tsx'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import TiraPublicaciones from '../componentes/TiraPublicaciones.tsx'
import BandaContacto from '../secciones/BandaContacto.tsx'
import ComoConsultar from '../secciones/ComoConsultar.tsx'
import EntradasHome from '../secciones/EntradasHome.tsx'
import HeroCatalogo from '../secciones/HeroCatalogo.tsx'
import estilos from './HomePagina.module.css'

// Home: el hero con el buscador, las entradas al catálogo, las propiedades más nuevas y cómo consultar
export default function HomePagina() {
  const recientes = buscarPublicaciones({})

  return (
    <>
      <title>{tituloPagina('Propiedades en venta y alquiler')}</title>

      <HeroCatalogo>
        <Buscador filtros={{}} localidades={obtenerLocalidades()} />
      </HeroCatalogo>

      <EntradasHome />

      {recientes.length > 0 && (
        <section className={`contenedor aparece ${estilos.seccion}`} aria-labelledby="titulo-recientes">
          <CabeceraListado
            idTitulo="titulo-recientes"
            titulo="Propiedades recientes"
            detalle={
              <Link to={urlCatalogo({})} className={estilos.verTodas}>
                Ver todas las propiedades
              </Link>
            }
          />
          <TiraPublicaciones publicaciones={recientes} etiqueta="Propiedades recientes" />
        </section>
      )}

      <ComoConsultar />

      <BandaContacto />
    </>
  )
}
