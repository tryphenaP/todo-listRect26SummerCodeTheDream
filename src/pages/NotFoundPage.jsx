import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>

      <p>Oops! The page you are looking for does not exist.</p>

      <p>You can navigate back to:</p>

      <div style={{ marginTop: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/todos">Todo List</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NotFoundPage;