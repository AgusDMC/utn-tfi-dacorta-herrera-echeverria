import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ETIQUETA_OPERACION } from '../../catalogo/tipos.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { IconoLapiz, IconoMas, IconoPapelera } from '../../compartido/componentes/Iconos.tsx'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import Aviso, { type Resultado } from '../componentes/Aviso.tsx'
import DialogoConfirmacion from '../componentes/DialogoConfirmacion.tsx'
import EtiquetaEstado from '../componentes/EtiquetaEstado.tsx'
import Paginacion from '../../compartido/componentes/Paginacion.tsx'
import { contar, describirPropiedad, formatearImporte } from '../formato.ts'
import { conPagina, leerPagina } from '../../compartido/paginacion.ts'
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
function avisoDeLlegada(estado: unknown): Resultado | null {
  if (typeof estado !== 'object' || estado === null || !('aviso' in estado)) return null
  return typeof estado.aviso === 'string' ? { texto: estado.aviso } : null
}

// Listado con historial, de a una página: el backend devuelve también las pausadas y las
// eliminadas. Todavía no filtra por estado, así que el filtro se aplica sobre la página que se
// está viendo y así se lo dice. Página y filtro van en la URL, como en Consultas.
export default function PublicacionesPagina() {
  const { state, pathname, search } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const salirSiVencio = useSalirSiVencio()
  const idFiltro = useId()
  const pagina = leerPagina(params)
  const [respuesta, setRespuesta] = useState<Pagina<Publicacion> | null>(null)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [falloEn, setFalloEn] = useState<number | null>(null) // la página que no se pudo cargar
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Resultado | null>(() => avisoDeLlegada(state))
  const [porDarDeBaja, setPorDarDeBaja] = useState<Publicacion | null>(null) // espera la confirmación
  const [enCurso, setEnCurso] = useState<number | null>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda acción
  const accionEnCursoRef = useRef(false)

  const valorFiltro = params.get('estado')
  const filtro = esEstadoPublicacion(valorFiltro) ? valorFiltro : null

  // Las propiedades activas solo sirven para nombrarlas, así que se piden una vez y no por página.
  // Si fallan se muestra "Propiedad #id"; un 401 igual cierra la sesión.
  useEffect(() => {
    const control = new AbortController()
    listarPropiedades(control.signal)
      .then((activas) => {
        if (!control.signal.aborted) setPropiedades(activas)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted) salirSiVencio(error)
      })
    return () => control.abort()
  }, [salirSiVencio])

  useEffect(() => {
    const control = new AbortController()
    listarPublicaciones(pagina, control.signal)
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

  // Página que ya no existe: se pasa a la última que sí existe
  const fueraDeRango = respuesta !== null && respuesta.page === pagina && pagina > 0 && respuesta.results.length === 0
  useEffect(() => {
    if (fueraDeRango && respuesta) setParams((actuales) => conPagina(actuales, Math.max(respuesta.totalPages - 1, 0)), { replace: true })
  }, [fueraDeRango, respuesta, setParams])

  // El aviso de llegada ya se leyó: se borra del historial para que no reaparezca al recargar
  useEffect(() => {
    if (state) navigate({ pathname, search }, { replace: true, state: null })
  }, [state, pathname, search, navigate])

  // El aviso recibe el foco: el botón que lo tenía quedó deshabilitado o desapareció
  useEffect(() => {
    if (aviso) avisoRef.current?.focus()
  }, [aviso])

  function reintentar() {
    setFalloEn(null)
    setIntento((n) => n + 1)
  }

  // Cambiar el filtro vuelve a la primera página
  function filtrar(valor: string) {
    setParams(valor ? { estado: valor, page: '0' } : { page: '0' }, { replace: true })
  }

  // El foco vuelve al título: el botón de la paginación queda abajo y la lista nueva arranca arriba
  function irAPagina(nueva: number) {
    setParams(conPagina(params, nueva))
    tituloRef.current?.focus()
  }

  // El listado se ordena por última actualización: una acción puede mover la publicación de página.
  // La fila cambia en el acto y después se vuelve a pedir la página para ver el orden real.
  function reemplazarYRecargar(actualizada: Publicacion) {
    setRespuesta((actual) => actual && { ...actual, results: actual.results.map((otra) => (otra.id === actualizada.id ? actualizada : otra)) })
    setIntento((n) => n + 1)
  }

  async function ejecutar(publicacion: Publicacion, accion: Accion) {
    setPorDarDeBaja(null)
    if (accionEnCursoRef.current) return
    accionEnCursoRef.current = true
    setEnCurso(publicacion.id)
    setAviso(null)
    try {
      if (accion === 'baja') {
        // El DELETE no devuelve la publicación: se refleja lo que hizo el backend, dejarla eliminada
        await darDeBajaPublicacion(publicacion.id)
        reemplazarYRecargar({ ...publicacion, estadoPublicacion: 'ELIMINADA' })
      } else {
        reemplazarYRecargar(await (accion === 'activar' ? activarPublicacion(publicacion.id) : pausarPublicacion(publicacion.id)))
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

  const cargada = respuesta && respuesta.page === pagina && !fueraDeRango ? respuesta : null
  const visibles = cargada ? cargada.results.filter((publicacion) => !filtro || publicacion.estadoPublicacion === filtro) : []

  return (
    <>
      <title>{tituloPagina('Publicaciones')}</title>

      <div className={estilos.cabecera}>
        <h1 ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
          Publicaciones
        </h1>
        <Link to="/admin/publicaciones/nueva" className="boton boton-primario">
          <IconoMas />
          Agregar publicación
        </Link>
      </div>

      {respuesta && respuesta.totalElements > 0 && (
        <div className={estilos.filtro}>
          <label htmlFor={idFiltro} className={estilos.etiqueta}>
            Estado en esta página
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
        <Aviso ref={avisoRef} error={aviso.error} className={estilos.resultado}>
          {aviso.texto}
        </Aviso>
      )}

      {falloEn === pagina ? (
        <div role="alert" className={estilos.estado}>
          <p>No pudimos cargar las publicaciones.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !cargada ? (
        <p role="status" className={estilos.estado}>
          Cargando publicaciones…
        </p>
      ) : cargada.totalElements === 0 ? (
        <p className={estilos.estado}>Todavía no hay publicaciones cargadas.</p>
      ) : (
        <>
          <p aria-live="polite" className={estilos.cantidad}>
            {!filtro
              ? contar(cargada.totalElements, 'publicación', 'publicaciones')
              : visibles.length === 0
                ? 'No hay publicaciones con este estado en esta página.'
                : `${contar(visibles.length, 'publicación', 'publicaciones')} con este estado en esta página`}
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
                        <Link to={{ pathname: `/admin/publicaciones/${id}/editar`, search }} className="boton boton-secundario">
                          <IconoLapiz />
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
                        <button type="button" className="boton boton-peligro" disabled={bloqueada} onClick={() => setPorDarDeBaja(publicacion)}>
                          <IconoPapelera />
                          Dar de baja<span className="sr-only"> {titulo}</span>
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          <Paginacion pagina={cargada} onCambiar={irAPagina} />
        </>
      )}

      {porDarDeBaja && (
        <DialogoConfirmacion
          titulo="¿Dar de baja esta publicación?"
          detalle={porDarDeBaja.titulo}
          textoConfirmar="Dar de baja"
          onConfirmar={() => ejecutar(porDarDeBaja, 'baja')}
          onCancelar={() => setPorDarDeBaja(null)}
        >
          Deja de mostrarse en el sitio y queda en el historial como eliminada. No se puede volver a activar.
        </DialogoConfirmacion>
      )}
    </>
  )
}
