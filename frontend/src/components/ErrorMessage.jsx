function ErrorMessage({ message = 'Ocurrio un error.', children }) {
  return (
    <div className="feedback feedback--error" role="alert">
      <strong>Error</strong>
      <p>{children || message}</p>
    </div>
  );
}

export default ErrorMessage;
