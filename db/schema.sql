-- ZUT University Event Management System
-- Run: npm run db:init (or psql -f src/db/schema.sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'organizer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  location VARCHAR(200) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  max_attendees INTEGER NOT NULL DEFAULT 100,
  image_url VARCHAR(500),
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
