import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelRegistration, getMyRegistrations } from '../api/services';

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRegistrations()
      .then(setRegistrations)
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (eventId) => {
    await cancelRegistration(eventId);
    setRegistrations((prev) => prev.filter((r) => r.event.id !== eventId));
  };

  if (loading) return <div className="container page-center"><div className="spinner" /></div>;

  return (
    <div className="container">
      <h1>My Registrations</h1>
      {registrations.length === 0 ? (
        <div className="empty-state card">
          <p>You have not registered for any events yet.</p>
          <Link to="/" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((reg) => (
            <article key={reg.id} className="card registration-item">
              <div>
                <span className="event-category">{reg.event.category}</span>
                <h3>{reg.event.title}</h3>
                <p className="text-muted">📍 {reg.event.location}</p>
                <p className="text-muted">🗓 {new Date(reg.event.startDate).toLocaleString()}</p>
              </div>
              <div className="registration-actions">
                <Link to={`/events/${reg.event.id}`} className="btn btn-ghost">View</Link>
                {reg.event.status === 'upcoming' && (
                  <button type="button" className="btn btn-danger" onClick={() => cancel(reg.event.id)}>
                    Cancel
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
