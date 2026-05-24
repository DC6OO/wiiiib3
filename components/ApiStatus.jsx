import { useEffect, useState } from 'react';
import { checkApiHealth } from '../api/services';
import { API_BASE_URL } from '../api/config';

export default function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkApiHealth()
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, []);

  if (status === 'checking') return null;

  return (
    <span
      className={`api-status api-status-${status}`}
      title={status === 'online' ? `API connected (${API_BASE_URL})` : 'Start backend: cd backend && npm run dev'}
    >
      API {status === 'online' ? '● Online' : '○ Offline'}
    </span>
  );
}
