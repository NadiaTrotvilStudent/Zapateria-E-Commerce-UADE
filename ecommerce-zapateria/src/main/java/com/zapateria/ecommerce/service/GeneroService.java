package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.GeneroResponse;
import com.zapateria.ecommerce.repository.GeneroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Logica de consulta para generos.
 */
@Service
public class GeneroService {

    private final GeneroRepository generoRepository;

    public GeneroService(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    /**
     * Devuelve todos los generos ordenados alfabeticamente.
     */
    public List<GeneroResponse> listarGeneros() {
        return generoRepository.findAllByOrderByNombreAsc().stream()
                .map(genero -> new GeneroResponse(genero.getId(), genero.getNombre()))
                .toList();
    }
}
