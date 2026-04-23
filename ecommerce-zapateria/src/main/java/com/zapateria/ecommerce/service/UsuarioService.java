package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.usuario.UsuarioResponse;
import com.zapateria.ecommerce.exception.ResourceNotFoundException;
import com.zapateria.ecommerce.model.Rol;
import com.zapateria.ecommerce.model.Usuario;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public UsuarioResponse obtenerPerfil(String email) {
        return toResponse(buscarPorEmail(email));
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        Set<String> roles = usuario.getRoles().stream()
                .map(Rol::name)
                .collect(Collectors.toSet());

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                roles
        );
    }
}
