package com.tfi.inmobiliaria.imagenpropiedad.almacenamiento;

import org.springframework.web.multipart.MultipartFile;

public interface AlmacenamientoImagen {

    ImagenAlmacenada subirImagen(MultipartFile archivo, Long propiedadId);

    void eliminarImagen(String storageKey);
}