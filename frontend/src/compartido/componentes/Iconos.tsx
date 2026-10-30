import type { ReactNode } from 'react'
import type { TipoPropiedad } from '../../catalogo/tipos.ts'

// Íconos propios de 24 px: trazo de 1,5 px y color heredado (currentColor). Son decorativos: el
// texto que los acompaña ya dice lo mismo.
interface Props {
  className?: string
}

function Icono({ className, children }: Props & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

function IconoCasa(props: Props) {
  return (
    <Icono {...props}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </Icono>
  )
}

function IconoDepartamento(props: Props) {
  return (
    <Icono {...props}>
      <path d="M6 21V4h12v17" />
      <path d="M4 21h16" />
      <path d="M9.500 8h1M13.500 8h1M9.500 12h1M13.500 12h1" />
      <path d="M10.500 21v-4h3v4" />
    </Icono>
  )
}

function IconoPH(props: Props) {
  return (
    <Icono {...props}>
      <path d="M2.500 12 8 7.500l5.500 4.500" />
      <path d="M4 11v8h8v-8" />
      <path d="M19 19v-3.500" />
      <circle cx="19" cy="12.500" r="2.500" />
    </Icono>
  )
}

function IconoDuplex(props: Props) {
  return (
    <Icono {...props}>
      <path d="M5 21V8l7-4.500L19 8v13z" />
      <path d="M5 14.500h14" />
      <path d="M10.500 21v-3.500h3V21" />
      <path d="M9 10.500h1.500M13.500 10.500H15" />
    </Icono>
  )
}

export function IconoCartel(props: Props) {
  return (
    <Icono {...props}>
      <path d="M6 21V3" />
      <path d="M6 4.500h12l-2.500 3 2.500 3H6" />
    </Icono>
  )
}

export function IconoTelefono(props: Props) {
  return (
    <Icono {...props}>
      <path d="M5.500 4h3.200l1.800 4.500-2.200 1.400a11 11 0 0 0 5.800 5.800l1.400-2.200 4.500 1.800v3.200a1.500 1.500 0 0 1-1.600 1.500C10.900 19.600 4.400 13.100 4 5.600A1.500 1.500 0 0 1 5.500 4z" />
    </Icono>
  )
}

export function IconoCorreo(props: Props) {
  return (
    <Icono {...props}>
      <path d="M3.500 6h17v12h-17z" />
      <path d="m3.500 7 8.500 6.500L20.500 7" />
    </Icono>
  )
}

export function IconoUbicacion(props: Props) {
  return (
    <Icono {...props}>
      <path d="M12 21s-6.500-5.500-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.500 12 21 12 21z" />
      <circle cx="12" cy="10.500" r="2.300" />
    </Icono>
  )
}

export function IconoReloj(props: Props) {
  return (
    <Icono {...props}>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M12 7.500V12l3 2" />
    </Icono>
  )
}

export function IconoMatricula(props: Props) {
  return (
    <Icono {...props}>
      <path d="M7 3.500h7.500L19 8v12.500H7z" />
      <path d="M14.500 3.500V8H19" />
      <path d="m10 14 2 2 3.500-4" />
    </Icono>
  )
}

export function IconoMensaje(props: Props) {
  return (
    <Icono {...props}>
      <path d="M4 5.500h16v11H10l-4.500 3.500v-3.500H4z" />
    </Icono>
  )
}

// El ícono de cada tipo de propiedad
export function IconoTipo({ tipo, className }: { tipo: TipoPropiedad; className?: string }) {
  switch (tipo) {
    case 'CASA':
      return <IconoCasa className={className} />
    case 'DEPARTAMENTO':
      return <IconoDepartamento className={className} />
    case 'PH':
      return <IconoPH className={className} />
    case 'DUPLEX':
      return <IconoDuplex className={className} />
  }
}
