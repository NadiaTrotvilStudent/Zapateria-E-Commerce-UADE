package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Acceso a datos para marcas.
 */
public interface MarcaRepository extends JpaRepository<Marca, Long> {
    List<Marca> findAllByOrderByNombreAsc();

    Optional<Marca> findByNombre(String nombre);
}
