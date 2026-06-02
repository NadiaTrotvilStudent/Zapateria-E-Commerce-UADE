package com.zapateria.ecommerce.dto.orden;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Item que forma parte de una orden a crear.
 */
public record CrearOrdenItem(
        @NotNull(message = "El id de la variante de producto es obligatorio")
        Long varianteProductoId,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        Integer cantidad
) {
}
