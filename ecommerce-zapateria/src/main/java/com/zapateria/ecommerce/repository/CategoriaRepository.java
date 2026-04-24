package com.zapateria.ecommerce.repository;

import com.zapateria.ecommerce.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findAllByOrderByNombreAsc();

    Optional<Categoria> findByNombre(String nombre);
}
