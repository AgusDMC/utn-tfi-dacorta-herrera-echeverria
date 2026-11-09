// Dirección del backend. En desarrollo queda vacía y Vite reenvía /api al backend (vite.config.ts);
// al desplegar se define con la variable de entorno VITE_API_URL.
const URL_API = import.meta.env.VITE_API_URL ?? ''

// Respuesta HTTP sin éxito. `estado` es el código (401, 404, 500…) para decidir qué mostrar.
// Un fallo de red no llega a ser respuesta: fetch lanza su propio error.
export class ErrorApi extends Error {
  estado: number

  constructor(estado: number) {
    super(`La API respondió ${estado}`)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

// Envía un cuerpo JSON por POST. Si la API no responde con éxito, lanza un ErrorApi.
export async function postJson(ruta: string, cuerpo: unknown) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
  if (!respuesta.ok) throw new ErrorApi(respuesta.status)
  return respuesta
}
