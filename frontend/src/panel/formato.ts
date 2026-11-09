// Fecha y hora en formato argentino, de 24 horas, en la zona horaria del navegador:
// "8 de nov de 2026, 18:35"
const FORMATO_FECHA = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short', hour12: false })

export function formatearFecha(instante: string) {
  return FORMATO_FECHA.format(new Date(instante))
}

// "1 ambiente", "3 ambientes"
export function contar(cantidad: number, singular: string, plural: string) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}
