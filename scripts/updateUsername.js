const pool = require('../config/db');

async function updateUsername() {
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE username = $2',
      ['DINDENTAL', 'admin']
    );
    console.log('Username updated successfully from "admin" to "DINDENTAL"');
    console.log(`${result.rowCount} row(s) affected`);
  } catch (err) {
    console.error('Error updating username:', err);
  } finally {
    process.exit(0);
  }
}

updateUsername(); 