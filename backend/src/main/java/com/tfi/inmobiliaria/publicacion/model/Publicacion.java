package com.tfi.inmobiliaria.publicacion.model;

import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "publicacion")
@Getter
@Setter
@NoArgsConstructor
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "propiedad_id", nullable = false)
    private Propiedad propiedad;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_publicacion", nullable = false, length = 20)
    private EstadoPublicacion estadoPublicacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacion", nullable = false, length = 20)
    private TipoOperacion tipoOperacion;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Moneda moneda;

    @Column(precision = 12, scale = 2)
    private BigDecimal expensas;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_comercial", nullable = false, length = 20)
    private EstadoComercial estadoComercial;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_publicacion")
    private Instant fechaPublicacion;

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
