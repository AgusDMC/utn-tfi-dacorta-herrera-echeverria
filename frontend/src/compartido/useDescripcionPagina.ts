import { useEffect } from 'react'

const LARGO_MAXIMO = 155

// Recorta en el último espacio para no cortar una palabra a la mitad
function resumir(texto: string) {
  if (texto.length <= LARGO_MAXIMO) return texto
  const corte = texto.lastIndexOf(' ', LARGO_MAXIMO - 1)
  return `${texto.slice(0, corte > 0 ? corte : LARGO_MAXIMO - 1)}…`
}

// Cambia la meta description de la página mientras el componente está montado.
// index.html ya trae una: se actualiza esa (un segundo <meta> quedaría duplicado)
// y al salir se restituye la original.
export function useDescripcionPagina(texto: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) return
    const original = meta.content
    meta.content = resumir(texto)
    return () => {
      meta.content = original
    }
  }, [texto])
}
