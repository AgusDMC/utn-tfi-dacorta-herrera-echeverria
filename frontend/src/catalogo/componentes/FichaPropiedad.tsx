import type { ReactNode } from 'react'
import { calcularAntiguedad, formatearMetros } from '../formato.ts'
import type { PublicacionDetalle } from '../tipos.ts'
import estilos from './FichaPropiedad.module.css'

interface Props {
  publicacion: PublicacionDetalle
}

// Íconos propios de 24 px (trazo de 1,5 px, color de acento). Son decorativos: la cifra y su
// etiqueta ya dicen lo mismo.
function Icono({ children }: { children: ReactNode }) {
  return (
    <svg
      className={estilos.icono}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const ICONOS = {
  // Plano: un recinto con un tabique
  ambientes: (
    <Icono>
      <path d="M4 4h16v16H4zM4 11h7M11 11V4M14 20v-6h6" />
    </Icono>
  ),
  // Cama
  dormitorios: (
    <Icono>
      <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01" />
    </Icono>
  ),
  // Bañera
  banios: (
    <Icono>
      <path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 3.5-1.3M7 18l-1 2M17 18l1 2" />
    </Icono>
  ),
  // Cuadrado con sus medidas
  superficie: (
    <Icono>
      <path d="M5 5h14v14H5zM5 9h3M5 14h3M9 5v3M14 5v3" />
    </Icono>
  ),
  // Calendario
  antiguedad: (
    <Icono>
      <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
    </Icono>
  ),
}

function unidades(cantidad: number, singular: string, plural: string) {
  return cantidad === 1 ? singular : plural
}

// Franja de cifras principales: ícono, número en serif y etiqueta, separados por filetes.
// Solo lo que se conoce: sin año de construcción no hay antigüedad y la franja se reacomoda.
export function CifrasPrincipales({ publicacion }: Props) {
  const antiguedad = calcularAntiguedad(publicacion.anioConstruccion)
  const cifras = [
    {
      icono: ICONOS.ambientes,
      valor: String(publicacion.cantAmbientes),
      etiqueta: unidades(publicacion.cantAmbientes, 'Ambiente', 'Ambientes'),
    },
    {
      icono: ICONOS.dormitorios,
      valor: String(publicacion.cantDormitorios),
      etiqueta: unidades(publicacion.cantDormitorios, 'Dormitorio', 'Dormitorios'),
    },
    {
      icono: ICONOS.banios,
      valor: String(publicacion.cantBanios),
      etiqueta: unidades(publicacion.cantBanios, 'Baño', 'Baños'),
    },
    { icono: ICONOS.superficie, valor: formatearMetros(publicacion.superficieTotal), etiqueta: 'm² totales' },
    ...(antiguedad === null
      ? []
      : [
          {
            icono: ICONOS.antiguedad,
            valor: String(antiguedad),
            etiqueta: antiguedad === 0 ? 'A estrenar' : unidades(antiguedad, 'Año de antigüedad', 'Años de antigüedad'),
          },
        ]),
  ]

  return (
    <dl className={estilos.cifras}>
      {cifras.map(({ icono, valor, etiqueta }) => (
        <div key={etiqueta} className={estilos.cifra}>
          {icono}
          {/* La etiqueta va primero en el DOM (así se lee "Dormitorios: 2"); el CSS pone el número arriba */}
          <dt className={estilos.etiqueta}>{etiqueta}</dt>
          <dd className={estilos.valor}>{valor}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ListaCaracteristicas({ caracteristicas }: { caracteristicas: string[] }) {
  return (
    <ul className={estilos.caracteristicas}>
      {caracteristicas.map((caracteristica) => (
        <li key={caracteristica}>{caracteristica}</li>
      ))}
    </ul>
  )
}
