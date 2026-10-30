import { useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import estilos from './LayoutPublico.module.css'

export default function LayoutPublico() {
  const { pathname } = useLocation()
  const tipoNavegacion = useNavigationType()

  // Al entrar a otra página (no al cambiar filtros) se vuelve al principio.
  // Con Atrás/Adelante (POP) el navegador restaura la posición anterior.
  // Es un efecto de layout para que la página nueva ya esté arriba cuando la transición
  // de la foto (catálogo → detalle) mide dónde queda.
  useLayoutEffect(() => {
    if (tipoNavegacion !== 'POP') window.scrollTo(0, 0)
  }, [pathname, tipoNavegacion])

  return (
    <div className={estilos.layout}>
      {/* Permite a quien navega con teclado saltar directo al contenido */}
      <a href="#contenido" className={estilos.saltarContenido}>
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className={estilos.principal}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
