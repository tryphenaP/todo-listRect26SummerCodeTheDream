import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        // API returns the todos inside data.tasks.
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
      } catch (err) {
        setError(
          `Error loading statistics: ${err.message}`
        );
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
    <main>
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>

        <p>
          <strong>Name:</strong>{' '}
          {name || 'Unknown'}
        </p>

        <p>
          <strong>Status:</strong>{' '}
          {token
            ? 'Authenticated'
            : 'Not Authenticated'}
        </p>
      </section>

      <section>
        <h2>Todo Statistics</h2>

        {loading && (
          <p>Loading statistics...</p>
        )}

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <ul>
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

            <p>
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