import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page page--narrow" aria-labelledby="not-found-title">
      <div className="page__header">
        <p className="eyebrow">404</p>
        <h1 id="not-found-title">Not Found</h1>
        <p>La ruta solicitada no existe o todavia no fue implementada.</p>
      </div>

      <div className="placeholder-panel">
        <Link className="button button--primary" to="/home">
          Volver a Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
