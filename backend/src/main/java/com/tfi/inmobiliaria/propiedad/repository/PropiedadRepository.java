package com.tfi.inmobiliaria.propiedad.repository;

import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropiedadRepository extends JpaRepository<Propiedad, Long> {
    List<Propiedad> findAllByActivaTrue();
    Optional<Propiedad> findByIdAndActivaTrue(Long id);
}