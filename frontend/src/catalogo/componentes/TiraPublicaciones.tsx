import { useEffect, useRef, useState } from 'react'
import type { PublicacionCatalogo } from '../tipos.ts'
import TarjetaPublicacion from './TarjetaPublicacion.tsx'
import estilos from './TiraPublicaciones.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  etiqueta: string // nombre accesible de la tira
}

const FRICCION = 0.95
const UMBRAL_ARRASTRE = 6 // px que separan un clic de un arrastre
const INTERVALO_AUTO = 4500 // ms entre un avance automático y el siguiente

function movimientoReducido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Carrusel de tarjetas. Avanza solo cada unos segundos y se detiene cuando el puntero está
// encima, cuando hay foco adentro, cuando sale de la pantalla o si se pidió menos movimiento;
// el botón de pausa lo frena del todo. Con el mouse se arrastra y sigue por inercia, con el dedo
// se desliza, y los botones de anterior y siguiente son la alternativa al arrastre.
export default function TiraPublicaciones({ publicaciones, etiqueta }: Props) {
  const pistaRef = useRef<HTMLDivElement>(null)
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [enPantalla, setEnPantalla] = useState(true)
  const [ocupado, setOcupado] = useState(false) // puntero encima o foco adentro
  const total = publicaciones.length

  // Un paso es una tarjeta más el espacio que la separa de la siguiente
  function paso() {
    const lista = pistaRef.current?.firstElementChild
    const tarjeta = lista?.firstElementChild
    if (!(lista instanceof HTMLElement) || !(tarjeta instanceof HTMLElement)) return 0
    return tarjeta.offsetWidth + (parseFloat(getComputedStyle(lista).columnGap) || 0)
  }

  function irA(indice: number, suave = true) {
    const pista = pistaRef.current
    if (!pista) return
    const destino = Math.min(Math.max(indice, 0), total - 1)
    pista.scrollTo({ left: destino * paso(), behavior: suave && !movimientoReducido() ? 'smooth' : 'auto' })
  }

  // Arrastre con el mouse, inercia y lectura de la tarjeta actual
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

    function leerActual() {
      const p = paso()
      if (p > 0) setActual(Math.round(pista!.scrollLeft / p))
    }

    function seguir() {
      pista!.scrollLeft += velocidad
      velocidad *= FRICCION
      if (Math.abs(velocidad) > 0.1) cuadro = requestAnimationFrame(seguir)
    }

    function alBajar(evento: PointerEvent) {
      if (evento.pointerType !== 'mouse' || evento.button !== 0) return
      cancelAnimationFrame(cuadro)
      arrastrando = true
      movido = false
      velocidad = 0
      xInicial = xAnterior = evento.clientX
      scrollInicial = pista!.scrollLeft
      tAnterior = evento.timeStamp
    }

    function alMover(evento: PointerEvent) {
      if (!arrastrando) return
      if (!movido && Math.abs(evento.clientX - xInicial) > UMBRAL_ARRASTRE) {
        movido = true
        pista!.setPointerCapture(evento.pointerId)
        pista!.dataset.arrastrando = ''
      }
      if (!movido) return
      pista!.scrollLeft = scrollInicial - (evento.clientX - xInicial)
      const intervalo = evento.timeStamp - tAnterior
      if (intervalo > 0) velocidad = ((xAnterior - evento.clientX) / intervalo) * 16
      xAnterior = evento.clientX
      tAnterior = evento.timeStamp
    }

    function alSoltar() {
      if (!arrastrando) return
      arrastrando = false
      delete pista!.dataset.arrastrando
      if (movido && !movimientoReducido()) cuadro = requestAnimationFrame(seguir)
    }

    // Soltar después de arrastrar no tiene que abrir la tarjeta que quedó debajo
    function alHacerClic(evento: MouseEvent) {
      if (!movido) return
      evento.preventDefault()
      evento.stopPropagation()
      movido = false
    }

    const observador = new IntersectionObserver(([entrada]) => setEnPantalla(entrada.isIntersecting), {
      threshold: 0.4,
    })
    observador.observe(pista)

    pista.addEventListener('pointerdown', alBajar)
    pista.addEventListener('pointermove', alMover)
    pista.addEventListener('pointerup', alSoltar)
    pista.addEventListener('pointercancel', alSoltar)
    pista.addEventListener('click', alHacerClic, true)
    pista.addEventListener('scroll', leerActual, { passive: true })
    leerActual()

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      pista.removeEventListener('pointerdown', alBajar)
      pista.removeEventListener('pointermove', alMover)
      pista.removeEventListener('pointerup', alSoltar)
      pista.removeEventListener('pointercancel', alSoltar)
      pista.removeEventListener('click', alHacerClic, true)
      pista.removeEventListener('scroll', leerActual)
    }
  }, [])

  // Avance automático: un solo temporizador, que solo corre cuando nada lo frena. Lee la
  // posición real de la pista al disparar, así no depende del estado `actual`.
  const activo = !pausado && !ocupado && enPantalla && total > 1
  useEffect(() => {
    if (!activo || movimientoReducido()) return

    const temporizador = window.setInterval(() => {
      const pista = pistaRef.current
      if (document.hidden || !pista) return
      const lista = pista.firstElementChild
      const tarjeta = lista?.firstElementChild
      if (!(lista instanceof HTMLElement) || !(tarjeta instanceof HTMLElement)) return
      const avance = tarjeta.offsetWidth + (parseFloat(getComputedStyle(lista).columnGap) || 0)
      const indice = Math.round(pista.scrollLeft / avance)
      const alFinal = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1
      pista.scrollTo({ left: alFinal ? 0 : (indice + 1) * avance, behavior: 'smooth' })
    }, INTERVALO_AUTO)

    return () => window.clearInterval(temporizador)
  }, [activo, total])

  return (
    <div
      className={estilos.tira}
      onPointerEnter={(evento) => evento.pointerType === 'mouse' && setOcupado(true)}
      onPointerLeave={(evento) => evento.pointerType === 'mouse' && setOcupado(false)}
      onFocus={() => setOcupado(true)}
      onBlur={(evento) => !evento.currentTarget.contains(evento.relatedTarget as Node | null) && setOcupado(false)}
    >
      <div
        ref={pistaRef}
        className={estilos.pista}
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label={etiqueta}
        onDragStart={(evento) => evento.preventDefault()}
      >
        <ul role="list" className={estilos.lista}>
          {publicaciones.map((publicacion) => (
            <li key={publicacion.id} className={estilos.item}>
              <TarjetaPublicacion publicacion={publicacion} />
            </li>
          ))}
        </ul>
      </div>

      <div className={estilos.controles}>
        {/* Puntos de posición: el actual se estira. Son botones: también sirven para saltar. */}
        <ol role="list" className={estilos.puntos} aria-label="Posición en el carrusel">
          {publicaciones.map((publicacion, indice) => (
            <li key={publicacion.id}>
              <button
                type="button"
                className={estilos.punto}
                aria-label={`Ir a la propiedad ${indice + 1} de ${total}`}
                aria-current={indice === actual ? 'true' : undefined}
                onClick={() => irA(indice)}
              />
            </li>
          ))}
        </ol>

        <div className={estilos.botones}>
          <button
            type="button"
            className={estilos.flecha}
            aria-label={pausado ? 'Reanudar el avance automático' : 'Pausar el avance automático'}
            aria-pressed={pausado}
            onClick={() => setPausado((valor) => !valor)}
          >
            {pausado ? (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6 4v12l10-6z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={estilos.flecha}
            aria-label="Propiedades anteriores"
            aria-disabled={actual === 0}
            onClick={() => irA(actual - 1)}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 4 6 10l6 6" />
            </svg>
          </button>
          <button
            type="button"
            className={estilos.flecha}
            aria-label="Propiedades siguientes"
            aria-disabled={actual >= total - 1}
            onClick={() => irA(actual + 1)}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m8 4 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Anuncia la tarjeta actual sin mover el foco */}
      <p className="sr-only" aria-live="polite">
        Propiedad {actual + 1} de {total}
      </p>
    </div>
  )
}
