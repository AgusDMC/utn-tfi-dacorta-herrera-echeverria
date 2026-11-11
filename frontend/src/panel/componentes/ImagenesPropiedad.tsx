import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import { cambiarDescripcionImagen, eliminarImagen, listarImagenes, subirImagen } from '../imagenes/imagenes.ts'
import type { ImagenPropiedad } from '../imagenes/tipos.ts'
import formulario from './FormularioPanel.module.css'
import estilos from './ImagenesPropiedad.module.css'

// Los mismos límites que valida el backend, para avisar antes de subir
const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp']
const PESO_MAXIMO = 5 * 1024 * 1024
const LARGO_DESCRIPCION = 200

const ARCHIVO_INVALIDO = 'Elegí una imagen JPG, PNG o WEBP.'
const ARCHIVO_GRANDE = 'La imagen no puede superar los 5 MB.'

interface Aviso {
  texto: string
  error?: boolean
}

// La acción en curso: mientras dura, las demás quedan deshabilitadas
type Accion = { tipo: 'subir' } | { tipo: 'guardar' | 'eliminar'; id: number }

// Si la miniatura no carga, queda un recuadro con un aviso en lugar de la imagen rota
function Miniatura({ url, alt }: { url: string; alt: string }) {
  const [fallo, setFallo] = useState(false)
  return (
    <div className={estilos.miniatura}>
      {fallo ? <span>No se pudo cargar</span> : <img src={url} alt={alt} loading="lazy" onError={() => setFallo(true)} />}
    </div>
  )
}

