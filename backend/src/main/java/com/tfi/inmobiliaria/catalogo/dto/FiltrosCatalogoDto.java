package com.tfi.inmobiliaria.catalogo.dto;

import com.tfi.inmobiliaria.propiedad.model.TipoPropiedad;
import com.tfi.inmobiliaria.publicacion.model.Moneda;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class FiltrosCatalogoDto {

    private TipoOperacion tipoOperacion;
    private TipoPropiedad tipoPropiedad;
    private String localidad;

    private Moneda moneda;
    private BigDecimal precioMin;
    private BigDecimal precioMax;

    private Short ambientesMin;
    private Short dormitoriosMin;

    private Boolean tienePatio;
    private Boolean soloDisponibles;
}