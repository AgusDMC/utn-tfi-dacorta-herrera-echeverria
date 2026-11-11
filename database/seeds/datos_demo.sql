-- Datos de demostración. Solo para desarrollo local y demo (no es una migración).
-- Se carga después de que Flyway creó las tablas:
--   psql -d inmobiliaria -f database/seeds/datos_demo.sql
-- Admin de prueba: admin@demo.local / Demo1234! (no usar en producción)
-- Fotos de Unsplash (licencia libre).

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
     'Av. San Martín 1234',  'Santa Rosa',   3, 2, 1, TRUE,  180.00, 1998),
 (2, 'DEPARTAMENTO', 'Departamento de 2 ambientes luminoso, a estrenar, con balcón.',
     'Pellegrini 456, 3° B', 'Santa Rosa',   2, 1, 1, FALSE,  52.50, 2024),
 (3, 'PH',           'PH al fondo, 2 ambientes, sin expensas, ideal primera vivienda.',
     'Garibaldi 789, PH 2',  'Santa Rosa',   2, 1, 1, TRUE,   65.00, 1985),
 (4, 'DUPLEX',       'Dúplex de 4 ambientes en barrio tranquilo, cochera cubierta.',
     'Los Aromos 321',       'Toay',         4, 3, 2, TRUE,  140.00, 2015),
 (5, 'CASA',         'Casa amplia en esquina, necesita refacciones.',
     'Calle 15 N° 900',      'General Pico', 5, 3, 2, TRUE,  250.00, NULL),
 (6, 'CASA',         'Casa de 4 ambientes con garage y jardín al frente, en un barrio residencial.',
     'Raúl B. Díaz 1580',    'Santa Rosa',   4, 3, 2, TRUE,  190.00, 1995),
 (7, 'DEPARTAMENTO', 'Departamento de 2 ambientes con balcón, en un edificio a pocas cuadras del centro.',
     'Quintana 245, 5° A',   'Santa Rosa',   2, 1, 1, FALSE,  48.00, 2008),
 (8, 'CASA',         'Casa de 3 ambientes con galería y jardín al frente.',
     'Bolivia 1020',         'Santa Rosa',   3, 2, 1, TRUE,  140.00, 1990),
 (9, 'PH',           'PH de 3 ambientes al frente, con patio propio y terraza.',
     'Calle 20 N° 655',      'General Pico', 3, 2, 1, TRUE,   85.00, 1978);

-- La propiedad 5 fue dada de baja (baja lógica)
UPDATE propiedad SET activa = FALSE WHERE id = 5;

-- Publicaciones -------------------------------------------------------
INSERT INTO publicacion (id, propiedad_id, titulo, descripcion, estado_publicacion,
                         tipo_operacion, precio, moneda, expensas, estado_comercial,
                         fecha_publicacion)
OVERRIDING SYSTEM VALUE VALUES
 -- Casa 1 en venta y en alquiler a la vez
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
 -- Publicación vieja del dúplex (historial, no se muestra)
 (5, 4, 'Dúplex 4 amb. en Toay',
     'Dúplex de 4 ambientes en barrio tranquilo, cochera cubierta.',
     'PAUSADA', 'ALQUILER', 900000.00, 'PESOS', NULL, 'ALQUILADA', now() - interval '120 days'),
 (6, 6, 'Casa 4 amb. con garage',
     'Casa de 4 ambientes con garage para dos autos y jardín al frente. Contrato por 3 años.',
     'ACTIVA', 'ALQUILER', 720000.00, 'PESOS', NULL, 'DISPONIBLE', now() - interval '1 day'),
 (7, 7, 'Depto 2 amb. con balcón',
     'Departamento de 2 ambientes con balcón al frente, cocina separada y baño completo.',
     'ACTIVA', 'VENTA', 62000.00, 'DOLARES', 38000.00, 'DISPONIBLE', now() - interval '3 days'),
 -- El mismo dúplex, ahora en venta
 (8, 4, 'Dúplex 4 amb. con cochera en Toay',
     'Dúplex de 4 ambientes en barrio tranquilo, cochera cubierta y patio con parrilla.',
     'ACTIVA', 'VENTA', 120000.00, 'DOLARES', NULL, 'DISPONIBLE', now() - interval '4 days'),
 (9, 8, 'Casa 3 amb. con galería y jardín',
     'Casa de 3 ambientes con galería, jardín al frente y patio al fondo.',
     'ACTIVA', 'VENTA', 98000.00, 'DOLARES', NULL, 'DISPONIBLE', now() - interval '6 days'),
 -- PH 9 en alquiler y en venta
 (10, 9, 'PH 3 amb. con terraza — Alquiler',
     'PH de 3 ambientes al frente, con patio propio y terraza. Sin expensas.',
     'ACTIVA', 'ALQUILER', 380000.00, 'PESOS', NULL, 'DISPONIBLE', now() - interval '9 days'),
 (11, 9, 'PH 3 amb. con terraza — Venta',
     'PH de 3 ambientes al frente, con patio propio y terraza. Escritura inmediata.',
     'ACTIVA', 'VENTA', 45000.00, 'DOLARES', NULL, 'RESERVADA', now() - interval '9 days');

