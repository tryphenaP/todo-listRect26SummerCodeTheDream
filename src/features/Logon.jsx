import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import {
  isValidEmail,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../utils/todoValidation.js';
import styles from './Logon.module.css';

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError('');

    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setAuthError('Password is required.');
      return;
    }

    setIsLoggingOn(true);

    try {
      const result = await login(trimmedEmail, password);

      if (!result.success) {
        setAuthError(result.error || 'Unable to log in. Please check your credentials and try again.');
      }
    } catch {
      setAuthError('Unable to log in. Please check your connection and try again.');
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <form
      className={styles.logonForm}
      onSubmit={handleSubmit}
      noValidate
    >
      {authError && (
        <p className={styles.error} role="alert">
          {authError}
        </p>
      )}

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
        onChange={(e) => {
          setEmail(e.target.value);
          if (authError) setAuthError('');
        }}
        placeholder="name@example.com"
        maxLength={EMAIL_MAX_LENGTH}
        autoComplete="email"
        required
        disabled={isLoggingOn}
        aria-invalid={Boolean(authError)}
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
        onChange={(e) => {
          setPassword(e.target.value);
          if (authError) setAuthError('');
        }}
        placeholder="Enter your password"
        maxLength={PASSWORD_MAX_LENGTH}
        autoComplete="current-password"
        required
        disabled={isLoggingOn}
        aria-invalid={Boolean(authError)}
      />

      <button
        className={styles.logonButton}
        type="submit"
        disabled={isLoggingOn}
      >
        {isLoggingOn ? 'Logging on...' : 'Log On'}
      </button>
    </form>
  );
}

export default Logon;