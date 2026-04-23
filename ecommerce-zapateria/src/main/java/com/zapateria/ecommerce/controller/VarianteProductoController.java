package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.producto.VarianteProductoRequest;
import com.zapateria.ecommerce.dto.producto.VarianteProductoResponse;
import com.zapateria.ecommerce.service.VarianteProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar y crear variantes de un producto.
 */
@RestController
@RequestMapping("/api/productos/{productoId}/variantes")
public class VarianteProductoController {

    private final VarianteProductoService varianteProductoService;

    public VarianteProductoController(VarianteProductoService varianteProductoService) {
        this.varianteProductoService = varianteProductoService;
    }

    @GetMapping
    public List<VarianteProductoResponse> listarVariantes(@PathVariable Long productoId) {
        return varianteProductoService.listarPorProducto(productoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VarianteProductoResponse crearVariante(
            @PathVariable Long productoId,
            @Valid @RequestBody VarianteProductoRequest request
    ) {
        return varianteProductoService.crearVariante(productoId, request);
    }
}
