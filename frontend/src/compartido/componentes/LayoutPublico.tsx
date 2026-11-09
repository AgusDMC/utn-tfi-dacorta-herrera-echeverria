import { Suspense, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import estilos from './LayoutPublico.module.css'

export default function LayoutPublico() {
  const { pathname } = useLocation()
  const tipoNavegacion = useNavigationType()
  const paginaAnterior = useRef<string | null>(null)

  // Al entrar a otra página (no al cambiar filtros ni de página del listado) se vuelve al
  // principio. Con Atrás/Adelante (POP) el navegador restaura la posición anterior.
  // Es un efecto de layout para que la página nueva ya esté arriba cuando la transición
  // de la foto (catálogo → detalle) mide dónde queda.
  useLayoutEffect(() => {
    if (paginaAnterior.current === pathname) return
    paginaAnterior.current = pathname
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
        {/* Las páginas del catálogo esperan sus datos (use + Suspense). Al navegar, React deja
            la página anterior hasta que llegan; esto solo se ve al entrar directo a una página */}
        <Suspense
          fallback={
            <p role="status" className={`contenedor ${estilos.cargando}`}>
              Cargando…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
