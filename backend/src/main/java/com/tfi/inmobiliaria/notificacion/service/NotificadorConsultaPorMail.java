package com.tfi.inmobiliaria.notificacion.service;

import com.tfi.inmobiliaria.consulta.model.Consulta;
import com.tfi.inmobiliaria.notificacion.config.NotificacionProperties;
import com.tfi.inmobiliaria.notificacion.interfaces.NotificadorConsulta;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificadorConsultaPorMail implements NotificadorConsulta {

    private final JavaMailSender mailSender;
    private final NotificacionProperties notificacionProperties;

    @Override
    public void notificarNuevaConsulta(Consulta consulta) {
        SimpleMailMessage email = new SimpleMailMessage();

        // Nexo Inmobiliaria <nexoinmobiliaria@gmail.com>
        email.setFrom(notificacionProperties.getNombreRemitente() + " <" + notificacionProperties.getRemitente() + ">");
        email.setTo(notificacionProperties.getDestinatario());
        email.setSubject("Nueva consulta sobre " + consulta.getPublicacion().getTitulo());
        email.setText(generarContenidoCorreo(consulta));

        mailSender.send(email);
    }

    private String generarContenidoCorreo(Consulta consulta) {
        String emailContacto = consulta.getEmail() != null ? consulta.getEmail() : "No informado";

        String telefonoContacto = consulta.getTelefono() != null ? consulta.getTelefono() : "No informado";

        return """
                Se recibió una nueva consulta.
                
                Publicación: %s
                Consultante: %s %s
                Email: %s
                Teléfono: %s
                
                Mensaje:
                %s
                """.formatted(
                        consulta.getPublicacion().getTitulo(),
                consulta.getNombre(),
                consulta.getApellido(),
                emailContacto,
                telefonoContacto,
                consulta.getMensaje()
        );
    }
}
