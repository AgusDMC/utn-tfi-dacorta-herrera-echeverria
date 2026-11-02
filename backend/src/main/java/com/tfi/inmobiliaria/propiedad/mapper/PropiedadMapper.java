package com.tfi.inmobiliaria.propiedad.mapper;

import com.tfi.inmobiliaria.propiedad.dto.PropiedadCreateDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadUpdateDto;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;

public final class PropiedadMapper {

    private PropiedadMapper() {
    }

    // PropiedadCreateDto -> Propiedad
    public static Propiedad convertirCreateDtoAPropiedad(
            PropiedadCreateDto propiedadCreateDto
    ) {
        Propiedad propiedad = new Propiedad();

        propiedad.setTipoPropiedad(propiedadCreateDto.getTipoPropiedad());
        propiedad.setResumen(propiedadCreateDto.getResumen());
        propiedad.setDireccion(propiedadCreateDto.getDireccion());
        propiedad.setLocalidad(propiedadCreateDto.getLocalidad());
        propiedad.setCantAmbientes(propiedadCreateDto.getCantAmbientes());
        propiedad.setCantDormitorios(propiedadCreateDto.getCantDormitorios());
        propiedad.setCantBanios(propiedadCreateDto.getCantBanios());
        propiedad.setTienePatio(propiedadCreateDto.isTienePatio());
        propiedad.setSuperficieTotal(propiedadCreateDto.getSuperficieTotal());
        propiedad.setAnioConstruccion(propiedadCreateDto.getAnioConstruccion());

        return propiedad;
    }

    // PropiedadUpdateDto -> Propiedad
    public static void actualizarPropiedadDesdeUpdateDto(
            Propiedad propiedad,
            PropiedadUpdateDto propiedadUpdateDto
    ) {
        propiedad.setTipoPropiedad(propiedadUpdateDto.getTipoPropiedad());
        propiedad.setResumen(propiedadUpdateDto.getResumen());
        propiedad.setDireccion(propiedadUpdateDto.getDireccion());
        propiedad.setLocalidad(propiedadUpdateDto.getLocalidad());
        propiedad.setCantAmbientes(propiedadUpdateDto.getCantAmbientes());
        propiedad.setCantDormitorios(propiedadUpdateDto.getCantDormitorios());
        propiedad.setCantBanios(propiedadUpdateDto.getCantBanios());
        propiedad.setTienePatio(propiedadUpdateDto.isTienePatio());
        propiedad.setSuperficieTotal(propiedadUpdateDto.getSuperficieTotal());
        propiedad.setAnioConstruccion(propiedadUpdateDto.getAnioConstruccion());
    }

    // Propiedad -> PropiedadDto
    public static PropiedadDto convertirPropiedadADto(Propiedad propiedad) {
        PropiedadDto propiedadDto = new PropiedadDto();

        propiedadDto.setId(propiedad.getId());
        propiedadDto.setTipoPropiedad(propiedad.getTipoPropiedad());
        propiedadDto.setResumen(propiedad.getResumen());
        propiedadDto.setDireccion(propiedad.getDireccion());
        propiedadDto.setLocalidad(propiedad.getLocalidad());
        propiedadDto.setCantAmbientes(propiedad.getCantAmbientes());
        propiedadDto.setCantDormitorios(propiedad.getCantDormitorios());
        propiedadDto.setCantBanios(propiedad.getCantBanios());
        propiedadDto.setTienePatio(propiedad.isTienePatio());
        propiedadDto.setSuperficieTotal(propiedad.getSuperficieTotal());
        propiedadDto.setAnioConstruccion(propiedad.getAnioConstruccion());
        propiedadDto.setActiva(propiedad.isActiva());
        propiedadDto.setFechaCreacion(propiedad.getFechaCreacion());
        propiedadDto.setFechaUltActualizacion(
                propiedad.getFechaUltActualizacion()
        );

        return propiedadDto;
    }
}