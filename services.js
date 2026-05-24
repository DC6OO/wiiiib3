import api from './client';
import { API_ENDPOINTS } from './config';

function ensureArray(data, label = 'data') {
  if (Array.isArray(data)) return data;
  throw new Error(`Invalid API response for ${label}. Is the backend running?`);
}

/** Check if the Express API is running */
export async function checkApiHealth() {
  const { data } = await api.get(API_ENDPOINTS.health);
  return data;
}

// ——— Auth ———
export async function loginUser(email, password) {
  const { data } = await api.post(API_ENDPOINTS.auth.login, { email, password });
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post(API_ENDPOINTS.auth.register, payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get(API_ENDPOINTS.auth.me);
  return data;
}

// ——— Events ———
export async function getEvents(params = {}) {
  const { data } = await api.get(API_ENDPOINTS.events.list, { params });
  return ensureArray(data, 'events');
}

export async function getEventById(id) {
  const { data } = await api.get(API_ENDPOINTS.events.byId(id));
  return data;
}

export async function createEvent(formData) {
  const { data } = await api.post(API_ENDPOINTS.events.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateEvent(id, formData) {
  const { data } = await api.put(API_ENDPOINTS.events.update(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteEvent(id) {
  const { data } = await api.delete(API_ENDPOINTS.events.delete(id));
  return data;
}

// ——— Registrations ———
export async function getMyRegistrations() {
  const { data } = await api.get(API_ENDPOINTS.registrations.my);
  return ensureArray(data, 'registrations');
}

export async function getEventAttendees(eventId) {
  const { data } = await api.get(API_ENDPOINTS.registrations.byEvent(eventId));
  return data;
}

export async function registerForEvent(eventId) {
  const { data } = await api.post(API_ENDPOINTS.registrations.register(eventId));
  return data;
}

export async function cancelRegistration(eventId) {
  const { data } = await api.delete(API_ENDPOINTS.registrations.cancel(eventId));
  return data;
}
