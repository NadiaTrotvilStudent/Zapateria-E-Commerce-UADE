package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.catalogo.GeneroResponse;
import com.zapateria.ecommerce.service.GeneroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar los generos disponibles.
 */
@RestController
@RequestMapping("/api/generos")
@Tag(name = "Catalogo", description = "Datos auxiliares para navegar productos")
public class GeneroController {

    private final GeneroService generoService;

    public GeneroController(GeneroService generoService) {
        this.generoService = generoService;
    }

    @GetMapping
    @Operation(summary = "Listar generos")
    public List<GeneroResponse> listarGeneros() {
        return generoService.listarGeneros();
    }
}
