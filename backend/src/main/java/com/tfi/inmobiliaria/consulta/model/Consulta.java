package com.tfi.inmobiliaria.consulta.model;

import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "consulta")
@Getter
@Setter
@NoArgsConstructor
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "publicacion_id", nullable = false)
    private Publicacion publicacion;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 80)
    private String apellido;

    @Column(length = 120)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(nullable = false, length = 2000)
    private String mensaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoConsulta estado;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_ult_actualizacion", nullable = false)
    private Instant fechaUltActualizacion;

    @PrePersist
    private void antesDeGuardar() {
        Instant ahora = Instant.now();

        fechaCreacion = ahora;
        fechaUltActualizacion = ahora;
    }

    @PreUpdate
    private void antesDeActualizar() {
        fechaUltActualizacion = Instant.now();
    }
}