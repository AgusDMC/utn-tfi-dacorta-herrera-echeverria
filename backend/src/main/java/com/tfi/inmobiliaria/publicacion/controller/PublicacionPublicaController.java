package com.tfi.inmobiliaria.publicacion.controller;

import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionDto;
import com.tfi.inmobiliaria.publicacion.service.PublicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class PublicacionPublicaController {

    private final PublicacionService publicacionService;

    @GetMapping
    public PaginaResponseDto<PublicacionDto> obtenerPublicacionesActivas(@PageableDefault(
            size = 12,
            sort = "fechaPublicacion",
            direction = Sort.Direction.DESC) Pageable pageable) {
        return publicacionService.obtenerPublicacionesActivas(pageable);
    }

    @GetMapping("/{id}")
    public PublicacionDto obtenerPublicacionActivaPorId(@PathVariable Long id) {
        return publicacionService.obtenerPublicacionActivaPorId(id);
    }
}