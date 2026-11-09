import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router'
import { haySesion } from '../autenticacion/sesion.ts'

// Envuelve las rutas del panel: sin sesión no se renderiza nada privado y se va al login
export default function RutaProtegida() {
  const navigate = useNavigate()

  // Con Atrás, el navegador puede restaurar la página tal como estaba (bfcache) sin volver a
  // renderizarla: si la sesión se cerró mientras tanto, hay que salir del panel igual
  useEffect(() => {
    function alMostrar(evento: PageTransitionEvent) {
      if (evento.persisted && !haySesion()) navigate('/admin/login', { replace: true })
    }
    window.addEventListener('pageshow', alMostrar)
    return () => window.removeEventListener('pageshow', alMostrar)
  }, [navigate])

  return haySesion() ? <Outlet /> : <Navigate to="/admin/login" replace />
}
