package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.carrito.ActualizarCantidadCarritoRequest;
import com.zapateria.ecommerce.dto.carrito.AgregarItemCarritoRequest;
import com.zapateria.ecommerce.dto.carrito.CarritoResponse;
import com.zapateria.ecommerce.service.CarritoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/carrito")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Carrito", description = "Operaciones del carrito del usuario autenticado")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }


    @GetMapping
    @Operation(summary = "Obtener carrito", description = "Devuelve el carrito actual del usuario autenticado.")
    public CarritoResponse obtenerCarrito(@Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        return carritoService.obtenerCarritoPorUsuario(currentUserId(jwt));
    }


    @PostMapping
    @Operation(summary = "Agregar item al carrito", description = "Agrega una variante de producto al carrito y valida stock disponible.")
    public CarritoResponse agregarProducto(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AgregarItemCarritoRequest request
    ) {
        return carritoService.agregarProducto(currentUserId(jwt), request);
    }


    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Actualizar cantidad de item", description = "Actualiza la cantidad de un item existente del carrito.")
    public CarritoResponse actualizarCantidad(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long itemId,
            @Valid @RequestBody ActualizarCantidadCarritoRequest request
    ) {
        return carritoService.actualizarCantidad(currentUserId(jwt), itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Eliminar item del carrito", description = "Elimina un item puntual del carrito del usuario autenticado.")
    public CarritoResponse eliminarItem(@Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt, @PathVariable Long itemId) {
        return carritoService.eliminarItem(currentUserId(jwt), itemId);
    }

    @DeleteMapping
    @Operation(summary = "Vaciar carrito", description = "Elimina todos los items del carrito del usuario autenticado.")
    public CarritoResponse vaciarCarrito(@Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
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
