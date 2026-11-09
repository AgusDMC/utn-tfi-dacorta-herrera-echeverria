import { use, useEffect, useState, useTransition } from 'react'
import { Link, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { useDescripcionPagina } from '../../compartido/useDescripcionPagina.ts'
import { conPagina, leerPagina } from '../../compartido/paginacion.ts'
import { listarLocalidades, listarPublicacionesCatalogo } from '../catalogo.ts'
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

// Catálogo público: el buscador y una página de resultados según los filtros y la página de la URL
export default function CatalogoPagina() {
  const [params, setParams] = useSearchParams()
  const [intento, setIntento] = useState(0)
  const [reintentando, iniciarReintento] = useTransition()
  const pagina = leerPagina(params)
  const leidos = leerFiltros(params)

  // Las dos se piden juntas antes de esperar cualquiera
  const promesaResultados = listarPublicacionesCatalogo(leidos, pagina, { intento })
  const promesaLocalidades = listarLocalidades({ intento })
  const resultado = use(promesaResultados)
  const localidades = use(promesaLocalidades)

  // La localidad de la URL se muestra como figura en la lista (?localidad=toay → Toay): así el
  // buscador la tiene elegida y no se pierde al volver a buscar. Si no está, se agrega igual.
  const coincidente = localidades.find((localidad) => localidad.toLowerCase() === leidos.localidad?.toLowerCase())
  const filtros = coincidente ? { ...leidos, localidad: coincidente } : leidos
  const opciones = filtros.localidad && !coincidente ? [...localidades, filtros.localidad] : localidades
  const titulo = tituloListado(filtros)

  const respuesta = resultado.ok ? resultado.datos : null
  const cantidad = respuesta?.totalElements ?? 0

  // Una página que ya no existe (por ejemplo, un enlace viejo) pasa a la última que sí existe
  const fueraDeRango = respuesta !== null && pagina > 0 && respuesta.results.length === 0
  useEffect(() => {
    const ultima = Math.max((respuesta?.totalPages ?? 1) - 1, 0)
    if (fueraDeRango) setParams((actuales) => conPagina(actuales, ultima), { replace: true })
  }, [fueraDeRango, respuesta, setParams])

  const que = hayFiltros(filtros) ? titulo : 'Casas, departamentos, PH y dúplex en venta y alquiler'
  useDescripcionPagina(`${que}. Precio, fotos y características de cada propiedad, con consulta directa desde su ficha.`)

  function reintentar() {
    iniciarReintento(() => setIntento((n) => n + 1))
  }

  function irAPagina(nueva: number) {
    setParams(conPagina(params, nueva))
  }

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
      {/* Una búsqueda sin resultados (por ejemplo, una localidad que no existe) no se indexa */}
      {respuesta && cantidad === 0 && <meta name="robots" content="noindex" />}

      <EncabezadoBusqueda titulo={titulo} detalle={detalle || undefined}>
        {/* El key reinicia el formulario cuando cambian los filtros de la URL (por ejemplo, desde el header) */}
        <Buscador key={urlCatalogo(filtros)} filtros={filtros} localidades={opciones} />
      </EncabezadoBusqueda>

      {!fueraDeRango && (
        <PropiedadesCatalogo
          pagina={respuesta}
          filtrado={hayFiltros(filtros)}
          onReintentar={reintentar}
          reintentando={reintentando}
          onCambiarPagina={irAPagina}
        />
      )}

      <BandaContacto />
    </>
  )
}
