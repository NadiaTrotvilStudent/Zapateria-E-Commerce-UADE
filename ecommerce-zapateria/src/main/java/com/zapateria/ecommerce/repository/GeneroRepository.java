package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.Genero;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Acceso a datos para generos.
 */
public interface GeneroRepository extends JpaRepository<Genero, Long> {
    List<Genero> findAllByOrderByNombreAsc();

    Optional<Genero> findByNombre(String nombre);
}
