import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { formatearSuperficie } from '../../catalogo/formato.ts'
import { ETIQUETA_TIPO } from '../../catalogo/tipos.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import Paginacion from '../../compartido/componentes/Paginacion.tsx'
import { contar } from '../formato.ts'
import { conPagina, leerPagina } from '../../compartido/paginacion.ts'
import { darDeBajaPropiedad, listarPaginaPropiedades } from '../propiedades/propiedades.ts'
import type { Propiedad } from '../propiedades/tipos.ts'
import estilos from './PropiedadesPagina.module.css'

interface Aviso {
  texto: string
  error?: boolean
}

// El formulario vuelve al listado con { aviso: 'Propiedad agregada.' } o similar
function avisoDeLlegada(estado: unknown): Aviso | null {
  if (typeof estado !== 'object' || estado === null || !('aviso' in estado)) return null
  return typeof estado.aviso === 'string' ? { texto: estado.aviso } : null
}

export default function PropiedadesPagina() {
  const { state, pathname, search } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const salirSiVencio = useSalirSiVencio()
  const pagina = leerPagina(params)
  const [respuesta, setRespuesta] = useState<Pagina<Propiedad> | null>(null)
  const [falloEn, setFalloEn] = useState<number | null>(null) // la página que no se pudo cargar
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Aviso | null>(() => avisoDeLlegada(state))
  const [dandoDeBaja, setDandoDeBaja] = useState<number | null>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda baja
  const bajaEnCursoRef = useRef(false)

  useEffect(() => {
    const control = new AbortController()
    listarPaginaPropiedades(pagina, control.signal)
      .then((recibida) => {
        if (control.signal.aborted) return
        setFalloEn(null)
        setRespuesta(recibida)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted && !salirSiVencio(error)) setFalloEn(pagina)
      })
    return () => control.abort()
  }, [pagina, intento, salirSiVencio])

  // Página que ya no existe (por ejemplo, después de dar de baja la única propiedad de la última
  // página): se pasa a la última que sí existe
  const fueraDeRango = respuesta !== null && respuesta.page === pagina && pagina > 0 && respuesta.results.length === 0
  useEffect(() => {
    if (fueraDeRango && respuesta) setParams((actuales) => conPagina(actuales, Math.max(respuesta.totalPages - 1, 0)), { replace: true })
  }, [fueraDeRango, respuesta, setParams])
  const cargada = respuesta && respuesta.page === pagina && !fueraDeRango ? respuesta : null

  // El aviso de llegada ya se leyó: se borra del historial para que no reaparezca al recargar
  useEffect(() => {
    if (state) navigate({ pathname, search }, { replace: true, state: null })
  }, [state, pathname, search, navigate])

  // El aviso recibe el foco: después de una baja, el botón que lo tenía ya no está
  useEffect(() => {
    if (aviso) avisoRef.current?.focus()
  }, [aviso])

  function reintentar() {
    setFalloEn(null)
    setIntento((n) => n + 1)
  }

  // El foco vuelve al título: el botón de la paginación queda abajo y la lista nueva arranca arriba
  function irAPagina(nueva: number) {
    setParams(conPagina(params, nueva))
    tituloRef.current?.focus()
  }

  // La fila se quita en el acto y la página se recarga para que el total y las páginas queden al día
  function quitarYRecargar(id: number) {
    setRespuesta((actual) => actual && { ...actual, results: actual.results.filter((otra) => otra.id !== id), totalElements: actual.totalElements - 1 })
    setIntento((n) => n + 1)
  }

  async function darDeBaja(propiedad: Propiedad) {
    if (bajaEnCursoRef.current) return
    if (!window.confirm(`¿Querés dar de baja esta propiedad?\n\n${propiedad.direccion}, ${propiedad.localidad}`)) return

    bajaEnCursoRef.current = true
    setDandoDeBaja(propiedad.id)
    setAviso(null)
    try {
      await darDeBajaPropiedad(propiedad.id)
      setAviso({ texto: 'Propiedad dada de baja.' })
      quitarYRecargar(propiedad.id)
    } catch (error) {
      if (salirSiVencio(error)) return
      if (error instanceof ErrorApi && error.estado === 404) {
        // Ya estaba inactiva (por ejemplo, desde otra pestaña): se deja de mostrar igual
        setAviso({ texto: 'La propiedad ya no estaba activa.' })
        quitarYRecargar(propiedad.id)
      } else {
        setAviso({ texto: 'No pudimos dar de baja la propiedad. Probá nuevamente.', error: true })
      }
    } finally {
      bajaEnCursoRef.current = false
      setDandoDeBaja(null)
    }
  }

  return (
    <>
      <title>{tituloPagina('Propiedades')}</title>

      <div className={estilos.cabecera}>
        <h1 ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
          Propiedades
        </h1>
        <Link to="/admin/propiedades/nueva" className="boton boton-primario">
          Agregar propiedad
        </Link>
      </div>

      {aviso && (
        <p ref={avisoRef} tabIndex={-1} className={estilos.resultado} data-error={aviso.error || undefined}>
          {aviso.texto}
        </p>
      )}

      {falloEn === pagina ? (
        <div role="alert" className={estilos.estado}>
          <p>No pudimos cargar las propiedades.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !cargada ? (
        <p role="status" className={estilos.estado}>
          Cargando propiedades…
        </p>
      ) : cargada.totalElements === 0 ? (
        <p className={estilos.estado}>Todavía no hay propiedades cargadas.</p>
      ) : (
        <>
          <p className={estilos.cantidad}>{contar(cargada.totalElements, 'propiedad', 'propiedades')}</p>
          <ul role="list" className={estilos.lista}>
            {cargada.results.map((propiedad) => {
              const lugar = `${propiedad.direccion}, ${propiedad.localidad}`
              return (
                <li key={propiedad.id} className={estilos.item}>
                  <div className={estilos.ubicacion}>
                    <p className={estilos.tipo}>{ETIQUETA_TIPO[propiedad.tipoPropiedad]}</p>
                    <p className={estilos.direccion}>{propiedad.direccion}</p>
                    <p className={estilos.localidad}>{propiedad.localidad}</p>
                  </div>
                  <p className={estilos.cifras}>
                    {contar(propiedad.cantAmbientes, 'ambiente', 'ambientes')} ·{' '}
                    {contar(propiedad.cantDormitorios, 'dormitorio', 'dormitorios')} ·{' '}
                    {formatearSuperficie(propiedad.superficieTotal)}
                  </p>
                  <div className={estilos.acciones}>
                    <Link to={{ pathname: `/admin/propiedades/${propiedad.id}/editar`, search }} className="boton boton-secundario">
                      Editar<span className="sr-only"> {lugar}</span>
                    </Link>
                    <button
                      type="button"
                      className={`boton ${estilos.baja}`}
                      disabled={dandoDeBaja !== null}
                      onClick={() => darDeBaja(propiedad)}
                    >
                      {dandoDeBaja === propiedad.id ? 'Dando de baja…' : 'Dar de baja'}
                      <span className="sr-only"> {lugar}</span>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
          <Paginacion pagina={cargada} onCambiar={irAPagina} />
        </>
      )}
    </>
  )
}
