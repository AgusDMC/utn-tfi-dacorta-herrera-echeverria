package com.tfi.inmobiliaria.propiedad.dto;

import com.tfi.inmobiliaria.propiedad.model.TipoPropiedad;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropiedadDto {

    private Long id;
    private TipoPropiedad tipoPropiedad;
    private String resumen;
    private String direccion;
    private String localidad;
    private Short cantAmbientes;
    private Short cantDormitorios;
    private Short cantBanios;
    private boolean tienePatio;
    private BigDecimal superficieTotal;
    private Short anioConstruccion;
    private boolean activa;
    private Instant fechaCreacion;
    private Instant fechaUltActualizacion;
}