package com.tfi.inmobiliaria.publicacion.repository;

import com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    Page<Publicacion> findAllByEstadoPublicacion(EstadoPublicacion estadoPublicacion, Pageable pageable);

    Optional<Publicacion> findByIdAndEstadoPublicacion(Long id, EstadoPublicacion estadoPublicacion);

    // METODO PARA VALIDAR QUE NO HAYA UNA PUBLICACION ACTIVA CON LA MISMA PROPIEDAD Y EL MISMO TIPO DE OPERACION
    @Query("""
       SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
       FROM Publicacion p
       WHERE p.propiedad.id = :propiedadId
       AND p.tipoOperacion = :tipoOperacion
       AND p.estadoPublicacion = com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion.ACTIVA
       AND (:idPublicacionAExcluir IS NULL OR p.id <> :idPublicacionAExcluir)
       """)
    boolean existePubliConPropiedadYOperacion(
            @Param("propiedadId") Long propiedadId,
            @Param("tipoOperacion") TipoOperacion tipoOperacion,
            @Param("idPublicacionAExcluir") Long idPublicacionAExcluir
    );
}
