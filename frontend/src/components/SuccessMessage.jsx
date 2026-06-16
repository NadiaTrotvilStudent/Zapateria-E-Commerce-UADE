function SuccessMessage({ message = 'Operacion realizada correctamente.', children }) {
  return (
    <div className="feedback feedback--success" role="status" aria-live="polite">
      <strong>Listo</strong>
      <p>{children || message}</p>
    </div>
  );
}

export default SuccessMessage;
