import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router'
import { ETIQUETA_OPERACION, TIPOS_OPERACION, type TipoOperacion } from '../../catalogo/tipos.ts'
import { describirPropiedad } from '../formato.ts'
import type { Propiedad } from '../propiedades/tipos.ts'
import {
  ESTADOS_COMERCIALES,
  ETIQUETA_ESTADO_COMERCIAL,
  ETIQUETA_MONEDA,
  MONEDAS,
  type EstadoComercial,
  type Publicacion,
  type ValoresPublicacion,
} from '../publicaciones/tipos.ts'
import Campo from './Campo.tsx'
import estilos from './FormularioPanel.module.css'

type NombreCampo = 'propiedadId' | 'titulo' | 'tipoOperacion' | 'moneda' | 'precio' | 'expensas' | 'estadoComercial'
type Errores = Partial<Record<NombreCampo, string>>

interface Props {
  propiedades: Propiedad[] // en el alta, las opciones; en la edición, para nombrar la propiedad
  inicial?: Publicacion // en la edición, la publicación actual
  textoBoton: string
  guardando: boolean
  error: string | null // error al guardar, lo decide la página
  onGuardar: (valores: ValoresPublicacion) => void
}

// Límites de las columnas: precio NUMERIC(14,2) y expensas NUMERIC(12,2). Si se superan, el
// backend responde 500 en lugar de 400, así que se avisan acá.
const MAXIMO_PRECIO = 1_000_000_000_000
const MAXIMO_EXPENSAS = 10_000_000_000

function texto(datos: FormData, campo: string) {
  const valor = datos.get(campo)
  return typeof valor === 'string' ? valor.trim() : ''
}

// El texto completo tiene que ser un número con hasta 2 decimales ("85000", "85000.5", "85000,50").
// No se usa parseFloat porque aceptaría "85000abc" como 85000.
function leerImporte(valor: string) {
  if (valor.startsWith('-')) return 'negativo'
  if (!/^\d+([.,]\d{1,2})?$/.test(valor)) return 'invalido'
  return Number(valor.replace(',', '.'))
}

function validar(datos: FormData, esEdicion: boolean, tipoOperacion: TipoOperacion | '', estadoComercial: EstadoComercial | '') {
  const errores: Errores = {}
  const propiedadId = Number(texto(datos, 'propiedadId'))
  const titulo = texto(datos, 'titulo')
  const moneda = MONEDAS.find((opcion) => opcion === texto(datos, 'moneda'))
  const textoPrecio = texto(datos, 'precio')
  const precio = leerImporte(textoPrecio)
  const textoExpensas = texto(datos, 'expensas')
  const expensas = textoExpensas === '' ? null : leerImporte(textoExpensas)

  if (!esEdicion && !propiedadId) errores.propiedadId = 'Elegí la propiedad.'
  if (!titulo) errores.titulo = 'Escribí un título.'
  else if (titulo.length > 120) errores.titulo = 'El título puede tener hasta 120 caracteres.'
  if (!tipoOperacion) errores.tipoOperacion = 'Elegí si es venta o alquiler.'
  if (!moneda) errores.moneda = 'Elegí la moneda del precio.'

  if (!textoPrecio) errores.precio = 'Ingresá el precio.'
  else if (precio === 'negativo' || precio === 0) errores.precio = 'El precio tiene que ser mayor a 0.'
  else if (precio === 'invalido') errores.precio = 'Ingresá un número con hasta 2 decimales, sin puntos de miles.'
  else if (precio >= MAXIMO_PRECIO) errores.precio = 'El precio es demasiado grande.'

  if (expensas === 'negativo') errores.expensas = 'Las expensas no pueden ser negativas.'
  else if (expensas === 'invalido') errores.expensas = 'Ingresá un número con hasta 2 decimales, sin puntos de miles.'
  else if (expensas !== null && expensas >= MAXIMO_EXPENSAS) errores.expensas = 'El importe es demasiado grande.'

  // R3: solo se ofrecen los estados que corresponden a la operación elegida
  if (esEdicion && !estadoComercial) errores.estadoComercial = 'Elegí un estado comercial que corresponda a la operación.'

  if (Object.keys(errores).length > 0 || !tipoOperacion || !moneda || typeof precio !== 'number' || typeof expensas === 'string') {
    return { errores, valores: null }
  }
  const valores: ValoresPublicacion = {
    propiedadId,
    titulo,
    descripcion: texto(datos, 'descripcion') || null,
    tipoOperacion,
    precio,
    moneda,
    expensas,
    estadoComercial: estadoComercial || null,
  }
  return { errores, valores }
}

