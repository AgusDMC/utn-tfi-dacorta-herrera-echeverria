import { useEffect, useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import EtiquetaEstado from '../componentes/EtiquetaEstado.tsx'
import { listarConsultas } from '../consultas/consultas.ts'
import { ESTADOS_CONSULTA, ETIQUETA_ESTADO, TONO_ESTADO, esEstadoConsulta, type Consulta } from '../consultas/tipos.ts'
import { formatearFecha } from '../formato.ts'
import estilos from './ConsultasPagina.module.css'

// Bandeja de consultas. Se piden todas una vez y el filtro por estado se aplica acá, porque el
// backend no filtra. El filtro va en la URL: al volver de una consulta sigue elegido.
export default function ConsultasPagina() {
  const [consultas, setConsultas] = useState<Consulta[] | null>(null)
  const [fallo, setFallo] = useState(false)
  const [intento, setIntento] = useState(0)
  const [params, setParams] = useSearchParams()
  const salirSiVencio = useSalirSiVencio()
  const idFiltro = useId()

  const valorFiltro = params.get('estado')
  const filtro = esEstadoConsulta(valorFiltro) ? valorFiltro : null

  useEffect(() => {
    const control = new AbortController()
    listarConsultas(control.signal)
      .then((lista) => {
        if (!control.signal.aborted) setConsultas(lista)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted && !salirSiVencio(error)) setFallo(true)
      })
    return () => control.abort()
  }, [intento, salirSiVencio])

  function reintentar() {
    setFallo(false)
    setIntento((n) => n + 1)
  }

  function filtrar(valor: string) {
    setParams(valor ? { estado: valor } : {}, { replace: true })
  }

  const todas = consultas ?? []
  const visibles = filtro ? todas.filter((consulta) => consulta.estado === filtro) : todas

  return (
    <>
      <title>{tituloPagina('Consultas')}</title>

      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Consultas</h1>

        {consultas && consultas.length > 0 && (
          <div className={estilos.filtro}>
            <label htmlFor={idFiltro} className={estilos.etiqueta}>
              Estado
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

      {fallo ? (
        <div role="alert" className={estilos.aviso}>
          <p>No pudimos cargar las consultas.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !consultas ? (
        <p role="status" className={estilos.aviso}>
          Cargando consultas…
        </p>
      ) : consultas.length === 0 ? (
        <p className={estilos.aviso}>Todavía no hay consultas recibidas.</p>
      ) : (
        <>
          <p aria-live="polite" className={estilos.cantidad}>
            {visibles.length === 0
              ? 'No hay consultas con este estado.'
              : `${visibles.length} ${visibles.length === 1 ? 'consulta' : 'consultas'}`}
          </p>

          {visibles.length > 0 && (
            <ul role="list" className={estilos.lista}>
              {visibles.map((consulta) => (
                <li key={consulta.id} className={estilos.item}>
                  {/* El enlace del nombre se extiende a toda la fila: una sola parada de tabulación */}
                  <Link to={`/admin/consultas/${consulta.id}`} className={estilos.persona}>
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
        </>
      )}
    </>
  )
}
