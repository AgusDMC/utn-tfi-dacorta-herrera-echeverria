package com.tfi.inmobiliaria.catalogo.validator;

import com.tfi.inmobiliaria.catalogo.dto.FiltrosCatalogoDto;
import com.tfi.inmobiliaria.exceptions.FiltroInvalidoException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class FiltrosCatalogoValidator {

    public void validarFiltros(FiltrosCatalogoDto filtros) {
        validarFiltroPrecio(filtros);
        validarMinimos(filtros);
    }

    private void validarFiltroPrecio(FiltrosCatalogoDto filtros) {
        boolean tieneFiltroPrecio = filtros.getPrecioMin() != null || filtros.getPrecioMax() != null;

        if (tieneFiltroPrecio && filtros.getMoneda() == null) {
            throw new FiltroInvalidoException("Debe indicar una moneda al filtrar por precio.");
        }

        if (esNegativo(filtros.getPrecioMin()) || esNegativo(filtros.getPrecioMax())) {
            throw new FiltroInvalidoException("Los precios de filtro no pueden ser negativos.");
        }

        if (filtros.getPrecioMin() != null && filtros.getPrecioMax() != null && filtros.getPrecioMin().compareTo(filtros.getPrecioMax()) > 0) {
            throw new FiltroInvalidoException("El precio mínimo no puede ser mayor al precio máximo.");
        }
    }

    private void validarMinimos(FiltrosCatalogoDto filtros) {
        if (esNegativo(filtros.getAmbientesMin())) {
            throw new FiltroInvalidoException("La cantidad mínima de ambientes no puede ser negativa.");
        }

        if (esNegativo(filtros.getDormitoriosMin())) {
            throw new FiltroInvalidoException("La cantidad mínima de dormitorios no puede ser negativa.");
        }
    }

    private boolean esNegativo(BigDecimal valor) {
        return valor != null && valor.signum() < 0;
    }

    private boolean esNegativo(Short valor) {
        return valor != null && valor < 0;
    }
}
