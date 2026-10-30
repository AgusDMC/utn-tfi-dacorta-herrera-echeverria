import { useEffect, useRef, useState } from 'react'
import type { ImagenPublicacion } from '../tipos.ts'
import FotoPropiedad from './FotoPropiedad.tsx'
import estilos from './Recorrido.module.css'

interface Props {
  imagenes: ImagenPublicacion[] // las fotos que siguen a la principal
  primera: number // posición de la primera de ellas en la galería completa
  titulo: string
  altDe: (indice: number) => string
  onAbrir: (indice: number, disparador: HTMLElement) => void
}

const FRICCION = 0.95
const UMBRAL_ARRASTRE = 5 // px que separan un clic de un arrastre

function movimientoReducido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Tira horizontal de fotos del mismo tamaño. Con el mouse se arrastra y sigue un poco por
// inercia; con el dedo se desliza con el scroll nativo; con teclado se mueve con las flechas
// del navegador o con los botones. Los bordes curvos de arriba y abajo son dos máscaras del
// color de la página.
export default function Recorrido({ imagenes, primera, titulo, altDe, onAbrir }: Props) {
  const pistaRef = useRef<HTMLDivElement>(null)
  const [bordes, setBordes] = useState({ inicio: true, fin: false })

  useEffect(() => {
    const pista = pistaRef.current
    if (!pista) return

    let arrastrando = false
    let movido = false
    let xInicial = 0
    let scrollInicial = 0
    let xAnterior = 0
    let tAnterior = 0
    let velocidad = 0
    let cuadro = 0

    function actualizarBordes() {
      if (!pista) return
      const inicio = pista.scrollLeft <= 1
      const fin = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1
      setBordes((actual) => (actual.inicio === inicio && actual.fin === fin ? actual : { inicio, fin }))
    }

    function seguir() {
      if (!pista) return
      pista.scrollLeft += velocidad
      velocidad *= FRICCION
      if (Math.abs(velocidad) > 0.1) cuadro = requestAnimationFrame(seguir)
    }

    // Solo el mouse arrastra: el dedo ya desliza la tira con el scroll del navegador
    function alBajar(evento: PointerEvent) {
      if (!pista || evento.pointerType !== 'mouse' || evento.button !== 0) return
      cancelAnimationFrame(cuadro)
      arrastrando = true
      movido = false
      velocidad = 0
      xInicial = xAnterior = evento.clientX
      scrollInicial = pista.scrollLeft
      tAnterior = evento.timeStamp
    }

    function alMover(evento: PointerEvent) {
      if (!pista || !arrastrando) return
      if (!movido && Math.abs(evento.clientX - xInicial) > UMBRAL_ARRASTRE) {
        movido = true
        pista.setPointerCapture(evento.pointerId)
        pista.dataset.arrastrando = ''
      }
      if (!movido) return
      pista.scrollLeft = scrollInicial - (evento.clientX - xInicial)
      const intervalo = evento.timeStamp - tAnterior
      if (intervalo > 0) velocidad = ((xAnterior - evento.clientX) / intervalo) * 16
      xAnterior = evento.clientX
      tAnterior = evento.timeStamp
    }

    function alSoltar() {
      if (!pista || !arrastrando) return
      arrastrando = false
      delete pista.dataset.arrastrando
      if (movido && !movimientoReducido()) cuadro = requestAnimationFrame(seguir)
    }

    // Soltar el mouse después de arrastrar no tiene que abrir la foto que quedó debajo
    function alHacerClic(evento: MouseEvent) {
      if (!movido) return
      evento.preventDefault()
      evento.stopPropagation()
      movido = false
    }

    pista.addEventListener('pointerdown', alBajar)
    pista.addEventListener('pointermove', alMover)
    pista.addEventListener('pointerup', alSoltar)
    pista.addEventListener('pointercancel', alSoltar)
    pista.addEventListener('click', alHacerClic, true)
    pista.addEventListener('scroll', actualizarBordes, { passive: true })
    window.addEventListener('resize', actualizarBordes)
    actualizarBordes()

    return () => {
      cancelAnimationFrame(cuadro)
      pista.removeEventListener('pointerdown', alBajar)
      pista.removeEventListener('pointermove', alMover)
      pista.removeEventListener('pointerup', alSoltar)
      pista.removeEventListener('pointercancel', alSoltar)
      pista.removeEventListener('click', alHacerClic, true)
      pista.removeEventListener('scroll', actualizarBordes)
      window.removeEventListener('resize', actualizarBordes)
    }
  }, [])

  // Un paso es una foto más el espacio que la separa de la siguiente
  function mover(sentido: 1 | -1) {
    const pista = pistaRef.current
    const lista = pista?.firstElementChild
    const foto = lista?.firstElementChild
    if (!pista || !(lista instanceof HTMLElement) || !(foto instanceof HTMLElement)) return
    const paso = foto.offsetWidth + (parseFloat(getComputedStyle(lista).columnGap) || 0)
    pista.scrollBy({ left: sentido * paso, behavior: movimientoReducido() ? 'auto' : 'smooth' })
  }

  return (
    <div className={estilos.recorrido}>
      <div className={estilos.escena}>
        <div
          ref={pistaRef}
          className={estilos.pista}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label={`Más fotos de ${titulo}`}
          onDragStart={(evento) => evento.preventDefault()}
        >
          <ul role="list" className={estilos.lista}>
            {imagenes.map((imagen, i) => (
              <li key={imagen.url + i} className={estilos.foto}>
                <button
                  type="button"
                  className={estilos.abrir}
                  aria-label={`Ampliar foto ${primera + i + 1}`}
                  onClick={(evento) => onAbrir(primera + i, evento.currentTarget)}
                >
                  <FotoPropiedad imagen={imagen} alt={altDe(primera + i)} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bordes curvos: cubren más el centro que los extremos, así las fotos de las puntas se ven más altas */}
        <svg className={`${estilos.borde} ${estilos.arriba}`} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z" />
        </svg>
        <svg className={`${estilos.borde} ${estilos.abajo}`} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z" />
        </svg>
      </div>

      <div className={estilos.controles}>
        <button
          type="button"
          className={estilos.flecha}
          aria-label="Fotos anteriores"
          aria-disabled={bordes.inicio}
          onClick={() => mover(-1)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 4 6 10l6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={estilos.flecha}
          aria-label="Fotos siguientes"
          aria-disabled={bordes.fin}
          onClick={() => mover(1)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m8 4 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