// El mismo formulario para el alta y la edición. La propiedad solo se elige en el alta y el estado
// comercial solo se cambia en la edición (el backend crea las publicaciones disponibles).
export default function FormularioPublicacion({ propiedades, inicial, textoBoton, guardando, error, onGuardar }: Props) {
  const esEdicion = inicial !== undefined
  const [errores, setErrores] = useState<Errores>({})
  const [tipoOperacion, setTipoOperacion] = useState<TipoOperacion | ''>(inicial?.tipoOperacion ?? '')
  const [estadoComercial, setEstadoComercial] = useState<EstadoComercial | ''>(inicial?.estadoComercial ?? '')
  const errorRef = useRef<HTMLParagraphElement>(null)

  // El error al guardar recibe el foco: el botón estuvo deshabilitado y lo había perdido
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  // Si el estado actual no corresponde a la nueva operación (Vendida en un alquiler, Alquilada en
  // una venta), no se cambia solo por otro: queda sin elegir y se avisa que hay que elegir uno.
  function cambiarOperacion(valor: string) {
    const nueva = TIPOS_OPERACION.find((operacion) => operacion === valor) ?? ''
    setTipoOperacion(nueva)
    if (nueva && estadoComercial && !ESTADOS_COMERCIALES[nueva].includes(estadoComercial)) {
      setEstadoComercial('')
      setErrores((actuales) => ({
        ...actuales,
        estadoComercial: `El estado ${ETIQUETA_ESTADO_COMERCIAL[estadoComercial]} no corresponde a ${nueva === 'VENTA' ? 'una venta' : 'un alquiler'}: elegí uno.`,
      }))
    }
  }

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const { errores: nuevos, valores } = validar(new FormData(formulario), esEdicion, tipoOperacion, estadoComercial)
    // Se actualiza el DOM antes de mover el foco, para que el lector de pantalla lea el aviso
    flushSync(() => setErrores(nuevos))
    if (!valores) {
      formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    onGuardar(inicial ? { ...valores, propiedadId: inicial.propiedadId } : valores)
  }

  function alEscribir(evento: FormEvent<HTMLFormElement>) {
    const { name } = evento.target as HTMLInputElement
    if (errores[name as NombreCampo]) setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  // Atributos comunes de cada control: nombre, id y la relación con su ayuda y su aviso
  function control(nombre: NombreCampo, conAyuda = false) {
    const id = `publicacion-${nombre}`
    const describe = [conAyuda && `${id}-ayuda`, errores[nombre] && `${id}-error`].filter(Boolean).join(' ')
    return {
      id,
      name: nombre,
      className: estilos.control,
      'aria-invalid': errores[nombre] ? true : undefined,
      'aria-describedby': describe || undefined,
    }
  }

  const estadosPosibles = tipoOperacion ? ESTADOS_COMERCIALES[tipoOperacion] : []

  return (
    <form className={estilos.formulario} noValidate onSubmit={alEnviar} onInput={alEscribir}>
      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Propiedad</legend>
        {inicial ? (
          <div className={estilos.campo}>
            <p className={estilos.dato}>{describirPropiedad(propiedades.find((propiedad) => propiedad.id === inicial.propiedadId), inicial.propiedadId)}</p>
            <p className={estilos.ayuda}>La propiedad de una publicación no se puede cambiar.</p>
          </div>
        ) : (
          <Campo id="publicacion-propiedadId" etiqueta="Propiedad" error={errores.propiedadId}>
            <select {...control('propiedadId')} required defaultValue="">
              <option value="" disabled>
                Elegí una propiedad
              </option>
              {propiedades.map((propiedad) => (
                <option key={propiedad.id} value={propiedad.id}>
                  {describirPropiedad(propiedad, propiedad.id)}
                </option>
              ))}
            </select>
          </Campo>
        )}
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Aviso</legend>
        <Campo id="publicacion-titulo" etiqueta="Título" error={errores.titulo}>
          <input {...control('titulo')} required maxLength={120} defaultValue={inicial?.titulo} />
        </Campo>
        <Campo id="publicacion-descripcion" etiqueta="Descripción (opcional)" ayuda="Si la dejás vacía, se usará el resumen de la propiedad.">
          <textarea id="publicacion-descripcion" name="descripcion" className={estilos.control} aria-describedby="publicacion-descripcion-ayuda" rows={5} defaultValue={inicial?.descripcion} />
        </Campo>
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>Operación y precio</legend>
        <div className={estilos.columnas}>
          <Campo id="publicacion-tipoOperacion" etiqueta="Operación" error={errores.tipoOperacion}>
            <select {...control('tipoOperacion')} required value={tipoOperacion} onChange={(evento) => cambiarOperacion(evento.target.value)}>
              <option value="" disabled>
                Elegí una operación
              </option>
              {TIPOS_OPERACION.map((operacion) => (
                <option key={operacion} value={operacion}>
                  {ETIQUETA_OPERACION[operacion]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo id="publicacion-moneda" etiqueta="Moneda del precio" error={errores.moneda}>
            <select {...control('moneda')} required defaultValue={inicial?.moneda ?? ''}>
              <option value="" disabled>
                Elegí una moneda
              </option>
              {MONEDAS.map((moneda) => (
                <option key={moneda} value={moneda}>
                  {ETIQUETA_MONEDA[moneda]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo id="publicacion-precio" etiqueta="Precio" error={errores.precio}>
            <input {...control('precio')} required inputMode="decimal" autoComplete="off" defaultValue={inicial?.precio} />
          </Campo>
          <Campo
            id="publicacion-expensas"
            etiqueta="Expensas en pesos (opcional)"
            error={errores.expensas}
            ayuda="Siempre en pesos, aunque el precio esté en dólares."
          >
            <input {...control('expensas', true)} inputMode="decimal" autoComplete="off" defaultValue={inicial?.expensas ?? ''} />
          </Campo>
          {esEdicion && (
            <Campo
              id="publicacion-estadoComercial"
              etiqueta="Estado comercial"
              error={errores.estadoComercial}
              ayuda="Las opciones dependen de la operación."
            >
              <select
                {...control('estadoComercial', true)}
                required
                value={estadoComercial}
                onChange={(evento) => setEstadoComercial(estadosPosibles.find((estado) => estado === evento.target.value) ?? '')}
              >
                <option value="" disabled>
                  Elegí un estado
                </option>
                {estadosPosibles.map((estado) => (
                  <option key={estado} value={estado}>
                    {ETIQUETA_ESTADO_COMERCIAL[estado]}
                  </option>
                ))}
              </select>
            </Campo>
          )}
        </div>
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
        <Link to="/admin/publicaciones" className="boton boton-secundario">
          Cancelar
        </Link>
      </div>
      <p className="sr-only" aria-live="polite">
        {guardando ? 'Guardando…' : ''}
      </p>
    </form>
  )
}
