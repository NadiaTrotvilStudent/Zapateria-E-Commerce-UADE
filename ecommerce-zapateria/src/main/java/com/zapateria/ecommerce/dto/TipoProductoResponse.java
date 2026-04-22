package com.zapateria.ecommerce.dto;

/**
 * DTO simple para devolver tipos de producto.
 */
public record TipoProductoResponse(
        Long id,
        String nombre
) {
}
