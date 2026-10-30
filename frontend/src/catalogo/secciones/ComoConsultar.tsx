import CabeceraListado from '../componentes/CabeceraListado.tsx'
import estilos from './ComoConsultar.module.css'

const PASOS = [
  {
    titulo: 'Elegí una propiedad',
    texto: 'Recorré el catálogo y abrí la que te interese para ver sus fotos y sus datos.',
  },
  {
    titulo: 'Enviá tu consulta',
    texto: 'Desde la ficha de la propiedad, dejá tu mensaje y tus datos de contacto.',
  },
  {
    titulo: 'Te respondemos',
    texto: 'Recibimos tu consulta y nos comunicamos con vos para coordinar los pasos a seguir.',
  },
]

// Los tres pasos del camino de una consulta: es una secuencia, por eso van numerados
export default function ComoConsultar() {
  return (
    <section className={`contenedor ${estilos.seccion}`} aria-labelledby="titulo-como-consultar">
      <CabeceraListado idTitulo="titulo-como-consultar" titulo="Cómo consultar" />

      <ol role="list" className={estilos.pasos}>
        {PASOS.map(({ titulo, texto }, indice) => (
          <li key={titulo} className={estilos.paso}>
            <span className={estilos.numero} aria-hidden="true">
              {indice + 1}
            </span>
            <h3 className={estilos.titulo}>{titulo}</h3>
            <p className={estilos.texto}>{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
