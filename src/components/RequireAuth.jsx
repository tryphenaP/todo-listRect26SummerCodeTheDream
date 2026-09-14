import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './RequireAuth.module.css';

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default RequireAuth;