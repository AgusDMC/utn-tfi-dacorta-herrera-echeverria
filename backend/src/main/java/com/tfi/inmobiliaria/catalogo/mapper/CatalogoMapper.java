package com.tfi.inmobiliaria.catalogo.mapper;

import com.tfi.inmobiliaria.catalogo.dto.ImagenPublicaDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionDetalleDto;
import com.tfi.inmobiliaria.imagenpropiedad.model.ImagenPropiedad;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;

import java.util.List;

public final class CatalogoMapper {

    private CatalogoMapper() {
    }

    public static PublicacionCatalogoDto convertirAPublicacionCatalogoDto(
            Publicacion publicacion,
            ImagenPropiedad portada
    ) {
        PublicacionCatalogoDto dto = new PublicacionCatalogoDto();

        completarDatosCatalogo(dto, publicacion, portada);

        return dto;
    }

    public static PublicacionDetalleDto convertirAPublicacionDetalleDto(
            Publicacion publicacion,
            List<ImagenPropiedad> imagenes
    ) {
        PublicacionDetalleDto dto = new PublicacionDetalleDto();

        ImagenPropiedad portada = imagenes.isEmpty() ? null : imagenes.getFirst();

        completarDatosCatalogo(dto, publicacion, portada);

        Propiedad propiedad = publicacion.getPropiedad();

        dto.setResumen(propiedad.getResumen());
        dto.setDescripcion(publicacion.getDescripcion());
        dto.setImagenes(imagenes.stream()
                .map(CatalogoMapper::convertirAImagenPublicaDto)
                .toList());
        dto.setCantDormitorios(propiedad.getCantDormitorios());
        dto.setCantBanios(propiedad.getCantBanios());
        dto.setTienePatio(propiedad.isTienePatio());
        dto.setAnioConstruccion(propiedad.getAnioConstruccion());

        return dto;
    }

    public static ImagenPublicaDto convertirAImagenPublicaDto(ImagenPropiedad imagen) {
        ImagenPublicaDto dto = new ImagenPublicaDto();

        dto.setUrl(imagen.getUrl());
        dto.setDescripcion(imagen.getDescripcion());

        return dto;
    }

    private static void completarDatosCatalogo(
            PublicacionCatalogoDto dto,
            Publicacion publicacion,
            ImagenPropiedad portada
    ) {
        Propiedad propiedad = publicacion.getPropiedad();

        dto.setId(publicacion.getId());
        dto.setTitulo(publicacion.getTitulo());
        dto.setTipoOperacion(publicacion.getTipoOperacion());
        dto.setPrecio(publicacion.getPrecio());
        dto.setMoneda(publicacion.getMoneda());
        dto.setExpensas(publicacion.getExpensas());
        dto.setEstadoComercial(publicacion.getEstadoComercial());

        dto.setTipoPropiedad(propiedad.getTipoPropiedad());
        dto.setLocalidad(propiedad.getLocalidad());
        dto.setCantAmbientes(propiedad.getCantAmbientes());
        dto.setSuperficieTotal(propiedad.getSuperficieTotal());

        dto.setPortada(portada == null ? null : convertirAImagenPublicaDto(portada));
    }
}