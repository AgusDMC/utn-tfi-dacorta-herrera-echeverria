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

// Una casa contemporánea de dos volúmenes con un ciprés: la entrada a "Comprar"
export function IlustracionCasa(props: Props) {
  return (
    <Lienzo viewBox="0 0 240 180" {...props}>
      <path d="M16 150h208" pathLength="1" className={estilos.trazo} />
      <path d="M40 150V62M118 150V44M34 63.4 124 42.6" pathLength="1" className={estilos.trazo} />
      <path d="M118 92h82M118 97h78M196 97v53" pathLength="1" className={estilos.trazo} />
      <path d="M54 76h20v32H54zM64 76v32" pathLength="1" className={estilos.trazo} />
      <path d="M88 150v-38h18v38M101 130v5" pathLength="1" className={estilos.trazo} />
      <path d="M132 112h50v22h-50zM148.7 112v22M165.3 112v22" pathLength="1" className={estilos.trazo} />
      <path d="M216 150v-22M216 128c-5.5 0-7.5-8-6.5-19 1-12 3.5-25 6.5-35 3 9 6 22 7 34 1 12-1.5 20-7 20" pathLength="1" className={estilos.trazo} />
    </Lienzo>
  )
}

// Un edificio de departamentos con balcones, núcleo de escalera y una llave: la entrada a "Alquilar"
export function IlustracionEdificio(props: Props) {
  return (
    <Lienzo viewBox="0 0 240 180" {...props}>
      <path d="M16 150h208" pathLength="1" className={estilos.trazo} />
      <path d="M58 150V36h92v114M54 36h96" pathLength="1" className={estilos.trazo} />
      <path d="M150 36V24h22v126M161 34v14M161 62v14M161 90v14" pathLength="1" className={estilos.trazo} />
      <path d="M68 42h16v22H68zM68 70h16v22H68zM68 98h16v22H68z" pathLength="1" className={estilos.trazo} />
      <path d="M108 56V42h28v14M108 84V70h28v14M108 112V98h28v14" pathLength="1" className={estilos.trazo} />
      <path d="M100 56h44v8h-44zM100 84h44v8h-44zM100 112h44v8h-44z" pathLength="1" className={estilos.trazo} />
      <path d="M98 130h34M104 150v-20M124 150v-20M68 132h18v10H68z" pathLength="1" className={estilos.trazo} />
      <circle cx="198" cy="128" r="6" pathLength="1" className={estilos.trazo} />
      <path d="M204 128h18M218 128v5M213 128v4" pathLength="1" className={estilos.trazo} />
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