// Imágenes de una propiedad dentro de su pantalla de edición: se listan en el orden del sitio,
// se suben de a una y se les puede cambiar la descripción o eliminarlas. Cada cambio se guarda
// en el momento, aparte del formulario de la propiedad. La página lo monta de nuevo al cambiar
// de propiedad (key), así que no hace falta reiniciar su estado.
export default function ImagenesPropiedad({ propiedadId }: { propiedadId: number }) {
  const salirSiVencio = useSalirSiVencio()
  const id = useId()
  const [imagenes, setImagenes] = useState<ImagenPropiedad[] | null>(null)
  const [falloCarga, setFalloCarga] = useState(false)
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null)
  const [editando, setEditando] = useState<number | null>(null)
  const [accion, setAccion] = useState<Accion | null>(null)
  const seccionRef = useRef<HTMLElement>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda acción
  const ocupadoRef = useRef(false)
  // Al salir de la edición, el foco vuelve al botón "Editar descripción" de esa imagen
  const devolverFocoRef = useRef<number | null>(null)

  useEffect(() => {
    const control = new AbortController()
    listarImagenes(propiedadId, control.signal)
      .then((lista) => {
        if (!control.signal.aborted) setImagenes(lista)
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted && !salirSiVencio(error)) setFalloCarga(true)
      })
    return () => control.abort()
  }, [propiedadId, intento, salirSiVencio])

  // El aviso recibe el foco: el botón que lo tenía quedó deshabilitado o desapareció. Si mientras
  // tanto la persona pasó a otra parte de la pantalla (los datos de la propiedad), no se lo quita.
  useEffect(() => {
    if (!aviso) return
    const activo = document.activeElement
    if (!activo || activo === document.body || seccionRef.current?.contains(activo)) avisoRef.current?.focus()
  }, [aviso])

  // Corre una acción de a una: si ya hay otra en curso, no hace nada
  async function ejecutar(nueva: Accion, tarea: () => Promise<void>) {
    if (ocupadoRef.current) return
    ocupadoRef.current = true
    setAccion(nueva)
    setAviso(null)
    try {
      await tarea()
    } finally {
      ocupadoRef.current = false
      setAccion(null)
    }
  }

  // Una imagen que ya no existe (se eliminó desde otra pestaña) se saca de la lista
  function quitar(imagenId: number) {
    setImagenes((actuales) => actuales && actuales.filter((imagen) => imagen.id !== imagenId))
    setEditando((actual) => (actual === imagenId ? null : actual))
  }

  function alSubir(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const datos = new FormData(form)
    const archivo = datos.get('archivo')
    const descripcion = String(datos.get('descripcion') ?? '').trim()

    let invalido: string | null = null
    if (!(archivo instanceof File) || archivo.size === 0 || !TIPOS_ACEPTADOS.includes(archivo.type)) invalido = ARCHIVO_INVALIDO
    else if (archivo.size > PESO_MAXIMO) invalido = ARCHIVO_GRANDE
    if (invalido || !(archivo instanceof File)) {
      // Se actualiza el DOM antes de mover el foco, para que el lector de pantalla lea el aviso
      flushSync(() => {
        setErrorArchivo(invalido)
        setAviso(null)
      })
      form.querySelector<HTMLInputElement>('input[type="file"]')?.focus()
      return
    }

    void ejecutar({ tipo: 'subir' }, async () => {
      try {
        const nueva = await subirImagen(propiedadId, archivo, descripcion)
        setImagenes((actuales) => [...(actuales ?? []), nueva])
        form.reset()
        setAviso({ texto: 'Imagen agregada.' })
      } catch (error) {
        if (salirSiVencio(error)) return
        const estado = error instanceof ErrorApi ? error.estado : null
        // 413: supera el límite del servidor; 400: el backend no la aceptó como imagen
        if (estado === 413) setAviso({ texto: ARCHIVO_GRANDE, error: true })
        else if (estado === 400) setAviso({ texto: ARCHIVO_INVALIDO, error: true })
        else setAviso({ texto: 'No pudimos subir la imagen. Probá nuevamente.', error: true })
      }
    })
  }

  function alGuardarDescripcion(evento: FormEvent<HTMLFormElement>, imagen: ImagenPropiedad) {
    evento.preventDefault()
    const descripcion = String(new FormData(evento.currentTarget).get('descripcion') ?? '').trim()

    void ejecutar({ tipo: 'guardar', id: imagen.id }, async () => {
      try {
        // Sin texto se guarda vacía (null): el sitio usa entonces su texto alternativo por defecto
        const actualizada = await cambiarDescripcionImagen(imagen.id, descripcion || null)
        setImagenes((actuales) => actuales && actuales.map((otra) => (otra.id === actualizada.id ? actualizada : otra)))
        setEditando(null)
        setAviso({ texto: 'Descripción guardada.' })
      } catch (error) {
        if (salirSiVencio(error)) return
        if (error instanceof ErrorApi && error.estado === 404) {
          quitar(imagen.id)
          setAviso({ texto: 'La imagen ya no existía.' })
        } else {
          setAviso({ texto: 'No pudimos guardar la descripción. Probá nuevamente.', error: true })
        }
      }
    })
  }

  function alEliminar(imagen: ImagenPropiedad) {
    if (ocupadoRef.current || !window.confirm('¿Querés eliminar esta imagen?')) return

    void ejecutar({ tipo: 'eliminar', id: imagen.id }, async () => {
      try {
        await eliminarImagen(imagen.id)
        quitar(imagen.id)
        setAviso({ texto: 'Imagen eliminada.' })
      } catch (error) {
        if (salirSiVencio(error)) return
        if (error instanceof ErrorApi && error.estado === 404) {
          quitar(imagen.id)
          setAviso({ texto: 'La imagen ya no existía.' })
        } else {
          setAviso({ texto: 'No pudimos eliminar la imagen. Probá nuevamente.', error: true })
        }
      }
    })
  }

  function cancelarEdicion(imagenId: number) {
    devolverFocoRef.current = imagenId
    setEditando(null)
  }

  const ocupado = accion !== null

  return (
    <section ref={seccionRef} className={estilos.seccion} aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className={estilos.titulo}>
        Imágenes
      </h2>
      <p className={formulario.ayuda}>
        La primera es la portada en el sitio. Cada imagen se guarda en el momento, aparte de los datos de la propiedad.
      </p>

      {aviso && (
        <p ref={avisoRef} tabIndex={-1} className={estilos.resultado} data-error={aviso.error || undefined}>
          {aviso.texto}
        </p>
      )}

      {falloCarga ? (
        <div role="alert" className={estilos.estado}>
          <p>No pudimos cargar las imágenes.</p>
          <button
            type="button"
            className="boton boton-secundario"
            onClick={() => {
              setFalloCarga(false)
              setIntento((n) => n + 1)
            }}
          >
            Reintentar
          </button>
        </div>
      ) : !imagenes ? (
        <p role="status" className={estilos.estado}>
          Cargando imágenes…
        </p>
      ) : imagenes.length === 0 ? (
        <p className={estilos.estado}>Esta propiedad todavía no tiene imágenes.</p>
      ) : (
        <ul role="list" className={estilos.lista}>
          {imagenes.map((imagen, indice) => {
            const nombre = `Imagen ${indice + 1}`
            return (
              <li key={imagen.id} className={estilos.item}>
                <Miniatura url={imagen.url} alt={imagen.descripcion || `${nombre} de la propiedad`} />

                {editando === imagen.id ? (
                  <form className={estilos.edicion} onSubmit={(evento) => alGuardarDescripcion(evento, imagen)}>
                    <div className={formulario.campo}>
                      <label htmlFor={`${id}-descripcion-${imagen.id}`} className={formulario.etiqueta}>
                        Descripción de la {nombre.toLowerCase()}
                      </label>
                      <input
                        id={`${id}-descripcion-${imagen.id}`}
                        name="descripcion"
                        type="text"
                        maxLength={LARGO_DESCRIPCION}
                        defaultValue={imagen.descripcion ?? ''}
                        autoFocus
                        className={formulario.control}
                      />
                    </div>
                    <div className={formulario.acciones}>
                      <button type="submit" className="boton boton-primario" disabled={ocupado}>
                        {accion?.tipo === 'guardar' ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button type="button" className="boton boton-secundario" disabled={ocupado} onClick={() => cancelarEdicion(imagen.id)}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={estilos.datos}>
                      <p className={estilos.orden}>
                        {nombre}
                        {indice === 0 && ' · Portada'}
                      </p>
                      <p className={imagen.descripcion ? estilos.descripcion : formulario.ayuda}>{imagen.descripcion || 'Sin descripción'}</p>
                    </div>
                    <div className={estilos.acciones}>
                      <button
                        ref={(boton) => {
                          if (boton && devolverFocoRef.current === imagen.id) {
                            devolverFocoRef.current = null
                            boton.focus()
                          }
                        }}
                        type="button"
                        className="boton boton-secundario"
                        disabled={ocupado}
                        onClick={() => setEditando(imagen.id)}
                      >
                        Editar descripción<span className="sr-only"> de la {nombre.toLowerCase()}</span>
                      </button>
                      <button type="button" className={`boton ${estilos.eliminar}`} disabled={ocupado} onClick={() => alEliminar(imagen)}>
                        {accion?.tipo === 'eliminar' && accion.id === imagen.id ? 'Eliminando…' : 'Eliminar'}
                        <span className="sr-only"> {nombre.toLowerCase()}</span>
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {imagenes && (
        <form className={estilos.carga} noValidate onSubmit={alSubir}>
          <h3 className={estilos.subtitulo}>Agregar una imagen</h3>
          <div className={formulario.campo}>
            <label htmlFor={`${id}-archivo`} className={formulario.etiqueta}>
              Archivo
            </label>
            <input
              id={`${id}-archivo`}
              name="archivo"
              type="file"
              accept={TIPOS_ACEPTADOS.join(',')}
              required
              aria-invalid={Boolean(errorArchivo) || undefined}
              aria-describedby={`${id}-archivo-ayuda${errorArchivo ? ` ${id}-archivo-error` : ''}`}
              className={estilos.archivo}
              onChange={() => setErrorArchivo(null)}
            />
            <p id={`${id}-archivo-ayuda`} className={formulario.ayuda}>
              JPG, PNG o WEBP, de hasta 5 MB.
            </p>
            {errorArchivo && (
              <p id={`${id}-archivo-error`} className={formulario.aviso}>
                {errorArchivo}
              </p>
            )}
          </div>
          <div className={formulario.campo}>
            <label htmlFor={`${id}-descripcion`} className={formulario.etiqueta}>
              Descripción (opcional)
            </label>
            <input id={`${id}-descripcion`} name="descripcion" type="text" maxLength={LARGO_DESCRIPCION} aria-describedby={`${id}-descripcion-ayuda`} className={formulario.control} />
            <p id={`${id}-descripcion-ayuda`} className={formulario.ayuda}>
              Qué se ve en la foto, por ejemplo &ldquo;Frente de la casa&rdquo;. La usan los lectores de pantalla.
            </p>
          </div>
          <div className={formulario.acciones}>
            <button type="submit" className="boton boton-primario" disabled={ocupado}>
              {accion?.tipo === 'subir' ? 'Subiendo…' : 'Subir imagen'}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {accion?.tipo === 'subir' ? 'Subiendo…' : ''}
          </p>
        </form>
      )}
    </section>
  )
}
