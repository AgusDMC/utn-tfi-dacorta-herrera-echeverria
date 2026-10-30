import type { ReactNode } from 'react'
import fotoHero960 from '../../assets/hero/living-960.webp'
import fotoHero1600 from '../../assets/hero/living-1600.webp'
import estilos from './HeroCatalogo.module.css'

interface Props {
  children: ReactNode // el buscador, que se monta sobre el borde de la foto
}

// Hero editorial de la home (sin filtros activos): texto a la izquierda,
// fotografía a la derecha y el buscador cruzando el corte entre ambos.
export default function HeroCatalogo({ children }: Props) {
  return (
    <section className={estilos.hero} aria-labelledby="titulo-catalogo">
      <div className={estilos.texto}>
        <p className={`antetitulo aparecer ${estilos.antetitulo}`}>Venta y alquiler</p>
        <h1 id="titulo-catalogo" className={`aparecer ${estilos.titulo}`}>
          Encontrá tu próximo hogar
        </h1>
        <p className={`aparecer ${estilos.bajada}`}>
          Casas, departamentos, PH y dúplex en venta y alquiler, con información clara para decidir con
          tranquilidad.
        </p>
      </div>

      {/* Imagen decorativa: no corresponde a ninguna propiedad publicada */}
      <div className={estilos.foto}>
        <img
          src={fotoHero1600}
          srcSet={`${fotoHero960} 960w, ${fotoHero1600} 1600w`}
          sizes="(min-width: 1024px) 60vw, 100vw"
          width={1600}
          height={1200}
          alt=""
          fetchPriority="high"
        />
      </div>

      <div className={`aparecer ${estilos.buscador}`}>{children}</div>

      <p className={estilos.pie}>Fotografía ilustrativa</p>
    </section>
  )
}
