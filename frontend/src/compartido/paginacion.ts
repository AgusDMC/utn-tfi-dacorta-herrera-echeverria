// La página actual de un listado va en la URL (?page=0, ?page=1…), desde 0 como en el backend.
// Un valor que falta, no es un entero positivo o es demasiado grande para el backend se toma
// como la primera.
export function leerPagina(params: URLSearchParams) {
  const valor = params.get('page')
  return valor !== null && /^\d{1,7}$/.test(valor) ? Number(valor) : 0
}

// Los mismos parámetros con otra página: conserva los demás (filtros). La primera va sin `page`,
// así cada página tiene una sola URL
export function conPagina(params: URLSearchParams, pagina: number) {
  const nuevos = new URLSearchParams(params)
  if (pagina > 0) nuevos.set('page', String(pagina))
  else nuevos.delete('page')
  return nuevos
}
