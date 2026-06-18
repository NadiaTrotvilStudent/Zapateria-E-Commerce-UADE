import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch.js';
import { fetchProductById } from '@/services/productsService.js';
import { useCart } from '@/context/CartContext.jsx';
import { toggleFavorite } from '@/store/slices/favoritesSlice.js';
import { formatCurrency } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';
import SuccessMessage from '@/components/SuccessMessage.jsx';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const favoriteIds = useSelector((state) => state.favorites.productIds);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: product, loading, error } = useFetch(
    () => fetchProductById(id),
    [id],
  );

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [addError, setAddError] = useState(null);
  const [adding, setAdding] = useState(false);

  const selectedVariant = useMemo(() => {
    const variants = product?.variantes ?? [];
    return variants.find((variant) => String(variant.id) === selectedVariantId) ?? variants[0];
  }, [product, selectedVariantId]);

  const getQuantityInCart = (variantId) => {
    const item = cartItems.find((cartItem) => Number(cartItem.varianteProductoId) === Number(variantId));
    return item?.cantidad ?? 0;
  };

  const getAvailableStock = (variant) => Math.max(
    0,
    Number(variant?.stock ?? 0) - getQuantityInCart(variant?.id),
  );

  const quantityInCart = useMemo(() => {
    if (!selectedVariant) return 0;
    return getQuantityInCart(selectedVariant.id);
  }, [cartItems, selectedVariant]);

  const availableStock = selectedVariant ? getAvailableStock(selectedVariant) : 0;
  const canAddToCart = isAuthenticated && Boolean(selectedVariant) && availableStock > 0 && !adding;

  useEffect(() => {
    setQuantity(availableStock > 0 ? Math.min(quantity, availableStock) || 1 : 1);
  }, [availableStock, quantity]);

  if (loading) {
    return (
      <section className="page" aria-labelledby="product-detail-title">
        <Loader message="Cargando producto..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="page" aria-labelledby="product-detail-title">
        <ErrorMessage>{error}</ErrorMessage>
        <Link className="button button--primary" to="/home">Volver al catalogo</Link>
      </section>
    );
  }

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

  const handleVariantChange = (event) => {
    setSelectedVariantId(event.target.value);
    setQuantity(1);
    setAddedFeedback(false);
    setAddError(null);
  };

  const handleQuantityChange = (event) => {
    const nextQuantity = Number(event.target.value);
    if (Number.isNaN(nextQuantity)) return;
    setQuantity(Math.min(Math.max(nextQuantity, 1), Math.max(availableStock, 1)));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setAddError('Para agregar productos al carrito tenes que iniciar sesion.');
      navigate('/login');
      return;
    }

    if (!selectedVariant || availableStock <= 0) return;

    const safeQuantity = Math.min(quantity, availableStock);
    setAdding(true);
    setAddError(null);

    try {
      await addToCart({
        varianteProductoId: selectedVariant.id,
        productoId: product.id,
        nombre: product.nombre,
        talle: selectedVariant.talle,
        color: selectedVariant.color,
        precioUnitario: Number(product.precio),
        cantidad: safeQuantity,
        stockDisponible: Number(selectedVariant.stock ?? 0),
        imagen: product.imagenes?.[0],
      });
      setQuantity(1);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2200);
    } catch (err) {
      const message = err.message?.includes('403')
        ? 'No se pudo agregar al carrito con este usuario. Volve a iniciar sesion e intentalo nuevamente.'
        : err.message?.includes('Stock')
          ? 'Sin stock disponible para esta variante.'
          : err.message;
      setAddError(message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="page" aria-labelledby="product-detail-title">
      <div className="detail-layout">
        <div className="detail-media">
          {product.imagenes?.[0] ? (
            <img src={product.imagenes[0]} alt={product.nombre} />
          ) : (
            <div className="image-placeholder image-placeholder--large">Sin imagen</div>
          )}
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
            onChange={handleVariantChange}
            disabled={(product.variantes ?? []).length === 0}
          >
            {(product.variantes ?? []).length === 0 ? (
              <option value="">Sin variantes disponibles</option>
            ) : (
              (product.variantes ?? []).map((variant) => {
                const available = getAvailableStock(variant);
                return (
                  <option key={variant.id} value={variant.id}>
                    Talle {variant.talle} - {variant.color} - disponible {available} de {variant.stock}
                  </option>
                );
              })
            )}
          </select>

          {selectedVariant && (
            <div className="stock-helper">
              <span>Stock total: {selectedVariant.stock}</span>
              <span>En carrito: {quantityInCart}</span>
              <strong>Disponible para agregar: {availableStock}</strong>
            </div>
          )}

          <label className="field-label" htmlFor="quantity">Cantidad</label>
          <input
            id="quantity"
            min="1"
            max={Math.max(availableStock, 1)}
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={availableStock <= 0}
          />

          {!isAuthenticated && (
            <div className="stock-notice" role="status">Inicia sesion para poder agregar productos al carrito.</div>
          )}
          {availableStock <= 0 && selectedVariant && (
            <div className="stock-notice" role="status">Sin stock disponible para esta variante.</div>
          )}
          {addedFeedback && <SuccessMessage message="Producto agregado al carrito. El disponible se actualizo." />}
          {addError && <ErrorMessage>{addError}</ErrorMessage>}

          <div className="product-card__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={handleAddToCart}
              disabled={isAuthenticated ? !canAddToCart : false}
            >
              {!isAuthenticated ? 'Iniciar sesion para agregar' : adding ? 'Agregando...' : 'Agregar al carrito'}
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
            <Link className="button button--ghost" to="/home">
              Volver al catalogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
