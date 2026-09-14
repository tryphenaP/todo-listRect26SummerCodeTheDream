import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import styles from './HomePage.module.css';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.homePage}>
      <div className={styles.redirectCard}>
        <p className={styles.redirectText}>
          Redirecting...
        </p>
      </div>
    </main>
  );
}

export default HomePage;