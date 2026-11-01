import { calcularAntiguedad, formatearMetros } from '../formato.ts'
import type { PublicacionDetalle } from '../tipos.ts'
import estilos from './FichaPropiedad.module.css'

interface Props {
  publicacion: PublicacionDetalle
}

interface Cifra {
  valor: string
  etiqueta: string
  etiquetaOculta?: boolean // "A estrenar" ya se explica solo: la etiqueta queda para lectores de pantalla
}

function unidades(cantidad: number, singular: string, plural: string) {
  return cantidad === 1 ? singular : plural
}

// Cifras principales en dos líneas: los espacios (ambientes, dormitorios y baños) y las medidas
// (superficie y antigüedad). Solo lo que se conoce: sin año de construcción no hay antigüedad.
export function CifrasPrincipales({ publicacion }: Props) {
  const antiguedad = calcularAntiguedad(publicacion.anioConstruccion)
  const espacios: Cifra[] = [
    {
      valor: String(publicacion.cantAmbientes),
      etiqueta: unidades(publicacion.cantAmbientes, 'ambiente', 'ambientes'),
    },
    {
      valor: String(publicacion.cantDormitorios),
      etiqueta: unidades(publicacion.cantDormitorios, 'dormitorio', 'dormitorios'),
    },
    {
      valor: String(publicacion.cantBanios),
      etiqueta: unidades(publicacion.cantBanios, 'baño', 'baños'),
    },
  ]
  const medidas: Cifra[] = [{ valor: formatearMetros(publicacion.superficieTotal), etiqueta: 'm² totales' }]
  if (antiguedad === 0) {
    medidas.push({ valor: 'A estrenar', etiqueta: 'Antigüedad', etiquetaOculta: true })
  } else if (antiguedad !== null) {
    medidas.push({ valor: String(antiguedad), etiqueta: unidades(antiguedad, 'año de antigüedad', 'años de antigüedad') })
  }

  return (
    <div className={estilos.cifras}>
      {[espacios, medidas].map((linea, indice) => (
        <dl key={indice} className={estilos.linea}>
          {linea.map(({ valor, etiqueta, etiquetaOculta }) => (
            <div key={etiqueta} className={estilos.cifra}>
              {/* La etiqueta va primero en el DOM (así se lee "ambientes: 4"); el CSS pone el número adelante */}
              <dt className={etiquetaOculta ? 'sr-only' : estilos.etiqueta}>{etiqueta}</dt>
              <dd className={estilos.valor}>{valor}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
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
