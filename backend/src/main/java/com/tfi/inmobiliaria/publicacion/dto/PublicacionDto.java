package com.tfi.inmobiliaria.publicacion.dto;

import com.tfi.inmobiliaria.publicacion.model.EstadoComercial;
import com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion;
import com.tfi.inmobiliaria.publicacion.model.Moneda;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
public class PublicacionDto {

    private Long id;
    private Long propiedadId;
    private String titulo;
    private String descripcion;
    private EstadoPublicacion estadoPublicacion;
    private TipoOperacion tipoOperacion;
    private BigDecimal precio;
    private Moneda moneda;
    private BigDecimal expensas;
    private EstadoComercial estadoComercial;
    private Instant fechaCreacion;
    private Instant fechaPublicacion;
    private Instant fechaUltActualizacion;
}