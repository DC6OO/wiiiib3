const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Only image files are allowed'), ext && mime);
  },
});

function mapEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    startDate: row.start_date,
    endDate: row.end_date,
    maxAttendees: row.max_attendees,
    imageUrl: row.image_url,
    status: row.status,
    organizerId: row.organizer_id,
    organizerName: row.organizer_name,
    registrationCount: Number(row.registration_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const eventSelect = `
  SELECT e.*, u.full_name AS organizer_name,
    (SELECT COUNT(*)::int FROM registrations r WHERE r.event_id = e.id) AS registration_count
  FROM events e
  JOIN users u ON u.id = e.organizer_id
`;

router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = `${eventSelect} WHERE 1=1`;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND e.category = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND e.status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
    }

    query += ' ORDER BY e.start_date ASC';
    const result = await pool.query(query, params);
    res.json(result.rows.map(mapEvent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`${eventSelect} WHERE e.id = $1`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Event not found' });
    res.json(mapEvent(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

router.post('/', authenticate, authorize('organizer', 'admin'), upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, startDate, endDate, maxAttendees, status } = req.body;
    if (!title || !description || !category || !location || !startDate || !endDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const organizerId = req.user.role === 'admin' && req.body.organizerId
      ? req.body.organizerId
      : req.user.id;

    const result = await pool.query(
      `INSERT INTO events (title, description, category, location, start_date, end_date, max_attendees, image_url, status, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        description,
        category,
        location,
        startDate,
        endDate,
        maxAttendees || 100,
        imageUrl,
        status || 'upcoming',
        organizerId,
      ]
    );

    const full = await pool.query(`${eventSelect} WHERE e.id = $1`, [result.rows[0].id]);
    res.status(201).json(mapEvent(full.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Event not found' });

    const event = existing.rows[0];
    const canEdit =
      req.user.role === 'admin' ||
      (req.user.role === 'organizer' && event.organizer_id === req.user.id);

    if (!canEdit) return res.status(403).json({ message: 'Not allowed to edit this event' });

    const { title, description, category, location, startDate, endDate, maxAttendees, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : event.image_url;

    await pool.query(
      `UPDATE events SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        location = COALESCE($4, location),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        max_attendees = COALESCE($7, max_attendees),
        image_url = $8,
        status = COALESCE($9, status),
        updated_at = NOW()
       WHERE id = $10`,
      [title, description, category, location, startDate, endDate, maxAttendees, imageUrl, status, req.params.id]
    );

    const full = await pool.query(`${eventSelect} WHERE e.id = $1`, [req.params.id]);
    res.json(mapEvent(full.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Event not found' });

    const event = existing.rows[0];
    const canDelete =
      req.user.role === 'admin' ||
      (req.user.role === 'organizer' && event.organizer_id === req.user.id);

    if (!canDelete) return res.status(403).json({ message: 'Not allowed to delete this event' });

    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router;
