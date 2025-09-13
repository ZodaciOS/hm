const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rate limiting for /validate endpoint
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});

app.post('/api/validate', limiter, async (req, res) => {
  const { key } = req.body;
  try {
    const result = await pool.query('SELECT * FROM keys WHERE key = $1 AND revoked = false', [key]);
    if (result.rows.length === 0) return res.json({ valid: false, message: 'shut up' });
    
    await pool.query('UPDATE keys SET revoked = true WHERE key = $1', [key]);
    return res.json({ valid: true, message: 'hello there' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin middleware
async function auth(req, res, next) {
  const { password } = req.body;
  const hash = await bcrypt.hash(process.env.DASHBOARD_PASS, 10);
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(403).json({ error: 'Unauthorized' });
  next();
}

// Add key
app.post('/api/dashboard/add', auth, async (req, res) => {
  const { key } = req.body;
  await pool.query('INSERT INTO keys (key, revoked) VALUES ($1, false)', [key]);
  res.json({ success: true });
});

// Revoke key
app.post('/api/dashboard/revoke', auth, async (req, res) => {
  const { key } = req.body;
  await pool.query('UPDATE keys SET revoked = true WHERE key = $1', [key]);
  res.json({ success: true });
});

// List keys
app.post('/api/dashboard/list', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM keys');
  res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));