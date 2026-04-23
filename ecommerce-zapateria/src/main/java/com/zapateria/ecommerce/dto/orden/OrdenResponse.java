package com.zapateria.ecommerce.dto.orden;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de salida con el resumen de una orden y sus detalles.
 */
public record OrdenResponse(
        Long id,
        Long usuarioId,
        String username,
        BigDecimal total,
        LocalDateTime fechaCreacion,
        List<DetalleOrdenResponse> detalles
) {
}
