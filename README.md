# Sistema Web de Gestión Inmobiliaria

Trabajo Final Integrador — Tecnicatura Universitaria en Programación (ITES)

## Descripción

Aplicación web pensada para inmobiliarias pequeñas y medianas que hoy gestionan sus propiedades y consultas de forma manual (planillas, WhatsApp, redes sociales). El sistema centraliza en un solo lugar la publicación y administración de propiedades en venta o alquiler, la búsqueda filtrada para visitantes y el seguimiento de las consultas de potenciales clientes.

Incluye un catálogo público con filtros, ficha de detalle con galería de imágenes, formulario de consulta con notificación automática por correo, y un panel administrativo con autenticación para gestionar propiedades, imágenes y el estado de cada consulta.

## Equipo

| Integrante | Área a cargo |
|---|---|
| Franco Leonel Herrera | Backend (Spring Boot, API REST, lógica de negocio) |
| Manuel Da Corta | Frontend (React + TypeScript, catálogo y panel) |
| Agustín Echeverría Araya | Base de datos (diseño del esquema PostgreSQL, persistencia) |

**Tutora:** Sofía Carnevale

## Stack tecnológico

- **Frontend:** React + TypeScript
- **Backend:** Spring Boot (Java) — API REST
- **Base de datos:** PostgreSQL
- **Despliegue:** Frontend en Vercel · Backend en Render · Base de datos en Railway

## Estructura del repositorio

```
/frontend       -> Aplicación React (catálogo público + panel administrativo)
/backend        -> API REST en Spring Boot
/docs           -> Propuesta, informes, esquemas y entregas de la materia
README.md       -> Este archivo
```

## Estado del proyecto

🚧 En desarrollo — Primera entrega (Propuesta de proyecto) completada. Próximo hito: diseño del esquema de base de datos y listado de módulos.

## Instalación (a completar cuando el código esté disponible)

```bash
# Clonar el repositorio
git clone https://github.com/AgusDMC/utn-tfi-dacorta-herrera-echeverria.git

# Backend
cd backend
# instrucciones de build y ejecución (pendiente)

# Frontend
cd frontend
npm install
npm run dev
```

## Documentación

La documentación completa del proyecto (propuesta, historias de usuario, esquema de base de datos, informes de avance) se encuentra en la carpeta [`/docs`](./docs).
