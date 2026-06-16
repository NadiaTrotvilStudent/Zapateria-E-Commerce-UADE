import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  return (
    <section className="page page--narrow" aria-labelledby="register-title">
      <div className="page__header">
        <p className="eyebrow">Cuenta nueva</p>
        <h1 id="register-title">Register</h1>
        <p>Pantalla en construccion para registrar usuarios.</p>
      </div>

      <div className="placeholder-panel">
        <p>Formulario de registro pendiente de conexion con el backend.</p>
        <button className="button button--secondary" type="button" onClick={() => navigate('/login')}>
          Ir a Login
        </button>
      </div>
    </section>
  );
}

export default Register;
