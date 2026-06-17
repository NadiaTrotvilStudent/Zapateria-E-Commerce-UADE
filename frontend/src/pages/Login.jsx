import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/authService.js';
import { loginSuccess } from '@/store/slices/authSlice.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('cliente@test.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      dispatch(loginSuccess(response));
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page page--narrow" aria-labelledby="login-title">
      <div className="page__header">
        <p className="eyebrow">authSlice + POST /api/auth/login</p>
        <h1 id="login-title">Iniciar sesion</h1>
        <p>Login real contra el backend con JWT. Si no tenes cuenta, registra primero.</p>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleLogin}>
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label className="field-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {loading && <Loader message="Autenticando..." />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
        <p>
          No tenes cuenta? <Link to="/register">Registrate aca</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
