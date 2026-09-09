import {useEffect} from 'react';
import { useAuth } from '../contexts/auth.js';
import { useNavigate } from 'react-router';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

export default HomePage;
    