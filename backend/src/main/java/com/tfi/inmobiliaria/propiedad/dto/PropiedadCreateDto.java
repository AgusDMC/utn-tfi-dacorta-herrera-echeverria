package com.tfi.inmobiliaria.propiedad.dto;

import com.tfi.inmobiliaria.propiedad.model.TipoPropiedad;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class PropiedadCreateDto {

    @NotNull(message = "El tipo de propiedad es obligatorio.")
    private TipoPropiedad tipoPropiedad;

    @NotBlank(message = "El resumen es obligatorio.")
    @Size(max = 500, message = "El resumen no puede superar los 500 caracteres.")
    private String resumen;

    @NotBlank(message = "La dirección es obligatoria.")
    @Size(max = 200, message = "La dirección no puede superar los 200 caracteres.")
    private String direccion;

    @NotBlank(message = "La localidad es obligatoria.")
    @Size(max = 100, message = "La localidad no puede superar los 100 caracteres.")
    private String localidad;

    @NotNull(message = "La cantidad de ambientes es obligatoria.")
    @Min(value = 1, message = "La cantidad de ambientes debe ser al menos 1.")
    private Short cantAmbientes;

    @NotNull(message = "La cantidad de dormitorios es obligatoria.")
    @Min(value = 0, message = "La cantidad de dormitorios no puede ser negativa.")
    private Short cantDormitorios;

    @NotNull(message = "La cantidad de baños es obligatoria.")
    @Min(value = 1, message = "La cantidad de baños debe ser al menos 1.")
    private Short cantBanios;

    private boolean tienePatio;

    @NotNull(message = "La superficie total es obligatoria.")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "La superficie total debe ser mayor a 0.")
    private BigDecimal superficieTotal;

    @Min(value = 1800, message = "El año de construcción debe ser posterior a 1800.")
    private Short anioConstruccion;
}