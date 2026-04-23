package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Acceso a datos para ordenes.
 */
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    // Devuelve el historial de compras de un usuario, desde la mas nueva.
    List<Orden> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
