package com.zapateria.ecommerce.dto.catalogo;

/**
 * DTO simple para devolver tipos de producto.
 */
public record TipoProductoResponse(
        Long id,
        String nombre
) {
}
