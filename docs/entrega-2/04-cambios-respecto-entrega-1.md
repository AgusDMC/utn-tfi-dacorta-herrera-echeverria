# 4. Cambios respecto a la 1.ª entrega

El modelo presentado en la propuesta (1.ª entrega) era una primera aproximación. Al diseñar la base de datos y los módulos en detalle aparecieron casos del negocio que ese modelo no cubría. Esta sección lista cada cambio y su motivo, para que se pueda comparar con la propuesta aprobada.

## 4.1 Modelo de datos

| # | En la propuesta | En esta entrega | Motivo |
|---|---|---|---|
| C1 | Una sola entidad `Propiedad` con precio, operación y estado | `Propiedad` (el inmueble) + `Publicacion` (la oferta) | Una misma propiedad puede ofrecerse en venta y en alquiler a la vez, y publicarse varias veces en el tiempo con distinto precio. Ver D1. |
| C2 | `EstadoPropiedad`: DISPONIBLE, RESERVADA, ALQUILADA, VENDIDA, INACTIVA | `EstadoPublicacion` (ACTIVA, PAUSADA, ELIMINADA) + `EstadoComercial` (DISPONIBLE, RESERVADA, ALQUILADA, VENDIDA) + `propiedad.activa` | El enum original mezclaba dos preguntas distintas: "¿se muestra en la web?" y "¿en qué situación comercial está?". Ahora cada una tiene su campo y sus reglas. |
| C3 | `TipoPropiedad`: CASA, DEPARTAMENTO, TERRENO, LOCAL, OFICINA | CASA, DEPARTAMENTO, PH, DUPLEX | El MVP se enfoca en viviendas, que comparten características (ambientes, dormitorios, baños). Terrenos, locales y oficinas necesitan otros atributos y pasan a mejoras futuras. PH y dúplex son tipos de vivienda muy comunes en el mercado local. Ver D10. |
| C4 | `Propiedad.codigo` | Se quita | No se definió una necesidad de negocio para un código distinto del identificador. Si la inmobiliaria usa códigos propios, se puede agregar sin afectar el resto del modelo. |
| C5 | Consulta asociada a la Propiedad | Consulta asociada a la Publicación | Para saber si el interesado consultaba por la venta o por el alquiler. Ver D3. |
| C6 | "Ubicación" como parte de la dirección | Campo `localidad` separado de `direccion` | La HU-01 pide filtrar por ubicación, y no se puede filtrar bien sobre texto libre. Ver D7. |
| C7 | — | `anio_construccion` | Se guarda el año y no la antigüedad, porque la antigüedad cambia sola cada año. Ver D4. |
| C8 | — | `expensas` en Publicación (siempre en pesos) | Dato habitual en alquileres de departamentos. Ver D5. |
| C9 | — | Fechas de creación, publicación y última actualización | Permiten ordenar el catálogo por lo más reciente y dan trazabilidad (uno de los problemas planteados en la propuesta). |
| C10 | ImagenPropiedad: URL, texto alternativo, orden | + `storage_key`; el texto alternativo se llama `descripcion` | La `storage_key` identifica el archivo en el storage externo para poder borrarlo. Ver D8. |
| C11 | "Un Usuario administrador gestiona propiedades y consultas" | Usuario sin relaciones | Con un solo rol y una sola inmobiliaria, la relación no aporta información. Ver D6. |
| C12 | — | Reglas de negocio explícitas (R1 a R14) y restricciones en la base | La propuesta describía el comportamiento en prosa. Ahora cada regla está escrita y se indica si la garantiza la base o la aplicación. |
| C13 | Flujo de publicación: "al quedar en estado disponible, se publica automáticamente en el catálogo" | Publicar es una acción explícita del administrador (la publicación pasa de `PAUSADA` a `ACTIVA`). `DISPONIBLE` pasa a ser solo el estado comercial. | Es consecuencia de C2: mostrar o no un aviso y su situación comercial ahora son cosas distintas. Además, así el administrador puede cargar la publicación completa (precio, fotos, descripción) antes de que aparezca en la web, sin que un aviso a medio cargar quede visible. |

## 4.2 Módulos

La propuesta listaba funcionalidades (búsqueda y filtrado, registro de consultas, administración de propiedades, gestión de consultas, autenticación). En esta entrega se organizan en módulos con responsabilidades y dependencias definidas:

| Funcionalidad en la propuesta | Módulo en esta entrega |
|---|---|
| Autenticación de administrador | M1 Autenticación y usuarios |
| Administración de propiedades (con imágenes y estados) | M2 Propiedades e imágenes + M3 Publicaciones (consecuencia de C1) |
| Búsqueda y filtrado de propiedades | M4 Catálogo público (listado, filtros y detalle en un solo módulo) |
| Registro y notificación de consultas | M5 Consultas + M6 Notificaciones |
| Gestión y seguimiento de consultas | M5 Consultas |

Se separaron Consultas y Notificaciones porque cambian por motivos distintos: las reglas de seguimiento de una consulta no tienen relación con el canal o el contenido de los avisos.

## 4.3 Repositorio

- La propuesta se movió a [`docs/entrega-1/`](../entrega-1/) y esta entrega vive en [`docs/entrega-2/`](./), para que cada entrega quede identificable.
- Se agregó la carpeta [`/database`](../../database/) con el script DDL (migración Flyway), datos de prueba y pruebas de las reglas de negocio.
- Se actualizó el `README.md` principal (estado del proyecto y enlaces).
- Se corrigió el `.gitignore`, que excluía el Maven Wrapper (`mvnw`, `.mvn/`). El wrapper tiene que estar en el repositorio para que cualquiera (incluido Render) pueda compilar el backend sin instalar Maven.

## 4.4 Proceso de diseño

El modelo se construyó de forma iterativa, siguiendo el ciclo planteado en el material de la materia (generar, analizar críticamente, refinar, iterar):

1. **Versión 0 — Propuesta.** Modelo inicial con cuatro entidades, orientado a describir el alcance.
2. **Versión 1 — Trabajo del equipo.** Al listar los atributos de cada entidad, el equipo separó Propiedad de Publicación (C1), redefinió los estados (C2) y los tipos de propiedad (C3), y armó el primer DER en Mermaid y el listado de módulos.
3. **Versión 2 — Revisión crítica.** Se revisó la versión 1 contra las historias de usuario y la propuesta, con asistencia de una herramienta de IA como apoyo para detectar inconsistencias. Cada observación fue analizada y validada por el equipo. Se detectaron, entre otras: la baja lógica de propiedades sin un campo que la represente, el filtro por ubicación prometido sin un dato filtrable, la antigüedad como dato que se desactualiza, la falta de fechas para ordenar el catálogo, la moneda compartida entre precio y expensas, y la necesidad de un storage externo para las imágenes. Con eso se definieron las reglas de negocio, las restricciones de la base, la separación de módulos y la arquitectura.

El resultado es esta entrega. Se espera que el modelo siga ajustándose durante el desarrollo; los cambios futuros se harán con nuevas migraciones (`V2__...`, `V3__...`) para que quede registro de cada uno.
