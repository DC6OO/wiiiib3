/**
 * API configuration — points React to your Express backend.
 * Development: Vite proxy sends /api → http://localhost:5000
 * Production: set VITE_API_URL in .env (e.g. https://your-server.com/api)
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
  },
  events: {
    list: '/events',
    byId: (id) => `/events/${id}`,
    create: '/events',
    update: (id) => `/events/${id}`,
    delete: (id) => `/events/${id}`,
  },
  registrations: {
    my: '/registrations/my',
    byEvent: (eventId) => `/registrations/event/${eventId}`,
    register: (eventId) => `/registrations/${eventId}`,
    cancel: (eventId) => `/registrations/${eventId}`,
  },
};
