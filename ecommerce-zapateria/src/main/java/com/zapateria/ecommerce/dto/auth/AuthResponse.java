package com.zapateria.ecommerce.dto.auth;

import com.zapateria.ecommerce.dto.usuario.UsuarioResponse;

import java.time.Instant;

public record AuthResponse(
        String tokenType,
        String accessToken,
        Instant accessTokenExpiresAt,
        String refreshToken,
        Instant refreshTokenExpiresAt,
        UsuarioResponse usuario
) {
}
