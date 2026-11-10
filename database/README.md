# Base de datos

PostgreSQL 15 o superior.

```
database/
├── migrations/
│   └── V1__esquema_inicial.sql   DDL: tablas, restricciones e índices (formato Flyway)
├── seeds/
│   └── datos_demo.sql            DML: datos de ejemplo para desarrollo y demo
└── tests/
    └── pruebas_reglas.sql        Intenta romper cada regla y verifica que la base lo impida
```

El diseño completo (DER, reglas de negocio, decisiones y diccionario de datos) está en [`docs/entrega-2/01-modelo-de-datos.md`](../docs/entrega-2/01-modelo-de-datos.md).

## Crear la base en local

Requisitos: PostgreSQL 15+ y Java 21. Antes de arrancar el backend, copiar `backend/.env.example` como `backend/.env` y completarlo.

```bash
createdb -O inmobiliaria inmobiliaria                     # base vacía
cd backend && ./mvnw spring-boot:run                      # Flyway aplica las migraciones
psql -d inmobiliaria -f database/seeds/datos_demo.sql     # desde la raíz, opcional
psql -d inmobiliaria -f database/tests/pruebas_reglas.sql # opcional, no deja cambios
```

Las tablas las crea **Flyway**, no `psql -f` sobre la migración: si el esquema ya existe sin la tabla `flyway_schema_history`, el backend no arranca.

Usuario administrador de los datos de prueba: `admin@demo.local` / `Demo1234!` (solo para desarrollo local).

## Migraciones

- Cada cambio al esquema es una migración nueva: `V2__descripcion.sql`, `V3__...`. **Nunca se edita una migración que ya se aplicó** en algún entorno (Flyway guarda un checksum de cada una y se niega a arrancar si cambió).
- El backend las lee directo de esta carpeta (`spring.flyway.locations: filesystem:../database/migrations`), así que hay que arrancarlo desde `backend/`. Hibernate corre con `ddl-auto: validate`: no toca el esquema, solo verifica que las entidades coincidan con él.
- Los datos de prueba no están en `migrations/` a propósito, para que no se carguen en producción.
