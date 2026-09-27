# 2.ª Entrega — Arquitectura y Módulos

> Corresponde al **paso 3 de la hoja de ruta** ("Arquitectura y Módulos", fecha máxima 27/09): esquema de base de datos y listado de módulos. Otorga la condición de Regular.

**Trabajo Final Integrador — Tecnicatura Universitaria en Programación**
**Proyecto:** Sistema Web de Gestión Inmobiliaria
**Equipo:** Franco Leonel Herrera · Manuel Da Corta · Agustín Echeverría Araya
**Tutora:** Sofía Carnevale
**Fecha de entrega:** septiembre 2026

## Contenido de la entrega

| Documento | Qué contiene |
|---|---|
| [1. Modelo de datos](01-modelo-de-datos.md) | DER, enumeraciones, reglas de negocio, decisiones de diseño, diccionario de datos e índices |
| [2. Módulos](02-modulos.md) | Listado de módulos con responsabilidades, funcionalidades, API y dependencias entre módulos |
| [3. Arquitectura](03-arquitectura.md) | Arquitectura en capas, diagrama de paquetes, despliegue, seguridad y riesgos |
| [4. Cambios respecto a la 1.ª entrega](04-cambios-respecto-entrega-1.md) | Qué cambió desde la propuesta y por qué, y cómo fue el proceso de diseño |

| Artefacto | Ubicación |
|---|---|
| Script DDL (esquema PostgreSQL) | [`/database/migrations/V1__esquema_inicial.sql`](../../database/migrations/V1__esquema_inicial.sql) |
| Datos de prueba (DML) | [`/database/seeds/datos_demo.sql`](../../database/seeds/datos_demo.sql) |
| Pruebas de reglas de negocio | [`/database/tests/pruebas_reglas.sql`](../../database/tests/pruebas_reglas.sql) |
| Diagramas (fuente PlantUML + SVG/PNG) | [`diagramas/`](diagramas/) |

## Resumen

**Base de datos:** relacional (PostgreSQL), 5 tablas: `usuario`, `propiedad`, `publicacion`, `imagen_propiedad` y `consulta`. La decisión central del modelo es separar el **inmueble** (`propiedad`) de la **oferta** (`publicacion`), lo que permite ofrecer una misma propiedad en venta y en alquiler, y conservar el historial de publicaciones. Las reglas de negocio críticas (una sola publicación activa por operación, coherencia entre operación y estado comercial, datos de contacto obligatorios en las consultas) están garantizadas por restricciones de la propia base.

**Módulos:** 6 módulos de negocio (Autenticación y usuarios, Propiedades e imágenes, Publicaciones, Catálogo público, Consultas, Notificaciones) sobre una arquitectura en cuatro capas (presentación, aplicación, dominio, infraestructura), sin dependencias circulares entre módulos.

El script DDL fue probado sobre PostgreSQL 16: crea el esquema, carga los datos de prueba y pasan las 13 pruebas de reglas de negocio.
