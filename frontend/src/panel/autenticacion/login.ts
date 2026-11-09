import { postJson } from '../../compartido/api/clienteApi.ts'
import { guardarSesion } from './sesion.ts'

// Respuesta de POST /api/auth/login (LoginResponse del backend)
interface RespuestaLogin {
  token: string
  tipoToken: string
  email: string
  rol: string
}

// Inicia sesión y la guarda. Con credenciales incorrectas el backend responde 401 (ErrorApi).
export async function iniciarSesion(email: string, clave: string) {
  const respuesta = await postJson('/api/auth/login', { email, clave })
  const { token, email: emailSesion, rol }: RespuestaLogin = await respuesta.json()
  guardarSesion({ token, email: emailSesion, rol })
}
