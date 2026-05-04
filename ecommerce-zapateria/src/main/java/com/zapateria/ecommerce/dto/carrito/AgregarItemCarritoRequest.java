package com.zapateria.ecommerce.dto.carrito;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AgregarItemCarritoRequest(
        @NotNull(message = "La variante es obligatoria")
        Long varianteProductoId,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        Integer cantidad
) {
}
