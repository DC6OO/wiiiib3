# ZUT University Event Management System

Full-stack web application for **Zambia University of Technology** — manage campus events, student registrations, and organizer workflows.

Built for the Full-Stack Web Development final course project using **React.js**, **Express.js**, and **PostgreSQL**.

## Features (Assignment Requirements)

| Requirement | Implementation |
|-------------|----------------|
| User Authentication | Register, login, JWT sessions, roles (student / organizer / admin) |
| CRUD Operations | Create, read, update, delete events |
| PostgreSQL Database | Users, events, registrations tables with relations |
| Express.js API | REST API under `/api` |
| File Upload | Event poster images via Multer (`/uploads`) |
| Responsive React UI | Mobile-friendly layout with Vite + React Router |

## Project Structure

```
dc/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── db/       # PostgreSQL schema & init
│   │   ├── routes/   # auth, events, registrations
│   │   └── middleware/
│   └── uploads/      # Uploaded event images
└── frontend/         # React.js (Vite)
    └── src/
        ├── pages/
        ├── components/
        └── context/
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) 14+

## Setup Instructions

### 1. Create PostgreSQL database

```sql
CREATE DATABASE zut_events;
```

### 2. Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and set your database connection:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/zut_events
JWT_SECRET=your-long-random-secret-key
```

Initialize tables and demo admin:

```bash
npm run db:init
npm run dev
```

API runs at **http://localhost:5000**

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@zut.ac.zm | Admin@123 |

Register new accounts as **Student** or **Organizer** from the Register page.

## API (built into this project)

The API lives in `backend/` — no external download needed.

- **Start API:** `cd backend && npm run dev`
- **View all routes:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health
- **Full reference:** see [API.md](./API.md)

Frontend API code: `frontend/src/api/config.js`, `services.js`, `client.js`

## Presentation Demo Flow

1. Login as admin or register as organizer
2. Create an event with image, location, and capacity
3. Register as a student and sign up for the event
4. Show My Registrations and attendee list (organizer view)
5. Edit or delete an event (CRUD demo)

## Submission

**Deadline:** 29 May 2026

Ensure PostgreSQL is running and both servers are started before your presentation.
