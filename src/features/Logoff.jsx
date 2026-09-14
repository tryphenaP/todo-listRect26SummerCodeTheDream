import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import styles from './Logoff.module.css';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div className={styles.logoffContainer}>
      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogoff}
        disabled={isLoggingOff}
      >
        {isLoggingOff ? 'Logging off...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logoff;