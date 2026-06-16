import { Link } from 'react-router-dom';
import Counter from '@/components/Counter.jsx';

function Home() {
  return (
    <section className="page" aria-labelledby="home-title">
      <div className="page__header">
        <p className="eyebrow">Catalogo</p>
        <h1 id="home-title">Home</h1>
        <p>Pantalla en construccion para mostrar productos destacados y filtros.</p>
      </div>

      <div className="placeholder-grid">
        <article className="placeholder-panel">
          <h2>Catalogo publico</h2>
          <p>Espacio reservado para listado de productos y busqueda.</p>
          <Link className="button button--primary" to="/productos/1">
            Ver detalle demo
          </Link>
        </article>

        <article className="placeholder-panel">
          <h2>Gestion de vendedor</h2>
          <p>Accesos preparados para publicar y administrar productos.</p>
          <Link className="button button--secondary" to="/productos/nuevo">
            Nuevo producto
          </Link>
        </article>
      </div>

      <Counter />
    </section>
  );
}

export default Home;
