import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch.js';
import { fetchProducts, deleteProduct } from '@/services/productsService.js';
import { formatCurrency } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';
import SuccessMessage from '@/components/SuccessMessage.jsx';

function MyProducts() {
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const { data, loading, error } = useFetch(() => fetchProducts(), [refreshKey]);
  const products = (data || []).filter((p) => p.usuarioCreadorId === user?.id);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Seguro que queres eliminar "${product.nombre}"?`);
    if (!confirmed) return;

    setDeletingId(product.id);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      await deleteProduct(product.id, accessToken);
      setDeleteSuccess(`Se elimino ${product.nombre}.`);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="page" aria-labelledby="my-products-title">
      <div className="page__header page__header--actions">
        <div>
          <p className="eyebrow">Gestion de publicaciones</p>
          <h1 id="my-products-title">Mis productos</h1>
          <p>Administra las publicaciones que creaste.</p>
        </div>
        <Link className="button button--primary" to="/productos/nuevo">
          + Crear producto
        </Link>
      </div>

      {deleteSuccess && <SuccessMessage>{deleteSuccess}</SuccessMessage>}
      {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
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
                {product.imagenes?.[0] ? (
                  <img src={product.imagenes[0]} alt={product.nombre} />
                ) : (
                  <div className="image-placeholder">Sin imagen</div>
                )}
                <span>{product.categoriaNombre || 'Sin categoria'}</span>
              </div>
              <div className="product-card__body">
                <div>
                  <p className="eyebrow">{product.marcaNombre || 'Marca sin informar'}</p>
                  <h2>{product.nombre}</h2>
                  <p>{product.descripcion}</p>
                </div>
                <div className="product-card__meta">
                  <strong>{formatCurrency(product.precio)}</strong>
                  <span className={product.stock > 0 ? 'stock-pill' : 'stock-pill stock-pill--empty'}>
                    {product.stock} unidades
                  </span>
                </div>
                <div className="product-card__actions">
                  <Link className="button button--primary" to={`/productos/editar/${product.id}`}>
                    Editar
                  </Link>
                  <button
                    className="button button--danger"
                    type="button"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
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
