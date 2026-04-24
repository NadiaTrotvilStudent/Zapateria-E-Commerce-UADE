package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.*;
import com.zapateria.ecommerce.exception.BadRequestException;
import com.zapateria.ecommerce.exception.ResourceNotFoundException;
import com.zapateria.ecommerce.model.*;
import com.zapateria.ecommerce.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VarianteProductoRepository varianteProductoRepository;
    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;

    public CarritoService(
            CarritoRepository carritoRepository,
            ItemCarritoRepository itemCarritoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            OrdenRepository ordenRepository,
            VarianteProductoRepository varianteProductoRepository
    ) {
        this.carritoRepository = carritoRepository;
        this.itemCarritoRepository = itemCarritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.ordenRepository = ordenRepository;
        this.varianteProductoRepository = varianteProductoRepository;
    }

    public CarritoResponse obtenerCarritoPorUsuario(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        return toResponse(carrito);
    }

    public CarritoResponse agregarProducto(Long usuarioId, AgregarItemCarritoRequest request) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        VarianteProducto varianteProducto = buscarVariante(request.varianteProductoId());

        ItemCarrito item = itemCarritoRepository
                .findByCarritoIdAndVarianteProductoId(carrito.getId(), varianteProducto.getId())
                .orElse(null);

        if (item == null) {
            validarStock(varianteProducto, request.cantidad());

            item = ItemCarrito.builder()
                    .carrito(carrito)
                    .varianteProducto(varianteProducto)
                    .cantidad(request.cantidad())
                    .precioUnitario(varianteProducto.getProducto().getPrecio())
                    .build();
            carrito.getItems().add(item);
        } else {
            int nuevaCantidad = item.getCantidad() + request.cantidad();
            validarStock(varianteProducto, nuevaCantidad);
            item.setCantidad(nuevaCantidad);
            item.setPrecioUnitario(varianteProducto.getProducto().getPrecio());
        }

        carrito = carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    public CarritoResponse actualizarCantidad(Long usuarioId, Long itemId, ActualizarCantidadCarritoRequest request) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        ItemCarrito item = buscarItemEnCarrito(carrito, itemId);

        validarStock(item.getVarianteProducto(), request.cantidad());
        item.setCantidad(request.cantidad());
        item.setPrecioUnitario(item.getVarianteProducto().getProducto().getPrecio());

        carrito = carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    public CarritoResponse eliminarItem(Long usuarioId, Long itemId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        ItemCarrito item = buscarItemEnCarrito(carrito, itemId);
        carrito.getItems().remove(item);
        carrito = carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    public CarritoResponse vaciarCarrito(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        carrito.getItems().clear();
        carrito = carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    private Carrito obtenerOCrearCarrito(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearCarrito(buscarUsuario(usuarioId)));
    }

    private Carrito crearCarrito(Usuario usuario) {
        Carrito carrito = Carrito.builder()
                .usuario(usuario)
                .build();
        return carritoRepository.save(carrito);
    }

    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + usuarioId));
    }

    private VarianteProducto buscarVariante(Long varianteProductoId) {
        return varianteProductoRepository.findById(varianteProductoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Variante de producto no encontrada con id " + varianteProductoId
                ));
    }

    private ItemCarrito buscarItemEnCarrito(Carrito carrito, Long itemId) {
        return carrito.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item de carrito no encontrado con id " + itemId));
    }

    private void validarStock(VarianteProducto varianteProducto, int cantidadSolicitada) {
        if (varianteProducto.getStock() < cantidadSolicitada) {
            throw new BadRequestException(
                    "Stock insuficiente para la variante seleccionada del producto "
                            + varianteProducto.getProducto().getNombre()
            );
        }
    }

    public CheckoutResponse checkout(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        Usuario usuario = carrito.getUsuario();

        if (carrito.getItems().isEmpty()) {
            throw new BadRequestException("El carrito esta vacio");
        }

        for (ItemCarrito item : carrito.getItems()) {
            validarStock(item.getVarianteProducto(), item.getCantidad());
        }

        int cantidadItemsProcesados = 0;
        BigDecimal total = BigDecimal.ZERO;

        Orden orden = Orden.builder()
                .usuario(usuario)
                .build();

        for (ItemCarrito item : carrito.getItems()) {
            VarianteProducto varianteProducto = item.getVarianteProducto();
            Producto producto = varianteProducto.getProducto();
            BigDecimal subtotal = item.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            varianteProducto.setStock(varianteProducto.getStock() - item.getCantidad());
            cantidadItemsProcesados += item.getCantidad();
            total = total.add(subtotal);

            DetalleOrden detalle = DetalleOrden.builder()
                    .orden(orden)
                    .varianteProducto(varianteProducto)
                    .productoNombre(producto.getNombre())
                    .talle(varianteProducto.getTalle())
                    .color(varianteProducto.getColor())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();

            orden.getDetalles().add(detalle);
        }

        orden.setTotal(total);
        orden = ordenRepository.save(orden);

        varianteProductoRepository.saveAll(
                carrito.getItems().stream()
                        .map(ItemCarrito::getVarianteProducto)
                        .toList()
        );

        carrito.getItems().stream()
                .map(item -> item.getVarianteProducto().getProducto())
                .distinct()
                .forEach(this::recalcularStockProducto);

        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return new CheckoutResponse(
                "Checkout realizado correctamente",
                orden.getId(),
                carrito.getId(),
                cantidadItemsProcesados,
                total
        );
    }

    private void recalcularStockProducto(Producto producto) {
        int stockTotal = varianteProductoRepository
                .findByProductoIdOrderByColorAscTalleAsc(producto.getId())
                .stream()
                .mapToInt(VarianteProducto::getStock)
                .sum();

        producto.setStock(stockTotal);
        productoRepository.save(producto);
    }

    private CarritoResponse toResponse(Carrito carrito) {
        List<ItemCarritoResponse> items = carrito.getItems().stream()
                .map(item -> new ItemCarritoResponse(
                        item.getId(),
                        item.getVarianteProducto().getId(),
                        item.getVarianteProducto().getProducto().getId(),
                        item.getVarianteProducto().getProducto().getNombre(),
                        item.getVarianteProducto().getTalle(),
                        item.getVarianteProducto().getColor(),
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad()))
                ))
                .toList();

        int cantidadItems = items.stream().mapToInt(ItemCarritoResponse::cantidad).sum();
        BigDecimal total = items.stream()
                .map(ItemCarritoResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CarritoResponse(
                carrito.getId(),
                carrito.getUsuario().getId(),
                carrito.getUsuario().getUsername(),
                items,
                cantidadItems,
                total,
                carrito.getFechaCreacion(),
                carrito.getFechaActualizacion()
        );
    }
}