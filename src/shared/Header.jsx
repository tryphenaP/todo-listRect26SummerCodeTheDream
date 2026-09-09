import { useAuth } from '../contexts/auth.js';
import Navigation from './Navigation';

function Header() {
    const { isAuthenticated , logout } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>
      <Navigation />
      {isAuthenticated && (

        <button onClick={logout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;