import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import type { Pagina } from '../../compartido/api/pagina.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import EtiquetaEstado from '../componentes/EtiquetaEstado.tsx'
import Paginacion from '../../compartido/componentes/Paginacion.tsx'
import { listarConsultas } from '../consultas/consultas.ts'
import { ESTADOS_CONSULTA, ETIQUETA_ESTADO, TONO_ESTADO, esEstadoConsulta, type Consulta } from '../consultas/tipos.ts'
import { contar, formatearFecha } from '../formato.ts'
import { conPagina, leerPagina } from '../../compartido/paginacion.ts'
import estilos from './ConsultasPagina.module.css'

// Bandeja de consultas, de a una página. El backend todavía no filtra por estado: el filtro se
// aplica sobre la página que se está viendo y así se lo dice. Página y filtro van en la URL.
export default function ConsultasPagina() {
  const { search } = useLocation()
  const [params, setParams] = useSearchParams()
  const salirSiVencio = useSalirSiVencio()
  const idFiltro = useId()
  const pagina = leerPagina(params)
  const [respuesta, setRespuesta] = useState<Pagina<Consulta> | null>(null)
  const [falloEn, setFalloEn] = useState<number | null>(null) // la página que no se pudo cargar
  const [intento, setIntento] = useState(0)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  const valorFiltro = params.get('estado')
  const filtro = esEstadoConsulta(valorFiltro) ? valorFiltro : null

  useEffect(() => {
    const control = new AbortController()
    listarConsultas(pagina, control.signal)
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

  const cargada = respuesta && respuesta.page === pagina && !fueraDeRango ? respuesta : null
  const visibles = cargada ? cargada.results.filter((consulta) => !filtro || consulta.estado === filtro) : []

  return (
    <>
      <title>{tituloPagina('Consultas')}</title>

      <div className={estilos.cabecera}>
        <h1 ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
          Consultas
        </h1>

        {respuesta && respuesta.totalElements > 0 && (
          <div className={estilos.filtro}>
            <label htmlFor={idFiltro} className={estilos.etiqueta}>
              Estado en esta página
            </label>
            <select id={idFiltro} value={filtro ?? ''} onChange={(evento) => filtrar(evento.target.value)} className={estilos.selector}>
              <option value="">Todas</option>
              {ESTADOS_CONSULTA.map((estado) => (
                <option key={estado} value={estado}>
                  {ETIQUETA_ESTADO[estado]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {falloEn === pagina ? (
        <div role="alert" className={estilos.aviso}>
          <p>No pudimos cargar las consultas.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !cargada ? (
        <p role="status" className={estilos.aviso}>
          Cargando consultas…
        </p>
      ) : cargada.totalElements === 0 ? (
        <p className={estilos.aviso}>Todavía no hay consultas recibidas.</p>
      ) : (
        <>
          <p aria-live="polite" className={estilos.cantidad}>
            {!filtro
              ? contar(cargada.totalElements, 'consulta', 'consultas')
              : visibles.length === 0
                ? 'No hay consultas con este estado en esta página.'
                : `${contar(visibles.length, 'consulta', 'consultas')} con este estado en esta página`}
          </p>

          {visibles.length > 0 && (
            <ul role="list" className={estilos.lista}>
              {visibles.map((consulta) => (
                <li key={consulta.id} className={estilos.item}>
                  {/* El enlace del nombre se extiende a toda la fila: una sola parada de tabulación */}
                  <Link to={{ pathname: `/admin/consultas/${consulta.id}`, search }} className={estilos.persona}>
                    {consulta.nombre} {consulta.apellido}
                  </Link>
                  <span className={estilos.publicacion}>Publicación #{consulta.publicacionId}</span>
                  <time dateTime={consulta.fechaCreacion} className={estilos.fecha}>
                    {formatearFecha(consulta.fechaCreacion)}
                  </time>
                  <span className={estilos.estado}>
                    <EtiquetaEstado texto={ETIQUETA_ESTADO[consulta.estado]} tono={TONO_ESTADO[consulta.estado]} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Paginacion pagina={cargada} onCambiar={irAPagina} />
        </>
      )}
    </>
  )
}
