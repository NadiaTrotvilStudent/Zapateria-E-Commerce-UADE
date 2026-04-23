package com.zapateria.ecommerce.security;

import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public SecurityUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .map(usuario -> User.withUsername(usuario.getEmail())
                        .password(usuario.getPassword())
                        .authorities(usuario.getRoles().stream()
                                .map(rol -> "ROLE_" + rol.name())
                                .toArray(String[]::new))
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}
