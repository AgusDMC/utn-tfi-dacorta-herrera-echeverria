package com.tfi.inmobiliaria.imagenpropiedad.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tfi.inmobiliaria.exceptions.AlmacenamientoImagenException;
import com.tfi.inmobiliaria.imagenpropiedad.almacenamiento.AlmacenamientoImagen;
import com.tfi.inmobiliaria.imagenpropiedad.almacenamiento.ImagenAlmacenada;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CloudinaryAlmacenamientoImagen implements AlmacenamientoImagen {

    private static final String CARPETA_BASE = "inmobiliaria/propiedades";

    private final Cloudinary cloudinary;

    @Override
    public ImagenAlmacenada subirImagen(MultipartFile archivo, Long propiedadId) {
        try {
            Map<?, ?> resultado = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.asMap(
                    "folder", CARPETA_BASE + "/" + propiedadId,
                    "resource_type", "image",
                    "overwrite", false));

            return new ImagenAlmacenada((String) resultado.get("secure_url"), (String) resultado.get("public_id"));

        } catch (IOException | RuntimeException excepcion) {
            throw new AlmacenamientoImagenException("No se pudo almacenar la imagen.", excepcion);
        }
    }

    @Override
    public void eliminarImagen(String storageKey) {
        try {
            Map<?, ?> resultado = cloudinary.uploader().destroy(storageKey, ObjectUtils.asMap(
                    "resource_type", "image",
                    "invalidate", true));

            String estado = (String) resultado.get("result");

            if (!"ok".equals(estado) && !"not found".equals(estado)) {
                throw new AlmacenamientoImagenException("No se pudo eliminar la imagen del almacenamiento.");
            }

        } catch (AlmacenamientoImagenException excepcion) {
            throw excepcion;
        } catch (IOException | RuntimeException excepcion) {
            throw new AlmacenamientoImagenException("No se pudo eliminar la imagen del almacenamiento.", excepcion);
        }
    }
}