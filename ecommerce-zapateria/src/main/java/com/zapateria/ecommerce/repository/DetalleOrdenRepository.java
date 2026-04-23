package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a datos para detalles de orden.
 */
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {
}
