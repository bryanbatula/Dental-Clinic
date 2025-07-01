const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async findByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  },
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

module.exports = User; 