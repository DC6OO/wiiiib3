import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiStatus from './ApiStatus';
import AnimatedBackground from './AnimatedBackground';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <AnimatedBackground />
      <div className="app-content">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">📅</span>
            ZUT Events
          </Link>
          <nav className="nav">
            <Link to="/">Events</Link>
            {user && <Link to="/my-registrations">My Registrations</Link>}
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to="/events/new">Create Event</Link>
            )}
          </nav>
          <div className="header-actions">
            <ApiStatus />
            {user ? (
              <>
                <span className="user-badge">{user.fullName}</span>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>Zambia University of Technology — Event Management System</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
