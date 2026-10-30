import { useId, ViewTransition, type FormEvent } from 'react'
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
  const idOperacion = useId()

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
    // Es la misma barra en la home y en los resultados: al cambiar de estado viaja de un
    // lugar al otro en lugar de desaparecer y reaparecer
    <ViewTransition name="buscador" enter="none" exit="none" update="none" share="buscador-compartido">
      <form
        className={estilos.buscador}
        role="search"
        aria-label="Buscar propiedades"
        autoComplete="off"
        onSubmit={buscar}
      >
        {/* Radios nativos: las flechas del teclado cambian de opción dentro del grupo */}
        <div role="radiogroup" aria-labelledby={idOperacion} className={estilos.operacion}>
          <span id={idOperacion} className={estilos.etiqueta}>
            Operación
          </span>
          <div className={estilos.opciones}>
            <label className={estilos.opcion}>
              <input type="radio" name="operacion" value="" defaultChecked={!filtros.operacion} />
              Todas
            </label>
            {TIPOS_OPERACION.map((operacion) => (
              <label key={operacion} className={estilos.opcion}>
                <input
                  type="radio"
                  name="operacion"
                  value={operacion}
                  defaultChecked={filtros.operacion === operacion}
                />
                {ACCION_OPERACION[operacion]}
              </label>
            ))}
          </div>
        </div>

        <div className={estilos.campos}>
          {/* El select cubre toda la celda: tocar cualquier punto lo abre */}
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
              Buscar
            </button>
          </div>
        </div>
      </form>
    </ViewTransition>
  )
}
