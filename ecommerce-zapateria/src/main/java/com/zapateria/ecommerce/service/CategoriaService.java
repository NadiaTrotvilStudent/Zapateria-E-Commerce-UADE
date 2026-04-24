package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.catalogo.CategoriaResponse;
import com.zapateria.ecommerce.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Logica de consulta para categorias.
 */
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Devuelve todas las categorias ordenadas alfabeticamente.
     */
    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findAllByOrderByNombreAsc().stream()
                .map(categoria -> new CategoriaResponse(categoria.getId(), categoria.getNombre()))
                .toList();
    }
}
