package com.tfi.inmobiliaria.imagenpropiedad.repository;

import com.tfi.inmobiliaria.imagenpropiedad.model.ImagenPropiedad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImagenPropiedadRepository extends JpaRepository<ImagenPropiedad, Long> {
    // OBTENER TODAS LAS IMAGENES DE UNA PROPIEDAD
    List<ImagenPropiedad> findAllByPropiedadIdOrderByOrdenAsc(Long propiedadId);

    boolean existsByStorageKey(String storageKey);

    Optional<ImagenPropiedad> findFirstByPropiedadIdOrderByOrdenDesc(Long propiedadId);
}