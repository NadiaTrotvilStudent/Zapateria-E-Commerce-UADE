package com.zapateria.ecommerce;

import com.zapateria.ecommerce.model.Producto;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.CategoriaRepository;
import com.zapateria.ecommerce.repository.ProductoRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = "app.seed.enabled=true")
@Transactional
class DemoDataSeederIntegrationTests {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void seederCargaCatalogoVendedorYProductosDemo() {
        assertEquals(3, categoriaRepository.findAllByOrderByNombreAsc().size());

        Usuario vendedor = usuarioRepository.findByEmail("vendedor1@test.com").orElseThrow();
        assertEquals("vendedor1", vendedor.getUsername());

        List<Producto> productos = productoRepository.findAllByOrderByNombreAsc();
        assertEquals(3, productos.size());

        assertProductoDemo(productos, "Urban Runner Pro", 12, 2, 3);
        assertProductoDemo(productos, "Sierra Mid Boot", 9, 2, 3);
        assertProductoDemo(productos, "Costa Flex Sandal", 15, 2, 3);
    }

    private void assertProductoDemo(List<Producto> productos, String nombre, int stockEsperado, int imagenesEsperadas, int variantesEsperadas) {
        Producto producto = productos.stream()
                .filter(item -> item.getNombre().equals(nombre))
                .findFirst()
                .orElseThrow();

        assertEquals(stockEsperado, producto.getStock());
        assertEquals(imagenesEsperadas, producto.getImagenes().size());
        assertEquals(variantesEsperadas, producto.getVariantes().size());
        assertNotNull(producto.getUsuarioCreador());
        assertTrue(producto.getImagenes().stream().allMatch(imagen -> imagen.getUrl().startsWith("https://placehold.co/")));
        assertEquals(
                stockEsperado,
                producto.getVariantes().stream().mapToInt(variante -> variante.getStock()).sum()
        );
    }
}
