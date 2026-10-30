import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import fotoHero960 from '../../assets/hero/living-960.webp'
import fotoHero1600 from '../../assets/hero/living-1600.webp'
import estilos from './HeroCatalogo.module.css'
import { useProfundidadHero } from './useProfundidadHero.ts'

// La entrada animada es solo de la carga directa de la home: se entró por el enlace (key
// 'default') y es la primera vez que el hero se monta. Al volver con Atrás aparece ya armado.
let entradaRealizada = false

interface Props {
  children: ReactNode // el buscador, que cruza la costura entre la placa y la foto
}

// Hero de la home: una placa verde pino sostiene el titular y la fotografía la
// pisa como una ventana recortada en el verde. El buscador une las dos zonas.
// En desktop con mouse las capas se desplazan apenas distinto según el puntero
// (data-profundidad = px máximos); el buscador queda fijo como ancla de la interfaz.
export default function HeroCatalogo({ children }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const { key } = useLocation()
  const [cargaDirecta] = useState(() => key === 'default' && !entradaRealizada)
  useProfundidadHero(heroRef)

  useEffect(() => {
    entradaRealizada = true
  }, [])

  return (
    <section
      ref={heroRef}
      className={estilos.hero}
      aria-labelledby="titulo-catalogo"
      data-carga-directa={cargaDirecta || undefined}
    >
      <div className={estilos.placa} data-profundidad="5" aria-hidden="true" />

      {/* El texto está impreso en la placa: se mueve igual que ella */}
      <div className={estilos.texto} data-profundidad="5">
        {/* Dos líneas fijas: cada span es una línea y no se parte */}
        <h1 id="titulo-catalogo" className={estilos.titulo}>
          <span>Encontrá tu</span> <span>próximo hogar</span>
        </h1>
        <p className={estilos.bajada}>Casas, departamentos, PH y dúplex en venta y alquiler.</p>
      </div>

      {/* Imagen ilustrativa: no corresponde a ninguna propiedad publicada */}
      <div className={estilos.foto}>
        <div className={estilos.recorte} data-profundidad="12">
          <img
            src={fotoHero1600}
            srcSet={`${fotoHero960} 960w, ${fotoHero1600} 1600w`}
            sizes="(min-width: 1024px) 66vw, 100vw"
            width={1600}
            height={1200}
            alt=""
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={estilos.buscador}>{children}</div>

      <p className={estilos.pie}>Fotografía ilustrativa</p>
    </section>
  )
}
