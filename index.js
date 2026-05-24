const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const apiRoutes = require('./config/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(null, allowedOrigins[0]);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api', (_req, res) => {
  res.json({
    name: 'ZUT Event Management API',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: apiRoutes.endpoints,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ZUT Event Management API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message || 'File upload error' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
