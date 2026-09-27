-- =====================================================================
-- Datos de demostración (DML) — SOLO PARA DESARROLLO LOCAL Y DEMO
-- Se ejecuta a mano después de V1. NO está en /migrations a propósito:
-- así Flyway no lo carga en producción.
--
--   psql -d inmobiliaria -f database/seeds/datos_demo.sql
--
-- Usuario admin de prueba:  admin@demo.local  /  Demo1234!
-- (hash BCrypt, costo 10). Cambiarlo o no cargarlo en el despliegue.
-- =====================================================================

BEGIN;

INSERT INTO usuario (nombre, apellido, telefono, email, clave_hash, rol)
VALUES ('Admin', 'Demo', '2954000000', 'admin@demo.local',
        '$2a$10$aCk87sIK1KEKSyeV9zSEXOYVxM6eefHVCWzI9MocbwZVg9r2X/gEC', 'ADMIN');

-- Propiedades ---------------------------------------------------------
INSERT INTO propiedad (id, tipo_propiedad, resumen, direccion, localidad,
                       cant_ambientes, cant_dormitorios, cant_banios,
                       tiene_patio, superficie_total, anio_construccion)
OVERRIDING SYSTEM VALUE VALUES
 (1, 'CASA',         'Casa de 3 ambientes con patio y parrilla, a 5 cuadras del centro.',
     'Av. San Martín 1234', 'Santa Rosa', 3, 2, 1, TRUE,  180.00, 1998),
 (2, 'DEPARTAMENTO', 'Departamento de 2 ambientes luminoso, a estrenar, con balcón.',
     'Pellegrini 456, 3° B', 'Santa Rosa', 2, 1, 1, FALSE,  52.50, 2024),
 (3, 'PH',           'PH al fondo, 2 ambientes, sin expensas, ideal primera vivienda.',
     'Garibaldi 789, PH 2', 'Santa Rosa', 2, 1, 1, TRUE,   65.00, 1985),
 (4, 'DUPLEX',       'Dúplex de 4 ambientes en barrio tranquilo, cochera cubierta.',
     'Los Aromos 321',      'Toay',       4, 3, 2, TRUE,  140.00, 2015),
 (5, 'CASA',         'Casa amplia en esquina, necesita refacciones.',
     'Calle 15 N° 900',     'General Pico', 5, 3, 2, TRUE, 250.00, NULL);

-- La propiedad 5 fue dada de baja (baja lógica)
UPDATE propiedad SET activa = FALSE WHERE id = 5;

-- Publicaciones -------------------------------------------------------
INSERT INTO publicacion (id, propiedad_id, titulo, descripcion, estado_publicacion,
                         tipo_operacion, precio, moneda, expensas, estado_comercial,
                         fecha_publicacion)
OVERRIDING SYSTEM VALUE VALUES
 -- La casa 1 se ofrece en VENTA y en ALQUILER a la vez (por eso existe Publicacion)
 (1, 1, 'Casa 3 amb. con patio — Venta',
     'Casa de 3 ambientes con patio y parrilla, a 5 cuadras del centro.',
     'ACTIVA', 'VENTA', 85000.00, 'DOLARES', NULL, 'DISPONIBLE', now() - interval '20 days'),
 (2, 1, 'Casa 3 amb. con patio — Alquiler',
     'Casa de 3 ambientes con patio y parrilla. Contrato por 3 años, ajuste por ICL.',
     'ACTIVA', 'ALQUILER', 650000.00, 'PESOS', NULL, 'DISPONIBLE', now() - interval '20 days'),
 (3, 2, 'Depto 2 amb. a estrenar',
     'Departamento de 2 ambientes luminoso, a estrenar, con balcón.',
     'ACTIVA', 'ALQUILER', 420000.00, 'PESOS', 45000.00, 'RESERVADA', now() - interval '7 days'),
 (4, 3, 'PH sin expensas',
     'PH al fondo, 2 ambientes, sin expensas, ideal primera vivienda.',
     'PAUSADA', 'VENTA', 48000.00, 'DOLARES', NULL, 'DISPONIBLE', now() - interval '60 days'),
 -- Publicación vieja del dúplex, ya alquilado: queda como historial
 (5, 4, 'Dúplex 4 amb. en Toay',
     'Dúplex de 4 ambientes en barrio tranquilo, cochera cubierta.',
     'PAUSADA', 'ALQUILER', 900000.00, 'PESOS', NULL, 'ALQUILADA', now() - interval '120 days');

-- Imágenes (URLs de ejemplo; en el sistema real las genera el storage) ---
INSERT INTO imagen_propiedad (propiedad_id, descripcion, url, storage_key, orden) VALUES
 (1, 'Frente de la casa',        'https://picsum.photos/seed/casa1a/1200/800', 'demo/propiedad-1/frente',  1),
 (1, 'Patio con parrilla',       'https://picsum.photos/seed/casa1b/1200/800', 'demo/propiedad-1/patio',   2),
 (1, 'Living comedor',           'https://picsum.photos/seed/casa1c/1200/800', 'demo/propiedad-1/living',  3),
 (2, 'Living con balcón',        'https://picsum.photos/seed/depto2a/1200/800','demo/propiedad-2/living',  1),
 (2, 'Dormitorio',               'https://picsum.photos/seed/depto2b/1200/800','demo/propiedad-2/dorm',    2),
 (3, 'Acceso al PH',             'https://picsum.photos/seed/ph3a/1200/800',   'demo/propiedad-3/acceso',  1),
 (4, 'Frente del dúplex',        'https://picsum.photos/seed/dup4a/1200/800',  'demo/propiedad-4/frente',  1);

-- Consultas -----------------------------------------------------------
INSERT INTO consulta (publicacion_id, nombre, apellido, email, telefono, mensaje, estado,
                      fecha_creacion, fecha_ult_actualizacion) VALUES
 (1, 'Lucía',  'Pérez',   'lucia.perez@example.com', NULL,
     '¿Aceptan permuta por un departamento más chico?', 'NUEVA',
     now() - interval '1 day', now() - interval '1 day'),
 (2, 'Martín', 'Gómez',   NULL, '2954111222',
     'Hola, ¿se aceptan mascotas?', 'CONTACTADA',
     now() - interval '3 days', now() - interval '2 days'),
 (3, 'Sofía',  'Ramírez', 'sofi.r@example.com', '2954333444',
     'Quisiera coordinar una visita esta semana.', 'EN_GESTION',
     now() - interval '5 days', now() - interval '1 day'),
 (5, 'Diego',  'López',   'diego.l@example.com', NULL,
     '¿Sigue disponible?', 'CERRADA',
     now() - interval '100 days', now() - interval '95 days');

-- Como insertamos ids a mano, sincronizamos las secuencias de identidad
SELECT setval(pg_get_serial_sequence('propiedad',   'id'), (SELECT max(id) FROM propiedad));
SELECT setval(pg_get_serial_sequence('publicacion', 'id'), (SELECT max(id) FROM publicacion));

COMMIT;
