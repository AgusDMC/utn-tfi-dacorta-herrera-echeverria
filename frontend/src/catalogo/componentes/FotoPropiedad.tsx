import { useState } from 'react'
import type { ImagenPublicacion } from '../tipos.ts'
import estilos from './FotoPropiedad.module.css'

type Estado = 'cargando' | 'lista' | 'error'

interface Props {
  imagen: ImagenPublicacion
  alt: string
  prioridad?: boolean // la foto principal se pide primero; el resto, a medida que se acerca
  ajuste?: 'cover' | 'contain' // contain: el visor muestra la foto entera sobre fondo oscuro
}

// Foto que llena su contenedor. Mientras carga deja un bloque arena (el contenedor ya
// reserva la proporción), aparece con un fade y, si falla, avisa en lugar de quedar vacía.
export default function FotoPropiedad({ imagen, alt, prioridad = false, ajuste = 'cover' }: Props) {
  const [estado, setEstado] = useState<Estado>('cargando')

  return (
    <div className={`${estilos.foto} ${estilos[ajuste]}`} data-estado={estado}>
      {estado === 'error' ? (
        <p className={estilos.fallo}>No se pudo cargar la foto</p>
      ) : (
        <img
          ref={(img) => {
            // Una foto que ya estaba en caché no espera al evento load
            if (img?.complete && img.naturalWidth > 0) setEstado('lista')
          }}
          src={imagen.url}
          alt={alt}
          loading={prioridad ? 'eager' : 'lazy'}
          fetchPriority={prioridad ? 'high' : undefined}
          decoding="async"
          onLoad={() => setEstado('lista')}
          onError={() => setEstado('error')}
        />
      )}
    </div>
  )
}
