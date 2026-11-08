package com.tfi.inmobiliaria.consulta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsultaCreateDto {

    @NotNull(message = "La publicación es obligatoria.")
    private Long publicacionId;

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 80, message = "El nombre no puede superar los 80 caracteres.")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(max = 80, message = "El apellido no puede superar los 80 caracteres.")
    private String apellido;

    @Email(message = "El email no tiene un formato válido.")
    @Size(max = 120, message = "El email no puede superar los 120 caracteres.")
    private String email;

    @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres.")
    private String telefono;

    @NotBlank(message = "El mensaje es obligatorio.")
    @Size(max = 2000, message = "El mensaje no puede superar los 2000 caracteres.")
    private String mensaje;
}