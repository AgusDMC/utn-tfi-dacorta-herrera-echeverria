package com.tfi.inmobiliaria.imagenpropiedad.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ImagenPropiedadUpdateDto {

    @Size(max = 200, message = "La descripción no puede superar los 200 caracteres.")
    private String descripcion;
}