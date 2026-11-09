package com.tfi.inmobiliaria.publicacion.service;

import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import com.tfi.inmobiliaria.exceptions.PublicacionInvalidaException;
import com.tfi.inmobiliaria.exceptions.RecursoNoEncontradoException;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.propiedad.repository.PropiedadRepository;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionCreateDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionUpdateDto;
import com.tfi.inmobiliaria.publicacion.mapper.PublicacionMapper;
import com.tfi.inmobiliaria.publicacion.model.EstadoComercial;
import com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import com.tfi.inmobiliaria.publicacion.repository.PublicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PublicacionService {

    private final PublicacionRepository publicacionRepo;
    private final PropiedadRepository propiedadRepo;

    @Transactional
    public PublicacionDto crearPublicacion(PublicacionCreateDto publicacionCreateDto) {
        // BUSCO QUE LA PROPIEDAD DE LA PUBLICACION EXISTA
        Propiedad propiedadPublicacion = propiedadRepo
                .findByIdAndActivaTrue(publicacionCreateDto.getPropiedadId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una propiedad activa con el id: " + publicacionCreateDto.getPropiedadId()));

        // VALIDO QUE NO EXISTA UNA PUBLICACION ACTIVA CON LA PROPIEDAD Y EL TIPO DE OPERACION
        if (publicacionRepo.existePubliConPropiedadYOperacion(propiedadPublicacion.getId(), publicacionCreateDto.getTipoOperacion(), null)) {
            throw new PublicacionInvalidaException("Ya existe una publicacion con la propiedad y el tipo de operacion dados.");
        }

        Publicacion publicacionACrear = PublicacionMapper.convertirCreateDtoAPublicacion(publicacionCreateDto, propiedadPublicacion);

        // REGLA DE NEGOCIO: SI LA PUBLICACION NO TIENE DESCRIPCION SE LE COLOCA LA DESCRIPCION DE LA PROPIEDAD
        if (publicacionACrear.getDescripcion() == null || publicacionACrear.getDescripcion().isBlank()) {
            publicacionACrear.setDescripcion(propiedadPublicacion.getResumen());
        }

        publicacionACrear.setEstadoPublicacion(EstadoPublicacion.ACTIVA);
        publicacionACrear.setEstadoComercial(EstadoComercial.DISPONIBLE);
        publicacionACrear.setFechaPublicacion(Instant.now());

        Publicacion publicacionGuardada = publicacionRepo.save(publicacionACrear);

        return PublicacionMapper.convertirPublicacionADto(publicacionGuardada);
    }

    // OBTIENE TODAS LAS PUBLICACIONES INDEPENDIENTEMENTE DEL ESTADO. PARA LISTADO DE ADMINISTRADOR
    @Transactional(readOnly = true)
    public PaginaResponseDto<PublicacionDto> obtenerPublicaciones(Pageable pageable) {

        Page<PublicacionDto> paginaPublicaciones = publicacionRepo.findAll(pageable)
                .map(PublicacionMapper::convertirPublicacionADto);

        return PaginaResponseDto.desde(paginaPublicaciones);
    }

    @Transactional(readOnly = true)
    public PaginaResponseDto<PublicacionDto> obtenerPublicacionesActivas(Pageable pageable) {
        Page<PublicacionDto> paginaPublicaciones = publicacionRepo.findAllByEstadoPublicacion(EstadoPublicacion.ACTIVA, pageable)
                .map(PublicacionMapper::convertirPublicacionADto);

        return PaginaResponseDto.desde(paginaPublicaciones);
    }

    @Transactional(readOnly = true)
    public PublicacionDto obtenerPublicacionPorId(Long id) {
        Publicacion publicacion = obtenerEntidadPorId(id);

        return PublicacionMapper.convertirPublicacionADto(publicacion);
    }

    @Transactional(readOnly = true)
    public PublicacionDto obtenerPublicacionActivaPorId(Long id) {
        Publicacion publicacion = publicacionRepo.findByIdAndEstadoPublicacion(id, EstadoPublicacion.ACTIVA)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una publicación activa con el id: " + id));

        return PublicacionMapper.convertirPublicacionADto(publicacion);
    }

    @Transactional
    public PublicacionDto actualizarPublicacion(Long id, PublicacionUpdateDto publicacionUpdateDto) {
        Publicacion publiAActualizar = obtenerEntidadPorId(id);

        if (publiAActualizar.getEstadoPublicacion() == EstadoPublicacion.ACTIVA && publicacionRepo.existePubliConPropiedadYOperacion(
                publiAActualizar.getPropiedad().getId(),
                publicacionUpdateDto.getTipoOperacion(),
                publiAActualizar.getId())) {
            throw new PublicacionInvalidaException("Ya existe otra publicación activa con la propiedad y el tipo de operación dados.");
        }

        PublicacionMapper.actualizarPublicacionDesdeUpdateDto(publicacionUpdateDto, publiAActualizar);

        if (publiAActualizar.getDescripcion() == null || publiAActualizar.getDescripcion().isBlank()) {
            publiAActualizar.setDescripcion(publiAActualizar.getPropiedad().getResumen());
        }

        Publicacion publiActualizada = publicacionRepo.saveAndFlush(publiAActualizar);

        return PublicacionMapper.convertirPublicacionADto(publiActualizada);
    }

    @Transactional
    public void eliminarPublicacion(Long id) {
        Publicacion publiAEliminar = obtenerEntidadPorId(id);

        publiAEliminar.setEstadoPublicacion(EstadoPublicacion.ELIMINADA);

        publicacionRepo.save(publiAEliminar);
    }

    @Transactional
    public PublicacionDto pausarPublicacion(Long id) {
        Publicacion publiAPausar = obtenerEntidadPorId(id);

        if (publiAPausar.getEstadoPublicacion() != EstadoPublicacion.ACTIVA) {
            throw new PublicacionInvalidaException("Solo se pueden pausar publicaciones activas.");
        }

        publiAPausar.setEstadoPublicacion(EstadoPublicacion.PAUSADA);

        Publicacion publiPausada = publicacionRepo.saveAndFlush(publiAPausar);

        return PublicacionMapper.convertirPublicacionADto(publiPausada);
    }

    @Transactional
    public PublicacionDto activarPublicacion(Long id) {
        Publicacion publiAActivar = obtenerEntidadPorId(id);

        if (publiAActivar.getEstadoPublicacion() != EstadoPublicacion.PAUSADA) {
            throw new PublicacionInvalidaException("Solo se pueden activar publicaciones pausadas.");
        }

        if (publicacionRepo.existePubliConPropiedadYOperacion(
                publiAActivar.getPropiedad().getId(),
                publiAActivar.getTipoOperacion(),
                publiAActivar.getId()
        )) {
            throw new PublicacionInvalidaException("Ya existe otra publicación activa para esta propiedad y tipo de operación.");
        }

        publiAActivar.setEstadoPublicacion(EstadoPublicacion.ACTIVA);

        Publicacion publiActivada = publicacionRepo.saveAndFlush(publiAActivar);

        return PublicacionMapper.convertirPublicacionADto(publiActivada);
    }

    private Publicacion obtenerEntidadPorId(Long id) {
        return publicacionRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una publicación con el id: " + id));
    }
}