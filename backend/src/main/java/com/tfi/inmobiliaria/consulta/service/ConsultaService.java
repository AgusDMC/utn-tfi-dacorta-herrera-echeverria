package com.tfi.inmobiliaria.consulta.service;

import com.tfi.inmobiliaria.consulta.dto.ConsultaCreateDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaEstadoUpdateDto;
import com.tfi.inmobiliaria.consulta.mapper.ConsultaMapper;
import com.tfi.inmobiliaria.consulta.model.Consulta;
import com.tfi.inmobiliaria.consulta.model.EstadoConsulta;
import com.tfi.inmobiliaria.consulta.repository.ConsultaRepository;
import com.tfi.inmobiliaria.exceptions.ConsultaInvalidaException;
import com.tfi.inmobiliaria.exceptions.RecursoNoEncontradoException;
import com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import com.tfi.inmobiliaria.publicacion.repository.PublicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepo;
    private final PublicacionRepository publicacionRepo;

    @Transactional
    public ConsultaDto crearConsulta(ConsultaCreateDto consultaCreateDto) {
        Publicacion publicacion = publicacionRepo.findByIdAndEstadoPublicacion(consultaCreateDto.getPublicacionId(), EstadoPublicacion.ACTIVA)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una publicación activa con el id: " + consultaCreateDto.getPublicacionId()));

        validarMedioDeContacto(consultaCreateDto);

        Consulta consulta = ConsultaMapper.convertirCreateDtoAConsulta(consultaCreateDto, publicacion);

        consulta.setEstado(EstadoConsulta.NUEVA);

        Consulta consultaGuardada = consultaRepo.save(consulta);

        return ConsultaMapper.convertirConsultaADto(consultaGuardada);
    }

    @Transactional(readOnly = true)
    public List<ConsultaDto> obtenerConsultas() {
        return consultaRepo.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(ConsultaMapper::convertirConsultaADto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConsultaDto obtenerConsultaPorId(Long id) {
        Consulta consultaObtenida = obtenerEntidadPorId(id);

        return ConsultaMapper.convertirConsultaADto(consultaObtenida);
    }

    @Transactional
    public ConsultaDto actualizarEstadoConsulta(Long id, ConsultaEstadoUpdateDto consultaEstadoUpdateDto) {
        Consulta consultaAActualizar = obtenerEntidadPorId(id);

        consultaAActualizar.setEstado(consultaEstadoUpdateDto.getEstado());

        Consulta consultaActualizada = consultaRepo.saveAndFlush(consultaAActualizar);

        return ConsultaMapper.convertirConsultaADto(consultaActualizada);
    }

    private Consulta obtenerEntidadPorId(Long id) {
        return consultaRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una consulta con el id: " + id));
    }

    private void validarMedioDeContacto(ConsultaCreateDto consultaCreateDto) {
        boolean noTieneMail = consultaCreateDto.getEmail() == null || consultaCreateDto.getEmail().isBlank();

        boolean noTieneTelefono = consultaCreateDto.getTelefono() == null || consultaCreateDto.getTelefono().isBlank();

        if (noTieneMail && noTieneTelefono) {
            throw new ConsultaInvalidaException("Debe indicar al menos un medio de contacto.");
        }
    }
}