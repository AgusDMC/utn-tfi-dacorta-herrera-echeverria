import type { PublicacionCatalogo } from '../tipos.ts'

// =====================================================================
// DATOS DE DEMOSTRACIÓN (TEMPORALES) — se eliminan cuando exista GET /api/catalogo.
// Solo los importa catalogo/catalogo.ts: ningún componente debe usarlos directamente.
//
// Fuente: database/seeds/datos_demo.sql. Solo están las publicaciones que
// el catálogo público muestra según la regla R1 (ACTIVA, de una propiedad
// activa y con estado DISPONIBLE o RESERVADA): las publicaciones 1, 2 y 3.
// Quedan afuera la 4 y la 5 (PAUSADA) y la propiedad 5 (dada de baja).
//
// Las URLs de imagen del seed son de ejemplo (picsum.photos, fotos al azar).
// Acá se reemplazan por fotos locales en /public/demo que respetan la
// descripción de cada imagen del seed. Ver frontend/CREDITOS.md.
//
// Orden: de la publicación más reciente a la más vieja, como el catálogo.
// =====================================================================

export const PUBLICACIONES_DEMO: PublicacionCatalogo[] = [
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
    portada: { url: '/demo/propiedad-2/living.webp', descripcion: 'Living con balcón' },
  },
  {
    id: 1,
    titulo: 'Casa 3 amb. con patio — Venta',
    tipoOperacion: 'VENTA',
    precio: 85000,
    moneda: 'DOLARES',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 3,
    superficieTotal: 180,
    portada: { url: '/demo/propiedad-1/frente.webp', descripcion: 'Frente de la casa' },
  },
  {
    // Misma propiedad que la publicación 1: comparte las fotos (decisión D2)
    id: 2,
    titulo: 'Casa 3 amb. con patio — Alquiler',
    tipoOperacion: 'ALQUILER',
    precio: 650000,
    moneda: 'PESOS',
    expensas: null,
    estadoComercial: 'DISPONIBLE',
    tipoPropiedad: 'CASA',
    localidad: 'Santa Rosa',
    cantAmbientes: 3,
    superficieTotal: 180,
    portada: { url: '/demo/propiedad-1/frente.webp', descripcion: 'Frente de la casa' },
  },
]
