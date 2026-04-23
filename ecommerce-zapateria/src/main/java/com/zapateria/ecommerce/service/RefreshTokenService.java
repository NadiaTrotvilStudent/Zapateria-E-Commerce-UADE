package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.exception.UnauthorizedException;
import com.zapateria.ecommerce.model.RefreshToken;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final Duration refreshTokenTtl;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${app.security.jwt.refresh-token-ttl-days:7}") long refreshTokenTtlDays
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenTtl = Duration.ofDays(refreshTokenTtlDays);
    }

    public RefreshTokenGenerado crearRefreshToken(Usuario usuario) {
        String token = UUID.randomUUID() + "." + UUID.randomUUID();
        Instant ahora = Instant.now();
        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash(hash(token))
                .usuario(usuario)
                .creadoEn(ahora)
                .fechaExpiracion(ahora.plus(refreshTokenTtl))
                .revocado(false)
                .build();

        RefreshToken guardado = refreshTokenRepository.save(refreshToken);
        return new RefreshTokenGenerado(token, guardado.getFechaExpiracion());
    }

    @Transactional
    public Usuario validarYRevocar(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hash(token))
                .orElseThrow(() -> new UnauthorizedException("Refresh token invalido"));

        if (refreshToken.isRevocado() || refreshToken.getFechaExpiracion().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token expirado o revocado");
        }

        refreshToken.setRevocado(true);
        return refreshToken.getUsuario();
    }

    @Transactional
    public void revocar(String token) {
        refreshTokenRepository.findByTokenHash(hash(token))
                .ifPresent(refreshToken -> refreshToken.setRevocado(true));
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encoded);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("No se pudo calcular el hash del refresh token", exception);
        }
    }

    public record RefreshTokenGenerado(String value, Instant expiresAt) {
    }
}
