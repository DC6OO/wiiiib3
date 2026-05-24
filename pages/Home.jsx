import { useEffect, useState } from 'react';
import { getEvents } from '../api/services';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Academic', 'Sports', 'Cultural', 'Career Fair', 'Workshop', 'Social', 'Other'];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const params = {};
    if (category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();

    setLoading(true);
    setError('');
    getEvents(params)
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => {
        setError(err.message || err.response?.data?.message || 'Cannot reach API. Deploy backend or run it locally.');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="container">
      <section className="hero">
        <h1>University Events</h1>
        <p>Discover, register for, and manage campus events at Zambia University of Technology.</p>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="filters card">
        <input
          type="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? 'chip-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="page-center"><div className="spinner" /></div>
      ) : events.length === 0 ? (
        <div className="empty-state card">
          <p>No events found. Check back later or create one if you are an organizer.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

