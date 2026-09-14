import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Unable to log in');
      }
    } catch (error) {
      setError('Unable to log in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Login</h1>

        <form
          className={styles.loginForm}
          onSubmit={handleSubmit}
        >
          <label
            className={styles.label}
            htmlFor="email"
          >
            Email
          </label>

          <input
            className={styles.input}
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            disabled={isSubmitting}
          />

          <label
            className={styles.label}
            htmlFor="password"
          >
            Password
          </label>

          <input
            className={styles.input}
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            disabled={isSubmitting}
          />

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <button
            className={styles.loginButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Logging in...'
              : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;