package com.tfi.inmobiliaria.propiedad.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "propiedad")
@Getter
@Setter
@NoArgsConstructor
public class Propiedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_propiedad", nullable = false, length = 20)
    private TipoPropiedad tipoPropiedad;

    @Column(nullable = false, length = 500)
    private String resumen;

    @Column(nullable = false, length = 200)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String localidad;

    @Column(name = "cant_ambientes", nullable = false)
    private Short cantAmbientes;

    @Column(name = "cant_dormitorios", nullable = false)
    private Short cantDormitorios;

    @Column(name = "cant_banios", nullable = false)
    private Short cantBanios;

    @Column(name = "tiene_patio", nullable = false)
    private boolean tienePatio;

    @Column(name = "superficie_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal superficieTotal;

    @Column(name = "anio_construccion")
    private Short anioConstruccion;

    @Column(nullable = false)
    private boolean activa = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_ult_actualizacion", nullable = false)
    private Instant fechaUltActualizacion;

    @PrePersist
    private void antesDeCrear() {
        Instant ahora = Instant.now();
        fechaCreacion = ahora;
        fechaUltActualizacion = ahora;
    }

    @PreUpdate
    private void antesDeActualizar() {
        fechaUltActualizacion = Instant.now();
    }
}