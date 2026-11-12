import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { IconoCerrar, IconoMas, IconoSubir } from '../../compartido/componentes/Iconos.tsx'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import { subirImagen } from '../imagenes/imagenes.ts'
import { LARGO_DESCRIPCION, type ImagenPropiedad } from '../imagenes/tipos.ts'
import type { Resultado } from './Aviso.tsx'
import formulario from './FormularioPanel.module.css'
import estilos from './SubidaImagenes.module.css'

// Los mismos límites que valida el backend, para avisar antes de subir
const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp']
const PESO_MAXIMO = 5 * 1024 * 1024

// Una imagen elegida que todavía no se subió
interface Pendiente {
  id: number // para el id de su campo: el nombre del archivo puede traer espacios o símbolos
  clave: string // nombre, peso y fecha: evita cargar dos veces el mismo archivo
  archivo: File
  vista: string // URL local de la miniatura
  descripcion: string
  subiendo?: boolean
  error?: string
}

interface Props {
  propiedadId: number
  ocupado: boolean // hay una acción en curso en la sección: no se puede elegir ni subir
  ejecutar: (tarea: () => Promise<void>) => Promise<void> // corre la subida como la acción en curso
  onSubida: (imagen: ImagenPropiedad) => void
  onResultado: (resultado: Resultado) => void
}

