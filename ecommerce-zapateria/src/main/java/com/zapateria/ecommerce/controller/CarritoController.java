package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.ActualizarCantidadCarritoRequest;
import com.zapateria.ecommerce.dto.AgregarItemCarritoRequest;
import com.zapateria.ecommerce.dto.CarritoResponse;
import com.zapateria.ecommerce.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }


    @GetMapping
    public CarritoResponse obtenerCarrito(@RequestParam Long usuarioId) {
        return carritoService.obtenerCarritoPorUsuario(usuarioId);
    }


    @PostMapping
    public CarritoResponse agregarProducto(
            @RequestParam Long usuarioId,
            @Valid @RequestBody AgregarItemCarritoRequest request
    ) {
        return carritoService.agregarProducto(usuarioId, request);
    }


    @PatchMapping("/items/{itemId}")
    public CarritoResponse actualizarCantidad(
            @RequestParam Long usuarioId,
            @PathVariable Long itemId,
            @Valid @RequestBody ActualizarCantidadCarritoRequest request
    ) {
        return carritoService.actualizarCantidad(usuarioId, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CarritoResponse eliminarItem(@RequestParam Long usuarioId, @PathVariable Long itemId) {
        return carritoService.eliminarItem(usuarioId, itemId);
    }

    @DeleteMapping
    public CarritoResponse vaciarCarrito(@RequestParam Long usuarioId) {
        return carritoService.vaciarCarrito(usuarioId);
    }

}