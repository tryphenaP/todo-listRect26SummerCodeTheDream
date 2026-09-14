import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className={styles.notFoundPage}>
      <div className={styles.notFoundCard}>
        <h1 className={styles.title}>
          404 - Page Not Found
        </h1>

        <p className={styles.message}>
          Oops! The page you are looking for does not exist.
        </p>

        <p className={styles.message}>
          You can navigate back to:
        </p>

        <nav className={styles.navigation}>
          <ul className={styles.linkList}>
            <li>
              <Link
                className={styles.link}
                to="/"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                className={styles.link}
                to="/about"
              >
                About
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    className={styles.link}
                    to="/todos"
                  >
                    Todo List
                  </Link>
                </li>

                <li>
                  <Link
                    className={styles.link}
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  className={styles.link}
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </main>
  );
}

export default NotFoundPage;