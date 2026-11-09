import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router'
import type { Pagina } from '../../compartido/api/pagina.ts'
import Paginacion from '../../compartido/componentes/Paginacion.tsx'
import { pideEnfocarResultados, urlCatalogo } from '../filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION, type PublicacionCatalogo } from '../tipos.ts'
import GrillaPublicaciones from '../componentes/GrillaPublicaciones.tsx'
import estilos from './PropiedadesCatalogo.module.css'

interface Props {
  pagina: Pagina<PublicacionCatalogo> | null // null: no se pudo cargar
  filtrado: boolean
  onReintentar: () => void
  reintentando: boolean
  onCambiarPagina: (pagina: number) => void
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
}

// Resultados del catálogo: la grilla de tarjetas con su paginación o, si no hay, un estado vacío con salidas
export default function PropiedadesCatalogo({ pagina, filtrado, onReintentar, reintentando, onCambiarPagina }: Props) {
  const seccionRef = useRef<HTMLElement>(null)
  const { key, state } = useLocation()
  const tipoNavegacion = useNavigationType()

  // Después de buscar, el foco pasa a los resultados. Solo en la navegación nueva:
  // al volver con Atrás o recargar (POP) el navegador restaura el scroll y no hay que pisarlo.
  useEffect(() => {
    if (tipoNavegacion === 'PUSH' && pideEnfocarResultados(state)) seccionRef.current?.focus()
  }, [key, state, tipoNavegacion])

  // Al cambiar de página, el foco y la vista vuelven al principio de los resultados (focus solo
  // no alcanza: si la sección ya se ve en parte, no desplaza). El header fijo no la tapa
  // gracias al scroll-padding-top global.
  function cambiarPagina(nueva: number) {
    onCambiarPagina(nueva)
    seccionRef.current?.focus({ preventScroll: true })
    seccionRef.current?.scrollIntoView({ block: 'start' })
  }

  const cantidad = pagina?.totalElements ?? 0
  const anuncio = cantidad > 0 ? textoCantidad(cantidad) : 'No encontramos propiedades con esos filtros'

  return (
    <section
      ref={seccionRef}
      tabIndex={-1}
      className={`contenedor ${estilos.seccion}`}
      aria-labelledby="titulo-resultados"
    >
      <h2 id="titulo-resultados" className="sr-only">
        Resultados
      </h2>
      {/* Región que anuncia el resultado de cada búsqueda a los lectores de pantalla */}
      <p className="sr-only" aria-live="polite">
        {filtrado && pagina ? anuncio : ''}
      </p>

      {!pagina ? (
        <div role="alert" className={estilos.vacio}>
          <p className={estilos.vacioTitulo}>No pudimos cargar las propiedades.</p>
          <div className={estilos.vacioAcciones}>
            <button type="button" className="boton boton-secundario" disabled={reintentando} onClick={onReintentar}>
              {reintentando ? 'Reintentando…' : 'Reintentar'}
            </button>
          </div>
        </div>
      ) : cantidad === 0 && !filtrado ? (
        <div className={estilos.vacio}>
          <p className={estilos.vacioTitulo}>Todavía no hay propiedades publicadas</p>
        </div>
      ) : cantidad === 0 ? (
        <div className={estilos.vacio}>
          <p className={estilos.vacioTitulo}>No encontramos propiedades con esos filtros</p>
          <p className={estilos.vacioTexto}>Probá con otro tipo de propiedad u otra ubicación, o mirá todo lo que tenemos.</p>
          <div className={estilos.vacioAcciones}>
            <Link to={urlCatalogo({})} className="boton boton-primario">
              Limpiar filtros
            </Link>
            {TIPOS_OPERACION.map((operacion) => (
              <Link key={operacion} to={urlCatalogo({ operacion })} className="boton boton-secundario">
                {ACCION_OPERACION[operacion]}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <GrillaPublicaciones publicaciones={pagina.results} />
          <Paginacion pagina={pagina} onCambiar={cambiarPagina} />
        </>
      )}
    </section>
  )
}
