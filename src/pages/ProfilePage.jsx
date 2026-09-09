import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth.js';

function ProfilePage() {
  const { email, token } = useAuth();

  
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  async function fetchTodoStats() {
    if (!token) return;

    try {
      setLoading(true);
      setError('');

      const options = {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      };

      const response = await fetch('/api/tasks', options);

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }


     const data = await response.json();

      // Handle either API response shape
      const todos = data.tasks || data;

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
      setError(`Error loading statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  fetchTodoStats();
}, [token]);

  return (
    <div>
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>
        <p>
          <strong>Name:</strong> {email}
        </p>
        <p>
  <strong>Status:</strong> {token ? 'Authenticated' : 'Not Authenticated'}
</p>
      </section>

     <section>
  <h2>Todo Statistics</h2>

  {loading && <p>Loading statistics...</p>}

  {error && (
    <p style={{ color: 'red' }}>
      {error}
    </p>
  )}

  {!loading && !error && (
    <>
      <ul>
        <li>Total Todos: {todoStats.total}</li>
        <li>Completed Todos: {todoStats.completed}</li>
        <li>Active Todos: {todoStats.active}</li>
      </ul>

      {todoStats.total > 0 && (
        <p>
          <strong>Completion Rate:</strong>{' '}
          {Math.round(
            (todoStats.completed / todoStats.total) * 100
          )}
          %
        </p>
      )}
    </>
  )}
</section>
    </div>
  );
}

export default ProfilePage;