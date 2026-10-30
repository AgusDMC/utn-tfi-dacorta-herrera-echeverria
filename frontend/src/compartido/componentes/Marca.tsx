import { Link } from 'react-router'
import { MARCA, NOMBRE_INMOBILIARIA } from '../../config.ts'
import estilos from './Marca.module.css'

// Logotipo tipográfico: nombre en serif y descriptor en versalitas.
export default function Marca() {
  return (
    <Link to="/" className={estilos.marca} aria-label={`${NOMBRE_INMOBILIARIA}, inicio`} translate="no">
      <span className={estilos.nombre}>{MARCA.nombre}</span>
      <span className={estilos.descriptor}>{MARCA.descriptor}</span>
    </Link>
  )
}
