import type { Moneda } from './tipos.ts'

// Formatos argentinos: US$ 85.000 / $ 650.000 / 52,5 m²
const FORMATO_PRECIO: Record<Moneda, Intl.NumberFormat> = {
  DOLARES: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  PESOS: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }),
}

const FORMATO_NUMERO = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 })

export function formatearPrecio(valor: number, moneda: Moneda) {
  return FORMATO_PRECIO[moneda].format(valor)
}

export function formatearSuperficie(metros: number) {
  return `${FORMATO_NUMERO.format(metros)} m²`
}
