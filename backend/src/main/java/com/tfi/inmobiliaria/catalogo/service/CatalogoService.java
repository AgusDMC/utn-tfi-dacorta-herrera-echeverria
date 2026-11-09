package com.tfi.inmobiliaria.catalogo.service;

import com.tfi.inmobiliaria.catalogo.dto.FiltrosCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionDetalleDto;
import com.tfi.inmobiliaria.catalogo.mapper.CatalogoMapper;
import com.tfi.inmobiliaria.catalogo.specification.CatalogoSpecification;
import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import com.tfi.inmobiliaria.exceptions.RecursoNoEncontradoException;
import com.tfi.inmobiliaria.imagenpropiedad.model.ImagenPropiedad;
import com.tfi.inmobiliaria.imagenpropiedad.repository.ImagenPropiedadRepository;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import com.tfi.inmobiliaria.publicacion.repository.PublicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final PublicacionRepository publicacionRepo;
    private final ImagenPropiedadRepository imagenPropiedadRepo;

    @Transactional(readOnly = true)
    public PaginaResponseDto<PublicacionCatalogoDto> obtenerPublicaciones(FiltrosCatalogoDto filtros, Pageable pageable) {

        Page<Publicacion> pagPublicaciones = publicacionRepo.findAll(CatalogoSpecification.crear(filtros), pageable);

        Map<Long, ImagenPropiedad> portadasPorPropiedad = obtenerPortadasPorPropiedad(pagPublicaciones.getContent());

        Page<PublicacionCatalogoDto> pagCatalogo = pagPublicaciones.map(publicacion ->
                convertirPublicacionACatalogo(publicacion, portadasPorPropiedad)
        );

        return PaginaResponseDto.desde(pagCatalogo);
    }

    @Transactional(readOnly = true)
    public PublicacionDetalleDto obtenerPublicacionPorId(Long id) {

        // BUSCO PUBLICACION POR ID
        Publicacion publicacion = publicacionRepo.findVisibleEnCatalogoPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una publicación visible con el id: " + id));

        // OBTENGO LAS IMAGENES DE LA PROPIEDAD DE LA PUBLICACION
        List<ImagenPropiedad> imagenes = imagenPropiedadRepo.findAllByPropiedadIdOrderByOrdenAsc(publicacion.getPropiedad().getId());

        return CatalogoMapper.convertirAPublicacionDetalleDto(publicacion, imagenes);
    }

    private Map<Long, ImagenPropiedad> obtenerPortadasPorPropiedad(List<Publicacion> publicaciones) {

        // Obtengo los IDs de las propiedades
        List<Long> propiedadesId = publicaciones.stream()
                .map(publicacion -> publicacion.getPropiedad().getId())
                .distinct()
                .toList();

        if (propiedadesId.isEmpty()) {
            return Map.of();
        }

        // RETORNO MAPEO (IDPROPIEDAD - IMGPORTADA)
        // LA PORTADA ES AQUELLA IMAGEN CON MENOR NRO DE ORDEN
        return imagenPropiedadRepo.findAllByPropiedadIdInOrderByPropiedadIdAscOrdenAsc(propiedadesId)
                .stream()
                .collect(Collectors.toMap(
                        imagen -> imagen.getPropiedad().getId(),
                        imagen -> imagen,
                        (portadaActual, otraImagen) -> portadaActual
                ));
    }

    private PublicacionCatalogoDto convertirPublicacionACatalogo(Publicacion publicacion, Map<Long, ImagenPropiedad> portadasPorPropiedad) {
        Long propiedadId = publicacion.getPropiedad().getId();

        ImagenPropiedad portada = portadasPorPropiedad.get(propiedadId);

        return CatalogoMapper.convertirAPublicacionCatalogoDto(publicacion, portada);
    }
}
