import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import {
  isValidEmail,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../utils/todoValidation.js';
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

    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail, password);

      if (!result.success) {
        setError(result.error || 'Unable to log in. Please check your credentials and try again.');
      }
    } catch {
      setError('Unable to log in. Please check your connection and try again.');
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
          noValidate
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
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError('');
            }}
            placeholder="name@example.com"
            maxLength={EMAIL_MAX_LENGTH}
            autoComplete="email"
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
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
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your password"
            maxLength={PASSWORD_MAX_LENGTH}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            className={styles.loginButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;