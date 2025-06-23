const pool = require('../config/db');

const Client = {
  async getAll() {
    const res = await pool.query('SELECT * FROM clients ORDER BY id DESC');
    return res.rows;
  },
  async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countRes = await pool.query('SELECT COUNT(*) as total FROM clients');
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results
    const res = await pool.query(
      'SELECT * FROM clients ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return {
      clients: res.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return res.rows[0];
  },
  async getWithAppointments(id) {
    const clientRes = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    const appointmentsRes = await pool.query(`
      SELECT a.*, s.name as service_name
      FROM appointments a
      JOIN services s ON a.service = s.id
      WHERE a.client_id = $1
      ORDER BY a.appointment_time DESC
    `, [id]);
    
    return {
      client: clientRes.rows[0],
      appointments: appointmentsRes.rows
    };
  },
  async create(data) {
    const { name, email, phone, dob, address, medicalHistory, notes } = data;
    const res = await pool.query(
      'INSERT INTO clients (name, email, phone, dob, address, medical_history, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, dob || null, address || null, medicalHistory || null, notes || null]
    );
    return res.rows[0];
  },
  async update(id, data) {
    const { name, email, phone, dob, address, medicalHistory, notes } = data;
    const res = await pool.query(
      'UPDATE clients SET name = $1, email = $2, phone = $3, dob = $4, address = $5, medical_history = $6, notes = $7 WHERE id = $8 RETURNING *',
      [name, email, phone, dob || null, address || null, medicalHistory || null, notes || null, id]
    );
    return res.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    return true;
  },
};

module.exports = Client; 