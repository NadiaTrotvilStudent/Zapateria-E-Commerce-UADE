package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Acceso a datos para productos.
 */
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findAllByOrderByNombreAsc();

    List<Producto> findByCategoriaIdOrderByNombreAsc(Long categoriaId);

    Optional<Producto> findByNombreAndUsuarioCreadorEmail(String nombre, String email);
}
