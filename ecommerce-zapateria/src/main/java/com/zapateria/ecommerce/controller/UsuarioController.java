package com.zapateria.ecommerce.controller;

import com.zapateria.ecommerce.dto.usuario.UsuarioResponse;
import com.zapateria.ecommerce.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Operaciones del usuario autenticado")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener perfil autenticado")
    @SecurityRequirement(name = "bearerAuth")
    public UsuarioResponse obtenerPerfil(@AuthenticationPrincipal Jwt jwt) {
        return usuarioService.obtenerPerfil(jwt.getSubject());
    }
}
