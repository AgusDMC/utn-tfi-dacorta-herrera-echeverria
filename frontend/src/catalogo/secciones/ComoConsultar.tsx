import CabeceraListado from '../componentes/CabeceraListado.tsx'
import { IlustracionPaso } from '../../compartido/componentes/Ilustraciones.tsx'
import estilos from './ComoConsultar.module.css'

const PASOS = [
  {
    titulo: 'Elegí una propiedad',
    texto: 'Recorré el catálogo y abrí la que te interese para ver sus fotos y sus datos.',
  },
  {
    titulo: 'Enviá tu consulta',
    texto: 'En la ficha de la propiedad dejanos tus datos y contanos qué querés saber.',
  },
  {
    titulo: 'Te respondemos',
    texto: 'Nos comunicamos con vos para darte más información sobre la propiedad.',
  },
] as const

// Los tres pasos de una consulta, numerados porque son una secuencia
export default function ComoConsultar() {
  return (
    <section className={`contenedor aparece ${estilos.seccion}`} aria-labelledby="titulo-como-consultar">
      <CabeceraListado idTitulo="titulo-como-consultar" titulo="Cómo consultar" />

      <ol role="list" className={estilos.pasos}>
        {PASOS.map(({ titulo, texto }, indice) => (
          <li key={titulo} className={estilos.paso}>
            <span className={estilos.dibujo}>
              <IlustracionPaso paso={(indice + 1) as 1 | 2 | 3} />
            </span>
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
