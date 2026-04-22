package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Acceso a datos para variantes de producto.
 */
public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Long> {
    List<VarianteProducto> findByProductoIdOrderByColorAscTalleAsc(Long productoId);
}
