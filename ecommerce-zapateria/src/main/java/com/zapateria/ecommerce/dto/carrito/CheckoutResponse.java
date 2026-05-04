package com.zapateria.ecommerce.dto.carrito;

import java.math.BigDecimal;

public record CheckoutResponse(
        String mensaje,
        Long ordenId,
        Long carritoId,
        Integer cantidadItemsProcesados,
        BigDecimal total

) {
}
