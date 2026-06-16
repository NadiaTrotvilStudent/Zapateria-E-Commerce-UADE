import { Link } from 'react-router-dom';

function Cart() {
  return (
    <section className="page" aria-labelledby="cart-title">
      <div className="page__header">
        <p className="eyebrow">Compra</p>
        <h1 id="cart-title">Cart</h1>
        <p>Pantalla en construccion para listar items, cantidades y subtotal.</p>
      </div>

      <div className="placeholder-panel">
        <p>Carrito temporal preparado para futura integracion con CartContext.</p>
        <Link className="button button--primary" to="/checkout">
          Continuar al checkout
        </Link>
      </div>
    </section>
  );
}

export default Cart;
