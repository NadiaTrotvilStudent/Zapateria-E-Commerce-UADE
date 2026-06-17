import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '@/store/slices/favoritesSlice.js';
import { formatCurrency } from '@/utils/formatters.js';

function Favorites() {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.productIds);
  const products = useSelector((state) => (
    state.products.items.filter((product) => favoriteIds.includes(Number(product.id)))
  ));

  return (
    <section className="page" aria-labelledby="favorites-title">
      <div className="page__header">
        <p className="eyebrow">favoritesSlice</p>
        <h1 id="favorites-title">Lista de favoritos</h1>
        <p>Los favoritos se guardan por ID de producto y persisten al recargar la pagina.</p>
      </div>

      {products.length === 0 ? (
        <div className="placeholder-panel">
          <p>Todavia no marcaste productos como favoritos.</p>
          <Link className="button button--primary" to="/home">Ir al catalogo</Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card__media">
                <img src={product.imagenes?.[0]} alt={product.nombre} />
                <span>Favorito</span>
              </div>
              <div className="product-card__body">
                <h2>{product.nombre}</h2>
                <p>{product.descripcion}</p>
                <strong>{formatCurrency(product.precio)}</strong>
                <div className="product-card__actions">
                  <Link className="button button--primary" to={`/productos/${product.id}`}>Ver detalle</Link>
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={() => dispatch(toggleFavorite(product.id))}
                  >
                    Quitar
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

export default Favorites;
