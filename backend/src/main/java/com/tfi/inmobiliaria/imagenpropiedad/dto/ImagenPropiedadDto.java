package com.tfi.inmobiliaria.imagenpropiedad.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
public class ImagenPropiedadDto {

    private Long id;
    private Long propiedadId;
    private String descripcion;
    private String url;
    private String storageKey;
    private Short orden;
    private Instant fechaCreacion;
}