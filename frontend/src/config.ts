// Datos de la inmobiliaria. Cambiar acá para que se actualicen en todo el sitio.
// El logotipo tipográfico muestra el nombre arriba y el descriptor abajo.
export const MARCA = {
  nombre: 'Nexo',
  descriptor: 'Propiedades',
}

export const NOMBRE_INMOBILIARIA = `${MARCA.nombre} ${MARCA.descriptor}`

// Datos de contacto. La inmobiliaria es ficticia (proyecto académico): todos estos datos son
// inventados. Un dato que no se define no se muestra en el sitio.
export const CONTACTO: {
  telefono?: string
  email?: string
  direccion?: string
  horario?: string
  matricula?: string
} = {
  telefono: '(02954) 00-0000',
  email: 'contacto@nexopropiedades.example',
  direccion: 'Av. Principal 1250, Santa Rosa, La Pampa',
  horario: 'Lunes a viernes de 9 a 13 y de 16 a 20. Sábados de 9 a 13.',
  matricula: 'N.º 1234',
}

// Arma el título de la pestaña del navegador: "Sección | Nexo Propiedades".
export function tituloPagina(seccion?: string) {
  return seccion ? `${seccion} | ${NOMBRE_INMOBILIARIA}` : NOMBRE_INMOBILIARIA
}
