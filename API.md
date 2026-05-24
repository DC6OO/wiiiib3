# ZUT Event Management — API Reference

Your API is **built into the project** at `backend/`. Start it with:

```powershell
cd backend
npm run dev
```

Base URL: **http://localhost:5000/api**

View all routes in the browser: **http://localhost:5000/api**

## Frontend connection

| File | Purpose |
|------|---------|
| `frontend/src/api/config.js` | API URL and endpoint paths |
| `frontend/src/api/client.js` | Axios HTTP client |
| `frontend/src/api/services.js` | All API functions used by React |

The header shows **API ● Online** when the backend is running.

## Endpoints

### Auth
| Method | Path | Body |
|--------|------|------|
| POST | `/api/auth/register` | `{ fullName, email, password, role? }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | Header: `Authorization: Bearer <token>` |

### Events
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/events` | Query: `category`, `status`, `search` |
| GET | `/api/events/:id` | Single event |
| POST | `/api/events` | `multipart/form-data` + image (organizer/admin) |
| PUT | `/api/events/:id` | Update (organizer/admin) |
| DELETE | `/api/events/:id` | Delete (organizer/admin) |

### Registrations
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/registrations/my` | Logged-in user's registrations |
| POST | `/api/registrations/:eventId` | Register for event |
| DELETE | `/api/registrations/:eventId` | Cancel registration |
| GET | `/api/registrations/event/:eventId` | Attendee list (organizer/admin) |

### System
| Method | Path |
|--------|------|
| GET | `/api` | API documentation JSON |
| GET | `/api/health` | Health check |
