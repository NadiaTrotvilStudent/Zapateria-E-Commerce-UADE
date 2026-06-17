import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch.js';
import { fetchProducts } from '@/services/productsService.js';
import { formatCurrency } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function MyProducts() {
  const user = useSelector((state) => state.auth.user);
  const { data, loading, error } = useFetch(() => fetchProducts(), []);
  const products = (data || []).filter((p) => p.usuarioCreadorId === user?.id);

  return (
    <section className="page" aria-labelledby="my-products-title">
      <div className="page__header">
        <p className="eyebrow">Vendedor</p>
        <h1 id="my-products-title">Mis productos</h1>
        <p>Administra las publicaciones que creaste.</p>
      </div>

      <Link className="button button--primary" to="/productos/nuevo">
        + Crear producto
      </Link>

      {loading && <Loader message="Cargando productos..." />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && products.length === 0 && (
        <div className="placeholder-panel">
          <p>No tenes productos publicados todavia.</p>
        </div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card__media">
                <img src={product.imagenes?.[0]} alt={product.nombre} />
                <span>{product.categoriaNombre}</span>
              </div>
              <div className="product-card__body">
                <div>
                  <p className="eyebrow">{product.marcaNombre}</p>
                  <h2>{product.nombre}</h2>
                  <p>{product.descripcion}</p>
                </div>
                <div className="product-card__meta">
                  <strong>{formatCurrency(product.precio)}</strong>
                  <span>{product.stock} unidades</span>
                </div>
                <div className="product-card__actions">
                  <Link className="button button--primary" to={`/productos/editar/${product.id}`}>
                    Editar
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyProducts;
