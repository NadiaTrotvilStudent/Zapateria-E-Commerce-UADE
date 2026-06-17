import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.js';
import { apiFetch } from '@/services/apiClient.js';
import { formatCurrency, formatDate } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function MyOrders() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // traigo las ordenes del backend con el token guardado en authSlice
  const { data, loading, error } = useFetch(
    () => apiFetch('/api/ordenes', { token: accessToken }),
    [accessToken],
  );

  const orders = data ?? [];

  if (!isAuthenticated) {
    return (
      <section className="page" aria-labelledby="orders-title">
        <div className="placeholder-panel">
          <h1 id="orders-title">Necesitas iniciar sesion</h1>
          <Link className="button button--primary" to="/login">Iniciar sesion</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" aria-labelledby="orders-title">
      <div className="page__header">
        <p className="eyebrow">GET /api/ordenes</p>
        <h1 id="orders-title">Mis compras</h1>
        <p>Historial real desde el backend (necesita JWT).</p>
      </div>

      {loading && <Loader message="Cargando compras..." />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && orders.length === 0 && (
        <div className="placeholder-panel">
          <p>No hay compras registradas todavia.</p>
          <Link className="button button--primary" to="/home">Comprar ahora</Link>
        </div>
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="placeholder-panel" key={order.id}>
              <div className="order-heading">
                <div>
                  <p className="eyebrow">Orden #{order.id}</p>
                  <h2>{formatCurrency(order.total)}</h2>
                </div>
                <span>{formatDate(order.fechaCreacion)}</span>
              </div>
              {order.detalles.map((detail) => (
                <p key={detail.id ?? detail.varianteProductoId}>
                  {detail.cantidad} x {detail.productoNombre} - talle {detail.talle} / {detail.color}
                </p>
              ))}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyOrders;
