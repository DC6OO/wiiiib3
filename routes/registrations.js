const express = require('express');
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.registered_at,
        e.id AS event_id, e.title, e.category, e.location, e.start_date, e.end_date, e.image_url, e.status
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = $1
       ORDER BY e.start_date ASC`,
      [req.user.id]
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        registeredAt: row.registered_at,
        event: {
          id: row.event_id,
          title: row.title,
          category: row.category,
          location: row.location,
          startDate: row.start_date,
          endDate: row.end_date,
          imageUrl: row.image_url,
          status: row.status,
        },
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const event = await pool.query('SELECT organizer_id FROM events WHERE id = $1', [req.params.eventId]);
    if (!event.rows[0]) return res.status(404).json({ message: 'Event not found' });

    const canView =
      req.user.role === 'admin' || event.rows[0].organizer_id === req.user.id;

    if (!canView) return res.status(403).json({ message: 'Not allowed to view attendees' });

    const result = await pool.query(
      `SELECT r.id, r.registered_at, u.full_name, u.email
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1
       ORDER BY r.registered_at DESC`,
      [req.params.eventId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch attendees' });
  }
});

router.post('/:eventId', authenticate, async (req, res) => {
  try {
    const eventResult = await pool.query(
      `SELECT e.*, (SELECT COUNT(*)::int FROM registrations r WHERE r.event_id = e.id) AS count
       FROM events e WHERE e.id = $1`,
      [req.params.eventId]
    );

    const event = eventResult.rows[0];
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status === 'cancelled' || event.status === 'completed') {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }
    if (event.count >= event.max_attendees) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const existing = await pool.query(
      'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2',
      [req.user.id, req.params.eventId]
    );
    if (existing.rows[0]) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }

    const result = await pool.query(
      `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *`,
      [req.user.id, req.params.eventId]
    );

    res.status(201).json({
      message: 'Registered successfully',
      registration: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.delete('/:eventId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING id',
      [req.user.id, req.params.eventId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
});

module.exports = router;
