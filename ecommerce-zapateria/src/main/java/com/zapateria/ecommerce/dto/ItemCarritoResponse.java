package com.zapateria.ecommerce.dto;

import java.math.BigDecimal;

public record ItemCarritoResponse(
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
