const pool = require('../config/db');

async function updateUsername() {
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE username = $2',
      ['DENTAL', 'DENTAL CLINIC']
    );
    console.log('Username updated successfully from "DENTAL CLINIC" to "DENTAL"');
    console.log(`${result.rowCount} row(s) affected`);
  } catch (err) {
    console.error('Error updating username:', err);
  } finally {
    process.exit(0);
  }
}

updateUsername(); 