import type { ReactNode } from 'react'
import estilos from './FormularioPanel.module.css'

interface Props {
  id: string // el del control; el aviso usa `${id}-error` y la ayuda `${id}-ayuda`
  etiqueta: string
  error?: string
  ayuda?: string
  children: ReactNode
}

// Etiqueta, control, ayuda y aviso de un campo de los formularios del panel. El control tiene
// que referenciar la ayuda y el aviso en su aria-describedby para que se lean al enfocarlo.
export default function Campo({ id, etiqueta, error, ayuda, children }: Props) {
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {etiqueta}
      </label>
      {children}
      {ayuda && (
        <p id={`${id}-ayuda`} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={estilos.aviso}>
          {error}
        </p>
      )}
    </div>
  )
}
