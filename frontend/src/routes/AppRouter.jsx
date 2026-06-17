import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.jsx';
import Cart from '@/pages/Cart.jsx';
import Checkout from '@/pages/Checkout.jsx';
import Favorites from '@/pages/Favorites.jsx';
import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import MyOrders from '@/pages/MyOrders.jsx';
import MyProducts from '@/pages/MyProducts.jsx';
import NotFound from '@/pages/NotFound.jsx';
import ProductDetail from '@/pages/ProductDetail.jsx';
import ProductForm from '@/pages/ProductForm.jsx';
import Register from '@/pages/Register.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route
        path="/carrito"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route
        path="/mis-compras"
        element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/nuevo"
        element={
          <PrivateRoute>
            <ProductForm mode="create" />
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/editar/:id"
        element={
          <PrivateRoute>
            <ProductForm mode="edit" />
          </PrivateRoute>
        }
      />
      <Route
        path="/mis-productos"
        element={
          <PrivateRoute>
            <MyProducts />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
