package com.tfi.inmobiliaria.consulta.controller;

import com.tfi.inmobiliaria.consulta.dto.ConsultaCreateDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaDto;
import com.tfi.inmobiliaria.consulta.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaPublicaController {

    private final ConsultaService consultaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaDto crearConsulta(@Valid @RequestBody ConsultaCreateDto consultaCreateDto) {
        return consultaService.crearConsulta(consultaCreateDto);
    }
}
