import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/authService.js';
import { loginSuccess } from '@/store/slices/authSlice.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

const placeholders = {
  email: 'Recomendado: cliente@test.com o vendedor1@test.com',
  password: 'Recomendado: Password123!',
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlaceholder = (field) => (focusedField === field ? '' : placeholders[field]);

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
        <p>Login real contra el backend con JWT. Las sugerencias aparecen como ayuda y desaparecen al tocar cada campo.</p>
      </div>

      <form className="placeholder-panel form-panel auth-panel" onSubmit={handleLogin}>
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('email')}
          required
        />
        <label className="field-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('password')}
          required
        />
        {loading && <Loader message="Autenticando..." />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="form-actions auth-actions">
          <button className="button button--ghost" type="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </button>
          <button className="button button--primary" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </div>
        <div className="auth-switch">
          <span>No tenes cuenta?</span>
          <Link to="/register">Registrate aca</Link>
        </div>
      </form>
    </section>
  );
}

export default Login;
