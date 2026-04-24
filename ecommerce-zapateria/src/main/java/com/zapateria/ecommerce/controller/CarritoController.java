package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.ActualizarCantidadCarritoRequest;
import com.zapateria.ecommerce.dto.AgregarItemCarritoRequest;
import com.zapateria.ecommerce.dto.CarritoResponse;
import com.zapateria.ecommerce.service.CarritoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/carrito")
@SecurityRequirement(name = "bearerAuth")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }


    @GetMapping
    public CarritoResponse obtenerCarrito(@AuthenticationPrincipal Jwt jwt) {
        return carritoService.obtenerCarritoPorUsuario(currentUserId(jwt));
    }


    @PostMapping
    public CarritoResponse agregarProducto(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AgregarItemCarritoRequest request
    ) {
        return carritoService.agregarProducto(currentUserId(jwt), request);
    }


    @PatchMapping("/items/{itemId}")
    public CarritoResponse actualizarCantidad(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long itemId,
            @Valid @RequestBody ActualizarCantidadCarritoRequest request
    ) {
        return carritoService.actualizarCantidad(currentUserId(jwt), itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CarritoResponse eliminarItem(@AuthenticationPrincipal Jwt jwt, @PathVariable Long itemId) {
        return carritoService.eliminarItem(currentUserId(jwt), itemId);
    }

    @DeleteMapping
    public CarritoResponse vaciarCarrito(@AuthenticationPrincipal Jwt jwt) {
        return carritoService.vaciarCarrito(currentUserId(jwt));
    }

    private Long currentUserId(Jwt jwt) {
        Object claim = jwt.getClaim("userId");
        if (claim instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalStateException("JWT sin claim userId valido");
    }
}
