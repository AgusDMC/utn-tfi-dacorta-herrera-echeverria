package com.tfi.inmobiliaria.publicacion.dto;

import com.tfi.inmobiliaria.publicacion.model.EstadoComercial;
import com.tfi.inmobiliaria.publicacion.model.Moneda;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import jakarta.validation.constraints.DecimalMin;
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
public class PublicacionUpdateDto {

    @NotBlank(message = "El título es obligatorio.")
    @Size(max = 120, message = "El título no puede superar los 120 caracteres.")
    private String titulo;

    private String descripcion;

    @NotNull(message = "El tipo de operación es obligatorio.")
    private TipoOperacion tipoOperacion;

    @NotNull(message = "El precio es obligatorio.")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero.")
    private BigDecimal precio;

    @NotNull(message = "La moneda es obligatoria.")
    private Moneda moneda;

    @DecimalMin(value = "0.00", message = "Las expensas no pueden ser negativas.")
    private BigDecimal expensas;

    @NotNull(message = "El estado comercial es obligatorio.")
    private EstadoComercial estadoComercial;
}