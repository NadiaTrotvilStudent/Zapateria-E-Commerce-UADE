package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.catalogo.GeneroResponse;
import com.zapateria.ecommerce.service.GeneroService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar los generos disponibles.
 */
@RestController
@RequestMapping("/api/generos")
public class GeneroController {

    private final GeneroService generoService;

    public GeneroController(GeneroService generoService) {
        this.generoService = generoService;
    }

    @GetMapping
    public List<GeneroResponse> listarGeneros() {
        return generoService.listarGeneros();
    }
}
