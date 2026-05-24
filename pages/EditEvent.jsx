import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, updateEvent } from '../api/services';
import EventForm from '../components/EventForm';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then(setEvent)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    await updateEvent(id, formData);
    navigate(`/events/${id}`);
  };

  if (!event) return <div className="container page-center"><div className="spinner" /></div>;

  return (
    <div className="container narrow">
      <h1>Edit Event</h1>
      <EventForm initial={event} onSubmit={handleSubmit} submitLabel="Update Event" />
    </div>
  );
}
