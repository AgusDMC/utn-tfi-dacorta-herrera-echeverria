import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import FormularioPropiedad from '../componentes/FormularioPropiedad.tsx'
import { actualizarPropiedad, crearPropiedad, obtenerPropiedad } from '../propiedades/propiedades.ts'
import type { DatosPropiedad, Propiedad } from '../propiedades/tipos.ts'
import estilos from './PropiedadFormularioPagina.module.css'

const NO_EXISTE = 'La propiedad no existe o ya no está activa.'

function VolverAPropiedades() {
  return (
    <Link to="/admin/propiedades" className={estilos.volver}>
      Volver a propiedades
    </Link>
  )
}

// Alta (/admin/propiedades/nueva) y edición (/admin/propiedades/:id/editar) con el mismo formulario.
// El key reinicia la pantalla si cambia la propiedad sin desmontarse (por ejemplo, con Atrás).
export default function PropiedadFormularioPagina() {
  const { id } = useParams()
  return <EdicionOAlta key={id ?? 'nueva'} id={id} />
}

function EdicionOAlta({ id }: { id: string | undefined }) {
  const esEdicion = id !== undefined
  const idPropiedad = id && /^\d+$/.test(id) ? Number(id) : null
  const navigate = useNavigate()
  const salirSiVencio = useSalirSiVencio()
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null)
  const [falloCarga, setFalloCarga] = useState<'no-existe' | 'error' | null>(null)
  const [intento, setIntento] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto un segundo envío
  const guardandoRef = useRef(false)

  useEffect(() => {
    if (idPropiedad === null) return
    const control = new AbortController()
    obtenerPropiedad(idPropiedad, control.signal)
      .then((encontrada) => {
        if (!control.signal.aborted) setPropiedad(encontrada)
      })
      .catch((excepcion: unknown) => {
        if (control.signal.aborted || salirSiVencio(excepcion)) return
        setFalloCarga(excepcion instanceof ErrorApi && excepcion.estado === 404 ? 'no-existe' : 'error')
      })
    return () => control.abort()
  }, [idPropiedad, intento, salirSiVencio])

  async function guardar(datos: DatosPropiedad) {
    if (guardandoRef.current) return
    guardandoRef.current = true
    setGuardando(true)
    setError(null)
    try {
      if (idPropiedad === null) await crearPropiedad(datos)
      else await actualizarPropiedad(idPropiedad, datos)
      navigate('/admin/propiedades', { state: { aviso: esEdicion ? 'Propiedad actualizada.' : 'Propiedad agregada.' } })
    } catch (excepcion) {
      if (salirSiVencio(excepcion)) return
      const estado = excepcion instanceof ErrorApi ? excepcion.estado : null
      // Si se dio de baja mientras se editaba, reintentar no sirve: se muestra la pantalla de inexistente
      if (estado === 404) setFalloCarga('no-existe')
      else if (estado === 400) setError('Revisá los datos ingresados e intentá nuevamente.')
      else setError('No pudimos guardar la propiedad. Probá nuevamente.')
      guardandoRef.current = false
      setGuardando(false)
    }
  }

  const titulo = esEdicion ? 'Editar propiedad' : 'Agregar propiedad'

  if (esEdicion && (idPropiedad === null || falloCarga === 'no-existe')) {
    return (
      <div className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <h1 className={estilos.titulo}>{NO_EXISTE}</h1>
        <VolverAPropiedades />
      </div>
    )
  }

  if (falloCarga === 'error') {
    return (
      <div role="alert" className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <p>No pudimos cargar la propiedad.</p>
        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => {
            setFalloCarga(null)
            setIntento((n) => n + 1)
          }}
        >
          Reintentar
        </button>
        <VolverAPropiedades />
      </div>
    )
  }

  if (esEdicion && !propiedad) {
    return (
      <>
        <title>{tituloPagina(titulo)}</title>
        <p role="status" className={estilos.aviso}>
          Cargando la propiedad…
        </p>
      </>
    )
  }

  return (
    <>
      <title>{tituloPagina(titulo)}</title>
      <VolverAPropiedades />
      <h1 className={estilos.titulo}>{titulo}</h1>
      <FormularioPropiedad
        inicial={propiedad ?? undefined}
        textoBoton={esEdicion ? 'Guardar cambios' : 'Agregar propiedad'}
        guardando={guardando}
        error={error}
        onGuardar={guardar}
      />
    </>
  )
}
