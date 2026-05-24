import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p className="text-muted">Sign in to manage and register for events</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="auth-footer">
          No account? <Link to="/register">Register here</Link>
        </p>
        <p className="demo-hint">Demo admin: admin@zut.ac.zm / Admin@123</p>
      </form>
    </div>
  );
}
