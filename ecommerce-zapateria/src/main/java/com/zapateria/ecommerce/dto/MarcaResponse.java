package com.zapateria.ecommerce.dto;

/**
 * DTO simple para devolver marcas.
 */
public record MarcaResponse(
        Long id,
        String nombre
) {
}
