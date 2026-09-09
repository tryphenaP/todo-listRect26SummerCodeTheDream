import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/auth.js';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the page the user originally wanted to visit.
  // If there is no saved destination, go to /todos.
  const from = location.state?.from?.pathname || '/todos';

  // Redirect after authentication succeeds.
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
      // Do NOT navigate here.
      // The useEffect above handles navigation
      // when isAuthenticated becomes true.
    } catch (error) {
      setError('Unable to log in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;