package com.tfi.inmobiliaria.imagenpropiedad.service;

import com.tfi.inmobiliaria.exceptions.ImagenPropiedadInvalidaException;
import com.tfi.inmobiliaria.exceptions.RecursoNoEncontradoException;
import com.tfi.inmobiliaria.imagenpropiedad.almacenamiento.AlmacenamientoImagen;
import com.tfi.inmobiliaria.imagenpropiedad.almacenamiento.ImagenAlmacenada;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadCreateDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadUpdateDto;
import com.tfi.inmobiliaria.imagenpropiedad.mapper.ImagenPropiedadMapper;
import com.tfi.inmobiliaria.imagenpropiedad.model.ImagenPropiedad;
import com.tfi.inmobiliaria.imagenpropiedad.repository.ImagenPropiedadRepository;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.propiedad.repository.PropiedadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImagenPropiedadService {

    private final ImagenPropiedadRepository imagenPropiedadRepo;
    private final PropiedadRepository propiedadRepo;
    private final AlmacenamientoImagen almacenamientoImagen;

    @Transactional
    public ImagenPropiedadDto crearImagenPropiedad(ImagenPropiedadCreateDto imagenCreateDto) {

        // VALIDO LA IMAGEN
        validarArchivo(imagenCreateDto);

        // VALIDO QUE LA PROPIEDAD ASOCIADA A LA IMAGEN EXISTA
        Propiedad propiedad = propiedadRepo.findByIdAndActivaTrue(imagenCreateDto.getPropiedadId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una propiedad activa con el id: " + imagenCreateDto.getPropiedadId()));

        ImagenAlmacenada imagenAlmacenada = almacenamientoImagen.subirImagen(imagenCreateDto.getArchivo(), propiedad.getId());

        ImagenPropiedad imagenPropiedad = ImagenPropiedadMapper.convertirCreateDtoAImagenPropiedad(imagenCreateDto, propiedad, imagenAlmacenada);

        imagenPropiedad.setOrden(obtenerSiguienteOrden(propiedad.getId()));

        try {
            ImagenPropiedad imagenGuardada = imagenPropiedadRepo.save(imagenPropiedad);

            return ImagenPropiedadMapper.convertirImagenPropiedadADto(imagenGuardada);

        } catch (RuntimeException excepcion) {
            try {
                almacenamientoImagen.eliminarImagen(imagenAlmacenada.storageKey());
            } catch (RuntimeException errorAlEliminarArchivo) {
                excepcion.addSuppressed(errorAlEliminarArchivo);
            }

            throw excepcion;
        }
    }

    @Transactional(readOnly = true)
    public List<ImagenPropiedadDto> obtenerImagenesPorPropiedad(Long idPropiedad) {

        propiedadRepo.findByIdAndActivaTrue(idPropiedad)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una propiedad activa con el id: " + idPropiedad));

        return imagenPropiedadRepo.findAllByPropiedadIdOrderByOrdenAsc(idPropiedad)
                .stream()
                .map(ImagenPropiedadMapper::convertirImagenPropiedadADto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ImagenPropiedadDto obtenerImagenPropiedadPorId(Long id) {

        ImagenPropiedad imagen = obtenerEntidadPorId(id);

        return ImagenPropiedadMapper.convertirImagenPropiedadADto(imagen);
    }

    @Transactional
    public ImagenPropiedadDto actualizarImagenPropiedad(Long id, ImagenPropiedadUpdateDto imagenUpdateDto) {
        ImagenPropiedad imgAActualizar = obtenerEntidadPorId(id);

        ImagenPropiedadMapper.actualizarImagenPropiedadDesdeUpdateDto(imagenUpdateDto, imgAActualizar);

        ImagenPropiedad imgActualizada = imagenPropiedadRepo.save(imgAActualizar);

        return ImagenPropiedadMapper.convertirImagenPropiedadADto(imgActualizada);
    }

    @Transactional
    public void eliminarImagenPropiedad(Long id) {
        ImagenPropiedad imagenPropiedad = obtenerEntidadPorId(id);

        almacenamientoImagen.eliminarImagen(imagenPropiedad.getStorageKey());

        imagenPropiedadRepo.delete(imagenPropiedad);
    }

    private ImagenPropiedad obtenerEntidadPorId(Long id) {
        return imagenPropiedadRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró una imagen con el id: " + id));
    }

    private Short obtenerSiguienteOrden(Long propiedadId) {
        return imagenPropiedadRepo
                .findFirstByPropiedadIdOrderByOrdenDesc(propiedadId)
                .map(imagen -> (short) (imagen.getOrden() + 1))
                .orElse((short) 1);
    }

    private void validarArchivo(ImagenPropiedadCreateDto imagenCreateDto) {

        if (imagenCreateDto.getArchivo() == null || imagenCreateDto.getArchivo().isEmpty()) {
            throw new ImagenPropiedadInvalidaException("Debe seleccionar una imagen con contenido.");
        }

        String tipoContenido = imagenCreateDto.getArchivo().getContentType();

        if (!"image/jpeg".equals(tipoContenido) && !"image/png".equals(tipoContenido) && !"image/webp".equals(tipoContenido)) {
            throw new ImagenPropiedadInvalidaException("El archivo debe ser una imagen JPG, PNG o WEBP.");
        }
    }
}