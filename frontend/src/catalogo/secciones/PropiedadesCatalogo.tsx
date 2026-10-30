import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router'
import { buscarPublicaciones } from '../catalogo.ts'
import { pideEnfocarResultados, urlCatalogo } from '../filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION, type PublicacionCatalogo } from '../tipos.ts'
import GrillaPublicaciones from '../componentes/GrillaPublicaciones.tsx'
import estilos from './PropiedadesCatalogo.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  filtrado: boolean
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
}

// Resultados del catálogo: la grilla de tarjetas o, si no hay, un estado vacío con salidas
export default function PropiedadesCatalogo({ publicaciones, filtrado }: Props) {
  const seccionRef = useRef<HTMLElement>(null)
  const { key, state } = useLocation()
  const tipoNavegacion = useNavigationType()

  // Después de buscar, el foco pasa a los resultados. Solo en la navegación nueva:
  // al volver con Atrás o recargar (POP) el navegador restaura el scroll y no hay que pisarlo.
  useEffect(() => {
    if (tipoNavegacion === 'PUSH' && pideEnfocarResultados(state)) seccionRef.current?.focus()
  }, [key, state, tipoNavegacion])

  const cantidad = publicaciones.length
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
        {filtrado ? anuncio : ''}
      </p>

      {cantidad === 0 ? (
        <div className={estilos.vacio}>
          <p className={estilos.vacioTitulo}>No encontramos propiedades con esos filtros</p>
          <p className={estilos.vacioTexto}>Probá con otro tipo de propiedad u otra ubicación, o mirá todo lo que tenemos.</p>
          <div className={estilos.vacioAcciones}>
            <Link to={urlCatalogo({})} className="boton boton-primario">
              Ver todas las propiedades
            </Link>
            {TIPOS_OPERACION.map((operacion) => (
              <Link key={operacion} to={urlCatalogo({ operacion })} className="boton boton-secundario">
                {ACCION_OPERACION[operacion]} ({buscarPublicaciones({ operacion }).length})
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <GrillaPublicaciones publicaciones={publicaciones} />
      )}
    </section>
  )
}
