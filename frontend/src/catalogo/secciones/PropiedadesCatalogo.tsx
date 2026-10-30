import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { pideEnfocarResultados } from '../filtros.ts'
import type { PublicacionCatalogo } from '../tipos.ts'
import CarruselPublicaciones from '../componentes/CarruselPublicaciones.tsx'
import estilos from './PropiedadesCatalogo.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  filtrado: boolean
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
}

// La aparición al entrar en pantalla solo se usa si el navegador la soporta
// y el sistema no pide movimiento reducido
function puedeAnimarAparicion() {
  return 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Listado del catálogo: "Propiedades recientes" sin filtros, o los resultados de la búsqueda.
export default function PropiedadesCatalogo({ publicaciones, filtrado }: Props) {
  const seccionRef = useRef<HTMLElement>(null)
  // La sección arranca oculta y aparece suavemente al entrar en pantalla
  // (una sola vez, al cargar la página)
  const [oculta, setOculta] = useState(puedeAnimarAparicion)
  const { key, state } = useLocation()

  useEffect(() => {
    const seccion = seccionRef.current
    if (!oculta || !seccion) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setOculta(false)
          observador.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observador.observe(seccion)
    return () => observador.disconnect()
  }, [oculta])

  // Después de buscar, el foco pasa a los resultados
  useEffect(() => {
    if (pideEnfocarResultados(state)) seccionRef.current?.focus()
  }, [key, state])

  const cantidad = publicaciones.length
  let anuncio = ''
  if (filtrado) anuncio = cantidad > 0 ? textoCantidad(cantidad) : 'No encontramos propiedades con esos filtros'

  return (
    <section
      ref={seccionRef}
      tabIndex={-1}
      className={`contenedor ${estilos.seccion} ${filtrado ? estilos.conFiltros : ''}`}
      data-oculta={oculta || undefined}
      aria-labelledby="titulo-resultados"
    >
      {/* Región que anuncia el resultado de cada búsqueda a los lectores de pantalla */}
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      {cantidad > 0 ? (
        <CarruselPublicaciones
          // Con resultados nuevos el carrusel se reinicia (vuelve al principio)
          key={publicaciones.map((publicacion) => publicacion.id).join('-')}
          idTitulo="titulo-resultados"
          titulo={filtrado ? 'Resultados' : 'Propiedades recientes'}
          detalle={
            filtrado ? (
              <p className={estilos.detalle}>
                {textoCantidad(cantidad)} ·{' '}
                <Link to="/" className={estilos.limpiar}>
                  Limpiar filtros
                </Link>
              </p>
            ) : (
              <p className={estilos.detalle}>Las publicaciones más nuevas, en venta y en alquiler.</p>
            )
          }
          publicaciones={publicaciones}
        />
      ) : (
        <div className={estilos.vacio}>
          <h2 id="titulo-resultados" className={estilos.vacioTitulo}>
            No encontramos propiedades con esos filtros
          </h2>
          <p className={estilos.detalle}>Probá con otro tipo de propiedad u otra ubicación.</p>
          <Link to="/" className={`boton boton-secundario ${estilos.vacioAccion}`}>
            Ver todas las propiedades
          </Link>
        </div>
      )}
    </section>
  )
}
