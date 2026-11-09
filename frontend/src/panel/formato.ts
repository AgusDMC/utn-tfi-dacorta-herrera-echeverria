import { ETIQUETA_TIPO, type Moneda } from '../catalogo/tipos.ts'
import type { Propiedad } from './propiedades/tipos.ts'

// Fecha y hora en formato argentino, de 24 horas, en la zona horaria del navegador:
// "8 de nov de 2026, 18:35"
const FORMATO_FECHA = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short', hour12: false })

export function formatearFecha(instante: string) {
  return FORMATO_FECHA.format(new Date(instante))
}

// Importes con centavos si los tiene: "US$ 85.000", "$ 650.000,50". El catálogo público redondea
// a enteros; en el panel se muestra el valor exacto que se cargó.
const CODIGO_MONEDA: Record<Moneda, string> = { DOLARES: 'USD', PESOS: 'ARS' }

export function formatearImporte(valor: number, moneda: Moneda) {
  const decimales = Number.isInteger(valor) ? 0 : 2
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: CODIGO_MONEDA[moneda],
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}

// "Casa · Av. San Martín 1234 · Santa Rosa"; si la propiedad no está entre las activas, su número
export function describirPropiedad(propiedad: Propiedad | undefined, id: number) {
  return propiedad ? `${ETIQUETA_TIPO[propiedad.tipoPropiedad]} · ${propiedad.direccion} · ${propiedad.localidad}` : `Propiedad #${id}`
}

// "1 ambiente", "3 ambientes"
export function contar(cantidad: number, singular: string, plural: string) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}
