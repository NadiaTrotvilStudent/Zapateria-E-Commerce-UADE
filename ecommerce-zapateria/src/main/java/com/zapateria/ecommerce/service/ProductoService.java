package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.producto.ProductoRequest;
import com.zapateria.ecommerce.dto.producto.ProductoResponse;
import com.zapateria.ecommerce.dto.producto.VarianteProductoResponse;
import com.zapateria.ecommerce.exception.BadRequestException;
import com.zapateria.ecommerce.exception.ResourceNotFoundException;
import com.zapateria.ecommerce.model.Categoria;
import com.zapateria.ecommerce.model.Genero;
import com.zapateria.ecommerce.model.Marca;
import com.zapateria.ecommerce.model.Producto;
import com.zapateria.ecommerce.model.TipoProducto;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.model.VarianteProducto;
import com.zapateria.ecommerce.repository.CategoriaRepository;
import com.zapateria.ecommerce.repository.GeneroRepository;
import com.zapateria.ecommerce.repository.MarcaRepository;
import com.zapateria.ecommerce.repository.ProductoRepository;
import com.zapateria.ecommerce.repository.TipoProductoRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Logica principal para crear, actualizar, buscar y eliminar productos.
 */
@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MarcaRepository marcaRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final GeneroRepository generoRepository;

    public ProductoService(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository,
            MarcaRepository marcaRepository,
            TipoProductoRepository tipoProductoRepository,
            GeneroRepository generoRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.marcaRepository = marcaRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.generoRepository = generoRepository;
    }

    /**
     * Lista todos los productos o los filtra por categoria.
     */
    public List<ProductoResponse> listarProductos(Long categoriaId) {
        List<Producto> productos = categoriaId == null
                ? productoRepository.findAllByOrderByNombreAsc()
                : productoRepository.findByCategoriaIdOrderByNombreAsc(categoriaId);

        return productos.stream().map(this::toResponse).toList();
    }

    /**
     * Busca un producto puntual y lo devuelve como DTO.
     */
    public ProductoResponse obtenerProducto(Long id) {
        return toResponse(buscarProducto(id));
    }

    /**
     * Crea un producto nuevo a partir de un request.
     * El stock inicial queda en cero y se completa desde las variantes.
     */
    public ProductoResponse guardarProducto(ProductoRequest request) {
        Producto producto = new Producto();
        aplicarCambios(producto, request);
        producto.setStock(0);
        return toResponse(productoRepository.save(producto));
    }

    /**
     * Actualiza los datos generales de un producto existente.
     * El stock resumido se conserva porque depende de sus variantes.
     */
    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = buscarProducto(id);
        aplicarCambios(producto, request);
        recalcularStock(producto);
        return toResponse(productoRepository.save(producto));
    }

    /**
     * Elimina un producto por su identificador.
     */
    public void eliminarProducto(Long id) {
        Producto producto = buscarProducto(id);
        productoRepository.delete(producto);
    }

    /**
     * Recalcula el stock resumido como suma de las variantes existentes.
     */
    public void recalcularStock(Producto producto) {
        int stockTotal = producto.getVariantes().stream()
                .mapToInt(VarianteProducto::getStock)
                .sum();
        producto.setStock(stockTotal);
    }

    /**
     * Busca la entidad Producto o lanza error si no existe.
     */
    public Producto buscarProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));
    }

    private void aplicarCambios(Producto producto, ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria no encontrada con id " + request.categoriaId()
                ));

        Marca marca = marcaRepository.findById(request.marcaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Marca no encontrada con id " + request.marcaId()
                ));

        TipoProducto tipoProducto = tipoProductoRepository.findById(request.tipoProductoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tipo de producto no encontrado con id " + request.tipoProductoId()
                ));

        Genero genero = generoRepository.findById(request.generoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Genero no encontrado con id " + request.generoId()
                ));

        Usuario usuario = usuarioRepository.findById(request.usuarioCreadorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con id " + request.usuarioCreadorId()
                ));

        if (request.imagenUrl() != null && request.imagenUrl().isBlank()) {
            throw new BadRequestException("La imagen no puede ser una cadena vacia");
        }

        producto.setNombre(request.nombre().trim());
        producto.setDescripcion(request.descripcion().trim());
        producto.setPrecio(request.precio());
        producto.setImagenUrl(request.imagenUrl() == null ? null : request.imagenUrl().trim());
        producto.setMarca(marca);
        producto.setTipoProducto(tipoProducto);
        producto.setGenero(genero);
        producto.setCategoria(categoria);
        producto.setUsuarioCreador(usuario);
    }

    private ProductoResponse toResponse(Producto producto) {
        List<VarianteProductoResponse> variantes = producto.getVariantes().stream()
                .map(this::toVarianteResponse)
                .toList();

        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getImagenUrl(),
                producto.getMarca().getId(),
                producto.getMarca().getNombre(),
                producto.getTipoProducto().getId(),
                producto.getTipoProducto().getNombre(),
                producto.getGenero().getId(),
                producto.getGenero().getNombre(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre(),
                producto.getUsuarioCreador().getId(),
                producto.getUsuarioCreador().getUsername(),
                variantes
        );
    }

    private VarianteProductoResponse toVarianteResponse(VarianteProducto variante) {
        return new VarianteProductoResponse(
                variante.getId(),
                variante.getTalle(),
                variante.getColor(),
                variante.getStock()
        );
    }
}
