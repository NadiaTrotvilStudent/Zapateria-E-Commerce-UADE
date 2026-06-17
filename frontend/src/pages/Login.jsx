import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice.js';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('cliente@test.com');

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(loginSuccess({
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      user: {
        id: 1,
        username: email.split('@')[0],
        email,
        nombre: 'Cliente',
        apellido: 'Demo',
        roles: ['CLIENTE'],
      },
    }));
    navigate('/home');
  };

  return (
    <section className="page page--narrow" aria-labelledby="login-title">
      <div className="page__header">
        <p className="eyebrow">authSlice</p>
        <h1 id="login-title">Login demo</h1>
        <p>Guarda usuario y tokens demo en Redux para mostrar estado global de autenticacion.</p>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleLogin}>
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="field-label" htmlFor="password">Password</label>
        <input id="password" type="password" value="Password123!" readOnly />
        <button className="button button--primary" type="submit">
          Iniciar sesion demo
        </button>
      </form>
    </section>
  );
}

export default Login;
