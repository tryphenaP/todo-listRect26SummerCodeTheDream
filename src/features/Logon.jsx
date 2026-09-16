import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    <form onSubmit={handleSubmit}>
      {authError && (
        <p style={{ color: 'red' }}>
          {authError}
        </p>
      )}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        required
      />

      <button disabled={isLoggingOn}>
        {isLoggingOn
          ? 'Logging on...'
          : 'Log On'}
      </button>
    </form>
  );
}

export default Logon;