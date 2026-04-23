package com.zapateria.ecommerce.dto;

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
