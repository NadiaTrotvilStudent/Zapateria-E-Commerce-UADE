package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.catalogo.MarcaResponse;
import com.zapateria.ecommerce.service.MarcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar marcas de productos.
 */
@RestController
@RequestMapping("/api/marcas")
@Tag(name = "Catalogo", description = "Datos auxiliares para navegar productos")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    @Operation(summary = "Listar marcas")
    public List<MarcaResponse> listarMarcas() {
        return marcaService.listarMarcas();
    }
}
