import { use, useEffect, useRef, useState, useTransition, type CSSProperties, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { CONTACTO, tituloPagina } from '../../config.ts'
import { useDescripcionPagina } from '../../compartido/useDescripcionPagina.ts'
import Correo from '../../compartido/componentes/Correo.tsx'
import { listarPublicacionesCatalogo, obtenerPublicacionCatalogo } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import { listarCaracteristicas, partirPrecio, formatearPrecio } from '../formato.ts'
import { ETIQUETA_ESTADO, ETIQUETA_OPERACION, ETIQUETA_TIPO, type PublicacionCatalogo, type PublicacionDetalle } from '../tipos.ts'
import BarraConsulta from '../componentes/BarraConsulta.tsx'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import { CifrasPrincipales, ListaCaracteristicas } from '../componentes/FichaPropiedad.tsx'
import FormularioConsulta from '../componentes/FormularioConsulta.tsx'
import GaleriaPropiedad from '../componentes/GaleriaPropiedad.tsx'
import GrillaPublicaciones from '../componentes/GrillaPublicaciones.tsx'
import estilos from './DetallePagina.module.css'

function PropiedadNoEncontrada() {
  useDescripcionPagina('La propiedad que buscás no está disponible.')

  return (
    <section className={`contenedor ${estilos.noEncontrada}`}>
      <title>{tituloPagina('Propiedad no encontrada')}</title>
      <meta name="robots" content="noindex" />

      <h1 className={estilos.noEncontradaTitulo}>No encontramos esta propiedad</h1>
      <p className={estilos.noEncontradaTexto}>Puede que ya no esté publicada o que el enlace tenga un error.</p>
      <Link to={urlCatalogo({})} className="boton boton-primario">
        Volver al catálogo
      </Link>
    </section>
  )
}

function FichaConError({ onReintentar, reintentando }: { onReintentar: () => void; reintentando: boolean }) {
  return (
    <section role="alert" className={`contenedor ${estilos.noEncontrada}`}>
      <title>{tituloPagina('Propiedad')}</title>

      <h1 className={estilos.noEncontradaTitulo}>No pudimos cargar esta propiedad</h1>
      <p className={estilos.noEncontradaTexto}>Probá nuevamente en unos segundos.</p>
      <button type="button" className="boton boton-primario" disabled={reintentando} onClick={onReintentar}>
        {reintentando ? 'Reintentando…' : 'Reintentar'}
      </button>
    </section>
  )
}

// Desde este largo el título baja de tamaño para que entre en la columna de datos
const LARGO_TITULO_LARGO = 40

function movimientoReducido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Los elementos de la primera pantalla entran escalonados, después de la foto
function entrada(orden: number) {
  return { '--orden': orden } as CSSProperties
}

function Detalle({ publicacion }: { publicacion: PublicacionDetalle }) {
  const { titulo, tipoOperacion, localidad } = publicacion
  const ctaRef = useRef<HTMLButtonElement>(null)
  const ubicacion = useLocation()
  const navigate = useNavigate()
  const precio = partirPrecio(publicacion.precio, publicacion.moneda)
  const caracteristicas = listarCaracteristicas(publicacion)
  // El resumen abre la descripción, salvo que sea el mismo texto (o uno empiece con el otro)
  const resumenRepetido =
    publicacion.descripcion.startsWith(publicacion.resumen) || publicacion.resumen.startsWith(publicacion.descripcion)
  // Otras propiedades de la misma operación: una página chica de las más nuevas, sin esta
  const [otras, setOtras] = useState<PublicacionCatalogo[]>([])
  useEffect(() => {
    let vigente = true
    listarPublicacionesCatalogo({ operacion: tipoOperacion }, 0, { tamano: 4, renovarError: true }).then((resultado) => {
      if (vigente && resultado.ok) setOtras(resultado.datos.results.filter((otra) => otra.id !== publicacion.id).slice(0, 3))
    })
    return () => {
      vigente = false
    }
  }, [tipoOperacion, publicacion.id])

  const parrafos = publicacion.descripcion.split('\n\n')

  const { telefono, email } = CONTACTO
  const telefonoLimpio = telefono?.replace(/[^\d+]/g, '')
  // El correo ya sale con la propiedad en el asunto
  const correo = email && `mailto:${email}?subject=${encodeURIComponent(`Consulta por ${titulo}`)}`

  useDescripcionPagina(parrafos[0])

  // Con historial interno, Atrás conserva los filtros y el scroll del catálogo;
  // si se entró directo al enlace, el enlace lleva al catálogo de esta operación
  function volver(evento: MouseEvent<HTMLAnchorElement>) {
    const conModificador = evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey
    if (ubicacion.key === 'default' || conModificador || evento.button !== 0) return
    evento.preventDefault()
    navigate(-1)
  }

  function irAConsulta() {
    document.getElementById('consulta')?.scrollIntoView({ behavior: movimientoReducido() ? 'auto' : 'smooth' })
    document.getElementById('titulo-consulta')?.focus({ preventScroll: true })
  }

  return (
    <>
      <title>{tituloPagina(titulo)}</title>

      {/* data-directa: se entró por el enlace y no desde el catálogo, así que no hay transición
          de la foto y ella misma hace su movimiento de llegada */}
      <article className={estilos.pagina} data-directa={ubicacion.key === 'default' || undefined}>
        {/* Plano pino: decorativo; va primero para quedar detrás de todo */}
        <div className={estilos.plano} aria-hidden="true" />

        <Link to={urlCatalogo({ operacion: tipoOperacion })} className={estilos.volver} onClick={volver}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M16 10H4m6-6-6 6 6 6" />
          </svg>
          <span>
            Volver<span className={estilos.volverLargo}> al catálogo</span>
          </span>
        </Link>

        <div className={estilos.cabecera}>
          <p className={estilos.operacion}>
            {ETIQUETA_TIPO[publicacion.tipoPropiedad]} en {ETIQUETA_OPERACION[tipoOperacion].toLowerCase()}, {localidad}
            {publicacion.estadoComercial !== 'DISPONIBLE' && <span className={estilos.estado}>{ETIQUETA_ESTADO[publicacion.estadoComercial]}</span>}
          </p>
          <h1
            className={`${estilos.titulo} ${estilos.entra}`}
            style={entrada(0)}
            data-largo={titulo.length > LARGO_TITULO_LARGO || undefined}
          >
            {titulo}
          </h1>
        </div>

        {/* Datos clave: entre el título y el precio, sobre el plano */}
        <section className={estilos.cifras} aria-labelledby="titulo-datos">
          <h2 id="titulo-datos" className="sr-only">
            Datos principales
          </h2>
          <CifrasPrincipales publicacion={publicacion} />
        </section>

        <GaleriaPropiedad
          id={publicacion.id}
          titulo={titulo}
          imagenes={publicacion.imagenes}
        />

        <div className={estilos.reserva}>
          <p className={`precio ${estilos.precio} ${estilos.entra}`} style={entrada(1)}>
            <span className={estilos.moneda}>{precio.moneda}</span>
            <span>{precio.cifra}</span>
            {tipoOperacion === 'ALQUILER' && <span className={estilos.periodo}>por mes</span>}
          </p>
          {publicacion.expensas !== null && (
            <p className={`numeros ${estilos.expensas} ${estilos.entra}`} style={entrada(1)}>
              + {formatearPrecio(publicacion.expensas, 'PESOS')} de expensas
            </p>
          )}
          <button
            ref={ctaRef}
            type="button"
            className={`boton ${estilos.cta} ${estilos.entra}`}
            style={entrada(2)}
            onClick={irAConsulta}
          >
            Consultar por esta propiedad
          </button>
        </div>

        <section className={`${estilos.seccion} ${estilos.descripcion}`} aria-labelledby="titulo-descripcion">
          <CabeceraListado idTitulo="titulo-descripcion" titulo="Descripción" />
          <div className={estilos.cuerpo}>
            {!resumenRepetido && <p className={estilos.resumen}>{publicacion.resumen}</p>}
            {parrafos.map((parrafo) => (
              <p key={parrafo} className={estilos.texto}>
                {parrafo}
              </p>
            ))}
          </div>
        </section>

        {caracteristicas.length >= 2 && (
          <section className={`${estilos.seccion} ${estilos.caracteristicas}`} aria-labelledby="titulo-caracteristicas">
            <CabeceraListado idTitulo="titulo-caracteristicas" titulo="Características" />
            <div className={estilos.cuerpo}>
              <ListaCaracteristicas caracteristicas={caracteristicas} />
            </div>
          </section>
        )}

        {otras.length > 0 && (
          <section className={`${estilos.seccion} ${estilos.otras}`} aria-labelledby="titulo-otras">
            <CabeceraListado
              idTitulo="titulo-otras"
              titulo="Otras propiedades"
              detalle={
                <Link to={urlCatalogo({})} className={estilos.verTodas}>
                  Ver todas las propiedades
                </Link>
              }
            />
            <GrillaPublicaciones publicaciones={otras} />
          </section>
        )}

        <section id="consulta" className={estilos.consulta} aria-labelledby="titulo-consulta">
          <h2 id="titulo-consulta" tabIndex={-1} className={estilos.tituloSeccion}>
            Consultar por esta propiedad
          </h2>
          <div className={estilos.cuerpo}>
            <FormularioConsulta publicacionId={publicacion.id} />

            {/* El teléfono y el correo de la inmobiliaria, como alternativa al formulario */}
            {(telefono || correo) && (
              <div className={estilos.alternativa}>
                <p className={estilos.texto}>También podés comunicarte directamente.</p>
                <ul role="list" className={estilos.medios}>
                  {telefono && (
                    <li className={estilos.medio}>
                      <span className={estilos.medioEtiqueta}>Teléfono</span>
                      <a href={`tel:${telefonoLimpio}`} className={estilos.medioValor}>
                        {telefono}
                      </a>
                    </li>
                  )}
                  {email && (
                    <li className={estilos.medio}>
                      <span className={estilos.medioEtiqueta}>Correo electrónico</span>
                      <a href={correo} className={estilos.medioValor}>
                        <Correo direccion={email} />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </section>
      </article>

      <BarraConsulta publicacion={publicacion} ctaRef={ctaRef} onConsultar={irAConsulta} />
    </>
  )
}

// Espera la ficha (use + Suspense en LayoutPublico): desde el catálogo, la tarjeta queda hasta que
// llegan los datos y su foto viaja a la ficha
function FichaDesdeApi({ id }: { id: number }) {
  const [intento, setIntento] = useState(0)
  const [reintentando, iniciarReintento] = useTransition()
  const resultado = use(obtenerPublicacionCatalogo(id, { intento }))

  function reintentar() {
    iniciarReintento(() => setIntento((n) => n + 1))
  }

  if (resultado.ok) return <Detalle publicacion={resultado.datos} />
  return resultado.noExiste ? <PropiedadNoEncontrada /> : <FichaConError onReintentar={reintentar} reintentando={reintentando} />
}

// Ficha de una publicación: foto principal y datos sobre el plano pino, descripción, recorrido
// de fotos, otras propiedades y lugar para la consulta. Un id que no es un número no se pide.
export default function DetallePagina() {
  const { id } = useParams()
  return id && /^\d{1,15}$/.test(id) ? <FichaDesdeApi key={id} id={Number(id)} /> : <PropiedadNoEncontrada />
}
