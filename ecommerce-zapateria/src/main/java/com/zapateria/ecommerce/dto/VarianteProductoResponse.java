package com.zapateria.ecommerce.dto;

/**
 * DTO de salida para devolver variantes.
 */
public record VarianteProductoResponse(
        Long id,
        String talle,
        String color,
        Integer stock
) {
}
