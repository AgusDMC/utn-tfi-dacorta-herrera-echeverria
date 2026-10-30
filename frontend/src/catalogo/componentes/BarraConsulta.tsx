import { useEffect, useState, type RefObject } from 'react'
import { useMediaQuery } from '../../compartido/useMediaQuery.ts'
import { partirPrecio } from '../formato.ts'
import type { PublicacionDetalle } from '../tipos.ts'
import estilos from './BarraConsulta.module.css'

interface Props {
  publicacion: PublicacionDetalle
  ctaRef: RefObject<HTMLElement | null> // el CTA del flujo: la barra aparece cuando queda atrás
  onConsultar: () => void
}

// Barra fija inferior del celular: precio compacto y acceso a la consulta.
// Aparece cuando el CTA de la página quedó arriba y se va cuando se llega al bloque de consulta.
export default function BarraConsulta({ publicacion, ctaRef, onConsultar }: Props) {
  const esCelular = useMediaQuery('(max-width: 767.98px)')
  const [visible, setVisible] = useState(false)
  const precio = partirPrecio(publicacion.precio, publicacion.moneda)

  useEffect(() => {
    const cta = ctaRef.current
    const consulta = document.getElementById('consulta')
    // Primer hijo de la página (el plano pino): al volver arriba de golpe entra en pantalla
    // y avisa, algo que el CTA no hace al pasar de "arriba" a "abajo" sin cruzar la pantalla
    const inicio = cta?.closest('article')?.firstElementChild
    if (!esCelular || !cta || !consulta || !inicio) return

    // La barra se ve cuando el CTA quedó arriba y todavía no se llegó al bloque de consulta
    // (ni se pasó de largo, hacia el footer). Se calcula con las posiciones reales: los
    // avisos del observador solo dicen cuándo recalcular.
    const actualizar = () => {
      const ctaAtras = cta.getBoundingClientRect().bottom < 0
      const consultaAlcanzada = consulta.getBoundingClientRect().top < window.innerHeight
      setVisible(ctaAtras && !consultaAlcanzada)
    }
    const observador = new IntersectionObserver(actualizar)
    observador.observe(cta)
    observador.observe(consulta)
    observador.observe(inicio)
    return () => observador.disconnect()
  }, [esCelular, ctaRef])

  if (!esCelular) return null

  return (
    <div className={estilos.barra} data-visible={visible || undefined} inert={!visible}>
      <p className={`precio ${estilos.precio}`}>
        <span className={estilos.moneda}>{precio.moneda}</span> {precio.cifra}
        {publicacion.tipoOperacion === 'ALQUILER' && <span className={estilos.periodo}> por mes</span>}
      </p>
      <button type="button" className={`boton ${estilos.consultar}`} onClick={onConsultar}>
        Consultar
      </button>
    </div>
  )
}
