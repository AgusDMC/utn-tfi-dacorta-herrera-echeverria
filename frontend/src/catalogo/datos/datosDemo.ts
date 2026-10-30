import type { ImagenPublicacion, PublicacionCatalogo, PublicacionDetalle } from '../tipos.ts'

// Datos de demostración (temporales): se eliminan cuando exista GET /api/catalogo.
// Solo los importa catalogo.ts.
//
// Las publicaciones 1, 2 y 3 salen de database/seeds/datos_demo.sql: son las que el catálogo
// muestra según la regla R1 (activa, de una propiedad activa y DISPONIBLE o RESERVADA).
// Las 4 a 7 no están en el seed: se agregaron para que la home y el catálogo tengan variedad.
//
// Las fotos son locales (/public/demo) porque las URLs del seed son de ejemplo (picsum.photos,
// fotos al azar). Ver frontend/CREDITOS.md.
//
// Orden: de la publicación más reciente a la más vieja.

// La galería usa todas las fotos que tenga cada propiedad. Son fotos ilustrativas (ver CREDITOS.md).
const FRENTE_CASA: ImagenPublicacion = { url: '/demo/propiedad-1/frente.webp', descripcion: 'Frente de la casa' }
const LIVING_DEPTO: ImagenPublicacion = { url: '/demo/propiedad-2/living.webp', descripcion: 'Living con balcón' }
const FOTO_CASA_JARDIN: ImagenPublicacion = {
  url: '/demo/casa-jardin/portada.jpg',
  descripcion: 'Casa de una planta con galería y jardín al frente',
}
const FOTO_DUPLEX: ImagenPublicacion = {
  url: '/demo/duplex-toay/portada.jpg',
  descripcion: 'Dúplex con balcones de madera sobre una calle del barrio',
}
const FOTO_DEPTO_BALCON: ImagenPublicacion = {
  url: '/demo/depto-balcon/portada.jpg',
  descripcion: 'Edificio de departamentos con balcones',
}
const FOTO_CASA_GARAGE: ImagenPublicacion = {
  url: '/demo/casa-garage/portada.jpg',
  descripcion: 'Casa de ladrillo con garage y jardín al frente',
}
// Textos de database/seeds/datos_demo.sql, palabra por palabra. Las dos publicaciones de la
// casa comparten propiedad, y con ella su resumen.
const RESUMEN_CASA = 'Casa de 3 ambientes con patio y parrilla, a 5 cuadras del centro.'
const RESUMEN_DEPTO = 'Departamento de 2 ambientes luminoso, a estrenar, con balcón.'

export const PUBLICACIONES_DEMO: PublicacionCatalogo[] = [
  {
    id: 7,
    titulo: 'Casa 4 amb. con garage',
    tipoOperacion: 'ALQUILER',
    precio: 720000,
    moneda: 'PESOS',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 4,
    superficieTotal: 190,
    portada: FOTO_CASA_GARAGE,
  },
  {
    id: 6,
    titulo: 'Depto 2 amb. con balcón',
    tipoOperacion: 'VENTA',
    precio: 62000,
    moneda: 'DOLARES',
    expensas: 38000,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'DEPARTAMENTO',
    localidad: 'Santa Rosa',
    cantAmbientes: 2,
    superficieTotal: 48,
    portada: FOTO_DEPTO_BALCON,
  },
  {
    id: 5,
    titulo: 'Dúplex 3 amb. con balcón',
    tipoOperacion: 'VENTA',
    precio: 120000,
    moneda: 'DOLARES',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'DUPLEX',
    localidad: 'Toay',
    cantAmbientes: 3,
    superficieTotal: 95,
    portada: FOTO_DUPLEX,
  },
  {
    id: 4,
    titulo: 'Casa 3 amb. con galería y jardín',
    tipoOperacion: 'VENTA',
    precio: 98000,
    moneda: 'DOLARES',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 3,
    superficieTotal: 140,
    portada: FOTO_CASA_JARDIN,
  },
  {
    id: 3,
    titulo: 'Depto 2 amb. a estrenar',
    tipoOperacion: 'ALQUILER',
    precio: 420000,
    moneda: 'PESOS',
    expensas: 45000,
    estadoComercial: 'RESERVADA',
    tipoPropiedad: 'DEPARTAMENTO',
    localidad: 'Santa Rosa',
    cantAmbientes: 2,
    superficieTotal: 52.5,
    portada: LIVING_DEPTO,
  },
  {
    id: 1,
    titulo: 'Casa 3 amb. con patio',
    tipoOperacion: 'VENTA',
    precio: 85000,
    moneda: 'DOLARES',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 3,
    superficieTotal: 180,
    portada: FRENTE_CASA,
  },
  {
    // Misma propiedad que la publicación 1: comparte las fotos (decisión D2)
    id: 2,
    titulo: 'Casa 3 amb. con patio',
    tipoOperacion: 'ALQUILER',
    precio: 650000,
    moneda: 'PESOS',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 3,
    superficieTotal: 180,
    portada: FRENTE_CASA,
  },
]

