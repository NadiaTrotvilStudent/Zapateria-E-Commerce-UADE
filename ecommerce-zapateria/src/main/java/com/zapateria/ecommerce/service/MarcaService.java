package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.MarcaResponse;
import com.zapateria.ecommerce.repository.MarcaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Logica de consulta para marcas.
 */
@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    /**
     * Devuelve todas las marcas ordenadas alfabeticamente.
     */
    public List<MarcaResponse> listarMarcas() {
        return marcaRepository.findAllByOrderByNombreAsc().stream()
                .map(marca -> new MarcaResponse(marca.getId(), marca.getNombre()))
                .toList();
    }
}
