import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { PublicacionCatalogo } from '../tipos.ts'
import TarjetaPublicacion from './TarjetaPublicacion.tsx'
import estilos from './CarruselPublicaciones.module.css'

interface Props {
  titulo: string
  idTitulo: string
  detalle?: ReactNode // texto que acompaña al título (bajada o cantidad de resultados)
  publicaciones: PublicacionCatalogo[]
}

// Carrusel horizontal sin librerías: scroll nativo con scroll-snap (swipe en
// mobile) y botones anterior/siguiente que solo aparecen si hay más contenido.
export default function CarruselPublicaciones({ titulo, idTitulo, detalle, publicaciones }: Props) {
  const idPista = useId()
  const pistaRef = useRef<HTMLUListElement>(null)
  const [puedeAnterior, setPuedeAnterior] = useState(false)
  const [puedeSiguiente, setPuedeSiguiente] = useState(false)

  useEffect(() => {
    const pista = pistaRef.current
    if (!pista) return

    const actualizar = () => {
      setPuedeAnterior(pista.scrollLeft > 4)
      setPuedeSiguiente(pista.scrollLeft + pista.clientWidth < pista.scrollWidth - 4)
    }

    actualizar()
    pista.addEventListener('scroll', actualizar, { passive: true })
    const observador = new ResizeObserver(actualizar)
    observador.observe(pista)
    return () => {
      pista.removeEventListener('scroll', actualizar)
      observador.disconnect()
    }
  }, [publicaciones])

  // Avanza de a una tarjeta; sin animación si el sistema pide movimiento reducido
  function desplazar(sentido: 1 | -1) {
    const pista = pistaRef.current
    const tarjeta = pista?.querySelector('li')
    if (!pista || !tarjeta) return

    const separacion = parseFloat(getComputedStyle(pista).columnGap) || 0
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    pista.scrollBy({
      left: sentido * (tarjeta.getBoundingClientRect().width + separacion),
      behavior: movimientoReducido ? 'auto' : 'smooth',
    })
  }

  const hayDesplazamiento = puedeAnterior || puedeSiguiente

  return (
    <>
      <div className={estilos.cabecera}>
        <h2 id={idTitulo} className={estilos.titulo}>
          {titulo}
        </h2>
        {detalle && <div className={estilos.detalle}>{detalle}</div>}

        {hayDesplazamiento && (
          <div className={estilos.controles}>
            <button
              type="button"
              className={`${estilos.control} ${estilos.anterior}`}
              aria-label="Ver propiedades anteriores"
              aria-controls={idPista}
              disabled={!puedeAnterior}
              onClick={() => desplazar(-1)}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 4 6 10l6 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`${estilos.control} ${estilos.siguiente}`}
              aria-label="Ver más propiedades"
              aria-controls={idPista}
              disabled={!puedeSiguiente}
              onClick={() => desplazar(1)}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="m8 4 6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <ul
        id={idPista}
        ref={pistaRef}
        className={estilos.pista}
        data-mas-de-tres={publicaciones.length > 3 || undefined}
      >
        {publicaciones.map((publicacion, indice) => (
          // Entrada escalonada muy leve de las tarjetas
          <li
            key={publicacion.id}
            className={`aparecer ${estilos.item}`}
            style={{ '--retraso': `${indice * 60}ms` } as CSSProperties}
          >
            <TarjetaPublicacion publicacion={publicacion} />
          </li>
        ))}
      </ul>
    </>
  )
}
