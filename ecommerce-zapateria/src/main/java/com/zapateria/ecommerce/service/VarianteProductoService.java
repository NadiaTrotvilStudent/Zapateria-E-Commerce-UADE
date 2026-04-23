package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.producto.VarianteProductoRequest;
import com.zapateria.ecommerce.dto.producto.VarianteProductoResponse;
import com.zapateria.ecommerce.exception.BadRequestException;
import com.zapateria.ecommerce.exception.ResourceNotFoundException;
import com.zapateria.ecommerce.model.Producto;
import com.zapateria.ecommerce.model.VarianteProducto;
import com.zapateria.ecommerce.repository.ProductoRepository;
import com.zapateria.ecommerce.repository.VarianteProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio para consultar y crear variantes de producto.
 */
@Service
public class VarianteProductoService {

    private final VarianteProductoRepository varianteProductoRepository;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

    public VarianteProductoService(
            VarianteProductoRepository varianteProductoRepository,
            ProductoRepository productoRepository,
            ProductoService productoService
    ) {
        this.varianteProductoRepository = varianteProductoRepository;
        this.productoRepository = productoRepository;
        this.productoService = productoService;
    }

    /**
     * Lista las variantes de un producto.
     */
    public List<VarianteProductoResponse> listarPorProducto(Long productoId) {
        validarProductoExiste(productoId);
        return varianteProductoRepository.findByProductoIdOrderByColorAscTalleAsc(productoId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Crea una variante nueva y luego recalcula el stock total del producto.
     */
    public VarianteProductoResponse crearVariante(Long productoId, VarianteProductoRequest request) {
        Producto producto = productoService.buscarProducto(productoId);

        if (request.stock() < 0) {
            throw new BadRequestException("El stock de la variante no puede ser negativo");
        }

        String talle = request.talle().trim();
        String color = request.color().trim();
        validarCombinacionUnica(productoId, talle, color);

        VarianteProducto variante = VarianteProducto.builder()
                .talle(talle)
                .color(color)
                .stock(request.stock())
                .producto(producto)
                .build();

        VarianteProducto guardada = varianteProductoRepository.save(variante);
        sincronizarStockProducto(productoId);
        return toResponse(guardada);
    }

    private void validarCombinacionUnica(Long productoId, String talle, String color) {
        boolean repetida = varianteProductoRepository.findByProductoIdOrderByColorAscTalleAsc(productoId).stream()
                .anyMatch(variante ->
                        variante.getTalle().equalsIgnoreCase(talle)
                                && variante.getColor().equalsIgnoreCase(color)
                );

        if (repetida) {
            throw new BadRequestException("Ya existe una variante para esa combinacion de talle y color");
        }
    }

    /**
     * Recalcula y persiste el stock total del producto como suma de sus variantes.
     */
    private void sincronizarStockProducto(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + productoId));
        producto.setVariantes(varianteProductoRepository.findByProductoIdOrderByColorAscTalleAsc(productoId));
        productoService.recalcularStock(producto);
        productoRepository.save(producto);
    }

    private void validarProductoExiste(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ResourceNotFoundException("Producto no encontrado con id " + productoId);
        }
    }

    private VarianteProductoResponse toResponse(VarianteProducto variante) {
        return new VarianteProductoResponse(
                variante.getId(),
                variante.getTalle(),
                variante.getColor(),
                variante.getStock()
        );
    }
}
