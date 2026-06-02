package com.zapateria.ecommerce.dto.orden;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * DTO de entrada para crear una orden de compra.
 */
public record CrearOrdenRequest(
        @NotNull(message = "El id del usuario es obligatorio")
        Long usuarioId,

        @NotEmpty(message = "La orden debe tener al menos un item")
        List<@Valid CrearOrdenItem> items
) {
}
