package com.tfi.inmobiliaria.consulta.dto;

import com.tfi.inmobiliaria.consulta.model.EstadoConsulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
public class ConsultaDto {

    private Long id;
    private Long publicacionId;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String mensaje;
    private EstadoConsulta estado;
    private Instant fechaCreacion;
    private Instant fechaUltActualizacion;
}