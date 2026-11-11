package com.tfi.inmobiliaria.handler;

import com.tfi.inmobiliaria.exceptions.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ProblemDetail manejarExcepcion(Exception excepcion) {
        return switch (excepcion) {
            case RecursoNoEncontradoException ex ->
                    crearProblema(HttpStatus.NOT_FOUND, "Recurso no encontrado", excepcion.getMessage());

            case PropiedadInvalidaException ex ->
                    crearProblema(HttpStatus.BAD_REQUEST, "Datos inválidos", excepcion.getMessage());

            case PublicacionInvalidaException ex ->
                crearProblema(HttpStatus.BAD_REQUEST, "Datos inválidos", excepcion.getMessage());

            case ImagenPropiedadInvalidaException ex ->
                crearProblema(HttpStatus.BAD_REQUEST, "Datos inválidos", excepcion.getMessage());

            case ConsultaInvalidaException ex ->
                crearProblema(HttpStatus.BAD_REQUEST, "Datos inválidos", excepcion.getMessage());

            case FiltroInvalidoException ex ->
                crearProblema(HttpStatus.BAD_REQUEST, "Filtros inválidos", excepcion.getMessage());

            case MaxUploadSizeExceededException ex ->
                crearProblema(HttpStatus.PAYLOAD_TOO_LARGE, "Archivo demasiado grande", "La imagen no puede superar los 5MB.");

            case MethodArgumentNotValidException errorValidacion ->
                    crearProblema(HttpStatus.BAD_REQUEST, "Error de validación", obtenerDetalleValidacion(errorValidacion));

            case BindException ex ->
                    crearProblema(HttpStatus.BAD_REQUEST, "Filtros inválidos", "Uno o más filtros tienen un formato inválido.");

            case CredencialesInvalidasException ex ->
                    crearProblema(HttpStatus.UNAUTHORIZED, "Credenciales inválidas", excepcion.getMessage());

            case AlmacenamientoImagenException ex -> {
                log.error("Error en el almacenamiento de imagenes", ex);

                yield crearProblema(HttpStatus.BAD_GATEWAY, "Error de almacenamiento", ex.getMessage());
            }

            default -> {
                log.error("Error no controlado", excepcion);

                yield crearProblema(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "Ocurrió un error inesperado.");
            }
        };
    }

    private ProblemDetail crearProblema(HttpStatus codigoHttp, String titulo, String detalle) {

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(codigoHttp, detalle);
        problema.setTitle(titulo);

        return problema;
    }

    private String obtenerDetalleValidacion(MethodArgumentNotValidException errorValidacion) {
        return errorValidacion.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(" "));
    }
}