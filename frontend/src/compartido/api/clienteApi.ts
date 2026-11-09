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

async function pedir(ruta: string, opciones: RequestInit) {
  const respuesta = await fetch(`${URL_API}${ruta}`, opciones)
  if (!respuesta.ok) throw new ErrorApi(respuesta.status)
  return respuesta
}

// Envía un cuerpo JSON por POST. Si la API no responde con éxito, lanza un ErrorApi.
export function postJson(ruta: string, cuerpo: unknown) {
  return pedir(ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
}

// GET autenticado de las rutas privadas. `senal` permite cancelarlo si la pantalla se desmonta.
export async function getJson<T>(ruta: string, token: string, senal?: AbortSignal): Promise<T> {
  const respuesta = await pedir(ruta, { headers: { Authorization: `Bearer ${token}` }, signal: senal })
  return respuesta.json()
}

export async function patchJson<T>(ruta: string, cuerpo: unknown, token: string): Promise<T> {
  const respuesta = await pedir(ruta, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(cuerpo),
  })
  return respuesta.json()
}
