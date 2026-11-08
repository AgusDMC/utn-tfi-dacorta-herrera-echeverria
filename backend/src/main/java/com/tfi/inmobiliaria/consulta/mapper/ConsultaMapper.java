package com.tfi.inmobiliaria.consulta.mapper;

import com.tfi.inmobiliaria.consulta.dto.ConsultaCreateDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaDto;
import com.tfi.inmobiliaria.consulta.model.Consulta;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;

public final class ConsultaMapper {

    private ConsultaMapper() {
    }

    public static Consulta convertirCreateDtoAConsulta(
            ConsultaCreateDto consultaCreateDto,
            Publicacion publicacion
    ) {
        Consulta consulta = new Consulta();

        consulta.setPublicacion(publicacion);
        consulta.setNombre(consultaCreateDto.getNombre());
        consulta.setApellido(consultaCreateDto.getApellido());
        consulta.setEmail(consultaCreateDto.getEmail());
        consulta.setTelefono(consultaCreateDto.getTelefono());
        consulta.setMensaje(consultaCreateDto.getMensaje());

        return consulta;
    }

    public static ConsultaDto convertirConsultaADto(Consulta consulta) {
        ConsultaDto consultaDto = new ConsultaDto();

        consultaDto.setId(consulta.getId());
        consultaDto.setPublicacionId(consulta.getPublicacion().getId());
        consultaDto.setNombre(consulta.getNombre());
        consultaDto.setApellido(consulta.getApellido());
        consultaDto.setEmail(consulta.getEmail());
        consultaDto.setTelefono(consulta.getTelefono());
        consultaDto.setMensaje(consulta.getMensaje());
        consultaDto.setEstado(consulta.getEstado());
        consultaDto.setFechaCreacion(consulta.getFechaCreacion());
        consultaDto.setFechaUltActualizacion(consulta.getFechaUltActualizacion());

        return consultaDto;
    }
}