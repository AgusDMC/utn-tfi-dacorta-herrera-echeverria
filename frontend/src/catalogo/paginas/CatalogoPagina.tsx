import { Link, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../catalogo.ts'
import { hayFiltros, leerFiltros, urlCatalogo } from '../filtros.ts'
import { ETIQUETA_TIPO_PLURAL, type FiltrosCatalogo, type TipoOperacion } from '../tipos.ts'
import Buscador from '../componentes/Buscador.tsx'
import BandaContacto from '../../compartido/componentes/BandaContacto.tsx'
import EncabezadoBusqueda from '../secciones/EncabezadoBusqueda.tsx'
import PropiedadesCatalogo from '../secciones/PropiedadesCatalogo.tsx'
import estilos from './CatalogoPagina.module.css'

const EN_OPERACION: Record<TipoOperacion, string> = { VENTA: ' en venta', ALQUILER: ' en alquiler' }

// El título dice lo que se filtró: "Casas en venta en Santa Rosa"
function tituloListado(filtros: FiltrosCatalogo) {
  if (!hayFiltros(filtros)) return 'Todas las propiedades'

  const que = filtros.tipo ? ETIQUETA_TIPO_PLURAL[filtros.tipo] : 'Propiedades'
  const operacion = filtros.operacion ? EN_OPERACION[filtros.operacion] : ''
  const lugar = filtros.localidad ? ` en ${filtros.localidad}` : ''
  return `${que}${operacion}${lugar}`
}

// Catálogo público: el buscador y la grilla de propiedades que cumplen los filtros de la URL
export default function CatalogoPagina() {
  const [params] = useSearchParams()
  const filtros = leerFiltros(params)
  const publicaciones = buscarPublicaciones(filtros)
  const cantidad = publicaciones.length
  const titulo = tituloListado(filtros)

  const detalle = cantidad > 0 && (
    <>
      {cantidad} {cantidad === 1 ? 'propiedad' : 'propiedades'}
      {hayFiltros(filtros) && (
        <Link to={urlCatalogo({})} className={estilos.limpiar}>
          Limpiar filtros
        </Link>
      )}
    </>
  )

  return (
    <>
      <title>{tituloPagina(titulo)}</title>

      <EncabezadoBusqueda titulo={titulo} detalle={detalle || undefined}>
        {/* El key reinicia el formulario cuando cambian los filtros de la URL (por ejemplo, desde el header) */}
        <Buscador key={urlCatalogo(filtros)} filtros={filtros} localidades={obtenerLocalidades()} />
      </EncabezadoBusqueda>

      <PropiedadesCatalogo publicaciones={publicaciones} filtrado={hayFiltros(filtros)} />

      <BandaContacto />
    </>
  )
}
