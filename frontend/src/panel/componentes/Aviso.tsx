import type { ReactNode, Ref } from 'react'
import { IconoAlerta, IconoListo } from '../../compartido/componentes/Iconos.tsx'
import estilos from './Aviso.module.css'

// Lo que una pantalla guarda para mostrar en el aviso
export interface Resultado {
  texto: string
  error?: boolean
}

interface Props {
  error?: boolean
  className?: string
  ref?: Ref<HTMLParagraphElement>
  children: ReactNode
}

// Resultado de una acción del panel (se guardó, se eliminó, falló). Es enfocable: la pantalla que
// lo muestra le pasa el foco para que el lector de pantalla lo lea, porque el botón que lo tenía
// quedó deshabilitado o desapareció.
export default function Aviso({ error, className, ref, children }: Props) {
  return (
    <p ref={ref} tabIndex={-1} className={`${estilos.aviso} ${className ?? ''}`} data-error={error || undefined}>
      {error ? <IconoAlerta /> : <IconoListo />}
      <span>{children}</span>
    </p>
  )
}
