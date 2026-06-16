import { Link, useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();

  return (
    <section className="page" aria-labelledby="product-detail-title">
      <div className="page__header">
        <p className="eyebrow">Producto #{id}</p>
        <h1 id="product-detail-title">Product Detail</h1>
        <p>Pantalla en construccion para mostrar imagenes, variantes, stock y precio.</p>
      </div>

      <div className="placeholder-panel">
        <p>Detalle temporal del producto seleccionado.</p>
        <Link className="button button--primary" to="/carrito">
          Ir al carrito
        </Link>
      </div>
    </section>
  );
}

export default ProductDetail;
