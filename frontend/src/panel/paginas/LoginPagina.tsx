import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import Marca from '../../compartido/componentes/Marca.tsx'
import { iniciarSesion } from '../autenticacion/login.ts'
import { haySesion } from '../autenticacion/sesion.ts'
import estilos from './LoginPagina.module.css'

type Errores = Partial<Record<'email' | 'clave', string>>

// El panel navega hasta acá con uno de estos estados: al cerrar la sesión o cuando venció
function avisoDeLlegada(estado: unknown) {
  if (typeof estado !== 'object' || estado === null) return null
  if ('sesionVencida' in estado) return 'Tu sesión venció. Iniciá sesión nuevamente.'
  if ('sesionCerrada' in estado) return 'Cerraste la sesión.'
  return null
}

export default function LoginPagina() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState<Errores>({})
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const aviso = avisoDeLlegada(state)

  // Al llegar desde el panel el foco queda en el email, listo para volver a entrar
  useEffect(() => {
    if (aviso) emailRef.current?.focus()
  }, [aviso])

  // El error del envío recibe el foco: el botón estuvo deshabilitado y lo había perdido
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  if (haySesion()) return <Navigate to="/admin" replace />

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (enviando) return

    const formulario = evento.currentTarget
    const datos = new FormData(formulario)
    const email = String(datos.get('email') ?? '').trim()
    const clave = String(datos.get('clave') ?? '') // la contraseña se envía tal cual
    const campoEmail = formulario.elements.namedItem('email')

    const nuevos: Errores = {}
    if (!email) nuevos.email = 'Ingresá tu email.'
    else if (campoEmail instanceof HTMLInputElement && !campoEmail.validity.valid) nuevos.email = 'El email no tiene un formato válido.'
    if (!clave.trim()) nuevos.clave = 'Ingresá tu contraseña.'

    // Se actualiza el DOM antes de mover el foco, para que el lector de pantalla lea el aviso
    flushSync(() => {
      setErrores(nuevos)
      setError(null)
    })
    if (Object.keys(nuevos).length > 0) {
      formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setEnviando(true)
    try {
      await iniciarSesion(email, clave)
      navigate('/admin', { replace: true })
    } catch (excepcion) {
      const credencialesInvalidas = excepcion instanceof ErrorApi && excepcion.estado === 401
      setError(credencialesInvalidas ? 'Email o clave incorrectos.' : 'No pudimos iniciar sesión. Probá nuevamente.')
      setEnviando(false)
    }
  }

  function alEscribir(evento: FormEvent<HTMLFormElement>) {
    const { name } = evento.target as HTMLInputElement
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  return (
    <main className={estilos.pagina}>
      <title>{tituloPagina('Acceso administración')}</title>
      <meta name="robots" content="noindex, nofollow" />

      <div className={estilos.tarjeta}>
        <Marca />

        <h1 className={estilos.titulo}>Acceso administración</h1>
        <p className={estilos.texto}>Ingresá con tu cuenta de administrador.</p>

        {aviso && !error && (
          <p role="status" className={estilos.estado}>
            {aviso}
          </p>
        )}

        <form className={estilos.formulario} noValidate onSubmit={alEnviar} onInput={alEscribir}>
          <div className={estilos.campo}>
            <label htmlFor="login-email" className={estilos.etiqueta}>
              Email
            </label>
            <input
              ref={emailRef}
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={120}
              required
              className={estilos.control}
              aria-invalid={Boolean(errores.email) || undefined}
              aria-describedby={errores.email ? 'login-email-error' : undefined}
            />
            {errores.email && (
              <p id="login-email-error" className={estilos.aviso}>
                {errores.email}
              </p>
            )}
          </div>

          <div className={estilos.campo}>
            <label htmlFor="login-clave" className={estilos.etiqueta}>
              Contraseña
            </label>
            <input
              id="login-clave"
              name="clave"
              type="password"
              autoComplete="current-password"
              required
              className={estilos.control}
              aria-invalid={Boolean(errores.clave) || undefined}
              aria-describedby={errores.clave ? 'login-clave-error' : undefined}
            />
            {errores.clave && (
              <p id="login-clave-error" className={estilos.aviso}>
                {errores.clave}
              </p>
            )}
          </div>

          {error && (
            <div ref={errorRef} tabIndex={-1} className={estilos.error}>
              {error}
            </div>
          )}

          <button type="submit" className={`boton boton-primario ${estilos.ingresar}`} disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
          <p className="sr-only" aria-live="polite">
            {enviando ? 'Ingresando…' : ''}
          </p>
        </form>

        <Link to="/" className={estilos.volver}>
          Volver al sitio
        </Link>
      </div>
    </main>
  )
}
