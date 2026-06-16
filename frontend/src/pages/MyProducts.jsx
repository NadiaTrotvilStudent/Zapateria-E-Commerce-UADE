import { Link } from 'react-router-dom';

function MyProducts() {
  return (
    <section className="page" aria-labelledby="my-products-title">
      <div className="page__header">
        <p className="eyebrow">Vendedor</p>
        <h1 id="my-products-title">My Products</h1>
        <p>Pantalla en construccion para administrar publicaciones propias.</p>
      </div>

      <div className="placeholder-panel">
        <p>Listado temporal de productos creados por el usuario autenticado.</p>
        <Link className="button button--primary" to="/productos/nuevo">
          Crear producto
        </Link>
      </div>
    </section>
  );
}

export default MyProducts;
