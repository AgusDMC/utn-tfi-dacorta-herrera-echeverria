package com.tfi.inmobiliaria.propiedad.controller;

import com.tfi.inmobiliaria.propiedad.dto.PropiedadCreateDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadDto;
import com.tfi.inmobiliaria.propiedad.dto.PropiedadUpdateDto;
import com.tfi.inmobiliaria.propiedad.service.PropiedadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/propiedades")
@RequiredArgsConstructor
public class PropiedadController {
    private final PropiedadService propiedadService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PropiedadDto crearPropiedad(@Valid @RequestBody PropiedadCreateDto propCreateDto) {
        return propiedadService.crearPropiedad(propCreateDto);
    }

    @GetMapping
    public List<PropiedadDto> obtenerPropiedades() {
        return propiedadService.obtenerPropiedades();
    }

    @GetMapping("/{id}")
    public PropiedadDto obtenerPropiedadPorId(@PathVariable("id") Long id) {
        return propiedadService.obtenerPropiedadPorId(id);
    }

    @PutMapping("/{id}")
    public PropiedadDto actualizarPropiedad(@PathVariable("id") Long id, @Valid @RequestBody PropiedadUpdateDto propUpdateDto) {
        return propiedadService.actualizarPropiedad(id, propUpdateDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPropiedad(@PathVariable("id") Long id) {
        propiedadService.eliminarPropiedad(id);
    }
}
