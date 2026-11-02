package com.tfi.inmobiliaria.propiedad.service;

import com.tfi.inmobiliaria.exceptions.PropiedadInvalidaException;
import com.tfi.inmobiliaria.exceptions.RecursoNoEncontradoException;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadCreateDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadUpdateDto;
import com.tfi.inmobiliaria.propiedad.mapper.PropiedadMapper;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.propiedad.repository.PropiedadRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropiedadService {
    private final PropiedadRepository propiedadRepo;

    @Transactional
    public PropiedadDto crearPropiedad(PropiedadCreateDto propCreateDto) {
        validarMenosDormitoriosQueAmbientes(propCreateDto.getCantAmbientes(), propCreateDto.getCantDormitorios());

        Propiedad nuevaPropiedad = PropiedadMapper.convertirCreateDtoAPropiedad(propCreateDto);

        nuevaPropiedad.setActiva(true);

        Propiedad propiedadGuardada = propiedadRepo.save(nuevaPropiedad);

        return PropiedadMapper.convertirPropiedadADto(propiedadGuardada);
    }

    @Transactional(readOnly = true)
    public List<PropiedadDto> obtenerPropiedades() {
        return propiedadRepo.findAllByActivaTrue()
                .stream()
                .map(PropiedadMapper::convertirPropiedadADto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropiedadDto obtenerPropiedadPorId(Long id) {
        Propiedad propiedadEncontrada = obtenerEntidadPorId(id);

        return PropiedadMapper.convertirPropiedadADto(propiedadEncontrada);
    }

    @Transactional
    public PropiedadDto actualizarPropiedad(Long id, PropiedadUpdateDto propUpdateDto) {
        validarMenosDormitoriosQueAmbientes(propUpdateDto.getCantAmbientes(), propUpdateDto.getCantDormitorios());

        Propiedad propiedadAActualizar = obtenerEntidadPorId(id);

        PropiedadMapper.actualizarPropiedadDesdeUpdateDto(propiedadAActualizar, propUpdateDto);

        Propiedad propiedadActualizada = propiedadRepo.save(propiedadAActualizar);

        return PropiedadMapper.convertirPropiedadADto(propiedadActualizada);
    }

    // BAJA LOGICA
    @Transactional
    public void eliminarPropiedad(Long id) {
        Propiedad propiedadAEliminar = obtenerEntidadPorId(id);

        propiedadAEliminar.setActiva(false);

        propiedadRepo.save(propiedadAEliminar);
    }

    private Propiedad obtenerEntidadPorId(Long id) {
        return propiedadRepo.findByIdAndActivaTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe una propiedad activa con id " + id + "."
                ));
    }

    private void validarMenosDormitoriosQueAmbientes(Short cantAmbientes, Short cantDormitorios) {
        // A DEFINIR
        if (cantDormitorios >= cantAmbientes) {
            throw new PropiedadInvalidaException("La cantidad de dormitorios debe ser menor a la cantidad de ambientes.");
        }
    }
}
