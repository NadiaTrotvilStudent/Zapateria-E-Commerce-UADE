package com.zapateria.ecommerce.security;

import com.zapateria.ecommerce.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final Duration accessTokenTtl;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${app.security.jwt.access-token-ttl-minutes:15}") long accessTokenTtlMinutes
    ) {
        this.jwtEncoder = jwtEncoder;
        this.accessTokenTtl = Duration.ofMinutes(accessTokenTtlMinutes);
    }

    public Token generarAccessToken(Usuario usuario) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(accessTokenTtl);
        String roles = usuario.getRoles().stream()
                .map(Enum::name)
                .sorted()
                .reduce((actual, siguiente) -> actual + " " + siguiente)
                .orElse("");

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("ecommerce-zapateria")
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .subject(usuario.getEmail())
                .claim("userId", usuario.getId())
                .claim("username", usuario.getUsername())
                .claim("roles", roles)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new Token(token, expiresAt);
    }

    public record Token(String value, Instant expiresAt) {
    }
}
