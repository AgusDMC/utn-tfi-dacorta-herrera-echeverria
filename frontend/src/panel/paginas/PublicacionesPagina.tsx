import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ETIQUETA_OPERACION } from '../../catalogo/tipos.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import EtiquetaEstado from '../componentes/EtiquetaEstado.tsx'
import { describirPropiedad, formatearImporte } from '../formato.ts'
import { listarPropiedades } from '../propiedades/propiedades.ts'
import type { Propiedad } from '../propiedades/tipos.ts'
import { activarPublicacion, darDeBajaPublicacion, listarPublicaciones, pausarPublicacion } from '../publicaciones/publicaciones.ts'
import {
  ESTADOS_PUBLICACION,
  ETIQUETA_ESTADO_COMERCIAL,
  ETIQUETA_ESTADO_PUBLICACION,
  ETIQUETA_ESTADO_PUBLICACION_PLURAL,
  TONO_ESTADO_PUBLICACION,
  esEstadoPublicacion,
  type Publicacion,
} from '../publicaciones/tipos.ts'
import estilos from './PublicacionesPagina.module.css'

type Accion = 'activar' | 'pausar' | 'baja'

interface Aviso {
  texto: string
  error?: boolean
}

const ERROR_ACCION: Record<Accion, string> = {
  activar: 'No pudimos activar la publicación.',
  pausar: 'No pudimos pausar la publicación.',
  baja: 'No pudimos dar de baja la publicación.',
}

const RESULTADO_ACCION: Record<Accion, string> = {
  activar: 'Publicación activada.',
  pausar: 'Publicación pausada.',
  baja: 'Publicación dada de baja.',
}

// El formulario vuelve al listado con { aviso: 'Publicación agregada.' } o similar
function avisoDeLlegada(estado: unknown): Aviso | null {
  if (typeof estado !== 'object' || estado === null || !('aviso' in estado)) return null
  return typeof estado.aviso === 'string' ? { texto: estado.aviso } : null
}

