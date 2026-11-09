import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import { cambiarEstadoConsulta } from '../consultas/consultas.ts'
import { ETIQUETA_ESTADO, SIGUIENTES_ESTADOS, esEstadoConsulta, type Consulta } from '../consultas/tipos.ts'
import estilos from './CambioEstadoConsulta.module.css'

interface Props {
  consulta: Consulta
  onActualizada: (consulta: Consulta) => void
}

// Ofrece solo los pasos válidos desde el estado actual (R11). La consulta que se muestra se
// reemplaza por la que devuelve la API, con su fecha de actualización real.
export default function CambioEstadoConsulta({ consulta, onActualizada }: Props) {
  const opciones = SIGUIENTES_ESTADOS[consulta.estado]
  const [guardando, setGuardando] = useState(false)
  const [resultado, setResultado] = useState<'ok' | 'error' | null>(null)
  const resultadoRef = useRef<HTMLParagraphElement>(null)
  const salirSiVencio = useSalirSiVencio()
  const idSelector = useId()

  // El resultado recibe el foco: el botón quedó deshabilitado o el formulario se reemplazó
  useEffect(() => {
    if (resultado) resultadoRef.current?.focus()
  }, [resultado])

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (guardando) return

    const nuevo = new FormData(evento.currentTarget).get('estado')
    if (typeof nuevo !== 'string' || !esEstadoConsulta(nuevo) || !opciones.includes(nuevo)) return

    setGuardando(true)
    setResultado(null)
    try {
      onActualizada(await cambiarEstadoConsulta(consulta.id, nuevo))
      setResultado('ok')
    } catch (error) {
      if (!salirSiVencio(error)) setResultado('error')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className={estilos.cambio} aria-labelledby="titulo-cambio-estado">
      <h2 id="titulo-cambio-estado" className={estilos.titulo}>
        Cambiar estado
      </h2>

      {opciones.length === 0 ? (
        <p className={estilos.texto}>
          La consulta está {ETIQUETA_ESTADO[consulta.estado].toLowerCase()}: ya no cambia de estado.
        </p>
      ) : (
        // El key reinicia el selector cuando cambia el estado y con él las opciones
        <form key={consulta.estado} className={estilos.formulario} onSubmit={guardar}>
          <div className={estilos.campo}>
            <label htmlFor={idSelector} className={estilos.etiqueta}>
              Nuevo estado
            </label>
            <select id={idSelector} name="estado" disabled={guardando} className={estilos.selector}>
              {opciones.map((estado) => (
                <option key={estado} value={estado}>
                  {ETIQUETA_ESTADO[estado]}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={`boton boton-primario ${estilos.guardar}`} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
      )}

      {resultado && (
        <p ref={resultadoRef} tabIndex={-1} className={estilos.resultado} data-error={resultado === 'error' || undefined}>
          {resultado === 'ok' ? 'Estado actualizado.' : 'No pudimos actualizar el estado. Probá nuevamente.'}
        </p>
      )}
    </section>
  )
}
