// Datos de la inmobiliaria. Cambiar acá para que se actualicen en todo el sitio.
// El logotipo tipográfico muestra el nombre arriba y el descriptor abajo.
export const MARCA = {
  nombre: 'Nexo',
  descriptor: 'Propiedades',
}

export const NOMBRE_INMOBILIARIA = `${MARCA.nombre} ${MARCA.descriptor}`

// Arma el título de la pestaña del navegador: "Sección | Nexo Propiedades".
export function tituloPagina(seccion?: string) {
  return seccion ? `${seccion} | ${NOMBRE_INMOBILIARIA}` : NOMBRE_INMOBILIARIA
}
