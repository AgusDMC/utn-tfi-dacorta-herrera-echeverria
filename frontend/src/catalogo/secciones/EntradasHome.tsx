import { Link } from 'react-router'
import { buscarPublicaciones } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import { ETIQUETA_TIPO_PLURAL, TIPOS_PROPIEDAD, type TipoOperacion } from '../tipos.ts'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import { IconoTipo } from '../../compartido/componentes/Iconos.tsx'
import { IlustracionCasa, IlustracionEdificio } from '../../compartido/componentes/Ilustraciones.tsx'
import iconos from '../../compartido/componentes/Iconos.module.css'
import estilos from './EntradasHome.module.css'

const ENTRADAS: { operacion: TipoOperacion; titulo: string; texto: string }[] = [
  { operacion: 'VENTA', titulo: 'Comprar', texto: 'Casas y departamentos en venta para mudarte o invertir.' },
  { operacion: 'ALQUILER', titulo: 'Alquilar', texto: 'Propiedades en alquiler, con el precio y las expensas claros.' },
]

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad' : 'propiedades'}`
}

// Entradas al catálogo desde la home: dos ilustraciones de línea (comprar y alquilar) y la lista
// de tipos con su ícono. Las cantidades salen de las publicaciones visibles.
export default function EntradasHome() {
  const tipos = TIPOS_PROPIEDAD.map((tipo) => ({ tipo, cantidad: buscarPublicaciones({ tipo }).length })).filter(
    ({ cantidad }) => cantidad > 0,
  )

  return (
    <section className={`contenedor aparece ${estilos.seccion}`} aria-labelledby="titulo-entradas">
      <CabeceraListado idTitulo="titulo-entradas" titulo="¿Qué estás buscando?" />

      <div className={estilos.cuerpo}>
        <ul role="list" className={estilos.operaciones}>
          {ENTRADAS.map(({ operacion, titulo, texto }) => (
            <li key={operacion}>
              <Link to={urlCatalogo({ operacion })} className={estilos.entrada}>
                <span className={estilos.dibujo}>
                  {operacion === 'VENTA' ? <IlustracionCasa /> : <IlustracionEdificio />}
                </span>
                <span className={estilos.texto}>
                  <span className={estilos.nombre}>{titulo}</span>
                  <span className={estilos.bajada}>{texto}</span>
                  <span className={estilos.cantidad}>
                    {textoCantidad(buscarPublicaciones({ operacion }).length)}
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 10h12m-6-6 6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <nav aria-labelledby="titulo-por-tipo" className={estilos.porTipo}>
          <h3 id="titulo-por-tipo" className={estilos.subtitulo}>
            Por tipo de propiedad
          </h3>
          <ul role="list" className={estilos.tipos}>
            {tipos.map(({ tipo, cantidad }) => (
              <li key={tipo}>
                <Link to={urlCatalogo({ tipo })} className={estilos.tipo}>
                  <span className={iconos.redondel}>
                    <IconoTipo tipo={tipo} />
                  </span>
                  <span className={estilos.tipoNombre}>{ETIQUETA_TIPO_PLURAL[tipo]}</span>
                  <span className={`numeros ${estilos.total}`}>{cantidad}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
