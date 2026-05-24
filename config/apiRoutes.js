/** All API routes — used by GET /api documentation */
module.exports = {
  baseUrl: '/api',
  endpoints: [
    { method: 'GET', path: '/api', description: 'List all API endpoints' },
    { method: 'GET', path: '/api/health', description: 'Health check' },
    { method: 'POST', path: '/api/auth/register', description: 'Register (student or organizer)', auth: false },
    { method: 'POST', path: '/api/auth/login', description: 'Login', auth: false },
    { method: 'GET', path: '/api/auth/me', description: 'Current user profile', auth: true },
    { method: 'GET', path: '/api/events', description: 'List events (?category, ?status, ?search)', auth: false },
    { method: 'GET', path: '/api/events/:id', description: 'Get one event', auth: false },
    { method: 'POST', path: '/api/events', description: 'Create event + image upload', auth: 'organizer|admin' },
    { method: 'PUT', path: '/api/events/:id', description: 'Update event + image upload', auth: 'organizer|admin' },
    { method: 'DELETE', path: '/api/events/:id', description: 'Delete event', auth: 'organizer|admin' },
    { method: 'GET', path: '/api/registrations/my', description: 'My event registrations', auth: true },
    { method: 'POST', path: '/api/registrations/:eventId', description: 'Register for event', auth: true },
    { method: 'DELETE', path: '/api/registrations/:eventId', description: 'Cancel registration', auth: true },
    { method: 'GET', path: '/api/registrations/event/:eventId', description: 'List attendees', auth: 'organizer|admin' },
  ],
};
