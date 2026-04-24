package com.zapateria.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CarritoResponse(
        Long id,
        Long usuarioId,
        String username,
        List<ItemCarritoResponse> items,
        Integer cantidadItems,
        BigDecimal total,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {
}
