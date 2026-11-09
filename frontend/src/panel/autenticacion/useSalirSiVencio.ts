import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { cerrarSesion } from './sesion.ts'

// Ante un 401 de una ruta privada (token vencido o inválido) cierra la sesión y vuelve al login
// con el aviso correspondiente. Devuelve true si se ocupó del error.
// La función devuelta es siempre la misma: las pantallas la usan en efectos de carga y no
// deben volver a pedir datos porque el router renueve `navigate`.
export function useSalirSiVencio() {
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  return useCallback((error: unknown) => {
    if (!(error instanceof ErrorApi) || error.estado !== 401) return false
    cerrarSesion()
    navigateRef.current('/admin/login', { replace: true, state: { sesionVencida: true } })
    return true
  }, [])
}
