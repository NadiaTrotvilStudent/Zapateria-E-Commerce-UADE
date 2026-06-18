import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/authService.js';
import { loginSuccess } from '@/store/slices/authSlice.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

const emptyForm = {
  username: '',
  email: '',
  password: '',
  nombre: '',
  apellido: '',
};

const placeholders = {
  username: 'Sugerencia: cliente-nuevo',
  email: 'Sugerencia: nuevo@test.com',
  password: 'Sugerencia: Password123!',
  nombre: 'Sugerencia: Cliente',
  apellido: 'Sugerencia: Nuevo',
};

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlaceholder = (field) => (focusedField === field ? '' : placeholders[field]);

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
        <p>Crea una cuenta contra el backend. Las sugerencias se muestran como ayuda y desaparecen al tocar cada campo.</p>
      </div>

      <form className="placeholder-panel form-panel auth-panel" onSubmit={handleRegister}>
        <label className="field-label" htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('username')}
          required
        />
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('email')}
          required
        />
        <label className="field-label" htmlFor="password">Password (min 8)</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('password')}
          required
          minLength={8}
        />
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          onFocus={() => setFocusedField('nombre')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('nombre')}
          required
        />
        <label className="field-label" htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          onFocus={() => setFocusedField('apellido')}
          onBlur={() => setFocusedField(null)}
          placeholder={getPlaceholder('apellido')}
          required
        />
        {loading && <Loader message="Creando cuenta..." />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="form-actions auth-actions">
          <button className="button button--ghost" type="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </button>
          <button className="button button--secondary" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </div>
        <div className="auth-switch">
          <span>Ya tenes cuenta?</span>
          <Link to="/login">Inicia sesion</Link>
        </div>
      </form>
    </section>
  );
}

export default Register;
