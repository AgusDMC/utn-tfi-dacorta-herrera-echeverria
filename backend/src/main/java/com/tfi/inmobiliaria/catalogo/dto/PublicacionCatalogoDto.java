package com.tfi.inmobiliaria.catalogo.dto;

import com.tfi.inmobiliaria.propiedad.model.TipoPropiedad;
import com.tfi.inmobiliaria.publicacion.model.EstadoComercial;
import com.tfi.inmobiliaria.publicacion.model.Moneda;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/*
 * Descripcion: DTO listar publicaciones en el frontend.
 * */

@Getter
@Setter
@NoArgsConstructor
public class PublicacionCatalogoDto {

    private Long id;
    private String titulo;
    private TipoOperacion tipoOperacion;
    private BigDecimal precio;
    private Moneda moneda;
    private BigDecimal expensas;
    private EstadoComercial estadoComercial;

    private TipoPropiedad tipoPropiedad;
    private String localidad;
    private Short cantAmbientes;
    private BigDecimal superficieTotal;

    private ImagenPublicaDto portada;
}