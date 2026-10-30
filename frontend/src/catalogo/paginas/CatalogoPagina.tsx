import { useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../catalogo.ts'
import { hayFiltros, leerFiltros, urlCatalogo } from '../filtros.ts'
import type { FiltrosCatalogo } from '../tipos.ts'
import Buscador from '../componentes/Buscador.tsx'
import EncabezadoBusqueda from '../secciones/EncabezadoBusqueda.tsx'
import HeroCatalogo from '../secciones/HeroCatalogo.tsx'
import PropiedadesCatalogo from '../secciones/PropiedadesCatalogo.tsx'

function tituloResultados(filtros: FiltrosCatalogo) {
  if (filtros.operacion === 'VENTA') return 'Propiedades en venta'
  if (filtros.operacion === 'ALQUILER') return 'Propiedades en alquiler'
  return 'Resultados de búsqueda'
}

// Home y catálogo público. Sin filtros muestra el hero editorial; con filtros
// el encabezado se compacta para que los resultados queden a la vista.
export default function CatalogoPagina() {
  const [params] = useSearchParams()
  const filtros = leerFiltros(params)
  const filtrado = hayFiltros(filtros)
  const publicaciones = buscarPublicaciones(filtros)

  // El key reinicia el formulario cuando cambian los filtros de la URL (por ejemplo, desde el header)
  const buscador = <Buscador key={urlCatalogo(filtros)} filtros={filtros} localidades={obtenerLocalidades()} />

  return (
    <>
      <title>{tituloPagina(filtrado ? tituloResultados(filtros) : 'Propiedades en venta y alquiler')}</title>

      {filtrado ? (
        <EncabezadoBusqueda titulo={tituloResultados(filtros)}>{buscador}</EncabezadoBusqueda>
      ) : (
        <HeroCatalogo>{buscador}</HeroCatalogo>
      )}

      <PropiedadesCatalogo publicaciones={publicaciones} filtrado={filtrado} />
    </>
  )
}
