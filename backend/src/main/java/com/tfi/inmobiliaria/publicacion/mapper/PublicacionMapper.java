package com.tfi.inmobiliaria.publicacion.mapper;

import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionCreateDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionUpdateDto;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;

public final class PublicacionMapper {

    private PublicacionMapper() {
    }

    public static Publicacion convertirCreateDtoAPublicacion(
            PublicacionCreateDto publicacionCreateDto,
            Propiedad propiedad
    ) {
        Publicacion publicacion = new Publicacion();

        publicacion.setPropiedad(propiedad);
        publicacion.setTitulo(publicacionCreateDto.getTitulo());
        publicacion.setDescripcion(publicacionCreateDto.getDescripcion());
        publicacion.setTipoOperacion(publicacionCreateDto.getTipoOperacion());
        publicacion.setPrecio(publicacionCreateDto.getPrecio());
        publicacion.setMoneda(publicacionCreateDto.getMoneda());
        publicacion.setExpensas(publicacionCreateDto.getExpensas());

        return publicacion;
    }

    public static void actualizarPublicacionDesdeUpdateDto(
            PublicacionUpdateDto publicacionUpdateDto,
            Publicacion publicacion
    ) {
        publicacion.setTitulo(publicacionUpdateDto.getTitulo());
        publicacion.setDescripcion(publicacionUpdateDto.getDescripcion());
        publicacion.setTipoOperacion(publicacionUpdateDto.getTipoOperacion());
        publicacion.setPrecio(publicacionUpdateDto.getPrecio());
        publicacion.setMoneda(publicacionUpdateDto.getMoneda());
        publicacion.setExpensas(publicacionUpdateDto.getExpensas());
        publicacion.setEstadoComercial(publicacionUpdateDto.getEstadoComercial());
    }

    public static PublicacionDto convertirPublicacionADto(Publicacion publicacion) {
        PublicacionDto publicacionDto = new PublicacionDto();

        publicacionDto.setId(publicacion.getId());
        publicacionDto.setPropiedadId(publicacion.getPropiedad().getId());
        publicacionDto.setTitulo(publicacion.getTitulo());
        publicacionDto.setDescripcion(publicacion.getDescripcion());
        publicacionDto.setEstadoPublicacion(publicacion.getEstadoPublicacion());
        publicacionDto.setTipoOperacion(publicacion.getTipoOperacion());
        publicacionDto.setPrecio(publicacion.getPrecio());
        publicacionDto.setMoneda(publicacion.getMoneda());
        publicacionDto.setExpensas(publicacion.getExpensas());
        publicacionDto.setEstadoComercial(publicacion.getEstadoComercial());
        publicacionDto.setFechaCreacion(publicacion.getFechaCreacion());
        publicacionDto.setFechaPublicacion(publicacion.getFechaPublicacion());
        publicacionDto.setFechaUltActualizacion(publicacion.getFechaUltActualizacion());

        return publicacionDto;
    }
}