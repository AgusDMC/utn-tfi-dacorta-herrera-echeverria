package com.tfi.inmobiliaria.consulta.controller;

import com.tfi.inmobiliaria.consulta.dto.ConsultaDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaEstadoUpdateDto;
import com.tfi.inmobiliaria.consulta.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @GetMapping
    public List<ConsultaDto> obtenerConsultas() {
        return consultaService.obtenerConsultas();
    }

    @GetMapping("/{id}")
    public ConsultaDto obtenerConsultaPorId(@PathVariable Long id) {
        return consultaService.obtenerConsultaPorId(id);
    }

    @PatchMapping("/{id}/estado")
    public ConsultaDto actualizarEstadoConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaEstadoUpdateDto consultaEstadoUpdateDto) {
        return consultaService.actualizarEstadoConsulta(id, consultaEstadoUpdateDto);
    }
}
