package com.tfi.inmobiliaria.imagenpropiedad.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class ImagenPropiedadCreateDto {

    @NotNull(message = "La propiedad es obligatoria.")
    private Long propiedadId;

    @Size(max = 200, message = "La descripción no puede superar los 200 caracteres.")
    private String descripcion;

    @NotNull(message = "Debe seleccionar una imagen.")
    private MultipartFile archivo;
}