const bcrypt = require('bcrypt');
const db = require('../config/db');

async function seedAdmin() {
  const username = 'DENTAL';
  const password = 'admin123';
  const role = 'admin';
  const password_hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      [username, password_hash, role]
    );
    console.log('Admin user seeded successfully.');
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    await db.pool.end();
  }
}

seedAdmin(); 