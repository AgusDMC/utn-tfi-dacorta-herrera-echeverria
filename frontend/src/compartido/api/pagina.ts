// Una página de un listado, tal como la devuelve el backend (PaginaResponseDto).
// `page` empieza en 0.
export interface Pagina<T> {
  results: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
