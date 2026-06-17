import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice.js';
import { useCart } from '@/context/CartContext.jsx';

const navigationItems = [
  { to: '/home', label: 'Inicio' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/mis-compras', label: 'Mis compras' },
  { to: '/mis-productos', label: 'Mis productos' },
];

function Navbar() {
  const dispatch = useDispatch();
  const { cartItems } = useCart();
  const favoriteIds = useSelector((state) => state.favorites.productIds);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

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
            <button className="button button--primary" type="button" onClick={() => dispatch(logout())}>
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
