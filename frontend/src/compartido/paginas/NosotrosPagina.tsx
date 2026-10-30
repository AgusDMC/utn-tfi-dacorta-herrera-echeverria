import { Link } from 'react-router'
import { NOMBRE_INMOBILIARIA, tituloPagina } from '../../config.ts'
import { buscarPublicaciones, obtenerLocalidades } from '../../catalogo/catalogo.ts'
import { urlCatalogo } from '../../catalogo/filtros.ts'
import { ETIQUETA_TIPO_PLURAL, TIPOS_PROPIEDAD } from '../../catalogo/tipos.ts'
import BandaContacto from '../../catalogo/secciones/BandaContacto.tsx'
import { IconoCartel, IconoMensaje, IconoTipo, IconoUbicacion } from '../Iconos.tsx'
import { IlustracionBarrio } from '../Ilustraciones.tsx'
import iconos from '../Iconos.module.css'
import estilos from './Institucional.module.css'

const VALORES = [
  {
    icono: <IconoCartel />,
    titulo: 'Publicamos con datos claros',
    texto: 'Cada propiedad tiene su precio, sus expensas si las hay, sus medidas y sus fotos. Sin letra chica.',
  },
  {
    icono: <IconoMensaje />,
    titulo: 'Respondemos cada consulta',
    texto: 'Desde la ficha de una propiedad nos dejás tu consulta y nos comunicamos con vos por el medio que elijas.',
  },
  {
    icono: <IconoUbicacion />,
    titulo: 'Conocemos la zona',
    texto: 'Trabajamos en Santa Rosa y alrededores, con propiedades que vimos y podemos mostrarte.',
  },
]

export default function NosotrosPagina() {
  const localidades = obtenerLocalidades().map((localidad) => ({
    localidad,
    cantidad: buscarPublicaciones({ localidad }).length,
  }))
  const tipos = TIPOS_PROPIEDAD.map((tipo) => ({ tipo, cantidad: buscarPublicaciones({ tipo }).length })).filter(
    ({ cantidad }) => cantidad > 0,
  )

  return (
    <>
      <section className={`contenedor ${estilos.pagina}`}>
        <title>{tituloPagina('Nosotros')}</title>

        <div className={estilos.portada}>
          <div>
            <h1 className={estilos.titulo}>Nosotros</h1>
            <p className={estilos.entrada}>
              {NOMBRE_INMOBILIARIA} es una inmobiliaria dedicada a la venta y el alquiler de casas, departamentos, PH
              y dúplex.
            </p>
          </div>
          <span className={estilos.dibujo}>
            <IlustracionBarrio />
          </span>
        </div>

        <ul role="list" className={`aparece ${estilos.valores}`}>
          {VALORES.map(({ icono, titulo, texto }) => (
            <li key={titulo} className={estilos.valor}>
              <span className={iconos.redondel}>{icono}</span>
              <h2>{titulo}</h2>
              <p>{texto}</p>
            </li>
          ))}
        </ul>

        <div className={`aparece ${estilos.listas}`}>
          <section className={estilos.bloque}>
            <h2>Dónde trabajamos</h2>
            <ul role="list" className={estilos.lista}>
              {localidades.map(({ localidad, cantidad }) => (
                <li key={localidad}>
                  <Link to={urlCatalogo({ localidad })} className={estilos.fila}>
                    <span className={iconos.redondel}>
                      <IconoUbicacion />
                    </span>
                    <span className={estilos.filaNombre}>{localidad}</span>
                    <span className={`numeros ${estilos.filaTotal}`}>
                      {cantidad} {cantidad === 1 ? 'propiedad' : 'propiedades'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className={estilos.bloque}>
            <h2>Qué ofrecemos</h2>
            <ul role="list" className={estilos.lista}>
              {tipos.map(({ tipo, cantidad }) => (
                <li key={tipo}>
                  <Link to={urlCatalogo({ tipo })} className={estilos.fila}>
                    <span className={iconos.redondel}>
                      <IconoTipo tipo={tipo} />
                    </span>
                    <span className={estilos.filaNombre}>{ETIQUETA_TIPO_PLURAL[tipo]}</span>
                    <span className={`numeros ${estilos.filaTotal}`}>
                      {cantidad} {cantidad === 1 ? 'propiedad' : 'propiedades'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <BandaContacto />
    </>
  )
}
