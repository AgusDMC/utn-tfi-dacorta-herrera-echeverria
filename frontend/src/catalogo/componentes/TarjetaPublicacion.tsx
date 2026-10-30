import { ViewTransition } from 'react'
import { Link } from 'react-router'
import { formatearPrecio, formatearSuperficie } from '../formato.ts'
import { ETIQUETA_OPERACION, ETIQUETA_TIPO, type PublicacionCatalogo } from '../tipos.ts'
import estilos from './TarjetaPublicacion.module.css'

// destacada: protagonista de la home (foto grande con los datos pegados debajo)
// compacta:  secundaria de la home (fila foto + datos, en todos los anchos)
// ficha:     único resultado (foto y datos lado a lado desde tablet)
// Sin variante: tarjeta vertical común (pares y grilla de resultados)
export type VarianteTarjeta = 'destacada' | 'compacta' | 'ficha'

interface Props {
  publicacion: PublicacionCatalogo
  variante?: VarianteTarjeta
}

export default function TarjetaPublicacion({ publicacion, variante }: Props) {
  const { id, titulo, portada, cantAmbientes } = publicacion
  const operacion = ETIQUETA_OPERACION[publicacion.tipoOperacion].toLowerCase()

  return (
    <article className={`${estilos.tarjeta} ${variante ? estilos[variante] : ''}`}>
      {/* Al cambiar de estado (home ⇄ resultados) la foto de una misma propiedad viaja a su
          nueva posición en lugar de desaparecer y reaparecer */}
      <ViewTransition name={`foto-${id}`} enter="none" exit="none" update="none" share="foto-compartida">
        <div className={estilos.foto}>
          {portada ? (
            <img
              src={portada.url}
              alt={portada.descripcion ?? `Foto de ${titulo}`}
              width={800}
              height={600}
              loading={variante === 'ficha' ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : (
            <span className={estilos.sinFoto}>Sin fotografías</span>
          )}
          {publicacion.estadoComercial === 'RESERVADA' && <span className={estilos.estado}>Reservada</span>}
        </div>
      </ViewTransition>

      <div className={estilos.datos}>
        {/* El precio lidera: es lo primero que se mira en una propiedad */}
        <p className={`precio ${estilos.precio}`}>{formatearPrecio(publicacion.precio, publicacion.moneda)}</p>
        {publicacion.expensas !== null && (
          <p className={`numeros ${estilos.expensas}`}>
            + {formatearPrecio(publicacion.expensas, 'PESOS')} de expensas
          </p>
        )}

        {/* El enlace del título se extiende a toda la tarjeta: una sola parada de tabulación */}
        <h3 className={estilos.titulo}>
          <Link to={`/propiedades/${id}`} className={estilos.enlace}>
            {titulo}
          </Link>
        </h3>
        <p className={estilos.meta}>
          {ETIQUETA_TIPO[publicacion.tipoPropiedad]} en {operacion}, {publicacion.localidad}
        </p>

        <ul className={`numeros ${estilos.caracteristicas}`}>
          <li>
            {cantAmbientes} {cantAmbientes === 1 ? 'ambiente' : 'ambientes'}
          </li>
          <li>{formatearSuperficie(publicacion.superficieTotal)}</li>
        </ul>
      </div>
    </article>
  )
}
