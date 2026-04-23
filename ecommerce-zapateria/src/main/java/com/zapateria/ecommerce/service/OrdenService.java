package com.zapateria.ecommerce.service;

import com.zapateria.ecommerce.dto.orden.DetalleOrdenResponse;
import com.zapateria.ecommerce.dto.orden.OrdenResponse;
import com.zapateria.ecommerce.exception.ResourceNotFoundException;
import com.zapateria.ecommerce.model.Orden;
import com.zapateria.ecommerce.repository.OrdenRepository;
import com.zapateria.ecommerce.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para consultar el historial de ordenes.
 */
@Service
@Transactional(readOnly = true)
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    public OrdenService(OrdenRepository ordenRepository, UsuarioRepository usuarioRepository) {
        this.ordenRepository = ordenRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Lista todas las ordenes de un usuario.
     */
    public List<OrdenResponse> listarOrdenesPorUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id " + usuarioId);
        }

        return ordenRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Devuelve una orden puntual por su id.
     */
    public OrdenResponse obtenerOrden(Long ordenId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada con id " + ordenId));
        return toResponse(orden);
    }

    /**
     * Convierte la entidad Orden a un DTO listo para exponer por la API.
     */
    private OrdenResponse toResponse(Orden orden) {
        return new OrdenResponse(
                orden.getId(),
                orden.getUsuario().getId(),
                orden.getUsuario().getUsername(),
                orden.getTotal(),
                orden.getFechaCreacion(),
                orden.getDetalles().stream()
                .map(detalle -> new DetalleOrdenResponse(
                                detalle.getId(),
                                detalle.getVarianteProducto().getId(),
                                detalle.getVarianteProducto().getProducto().getId(),
                                detalle.getProductoNombre(),
                                detalle.getTalle(),
                                detalle.getColor(),
                                detalle.getCantidad(),
                                detalle.getPrecioUnitario(),
                                detalle.getSubtotal()
                        ))
                        .toList()
        );
    }
}
