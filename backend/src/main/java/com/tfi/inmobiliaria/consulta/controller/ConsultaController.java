package com.tfi.inmobiliaria.consulta.controller;

import com.tfi.inmobiliaria.compartido.dto.PaginaResponseDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaDto;
import com.tfi.inmobiliaria.consulta.dto.ConsultaEstadoUpdateDto;
import com.tfi.inmobiliaria.consulta.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @GetMapping
    public PaginaResponseDto<ConsultaDto> obtenerConsultas(@PageableDefault(
            size = 20,
            sort = "fechaCreacion",
            direction = Sort.Direction.DESC) Pageable pageable) {
        return consultaService.obtenerConsultas(pageable);
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
