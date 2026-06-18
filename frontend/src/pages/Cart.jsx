import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext.jsx';
import { formatCurrency } from '@/utils/formatters.js';
import ErrorMessage from '@/components/ErrorMessage.jsx';
import Loader from '@/components/Loader.jsx';

function Cart() {
  const { cartItems, increment, decrement, removeItem, clearCart } = useCart();
  const [cartError, setCartError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precioUnitario * item.cantidad,
    0,
  );

  const handleCartAction = async (action, id) => {
    setCartError(null);
    setUpdatingId(id);
    try {
      await action(id);
    } catch (err) {
      const message = err.message?.includes('Stock') || err.message?.includes('stock')
        ? 'Sin stock disponible para sumar mas unidades.'
        : err.message;
      setCartError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm('Seguro que queres vaciar el carrito?');
    if (!confirmed) return;

    setCartError(null);
    setClearing(true);
    try {
      await clearCart();
    } catch (err) {
      setCartError(err.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="page" aria-labelledby="cart-title">
      <div className="page__header page__header--actions">
        <div>
          <p className="eyebrow">useCart() — CartContext</p>
          <h1 id="cart-title">Carrito</h1>
          <p>Los items se exponen por useContext y se sincronizan con el backend cuando hay sesion iniciada.</p>
        </div>
        {cartItems.length > 0 && (
          <button className="button button--danger" type="button" onClick={handleClearCart} disabled={clearing}>
            {clearing ? 'Vaciando...' : 'Vaciar carrito'}
          </button>
        )}
      </div>

      {cartError && <ErrorMessage>{cartError}</ErrorMessage>}
      {clearing && <Loader message="Actualizando carrito..." />}

      {cartItems.length === 0 ? (
        <div className="placeholder-panel empty-state">
          <p>Tu carrito esta vacio. Agrega una variante desde el catalogo.</p>
          <Link className="button button--primary" to="/home">Ver productos</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => {
              const subtotal = item.precioUnitario * item.cantidad;
              const maxReached = item.stockDisponible && item.cantidad >= item.stockDisponible;
              return (
                <article className="cart-item" key={item.varianteProductoId}>
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} />
                  ) : (
                    <div className="image-placeholder image-placeholder--cart">Sin imagen</div>
                  )}
                  <div>
                    <h2>{item.nombre}</h2>
                    <p>Talle {item.talle} / {item.color}</p>
                    <strong>{formatCurrency(item.precioUnitario)}</strong>
                    <p className="cart-item__subtotal">Subtotal: {formatCurrency(subtotal)}</p>
                    {maxReached && <p className="stock-warning">Stock maximo alcanzado.</p>}
                  </div>
                  <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                    <button
                      type="button"
                      onClick={() => handleCartAction(decrement, item.varianteProductoId)}
                      disabled={item.cantidad <= 1 || updatingId === item.varianteProductoId}
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => handleCartAction(increment, item.varianteProductoId)}
                      disabled={maxReached || updatingId === item.varianteProductoId}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="button button--danger"
                    type="button"
                    onClick={() => handleCartAction(removeItem, item.varianteProductoId)}
                    disabled={updatingId === item.varianteProductoId}
                  >
                    {updatingId === item.varianteProductoId ? 'Actualizando...' : 'Eliminar'}
                  </button>
                </article>
              );
            })}
          </div>
          <aside className="summary-card">
            <p className="eyebrow">Resumen</p>
            <h2>{formatCurrency(total)}</h2>
            <p>{cartItems.length} variantes en el carrito</p>
            <Link className="button button--primary" to="/checkout">Continuar al checkout</Link>
            <Link className="button button--ghost" to="/home">Seguir comprando</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
