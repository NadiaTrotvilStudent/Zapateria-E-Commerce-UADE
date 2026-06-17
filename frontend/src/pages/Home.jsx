import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '@/store/slices/favoritesSlice.js';
import { useFetch } from '@/hooks/useFetch.js';
import { fetchProducts, fetchCategorias } from '@/services/productsService.js';
import { formatCurrency } from '@/utils/formatters.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function Home() {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.productIds);

  // estado del filtro, cuando cambia se vuelve a hacer el fetch
  const [categoriaId, setCategoriaId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const productosFetch = useFetch(() => fetchProducts(categoriaId || null), [categoriaId]);
  const categoriasFetch = useFetch(() => fetchCategorias(), []);

  const products = productosFetch.data ?? [];
  const categorias = categoriasFetch.data ?? [];

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <section className="page" aria-labelledby="home-title">
      <div className="hero-panel">
        <div className="page__header">
          <p className="eyebrow">Catalogo en vivo</p>
          <h1 id="home-title">Productos desde la API</h1>
          <p>
            El catalogo se carga con useEffect pegandole a GET /api/productos.
            Podes filtrar por categoria y el useEffect re-dispara el fetch.
          </p>
        </div>

        <div className="redux-summary" aria-label="Resumen catalogo">
          <span>Fuente: API REST</span>
          <span>{filteredProducts.length} de {products.length} productos</span>
          <span>{favoriteIds.length} favoritos</span>
        </div>

        <div className="form-panel" style={{ gap: '0.5rem' }}>
          <label className="field-label" htmlFor="search">Buscar producto</label>
          <input
            id="search"
            type="text"
            placeholder="Escribe el nombre..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <label className="field-label" htmlFor="categoria">Filtrar por categoria</label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {productosFetch.loading && <Loader message="Cargando productos..." />}
      {productosFetch.error && <ErrorMessage>{productosFetch.error}</ErrorMessage>}
      {!productosFetch.loading && !productosFetch.error && filteredProducts.length === 0 && (
        <div className="placeholder-panel">
          <p>{searchQuery ? 'No hay productos que coincidan con la busqueda.' : 'No hay productos para esta categoria.'}</p>
        </div>
      )}
      {!productosFetch.loading && !productosFetch.error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => {
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
      )}
    </section>
  );
}

export default Home;
