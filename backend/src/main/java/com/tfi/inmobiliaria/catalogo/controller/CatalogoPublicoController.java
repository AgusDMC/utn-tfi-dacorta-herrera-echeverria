package com.tfi.inmobiliaria.catalogo.controller;

import com.tfi.inmobiliaria.catalogo.dto.FiltrosCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionCatalogoDto;
import com.tfi.inmobiliaria.catalogo.dto.PublicacionDetalleDto;
import com.tfi.inmobiliaria.catalogo.service.CatalogoService;
import com.tfi.inmobiliaria.catalogo.validator.FiltrosCatalogoValidator;
import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class CatalogoPublicoController {

    private final CatalogoService catalogoService;
    private final FiltrosCatalogoValidator filtrosValidator;

    @GetMapping
    public PaginaResponseDto<PublicacionCatalogoDto> obtenerPublicaciones(@ModelAttribute FiltrosCatalogoDto filtros, @PageableDefault(
            size = 12,
            sort = "fechaPublicacion",
            direction = Sort.Direction.DESC) Pageable pageable) {
        filtrosValidator.validarFiltros(filtros);

        return catalogoService.obtenerPublicaciones(filtros, pageable);
    }

    @GetMapping("/{id}")
    public PublicacionDetalleDto obtenerPublicacionPorId(@PathVariable Long id) {
        return catalogoService.obtenerPublicacionPorId(id);
    }
}
