package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.catalogo.TipoProductoResponse;
import com.zapateria.ecommerce.repository.TipoProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Logica de consulta para tipos de producto.
 */
@Service
public class TipoProductoService {

    private final TipoProductoRepository tipoProductoRepository;

    public TipoProductoService(TipoProductoRepository tipoProductoRepository) {
        this.tipoProductoRepository = tipoProductoRepository;
    }

    /**
     * Devuelve todos los tipos de producto ordenados alfabeticamente.
     */
    public List<TipoProductoResponse> listarTipos() {
        return tipoProductoRepository.findAllByOrderByNombreAsc().stream()
                .map(tipo -> new TipoProductoResponse(tipo.getId(), tipo.getNombre()))
                .toList();
    }
}
