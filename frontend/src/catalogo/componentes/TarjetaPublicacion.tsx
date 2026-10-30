import { Link } from 'react-router'
import { formatearPrecio, formatearSuperficie } from '../formato.ts'
import { ETIQUETA_OPERACION, ETIQUETA_TIPO, type PublicacionCatalogo } from '../tipos.ts'
import estilos from './TarjetaPublicacion.module.css'

interface Props {
  publicacion: PublicacionCatalogo
}

export default function TarjetaPublicacion({ publicacion }: Props) {
  const { id, titulo, portada, cantAmbientes } = publicacion

  return (
    <article className={estilos.tarjeta}>
      <div className={estilos.foto}>
        {portada ? (
          <img
            src={portada.url}
            alt={portada.descripcion ?? `Foto de ${titulo}`}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={estilos.sinFoto}>Sin fotografías</span>
        )}
        {publicacion.estadoComercial === 'RESERVADA' && <span className={estilos.estado}>Reservada</span>}
      </div>

      <p className={estilos.meta}>
        {ETIQUETA_OPERACION[publicacion.tipoOperacion]} · {ETIQUETA_TIPO[publicacion.tipoPropiedad]}
      </p>
      <p className={`numeros ${estilos.precio}`}>{formatearPrecio(publicacion.precio, publicacion.moneda)}</p>
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
      <p className={estilos.ubicacion}>{publicacion.localidad}</p>

      <ul className={`numeros ${estilos.caracteristicas}`}>
        <li>
          {cantAmbientes} {cantAmbientes === 1 ? 'ambiente' : 'ambientes'}
        </li>
        <li>{formatearSuperficie(publicacion.superficieTotal)}</li>
      </ul>
    </article>
  )
}
