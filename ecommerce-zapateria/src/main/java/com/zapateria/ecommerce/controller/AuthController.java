package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.auth.AuthResponse;
import com.zapateria.ecommerce.dto.auth.LoginRequest;
import com.zapateria.ecommerce.dto.auth.LogoutRequest;
import com.zapateria.ecommerce.dto.auth.RefreshTokenRequest;
import com.zapateria.ecommerce.dto.auth.RegistroUsuarioRequest;
import com.zapateria.ecommerce.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Registro, login y gestion de tokens")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar usuario", description = "Crea un usuario CLIENTE y devuelve access token y refresh token.")
    public AuthResponse registrar(@Valid @RequestBody RegistroUsuarioRequest request) {
        return authService.registrar(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion", description = "Autentica con email y contrasena, y devuelve access token y refresh token.")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refrescar token", description = "Rota el refresh token y devuelve un nuevo par de tokens.")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cerrar sesion", description = "Revoca el refresh token actual.")
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.refreshToken());
    }
}
