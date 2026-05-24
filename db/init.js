const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./pool');

async function init() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  let sql = fs.readFileSync(schemaPath, 'utf8');

  // Remove placeholder admin insert from schema; seed properly below
  sql = sql.replace(
    /-- Demo admin[\s\S]*?ON CONFLICT \(email\) DO NOTHING;/,
    ''
  );

  await pool.query(sql);

  const adminHash = await bcrypt.hash('Admin@123', 10);
  await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    ['System Admin', 'admin@zut.ac.zm', adminHash]
  );

  console.log('Database initialized successfully.');
  console.log('Demo admin: admin@zut.ac.zm / Admin@123');
  await pool.end();
}

init().catch((err) => {
  console.error('Database init failed:', err.message);
  process.exit(1);
});
