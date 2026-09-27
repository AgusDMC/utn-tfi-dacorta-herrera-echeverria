# Sistema Web de Gestión Inmobiliaria

Trabajo Final Integrador — Tecnicatura Universitaria en Programación

## Descripción

Aplicación web pensada para inmobiliarias pequeñas y medianas que hoy gestionan sus propiedades y consultas de forma manual (planillas, WhatsApp, redes sociales). El sistema centraliza en un solo lugar la publicación y administración de propiedades en venta o alquiler, la búsqueda filtrada para visitantes y el seguimiento de las consultas de potenciales clientes.

Incluye un catálogo público con filtros, ficha de detalle con galería de imágenes, formulario de consulta con notificación automática por correo, y un panel administrativo con autenticación para gestionar propiedades, publicaciones, imágenes y el estado de cada consulta.

## Equipo

| Integrante | Área a cargo |
|---|---|
| Franco Leonel Herrera | Backend (Spring Boot, API REST, lógica de negocio) |
| Manuel Da Corta | Frontend (React + TypeScript, catálogo y panel) |
| Agustín Echeverría Araya | Base de datos (diseño del esquema PostgreSQL, persistencia) |

**Tutora:** Sofía Carnevale

## Stack tecnológico

- **Frontend:** React + TypeScript
- **Backend:** Spring Boot (Java) — API REST, Spring Security + JWT, Spring Data JPA, Flyway
- **Base de datos:** PostgreSQL
- **Servicios externos:** storage de imágenes (Cloudinary) y correo transaccional
- **Despliegue:** Frontend en Vercel · Backend en Render · Base de datos en Railway

## Estructura del repositorio

```
/frontend       -> Aplicación React (catálogo público + panel administrativo)
/backend        -> API REST en Spring Boot
/database       -> Scripts SQL: migraciones (DDL), datos de prueba (DML) y pruebas
/docs           -> Documentación de cada entrega
   /entrega-1   -> Propuesta de proyecto
   /entrega-2   -> Arquitectura y módulos: modelo de datos, módulos y arquitectura
README.md       -> Este archivo
```

## Estado del proyecto

| Instancia | Estado | Documentación |
|---|---|---|
| 1.ª Entrega — Propuesta y repositorio (paso 2 de la hoja de ruta) | ✅ Entregada | [`docs/entrega-1`](docs/entrega-1/propuesta_TFI_inmobiliaria.pdf) |
| 2.ª Entrega — Arquitectura y módulos (paso 3 de la hoja de ruta) | ✅ Entregada | [`docs/entrega-2`](docs/entrega-2/README.md) |
| Entrega final — Informe, video y despliegue (paso 4 de la hoja de ruta) | 🚧 Próximo hito (14/11) | — |

## Diseño (resumen)

- **Modelo de datos:** 5 tablas (`usuario`, `propiedad`, `publicacion`, `imagen_propiedad`, `consulta`). → [DER y reglas](docs/entrega-2/01-modelo-de-datos.md)
- **Módulos:** Autenticación y usuarios · Propiedades e imágenes · Publicaciones · Catálogo público · Consultas · Notificaciones. → [Detalle](docs/entrega-2/02-modulos.md)
- **Arquitectura:** capas de presentación, aplicación, dominio e infraestructura. → [Diagramas](docs/entrega-2/03-arquitectura.md)

## Instalación

### Base de datos

```bash
git clone https://github.com/AgusDMC/utn-tfi-dacorta-herrera-echeverria.git
cd utn-tfi-dacorta-herrera-echeverria
createdb inmobiliaria
psql -d inmobiliaria -f database/migrations/V1__esquema_inicial.sql
psql -d inmobiliaria -f database/seeds/datos_demo.sql   # datos de ejemplo (opcional)
```

Más detalles en [`database/README.md`](database/README.md).

### Backend y frontend

Pendiente: se completará cuando el código esté disponible.

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```
