import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  cancelRegistration,
  deleteEvent,
  getEventAttendees,
  getEventById,
  getMyRegistrations,
  registerForEvent,
} from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const canManage =
    user && (user.role === 'admin' || (user.role === 'organizer' && event?.organizerId === user.id));

  const loadEvent = () => getEventById(id).then(setEvent);

  useEffect(() => {
    setLoading(true);
    const requests = [loadEvent()];
    if (user) {
      requests.push(
        getMyRegistrations().then((regs) => {
          setRegistered(regs.some((r) => r.event.id === id));
        })
      );
    }
    Promise.all(requests)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  useEffect(() => {
    if (canManage) {
      getEventAttendees(id).then(setAttendees).catch(() => {});
    }
  }, [canManage, id]);

  const handleRegister = async () => {
    try {
      await registerForEvent(id);
      setRegistered(true);
      setMessage('Successfully registered!');
      loadEvent();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleUnregister = async () => {
    try {
      await cancelRegistration(id);
      setRegistered(false);
      setMessage('Registration cancelled');
      loadEvent();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event permanently?')) return;
    await deleteEvent(id);
    navigate('/');
  };

  if (loading || !event) {
    return <div className="container page-center"><div className="spinner" /></div>;
  }

  const spotsLeft = event.maxAttendees - event.registrationCount;
  const imageSrc = event.imageUrl || '/placeholder-event.svg';

  return (
    <div className="container">
      <div className="event-detail card">
        <div className="event-detail-header">
          <img src={imageSrc} alt={event.title} onError={(e) => { e.target.src = '/placeholder-event.svg'; }} />
          <div>
            <span className="event-category">{event.category}</span>
            <h1>{event.title}</h1>
            <p className="text-muted">Organized by {event.organizerName}</p>
            <span className={`badge badge-${event.status}`}>{event.status}</span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>

        <div className="detail-grid">
          <div><strong>Location</strong><p>{event.location}</p></div>
          <div><strong>Starts</strong><p>{new Date(event.startDate).toLocaleString()}</p></div>
          <div><strong>Ends</strong><p>{new Date(event.endDate).toLocaleString()}</p></div>
          <div><strong>Capacity</strong><p>{event.registrationCount} / {event.maxAttendees} ({spotsLeft} left)</p></div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="detail-actions">
          {user?.role === 'student' && event.status === 'upcoming' && (
            registered ? (
              <button type="button" className="btn btn-ghost" onClick={handleUnregister}>Cancel Registration</button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleRegister} disabled={spotsLeft <= 0}>
                {spotsLeft > 0 ? 'Register for Event' : 'Fully Booked'}
              </button>
            )
          )}
          {!user && (
            <Link to="/login" className="btn btn-primary">Login to Register</Link>
          )}
          {canManage && (
            <>
              <Link to={`/events/${id}/edit`} className="btn btn-ghost">Edit Event</Link>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      {canManage && attendees.length > 0 && (
        <section className="card attendees-section">
          <h2>Registered Attendees ({attendees.length})</h2>
          <ul className="attendee-list">
            {attendees.map((a) => (
              <li key={a.id}>
                <strong>{a.full_name}</strong> — {a.email}
                <span className="text-muted">{new Date(a.registered_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
