import { Link } from 'react-router'
import { buscarPublicaciones } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import { ACCION_OPERACION, TIPOS_OPERACION, TIPOS_PROPIEDAD, type TipoPropiedad } from '../tipos.ts'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import estilos from './EntradasHome.module.css'

const PLURAL_TIPO: Record<TipoPropiedad, string> = {
  CASA: 'Casas',
  DEPARTAMENTO: 'Departamentos',
  PH: 'PH',
  DUPLEX: 'Dúplex',
}

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad' : 'propiedades'}`
}

// Entradas al catálogo desde la home: por operación (con la foto de una propiedad real) y por tipo.
// Las cantidades salen de las publicaciones visibles.
export default function EntradasHome() {
  const tipos = TIPOS_PROPIEDAD.map((tipo) => ({ tipo, cantidad: buscarPublicaciones({ tipo }).length })).filter(
    ({ cantidad }) => cantidad > 0,
  )

  return (
    <section className={`contenedor ${estilos.seccion}`} aria-labelledby="titulo-entradas">
      <CabeceraListado idTitulo="titulo-entradas" titulo="¿Qué estás buscando?" />

      <ul role="list" className={estilos.operaciones}>
        {TIPOS_OPERACION.map((operacion) => {
          const lista = buscarPublicaciones({ operacion })
          const portada = lista[0]?.portada

          return (
            <li key={operacion}>
              <Link to={urlCatalogo({ operacion })} className={estilos.entrada}>
                <span className={estilos.foto}>
                  {portada && <img src={portada.url} alt="" width={800} height={450} loading="lazy" decoding="async" />}
                </span>
                <span className={estilos.texto}>
                  <span className={estilos.nombre}>{ACCION_OPERACION[operacion]}</span>
                  <span className={estilos.cantidad}>{textoCantidad(lista.length)}</span>
                </span>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 10h12m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </li>
          )
        })}
      </ul>

      <ul role="list" className={estilos.tipos}>
        {tipos.map(({ tipo, cantidad }) => (
          <li key={tipo}>
            <Link to={urlCatalogo({ tipo })} className={estilos.tipo}>
              <span>{PLURAL_TIPO[tipo]}</span>
              <span className={`numeros ${estilos.total}`}>{cantidad}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
