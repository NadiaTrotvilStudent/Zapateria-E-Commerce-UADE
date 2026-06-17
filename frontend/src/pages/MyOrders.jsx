import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate } from '@/utils/formatters.js';

function MyOrders() {
  const orders = useSelector((state) => state.orders.items);

  return (
    <section className="page" aria-labelledby="orders-title">
      <div className="page__header">
        <p className="eyebrow">Mis compras</p>
        <h1 id="orders-title">Historial persistido</h1>
        <p>Las compras confirmadas se guardan en Redux y quedan disponibles despues de recargar.</p>
      </div>

      {orders.length === 0 ? (
        <div className="placeholder-panel">
          <p>No hay compras registradas todavia.</p>
          <Link className="button button--primary" to="/home">Comprar ahora</Link>
        </div>
      ) : (
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
                <p key={detail.varianteProductoId}>
                  {detail.cantidad} x {detail.nombre} - talle {detail.talle} / {detail.color}
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
