import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice.js';
import { useCart } from '@/context/CartContext.jsx';
import { userHasRole } from '@/utils/authRoles.js';

const navigationItems = [
  { to: '/home', label: 'Inicio' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/carrito', label: 'Carrito', private: true },
  { to: '/checkout', label: 'Checkout', private: true },
  { to: '/mis-compras', label: 'Mis compras', private: true },
  { to: '/mis-productos', label: 'Mis productos', private: true, roles: ['ADMIN', 'VENDEDOR'] },
];

function Navbar() {
  const dispatch = useDispatch();
  const { cartItems } = useCart();
  const favoriteIds = useSelector((state) => state.favorites.productIds);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = navigationItems.filter((item) => {
    if (item.private && !isAuthenticated) return false;
    if (item.roles?.length) return item.roles.some((role) => userHasRole(user, role));
    return true;
  });

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Navegacion principal">
        <Link className="navbar__brand" to="/home">
          Zapateria UADE
        </Link>

        <button
          className="navbar__menu-btn"
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              {item.to === '/carrito' && cartCount > 0 ? (
                <span className="navbar__badge">{cartCount}</span>
              ) : null}
              {item.to === '/favoritos' && favoriteIds.length > 0 ? (
                <span className="navbar__badge">{favoriteIds.length}</span>
              ) : null}
            </NavLink>
          ))}
        </div>

        <div className="navbar__actions" aria-label="Acciones de usuario">
          {isAuthenticated ? (
            <button className="button button--primary" type="button" onClick={handleLogout}>
              Salir {user?.username}
            </button>
          ) : (
            <>
              <NavLink className="button button--ghost" to="/login">
                Login
              </NavLink>
              <NavLink className="button button--primary" to="/register">
                Registro
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
