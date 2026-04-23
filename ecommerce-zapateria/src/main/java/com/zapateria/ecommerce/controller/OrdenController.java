package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.orden.OrdenResponse;
import com.zapateria.ecommerce.service.OrdenService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar el historial de compras.
 */
@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    /**
     * Lista las ordenes realizadas por un usuario.
     */
    @GetMapping
    public List<OrdenResponse> listarPorUsuario(@RequestParam Long usuarioId) {
        return ordenService.listarOrdenesPorUsuario(usuarioId);
    }

    /**
     * Devuelve el detalle de una orden puntual.
     */
    @GetMapping("/{ordenId}")
    public OrdenResponse obtenerOrden(@PathVariable Long ordenId) {
        return ordenService.obtenerOrden(ordenId);
    }
}
