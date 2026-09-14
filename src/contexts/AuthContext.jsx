import { useState } from 'react';
import { AuthContext } from './authContextDef.js';

export function AuthProvider({ children }) {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  const login = async (userEmail, password) => {
    try {
      const response = await fetch(
        '/api/users/logon',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: userEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (
        response.status === 200 &&
        data.name &&
        data.csrfToken
      ) {
        setName(data.name);
        setToken(data.csrfToken);

        return {
          success: true,
        };
      }

      return {
        success: false,
        error:
          data?.message ||
          'Authentication failed. Please check your credentials.',
      };
    } catch {
      return {
        success: false,
        error: 'Unable to connect to login service. Please try again later.',
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setName('');
      setToken('');

      return {
        success: true,
      };
    }

    try {
      const response = await fetch(
        '/api/users/logoff',
        {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        let errorMessage = 'Unable to log out';

        try {
          const data = await response.json();
          errorMessage = data?.message || errorMessage;
        } catch {
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: 'Network error occurred during logout.',
      };
    } finally {
      setName('');
      setToken('');
    }
  };

  const value = {
    name,
    token,
    isAuthenticated: Boolean(token),
    loading: false,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}