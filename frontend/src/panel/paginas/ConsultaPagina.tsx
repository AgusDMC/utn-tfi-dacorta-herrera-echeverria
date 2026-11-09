import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import CambioEstadoConsulta from '../componentes/CambioEstadoConsulta.tsx'
import EtiquetaEstado from '../componentes/EtiquetaEstado.tsx'
import { obtenerConsulta } from '../consultas/consultas.ts'
import type { Consulta } from '../consultas/tipos.ts'
import { formatearFecha } from '../formato.ts'
import estilos from './ConsultaPagina.module.css'

function VolverABandeja() {
  return (
    <Link to="/admin/consultas" className={estilos.volver}>
      Volver a consultas
    </Link>
  )
}

export default function ConsultaPagina() {
  const { id } = useParams()
  const idConsulta = id && /^\d+$/.test(id) ? Number(id) : null
  const [consulta, setConsulta] = useState<Consulta | null>(null)
  const [fallo, setFallo] = useState<'no-existe' | 'error' | null>(null)
  const [intento, setIntento] = useState(0)
  const salirSiVencio = useSalirSiVencio()

  useEffect(() => {
    if (idConsulta === null) return
    const control = new AbortController()
    obtenerConsulta(idConsulta, control.signal)
      .then((encontrada) => {
        if (!control.signal.aborted) setConsulta(encontrada)
      })
      .catch((error: unknown) => {
        if (control.signal.aborted || salirSiVencio(error)) return
        setFallo(error instanceof ErrorApi && error.estado === 404 ? 'no-existe' : 'error')
      })
    return () => control.abort()
  }, [idConsulta, intento, salirSiVencio])

  if (idConsulta === null || fallo === 'no-existe') {
    return (
      <div className={estilos.aviso}>
        <title>{tituloPagina('Consulta inexistente')}</title>
        <h1 className={estilos.titulo}>La consulta no existe.</h1>
        <VolverABandeja />
      </div>
    )
  }

  if (fallo === 'error') {
    return (
      <div role="alert" className={estilos.aviso}>
        <title>{tituloPagina('Consulta')}</title>
        <p>No pudimos cargar la consulta.</p>
        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => {
            setFallo(null)
            setIntento((n) => n + 1)
          }}
        >
          Reintentar
        </button>
        <VolverABandeja />
      </div>
    )
  }

  if (!consulta) {
    return (
      <>
        <title>{tituloPagina('Consulta')}</title>
        <p role="status" className={estilos.aviso}>
          Cargando la consulta…
        </p>
      </>
    )
  }

  const { nombre, apellido, email, telefono } = consulta

  return (
    <>
      <title>{tituloPagina(`Consulta de ${nombre} ${apellido}`)}</title>

      <VolverABandeja />

      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>
          {nombre} {apellido}
        </h1>
        <EtiquetaEstado estado={consulta.estado} />
      </div>

      <dl className={estilos.datos}>
        <div className={estilos.dato}>
          <dt>Publicación</dt>
          <dd>Publicación #{consulta.publicacionId}</dd>
        </div>
        {email && (
          <div className={estilos.dato}>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
        )}
        {telefono && (
          <div className={estilos.dato}>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`}>{telefono}</a>
            </dd>
          </div>
        )}
        <div className={estilos.dato}>
          <dt>Recibida</dt>
          <dd>
            <time dateTime={consulta.fechaCreacion}>{formatearFecha(consulta.fechaCreacion)}</time>
          </dd>
        </div>
        <div className={estilos.dato}>
          <dt>Última actualización</dt>
          <dd>
            <time dateTime={consulta.fechaUltActualizacion}>{formatearFecha(consulta.fechaUltActualizacion)}</time>
          </dd>
        </div>
      </dl>

      <section className={estilos.mensaje} aria-labelledby="titulo-mensaje">
        <h2 id="titulo-mensaje" className={estilos.subtitulo}>
          Mensaje
        </h2>
        <p className={estilos.texto}>{consulta.mensaje}</p>
      </section>

      <CambioEstadoConsulta consulta={consulta} onActualizada={setConsulta} />
    </>
  )
}
