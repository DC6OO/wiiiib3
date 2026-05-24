import { useState } from 'react';

const CATEGORIES = ['Academic', 'Sports', 'Cultural', 'Career Fair', 'Workshop', 'Social', 'Other'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export default function EventForm({ initial = {}, onSubmit, submitLabel = 'Save Event' }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    category: initial.category || 'Academic',
    location: initial.location || '',
    startDate: initial.startDate ? initial.startDate.slice(0, 16) : '',
    endDate: initial.endDate ? initial.endDate.slice(0, 16) : '',
    maxAttendees: initial.maxAttendees || 100,
    status: initial.status || 'upcoming',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      await onSubmit(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Event Title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location (Campus venue)</label>
        <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Main Auditorium" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date & Time</label>
          <input type="datetime-local" id="startDate" name="startDate" value={form.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date & Time</label>
          <input type="datetime-local" id="endDate" name="endDate" value={form.endDate} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="maxAttendees">Max Attendees</label>
          <input type="number" id="maxAttendees" name="maxAttendees" min={1} value={form.maxAttendees} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Event Image</label>
          <input type="file" id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
