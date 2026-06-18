import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userHasAnyRole } from '@/utils/authRoles.js';

function PrivateRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userHasAnyRole(user, allowedRoles)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PrivateRoute;
