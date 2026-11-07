package com.tfi.inmobiliaria.imagenpropiedad.model;

import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "imagen_propiedad")
@Getter
@Setter
@NoArgsConstructor
public class ImagenPropiedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "propiedad_id", nullable = false)
    private Propiedad propiedad;

    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "storage_key", nullable = false, length = 255)
    private String storageKey;

    @Column(nullable = false)
    private Short orden;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion;

    @PrePersist
    private void antesDeGuardar() {
        fechaCreacion = Instant.now();
    }
}