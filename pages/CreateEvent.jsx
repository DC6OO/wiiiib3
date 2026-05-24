import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/services';
import EventForm from '../components/EventForm';

export default function CreateEvent() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const event = await createEvent(formData);
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="container narrow">
      <h1>Create New Event</h1>
      <p className="text-muted">Publish a campus event for students to discover and register.</p>
      <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
    </div>
  );
}
