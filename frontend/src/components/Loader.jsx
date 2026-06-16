function Loader({ message = 'Cargando...' }) {
  return (
    <div className="feedback feedback--loading" role="status" aria-live="polite">
      <span className="loader" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default Loader;
