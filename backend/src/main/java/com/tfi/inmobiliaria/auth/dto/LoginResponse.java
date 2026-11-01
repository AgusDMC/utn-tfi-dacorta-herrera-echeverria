package com.tfi.inmobiliaria.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String tipoToken;
    private String email;
    private String rol;
}
