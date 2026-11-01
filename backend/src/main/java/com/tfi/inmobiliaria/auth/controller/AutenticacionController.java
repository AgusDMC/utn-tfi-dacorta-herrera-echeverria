package com.tfi.inmobiliaria.auth.controller;

import com.tfi.inmobiliaria.auth.dto.LoginRequest;
import com.tfi.inmobiliaria.auth.dto.LoginResponse;
import com.tfi.inmobiliaria.auth.service.AutenticacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> iniciarSesion(
            @Valid @RequestBody LoginRequest solicitud
    ) {
        LoginResponse respuesta = autenticacionService.iniciarSesion(solicitud);
        return ResponseEntity.ok(respuesta);
    }
}