import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { PublicacionCatalogo } from '../tipos.ts'
import CabeceraListado from './CabeceraListado.tsx'
import TarjetaPublicacion from './TarjetaPublicacion.tsx'
import estilos from './CarruselPublicaciones.module.css'

interface Props {
  titulo: string
  idTitulo: string
  detalle?: ReactNode
  publicaciones: PublicacionCatalogo[]
  // 'grilla': en desktop las tarjetas se acomodan en una grilla de tres columnas
  // (resultados sistemáticos); en mobile sigue siendo un carrusel con swipe.
  modo?: 'carrusel' | 'grilla'
}

// Carrusel horizontal sin librerías: scroll nativo con scroll-snap (swipe en
// mobile) y botones anterior/siguiente que solo aparecen si hay más contenido.
export default function CarruselPublicaciones({ titulo, idTitulo, detalle, publicaciones, modo = 'carrusel' }: Props) {
  const idPista = useId()
  const pistaRef = useRef<HTMLUListElement>(null)
  const barraRef = useRef<HTMLSpanElement>(null)
  // Solo cambian al llegar a un extremo: el resto del scroll no vuelve a renderizar el carrusel
  const [puedeAnterior, setPuedeAnterior] = useState(false)
  const [puedeSiguiente, setPuedeSiguiente] = useState(false)
  const cantidad = publicaciones.length

  useEffect(() => {
    const pista = pistaRef.current
    const barra = barraRef.current
    if (!pista) return

    const actualizar = () => {
      setPuedeAnterior(pista.scrollLeft > 4)
      setPuedeSiguiente(pista.scrollLeft + pista.clientWidth < pista.scrollWidth - 4)

      // El indicador de posición cambia en cada cuadro del scroll: se escribe directo en el
      // DOM (una ref) en lugar de pasar por el estado, que re-renderizaría todas las tarjetas
      if (barra) {
        const visible = pista.clientWidth / pista.scrollWidth
        const inicio = pista.scrollLeft / pista.scrollWidth
        barra.style.width = `${visible * 100}%`
        barra.style.transform = `translateX(${(inicio / visible) * 100}%)`
      }
    }

    actualizar()
    pista.addEventListener('scroll', actualizar, { passive: true })
    const observador = new ResizeObserver(actualizar)
    observador.observe(pista)
    return () => {
      pista.removeEventListener('scroll', actualizar)
      observador.disconnect()
    }
  }, [cantidad])

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
      <CabeceraListado idTitulo={idTitulo} titulo={titulo} detalle={detalle}>
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
      </CabeceraListado>

      <ul
        id={idPista}
        ref={pistaRef}
        className={`${estilos.pista} ${modo === 'grilla' ? estilos.grilla : ''}`}
        data-mas-de-tres={publicaciones.length > 3 || undefined}
      >
        {publicaciones.map((publicacion) => (
          <li key={publicacion.id} className={estilos.item}>
            <TarjetaPublicacion publicacion={publicacion} />
          </li>
        ))}
      </ul>

      {/* En mobile reemplaza a las flechas: un filete que muestra qué parte de la pista se ve.
          Siempre está montado (oculto si no hay nada que desplazar) para que su ref exista. */}
      <div className={estilos.progreso} aria-hidden="true" hidden={!hayDesplazamiento}>
        <span ref={barraRef} className={estilos.progresoBarra} />
      </div>
    </>
  )
}
