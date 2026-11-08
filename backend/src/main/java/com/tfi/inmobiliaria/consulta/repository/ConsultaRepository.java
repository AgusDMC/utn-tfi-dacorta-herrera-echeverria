package com.tfi.inmobiliaria.consulta.repository;

import com.tfi.inmobiliaria.consulta.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    // OBTENGO CONSULTAS POR FECHA DE CREACION
    List<Consulta> findAllByOrderByFechaCreacionDesc();
}