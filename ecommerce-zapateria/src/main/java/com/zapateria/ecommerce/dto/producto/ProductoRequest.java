package com.zapateria.ecommerce.dto.producto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO usado para crear o actualizar productos.
 * Contiene solo los datos generales del articulo.
 * El stock real se administra a traves de las variantes.
 */
public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String nombre,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 500, message = "La descripcion no puede superar los 500 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotEmpty(message = "Debe adjuntar al menos una imagen")
        @Size(max = 10, message = "No se pueden adjuntar mas de 10 imagenes")
        List<@NotBlank(message = "La url de la imagen no puede estar vacia")
             @jakarta.validation.constraints.Size(max = 255, message = "La imagen no puede superar los 255 caracteres")
             String> imagenes,

        @NotNull(message = "La marca es obligatoria")
        Long marcaId,

        @NotNull(message = "El tipo de producto es obligatorio")
        Long tipoProductoId,

        @NotNull(message = "El genero es obligatorio")
        Long generoId,

        @NotNull(message = "La categoria es obligatoria")
        Long categoriaId,

        @NotNull(message = "El usuario creador es obligatorio")
        Long usuarioCreadorId
) {
}
