package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.producto.ProductoRequest;
import com.zapateria.ecommerce.dto.producto.ProductoResponse;
import com.zapateria.ecommerce.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller REST para la gestion de productos.
 */
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Catalogo y publicaciones de productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    @Operation(summary = "Listar productos", description = "Devuelve productos ordenados alfabeticamente; permite filtrar por categoria.")
    public List<ProductoResponse> listarProductos(@RequestParam(required = false) Long categoriaId) {
        return productoService.listarProductos(categoriaId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de producto")
    public ProductoResponse obtenerProducto(@PathVariable Long id) {
        return productoService.obtenerProducto(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear producto", description = "Requiere rol VENDEDOR o ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    public ProductoResponse crearProducto(@Valid @RequestBody ProductoRequest producto) {
        return productoService.guardarProducto(producto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto", description = "Requiere rol VENDEDOR o ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    public ProductoResponse actualizarProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest producto) {
        return productoService.actualizarProducto(id, producto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar producto", description = "Requiere rol VENDEDOR o ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }
}
