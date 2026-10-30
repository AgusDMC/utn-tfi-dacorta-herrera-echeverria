import { useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../catalogo.ts'
import { hayFiltros, leerFiltros, urlCatalogo } from '../filtros.ts'
import type { FiltrosCatalogo } from '../tipos.ts'
import Buscador from '../componentes/Buscador.tsx'
import EncabezadoBusqueda from '../secciones/EncabezadoBusqueda.tsx'
import PropiedadesCatalogo from '../secciones/PropiedadesCatalogo.tsx'

function tituloListado(filtros: FiltrosCatalogo) {
  if (filtros.operacion === 'VENTA') return 'Propiedades en venta'
  if (filtros.operacion === 'ALQUILER') return 'Propiedades en alquiler'
  return hayFiltros(filtros) ? 'Resultados de búsqueda' : 'Todas las propiedades'
}

// Catálogo público: el buscador y la grilla de propiedades que cumplen los filtros de la URL
export default function CatalogoPagina() {
  const [params] = useSearchParams()
  const filtros = leerFiltros(params)
  const publicaciones = buscarPublicaciones(filtros)
  const titulo = tituloListado(filtros)

  return (
    <>
      <title>{tituloPagina(titulo)}</title>

      <EncabezadoBusqueda titulo={titulo}>
        {/* El key reinicia el formulario cuando cambian los filtros de la URL (por ejemplo, desde el header) */}
        <Buscador key={urlCatalogo(filtros)} filtros={filtros} localidades={obtenerLocalidades()} />
      </EncabezadoBusqueda>

      <PropiedadesCatalogo publicaciones={publicaciones} filtrado={hayFiltros(filtros)} />
    </>
  )
}
