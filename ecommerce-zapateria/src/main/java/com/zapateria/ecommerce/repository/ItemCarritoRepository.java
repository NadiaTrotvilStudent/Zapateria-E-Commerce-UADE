package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {

    Optional<ItemCarrito> findByCarritoIdAndVarianteProductoId(Long carritoId, Long varianteProductoId);
}
