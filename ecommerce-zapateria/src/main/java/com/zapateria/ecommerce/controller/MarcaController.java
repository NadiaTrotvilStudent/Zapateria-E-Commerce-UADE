package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.MarcaResponse;
import com.zapateria.ecommerce.service.MarcaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar marcas de productos.
 */
@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public List<MarcaResponse> listarMarcas() {
        return marcaService.listarMarcas();
    }
}
