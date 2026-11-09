import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { listarLocalidades, listarPublicacionesCatalogo } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import type { PublicacionCatalogo } from '../tipos.ts'
import Buscador from '../componentes/Buscador.tsx'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import TiraPublicaciones from '../componentes/TiraPublicaciones.tsx'
import BandaContacto from '../../compartido/componentes/BandaContacto.tsx'
import ComoConsultar from '../secciones/ComoConsultar.tsx'
import EntradasHome from '../secciones/EntradasHome.tsx'
import HeroCatalogo from '../secciones/HeroCatalogo.tsx'
import estilos from './HomePagina.module.css'

// Cuántas publicaciones recorre la tira de la home (el backend las ordena de la más nueva a la más vieja)
const RECIENTES = 8

// Home: el hero con el buscador, las entradas al catálogo, las propiedades más nuevas y cómo consultar.
// El hero no espera a la API: las localidades y las recientes aparecen cuando llegan.
export default function HomePagina() {
  const [recientes, setRecientes] = useState<PublicacionCatalogo[]>([])
  const [localidades, setLocalidades] = useState<string[]>([])

  useEffect(() => {
    let vigente = true
    listarPublicacionesCatalogo({}, 0, { tamano: RECIENTES, renovarError: true }).then((resultado) => {
      if (vigente && resultado.ok) setRecientes(resultado.datos.results)
    })
    listarLocalidades({ renovarError: true }).then((lista) => {
      if (vigente) setLocalidades(lista)
    })
    return () => {
      vigente = false
    }
  }, [])

  return (
    <>
      <title>{tituloPagina('Propiedades en venta y alquiler')}</title>

      <HeroCatalogo>
        <Buscador filtros={{}} localidades={localidades} />
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
