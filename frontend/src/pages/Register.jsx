import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice.js';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('cliente-nuevo');
  const [email, setEmail] = useState('nuevo@test.com');

  const handleRegister = (event) => {
    event.preventDefault();
    dispatch(loginSuccess({
      accessToken: 'demo-register-access-token',
      refreshToken: 'demo-register-refresh-token',
      user: {
        id: Date.now(),
        username,
        email,
        nombre: 'Usuario',
        apellido: 'Nuevo',
        roles: ['CLIENTE'],
      },
    }));
    navigate('/home');
  };

  return (
    <section className="page page--narrow" aria-labelledby="register-title">
      <div className="page__header">
        <p className="eyebrow">Perfil de usuario</p>
        <h1 id="register-title">Registro demo</h1>
        <p>Crea un perfil local para demostrar persistencia de usuario autenticado.</p>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleRegister}>
        <label className="field-label" htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="button button--secondary" type="submit">
          Crear cuenta demo
        </button>
      </form>
    </section>
  );
}

export default Register;
