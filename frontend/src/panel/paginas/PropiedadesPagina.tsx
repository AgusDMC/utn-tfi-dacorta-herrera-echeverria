import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { tituloPagina } from '../../config.ts'
import { formatearSuperficie } from '../../catalogo/formato.ts'
import { ETIQUETA_TIPO } from '../../catalogo/tipos.ts'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import { contar } from '../formato.ts'
import { darDeBajaPropiedad, listarPropiedades } from '../propiedades/propiedades.ts'
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
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const salirSiVencio = useSalirSiVencio()
  const [propiedades, setPropiedades] = useState<Propiedad[] | null>(null)
  const [fallo, setFallo] = useState(false)
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Aviso | null>(() => avisoDeLlegada(state))
  const [dandoDeBaja, setDandoDeBaja] = useState<number | null>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda baja
  const bajaEnCursoRef = useRef(false)

  useEffect(() => {
    const control = new AbortController()
    listarPropiedades(control.signal)
      .then((lista) => {
        if (!control.signal.aborted) setPropiedades(lista)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted && !salirSiVencio(error)) setFallo(true)
      })
    return () => control.abort()
  }, [intento, salirSiVencio])

  // El aviso de llegada ya se leyó: se borra del historial para que no reaparezca al recargar
  useEffect(() => {
    if (state) navigate(pathname, { replace: true, state: null })
  }, [state, pathname, navigate])

  // El aviso recibe el foco: después de una baja, el botón que lo tenía ya no está
  useEffect(() => {
    if (aviso) avisoRef.current?.focus()
  }, [aviso])

  function reintentar() {
    setFallo(false)
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
      setPropiedades((actuales) => actuales?.filter((otra) => otra.id !== propiedad.id) ?? null)
      setAviso({ texto: 'Propiedad dada de baja.' })
    } catch (error) {
      if (salirSiVencio(error)) return
      if (error instanceof ErrorApi && error.estado === 404) {
        // Ya estaba inactiva (por ejemplo, desde otra pestaña): se quita del listado igual
        setPropiedades((actuales) => actuales?.filter((otra) => otra.id !== propiedad.id) ?? null)
        setAviso({ texto: 'La propiedad ya no estaba activa.' })
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
        <h1 className={estilos.titulo}>Propiedades</h1>
        <Link to="/admin/propiedades/nueva" className="boton boton-primario">
          Agregar propiedad
        </Link>
      </div>

      {aviso && (
        <p ref={avisoRef} tabIndex={-1} className={estilos.resultado} data-error={aviso.error || undefined}>
          {aviso.texto}
        </p>
      )}

      {fallo ? (
        <div role="alert" className={estilos.estado}>
          <p>No pudimos cargar las propiedades.</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : !propiedades ? (
        <p role="status" className={estilos.estado}>
          Cargando propiedades…
        </p>
      ) : propiedades.length === 0 ? (
        <p className={estilos.estado}>Todavía no hay propiedades cargadas.</p>
      ) : (
        <ul role="list" className={estilos.lista}>
          {propiedades.map((propiedad) => {
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
                  <Link to={`/admin/propiedades/${propiedad.id}/editar`} className="boton boton-secundario">
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
      )}
    </>
  )
}
