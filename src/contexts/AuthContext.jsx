import {
  createContext,
  useContext,
  useState,
} from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}

export function AuthProvider({ children }) {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  // LOGIN
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
        // Save the user's name and CSRF token
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
          'Authentication failed',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    // If there is no token, the user is already logged out.
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

      // Treat non-2xx responses as logout failures.
      if (!response.ok) {
        let errorMessage = 'Logout failed';

        try {
          const data = await response.json();

          errorMessage =
            data?.message ||
            errorMessage;
        } catch {
          // Response was not JSON.
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error during logout',
      };
    } finally {
      // Always clear local authentication state.
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