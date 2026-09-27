-- =====================================================================
-- Pruebas de las reglas de negocio que viven en la base
-- Correr DESPUÉS de V1 + datos_demo:
--   psql -d inmobiliaria -f database/tests/pruebas_reglas.sql
-- Cada bloque intenta romper una regla. Si la base lo rechaza -> OK.
-- Todo corre dentro de una transacción que se deshace al final.
-- =====================================================================

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.debe_fallar(descripcion TEXT, sentencia TEXT)
RETURNS VOID AS $$
BEGIN
    BEGIN
        EXECUTE sentencia;
        RAISE WARNING 'FALLA  -> %  (la base lo aceptó y no debía)', descripcion;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'OK     -> %  [%]', descripcion, SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

SELECT pg_temp.debe_fallar('R2: segunda publicación ACTIVA de VENTA para la misma propiedad',
  $q$INSERT INTO publicacion (propiedad_id, titulo, descripcion, estado_publicacion, tipo_operacion,
                             precio, moneda, fecha_publicacion)
     VALUES (1, 'Duplicada', 'x', 'ACTIVA', 'VENTA', 90000, 'DOLARES', now())$q$);

SELECT pg_temp.debe_fallar('R3: publicación de ALQUILER marcada como VENDIDA',
  $q$UPDATE publicacion SET estado_comercial = 'VENDIDA' WHERE id = 2$q$);

SELECT pg_temp.debe_fallar('R3: publicación de VENTA marcada como ALQUILADA',
  $q$UPDATE publicacion SET estado_comercial = 'ALQUILADA' WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Precio en cero',
  $q$UPDATE publicacion SET precio = 0 WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Publicación ACTIVA sin fecha de publicación',
  $q$INSERT INTO publicacion (propiedad_id, titulo, descripcion, estado_publicacion, tipo_operacion,
                             precio, moneda)
     VALUES (3, 'Sin fecha', 'x', 'ACTIVA', 'ALQUILER', 1000, 'PESOS')$q$);

SELECT pg_temp.debe_fallar('Moneda inexistente',
  $q$UPDATE publicacion SET moneda = 'EUROS' WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Dormitorios >= ambientes (3 amb / 3 dorm)',
  $q$UPDATE propiedad SET cant_dormitorios = 3 WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Tipo de propiedad fuera del MVP (TERRENO)',
  $q$UPDATE propiedad SET tipo_propiedad = 'TERRENO' WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Consulta sin email ni teléfono',
  $q$INSERT INTO consulta (publicacion_id, nombre, apellido, mensaje)
     VALUES (1, 'Anónimo', 'X', 'Hola')$q$);

SELECT pg_temp.debe_fallar('Consulta con mensaje vacío',
  $q$INSERT INTO consulta (publicacion_id, nombre, apellido, email, mensaje)
     VALUES (1, 'Ana', 'X', 'a@b.com', '   ')$q$);

SELECT pg_temp.debe_fallar('Email de admin repetido (distinto en mayúsculas)',
  $q$INSERT INTO usuario (nombre, apellido, email, clave_hash)
     VALUES ('Otro', 'Admin', 'ADMIN@demo.local', 'x')$q$);

SELECT pg_temp.debe_fallar('Borrado físico de una propiedad con publicaciones',
  $q$DELETE FROM propiedad WHERE id = 1$q$);

SELECT pg_temp.debe_fallar('Dos imágenes con el mismo orden (se valida al COMMIT)',
  $q$DO $d$ BEGIN
       SET CONSTRAINTS ux_imagen_orden_por_propiedad IMMEDIATE;
       INSERT INTO imagen_propiedad (propiedad_id, url, storage_key, orden)
       VALUES (1, 'https://x/y.jpg', 'demo/dup', 1);
     END $d$$q$);

-- Esto SÍ tiene que funcionar: intercambiar portada (orden 1 <-> 2)
-- gracias a que la restricción es DEFERRABLE.
UPDATE imagen_propiedad SET orden = 2 WHERE storage_key = 'demo/propiedad-1/frente';
UPDATE imagen_propiedad SET orden = 1 WHERE storage_key = 'demo/propiedad-1/patio';
SET CONSTRAINTS ALL IMMEDIATE;   -- fuerza la validación ahora
SELECT 'OK     -> Reordenar imágenes (swap 1<->2) dentro de una transacción' AS resultado;

-- ---------------------------------------------------------------------
-- Consulta de referencia del CATÁLOGO PÚBLICO (lo que usará el módulo
-- Catálogo). Filtros de ejemplo: alquiler, en pesos, hasta $700.000,
-- 2 o más ambientes, en Santa Rosa.
-- ---------------------------------------------------------------------
SELECT pu.id, pu.titulo, pr.tipo_propiedad, pr.localidad, pr.cant_ambientes,
       pu.precio, pu.moneda, pu.expensas, pu.estado_comercial,
       (SELECT i.url FROM imagen_propiedad i
         WHERE i.propiedad_id = pr.id ORDER BY i.orden LIMIT 1) AS portada
FROM publicacion pu
JOIN propiedad   pr ON pr.id = pu.propiedad_id
WHERE pu.estado_publicacion = 'ACTIVA'
  AND pr.activa
  AND pu.estado_comercial IN ('DISPONIBLE', 'RESERVADA')
  AND pu.tipo_operacion = 'ALQUILER'
  AND pu.moneda = 'PESOS'
  AND pu.precio <= 700000
  AND pr.cant_ambientes >= 2
  AND lower(pr.localidad) = lower('Santa Rosa')
ORDER BY pu.fecha_publicacion DESC;

ROLLBACK;
