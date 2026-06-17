import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '@/store/slices/cartSlice.js';
import { createOrder } from '@/store/slices/ordersSlice.js';
import { formatCurrency } from '@/utils/formatters.js';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const total = cartItems.reduce((accumulator, item) => accumulator + item.precioUnitario * item.cantidad, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    dispatch(createOrder({ cartItems, user }));
    dispatch(clearCart());
    navigate('/mis-compras');
  };

  return (
    <section className="page" aria-labelledby="checkout-title">
      <div className="page__header">
        <p className="eyebrow">ordersSlice</p>
        <h1 id="checkout-title">Checkout sin pago real</h1>
        <p>Al confirmar se crea una compra local persistida y se vacia el carrito global.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="placeholder-panel">
          <p>No hay productos para confirmar.</p>
          <Link className="button button--primary" to="/home">Volver al catalogo</Link>
        </div>
      ) : (
        <div className="summary-card summary-card--wide">
          <p className="eyebrow">Total de la orden</p>
          <h2>{formatCurrency(total)}</h2>
          {cartItems.map((item) => (
            <p key={item.varianteProductoId}>{item.cantidad} x {item.nombre} talle {item.talle}</p>
          ))}
          <button className="button button--primary" type="button" onClick={handleCheckout}>
            Confirmar compra
          </button>
        </div>
      )}
    </section>
  );
}

export default Checkout;
