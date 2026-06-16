import { Link, NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/home', label: 'Inicio' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/mis-productos', label: 'Mis productos' },
];

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Navegacion principal">
        <Link className="navbar__brand" to="/home">
          Zapateria UADE
        </Link>

        <div className="navbar__links">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar__actions" aria-label="Acciones de usuario">
          <NavLink className="button button--ghost" to="/login">
            Login
          </NavLink>
          <NavLink className="button button--primary" to="/register">
            Registro
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
