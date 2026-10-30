import { useEffect, useRef, useState, ViewTransition } from 'react'
import { useMediaQuery } from '../../compartido/hooks/useMediaQuery.ts'
import type { ImagenPublicacion } from '../tipos.ts'
import FotoPropiedad from './FotoPropiedad.tsx'
import Recorrido from './Recorrido.tsx'
import VisorFotos from './VisorFotos.tsx'
import estilos from './GaleriaPropiedad.module.css'

interface Props {
  id: number
  titulo: string
  imagenes: ImagenPublicacion[]
  ilustrativas?: boolean // muestra la nota "Fotografías ilustrativas" sobre la foto principal
}

// En el celular todas las fotos van en un carrusel. Desde tablet la foto principal es la del
// hero (es hija directa de la grilla de la página, por eso .galeria es display: contents) y
// las demás van en el recorrido, más abajo.
export default function GaleriaPropiedad({ id, titulo, imagenes, ilustrativas = false }: Props) {
  const total = imagenes.length
  const [visor, setVisor] = useState<number | null>(null)
  const [actual, setActual] = useState(0)
  const botonRef = useRef<HTMLButtonElement>(null)
  const disparadorRef = useRef<HTMLElement | null>(null)
  const listaRef = useRef<HTMLUListElement>(null)
  const actualRef = useRef(0)
  const cuadroRef = useRef(0)
  const esCelular = useMediaQuery('(max-width: 767.98px)')
  const ampliable = total > 1
  const carrusel = esCelular && ampliable
  const conRecorrido = !esCelular && ampliable

  useEffect(() => () => cancelAnimationFrame(cuadroRef.current), [])

  const altDe = (indice: number) => imagenes[indice].descripcion ?? `Foto ${indice + 1} de ${total} de ${titulo}`

  // El chip "1 / N" cambia solo cuando el carrusel llega a otra foto, no en cada cuadro del scroll
  function alDeslizar() {
    cancelAnimationFrame(cuadroRef.current)
    cuadroRef.current = requestAnimationFrame(() => {
      const lista = listaRef.current
      const [primera, segunda] = lista?.children ?? []
      if (!lista || !(primera instanceof HTMLElement) || !(segunda instanceof HTMLElement)) return
      const indice = Math.round(lista.scrollLeft / (segunda.offsetLeft - primera.offsetLeft))
      if (indice !== actualRef.current) {
        actualRef.current = indice
        setActual(indice)
      }
    })
  }

  // Se recuerda qué botón abrió el visor para devolverle el foco al cerrar. Las fotos del
  // carrusel no son focusables: si se abrió tocando una, el foco vuelve al botón "Ver las N fotos".
  function abrirVisor(indice: number, disparador: HTMLElement | null) {
    disparadorRef.current = disparador
    setVisor(indice)
  }

  function cerrarVisor() {
    setVisor(null)
    const destino = disparadorRef.current ?? botonRef.current
    destino?.focus()
  }

  const enLista = conRecorrido ? imagenes.slice(0, 1) : imagenes

  return (
    <div
      className={estilos.galeria}
      role={carrusel ? 'region' : undefined}
      aria-roledescription={carrusel ? 'carrusel' : undefined}
      aria-label={carrusel ? `Fotos de ${titulo}` : undefined}
    >
      <ul
        ref={listaRef}
        role="list"
        className={estilos.lista}
        data-unica={!ampliable || undefined}
        tabIndex={carrusel ? 0 : undefined}
        aria-label={carrusel ? `Carrusel de fotos de ${titulo}` : undefined}
        onScroll={carrusel ? alDeslizar : undefined}
      >
        {enLista.map((imagen, i) => {
          const item = (
            <li
              key={imagen.url + i}
              className={estilos.item}
              data-principal={i === 0 || undefined}
              data-ampliable={ampliable || undefined}
              onClick={ampliable ? () => abrirVisor(i, null) : undefined}
            >
              <div className={estilos.foto}>
                <FotoPropiedad imagen={imagen} alt={altDe(i)} prioridad={i === 0} />
              </div>
              {i === 0 && ilustrativas && <p className={estilos.nota}>Fotografías ilustrativas</p>}
            </li>
          )
          // La foto principal viaja desde la tarjeta del catálogo
          return i === 0 ? (
            <ViewTransition key={imagen.url + i} name={`foto-${id}`} enter="none" exit="none" update="none" share="foto-compartida">
              {item}
            </ViewTransition>
          ) : (
            item
          )
        })}
      </ul>

      {conRecorrido && <Recorrido imagenes={imagenes.slice(1)} primera={1} titulo={titulo} altDe={altDe} onAbrir={abrirVisor} />}

      {ampliable && (
        <>
          <p className={estilos.contador} aria-hidden="true">
            {actual + 1} / {total}
          </p>
          <button
            ref={botonRef}
            type="button"
            className={estilos.verFotos}
            onClick={(evento) => abrirVisor(0, evento.currentTarget)}
          >
            Ver las {total} fotos
          </button>
          <VisorFotos imagenes={imagenes} titulo={titulo} indiceInicial={visor} onCerrar={cerrarVisor} altDe={altDe} />
        </>
      )}
    </div>
  )
}
