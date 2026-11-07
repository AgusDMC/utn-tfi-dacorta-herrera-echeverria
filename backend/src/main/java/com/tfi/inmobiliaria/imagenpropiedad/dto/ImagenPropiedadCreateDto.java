package com.tfi.inmobiliaria.imagenpropiedad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ImagenPropiedadCreateDto {

    @NotNull(message = "La propiedad es obligatoria.")
    private Long propiedadId;

    @Size(max = 200, message = "La descripción no puede superar los 200 caracteres.")
    private String descripcion;

    @NotBlank(message = "La URL es obligatoria.")
    @Size(max = 500, message = "La URL no puede superar los 500 caracteres.")
    private String url;

    @NotBlank(message = "El storage key es obligatorio.")
    @Size(max = 255, message = "El storage key no puede superar los 255 caracteres.")
    private String storageKey;
}