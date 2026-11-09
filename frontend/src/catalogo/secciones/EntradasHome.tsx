import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { listarPublicacionesCatalogo } from '../catalogo.ts'
import { urlCatalogo } from '../filtros.ts'
import { ETIQUETA_TIPO_PLURAL, TIPOS_OPERACION, TIPOS_PROPIEDAD, type TipoOperacion } from '../tipos.ts'
import CabeceraListado from '../componentes/CabeceraListado.tsx'
import { IconoTipo } from '../../compartido/componentes/Iconos.tsx'
import { IlustracionCasa, IlustracionEdificio } from '../../compartido/componentes/Ilustraciones.tsx'
import iconos from '../../compartido/componentes/Iconos.module.css'
import estilos from './EntradasHome.module.css'

const ENTRADAS: { operacion: TipoOperacion; titulo: string; texto: string }[] = [
  { operacion: 'VENTA', titulo: 'Propiedades en venta', texto: 'Opciones para vivir o invertir, con precio y características claras.' },
  { operacion: 'ALQUILER', titulo: 'Propiedades en alquiler', texto: 'Opciones con precio mensual, expensas y características claras.' },
]

function textoCantidad(cantidad: number) {
  return `${cantidad} ${cantidad === 1 ? 'propiedad' : 'propiedades'}`
}

// Entradas al catálogo desde la home: dos ilustraciones de línea (comprar y alquilar) y la lista
// de tipos con su ícono. La cantidad de cada operación es el total que informa el backend (una
// página de un elemento por operación); mientras no llega, el enlace dice "Ver propiedades".
// Los tipos van sin cantidad: contarlos pediría una consulta por tipo.
export default function EntradasHome() {
  const [cantidades, setCantidades] = useState<Partial<Record<TipoOperacion, number>>>({})

  useEffect(() => {
    let vigente = true
    for (const operacion of TIPOS_OPERACION) {
      listarPublicacionesCatalogo({ operacion }, 0, { tamano: 1, renovarError: true }).then((resultado) => {
        if (vigente && resultado.ok) setCantidades((actuales) => ({ ...actuales, [operacion]: resultado.datos.totalElements }))
      })
    }
    return () => {
      vigente = false
    }
  }, [])

  return (
    <section className={`contenedor aparece ${estilos.seccion}`} aria-labelledby="titulo-entradas">
      <CabeceraListado idTitulo="titulo-entradas" titulo="Propiedades para comprar o alquilar" />

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
                    {cantidades[operacion] === undefined ? 'Ver propiedades' : textoCantidad(cantidades[operacion])}
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
            {TIPOS_PROPIEDAD.map((tipo) => (
              <li key={tipo}>
                <Link to={urlCatalogo({ tipo })} className={estilos.tipo}>
                  <span className={iconos.redondel}>
                    <IconoTipo tipo={tipo} />
                  </span>
                  <span className={estilos.tipoNombre}>{ETIQUETA_TIPO_PLURAL[tipo]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
