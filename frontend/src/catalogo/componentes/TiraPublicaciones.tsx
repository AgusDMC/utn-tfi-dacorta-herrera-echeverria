import { useEffect, useRef } from 'react'
import type { PublicacionCatalogo } from '../tipos.ts'
import TarjetaPublicacion from './TarjetaPublicacion.tsx'
import estilos from './TiraPublicaciones.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  etiqueta: string // nombre accesible de la tira
}

const VELOCIDAD = 30 // px por segundo del desplazamiento continuo
const FRICCION = 0.95
const UMBRAL_ARRASTRE = 6 // px que separan un clic de un arrastre

// Marquesina de tarjetas que avanza despacio y se frena con el puntero encima o con foco adentro.
// La lista va duplicada para que la vuelta no se note; la copia queda inert y oculta a lectores
// de pantalla. Se mueve con transform porque scrollLeft no admite decimales. Con movimiento
// reducido no avanza sola ni sigue por inercia: solo se mueve al arrastrarla.
export default function TiraPublicaciones({ publicaciones, etiqueta }: Props) {
  const pistaRef = useRef<HTMLDivElement>(null)
  const listaRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const pista = pistaRef.current
    const lista = listaRef.current
    if (!pista || !lista || publicaciones.length < 2) return

    let desplazamiento = 0 // px recorridos hacia la izquierda
    let velocidad = 0 // inercia tras el arrastre, en px por cuadro
    let enPausa = false
    let arrastrando = false
    let movido = false
    let xInicial = 0
    let inicioArrastre = 0
    let xAnterior = 0
    let tAnterior = 0
    let cuadro = 0
    let ultimo = 0
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Una vuelta completa es la mitad del ancho de la lista: al pasarla se vuelve al inicio
    function vuelta() {
      return lista!.scrollWidth / 2
    }

    function pintar() {
      const total = vuelta()
      if (total > 0) {
        desplazamiento = ((desplazamiento % total) + total) % total
      }
      lista!.style.transform = `translate3d(${-desplazamiento}px, 0, 0)`
    }

    function animar(ahora: number) {
      // Avanza según el tiempo real entre cuadros, así la velocidad no depende de la tasa de
      // refresco. Tope de 1 s: al volver de una pestaña oculta no pega un salto.
      const delta = Math.min(ahora - ultimo, 1000) / 1000
      ultimo = ahora

      if (!arrastrando) {
        if (Math.abs(velocidad) > 0.1) {
          desplazamiento += velocidad
          velocidad *= FRICCION
        } else if (!enPausa && !document.hidden && !movimientoReducido.matches) {
          desplazamiento += VELOCIDAD * delta
        }
        pintar()
      }

      cuadro = requestAnimationFrame(animar)
    }

    function alBajar(evento: PointerEvent) {
      if (evento.button !== 0) return
      arrastrando = true
      movido = false
      velocidad = 0
      xInicial = xAnterior = evento.clientX
      inicioArrastre = desplazamiento
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
      desplazamiento = inicioArrastre - (evento.clientX - xInicial)
      pintar()
      const intervalo = evento.timeStamp - tAnterior
      if (intervalo > 0) velocidad = ((xAnterior - evento.clientX) / intervalo) * 16
      xAnterior = evento.clientX
      tAnterior = evento.timeStamp
    }

    function alSoltar() {
      if (!arrastrando) return
      arrastrando = false
      delete pista!.dataset.arrastrando
      if (!movido || movimientoReducido.matches) velocidad = 0
    }

    // Soltar después de arrastrar no tiene que abrir la tarjeta que quedó debajo
    function alHacerClic(evento: MouseEvent) {
      if (!movido) return
      evento.preventDefault()
      evento.stopPropagation()
      movido = false
    }

    const pausar = () => {
      enPausa = true
    }
    const reanudar = () => {
      enPausa = false
    }

    // Fuera de pantalla no hace falta mover nada
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        ultimo = performance.now()
        if (!cuadro) cuadro = requestAnimationFrame(animar)
      } else {
        cancelAnimationFrame(cuadro)
        cuadro = 0
      }
    })
    observador.observe(pista)

    pista.addEventListener('pointerdown', alBajar)
    pista.addEventListener('pointermove', alMover)
    pista.addEventListener('pointerup', alSoltar)
    pista.addEventListener('pointercancel', alSoltar)
    pista.addEventListener('click', alHacerClic, true)
    pista.addEventListener('pointerenter', pausar)
    pista.addEventListener('pointerleave', reanudar)
    pista.addEventListener('focusin', pausar)
    pista.addEventListener('focusout', reanudar)

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      pista.removeEventListener('pointerdown', alBajar)
      pista.removeEventListener('pointermove', alMover)
      pista.removeEventListener('pointerup', alSoltar)
      pista.removeEventListener('pointercancel', alSoltar)
      pista.removeEventListener('click', alHacerClic, true)
      pista.removeEventListener('pointerenter', pausar)
      pista.removeEventListener('pointerleave', reanudar)
      pista.removeEventListener('focusin', pausar)
      pista.removeEventListener('focusout', reanudar)
    }
  }, [publicaciones.length])

  // Con una sola tarjeta no hay nada que recorrer
  const copias = publicaciones.length > 1 ? [publicaciones, publicaciones] : [publicaciones]

  return (
    <div
      ref={pistaRef}
      className={estilos.pista}
      tabIndex={0}
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      onDragStart={(evento) => evento.preventDefault()}
    >
      <ul ref={listaRef} role="list" className={estilos.lista}>
        {copias.map((lista, copia) =>
          lista.map((publicacion) => (
            <li
              key={`${copia}-${publicacion.id}`}
              className={estilos.item}
              aria-hidden={copia > 0 || undefined}
              inert={copia > 0 || undefined}
            >
              <TarjetaPublicacion publicacion={publicacion} copia={copia > 0} />
            </li>
          )),
        )}
      </ul>
    </div>
  )
}
