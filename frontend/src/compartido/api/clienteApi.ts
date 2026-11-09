// Dirección del backend. En desarrollo queda vacía y Vite reenvía /api al backend (vite.config.ts);
// al desplegar se define con la variable de entorno VITE_API_URL.
const URL_API = import.meta.env.VITE_API_URL ?? ''

// Envía un cuerpo JSON por POST. Si la API no responde con éxito, lanza un error.
export async function postJson(ruta: string, cuerpo: unknown) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`)
  return respuesta
}
