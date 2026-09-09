import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.js';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');
  
  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }
  
  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="button" onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging off...' : 'Logout'}
      </button>
    </>
  );
}

export default Logoff;