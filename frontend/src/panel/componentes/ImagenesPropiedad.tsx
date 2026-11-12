import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ErrorApi } from '../../compartido/api/clienteApi.ts'
import { IconoLapiz, IconoPapelera } from '../../compartido/componentes/Iconos.tsx'
import { useSalirSiVencio } from '../autenticacion/useSalirSiVencio.ts'
import { cambiarDescripcionImagen, eliminarImagen, listarImagenes } from '../imagenes/imagenes.ts'
import { LARGO_DESCRIPCION, type ImagenPropiedad } from '../imagenes/tipos.ts'
import Aviso, { type Resultado } from './Aviso.tsx'
import DialogoConfirmacion from './DialogoConfirmacion.tsx'
import formulario from './FormularioPanel.module.css'
import estilos from './ImagenesPropiedad.module.css'
import SubidaImagenes from './SubidaImagenes.tsx'

// La acción en curso: mientras dura, las demás quedan deshabilitadas
type Accion = { tipo: 'subir' } | { tipo: 'guardar' | 'eliminar'; id: number }

// Si la foto no carga, queda un recuadro con un aviso en lugar de la imagen rota
function Foto({ url, alt }: { url: string; alt: string }) {
  const [fallo, setFallo] = useState(false)
  return fallo ? <span className={estilos.sinFoto}>No se pudo cargar</span> : <img src={url} alt={alt} loading="lazy" onError={() => setFallo(true)} />
}

// Imágenes de una propiedad dentro de su pantalla de edición: una galería en el orden del sitio,
// con la descripción y la baja de cada una, y debajo la subida de imágenes nuevas. Cada cambio se
// guarda en el momento, aparte del formulario de la propiedad. La página lo monta de nuevo al
// cambiar de propiedad (key), así que no hace falta reiniciar su estado.
export default function ImagenesPropiedad({ propiedadId }: { propiedadId: number }) {
  const salirSiVencio = useSalirSiVencio()
  const id = useId()
  const [imagenes, setImagenes] = useState<ImagenPropiedad[] | null>(null)
  const [falloCarga, setFalloCarga] = useState(false)
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState<Resultado | null>(null)
  const [editando, setEditando] = useState<number | null>(null)
  const [porEliminar, setPorEliminar] = useState<ImagenPropiedad | null>(null) // espera la confirmación
  const [accion, setAccion] = useState<Accion | null>(null)
  const seccionRef = useRef<HTMLElement>(null)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  // El estado tarda un render en reflejarse; el ref corta en el acto una segunda acción
  const ocupadoRef = useRef(false)
  // Al salir de la edición, el foco vuelve al botón "Editar" de esa imagen
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

  // Una imagen que ya no existe (se eliminó desde otra pestaña) se saca de la galería
  function quitar(imagenId: number) {
    setImagenes((actuales) => actuales && actuales.filter((imagen) => imagen.id !== imagenId))
    setEditando((actual) => (actual === imagenId ? null : actual))
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
    setPorEliminar(null)

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
  const posicionPorEliminar = porEliminar && imagenes ? imagenes.findIndex((imagen) => imagen.id === porEliminar.id) : -1

  return (
    <section ref={seccionRef} className={estilos.seccion} aria-labelledby={`${id}-titulo`}>
      <div className={estilos.encabezado}>
        <h2 id={`${id}-titulo`} className={estilos.titulo}>
          Imágenes
        </h2>
        <p className={formulario.ayuda}>La primera es la portada en el sitio. Cada cambio se guarda en el momento, aparte de los datos de la propiedad.</p>
      </div>

      <div className={estilos.cuerpo}>
        {aviso && (
          <Aviso ref={avisoRef} error={aviso.error}>
            {aviso.texto}
          </Aviso>
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
          <ul role="list" className={estilos.galeria}>
            {imagenes.map((imagen, indice) => {
              const nombre = `imagen ${indice + 1}`
              const enEdicion = editando === imagen.id
              const eliminando = accion?.tipo === 'eliminar' && accion.id === imagen.id
              return (
                <li key={imagen.id} className={estilos.tarjeta} data-edicion={enEdicion || undefined} data-eliminando={eliminando || undefined}>
                  <div className={estilos.foto}>
                    <Foto url={imagen.url} alt={imagen.descripcion || `Imagen ${indice + 1} de la propiedad`} />
                    <p className={estilos.sello} data-portada={indice === 0 || undefined}>
                      <span className="sr-only">Imagen </span>
                      {indice + 1}
                      {indice === 0 && ' · Portada'}
                    </p>
                  </div>

                  {enEdicion ? (
                    <form className={estilos.edicion} onSubmit={(evento) => alGuardarDescripcion(evento, imagen)}>
                      <div className={formulario.campo}>
                        <label htmlFor={`${id}-descripcion-${imagen.id}`} className={formulario.etiqueta}>
                          Descripción de la {nombre}
                        </label>
                        <input
                          id={`${id}-descripcion-${imagen.id}`}
                          name="descripcion"
                          type="text"
                          maxLength={LARGO_DESCRIPCION}
                          defaultValue={imagen.descripcion ?? ''}
                          autoFocus
                          aria-describedby={`${id}-descripcion-${imagen.id}-ayuda`}
                          className={formulario.control}
                        />
                        <p id={`${id}-descripcion-${imagen.id}-ayuda`} className={formulario.ayuda}>
                          Qué se ve en la foto, por ejemplo &ldquo;Frente de la casa&rdquo;. La usan los lectores de pantalla.
                        </p>
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
                    <div className={estilos.pie}>
                      <p className={imagen.descripcion ? estilos.descripcion : formulario.ayuda}>{imagen.descripcion || 'Sin descripción'}</p>
                      <div className={estilos.acciones}>
                        <button
                          ref={(boton) => {
                            if (boton && devolverFocoRef.current === imagen.id) {
                              devolverFocoRef.current = null
                              boton.focus()
                            }
                          }}
                          type="button"
                          className={`boton boton-secundario ${estilos.editar}`}
                          disabled={ocupado}
                          onClick={() => setEditando(imagen.id)}
                        >
                          <IconoLapiz />
                          Editar<span className="sr-only"> la descripción de la {nombre}</span>
                        </button>
                        <button
                          type="button"
                          className={`boton boton-peligro ${estilos.eliminar}`}
                          disabled={ocupado}
                          aria-label={eliminando ? `Eliminando la ${nombre}…` : `Eliminar la ${nombre}`}
                          title="Eliminar"
                          onClick={() => setPorEliminar(imagen)}
                        >
                          <IconoPapelera />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {imagenes && (
          <SubidaImagenes
            propiedadId={propiedadId}
            ocupado={ocupado}
            ejecutar={(tarea) => ejecutar({ tipo: 'subir' }, tarea)}
            onSubida={(nueva) => setImagenes((actuales) => [...(actuales ?? []), nueva])}
            onResultado={setAviso}
          />
        )}
      </div>

      {porEliminar && (
        <DialogoConfirmacion
          titulo="¿Eliminar esta imagen?"
          detalle={`Imagen ${posicionPorEliminar + 1}${porEliminar.descripcion ? ` · ${porEliminar.descripcion}` : ''}`}
          textoConfirmar="Eliminar"
          onConfirmar={() => alEliminar(porEliminar)}
          onCancelar={() => setPorEliminar(null)}
        >
          {posicionPorEliminar === 0 && imagenes && imagenes.length > 1 && 'Es la portada: la imagen siguiente va a ocupar su lugar. '}
          Deja de verse en el sitio y no se puede recuperar.
        </DialogoConfirmacion>
      )}
    </section>
  )
}
