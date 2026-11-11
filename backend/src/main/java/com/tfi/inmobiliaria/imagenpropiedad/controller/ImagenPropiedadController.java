package com.tfi.inmobiliaria.imagenpropiedad.controller;

import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadCreateDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadDto;
import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadUpdateDto;
import com.tfi.inmobiliaria.imagenpropiedad.service.ImagenPropiedadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/imagenes-propiedad")
@RequiredArgsConstructor
public class ImagenPropiedadController {
    private final ImagenPropiedadService imagenPropiedadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImagenPropiedadDto crearImagenPropiedad(@Valid @ModelAttribute ImagenPropiedadCreateDto imagenCreateDto) {
        return imagenPropiedadService.crearImagenPropiedad(imagenCreateDto);
    }

    @GetMapping("/propiedad/{propiedadId}")
    public List<ImagenPropiedadDto> obtenerImagenesPorPropiedad(@PathVariable Long propiedadId) {
        return imagenPropiedadService.obtenerImagenesPorPropiedad(propiedadId);
    }

    @GetMapping("/{id}")
    public ImagenPropiedadDto obtenerImagenPropiedadPorId(@PathVariable Long id) {
        return imagenPropiedadService.obtenerImagenPropiedadPorId(id);
    }

    @PutMapping("/{id}")
    public ImagenPropiedadDto actualizarImagenPropiedad(@PathVariable Long id, @Valid @RequestBody ImagenPropiedadUpdateDto imagenUpdateDto) {
        return imagenPropiedadService.actualizarImagenPropiedad(id, imagenUpdateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarImagenPropiedad(@PathVariable Long id) {
        imagenPropiedadService.eliminarImagenPropiedad(id);
    }
}
