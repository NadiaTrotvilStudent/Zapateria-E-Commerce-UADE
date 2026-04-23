package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.auth.AuthResponse;
import com.zapateria.ecommerce.dto.auth.LoginRequest;
import com.zapateria.ecommerce.dto.auth.RegistroUsuarioRequest;
import com.zapateria.ecommerce.exception.BadRequestException;
import com.zapateria.ecommerce.exception.UnauthorizedException;
import com.zapateria.ecommerce.model.Rol;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import com.zapateria.ecommerce.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioService usuarioService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UsuarioService usuarioService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public AuthResponse registrar(RegistroUsuarioRequest request) {
        String email = request.email().trim().toLowerCase();
        String username = request.username().trim();

        if (usuarioRepository.existsByEmail(email)) {
            throw new BadRequestException("Ya existe un usuario con ese email");
        }

        if (usuarioRepository.existsByUsername(username)) {
            throw new BadRequestException("Ya existe un usuario con ese nombre de usuario");
        }

        Usuario usuario = Usuario.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .nombre(request.nombre().trim())
                .apellido(request.apellido().trim())
                .roles(new HashSet<>(Set.of(Rol.CLIENTE)))
                .build();

        return crearAuthResponse(usuarioRepository.save(usuario));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );
        } catch (BadCredentialsException exception) {
            throw new UnauthorizedException("Credenciales invalidas");
        }

        Usuario usuario = usuarioService.buscarPorEmail(email);
        return crearAuthResponse(usuario);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        Usuario usuario = refreshTokenService.validarYRevocar(refreshToken);
        return crearAuthResponse(usuario);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.revocar(refreshToken);
    }

    private AuthResponse crearAuthResponse(Usuario usuario) {
        JwtService.Token accessToken = jwtService.generarAccessToken(usuario);
        RefreshTokenService.RefreshTokenGenerado refreshToken = refreshTokenService.crearRefreshToken(usuario);

        return new AuthResponse(
                "Bearer",
                accessToken.value(),
                accessToken.expiresAt(),
                refreshToken.value(),
                refreshToken.expiresAt(),
                usuarioService.toResponse(usuario)
        );
    }
}
