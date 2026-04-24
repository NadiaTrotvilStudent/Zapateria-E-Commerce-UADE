package com.zapateria.ecommerce.config;

import com.zapateria.ecommerce.model.Categoria;
import com.zapateria.ecommerce.model.Genero;
import com.zapateria.ecommerce.model.Marca;
import com.zapateria.ecommerce.model.Rol;
import com.zapateria.ecommerce.model.TipoProducto;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.CategoriaRepository;
import com.zapateria.ecommerce.repository.GeneroRepository;
import com.zapateria.ecommerce.repository.MarcaRepository;
import com.zapateria.ecommerce.repository.TipoProductoRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Siembra datos de catalogo y un usuario vendedor para pruebas locales.
 * Solo se activa con el profile 'local'.
 */
@Component
@Profile("local")
public class LocalSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final GeneroRepository generoRepository;
    private final MarcaRepository marcaRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public LocalSeeder(
            CategoriaRepository categoriaRepository,
            GeneroRepository generoRepository,
            MarcaRepository marcaRepository,
            TipoProductoRepository tipoProductoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.categoriaRepository = categoriaRepository;
        this.generoRepository = generoRepository;
        this.marcaRepository = marcaRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            categoriaRepository.save(Categoria.builder().nombre("Zapatillas").build());
            categoriaRepository.save(Categoria.builder().nombre("Botas").build());
            categoriaRepository.save(Categoria.builder().nombre("Sandalias").build());
        }
        if (generoRepository.count() == 0) {
            generoRepository.save(Genero.builder().nombre("Hombre").build());
            generoRepository.save(Genero.builder().nombre("Mujer").build());
            generoRepository.save(Genero.builder().nombre("Unisex").build());
        }
        if (marcaRepository.count() == 0) {
            marcaRepository.save(Marca.builder().nombre("Nike").build());
            marcaRepository.save(Marca.builder().nombre("Adidas").build());
        }
        if (tipoProductoRepository.count() == 0) {
            tipoProductoRepository.save(TipoProducto.builder().nombre("Running").build());
            tipoProductoRepository.save(TipoProducto.builder().nombre("Casual").build());
        }

        String vendedorEmail = "vendedor1@test.com";
        if (usuarioRepository.findByEmail(vendedorEmail).isEmpty()) {
            Usuario vendedor = Usuario.builder()
                    .username("vendedor1")
                    .email(vendedorEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .nombre("Maria")
                    .apellido("Lopez")
                    .roles(new java.util.HashSet<>(Set.of(Rol.VENDEDOR)))
                    .build();
            usuarioRepository.save(vendedor);
        }
    }
}
