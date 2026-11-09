package com.tfi.inmobiliaria.publicacion.controller;

import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionCreateDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionDto;
import com.tfi.inmobiliaria.publicacion.dto.PublicacionUpdateDto;
import com.tfi.inmobiliaria.publicacion.service.PublicacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/publicaciones")
@RequiredArgsConstructor
public class PublicacionController {

    private final PublicacionService publicacionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PublicacionDto crearPublicacion(@Valid @RequestBody PublicacionCreateDto publicacionCreateDto) {
        return publicacionService.crearPublicacion(publicacionCreateDto);
    }

    @GetMapping
    public PaginaResponseDto<PublicacionDto> obtenerPublicaciones(@PageableDefault(
            size = 20,
            sort = "fechaUltActualizacion",
            direction = Sort.Direction.DESC) Pageable pageable) {
        return publicacionService.obtenerPublicaciones(pageable);
    }

    @GetMapping("/{id}")
    public PublicacionDto obtenerPublicacionPorId(@PathVariable Long id) {
        return publicacionService.obtenerPublicacionPorId(id);
    }

    @PutMapping("/{id}")
    public PublicacionDto actualizarPublicacion(@PathVariable Long id, @Valid @RequestBody PublicacionUpdateDto publicacionUpdateDto) {
        return publicacionService.actualizarPublicacion(id, publicacionUpdateDto);
    }

    @PatchMapping("/{id}/pausar")
    public PublicacionDto pausarPublicacion(@PathVariable Long id) {
        return publicacionService.pausarPublicacion(id);
    }

    @PatchMapping("/{id}/activar")
    public PublicacionDto activarPublicacion(@PathVariable Long id) {
        return publicacionService.activarPublicacion(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPublicacion(@PathVariable Long id) {
        publicacionService.eliminarPublicacion(id);
    }
}