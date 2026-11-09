# Créditos de recursos de terceros

## Fotografías (provisorias)

Fotos de [Unsplash](https://unsplash.com), bajo la [Licencia Unsplash](https://unsplash.com/license): uso libre, también comercial, sin necesidad de permiso ni atribución. Se guardan en el repositorio (no se cargan desde Unsplash) y se reemplazarán por fotos reales de la inmobiliaria.

| Archivo | Uso | Origen |
|---|---|---|
| `src/assets/hero/living-960.webp`, `living-1600.webp` | Foto ilustrativa del hero | `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0` |

Las fotos de las publicaciones las sirve el backend. Las URLs de `database/seeds/datos_demo.sql` (picsum.photos) son de ejemplo y muestran fotos al azar; se reemplazan por las fotos reales de cada propiedad.

## Íconos

Los íconos (lupa del buscador, flechas del carrusel y del visor, flecha de volver y cerrar) son SVG simples dibujados para el proyecto, en línea dentro de los componentes, con trazo de 1.5 px. Los cinco de la ficha de la propiedad (ambientes, dormitorios, baños, superficie y antigüedad, en `FichaPropiedad.tsx`) son del mismo tipo: 24 px, trazo de 1.5 px, `currentColor`. No se usan packs de terceros. Si en el futuro se incorporan íconos de Flaticon, su licencia gratuita exige atribuir al sitio y al autor: registrar acá autor, URL y licencia de cada uno.

## Tipografías

- **Newsreader** — Production Type. SIL Open Font License 1.1. Paquete `@fontsource-variable/newsreader`.
- **Public Sans** — USWDS. SIL Open Font License 1.1. Paquete `@fontsource-variable/public-sans`.

La licencia completa viene incluida en cada paquete (`node_modules/@fontsource-variable/*/LICENSE`).
