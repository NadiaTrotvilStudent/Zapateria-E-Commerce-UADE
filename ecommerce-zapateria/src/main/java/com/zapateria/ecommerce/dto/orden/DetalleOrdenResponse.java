package com.zapateria.ecommerce.dto.orden;

import java.math.BigDecimal;

/**
 * DTO que representa una linea de una orden.
 */
public record DetalleOrdenResponse(
        Long id,
        Long varianteProductoId,
        Long productoId,
        String productoNombre,
        String talle,
        String color,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {
}
