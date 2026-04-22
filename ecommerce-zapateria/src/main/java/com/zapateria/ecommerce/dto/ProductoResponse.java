package com.zapateria.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO completo para devolver productos con sus relaciones principales.
 */
public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        String imagenUrl,
        Long marcaId,
        String marcaNombre,
        Long tipoProductoId,
        String tipoProductoNombre,
        Long generoId,
        String generoNombre,
        Long categoriaId,
        String categoriaNombre,
        Long usuarioCreadorId,
        String usuarioCreadorUsername,
        List<VarianteProductoResponse> variantes
) {
}
