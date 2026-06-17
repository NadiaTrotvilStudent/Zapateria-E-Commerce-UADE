import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext.jsx';
import { formatCurrency } from '@/utils/formatters.js';

function Cart() {
  const { cartItems, increment, decrement, removeItem } = useCart();
  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precioUnitario * item.cantidad,
    0,
  );

  return (
    <section className="page" aria-labelledby="cart-title">
      <div className="page__header">
        <p className="eyebrow">useCart() — CartContext</p>
        <h1 id="cart-title">Carrito</h1>
        <p>Los items del carrito viven en Redux (cartSlice) y se exponen via useContext.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="placeholder-panel">
          <p>Tu carrito esta vacio. Agrega una variante desde el catalogo.</p>
          <Link className="button button--primary" to="/home">Ver productos</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.varianteProductoId}>
                <img src={item.imagen} alt={item.nombre} />
                <div>
                  <h2>{item.nombre}</h2>
                  <p>Talle {item.talle} / {item.color}</p>
                  <strong>{formatCurrency(item.precioUnitario)}</strong>
                </div>
                <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                  <button type="button" onClick={() => decrement(item.varianteProductoId)}>-</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => increment(item.varianteProductoId)}>+</button>
                </div>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => removeItem(item.varianteProductoId)}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <p className="eyebrow">Resumen</p>
            <h2>{formatCurrency(total)}</h2>
            <p>{cartItems.length} variantes en el carrito</p>
            <Link className="button button--primary" to="/checkout">Continuar al checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
