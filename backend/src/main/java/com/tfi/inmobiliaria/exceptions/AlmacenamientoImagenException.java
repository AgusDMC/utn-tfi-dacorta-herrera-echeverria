package com.tfi.inmobiliaria.exceptions;

public class AlmacenamientoImagenException extends RuntimeException {

    public AlmacenamientoImagenException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }

    public AlmacenamientoImagenException(String mensaje) {
        super(mensaje);
    }
}