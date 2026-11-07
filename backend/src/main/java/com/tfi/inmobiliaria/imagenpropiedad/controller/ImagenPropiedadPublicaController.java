package com.tfi.inmobiliaria.imagenpropiedad.controller;

import com.tfi.inmobiliaria.imagenpropiedad.dto.ImagenPropiedadDto;
import com.tfi.inmobiliaria.imagenpropiedad.service.ImagenPropiedadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/propiedades")
@RequiredArgsConstructor
public class ImagenPropiedadPublicaController {

    private final ImagenPropiedadService imagenPropiedadService;

    @GetMapping("/{propiedadId}/imagenes")
    public List<ImagenPropiedadDto> obtenerImagenesPorPropiedad(
            @PathVariable Long propiedadId
    ) {
        return imagenPropiedadService.obtenerImagenesPorPropiedad(propiedadId);
    }
}