package com.tfi.inmobiliaria.publicacion.repository;

import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import com.tfi.inmobiliaria.publicacion.model.TipoOperacion;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long>, JpaSpecificationExecutor<Publicacion> {

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

    // METODO PARA OBTENER UNA PUBLICACION VISIBLE EN EL CATALOGO POR ID
    @EntityGraph(attributePaths = "propiedad")
    @Query("""
       SELECT p
       FROM Publicacion p
       WHERE p.id = :id
       AND p.estadoPublicacion = com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion.ACTIVA
       AND p.estadoComercial IN (
           com.tfi.inmobiliaria.publicacion.model.EstadoComercial.DISPONIBLE,
           com.tfi.inmobiliaria.publicacion.model.EstadoComercial.RESERVADA
       )
       AND p.propiedad.activa = true
       """)
    Optional<Publicacion> findVisibleEnCatalogoPorId(@Param("id") Long id);

    // METODO PARA TRAER PROPIEDADES ASOCIADAS A LAS PUBLICACIONES DEL CATALOGO
    @Override
    @EntityGraph(attributePaths = "propiedad")
    Page<Publicacion> findAll(Specification<Publicacion> specification, Pageable pageable);
}
