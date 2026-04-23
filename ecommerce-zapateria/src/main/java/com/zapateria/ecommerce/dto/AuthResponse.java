package com.zapateria.ecommerce.dto;

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
