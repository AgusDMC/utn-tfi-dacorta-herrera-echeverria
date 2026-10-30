import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router'
import { pideEnfocarResultados, urlCatalogo } from '../filtros.ts'
import type { PublicacionCatalogo } from '../tipos.ts'
import GrillaPublicaciones from '../componentes/GrillaPublicaciones.tsx'
import estilos from './PropiedadesCatalogo.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  filtrado: boolean
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
}

// Resultados del catálogo: la cantidad, la grilla de tarjetas y el estado vacío
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
          <p className={estilos.vacioTexto}>Probá con otro tipo de propiedad u otra ubicación.</p>
          <Link to={urlCatalogo({})} className={`boton boton-secundario ${estilos.vacioAccion}`}>
            Ver todas las propiedades
          </Link>
        </div>
      ) : (
        <>
          <p className={estilos.cantidad}>
            {textoCantidad(cantidad)}
            {filtrado && (
              <>
                {' '}
                <Link to={urlCatalogo({})} className={estilos.limpiar}>
                  Limpiar filtros
                </Link>
              </>
            )}
          </p>
          <GrillaPublicaciones publicaciones={publicaciones} />
        </>
      )}
    </section>
  )
}
