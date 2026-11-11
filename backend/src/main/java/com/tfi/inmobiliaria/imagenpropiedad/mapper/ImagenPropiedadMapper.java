package com.tfi.inmobiliaria.imagenpropiedad.mapper;

import com.tfi.inmobiliaria.imagenpropiedad.almacenamiento.ImagenAlmacenada;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadCreateDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadUpdateDto;
import com.tfi.inmobiliaria.imagenpropiedad.model.ImagenPropiedad;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;

public final class ImagenPropiedadMapper {

    private ImagenPropiedadMapper() {}

    public static ImagenPropiedad convertirCreateDtoAImagenPropiedad(ImagenPropiedadCreateDto imagenCreateDto, Propiedad propiedad, ImagenAlmacenada imagenAlmacenada) {
        ImagenPropiedad imagenPropiedad = new ImagenPropiedad();

        imagenPropiedad.setPropiedad(propiedad);
        imagenPropiedad.setDescripcion(imagenCreateDto.getDescripcion());
        imagenPropiedad.setUrl(imagenAlmacenada.url());
        imagenPropiedad.setStorageKey(imagenAlmacenada.storageKey());

        return imagenPropiedad;
    }

    public static void actualizarImagenPropiedadDesdeUpdateDto(ImagenPropiedadUpdateDto imagenUpdateDto, ImagenPropiedad imagenPropiedad) {
        imagenPropiedad.setDescripcion(imagenUpdateDto.getDescripcion());
    }

    public static ImagenPropiedadDto convertirImagenPropiedadADto(ImagenPropiedad imagenPropiedad) {
        ImagenPropiedadDto imagenPropiedadDto = new ImagenPropiedadDto();

        imagenPropiedadDto.setId(imagenPropiedad.getId());
        imagenPropiedadDto.setPropiedadId(imagenPropiedad.getPropiedad().getId());
        imagenPropiedadDto.setDescripcion(imagenPropiedad.getDescripcion());
        imagenPropiedadDto.setUrl(imagenPropiedad.getUrl());
        imagenPropiedadDto.setStorageKey(imagenPropiedad.getStorageKey());
        imagenPropiedadDto.setOrden(imagenPropiedad.getOrden());
        imagenPropiedadDto.setFechaCreacion(imagenPropiedad.getFechaCreacion());

        return imagenPropiedadDto;
    }
}