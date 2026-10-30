import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ImagenPublicacion } from '../tipos.ts'
import FotoPropiedad from './FotoPropiedad.tsx'
import estilos from './VisorFotos.module.css'

interface Props {
  imagenes: ImagenPublicacion[]
  titulo: string
  indiceInicial: number | null // null: cerrado
  onCerrar: () => void
  altDe: (indice: number) => string
}

function movimientoReducido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Visor a pantalla completa. Es un <dialog> modal nativo (foco atrapado, Esc y fondo inerte
// los resuelve el navegador) con una sola pista de scroll-snap: el dedo la desliza en el
// celular y las flechas y el teclado la mueven con scrollTo en escritorio.
export default function VisorFotos({ imagenes, titulo, indiceInicial, onCerrar, altDe }: Props) {
  const dialogoRef = useRef<HTMLDialogElement>(null)
  const pistaRef = useRef<HTMLUListElement>(null)
  const indiceRef = useRef(0)
  const cuadroRef = useRef(0)
  const [indice, setIndice] = useState(0)
  const total = imagenes.length

  function irA(destino: number) {
    const pista = pistaRef.current
    if (!pista) return
    const limitado = Math.min(Math.max(destino, 0), total - 1)
    pista.scrollTo({ left: limitado * pista.clientWidth, behavior: movimientoReducido() ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const dialogo = dialogoRef.current
    const pista = pistaRef.current
    if (indiceInicial === null || !dialogo || !pista || dialogo.open) return

    // El scroll de la página se bloquea mientras el visor está abierto
    // (scrollbar-gutter: stable en <html> evita que el contenido salte)
    document.documentElement.classList.add('visor-abierto')
    dialogo.showModal()
    pista.scrollTo({ left: indiceInicial * pista.clientWidth, behavior: 'instant' })
    indiceRef.current = indiceInicial
    setIndice(indiceInicial)
  }, [indiceInicial])

  useEffect(
    () => () => {
      document.documentElement.classList.remove('visor-abierto')
      cancelAnimationFrame(cuadroRef.current)
    },
    [],
  )

  // El contador se recalcula como máximo una vez por cuadro y el estado cambia solo
  // cuando la pista llega a otra foto
  function alDeslizar() {
    cancelAnimationFrame(cuadroRef.current)
    cuadroRef.current = requestAnimationFrame(() => {
      const pista = pistaRef.current
      if (!pista || pista.clientWidth === 0) return
      const actual = Math.round(pista.scrollLeft / pista.clientWidth)
      if (actual !== indiceRef.current) {
        indiceRef.current = actual
        setIndice(actual)
      }
    })
  }

  function alPresionarTecla(evento: KeyboardEvent<HTMLDialogElement>) {
    const destinos: Record<string, number> = {
      ArrowLeft: indiceRef.current - 1,
      ArrowRight: indiceRef.current + 1,
      Home: 0,
      End: total - 1,
    }
    if (!(evento.key in destinos)) return
    evento.preventDefault()
    irA(destinos[evento.key])
  }

  function alCerrar() {
    document.documentElement.classList.remove('visor-abierto')
    onCerrar()
  }

  return (
    <dialog
      ref={dialogoRef}
      className={estilos.visor}
      aria-label={`Fotos de ${titulo}`}
      onKeyDown={alPresionarTecla}
      onClose={alCerrar}
    >
      <div className={estilos.barra}>
        <p className={estilos.contador} aria-live="polite" aria-atomic="true">
          {indice + 1} / {total}
        </p>
        <button type="button" className={estilos.cerrar} onClick={() => dialogoRef.current?.close()}>
          Cerrar
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </div>

      <div className={estilos.escenario}>
        <ul ref={pistaRef} className={estilos.pista} tabIndex={0} aria-label="Fotos" role="list" onScroll={alDeslizar}>
          {imagenes.map((imagen, i) => (
            <li key={imagen.url + i} className={estilos.diapositiva}>
              <FotoPropiedad imagen={imagen} alt={altDe(i)} ajuste="contain" />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`${estilos.flecha} ${estilos.anterior}`}
          aria-label="Foto anterior"
          aria-disabled={indice === 0}
          onClick={() => irA(indiceRef.current - 1)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 4 6 10l6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={`${estilos.flecha} ${estilos.siguiente}`}
          aria-label="Foto siguiente"
          aria-disabled={indice === total - 1}
          onClick={() => irA(indiceRef.current + 1)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m8 4 6 6-6 6" />
          </svg>
        </button>
      </div>
    </dialog>
  )
}
