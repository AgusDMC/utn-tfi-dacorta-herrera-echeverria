package com.tfi.inmobiliaria.auth.service;

import com.tfi.inmobiliaria.auth.dto.LoginRequest;
import com.tfi.inmobiliaria.auth.dto.LoginResponse;
import com.tfi.inmobiliaria.usuario.model.Usuario;
import com.tfi.inmobiliaria.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tfi.inmobiliaria.exceptions.CredencialesInvalidasException;

@Service
@RequiredArgsConstructor
public class AutenticacionService {

    private final UsuarioRepository repositorioUsuario;
    private final PasswordEncoder codificadorClave;
    private final JwtService servicioJwt;

    public LoginResponse iniciarSesion(LoginRequest solicitud) {
        Usuario usuario = repositorioUsuario.findByEmailIgnoreCase(solicitud.getEmail())
                .orElseThrow(this::credencialesInvalidas);

        boolean claveCorrecta = codificadorClave.matches(solicitud.getClave(), usuario.getClaveHash());

        if (!usuario.isActivo() || !claveCorrecta) {
            throw credencialesInvalidas();
        }

        String token = servicioJwt.generarToken(usuario);

        return new LoginResponse(token, "Bearer", usuario.getEmail(), usuario.getRol().name());
    }

    private CredencialesInvalidasException credencialesInvalidas() {
        return new CredencialesInvalidasException(
                "Email o clave incorrectos."
        );
    }
}