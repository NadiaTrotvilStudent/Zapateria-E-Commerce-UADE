import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '@/store/slices/favoritesSlice.js';
import { formatCurrency } from '@/utils/formatters.js';

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const favoriteIds = useSelector((state) => state.favorites.productIds);

  return (
    <section className="page" aria-labelledby="home-title">
      <div className="hero-panel">
        <div className="page__header">
          <p className="eyebrow">Redux Toolkit Marketplace</p>
          <h1 id="home-title">Catalogo de zapateria conectado al estado global</h1>
          <p>
            Productos, favoritos, carrito, tema y compras ahora viven en Redux Toolkit. El catalogo
            usa la API cuando esta disponible y conserva datos demo para poder mostrar el flujo.
          </p>
        </div>

        <div className="redux-summary" aria-label="Resumen Redux">
          <span>Fuente: Store Redux</span>
          <span>{products.length} productos</span>
          <span>{favoriteIds.length} favoritos</span>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const isFavorite = favoriteIds.includes(Number(product.id));

          return (
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
                  <Link className="button button--primary" to={`/productos/${product.id}`}>
                    Ver detalle
                  </Link>
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={() => dispatch(toggleFavorite(product.id))}
                  >
                    {isFavorite ? 'Quitar favorito' : 'Favorito'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Home;
