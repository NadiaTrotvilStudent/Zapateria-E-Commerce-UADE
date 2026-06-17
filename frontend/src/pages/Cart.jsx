import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { decrementItem, incrementItem, removeItem } from '@/store/slices/cartSlice.js';
import { formatCurrency } from '@/utils/formatters.js';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((accumulator, item) => accumulator + item.precioUnitario * item.cantidad, 0);

  return (
    <section className="page" aria-labelledby="cart-title">
      <div className="page__header">
        <p className="eyebrow">Estado global cartSlice</p>
        <h1 id="cart-title">Carrito persistido</h1>
        <p>El carrito guarda variantes de producto, cantidades y subtotal en Redux + localStorage.</p>
      </div>

      {items.length === 0 ? (
        <div className="placeholder-panel">
          <p>Tu carrito esta vacio. Agrega una variante desde el catalogo.</p>
          <Link className="button button--primary" to="/home">Ver productos</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.varianteProductoId}>
                <img src={item.imagen} alt={item.nombre} />
                <div>
                  <h2>{item.nombre}</h2>
                  <p>Talle {item.talle} / {item.color}</p>
                  <strong>{formatCurrency(item.precioUnitario)}</strong>
                </div>
                <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                  <button type="button" onClick={() => dispatch(decrementItem(item.varianteProductoId))}>-</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => dispatch(incrementItem(item.varianteProductoId))}>+</button>
                </div>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => dispatch(removeItem(item.varianteProductoId))}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <p className="eyebrow">Resumen</p>
            <h2>{formatCurrency(total)}</h2>
            <p>{items.length} variantes en el carrito</p>
            <Link className="button button--primary" to="/checkout">Continuar al checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
