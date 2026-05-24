import { Link } from 'react-router-dom';

const statusColors = {
  upcoming: 'badge-upcoming',
  ongoing: 'badge-ongoing',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function EventCard({ event }) {
  const spotsLeft = event.maxAttendees - event.registrationCount;
  const imageSrc = event.imageUrl || '/placeholder-event.svg';

  return (
    <article className="event-card">
      <div className="event-card-image">
        <img src={imageSrc} alt={event.title} onError={(e) => { e.target.src = '/placeholder-event.svg'; }} />
        <span className={`badge ${statusColors[event.status]}`}>{event.status}</span>
      </div>
      <div className="event-card-body">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="event-meta">📍 {event.location}</p>
        <p className="event-meta">🗓 {new Date(event.startDate).toLocaleString()}</p>
        <p className="event-spots">
          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
        </p>
        <Link to={`/events/${event.id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </article>
  );
}
