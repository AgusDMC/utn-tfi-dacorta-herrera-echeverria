import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { enviarConsulta } from '../consultas.ts'
import estilos from './FormularioConsulta.module.css'

interface Props {
  publicacionId: number
}

type Estado = 'inicial' | 'enviando' | 'exito' | 'error'
type NombreCampo = 'nombre' | 'apellido' | 'email' | 'telefono' | 'mensaje'
type Errores = Partial<Record<NombreCampo | 'contacto', string>>

const ID_CONTACTO = 'consulta-contacto'
const AYUDA_CONTACTO = 'Completá al menos uno: correo o teléfono.'

// Al escribir en un campo se borra su aviso; el del contacto se comparte entre correo y teléfono
const AVISOS_QUE_BORRA: Partial<Record<NombreCampo, (NombreCampo | 'contacto')[]>> = {
  email: ['email', 'contacto'],
  telefono: ['contacto'],
}

function leer(datos: FormData, campo: NombreCampo) {
  const valor = datos.get(campo)
  return typeof valor === 'string' ? valor.trim() : ''
}

interface CampoProps {
  nombre: NombreCampo
  etiqueta: string
  maxLength: number
  tipo?: 'text' | 'email' | 'tel'
  multilinea?: boolean
  autoComplete?: string
  requerido?: boolean
  error?: string
  invalidoPorContacto?: boolean // el aviso está en el texto de ayuda del contacto
}

function Campo({
  nombre,
  etiqueta,
  maxLength,
  tipo = 'text',
  multilinea = false,
  autoComplete,
  requerido = false,
  error,
  invalidoPorContacto = false,
}: CampoProps) {
  const id = `consulta-${nombre}`
  const idError = `${id}-error`
  const esContacto = nombre === 'email' || nombre === 'telefono'
  const comunes = {
    id,
    name: nombre,
    maxLength,
    autoComplete,
    required: requerido,
    className: estilos.control,
    'aria-invalid': Boolean(error) || invalidoPorContacto || undefined,
    'aria-describedby': error ? idError : esContacto ? ID_CONTACTO : undefined,
  }

  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {etiqueta}
      </label>
      {multilinea ? <textarea {...comunes} rows={5} /> : <input {...comunes} type={tipo} />}
      {error && (
        <p id={idError} className={estilos.aviso}>
          {error}
        </p>
      )}
    </div>
  )
}

// Formulario de consulta de una publicación. Los largos máximos son los de ConsultaCreateDto.
// El backend es la validación definitiva: acá se revisa lo mismo para avisar enseguida y en español.
export default function FormularioConsulta({ publicacionId }: Props) {
  const [estado, setEstado] = useState<Estado>('inicial')
  const [errores, setErrores] = useState<Errores>({})
  const resultadoRef = useRef<HTMLDivElement>(null)

  // El resultado (éxito o error) recibe el foco: el botón queda deshabilitado mientras se envía
  // y, si el formulario se reemplaza, el foco se perdería
  useEffect(() => {
    if (estado === 'exito' || estado === 'error') resultadoRef.current?.focus()
  }, [estado])

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (estado === 'enviando') return

    const formulario = evento.currentTarget
    const datos = new FormData(formulario)
    const nombre = leer(datos, 'nombre')
    const apellido = leer(datos, 'apellido')
    const email = leer(datos, 'email')
    const telefono = leer(datos, 'telefono')
    const mensaje = leer(datos, 'mensaje')

    const campoEmail = formulario.elements.namedItem('email')
    const emailValido = !(campoEmail instanceof HTMLInputElement) || campoEmail.validity.valid

    const nuevos: Errores = {}
    if (!nombre) nuevos.nombre = 'Ingresá tu nombre.'
    if (!apellido) nuevos.apellido = 'Ingresá tu apellido.'
    if (!email && !telefono) nuevos.contacto = 'Dejanos un correo o un teléfono para poder responderte.'
    else if (email && !emailValido) nuevos.email = 'El correo no tiene un formato válido.'
    if (!mensaje) nuevos.mensaje = 'Escribí tu mensaje.'

    // Se actualiza el DOM antes de mover el foco, para que el lector de pantalla lea el aviso
    flushSync(() => setErrores(nuevos))
    if (Object.keys(nuevos).length > 0) {
      formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setEstado('enviando')
    try {
      await enviarConsulta({
        publicacionId,
        nombre,
        apellido,
        email: email || undefined,
        telefono: telefono || undefined,
        mensaje,
      })
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  function alEscribir(evento: FormEvent<HTMLFormElement>) {
    const { name } = evento.target as HTMLInputElement
    const borrar = AVISOS_QUE_BORRA[name as NombreCampo] ?? [name as NombreCampo]
    setErrores((actuales) => {
      const restantes = { ...actuales }
      for (const aviso of borrar) delete restantes[aviso]
      return restantes
    })
  }

  if (estado === 'exito') {
    return (
      <div ref={resultadoRef} tabIndex={-1} className={estilos.exito}>
        <p className={estilos.exitoTitulo}>Recibimos tu consulta.</p>
        <p className={estilos.exitoTexto}>Nos vamos a comunicar con vos.</p>
      </div>
    )
  }

  return (
    <form className={estilos.formulario} noValidate onSubmit={alEnviar} onInput={alEscribir}>
      <div className={estilos.fila}>
        <Campo nombre="nombre" etiqueta="Nombre" maxLength={80} autoComplete="given-name" requerido error={errores.nombre} />
        <Campo nombre="apellido" etiqueta="Apellido" maxLength={80} autoComplete="family-name" requerido error={errores.apellido} />
      </div>

      <div className={estilos.contacto}>
        <div className={estilos.fila}>
          <Campo
            nombre="email"
            etiqueta="Correo electrónico"
            tipo="email"
            maxLength={120}
            autoComplete="email"
            error={errores.email}
            invalidoPorContacto={Boolean(errores.contacto)}
          />
          <Campo
            nombre="telefono"
            etiqueta="Teléfono"
            tipo="tel"
            maxLength={30}
            autoComplete="tel"
            invalidoPorContacto={Boolean(errores.contacto)}
          />
        </div>
        <p id={ID_CONTACTO} className={errores.contacto ? estilos.aviso : estilos.ayuda}>
          {errores.contacto ?? AYUDA_CONTACTO}
        </p>
      </div>

      <Campo nombre="mensaje" etiqueta="Mensaje" maxLength={2000} multilinea requerido error={errores.mensaje} />

      {estado === 'error' && (
        <div ref={resultadoRef} tabIndex={-1} className={estilos.fallo}>
          No pudimos enviar la consulta. Probá nuevamente.
        </div>
      )}

      <button type="submit" className={`boton ${estilos.enviar}`} disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : 'Enviar consulta'}
      </button>
    </form>
  )
}
