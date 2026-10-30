import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router'
import { pideEnfocarResultados } from '../filtros.ts'
import type { PublicacionCatalogo } from '../tipos.ts'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import CarruselPublicaciones from '../componentes/CarruselPublicaciones.tsx'
import TarjetaPublicacion from '../componentes/TarjetaPublicacion.tsx'
import estilos from './PropiedadesCatalogo.module.css'

interface Props {
  publicaciones: PublicacionCatalogo[]
  filtrado: boolean
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
}

// La entrada al llegar a la sección solo se usa si el navegador la soporta
// y el sistema no pide movimiento reducido
function puedeAnimarAparicion() {
  return 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// pendiente: la sección espera en su estado inicial; lista: la coreografía de entrada corre
// (las animaciones están en los CSS de cada pieza, atadas a este atributo).
type Entrada = 'pendiente' | 'lista'

// Lo que dura la coreografía más larga (retraso incluido); pasado ese tiempo el atributo
// se retira, así lo que se monte después (otra búsqueda) no vuelve a animarse
const DURACION_ENTRADA = 1600

// Listado del catálogo. La home es editorial (una propiedad protagonista y dos
// secundarias); los resultados filtrados son sistemáticos y su composición
// responde a la cantidad: ficha única, par o grilla/carrusel.
export default function PropiedadesCatalogo({ publicaciones, filtrado }: Props) {
  const seccionRef = useRef<HTMLElement>(null)
  // La coreografía de entrada corre una sola vez, cuando la sección llega a la pantalla
  // después de cargar la página
  const [entrada, setEntrada] = useState<Entrada | undefined>(() => (puedeAnimarAparicion() ? 'pendiente' : undefined))
  const { key, state } = useLocation()
  const tipoNavegacion = useNavigationType()

  useEffect(() => {
    const seccion = seccionRef.current
    if (entrada !== 'pendiente' || !seccion) return

    const observador = new IntersectionObserver(
      ([registro]) => {
        if (registro.isIntersecting) {
          setEntrada('lista')
          observador.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    observador.observe(seccion)
    return () => observador.disconnect()
  }, [entrada])

  useEffect(() => {
    if (entrada !== 'lista') return
    const temporizador = window.setTimeout(() => setEntrada(undefined), DURACION_ENTRADA)
    return () => window.clearTimeout(temporizador)
  }, [entrada])

  // Después de buscar, el foco pasa a los resultados. Solo en la navegación nueva:
  // al volver con Atrás o recargar (POP) el navegador restaura el scroll y no hay que pisarlo.
  useEffect(() => {
    if (tipoNavegacion === 'PUSH' && pideEnfocarResultados(state)) seccionRef.current?.focus()
  }, [key, state, tipoNavegacion])

  const cantidad = publicaciones.length
  let anuncio = ''
  if (filtrado) anuncio = cantidad > 0 ? textoCantidad(cantidad) : 'No encontramos propiedades con esos filtros'

  const detalleResultados = (
    <p>
      {textoCantidad(cantidad)}.{' '}
      <Link to="/" className={estilos.limpiar}>
        Limpiar filtros
      </Link>
    </p>
  )

  let contenido
  if (cantidad === 0) {
    contenido = (
      <div className={estilos.vacio}>
        <h2 id="titulo-resultados" className={estilos.vacioTitulo}>
          No encontramos propiedades con esos filtros
        </h2>
        <p className={estilos.vacioTexto}>Probá con otro tipo de propiedad u otra ubicación.</p>
        <Link to="/" className={`boton boton-secundario ${estilos.vacioAccion}`}>
          Ver todas las propiedades
        </Link>
      </div>
    )
  } else if (!filtrado) {
    // Home: la más reciente en grande, dos secundarias y, si hay más, un carrusel
    const [principal, ...resto] = publicaciones
    const secundarias = resto.slice(0, 2)
    const demas = resto.slice(2)
    contenido = (
      <>
        <CabeceraListado
          className={estilos.cabeceraEditorial}
          idTitulo="titulo-resultados"
          titulo="Propiedades recientes"
          detalle="Las publicaciones más nuevas, en venta y en alquiler."
        />
        <div className={estilos.editorial}>
          <div className={estilos.principal}>
            <TarjetaPublicacion publicacion={principal} variante="destacada" />
          </div>
          {secundarias.map((publicacion, indice) => (
            <div
              key={publicacion.id}
              className={estilos.secundaria}
              style={{ '--retraso': `${(indice + 1) * 90}ms` } as CSSProperties}
            >
              <TarjetaPublicacion publicacion={publicacion} variante="compacta" />
            </div>
          ))}
        </div>
        {demas.length > 0 && (
          <div className={estilos.mas}>
            <CarruselPublicaciones idTitulo="titulo-mas" titulo="Más propiedades" publicaciones={demas} />
          </div>
        )}
      </>
    )
  } else if (cantidad === 1) {
    contenido = (
      <>
        <CabeceraListado idTitulo="titulo-resultados" titulo="Resultado" detalle={detalleResultados} />
        <div className={estilos.unica}>
          <TarjetaPublicacion publicacion={publicaciones[0]} variante="ficha" />
        </div>
      </>
    )
  } else if (cantidad === 2) {
    contenido = (
      <>
        <CabeceraListado idTitulo="titulo-resultados" titulo="Resultados" detalle={detalleResultados} />
        <div className={estilos.par}>
          {publicaciones.map((publicacion) => (
            <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
          ))}
        </div>
      </>
    )
  } else {
    contenido = (
      <CarruselPublicaciones
        // Con resultados nuevos el carrusel se reinicia (vuelve al principio)
        key={publicaciones.map((publicacion) => publicacion.id).join('-')}
        idTitulo="titulo-resultados"
        titulo="Resultados"
        detalle={detalleResultados}
        publicaciones={publicaciones}
        modo="grilla"
      />
    )
  }

  return (
    <section
      ref={seccionRef}
      tabIndex={-1}
      className={`contenedor ${estilos.seccion} ${filtrado ? estilos.conFiltros : ''}`}
      data-entrada={entrada}
      aria-labelledby="titulo-resultados"
    >
      {/* Región que anuncia el resultado de cada búsqueda a los lectores de pantalla */}
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      {contenido}
    </section>
  )
}
