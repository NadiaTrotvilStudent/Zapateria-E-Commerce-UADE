import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext.jsx';
import { apiFetch } from '@/services/apiClient.js';
import { formatCurrency } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precioUnitario * item.cantidad,
    0,
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // primero mando cada item al backend asi el stock se descuenta ahi
      // TODO: usar Promise.all para mandarlos en paralelo, asi tarda menos
      for (const item of cartItems) {
        await apiFetch('/api/carrito', {
          method: 'POST',
          token: accessToken,
          body: { varianteProductoId: item.varianteProductoId, cantidad: item.cantidad },
        });
      }
      // despues el checkout que crea la orden y me devuelve el resumen
      const checkoutResponse = await apiFetch('/api/carrito/checkout', {
        method: 'POST',
        token: accessToken,
      });
      setSuccess(checkoutResponse);
      clearCart();
      setTimeout(() => navigate('/mis-compras'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="page" aria-labelledby="checkout-title">
        <div className="placeholder-panel">
          <h1 id="checkout-title">Necesitas iniciar sesion</h1>
          <p>Para confirmar la compra tenes que estar autenticado.</p>
          <Link className="button button--primary" to="/login">Iniciar sesion</Link>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="page" aria-labelledby="checkout-title">
        <div className="placeholder-panel">
          <h1 id="checkout-title">Compra confirmada</h1>
          <p>{success.mensaje}</p>
          <p>Orden #{success.ordenId} - Total: {formatCurrency(success.total)}</p>
          <p>Redirigiendo a mis compras...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page" aria-labelledby="checkout-title">
      <div className="page__header">
        <p className="eyebrow">POST /api/carrito/checkout</p>
        <h1 id="checkout-title">Confirmar compra</h1>
        <p>El checkout sincroniza con el backend, descuenta stock y crea la orden real.</p>
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
            <p key={item.varianteProductoId}>
              {item.cantidad} x {item.nombre} talle {item.talle}
            </p>
          ))}
          {loading && <Loader message="Procesando compra..." />}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <button
            className="button button--primary"
            type="button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      )}
    </section>
  );
}

export default Checkout;
