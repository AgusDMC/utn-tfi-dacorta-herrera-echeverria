package com.tfi.inmobiliaria.catalogo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/*
* Descripcion: DTO para mostrar detalles de una publicacion.
* */

@Getter
@Setter
@NoArgsConstructor
public class PublicacionDetalleDto extends PublicacionCatalogoDto {

    private String resumen;
    private String descripcion;
    private List<ImagenPublicaDto> imagenes;

    private Short cantDormitorios;
    private Short cantBanios;
    private boolean tienePatio;
    private Short anioConstruccion;
}