import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ESTADO_ENFOCAR_RESULTADOS, leerFiltros, urlCatalogo } from '../filtros.ts'
import {
  ACCION_OPERACION,
  ETIQUETA_TIPO,
  TIPOS_OPERACION,
  TIPOS_PROPIEDAD,
  type FiltrosCatalogo,
} from '../tipos.ts'
import estilos from './Buscador.module.css'

interface Props {
  filtros: FiltrosCatalogo
  localidades: string[]
}

const CAMPOS = ['operacion', 'tipo', 'localidad'] as const

// Formulario de búsqueda del catálogo. Los filtros viven en la URL, así una
// búsqueda se puede compartir y el botón Atrás vuelve a la anterior.
// Es un formulario no controlado: quien lo usa le pasa un `key` que cambia con
// la URL para que los valores iniciales se actualicen.
export default function Buscador({ filtros, localidades }: Props) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const params = new URLSearchParams()
    for (const campo of CAMPOS) {
      const valor = datos.get(campo)
      if (typeof valor === 'string' && valor) params.set(campo, valor)
    }

    const destino = urlCatalogo(leerFiltros(params))
    if (destino !== pathname + search) navigate(destino, { state: ESTADO_ENFOCAR_RESULTADOS })
  }

  return (
    <form
      className={estilos.buscador}
      role="search"
      aria-label="Buscar propiedades"
      onSubmit={buscar}
    >
      <fieldset className={estilos.operacion}>
        <legend className="sr-only">Operación</legend>
        <label className={estilos.pestana}>
          <input type="radio" name="operacion" value="" defaultChecked={!filtros.operacion} />
          Todas
        </label>
        {TIPOS_OPERACION.map((operacion) => (
          <label key={operacion} className={estilos.pestana}>
            <input
              type="radio"
              name="operacion"
              value={operacion}
              defaultChecked={filtros.operacion === operacion}
            />
            {ACCION_OPERACION[operacion]}
          </label>
        ))}
      </fieldset>

      <div className={estilos.campos}>
        <label className={estilos.campo}>
          <span className={estilos.etiqueta}>Tipo de propiedad</span>
          <select name="tipo" defaultValue={filtros.tipo ?? ''} className={estilos.selector}>
            <option value="">Todos los tipos</option>
            {TIPOS_PROPIEDAD.map((tipo) => (
              <option key={tipo} value={tipo}>
                {ETIQUETA_TIPO[tipo]}
              </option>
            ))}
          </select>
        </label>

        <label className={estilos.campo}>
          <span className={estilos.etiqueta}>Ubicación</span>
          <select name="localidad" defaultValue={filtros.localidad ?? ''} className={estilos.selector}>
            <option value="">Todas las localidades</option>
            {localidades.map((localidad) => (
              <option key={localidad} value={localidad}>
                {localidad}
              </option>
            ))}
          </select>
        </label>

        <div className={estilos.acciones}>
          <button type="submit" className={`boton boton-primario ${estilos.botonBuscar}`}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
            </svg>
            Buscar
          </button>
        </div>
      </div>
    </form>
  )
}
