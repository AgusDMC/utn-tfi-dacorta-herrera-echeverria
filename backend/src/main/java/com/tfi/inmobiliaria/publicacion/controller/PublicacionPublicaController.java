package com.tfi.inmobiliaria.publicacion.controller;

import com.tfi.inmobiliaria.publicacion.dto.PublicacionDto;
import com.tfi.inmobiliaria.publicacion.service.PublicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class PublicacionPublicaController {

    private final PublicacionService publicacionService;

    @GetMapping
    public List<PublicacionDto> obtenerPublicacionesActivas() {
        return publicacionService.obtenerPublicacionesActivas();
    }

    @GetMapping("/{id}")
    public PublicacionDto obtenerPublicacionActivaPorId(@PathVariable Long id) {
        return publicacionService.obtenerPublicacionActivaPorId(id);
    }
}