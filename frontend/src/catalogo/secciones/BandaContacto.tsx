import { Link } from 'react-router'
import { CONTACTO } from '../../config.ts'
import { IlustracionPuerta } from '../../compartido/Ilustraciones.tsx'
import estilos from './BandaContacto.module.css'

// Cierre de página: una banda pino que lleva a Contacto, con una puerta dibujada en línea
export default function BandaContacto() {
  const { telefono } = CONTACTO

  return (
    <section className={estilos.banda} aria-labelledby="titulo-banda-contacto">
      <div className={`contenedor ${estilos.contenido}`}>
        <div>
          <h2 id="titulo-banda-contacto" className={estilos.titulo}>
            ¿No encontraste lo que buscabas?
          </h2>
          <p className={estilos.bajada}>Escribinos o llamanos y te contamos qué propiedades tenemos.</p>
          <div className={estilos.acciones}>
            <Link to="/contacto" className={`boton ${estilos.principal}`}>
              Contacto
            </Link>
            {telefono && (
              <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`} className={`boton ${estilos.secundario}`}>
                Llamar
              </a>
            )}
          </div>
        </div>

        <span className={estilos.dibujo}>
          <IlustracionPuerta />
        </span>
      </div>
    </section>
  )
}
