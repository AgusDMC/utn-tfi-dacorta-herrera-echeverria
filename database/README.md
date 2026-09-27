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

```bash
createdb inmobiliaria
psql -d inmobiliaria -f database/migrations/V1__esquema_inicial.sql
psql -d inmobiliaria -f database/seeds/datos_demo.sql        # opcional
psql -d inmobiliaria -f database/tests/pruebas_reglas.sql    # opcional, no deja cambios
```

Usuario administrador de los datos de prueba: `admin@demo.local` / `Demo1234!` (solo para desarrollo local).

## Migraciones

- Cada cambio al esquema es una migración nueva: `V2__descripcion.sql`, `V3__...`. **Nunca se edita una migración que ya se aplicó** en algún entorno.
- Cuando exista el backend, las migraciones se copian a `backend/src/main/resources/db/migration/` y Flyway las aplica solo al arrancar Spring Boot. Usar `spring.jpa.hibernate.ddl-auto=validate` (no `update`): el esquema lo maneja Flyway, y Hibernate solo verifica que las entidades coincidan con él.
- Los datos de prueba no están en `migrations/` a propósito, para que no se carguen en producción.
