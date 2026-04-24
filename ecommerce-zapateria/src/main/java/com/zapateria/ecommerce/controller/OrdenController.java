package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.orden.OrdenResponse;
import com.zapateria.ecommerce.service.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para consultar el historial de compras.
 */
@RestController
@RequestMapping("/api/ordenes")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Ordenes", description = "Historial y detalle de compras del usuario autenticado")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @GetMapping
    @Operation(summary = "Listar mis ordenes", description = "Devuelve el historial de compras del usuario autenticado.")
    public List<OrdenResponse> listarMisOrdenes(@Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        return ordenService.listarOrdenesPorUsuario(currentUserId(jwt));
    }

    @GetMapping("/{ordenId}")
    @Operation(summary = "Obtener detalle de orden", description = "Devuelve el detalle de una orden perteneciente al usuario autenticado.")
    public OrdenResponse obtenerOrden(@Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt, @PathVariable Long ordenId) {
        return ordenService.obtenerOrden(ordenId, currentUserId(jwt));
    }

    private Long currentUserId(Jwt jwt) {
        Object claim = jwt.getClaim("userId");
        if (claim instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalStateException("JWT sin claim userId valido");
    }
}