function formatearPeso(bytes: number) {
  const megas = bytes / (1024 * 1024)
  return megas >= 1 ? `${megas.toLocaleString('es-AR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

// Por qué no se puede subir un archivo, o null si está bien
function motivoRechazo(archivo: File) {
  if (!TIPOS_ACEPTADOS.includes(archivo.type)) return 'no es una imagen JPG, PNG o WEBP'
  if (archivo.size === 0) return 'está vacío'
  if (archivo.size > PESO_MAXIMO) return 'supera los 5 MB'
  return null
}

function errorDeSubida(estado: number | null) {
  if (estado === 413) return 'Supera los 5 MB.'
  if (estado === 400) return 'El servidor no la aceptó como imagen JPG, PNG o WEBP.'
  if (estado === 502) return 'El almacenamiento de imágenes no respondió. Probá de nuevo.'
  return 'No se pudo subir. Probá de nuevo.'
}

// Elegir varias imágenes, revisarlas (miniatura, descripción, quitar) y subirlas. El backend
// recibe una imagen por pedido, así que se suben de a una y en orden: las que salen bien pasan a
// la galería y las que fallan quedan acá con su motivo, para reintentar o quitarlas.
export default function SubidaImagenes({ propiedadId, ocupado, ejecutar, onSubida, onResultado }: Props) {
  const salirSiVencio = useSalirSiVencio()
  const id = useId()
  const [cola, setCola] = useState<Pendiente[]>([])
  const [rechazados, setRechazados] = useState<string[]>([])
  const [progreso, setProgreso] = useState<{ hechas: number; total: number } | null>(null)
  const entradaRef = useRef<HTMLInputElement>(null)
  // Si la pantalla se cierra en medio de una subida, no se siguen subiendo las que faltan
  const activoRef = useRef(true)
  const vistasRef = useRef(new Set<string>())
  const ultimoIdRef = useRef(0)

  useEffect(() => {
    activoRef.current = true
    const vistas = vistasRef.current
    return () => {
      activoRef.current = false
      vistas.forEach((vista) => URL.revokeObjectURL(vista))
      vistas.clear()
    }
  }, [])

  function soltarVista(vista: string) {
    URL.revokeObjectURL(vista)
    vistasRef.current.delete(vista)
  }

  function alElegir(evento: ChangeEvent<HTMLInputElement>) {
    const elegidos = Array.from(evento.target.files ?? [])
    evento.target.value = '' // permite volver a elegir el mismo archivo después de quitarlo

    const enCola = new Set(cola.map((pendiente) => pendiente.clave))
    const nuevos: Pendiente[] = []
    const noSirven: string[] = []
    for (const archivo of elegidos) {
      const clave = `${archivo.name}-${archivo.size}-${archivo.lastModified}`
      const motivo = motivoRechazo(archivo)
      if (motivo) noSirven.push(`${archivo.name}: ${motivo}.`)
      else if (!enCola.has(clave)) {
        enCola.add(clave)
        const vista = URL.createObjectURL(archivo)
        vistasRef.current.add(vista)
        ultimoIdRef.current += 1
        nuevos.push({ id: ultimoIdRef.current, clave, archivo, vista, descripcion: '' })
      }
    }
    setRechazados(noSirven)
    if (nuevos.length > 0) setCola((actual) => [...actual, ...nuevos])
  }

  function cambiar(clave: string, cambios: Partial<Pendiente>) {
    setCola((actual) => actual.map((pendiente) => (pendiente.clave === clave ? { ...pendiente, ...cambios } : pendiente)))
  }

  function quitar(pendiente: Pendiente) {
    soltarVista(pendiente.vista)
    setCola((actual) => actual.filter((otro) => otro.clave !== pendiente.clave))
  }

  // El botón "Quitar" desaparece con su fila: el foco pasa al selector de archivos
  function alQuitar(pendiente: Pendiente) {
    quitar(pendiente)
    entradaRef.current?.focus()
  }

  function alSubir(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const lote = cola
    if (lote.length === 0) return
    setRechazados([])

    void ejecutar(async () => {
      let subidas = 0
      setProgreso({ hechas: 0, total: lote.length })
      try {
        for (const [indice, pendiente] of lote.entries()) {
          if (!activoRef.current) return
          cambiar(pendiente.clave, { subiendo: true, error: undefined })
          try {
            onSubida(await subirImagen(propiedadId, pendiente.archivo, pendiente.descripcion.trim()))
            subidas += 1
            quitar(pendiente)
          } catch (error) {
            if (salirSiVencio(error)) return
            const estado = error instanceof ErrorApi ? error.estado : null
            if (estado === 404) {
              // La propiedad se dio de baja mientras tanto: las que faltan tampoco van a entrar
              const yaSubidas = subidas === 0 ? '' : subidas === 1 ? 'Se agregó 1 imagen. ' : `Se agregaron ${subidas} imágenes. `
              onResultado({ texto: `${yaSubidas}La propiedad ya no está activa: no se pueden agregar más imágenes.`, error: true })
              return
            }
            cambiar(pendiente.clave, { subiendo: false, error: errorDeSubida(estado) })
          }
          setProgreso({ hechas: indice + 1, total: lote.length })
        }
      } finally {
        // Pase lo que pase, no queda una subida a medio mostrar
        setProgreso(null)
        setCola((actual) => actual.map((pendiente) => (pendiente.subiendo ? { ...pendiente, subiendo: false } : pendiente)))
      }

      const fallidas = lote.length - subidas
      if (fallidas === 0) onResultado({ texto: subidas === 1 ? 'Imagen agregada.' : `Se agregaron ${subidas} imágenes.` })
      else if (subidas === 0)
        onResultado({ texto: `${lote.length === 1 ? 'No pudimos subir la imagen' : 'No pudimos subir ninguna imagen'}. Revisá el motivo más abajo y probá nuevamente.`, error: true })
      else
        onResultado({
          texto: `Se agregaron ${subidas} de ${lote.length} imágenes. ${fallidas === 1 ? 'Quedó 1 sin subir' : `Quedaron ${fallidas} sin subir`}: revisá el motivo más abajo.`,
          error: true,
        })
    })
  }

  const subiendo = progreso !== null
  const textoProgreso = progreso ? `Subiendo ${Math.min(progreso.hechas + 1, progreso.total)} de ${progreso.total}…` : ''

  return (
    <form className={estilos.subida} noValidate onSubmit={alSubir}>
      <h3 className={estilos.subtitulo}>Agregar imágenes</h3>

      <div className={estilos.selector}>
        {/* El selector nativo queda oculto a la vista pero recibe el foco; su etiqueta es el botón */}
        <input
          ref={entradaRef}
          id={`${id}-archivos`}
          type="file"
          multiple
          accept={TIPOS_ACEPTADOS.join(',')}
          disabled={ocupado}
          aria-describedby={`${id}-ayuda`}
          className={`sr-only ${estilos.entrada}`}
          onChange={alElegir}
        />
        <label htmlFor={`${id}-archivos`} className={`boton boton-secundario ${estilos.elegir}`}>
          <IconoMas />
          {cola.length === 0 ? 'Elegir imágenes' : 'Elegir más'}
        </label>
        <p id={`${id}-ayuda`} className={formulario.ayuda}>
          JPG, PNG o WEBP, de hasta 5 MB cada una. Podés elegir varias a la vez.
        </p>
      </div>

      {rechazados.length > 0 && (
        <div role="alert" className={estilos.rechazados}>
          <p>{rechazados.length === 1 ? 'Este archivo no se puede subir:' : 'Estos archivos no se pueden subir:'}</p>
          <ul>
            {rechazados.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        </div>
      )}

      {cola.length > 0 && (
        <>
          <ul role="list" className={estilos.cola} aria-label="Imágenes para subir">
            {cola.map((pendiente) => (
              <li key={pendiente.clave} className={estilos.pendiente} data-subiendo={pendiente.subiendo || undefined}>
                {/* Si el navegador no puede mostrarla, queda el recuadro vacío en lugar del ícono de imagen rota */}
                <img src={pendiente.vista} alt="" className={estilos.vista} onError={(evento) => evento.currentTarget.removeAttribute('src')} />
                <div className={estilos.datos}>
                  <p className={estilos.nombre}>{pendiente.archivo.name}</p>
                  <p className={formulario.ayuda}>{pendiente.subiendo ? 'Subiendo…' : formatearPeso(pendiente.archivo.size)}</p>
                  {pendiente.error && <p className={formulario.aviso}>{pendiente.error}</p>}
                </div>
                <button
                  type="button"
                  className={`boton boton-secundario ${estilos.quitar}`}
                  disabled={ocupado}
                  aria-label={`Quitar ${pendiente.archivo.name}`}
                  title="Quitar"
                  onClick={() => alQuitar(pendiente)}
                >
                  <IconoCerrar />
                </button>
                <div className={`${formulario.campo} ${estilos.descripcion}`}>
                  <label htmlFor={`${id}-descripcion-${pendiente.id}`} className={formulario.etiqueta}>
                    Descripción (opcional)
                  </label>
                  <input
                    id={`${id}-descripcion-${pendiente.id}`}
                    type="text"
                    maxLength={LARGO_DESCRIPCION}
                    value={pendiente.descripcion}
                    disabled={ocupado}
                    placeholder="Qué se ve en la foto"
                    className={formulario.control}
                    onChange={(evento) => cambiar(pendiente.clave, { descripcion: evento.target.value })}
                    // Enter acá no envía el formulario: subiría todas las imágenes con las descripciones a medio escribir
                    onKeyDown={(evento) => {
                      if (evento.key === 'Enter') evento.preventDefault()
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {progreso && (
            <div className={estilos.progreso}>
              <progress value={progreso.hechas} max={progreso.total} aria-label="Progreso de la subida" />
              <p>{textoProgreso}</p>
            </div>
          )}

          <div className={formulario.acciones}>
            <button type="submit" className="boton boton-primario" disabled={ocupado}>
              <IconoSubir />
              {subiendo ? 'Subiendo…' : cola.length === 1 ? 'Subir 1 imagen' : `Subir ${cola.length} imágenes`}
            </button>
          </div>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        {textoProgreso}
      </p>
    </form>
  )
}