-- Imágenes ------------------------------------------------------------
-- El PH 9 queda sin fotos para probar ese caso en el catálogo
INSERT INTO imagen_propiedad (propiedad_id, descripcion, url, storage_key, orden) VALUES
 (1, 'Frente de la casa',
     'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80&auto=format&fit=crop',
     'demo/propiedad-1/frente', 1),
 (1, 'Living comedor',
     'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80&auto=format&fit=crop',
     'demo/propiedad-1/living', 2),
 (2, 'Living con balcón',
     'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80&auto=format&fit=crop',
     'demo/propiedad-2/living', 1),
 (4, 'Dúplex con balcones sobre una calle del barrio',
     'https://unsplash.com/photos/44FRvkxNwcY/download?w=1200',
     'demo/propiedad-4/frente', 1),
 (6, 'Casa de ladrillo con garage y jardín al frente',
     'https://unsplash.com/photos/r5_7Zc_E5zU/download?w=1200',
     'demo/propiedad-6/frente', 1),
 (7, 'Edificio de departamentos con balcones',
     'https://unsplash.com/photos/U9oiF9S7QbE/download?w=1200',
     'demo/propiedad-7/frente', 1),
 (8, 'Casa de una planta con galería y jardín al frente',
     'https://unsplash.com/photos/QLaGIke8GvE/download?w=1200',
     'demo/propiedad-8/frente', 1);

-- Consultas (al menos una por estado) --------------------------------
INSERT INTO consulta (publicacion_id, nombre, apellido, email, telefono, mensaje, estado,
                      fecha_creacion, fecha_ult_actualizacion) VALUES
 (1, 'Lucía',   'Pérez',    'lucia.perez@example.com', NULL,
     '¿Aceptan permuta por un departamento más chico?', 'NUEVA',
     now() - interval '1 day', now() - interval '1 day'),
 (6, 'Carla',   'Fernández', 'carla.f@example.com', '2954555666',
     '¿El garage es para dos autos? ¿Se puede visitar el sábado?', 'NUEVA',
     now() - interval '5 hours', now() - interval '5 hours'),
 (2, 'Martín',  'Gómez',    NULL, '2954111222',
     'Hola, ¿se aceptan mascotas?', 'CONTACTADA',
     now() - interval '3 days', now() - interval '2 days'),
 (3, 'Sofía',   'Ramírez',  'sofi.r@example.com', '2954333444',
     'Quisiera coordinar una visita esta semana.', 'EN_GESTION',
     now() - interval '5 days', now() - interval '1 day'),
 (7, 'Javier',  'Sosa',     'jsosa@example.com', NULL,
     '¿El precio es negociable? ¿Aceptan crédito hipotecario?', 'EN_GESTION',
     now() - interval '2 days', now() - interval '1 day'),
 (5, 'Diego',   'López',    'diego.l@example.com', NULL,
     '¿Sigue disponible?', 'CERRADA',
     now() - interval '100 days', now() - interval '95 days'),
 (9, 'Ana',     'Torres',   NULL, '2302444555',
     'Busco algo más cerca de General Pico, gracias igual.', 'DESCARTADA',
     now() - interval '4 days', now() - interval '3 days');

-- Ajustar las secuencias porque los ids se cargaron a mano
SELECT setval(pg_get_serial_sequence('propiedad',   'id'), (SELECT max(id) FROM propiedad));
SELECT setval(pg_get_serial_sequence('publicacion', 'id'), (SELECT max(id) FROM publicacion));

COMMIT;
