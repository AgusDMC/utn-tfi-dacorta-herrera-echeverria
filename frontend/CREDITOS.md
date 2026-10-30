# Créditos de recursos de terceros

## Fotografías (provisorias)

Fotos de [Unsplash](https://unsplash.com), bajo la [Licencia Unsplash](https://unsplash.com/license): uso libre, también comercial, sin necesidad de permiso ni atribución. Se guardan en el repositorio (no se cargan desde Unsplash) y se reemplazarán por fotos reales de la inmobiliaria.

| Archivo | Uso | Origen |
|---|---|---|
| `src/assets/hero/living-960.webp`, `living-1600.webp` | Foto ilustrativa del hero | `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0` |
| `public/demo/propiedad-1/frente.webp` | Datos demo: "Frente de la casa" (propiedad 1 del seed) | `https://images.unsplash.com/photo-1523217582562-09d0def993a6` |
| `public/demo/propiedad-2/living.webp` | Datos demo: "Living con balcón" (propiedad 2 del seed) | `https://images.unsplash.com/photo-1493809842364-78817add7ffb` |
| `public/demo/casa-jardin/portada.jpg` | Datos demo: publicación 4, casa con galería y jardín | Foto de Lisa Anna (@lisaanna195): `https://unsplash.com/photos/a-house-with-a-yard-in-front-of-it-QLaGIke8GvE` |
| `public/demo/duplex-toay/portada.jpg` | Datos demo: publicación 5, dúplex (recortada del lado izquierdo) | Foto de Troy Mortier (@troyscanon): `https://unsplash.com/photos/modern-townhouses-with-geometric-designs-on-a-street-44FRvkxNwcY` |
| `public/demo/depto-balcon/portada.jpg` | Datos demo: publicación 6, departamento con balcón | Foto de Evgeniy Beloshytskiy (@eugeniqa): `https://unsplash.com/photos/apartment-buildings-with-balconies-and-windows-U9oiF9S7QbE` |
| `public/demo/casa-garage/portada.jpg` | Datos demo: publicación 7, casa con garage | Foto de QY Liu (@qy_liu): `https://unsplash.com/photos/a-house-with-a-green-lawn-and-red-flowering-bushes-r5_7Zc_E5zU` |

Las URLs de imagen de `database/seeds/datos_demo.sql` (picsum.photos) son de ejemplo y muestran fotos al azar; por eso los datos demo del frontend usan estas fotos locales, elegidas según la descripción de cada imagen del seed.

## Íconos

Los íconos (lupa del buscador, flechas del carrusel y del visor, flecha de volver y cerrar) son SVG simples dibujados para el proyecto, en línea dentro de los componentes, con trazo de 1.5 px. Los cinco de la ficha de la propiedad (ambientes, dormitorios, baños, superficie y antigüedad, en `FichaPropiedad.tsx`) son del mismo tipo: 24 px, trazo de 1.5 px, `currentColor`. No se usan packs de terceros. Si en el futuro se incorporan íconos de Flaticon, su licencia gratuita exige atribuir al sitio y al autor: registrar acá autor, URL y licencia de cada uno.

## Tipografías

- **Newsreader** — Production Type. SIL Open Font License 1.1. Paquete `@fontsource-variable/newsreader`.
- **Public Sans** — USWDS. SIL Open Font License 1.1. Paquete `@fontsource-variable/public-sans`.

La licencia completa viene incluida en cada paquete (`node_modules/@fontsource-variable/*/LICENSE`).
