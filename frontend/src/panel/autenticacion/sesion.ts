// Sesión del panel en sessionStorage: se borra al cerrar la pestaña.
// Sirve para la navegación del panel; quien autoriza de verdad es el backend, con el token.
const CLAVE = 'nexo.sesion'

export interface Sesion {
  token: string
  email: string
  rol: string
}

export function guardarSesion(sesion: Sesion) {
  sessionStorage.setItem(CLAVE, JSON.stringify(sesion))
}

// La sesión guardada, o null si no hay una o no tiene la forma esperada
export function obtenerSesion(): Sesion | null {
  try {
    const guardada = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null')
    const valida = typeof guardada?.token === 'string' && typeof guardada.email === 'string' && typeof guardada.rol === 'string'
    return valida ? { token: guardada.token, email: guardada.email, rol: guardada.rol } : null
  } catch {
    return null
  }
}

export function haySesion() {
  return obtenerSesion() !== null
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE)
}
