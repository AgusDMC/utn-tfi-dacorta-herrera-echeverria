import type { ReactNode } from 'react'
import estilos from './Ilustraciones.module.css'

// Ilustraciones de línea propias. Son decorativas (aria-hidden) y cada trazo se dibuja al
// entrar en pantalla (ver Ilustraciones.module.css). Trazo de 1,5 px en el color actual.
interface Props {
  className?: string
}

function Lienzo({ className, viewBox, children }: Props & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`${estilos.ilustracion} ${className ?? ''}`}
    >
      {children}
    </svg>
  )
}

// Una casa de una planta con galería, árbol y sol: la entrada a "Comprar"
export function IlustracionCasa(props: Props) {
  return (
    <Lienzo viewBox="0 0 240 180" {...props}>
      <circle cx="196" cy="42" r="14" pathLength="1" className={estilos.trazo} />
      <path d="M20 150h200" pathLength="1" className={estilos.trazo} />
      <path d="M44 150V82l58-42 58 42v68" pathLength="1" className={estilos.trazo} />
      <path d="M44 82h116M160 150V82" pathLength="1" className={estilos.trazo} />
      <path d="M60 150v-40h26v40" pathLength="1" className={estilos.trazo} />
      <path d="M104 110h30v22h-30zM119 110v22M104 121h30" pathLength="1" className={estilos.trazo} />
      <path d="M166 150v-30M166 120c-14-2-20-12-16-26 4 10 14 16 28 14-2 10-6 12-12 12" pathLength="1" className={estilos.trazo} />
      <path d="M30 150c0-10 10-10 10 0M194 150c0-8 12-8 12 0" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}

// Un edificio de tres pisos con balcones y una llave: la entrada a "Alquilar"
export function IlustracionEdificio(props: Props) {
  return (
    <Lienzo viewBox="0 0 240 180" {...props}>
      <path d="M20 150h200" pathLength="1" className={estilos.trazo} />
      <path d="M70 150V34h100v116" pathLength="1" className={estilos.trazo} />
      <path d="M70 34 120 20l50 14" pathLength="1" className={estilos.trazo} />
      <path d="M84 50h18v16H84zM138 50h18v16h-18zM84 82h18v16H84zM138 82h18v16h-18zM84 114h18v16H84zM138 114h18v16h-18z" pathLength="1" className={estilos.trazo} />
      <path d="M80 98h26M134 98h26M80 66h26M134 66h26" pathLength="1" className={estilos.trazo} />
      <path d="M110 150v-26h20v26" pathLength="1" className={estilos.trazo} />
      <circle cx="202" cy="112" r="9" pathLength="1" className={estilos.trazo} />
      <path d="M211 112h20M226 112v6M221 112v4" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}

// Una calle con tres casas distintas: "Dónde trabajamos"
export function IlustracionBarrio(props: Props) {
  return (
    <Lienzo viewBox="0 0 320 160" {...props}>
      <path d="M10 136h300" pathLength="1" className={estilos.trazo} />
      <path d="M30 136V86l32-24 32 24v50M30 86h64" pathLength="1" className={estilos.trazo} />
      <path d="M54 136v-26h16v26M38 96h10v10H38z" pathLength="1" className={estilos.trazo} />
      <path d="M118 136V58h74v78M118 58l37-14 37 14" pathLength="1" className={estilos.trazo} />
      <path d="M130 72h14v12h-14zM166 72h14v12h-14zM130 96h14v12h-14zM166 96h14v12h-14zM148 136v-20h14v20" pathLength="1" className={estilos.trazo} />
      <path d="M216 136V94l36-28 36 28v42M216 94h72" pathLength="1" className={estilos.trazo} />
      <path d="M244 136v-22h16v22M226 102h10v10h-10zM270 102h10v10h-10z" pathLength="1" className={estilos.trazo} />
      <path d="M302 136v-22M302 114c-8-2-12-8-9-16 3 6 8 10 16 8-1 6-4 8-7 8" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}

// Una puerta entreabierta con llave: la invitación a consultar
export function IlustracionPuerta(props: Props) {
  return (
    <Lienzo viewBox="0 0 160 200" {...props}>
      <path d="M20 190h120" pathLength="1" className={estilos.trazo} />
      <path d="M36 190V26h88v164" pathLength="1" className={estilos.trazo} />
      <path d="M48 190V38h50l24 10v142" pathLength="1" className={estilos.trazo} />
      <circle cx="106" cy="112" r="4" pathLength="1" className={estilos.trazo} />
      <path d="M60 54h22v26H60zM60 96h22v26H60z" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}

// Tres pasos de una consulta: una lupa, un sobre y un apretón de manos simplificado
export function IlustracionPaso({ paso, className }: Props & { paso: 1 | 2 | 3 }) {
  if (paso === 1) {
    return (
      <Lienzo viewBox="0 0 96 96" className={className}>
        <circle cx="42" cy="42" r="22" pathLength="1" className={estilos.trazo} />
        <path d="m58 58 20 20" pathLength="1" className={estilos.trazo} />
        <path d="M30 44V34l12-9 12 9v10M38 44v-6h8v6" pathLength="1" className={estilos.trazo} />
      </Lienzo>
    )
  }
  if (paso === 2) {
    return (
      <Lienzo viewBox="0 0 96 96" className={className}>
        <path d="M16 30h64v40H16z" pathLength="1" className={estilos.trazo} />
        <path d="m16 32 32 24 32-24" pathLength="1" className={estilos.trazo} />
        <path d="M16 70l24-20M80 70 56 50" pathLength="1" className={estilos.trazo} />
      </Lienzo>
    )
  }
  return (
    <Lienzo viewBox="0 0 96 96" className={className}>
      <path d="M14 46h16l14 14c4 4 10 4 14 0l6-6" pathLength="1" className={estilos.trazo} />
      <path d="M82 46H66L52 32c-4-4-10-4-14 0l-8 8" pathLength="1" className={estilos.trazo} />
      <path d="M38 62l8 8M46 56l8 8M54 50l8 8" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}