// Lo que la ficha agrega al listado, por id de publicación (descripción de la publicación y
// datos de su propiedad, tomados de database/seeds/datos_demo.sql).
type DetalleDemo = Omit<PublicacionDetalle, keyof PublicacionCatalogo>

export const DETALLES_DEMO: Record<number, DetalleDemo> = {
  4: {
    resumen: 'Casa de 3 ambientes con galería y jardín al frente.',
    descripcion: 'Casa de 3 ambientes con galería y jardín al frente.',
    imagenes: [FOTO_CASA_JARDIN],
    cantDormitorios: 2,
    cantBanios: 1,
    tienePatio: true,
    anioConstruccion: 1990,
  },
  5: {
    resumen: 'Dúplex de 3 ambientes en barrio nuevo, con balcón en planta alta.',
    descripcion: 'Dúplex de 3 ambientes en barrio nuevo, con balcón en planta alta.',
    imagenes: [FOTO_DUPLEX],
    cantDormitorios: 2,
    cantBanios: 2,
    tienePatio: false,
    anioConstruccion: 2022,
  },
  6: {
    resumen: 'Departamento de 2 ambientes con balcón, en un edificio a pocas cuadras del centro.',
    descripcion: 'Departamento de 2 ambientes con balcón, en un edificio a pocas cuadras del centro.',
    imagenes: [FOTO_DEPTO_BALCON],
    cantDormitorios: 1,
    cantBanios: 1,
    tienePatio: false,
    anioConstruccion: 2008,
  },
  7: {
    resumen: 'Casa de 4 ambientes con garage y jardín al frente, en un barrio residencial.',
    descripcion: 'Casa de 4 ambientes con garage y jardín al frente, en un barrio residencial.',
    imagenes: [FOTO_CASA_GARAGE],
    cantDormitorios: 3,
    cantBanios: 2,
    tienePatio: true,
    anioConstruccion: 1995,
  },
  1: {
    resumen: RESUMEN_CASA,
    descripcion: RESUMEN_CASA,
    imagenes: [FRENTE_CASA],
    cantDormitorios: 2,
    cantBanios: 1,
    tienePatio: true,
    anioConstruccion: 1998,
  },
  2: {
    resumen: RESUMEN_CASA,
    descripcion: 'Casa de 3 ambientes con patio y parrilla. Contrato por 3 años, ajuste por ICL.',
    imagenes: [FRENTE_CASA],
    cantDormitorios: 2,
    cantBanios: 1,
    tienePatio: true,
    anioConstruccion: 1998,
  },
  3: {
    resumen: RESUMEN_DEPTO,
    descripcion: RESUMEN_DEPTO,
    imagenes: [LIVING_DEPTO],
    cantDormitorios: 1,
    cantBanios: 1,
    tienePatio: false,
    // "A estrenar": el año de construcción es el actual, así la antigüedad (0) es coherente con el título
    anioConstruccion: new Date().getFullYear(),
  },
}
