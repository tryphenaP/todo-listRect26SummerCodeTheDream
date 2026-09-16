import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      const result = await logout();
      if (!result.success) {
        setLogoutError(result.error);
      }
    } catch (err) {
      setLogoutError(`Error: ${err.name} | ${err.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header>
      <h1>Todo List</h1>
      {isAuthenticated && (
        <div>
          {logoutError && (
            <p style={{ color: 'red' }}>{logoutError}</p>
          )}
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
