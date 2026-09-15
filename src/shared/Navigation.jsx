import { NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import styles from './Navigation.module.css';

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={styles.navigation}>
      <ul className={styles.linkList}>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/todos"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.active}`
                    : styles.link
                }
              >
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.active}`
                    : styles.link
                }
              >
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;