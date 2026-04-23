package com.zapateria.ecommerce.dto.usuario;

import java.util.Set;

public record UsuarioResponse(
        Long id,
        String username,
        String email,
        String nombre,
        String apellido,
        Set<String> roles
) {
}
