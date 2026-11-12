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
- **Despliegue:** Frontend en Vercel · Backend y base de datos en Railway

## Sistema desplegado

| Componente | Dónde | Enlace |
|---|---|---|
| API REST (backend) | Railway | [`/api/publicaciones`](https://utn-tfi-dacorta-herrera-echeverria-production-db107b99.up.railway.app/api/publicaciones) |
| Base de datos PostgreSQL | Railway (mismo proyecto que el backend, sin acceso público) | — |
| Frontend | Vercel | https://nexo-inmobiliaria-theta.vercel.app/ |

La base de producción tiene los datos demo cargados. El usuario administrador no es el de los datos demo: sus credenciales se comparten por privado, no están en el repositorio.

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

Requisitos: PostgreSQL 15+ y Java 21. Las tablas las crea Flyway al arrancar el backend.

```bash
git clone https://github.com/AgusDMC/utn-tfi-dacorta-herrera-echeverria.git
cd utn-tfi-dacorta-herrera-echeverria

# Usuario y base vacía (una sola vez)
sudo -u postgres psql -c "CREATE ROLE inmobiliaria LOGIN PASSWORD 'inmobiliaria';"
sudo -u postgres createdb -O inmobiliaria inmobiliaria

# Variables: el backend lee backend/.env al arrancar
cp backend/.env.example backend/.env
cd backend && ./mvnw spring-boot:run      # Flyway aplica database/migrations

# En otra terminal, desde la raíz: datos de ejemplo y pruebas de la base (opcional)
psql -h localhost -U inmobiliaria -d inmobiliaria -f database/seeds/datos_demo.sql
psql -h localhost -U inmobiliaria -d inmobiliaria -f database/tests/pruebas_reglas.sql
```

- **Migraciones:** las tablas las crea **Flyway** al arrancar el backend, a partir de `database/migrations`. No hay que cargar `V1__esquema_inicial.sql` a mano: si el esquema ya existe sin la tabla `flyway_schema_history`, el backend no arranca.
- **Datos demo:** 9 propiedades, 11 publicaciones (9 visibles en el catálogo) y consultas en todos los estados. Admin de prueba: `admin@demo.local` / `Demo1234!` (solo local).
- **Pruebas:** `pruebas_reglas.sql` intenta romper las 14 reglas que garantiza la base y muestra `OK` en cada una. Corre en una transacción que se deshace, así que no deja cambios.

Más detalles en [`database/README.md`](database/README.md).

### Variables de entorno

El backend las toma de `backend/.env` en local (plantilla en [`backend/.env.example`](backend/.env.example)) y de las variables del servicio en Railway.

| Variable | Para qué | Local |
|---|---|---|
| `DB_URL` | URL JDBC de la base | Opcional: por defecto `localhost:5432/inmobiliaria` |
| `DB_USERNAME`, `DB_PASSWORD` | Usuario y clave de la base | `inmobiliaria` / `inmobiliaria` |
| `FLYWAY_LOCATIONS` | Carpeta de las migraciones | Opcional: por defecto `../database/migrations` |
| `JWT_SECRET` | Clave para firmar los tokens | Generar con `openssl rand -base64 48` |
| `MAIL_USERNAME`, `MAIL_PASSWORD`, `EMAIL_REMITENTE`, `NOMBRE_REMITENTE`, `EMAIL_DESTINATARIO` | Envío de correos (Brevo) | Sin credenciales reales falla el alta de consultas |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Almacenamiento de imágenes | Necesarias para subir fotos |
| `PORT` | Puerto del servidor | Opcional: por defecto `8080` |

El frontend no necesita `VITE_API_URL` en producción: [`frontend/vercel.json`](frontend/vercel.json) redirige `/api` al backend de Railway. En desarrollo, Vite reenvía `/api` al backend local (`http://localhost:8080`) por defecto; para usar el de Railway se define `API_PROXY` en `frontend/.env.local`, que Git ignora. Ningún valor real se sube al repositorio.

### Despliegue en Railway

- El backend se construye con el [`Dockerfile`](Dockerfile) de la raíz. La imagen incluye `database/migrations` y define `FLYWAY_LOCATIONS`, así que Flyway crea y actualiza el esquema en cada deploy.
- La base es un servicio PostgreSQL en el mismo proyecto. `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` del backend son referencias a sus variables (`jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`, etc.), y la conexión va por la red interna de Railway.
- Los datos demo se cargaron con `psql` después del primer deploy. Luego se borró el admin de prueba y se creó el de producción con `pgcrypto` (`crypt(clave, gen_salt('bf', 10))`).

### Backend y frontend

Cada aplicación se ejecuta en su propia terminal, desde la raíz del repositorio:

```bash
# Terminal 1: backend
cd backend
./mvnw spring-boot:run

# Terminal 2: frontend
cd frontend
npm install
npm run dev
```
