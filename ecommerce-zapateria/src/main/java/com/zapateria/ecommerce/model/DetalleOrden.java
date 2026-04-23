package com.zapateria.ecommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Representa una linea de una orden.
 * Guarda que variante se compro, en que cantidad y a que precio.
 */
@Entity
@Table(name = "detalles_orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Orden a la que pertenece este detalle.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

    // Variante exacta que fue comprada.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variante_producto_id", nullable = false)
    private VarianteProducto varianteProducto;

    // Nombre del producto guardado como foto historica.
    @Column(nullable = false, length = 100)
    private String productoNombre;

    // Talle guardado como foto historica al momento de la compra.
    @Column(length = 20)
    private String talle;

    // Color guardado como foto historica al momento de la compra.
    @Column(length = 40)
    private String color;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
