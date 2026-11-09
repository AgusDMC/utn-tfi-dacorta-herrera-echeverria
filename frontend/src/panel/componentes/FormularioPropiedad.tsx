import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation } from 'react-router'
import { ETIQUETA_TIPO, TIPOS_PROPIEDAD } from '../../catalogo/tipos.ts'
import type { DatosPropiedad } from '../propiedades/tipos.ts'
import Campo from './Campo.tsx'
import estilos from './FormularioPanel.module.css'

type NombreCampo = keyof DatosPropiedad
type Errores = Partial<Record<NombreCampo, string>>

interface Props {
  inicial?: DatosPropiedad // en la edición, los datos actuales
  textoBoton: string
  guardando: boolean
  error: string | null // error al guardar, lo decide la página
  onGuardar: (datos: DatosPropiedad) => void
}

function texto(datos: FormData, campo: NombreCampo) {
  const valor = datos.get(campo)
  return typeof valor === 'string' ? valor.trim() : ''
}

// Un campo vacío queda como NaN y no pasa ninguna validación numérica
function numero(datos: FormData, campo: NombreCampo) {
  const valor = texto(datos, campo)
  return valor === '' ? NaN : Number(valor)
}

// Límites de los tipos del backend: los enteros son Short y la superficie es NUMERIC(10,2).
// Si se superan, el backend responde 500 en lugar de 400, así que se avisan acá.
const MAXIMO_ENTERO = 32767
const MAXIMO_SUPERFICIE = 100_000_000

function errorEntero(valor: number, minimo: number) {
  if (!Number.isInteger(valor) || valor < minimo) return `Ingresá un número entero, de ${minimo} o más.`
  if (valor > MAXIMO_ENTERO) return 'El número es demasiado grande.'
  return undefined
}

// Las mismas reglas que valida el backend (PropiedadCreateDto y la regla R14)
function validar(formulario: HTMLFormElement) {
  const datos = new FormData(formulario)
  const tipoPropiedad = TIPOS_PROPIEDAD.find((tipo) => tipo === texto(datos, 'tipoPropiedad'))
  const resumen = texto(datos, 'resumen')
  const direccion = texto(datos, 'direccion')
  const localidad = texto(datos, 'localidad')
  const cantAmbientes = numero(datos, 'cantAmbientes')
  const cantDormitorios = numero(datos, 'cantDormitorios')
  const cantBanios = numero(datos, 'cantBanios')
  const superficieTotal = numero(datos, 'superficieTotal')
  const anio = texto(datos, 'anioConstruccion')
  const anioConstruccion = anio === '' ? null : Number(anio)
  // Un texto que no es número ("19e") llega vacío: sin esto se enviaría null y se borraría el año
  const campoAnio = formulario.elements.namedItem('anioConstruccion')
  const anioIlegible = campoAnio instanceof HTMLInputElement && campoAnio.validity.badInput

  const errores: Errores = {}
  if (!tipoPropiedad) errores.tipoPropiedad = 'Elegí el tipo de propiedad.'
  if (!resumen) errores.resumen = 'Escribí un resumen de la propiedad.'
  if (!direccion) errores.direccion = 'Ingresá la dirección.'
  if (!localidad) errores.localidad = 'Ingresá la localidad.'
  errores.cantAmbientes = errorEntero(cantAmbientes, 1)
  errores.cantDormitorios = errorEntero(cantDormitorios, 0)
  if (!errores.cantAmbientes && !errores.cantDormitorios && cantDormitorios >= cantAmbientes) {
    errores.cantDormitorios = 'La cantidad de dormitorios debe ser menor a la cantidad de ambientes.'
  }
  errores.cantBanios = errorEntero(cantBanios, 1)
  if (!(superficieTotal > 0)) errores.superficieTotal = 'Ingresá una superficie mayor a 0.'
  else if (!/^\d+(\.\d{1,2})?$/.test(texto(datos, 'superficieTotal'))) errores.superficieTotal = 'Usá como máximo 2 decimales.'
  else if (superficieTotal >= MAXIMO_SUPERFICIE) errores.superficieTotal = 'La superficie es demasiado grande.'
  if (anioIlegible || (anioConstruccion !== null && (!Number.isInteger(anioConstruccion) || anioConstruccion < 1800))) {
    errores.anioConstruccion = 'Ingresá un año desde 1800, o dejalo vacío.'
  } else if (anioConstruccion !== null && anioConstruccion > MAXIMO_ENTERO) {
    errores.anioConstruccion = 'El número es demasiado grande.'
  }

  if (!tipoPropiedad || Object.values(errores).some(Boolean)) return { errores, propiedad: null }
  const propiedad: DatosPropiedad = {
    tipoPropiedad,
    resumen,
    direccion,
    localidad,
    cantAmbientes,
    cantDormitorios,
    cantBanios,
    tienePatio: datos.get('tienePatio') === 'on',
    superficieTotal,
    anioConstruccion,
  }
  return { errores, propiedad }
}

