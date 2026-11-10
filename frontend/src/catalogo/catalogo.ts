import { ErrorApi, getJsonPublico } from '../compartido/api/clienteApi.ts'
import type { Pagina } from '../compartido/api/pagina.ts'
import type { FiltrosCatalogo, PublicacionCatalogo, PublicacionDetalle } from './tipos.ts'

// Datos del catálogo público (GET /api/publicaciones, sin autenticación).
//
// Cada respuesta se guarda por URL y las pantallas principales la leen con use() + Suspense:
// - al navegar, React deja la pantalla anterior hasta que llegan los datos: la foto viaja de la
//   tarjeta a la ficha y Atrás vuelve al instante, con el mismo scroll;
// - no hay carreras: cada render lee la respuesta de su propia URL;
// - una respuesta vale 5 minutos; un error queda guardado hasta que se reintenta, para no
//   volver a pedirlo en medio de un render.
// Las promesas nunca fallan: un error vuelve como resultado, para mostrarlo en la pantalla.

export type Resultado<T> = { ok: true; datos: T } | { ok: false; noExiste: boolean }

const POR_PAGINA = 12
const VIGENCIA_DATOS = 5 * 60_000

interface Guardada {
  promesa: Promise<Resultado<unknown>>
  vence: number // un pedido en curso o un error no vencen por tiempo
  fallo: boolean
  intento: number
}

interface Opciones {
  intento?: number // lo sube el botón Reintentar de la pantalla
  renovarError?: boolean // para las secciones que cargan en un efecto, sin botón Reintentar
}

const guardadas = new Map<string, Guardada>()

function pedir<T>(ruta: string, { intento = 0, renovarError = false }: Opciones = {}) {
  const previa = guardadas.get(ruta)
  const reintento = previa?.fallo && (renovarError || previa.intento !== intento)
  if (previa && previa.vence > Date.now() && !reintento) return previa.promesa as Promise<Resultado<T>>

  const guardada = { vence: Infinity, fallo: false, intento } as Guardada
  guardada.promesa = getJsonPublico<T>(ruta).then(
    (datos): Resultado<T> => {
      guardada.vence = Date.now() + VIGENCIA_DATOS
      return { ok: true, datos }
    },
    (error: unknown): Resultado<T> => {
      guardada.fallo = true
      return { ok: false, noExiste: error instanceof ErrorApi && error.estado === 404 }
    },
  )
  guardadas.set(ruta, guardada)
  return guardada.promesa as Promise<Resultado<T>>
}

// Los nombres de la URL pública (operacion, tipo, localidad) se traducen a los del backend
export function listarPublicacionesCatalogo(
  filtros: FiltrosCatalogo,
  pagina: number,
  { tamano = POR_PAGINA, ...opciones }: Opciones & { tamano?: number } = {},
) {
  const params = new URLSearchParams()
  if (filtros.operacion) params.set('tipoOperacion', filtros.operacion)
  if (filtros.tipo) params.set('tipoPropiedad', filtros.tipo)
  if (filtros.localidad) params.set('localidad', filtros.localidad)
  params.set('page', String(pagina))
  params.set('size', String(tamano))
  return pedir<Pagina<PublicacionCatalogo>>(`/api/publicaciones?${params}`, opciones)
}

// La ficha de una publicación visible; si no existe o no está visible, el backend responde 404
export function obtenerPublicacionCatalogo(id: number, opciones?: Opciones) {
  return pedir<PublicacionDetalle>(`/api/publicaciones/${id}`, opciones)
}

// Localidades con publicaciones visibles, ordenadas por el backend; si el pedido falla, ninguna.
// La misma respuesta se convierte una sola vez: use() necesita recibir siempre la misma promesa.
let localidades: { respuesta: Promise<Resultado<string[]>>; lista: Promise<string[]> } | null = null

export function listarLocalidades(opciones?: Opciones) {
  const respuesta = pedir<string[]>('/api/publicaciones/localidades', opciones)
  if (localidades?.respuesta !== respuesta) {
    localidades = { respuesta, lista: respuesta.then((resultado) => (resultado.ok ? resultado.datos : [])) }
  }
  return localidades.lista
}
