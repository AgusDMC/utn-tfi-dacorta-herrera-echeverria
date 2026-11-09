package com.tfi.inmobiliaria.catalogo.controller;

import com.tfi.inmobiliaria.catalogo.dto.PublicacionCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionDetalleDto;
import com.tfi.inmobiliaria.catalogo.service.CatalogoService;
import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class CatalogoPublicoController {

    private final CatalogoService catalogoService;

    @GetMapping
    public PaginaResponseDto<PublicacionCatalogoDto> obtenerPublicaciones(@PageableDefault(
            size = 12,
            sort = "fechaPublicacion",
            direction = Sort.Direction.DESC) Pageable pageable) {
        return catalogoService.obtenerPublicaciones(pageable);
    }

    @GetMapping("/{id}")
    public PublicacionDetalleDto obtenerPublicacionPorId(@PathVariable Long id) {
        return catalogoService.obtenerPublicacionPorId(id);
    }
}