// El mismo formulario para el alta y la edición. Valida antes de entregar los datos a la página,
// que es la que llama a la API.
export default function FormularioPropiedad({ inicial, textoBoton, guardando, error, onGuardar }: Props) {
  const { search } = useLocation() // la página del listado, para que Cancelar vuelva a ella
  const [errores, setErrores] = useState<Errores>({})
  const errorRef = useRef<HTMLParagraphElement>(null)

  // El error al guardar recibe el foco: el botón estuvo deshabilitado y lo había perdido
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const { errores: nuevos, propiedad } = validar(formulario)
    // Se actualiza el DOM antes de mover el foco, para que el lector de pantalla lea el aviso
    flushSync(() => setErrores(nuevos))
    if (!propiedad) {
      formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    onGuardar(propiedad)
  }

  function alEscribir(evento: FormEvent<HTMLFormElement>) {
    const { name } = evento.target as HTMLInputElement
    if (errores[name as NombreCampo]) setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  // Atributos comunes de cada control: nombre, id y la relación con su aviso
  function control(nombre: NombreCampo) {
    return {
      id: `propiedad-${nombre}`,
      name: nombre,
      className: estilos.control,
      'aria-invalid': errores[nombre] ? true : undefined,
      'aria-describedby': errores[nombre] ? `propiedad-${nombre}-error` : undefined,
    }
  }

  return (
    <form className={estilos.formulario} noValidate onSubmit={alEnviar} onInput={alEscribir}>
      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Datos generales</legend>
        <Campo id="propiedad-tipoPropiedad" etiqueta="Tipo de propiedad" error={errores.tipoPropiedad}>
          <select {...control('tipoPropiedad')} required defaultValue={inicial?.tipoPropiedad ?? ''}>
            <option value="" disabled>
              Elegí un tipo
            </option>
            {TIPOS_PROPIEDAD.map((tipo) => (
              <option key={tipo} value={tipo}>
                {ETIQUETA_TIPO[tipo]}
              </option>
            ))}
          </select>
        </Campo>
        <Campo id="propiedad-resumen" etiqueta="Resumen" error={errores.resumen}>
          <textarea {...control('resumen')} required maxLength={500} rows={4} defaultValue={inicial?.resumen} />
        </Campo>
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Ubicación</legend>
        <div className={estilos.columnas}>
          <Campo id="propiedad-direccion" etiqueta="Dirección" error={errores.direccion}>
            <input {...control('direccion')} required maxLength={200} defaultValue={inicial?.direccion} />
          </Campo>
          <Campo id="propiedad-localidad" etiqueta="Localidad" error={errores.localidad}>
            <input {...control('localidad')} required maxLength={100} defaultValue={inicial?.localidad} />
          </Campo>
        </div>
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Características</legend>
        <div className={estilos.cifras}>
          <Campo id="propiedad-cantAmbientes" etiqueta="Ambientes" error={errores.cantAmbientes}>
            <input {...control('cantAmbientes')} type="number" required min={1} step={1} defaultValue={inicial?.cantAmbientes} />
          </Campo>
          <Campo id="propiedad-cantDormitorios" etiqueta="Dormitorios" error={errores.cantDormitorios}>
            <input {...control('cantDormitorios')} type="number" required min={0} step={1} defaultValue={inicial?.cantDormitorios} />
          </Campo>
          <Campo id="propiedad-cantBanios" etiqueta="Baños" error={errores.cantBanios}>
            <input {...control('cantBanios')} type="number" required min={1} step={1} defaultValue={inicial?.cantBanios} />
          </Campo>
          <Campo id="propiedad-superficieTotal" etiqueta="Superficie total (m²)" error={errores.superficieTotal}>
            <input
              {...control('superficieTotal')}
              type="number"
              required
              min={0.01}
              step={0.01}
              inputMode="decimal"
              defaultValue={inicial?.superficieTotal}
            />
          </Campo>
          <Campo id="propiedad-anioConstruccion" etiqueta="Año de construcción (opcional)" error={errores.anioConstruccion}>
            <input {...control('anioConstruccion')} type="number" min={1800} step={1} defaultValue={inicial?.anioConstruccion ?? ''} />
          </Campo>
        </div>

        <label className={estilos.casilla}>
          <input type="checkbox" name="tienePatio" defaultChecked={inicial?.tienePatio ?? false} />
          Tiene patio
        </label>
      </fieldset>

      {error && (
        <p ref={errorRef} tabIndex={-1} className={estilos.error}>
          {error}
        </p>
      )}

      <div className={estilos.acciones}>
        <button type="submit" className="boton boton-primario" disabled={guardando}>
          {guardando ? 'Guardando…' : textoBoton}
        </button>
        <Link to={{ pathname: '/admin/propiedades', search }} className="boton boton-secundario">
          Cancelar
        </Link>
      </div>
      <p className="sr-only" aria-live="polite">
        {guardando ? 'Guardando…' : ''}
      </p>
    </form>
  )
}
