# Créditos de recursos de terceros

## Fotografías (provisorias)

Fotos de [Unsplash](https://unsplash.com), bajo la [Licencia Unsplash](https://unsplash.com/license): uso libre, también comercial, sin necesidad de permiso ni atribución. Se guardan en el repositorio (no se cargan desde Unsplash) y se reemplazarán por fotos reales de la inmobiliaria.

| Archivo | Uso | Origen |
|---|---|---|
| `src/assets/hero/living-960.webp`, `living-1600.webp` | Foto ilustrativa del hero | `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0` |
| `public/demo/propiedad-1/frente.webp` | Datos demo: "Frente de la casa" (propiedad 1 del seed) | `https://images.unsplash.com/photo-1523217582562-09d0def993a6` |
| `public/demo/propiedad-2/living.webp` | Datos demo: "Living con balcón" (propiedad 2 del seed) | `https://images.unsplash.com/photo-1493809842364-78817add7ffb` |

Las URLs de imagen de `database/seeds/datos_demo.sql` (picsum.photos) son de ejemplo y muestran fotos al azar; por eso los datos demo del frontend usan estas fotos locales, elegidas según la descripción de cada imagen del seed.

## Íconos

Los íconos (lupa del buscador y flechas del carrusel) son SVG simples dibujados para el proyecto, en línea dentro de los componentes, con trazo de 1.5 px. No se usan packs de terceros. Si en el futuro se incorporan íconos de Flaticon, su licencia gratuita exige atribuir al sitio y al autor: registrar acá autor, URL y licencia de cada uno.

## Tipografías

- **Newsreader** — Production Type. SIL Open Font License 1.1. Paquete `@fontsource-variable/newsreader`.
- **Public Sans** — USWDS. SIL Open Font License 1.1. Paquete `@fontsource-variable/public-sans`.

La licencia completa viene incluida en cada paquete (`node_modules/@fontsource-variable/*/LICENSE`).
