package com.zapateria.ecommerce.dto.catalogo;

/**
 * DTO simple para devolver marcas.
 */
public record MarcaResponse(
        Long id,
        String nombre
) {
}
