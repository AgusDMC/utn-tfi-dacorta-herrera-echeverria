import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { IconoPapelera } from '../../compartido/componentes/Iconos.tsx'
import estilos from './DialogoConfirmacion.module.css'

interface Props {
  titulo: string // la pregunta: "¿Eliminar esta imagen?"
  detalle: string // qué se elimina: su nombre o descripción
  textoConfirmar: string
  onConfirmar: () => void
  onCancelar: () => void
  children: ReactNode // la consecuencia, en una o dos oraciones
}

// Confirmación de una acción destructiva. Se monta cuando hay algo que confirmar y se desmonta
// al responder. Es un <dialog> modal nativo: el navegador atrapa el foco, deja inerte el fondo,
// cierra con Escape y devuelve el foco al botón que lo abrió. El foco arranca en Cancelar.
export default function DialogoConfirmacion({ titulo, detalle, textoConfirmar, onConfirmar, onCancelar, children }: Props) {
  const dialogoRef = useRef<HTMLDialogElement>(null)
  const cancelarRef = useRef<HTMLButtonElement>(null)
  // Un clic cuenta como "en el fondo" solo si también empezó ahí (no al soltar una selección de texto)
  const empezoEnElFondoRef = useRef(false)
  const id = useId()

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo || dialogo.open) return
    dialogo.showModal()
    cancelarRef.current?.focus()
  }, [])

  // El <dialog> ya se cerró (y el navegador devolvió el foco): se avisa qué se eligió
  function alCerrar() {
    if (dialogoRef.current?.returnValue === 'confirmar') onConfirmar()
    else onCancelar()
  }

  // Un clic en el fondo oscuro llega al <dialog>; uno adentro llega a su contenido
  function alApretar(evento: MouseEvent<HTMLDialogElement>) {
    empezoEnElFondoRef.current = evento.target === evento.currentTarget
  }

  function alHacerClic(evento: MouseEvent<HTMLDialogElement>) {
    if (empezoEnElFondoRef.current && evento.target === evento.currentTarget) evento.currentTarget.close()
  }

  return (
    <dialog
      ref={dialogoRef}
      className={estilos.dialogo}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-texto`}
      onClose={alCerrar}
      onMouseDown={alApretar}
      onClick={alHacerClic}
    >
      <div className={estilos.contenido}>
        <h2 id={`${id}-titulo`} className={estilos.titulo}>
          {titulo}
        </h2>
        <p className={estilos.detalle}>{detalle}</p>
        <p id={`${id}-texto`} className={estilos.texto}>
          {children}
        </p>
        <div className={estilos.acciones}>
          <button ref={cancelarRef} type="button" className="boton boton-secundario" onClick={() => dialogoRef.current?.close()}>
            Cancelar
          </button>
          <button type="button" className={`boton ${estilos.confirmar}`} onClick={() => dialogoRef.current?.close('confirmar')}>
            <IconoPapelera />
            {textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  )
}
