package com.tfi.inmobiliaria.compartido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@AllArgsConstructor
public class PaginaResponseDto<T> {

    private final List<T> results;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean hasNext;
    private final boolean hasPrevious;

    public static <T> PaginaResponseDto<T> desde(Page<T> pagina) {
        return new PaginaResponseDto<>(
                pagina.getContent(),
                pagina.getNumber(),
                pagina.getSize(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.hasNext(),
                pagina.hasPrevious()
        );
    }
}
