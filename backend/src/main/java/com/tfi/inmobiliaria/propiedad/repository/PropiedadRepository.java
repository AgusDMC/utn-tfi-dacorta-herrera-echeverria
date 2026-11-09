package com.tfi.inmobiliaria.propiedad.repository;

import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface PropiedadRepository extends JpaRepository<Propiedad, Long> {
    Page<Propiedad> findAllByActivaTrue(Pageable pageable);
    Optional<Propiedad> findByIdAndActivaTrue(Long id);
}