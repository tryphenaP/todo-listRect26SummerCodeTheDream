import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Logon.module.css';

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoggingOn(true);
    setAuthError('');

    try {
      const result = await login(email, password);

      if (!result.success) {
        setAuthError(result.error);
      }
    } catch (error) {
      setAuthError(
        `Error: ${error.name} | ${error.message}`
      );
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <form
      className={styles.logonForm}
      onSubmit={handleSubmit}
    >
      {authError && (
        <p className={styles.error}>
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
        onChange={(e) => setEmail(e.target.value)}
        required
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
        onChange={(e) => setPassword(e.target.value)}
        required
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