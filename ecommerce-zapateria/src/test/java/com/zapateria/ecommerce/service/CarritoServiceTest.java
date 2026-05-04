package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.AgregarItemCarritoRequest;
import com.zapateria.ecommerce.dto.CarritoResponse;
import com.zapateria.ecommerce.exception.BadRequestException;
import com.zapateria.ecommerce.model.Carrito;
import com.zapateria.ecommerce.model.Producto;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.model.VarianteProducto;
import com.zapateria.ecommerce.repository.CarritoRepository;
import com.zapateria.ecommerce.repository.ItemCarritoRepository;
import com.zapateria.ecommerce.repository.OrdenRepository;
import com.zapateria.ecommerce.repository.ProductoRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import com.zapateria.ecommerce.repository.VarianteProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarritoServiceTest {

    @Mock
    private CarritoRepository carritoRepository;

    @Mock
    private ItemCarritoRepository itemCarritoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private VarianteProductoRepository varianteProductoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private OrdenRepository ordenRepository;

    @InjectMocks
    private CarritoService carritoService;

    @Test
    void agregarProductoNuevoAlCarritoCalculaTotales() {
        Usuario usuario = Usuario.builder().id(1L).username("cliente").build();
        Carrito carrito = Carrito.builder()
                .id(10L)
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .fechaActualizacion(LocalDateTime.now())
                .build();
        Producto producto = Producto.builder()
                .id(20L)
                .nombre("Zapatilla Urbana")
                .precio(new BigDecimal("150.00"))
                .build();
        VarianteProducto variante = VarianteProducto.builder()
                .id(30L)
                .producto(producto)
                .talle("40")
                .color("Negro")
                .stock(5)
                .build();

        when(carritoRepository.findByUsuarioId(1L)).thenReturn(Optional.of(carrito));
        when(varianteProductoRepository.findById(30L)).thenReturn(Optional.of(variante));
        when(itemCarritoRepository.findByCarritoIdAndVarianteProductoId(10L, 30L)).thenReturn(Optional.empty());
        when(carritoRepository.save(carrito)).thenReturn(carrito);

        CarritoResponse response = carritoService.agregarProducto(1L, new AgregarItemCarritoRequest(30L, 2));

        assertEquals(1, response.items().size());
        assertEquals(2, response.cantidadItems());
        assertEquals(new BigDecimal("300.00"), response.total());
        assertEquals("Zapatilla Urbana", response.items().get(0).productoNombre());
    }

    @Test
    void agregarProductoConStockInsuficienteLanzaBadRequest() {
        Usuario usuario = Usuario.builder().id(1L).username("cliente").build();
        Carrito carrito = Carrito.builder().id(10L).usuario(usuario).build();
        Producto producto = Producto.builder().id(20L).nombre("Zapatilla Urbana").precio(new BigDecimal("150.00")).build();
        VarianteProducto variante = VarianteProducto.builder().id(30L).producto(producto).stock(1).build();

        when(carritoRepository.findByUsuarioId(1L)).thenReturn(Optional.of(carrito));
        when(varianteProductoRepository.findById(30L)).thenReturn(Optional.of(variante));
        when(itemCarritoRepository.findByCarritoIdAndVarianteProductoId(10L, 30L)).thenReturn(Optional.empty());

        assertThrows(
                BadRequestException.class,
                () -> carritoService.agregarProducto(1L, new AgregarItemCarritoRequest(30L, 2))
        );

        verify(carritoRepository, never()).save(any());
    }
}
