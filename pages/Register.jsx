import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="text-muted">Join ZUT Events to register for campus activities</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} minLength={6} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student — register for events</option>
            <option value="organizer">Organizer — create & manage events</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
