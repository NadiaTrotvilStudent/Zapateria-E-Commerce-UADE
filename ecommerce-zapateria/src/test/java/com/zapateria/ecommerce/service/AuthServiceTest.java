package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.auth.AuthResponse;
import com.zapateria.ecommerce.dto.auth.LoginRequest;
import com.zapateria.ecommerce.dto.usuario.UsuarioResponse;
import com.zapateria.ecommerce.exception.UnauthorizedException;
import com.zapateria.ecommerce.model.Rol;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import com.zapateria.ecommerce.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginAutenticaYDevuelveTokens() {
        Usuario usuario = Usuario.builder()
                .id(1L)
                .username("cliente")
                .email("cliente@mail.com")
                .nombre("Juan")
                .apellido("Perez")
                .roles(Set.of(Rol.CLIENTE))
                .build();
        Instant accessExpiresAt = Instant.parse("2026-05-04T12:00:00Z");
        Instant refreshExpiresAt = Instant.parse("2026-05-11T12:00:00Z");

        when(usuarioService.buscarPorEmail("cliente@mail.com")).thenReturn(usuario);
        when(jwtService.generarAccessToken(usuario)).thenReturn(new JwtService.Token("access-token", accessExpiresAt));
        when(refreshTokenService.crearRefreshToken(usuario))
                .thenReturn(new RefreshTokenService.RefreshTokenGenerado("refresh-token", refreshExpiresAt));
        when(usuarioService.toResponse(usuario))
                .thenReturn(new UsuarioResponse(1L, "cliente", "cliente@mail.com", "Juan", "Perez", Set.of("CLIENTE")));

        AuthResponse response = authService.login(new LoginRequest(" CLIENTE@mail.com ", "password123"));

        assertEquals("Bearer", response.tokenType());
        assertEquals("access-token", response.accessToken());
        assertEquals(refreshExpiresAt, response.refreshTokenExpiresAt());
        assertEquals("cliente@mail.com", response.usuario().email());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginConCredencialesInvalidasLanzaUnauthorized() {
        doThrow(new BadCredentialsException("bad credentials"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(
                UnauthorizedException.class,
                () -> authService.login(new LoginRequest("cliente@mail.com", "incorrecta"))
        );

        verify(jwtService, never()).generarAccessToken(any());
        verify(refreshTokenService, never()).crearRefreshToken(any());
    }
}
