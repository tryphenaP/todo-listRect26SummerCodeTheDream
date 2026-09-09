import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.js';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  return children;
}

export default RequireAuth;