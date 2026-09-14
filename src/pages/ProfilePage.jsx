import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { name, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();

        const todos = Array.isArray(data.tasks)
          ? data.tasks
          : Array.isArray(data)
            ? data
            : [];

        const total = todos.length;

        const completed = todos.filter(
          (todo) => todo.isCompleted
        ).length;

        const active = total - completed;

        setTodoStats({
          total,
          completed,
          active,
        });
      } catch {
        setError('Unable to load statistics at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionRate =
    todoStats.total > 0
      ? Math.round(
          (todoStats.completed / todoStats.total) * 100
        )
      : 0;

  return (
    <main className={styles.profilePage}>
      <h1 className={styles.title}>Profile</h1>

      <section className={styles.section}>
        <h2 className={styles.heading}>
          User Information
        </h2>

        <p className={styles.info}>
          <strong>Name:</strong>{' '}
          {name || 'Unknown'}
        </p>

        <p className={styles.info}>
          <strong>Status:</strong>{' '}
          {token
            ? 'Authenticated'
            : 'Not Authenticated'}
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>
          Todo Statistics
        </h2>

        {loading && (
          <p className={styles.loading} role="status">
            Loading statistics...
          </p>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <ul className={styles.statsList}>
              <li>
                Total Todos: {todoStats.total}
              </li>

              <li>
                Completed Todos:{' '}
                {todoStats.completed}
              </li>

              <li>
                Active Todos: {todoStats.active}
              </li>
            </ul>

            <p className={styles.completionRate}>
              <strong>Completion Rate:</strong>{' '}
              {completionRate}%
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;