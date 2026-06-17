import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/authService.js';
import { loginSuccess } from '@/store/slices/authSlice.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: 'cliente-nuevo',
    email: 'nuevo@test.com',
    password: 'Password123!',
    nombre: 'Cliente',
    apellido: 'Nuevo',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(form);
      dispatch(loginSuccess(response));
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page page--narrow" aria-labelledby="register-title">
      <div className="page__header">
        <p className="eyebrow">Perfil de usuario</p>
        <h1 id="register-title">Registro</h1>
        <p>Crea una cuenta contra el backend (POST /api/auth/register) y entra automaticamente.</p>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleRegister}>
        <label className="field-label" htmlFor="username">Username</label>
        <input id="username" name="username" value={form.username} onChange={handleChange} required />
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <label className="field-label" htmlFor="password">Password (min 8)</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        <label className="field-label" htmlFor="apellido">Apellido</label>
        <input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required />
        {loading && <Loader message="Creando cuenta..." />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button className="button button--secondary" type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
        <p>
          Ya tenes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
