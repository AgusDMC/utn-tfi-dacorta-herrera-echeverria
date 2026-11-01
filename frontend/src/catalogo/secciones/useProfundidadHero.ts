import { useEffect, type RefObject } from 'react'

// Profundidad del hero: las capas marcadas con data-profundidad se desplazan en sentido
// contrario al puntero, más cuanto más cerca están (como una cámara que se mueve un poco).
// El valor del atributo es el desplazamiento máximo en px: positivo = capa cercana,
// negativo = capa lejana (se mueve con el puntero).
//
// Solo corre con un puntero preciso, en pantalla ancha y sin pedido de movimiento reducido:
// en touch no hay puntero que seguir y la profundidad no aportaría nada.
const CONSULTA = '(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'

// Qué tan pegada sigue al puntero (segundos): una cola corta da inercia sin sentirse lenta
const INERCIA = 0.14

// El desplazamiento vertical es menor que el horizontal: el hero es ancho y bajo
const PROPORCION_VERTICAL = 0.6

const acotar = (valor: number) => Math.max(-1, Math.min(1, valor))

export function useProfundidadHero(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = ref.current
    if (!hero) return

    const consulta = window.matchMedia(CONSULTA)
    const capas = [...hero.querySelectorAll<HTMLElement>('[data-profundidad]')].map((elemento) => ({
      elemento,
      amplitud: Number(elemento.dataset.profundidad),
    }))

    let objetivoX = 0
    let objetivoY = 0
    let x = 0
    let y = 0
    let cuadro = 0
    let ultimo = 0
    let escuchando = false

    // Un solo bucle de animación, y solo mientras queda algo por mover. Escribe directo en
    // el estilo de cada capa: sin estado de React ni variables CSS heredadas por cuadro.
    const pintar = (ahora: number) => {
      const dt = Math.min((ahora - ultimo) / 1000, 0.05)
      ultimo = ahora
      const k = 1 - Math.exp(-dt / INERCIA)
      x += (objetivoX - x) * k
      y += (objetivoY - y) * k

      for (const { elemento, amplitud } of capas) {
        elemento.style.translate = `${(-x * amplitud).toFixed(2)}px ${(-y * amplitud * PROPORCION_VERTICAL).toFixed(2)}px`
      }

      const quieto = Math.abs(objetivoX - x) < 0.001 && Math.abs(objetivoY - y) < 0.001
      cuadro = quieto ? 0 : requestAnimationFrame(pintar)
    }

    const pedirCuadro = () => {
      if (cuadro) return
      ultimo = performance.now()
      cuadro = requestAnimationFrame(pintar)
    }

    const alMover = (evento: PointerEvent) => {
      if (evento.pointerType === 'touch') return
      const caja = hero.getBoundingClientRect()
      objetivoX = acotar(((evento.clientX - caja.left) / caja.width) * 2 - 1)
      objetivoY = acotar(((evento.clientY - caja.top) / caja.height) * 2 - 1)
      pedirCuadro()
    }

    // Al salir, las capas vuelven a su lugar con la misma inercia
    const alSalir = () => {
      objetivoX = 0
      objetivoY = 0
      pedirCuadro()
    }

    const desactivar = () => {
      if (!escuchando) return
      hero.removeEventListener('pointermove', alMover)
      hero.removeEventListener('pointerleave', alSalir)
      cancelAnimationFrame(cuadro)
      cuadro = 0
      objetivoX = objetivoY = x = y = 0
      for (const { elemento } of capas) elemento.style.removeProperty('translate')
      escuchando = false
    }

    const sincronizar = () => {
      if (!consulta.matches) return desactivar()
      if (escuchando) return
      hero.addEventListener('pointermove', alMover, { passive: true })
      hero.addEventListener('pointerleave', alSalir)
      escuchando = true
    }

    sincronizar()
    consulta.addEventListener('change', sincronizar)
    return () => {
      consulta.removeEventListener('change', sincronizar)
      desactivar()
    }
  }, [ref])
}
