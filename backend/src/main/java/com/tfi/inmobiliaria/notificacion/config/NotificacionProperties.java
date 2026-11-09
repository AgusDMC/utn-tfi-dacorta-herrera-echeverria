package com.tfi.inmobiliaria.notificacion.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.notificacion")
public class NotificacionProperties {
    private String remitente;
    private String nombreRemitente;
    private String destinatario;
}
