function PrivateRoute({ children }) {
  // Integracion futura:
  // const { isAuthenticated, isLoading } = useAuth();
  // if (isLoading) return <Loader />;
  // return isAuthenticated ? children : <Navigate to="/login" replace />;
  return children;
}

export default PrivateRoute;
