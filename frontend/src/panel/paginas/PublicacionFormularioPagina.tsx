import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import FormularioPublicacion from '../componentes/FormularioPublicacion.tsx'
import { listarPropiedades } from '../propiedades/propiedades.ts'
import type { Propiedad } from '../propiedades/tipos.ts'
import { actualizarPublicacion, crearPublicacion, obtenerPublicacion } from '../publicaciones/publicaciones.ts'
import type { Publicacion, ValoresPublicacion } from '../publicaciones/tipos.ts'
import estilos from './PublicacionFormularioPagina.module.css'

const NO_EXISTE = 'La publicación no existe.'
const DUPLICADA = 'Ya existe una publicación activa para esta propiedad y operación.'

function VolverAPublicaciones() {
  return (
    <Link to="/admin/publicaciones" className={estilos.volver}>
      Volver a publicaciones
    </Link>
  )
}

// Alta (/admin/publicaciones/nueva) y edición (/admin/publicaciones/:id/editar) con el mismo formulario.
// El key reinicia la pantalla si cambia la publicación sin desmontarse (por ejemplo, con Atrás).
export default function PublicacionFormularioPagina() {
  const { id } = useParams()
  return <EdicionOAlta key={id ?? 'nueva'} id={id} />
}

function EdicionOAlta({ id }: { id: string | undefined }) {
  const esEdicion = id !== undefined
  const idPublicacion = id && /^\d+$/.test(id) ? Number(id) : null
  const navigate = useNavigate()
  const salirSiVencio = useSalirSiVencio()
  const [propiedades, setPropiedades] = useState<Propiedad[] | null>(null)
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null)
  const [falloCarga, setFalloCarga] = useState<'no-existe' | 'error' | null>(null)
  const [intento, setIntento] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto un segundo envío
  const guardandoRef = useRef(false)

  // Las propiedades activas sirven para elegir en el alta y para nombrar la propiedad en la edición.
  // En la edición no son imprescindibles: si fallan se sigue y la propiedad se muestra como
  // "Propiedad #id". Un 401 igual se propaga para cerrar la sesión.
  useEffect(() => {
    if (esEdicion && idPublicacion === null) return
    const control = new AbortController()
    const activas = listarPropiedades(control.signal)
    const propiedadesParaMostrar = esEdicion
      ? activas.catch((excepcion: unknown) => {
          if (excepcion instanceof ErrorApi && excepcion.estado === 401) throw excepcion
          return []
        })
      : activas
    Promise.all([propiedadesParaMostrar, idPublicacion === null ? null : obtenerPublicacion(idPublicacion, control.signal)])
      .then(([activas, encontrada]) => {
        if (control.signal.aborted) return
        setPropiedades(activas)
        setPublicacion(encontrada)
      })
      .catch((excepcion: unknown) => {
        if (control.signal.aborted || salirSiVencio(excepcion)) return
        setFalloCarga(excepcion instanceof ErrorApi && excepcion.estado === 404 ? 'no-existe' : 'error')
      })
    return () => control.abort()
  }, [esEdicion, idPublicacion, intento, salirSiVencio])

  async function guardar(valores: ValoresPublicacion) {
    if (guardandoRef.current) return
    guardandoRef.current = true
    setGuardando(true)
    setError(null)
    const { propiedadId, titulo, descripcion, tipoOperacion, precio, moneda, expensas, estadoComercial } = valores
    try {
      if (publicacion) {
        // El formulario exige el estado comercial en la edición: sin él no se envía nada
        if (!estadoComercial) throw new Error('Falta el estado comercial')
        await actualizarPublicacion(publicacion.id, { titulo, descripcion, tipoOperacion, precio, moneda, expensas, estadoComercial })
      } else {
        await crearPublicacion({ propiedadId, titulo, descripcion, tipoOperacion, precio, moneda, expensas })
      }
      navigate('/admin/publicaciones', { state: { aviso: publicacion ? 'Publicación actualizada.' : 'Publicación agregada.' } })
    } catch (excepcion) {
      if (salirSiVencio(excepcion)) return
      const estado = excepcion instanceof ErrorApi ? excepcion.estado : null
      // Los datos ya se validaron acá, así que un 400 es la regla R2: en el alta siempre, y en la
      // edición si la publicación está activa y se cambió la operación
      const posibleDuplicada = !publicacion || (publicacion.estadoPublicacion === 'ACTIVA' && publicacion.tipoOperacion !== tipoOperacion)
      if (estado === 404 && publicacion) setFalloCarga('no-existe')
      else if (estado === 404) setError('La propiedad elegida ya no está activa. Elegí otra.')
      else if (estado === 400) setError(posibleDuplicada ? DUPLICADA : 'Revisá los datos ingresados e intentá nuevamente.')
      else setError('No pudimos guardar la publicación. Probá nuevamente.')
      guardandoRef.current = false
      setGuardando(false)
    }
  }

  const titulo = esEdicion ? 'Editar publicación' : 'Agregar publicación'

  if (esEdicion && (idPublicacion === null || falloCarga === 'no-existe')) {
    return (
      <div className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <h1 className={estilos.titulo}>{NO_EXISTE}</h1>
        <VolverAPublicaciones />
      </div>
    )
  }

  if (falloCarga === 'error') {
    return (
      <div role="alert" className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <p>{esEdicion ? 'No pudimos cargar la publicación.' : 'No pudimos cargar las propiedades.'}</p>
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
        <VolverAPublicaciones />
      </div>
    )
  }

  if (!propiedades || (esEdicion && !publicacion)) {
    return (
      <>
        <title>{tituloPagina(titulo)}</title>
        <p role="status" className={estilos.aviso}>
          Cargando…
        </p>
      </>
    )
  }

  // R5: una publicación eliminada queda como historial, no se edita
  if (publicacion?.estadoPublicacion === 'ELIMINADA') {
    return (
      <div className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <h1 className={estilos.titulo}>Esta publicación fue eliminada y queda disponible solo como historial.</h1>
        <VolverAPublicaciones />
      </div>
    )
  }

  if (!esEdicion && propiedades.length === 0) {
    return (
      <div className={estilos.aviso}>
        <title>{tituloPagina(titulo)}</title>
        <h1 className={estilos.titulo}>Primero necesitás cargar una propiedad.</h1>
        <Link to="/admin/propiedades/nueva" className="boton boton-primario">
          Agregar propiedad
        </Link>
        <VolverAPublicaciones />
      </div>
    )
  }

  return (
    <>
      <title>{tituloPagina(titulo)}</title>
      <VolverAPublicaciones />
      <h1 className={estilos.titulo}>{titulo}</h1>
      <FormularioPublicacion
        propiedades={propiedades}
        inicial={publicacion ?? undefined}
        textoBoton={esEdicion ? 'Guardar cambios' : 'Agregar publicación'}
        guardando={guardando}
        error={error}
        onGuardar={guardar}
      />
    </>
  )
}