// Listado con historial: el backend devuelve también las pausadas y las eliminadas, sin filtrar.
// El filtro por estado se aplica acá y va en la URL, como en Consultas.
export default function PublicacionesPagina() {
  const { state, pathname, search } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const salirSiVencio = useSalirSiVencio()
  const idFiltro = useId()
  const [publicaciones, setPublicaciones] = useState<Publicacion[] | null>(null)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [fallo, setFallo] = useState(false)
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Aviso | null>(() => avisoDeLlegada(state))
  const [enCurso, setEnCurso] = useState<number | null>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda acción
  const accionEnCursoRef = useRef(false)

  const valorFiltro = params.get('estado')
  const filtro = esEstadoPublicacion(valorFiltro) ? valorFiltro : null

  // Las propiedades activas solo sirven para nombrarlas: una sola request para todas
  useEffect(() => {
    const control = new AbortController()
    Promise.all([listarPublicaciones(control.signal), listarPropiedades(control.signal)])
      .then(([lista, activas]) => {
        if (control.signal.aborted) return
        setPropiedades(activas)
        setPublicaciones(lista)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted && !salirSiVencio(error)) setFallo(true)
      })
    return () => control.abort()
  }, [intento, salirSiVencio])

  // El aviso de llegada ya se leyó: se borra del historial para que no reaparezca al recargar
  useEffect(() => {
    if (state) navigate({ pathname, search }, { replace: true, state: null })
  }, [state, pathname, search, navigate])

  // El aviso recibe el foco: el botón que lo tenía quedó deshabilitado o desapareció
  useEffect(() => {
    if (aviso) avisoRef.current?.focus()
  }, [aviso])

  function reintentar() {
    setFallo(false)
    setIntento((n) => n + 1)
  }

  function filtrar(valor: string) {
    setParams(valor ? { estado: valor } : {}, { replace: true })
  }

  function reemplazar(actualizada: Publicacion) {
    setPublicaciones((actuales) => actuales?.map((otra) => (otra.id === actualizada.id ? actualizada : otra)) ?? null)
  }

  async function ejecutar(publicacion: Publicacion, accion: Accion) {
    if (accionEnCursoRef.current) return
    if (accion === 'baja' && !window.confirm(`¿Querés dar de baja esta publicación?\n\n${publicacion.titulo}`)) return

    accionEnCursoRef.current = true
    setEnCurso(publicacion.id)
    setAviso(null)
    try {
      if (accion === 'baja') {
        // El DELETE no devuelve la publicación: se refleja lo que hizo el backend, dejarla eliminada
        await darDeBajaPublicacion(publicacion.id)
        reemplazar({ ...publicacion, estadoPublicacion: 'ELIMINADA' })
      } else {
        reemplazar(await (accion === 'activar' ? activarPublicacion(publicacion.id) : pausarPublicacion(publicacion.id)))
      }
      setAviso({ texto: RESULTADO_ACCION[accion] })
    } catch (error) {
      if (salirSiVencio(error)) return
      const estado = error instanceof ErrorApi ? error.estado : null
      let texto = ERROR_ACCION[accion]
      if (estado === 404) texto = 'La publicación no existe.'
      // Al activar, un 400 es la regla R2 (la acción solo se ofrece para publicaciones pausadas)
      else if (estado === 400 && accion === 'activar') texto = 'Ya existe una publicación activa para esta propiedad y operación.'
      setAviso({ texto, error: true })
      // Un 400 o 404 puede venir de un cambio hecho en otra pestaña: se recarga para ver el estado real
      if (estado === 400 || estado === 404) setIntento((n) => n + 1)
    } finally {
      accionEnCursoRef.current = false
      setEnCurso(null)
    }
  }

  const todas = publicaciones ?? []
  const visibles = filtro ? todas.filter((publicacion) => publicacion.estadoPublicacion === filtro) : todas

  return (
    <>
      <title>{tituloPagina('Publicaciones')}</title>

      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Publicaciones</h1>
        <Link to="/admin/publicaciones/nueva" className="boton boton-primario">
          Agregar publicación
        </Link>
      </div>

      {publicaciones && publicaciones.length > 0 && (
        <div className={estilos.filtro}>
          <label htmlFor={idFiltro} className={estilos.etiqueta}>
            Estado
          </label>
          <select id={idFiltro} value={filtro ?? ''} onChange={(evento) => filtrar(evento.target.value)} className={estilos.selector}>
            <option value="">Todas</option>
            {ESTADOS_PUBLICACION.map((estado) => (
              <option key={estado} value={estado}>
                {ETIQUETA_ESTADO_PUBLICACION_PLURAL[estado]}
              </option>
            ))}
          </select>
        </div>
      )}

      {aviso && (
        <p ref={avisoRef} tabIndex={-1} className={estilos.resultado} data-error={aviso.error || undefined}>
          {aviso.texto}
        </p>
      )}

      {fallo ? (
        <div role="alert" className={estilos.estado}>
          <p>No pudimos cargar las publicaciones.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !publicaciones ? (
        <p role="status" className={estilos.estado}>
          Cargando publicaciones…
        </p>
      ) : publicaciones.length === 0 ? (
        <p className={estilos.estado}>Todavía no hay publicaciones cargadas.</p>
      ) : (
        <>
          <p aria-live="polite" className={estilos.cantidad}>
            {visibles.length === 0
              ? 'No hay publicaciones con este estado.'
              : `${visibles.length} ${visibles.length === 1 ? 'publicación' : 'publicaciones'}`}
          </p>

          {visibles.length > 0 && (
            <ul role="list" className={estilos.lista}>
              {visibles.map((publicacion) => {
                const { id, titulo, estadoPublicacion } = publicacion
                const eliminada = estadoPublicacion === 'ELIMINADA'
                const bloqueada = enCurso !== null
                return (
                  <li key={id} className={estilos.item} data-eliminada={eliminada || undefined}>
                    <div className={estilos.datos}>
                      <p className={estilos.nombre}>{titulo}</p>
                      <p className={estilos.detalle}>{describirPropiedad(propiedades.find((propiedad) => propiedad.id === publicacion.propiedadId), publicacion.propiedadId)}</p>
                      <p className={estilos.detalle}>
                        {ETIQUETA_OPERACION[publicacion.tipoOperacion]} · {formatearImporte(publicacion.precio, publicacion.moneda)}
                        {publicacion.expensas !== null && <> · Expensas: {formatearImporte(publicacion.expensas, 'PESOS')}</>}
                      </p>
                    </div>

                    <p className={estilos.etiquetas}>
                      <span className="sr-only">Estado de la publicación: </span>
                      <EtiquetaEstado texto={ETIQUETA_ESTADO_PUBLICACION[estadoPublicacion]} tono={TONO_ESTADO_PUBLICACION[estadoPublicacion]} />
                      <span className="sr-only">. Estado comercial: </span>
                      <EtiquetaEstado texto={ETIQUETA_ESTADO_COMERCIAL[publicacion.estadoComercial]} tono="final" />
                    </p>

                    {/* R5: una eliminada queda como historial, sin acciones */}
                    {!eliminada && (
                      <div className={estilos.acciones}>
                        <Link to={`/admin/publicaciones/${id}/editar`} className="boton boton-secundario">
                          Editar<span className="sr-only"> {titulo}</span>
                        </Link>
                        {estadoPublicacion === 'ACTIVA' && (
                          <button type="button" className="boton boton-secundario" disabled={bloqueada} onClick={() => ejecutar(publicacion, 'pausar')}>
                            {enCurso === id ? 'Pausando…' : 'Pausar'}
                            <span className="sr-only"> {titulo}</span>
                          </button>
                        )}
                        {estadoPublicacion === 'PAUSADA' && (
                          <button type="button" className="boton boton-secundario" disabled={bloqueada} onClick={() => ejecutar(publicacion, 'activar')}>
                            {enCurso === id ? 'Activando…' : 'Activar'}
                            <span className="sr-only"> {titulo}</span>
                          </button>
                        )}
                        <button type="button" className={`boton ${estilos.baja}`} disabled={bloqueada} onClick={() => ejecutar(publicacion, 'baja')}>
                          Dar de baja<span className="sr-only"> {titulo}</span>
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </>
  )
}
