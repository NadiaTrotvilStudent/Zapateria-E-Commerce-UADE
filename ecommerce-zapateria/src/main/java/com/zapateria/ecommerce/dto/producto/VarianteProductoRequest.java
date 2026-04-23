package com.zapateria.ecommerce.dto.producto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO usado para crear una variante de producto.
 * La variante representa una combinacion concreta de talle, color y stock.
 */
public record VarianteProductoRequest(
        @NotBlank(message = "El talle es obligatorio")
        @Size(max = 20, message = "El talle no puede superar los 20 caracteres")
        String talle,

        @NotBlank(message = "El color es obligatorio")
        @Size(max = 40, message = "El color no puede superar los 40 caracteres")
        String color,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock
) {
}
