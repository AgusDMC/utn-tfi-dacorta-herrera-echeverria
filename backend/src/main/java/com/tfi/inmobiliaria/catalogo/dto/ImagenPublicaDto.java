package com.tfi.inmobiliaria.catalogo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Descripcion: DTO para mostrar imagenes desde el frontend.
 * */

@Getter
@Setter
@NoArgsConstructor
public class ImagenPublicaDto {

    private String url;
    private String descripcion;
}