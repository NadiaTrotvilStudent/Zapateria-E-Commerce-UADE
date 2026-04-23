package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.catalogo.TipoProductoResponse;
import com.zapateria.ecommerce.service.TipoProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar los tipos de producto.
 */
@RestController
@RequestMapping("/api/tipos-producto")
@Tag(name = "Catalogo", description = "Datos auxiliares para navegar productos")
public class TipoProductoController {

    private final TipoProductoService tipoProductoService;

    public TipoProductoController(TipoProductoService tipoProductoService) {
        this.tipoProductoService = tipoProductoService;
    }

    @GetMapping
    @Operation(summary = "Listar tipos de producto")
    public List<TipoProductoResponse> listarTipos() {
        return tipoProductoService.listarTipos();
    }
}
