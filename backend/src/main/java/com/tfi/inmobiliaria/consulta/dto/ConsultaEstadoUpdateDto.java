package com.tfi.inmobiliaria.consulta.dto;

import com.tfi.inmobiliaria.consulta.model.EstadoConsulta;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsultaEstadoUpdateDto {

    @NotNull(message = "El estado es obligatorio.")
    private EstadoConsulta estado;
}