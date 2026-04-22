package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.TipoProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Acceso a datos para tipos de producto.
 */
public interface TipoProductoRepository extends JpaRepository<TipoProducto, Long> {
    List<TipoProducto> findAllByOrderByNombreAsc();
}
