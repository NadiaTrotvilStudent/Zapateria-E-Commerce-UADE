import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice.js';
import { toggleFavorite } from '@/store/slices/favoritesSlice.js';
import { formatCurrency } from '@/utils/formatters.js';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.items.find((item) => String(item.id) === id));
  const favoriteIds = useSelector((state) => state.favorites.productIds);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    const variants = product?.variantes ?? [];
    return variants.find((variant) => String(variant.id) === selectedVariantId) ?? variants[0];
  }, [product, selectedVariantId]);

  if (!product) {
    return (
      <section className="page" aria-labelledby="product-detail-title">
        <div className="placeholder-panel">
          <h1 id="product-detail-title">Producto no encontrado</h1>
          <Link className="button button--primary" to="/home">Volver al catalogo</Link>
        </div>
      </section>
    );
  }

  const isFavorite = favoriteIds.includes(Number(product.id));

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    dispatch(addItem({
      productoId: product.id,
      varianteProductoId: selectedVariant.id,
      nombre: product.nombre,
      talle: selectedVariant.talle,
      color: selectedVariant.color,
      precioUnitario: Number(product.precio),
      cantidad: quantity,
      imagen: product.imagenes?.[0],
    }));
  };

  return (
    <section className="page" aria-labelledby="product-detail-title">
      <div className="detail-layout">
        <div className="detail-media">
          <img src={product.imagenes?.[0]} alt={product.nombre} />
        </div>
        <div className="detail-panel">
          <p className="eyebrow">Producto #{id}</p>
          <h1 id="product-detail-title">{product.nombre}</h1>
          <p>{product.descripcion}</p>
          <strong className="price-display">{formatCurrency(product.precio)}</strong>

          <label className="field-label" htmlFor="variant">
            Variante vendible: talle y color
          </label>
          <select
            id="variant"
            value={selectedVariant?.id ?? ''}
            onChange={(event) => setSelectedVariantId(event.target.value)}
          >
            {(product.variantes ?? []).map((variant) => (
              <option key={variant.id} value={variant.id}>
                Talle {variant.talle} - {variant.color} - stock {variant.stock}
              </option>
            ))}
          </select>

          <label className="field-label" htmlFor="quantity">Cantidad</label>
          <input
            id="quantity"
            min="1"
            max={selectedVariant?.stock ?? 1}
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />

          <div className="product-card__actions">
            <button className="button button--primary" type="button" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => dispatch(toggleFavorite(product.id))}
            >
              {isFavorite ? 'Quitar favorito' : 'Agregar favorito'}
            </button>
            <Link className="button button--secondary" to="/carrito">
              Ir al carrito
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
