import { Link } from 'react-router'
import { tituloPagina } from '../../config.ts'
import Marca from '../../compartido/componentes/Marca.tsx'
import estilos from './LoginPagina.module.css'

// Placeholder: el formulario y la autenticación se implementan en un bloque posterior.
export default function LoginPagina() {
  return (
    <main className={estilos.pagina}>
      <title>{tituloPagina('Acceso administración')}</title>

      <div className={estilos.tarjeta}>
        <Marca />

        <h1 className={estilos.titulo}>Acceso administración</h1>
        <p className={estilos.texto}>
          El inicio de sesión para administradores estará disponible próximamente.
        </p>

        <Link to="/" className="boton boton-secundario">
          Volver al sitio
        </Link>
      </div>
    </main>
  )
}
