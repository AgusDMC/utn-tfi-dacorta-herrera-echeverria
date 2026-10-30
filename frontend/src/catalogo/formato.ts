import type { Moneda, PublicacionDetalle } from './tipos.ts'

// Formatos argentinos: US$ 85.000 / $ 650.000 / 52,5 m²
const FORMATO_PRECIO: Record<Moneda, Intl.NumberFormat> = {
  DOLARES: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  PESOS: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }),
}

const FORMATO_NUMERO = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 })

export function formatearPrecio(valor: number, moneda: Moneda) {
  return FORMATO_PRECIO[moneda].format(valor)
}

// El mismo formato separado en símbolo de moneda y cifra, para darle a cada uno su estilo
export function partirPrecio(valor: number, moneda: Moneda) {
  const partes = FORMATO_PRECIO[moneda].formatToParts(valor)
  return {
    moneda: partes.find((parte) => parte.type === 'currency')?.value ?? '',
    cifra: partes
      .filter((parte) => parte.type === 'integer' || parte.type === 'group')
      .map((parte) => parte.value)
      .join(''),
  }
}

// Solo la cifra (sin la unidad), para la franja de datos clave
export function formatearMetros(metros: number) {
  return FORMATO_NUMERO.format(metros)
}

export function formatearSuperficie(metros: number) {
  return `${FORMATO_NUMERO.format(metros)} m²`
}

// Años desde la construcción; null si el año no se conoce
export function calcularAntiguedad(anioConstruccion: number | null) {
  return anioConstruccion === null ? null : Math.max(0, new Date().getFullYear() - anioConstruccion)
}

// Lo que tiene la propiedad y no aparece en la franja de cifras (que ya cubre ambientes,
// dormitorios, baños, superficie y antigüedad)
export function listarCaracteristicas({ tienePatio }: PublicacionDetalle) {
  return tienePatio ? ['Con patio'] : []
}
