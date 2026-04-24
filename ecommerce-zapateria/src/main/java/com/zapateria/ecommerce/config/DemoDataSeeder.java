package com.zapateria.ecommerce.config;

import com.zapateria.ecommerce.model.Categoria;
import com.zapateria.ecommerce.model.Genero;
import com.zapateria.ecommerce.model.ImagenProducto;
import com.zapateria.ecommerce.model.Marca;
import com.zapateria.ecommerce.model.Producto;
import com.zapateria.ecommerce.model.Rol;
import com.zapateria.ecommerce.model.TipoProducto;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.model.VarianteProducto;
import com.zapateria.ecommerce.repository.CategoriaRepository;
import com.zapateria.ecommerce.repository.GeneroRepository;
import com.zapateria.ecommerce.repository.MarcaRepository;
import com.zapateria.ecommerce.repository.ProductoRepository;
import com.zapateria.ecommerce.repository.TipoProductoRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Siembra datos demo para facilitar pruebas manuales en Docker, MySQL local y H2 local.
 * Se desactiva via app.seed.enabled=false.
 */
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final GeneroRepository generoRepository;
    private final MarcaRepository marcaRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            CategoriaRepository categoriaRepository,
            GeneroRepository generoRepository,
            MarcaRepository marcaRepository,
            TipoProductoRepository tipoProductoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.categoriaRepository = categoriaRepository;
        this.generoRepository = generoRepository;
        this.marcaRepository = marcaRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Categoria zapatillas = getOrCreateCategoria("Zapatillas");
        Categoria botas = getOrCreateCategoria("Botas");
        Categoria sandalias = getOrCreateCategoria("Sandalias");

        Genero hombre = getOrCreateGenero("Hombre");
        Genero mujer = getOrCreateGenero("Mujer");
        Genero unisex = getOrCreateGenero("Unisex");

        Marca nike = getOrCreateMarca("Nike");
        Marca adidas = getOrCreateMarca("Adidas");

        TipoProducto running = getOrCreateTipoProducto("Running");
        TipoProducto casual = getOrCreateTipoProducto("Casual");

        Usuario vendedor = getOrCreateVendedor();

        getOrCreateProducto(
                "Urban Runner Pro",
                "Zapatilla urbana con capellada respirable y amortiguacion para uso diario.",
                new BigDecimal("129999.00"),
                zapatillas,
                nike,
                running,
                hombre,
                vendedor,
                List.of(
                        "https://placehold.co/1200x800?text=Urban+Runner+Pro+1",
                        "https://placehold.co/1200x800?text=Urban+Runner+Pro+2"
                ),
                List.of(
                        new VarianteSeed("40", "Negro", 5),
                        new VarianteSeed("41", "Negro", 4),
                        new VarianteSeed("42", "Gris", 3)
                )
        );

        getOrCreateProducto(
                "Sierra Mid Boot",
                "Bota de media cana con suela de agarre y estructura reforzada para uso casual.",
                new BigDecimal("159999.00"),
                botas,
                adidas,
                casual,
                unisex,
                vendedor,
                List.of(
                        "https://placehold.co/1200x800?text=Sierra+Mid+Boot+1",
                        "https://placehold.co/1200x800?text=Sierra+Mid+Boot+2"
                ),
                List.of(
                        new VarianteSeed("39", "Marron", 2),
                        new VarianteSeed("40", "Marron", 4),
                        new VarianteSeed("41", "Negro", 3)
                )
        );

        getOrCreateProducto(
                "Costa Flex Sandal",
                "Sandalia liviana con ajuste comodo y base flexible para verano.",
                new BigDecimal("89999.00"),
                sandalias,
                adidas,
                casual,
                mujer,
                vendedor,
                List.of(
                        "https://placehold.co/1200x800?text=Costa+Flex+Sandal+1",
                        "https://placehold.co/1200x800?text=Costa+Flex+Sandal+2"
                ),
                List.of(
                        new VarianteSeed("36", "Beige", 6),
                        new VarianteSeed("37", "Beige", 5),
                        new VarianteSeed("38", "Blanco", 4)
                )
        );
    }

    private Categoria getOrCreateCategoria(String nombre) {
        return categoriaRepository.findByNombre(nombre)
                .orElseGet(() -> categoriaRepository.save(Categoria.builder().nombre(nombre).build()));
    }

    private Genero getOrCreateGenero(String nombre) {
        return generoRepository.findByNombre(nombre)
                .orElseGet(() -> generoRepository.save(Genero.builder().nombre(nombre).build()));
    }

    private Marca getOrCreateMarca(String nombre) {
        return marcaRepository.findByNombre(nombre)
                .orElseGet(() -> marcaRepository.save(Marca.builder().nombre(nombre).build()));
    }

    private TipoProducto getOrCreateTipoProducto(String nombre) {
        return tipoProductoRepository.findByNombre(nombre)
                .orElseGet(() -> tipoProductoRepository.save(TipoProducto.builder().nombre(nombre).build()));
    }

    private Usuario getOrCreateVendedor() {
        String vendedorEmail = "vendedor1@test.com";
        Optional<Usuario> existente = usuarioRepository.findByEmail(vendedorEmail);
        if (existente.isPresent()) {
            return existente.get();
        }

        Usuario vendedor = Usuario.builder()
                .username("vendedor1")
                .email(vendedorEmail)
                .password(passwordEncoder.encode("Password123!"))
                .nombre("Maria")
                .apellido("Lopez")
                .roles(Set.of(Rol.VENDEDOR))
                .build();
        return usuarioRepository.save(vendedor);
    }

    private Producto getOrCreateProducto(
            String nombre,
            String descripcion,
            BigDecimal precio,
            Categoria categoria,
            Marca marca,
            TipoProducto tipoProducto,
            Genero genero,
            Usuario vendedor,
            List<String> imagenes,
            List<VarianteSeed> variantes
    ) {
        return productoRepository.findByNombreAndUsuarioCreadorEmail(nombre, vendedor.getEmail())
                .orElseGet(() -> crearProducto(nombre, descripcion, precio, categoria, marca, tipoProducto, genero, vendedor, imagenes, variantes));
    }

    private Producto crearProducto(
            String nombre,
            String descripcion,
            BigDecimal precio,
            Categoria categoria,
            Marca marca,
            TipoProducto tipoProducto,
            Genero genero,
            Usuario vendedor,
            List<String> imagenes,
            List<VarianteSeed> variantes
    ) {
        Producto producto = Producto.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(precio)
                .stock(variantes.stream().mapToInt(VarianteSeed::stock).sum())
                .categoria(categoria)
                .marca(marca)
                .tipoProducto(tipoProducto)
                .genero(genero)
                .usuarioCreador(vendedor)
                .build();

        for (int i = 0; i < imagenes.size(); i++) {
            producto.getImagenes().add(ImagenProducto.builder()
                    .producto(producto)
                    .url(imagenes.get(i))
                    .orden(i + 1)
                    .build());
        }

        for (VarianteSeed variante : variantes) {
            producto.getVariantes().add(VarianteProducto.builder()
                    .producto(producto)
                    .talle(variante.talle())
                    .color(variante.color())
                    .stock(variante.stock())
                    .build());
        }

        return productoRepository.save(producto);
    }

    private record VarianteSeed(String talle, String color, int stock) {
    }
}
