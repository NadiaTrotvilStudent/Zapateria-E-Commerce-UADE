import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <section className="page page--narrow" aria-labelledby="login-title">
      <div className="page__header">
        <p className="eyebrow">Acceso</p>
        <h1 id="login-title">Login</h1>
        <p>Pantalla en construccion para iniciar sesion.</p>
      </div>

      <div className="placeholder-panel">
        <p>Formulario de login pendiente de integracion con AuthContext.</p>
        <button className="button button--primary" type="button" onClick={() => navigate('/home')}>
          Ir a Home
        </button>
      </div>
    </section>
  );
}

export default Login;
