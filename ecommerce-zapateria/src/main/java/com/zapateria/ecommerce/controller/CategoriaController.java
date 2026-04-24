package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.catalogo.CategoriaResponse;
import com.zapateria.ecommerce.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar las categorias disponibles.
 */
@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Catalogo", description = "Datos auxiliares para navegar productos")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Listar categorias")
    public List<CategoriaResponse> listarCategorias() {
        return categoriaService.listarCategorias();
    }
}
