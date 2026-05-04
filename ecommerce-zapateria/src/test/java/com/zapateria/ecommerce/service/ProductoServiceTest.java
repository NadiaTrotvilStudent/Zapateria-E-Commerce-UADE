package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.producto.ProductoRequest;
import com.zapateria.ecommerce.dto.producto.ProductoResponse;
import com.zapateria.ecommerce.exception.BadRequestException;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MarcaRepository marcaRepository;

    @Mock
    private TipoProductoRepository tipoProductoRepository;

    @Mock
    private GeneroRepository generoRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void guardarProductoNormalizaDatosYPreservaOrdenDeImagenes() {
        Marca marca = Marca.builder().id(1L).nombre("Nike").build();
        TipoProducto tipoProducto = TipoProducto.builder().id(2L).nombre("Zapatilla").build();
        Genero genero = Genero.builder().id(3L).nombre("Unisex").build();
        Categoria categoria = Categoria.builder().id(4L).nombre("Urbanas").build();
        Usuario usuario = Usuario.builder().id(5L).username("vendedor").build();

        when(marcaRepository.findById(1L)).thenReturn(Optional.of(marca));
        when(tipoProductoRepository.findById(2L)).thenReturn(Optional.of(tipoProducto));
        when(generoRepository.findById(3L)).thenReturn(Optional.of(genero));
        when(categoriaRepository.findById(4L)).thenReturn(Optional.of(categoria));
        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(usuario));
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto producto = invocation.getArgument(0);
            producto.setId(99L);
            return producto;
        });

        ProductoRequest request = new ProductoRequest(
                "  Air Max 90  ",
                "  Zapatilla clasica  ",
                new BigDecimal("150.00"),
                List.of(" https://img.com/1.jpg ", "https://img.com/2.jpg"),
                1L,
                2L,
                3L,
                4L,
                5L
        );

        ProductoResponse response = productoService.guardarProducto(request);

        assertEquals(99L, response.id());
        assertEquals("Air Max 90", response.nombre());
        assertEquals("Zapatilla clasica", response.descripcion());
        assertEquals(0, response.stock());
        assertEquals(List.of("https://img.com/1.jpg", "https://img.com/2.jpg"), response.imagenes());
        assertEquals("Nike", response.marcaNombre());
    }

    @Test
    void guardarProductoSinImagenesLanzaBadRequest() {
        when(categoriaRepository.findById(4L)).thenReturn(Optional.of(Categoria.builder().id(4L).build()));
        when(marcaRepository.findById(1L)).thenReturn(Optional.of(Marca.builder().id(1L).build()));
        when(tipoProductoRepository.findById(2L)).thenReturn(Optional.of(TipoProducto.builder().id(2L).build()));
        when(generoRepository.findById(3L)).thenReturn(Optional.of(Genero.builder().id(3L).build()));
        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(Usuario.builder().id(5L).build()));

        ProductoRequest request = new ProductoRequest(
                "Air Max 90",
                "Zapatilla clasica",
                new BigDecimal("150.00"),
                List.of(),
                1L,
                2L,
                3L,
                4L,
                5L
        );

        assertThrows(BadRequestException.class, () -> productoService.guardarProducto(request));
    }

    @Test
    void recalcularStockSumaLasVariantesDelProducto() {
        Producto producto = Producto.builder().stock(0).build();
        producto.getVariantes().add(VarianteProducto.builder().stock(2).build());
        producto.getVariantes().add(VarianteProducto.builder().stock(5).build());

        productoService.recalcularStock(producto);

        assertEquals(7, producto.getStock());
    }
}
