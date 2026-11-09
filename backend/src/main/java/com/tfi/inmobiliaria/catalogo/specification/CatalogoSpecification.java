package com.tfi.inmobiliaria.catalogo.specification;

import com.tfi.inmobiliaria.catalogo.dto.FiltrosCatalogoDto;
import com.tfi.inmobiliaria.propiedad.model.Propiedad;
import com.tfi.inmobiliaria.publicacion.model.EstadoComercial;
import com.tfi.inmobiliaria.publicacion.model.EstadoPublicacion;
import com.tfi.inmobiliaria.publicacion.model.Publicacion;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class CatalogoSpecification {

    private CatalogoSpecification() {
    }

    public static Specification<Publicacion> crear(FiltrosCatalogoDto filtros) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> condiciones = new ArrayList<>();

            Join<Publicacion, Propiedad> propiedad = root.join("propiedad");

            agregarReglasDeVisibilidad(root, propiedad, condiciones);
            agregarFiltros(root, propiedad, filtros, condiciones, criteriaBuilder);

            return criteriaBuilder.and(condiciones.toArray(new Predicate[0]));
        };
    }

    private static void agregarReglasDeVisibilidad(
            jakarta.persistence.criteria.Root<Publicacion> root,
            Join<Publicacion, Propiedad> propiedad,
            List<Predicate> condiciones
    ) {
        condiciones.add(root.get("estadoPublicacion").in(EstadoPublicacion.ACTIVA));
        condiciones.add(root.get("estadoComercial").in(
                EstadoComercial.DISPONIBLE,
                EstadoComercial.RESERVADA
        ));
        condiciones.add(propiedad.get("activa").in(true));
    }

    private static void agregarFiltros(
            jakarta.persistence.criteria.Root<Publicacion> root,
            Join<Publicacion, Propiedad> propiedad,
            FiltrosCatalogoDto filtros,
            List<Predicate> condiciones,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder
    ) {
        if (filtros.getTipoOperacion() != null) {
            condiciones.add(criteriaBuilder.equal(root.get("tipoOperacion"), filtros.getTipoOperacion()));
        }

        if (filtros.getTipoPropiedad() != null) {
            condiciones.add(criteriaBuilder.equal(propiedad.get("tipoPropiedad"), filtros.getTipoPropiedad()));
        }

        if (filtros.getLocalidad() != null && !filtros.getLocalidad().isBlank()) {
            condiciones.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(propiedad.get("localidad")),
                    filtros.getLocalidad().trim().toLowerCase(Locale.ROOT)
            ));
        }

        if (filtros.getMoneda() != null) {
            condiciones.add(criteriaBuilder.equal(root.get("moneda"), filtros.getMoneda()));
        }

        if (filtros.getPrecioMin() != null) {
            condiciones.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.<BigDecimal>get("precio"),
                    filtros.getPrecioMin()
            ));
        }

        if (filtros.getPrecioMax() != null) {
            condiciones.add(criteriaBuilder.lessThanOrEqualTo(
                    root.<BigDecimal>get("precio"),
                    filtros.getPrecioMax()
            ));
        }

        if (filtros.getAmbientesMin() != null) {
            condiciones.add(criteriaBuilder.greaterThanOrEqualTo(
                    propiedad.<Short>get("cantAmbientes"),
                    filtros.getAmbientesMin()
            ));
        }

        if (filtros.getDormitoriosMin() != null) {
            condiciones.add(criteriaBuilder.greaterThanOrEqualTo(
                    propiedad.<Short>get("cantDormitorios"),
                    filtros.getDormitoriosMin()
            ));
        }

        if (filtros.getTienePatio() != null) {
            condiciones.add(criteriaBuilder.equal(
                    propiedad.get("tienePatio"),
                    filtros.getTienePatio()
            ));
        }

        if (Boolean.TRUE.equals(filtros.getSoloDisponibles())) {
            condiciones.add(criteriaBuilder.equal(
                    root.get("estadoComercial"),
                    EstadoComercial.DISPONIBLE
            ));
        }
    }
}